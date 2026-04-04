/**
 * POST /api/snowflake/migrate
 * Runs one-time DDL migrations (create views, etc.)
 * Protected by admin secret header: x-admin-secret
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import {
  CREATE_LTV_VIEW_SQL,
  CREATE_CASCADE_PROPERTY_VIEW_SQL,
  CREATE_CASCADE_OWNERSHIP_VIEW_SQL,
  CREATE_LOOKUP_TABLE_SQL,
} from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';
export const maxDuration = 60; // 60 second timeout for Snowflake queries

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  if (!secret || secret !== process.env.ADMIN_MIGRATE_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { migration } = await request.json();

    const MIGRATIONS: Record<string, string | string[]> = {
      ltv_view:      CREATE_LTV_VIEW_SQL,
      cascade_views: [CREATE_CASCADE_PROPERTY_VIEW_SQL, CREATE_CASCADE_OWNERSHIP_VIEW_SQL],
      lookup_tables: CREATE_LOOKUP_TABLE_SQL,
    };

    if (!(migration in MIGRATIONS)) {
      return NextResponse.json(
        { success: false, error: `Unknown migration: ${migration}. Valid: ${Object.keys(MIGRATIONS).join(', ')}` },
        { status: 400 }
      );
    }

    const sqlStatements = Array.isArray(MIGRATIONS[migration])
      ? (MIGRATIONS[migration] as string[])
      : [MIGRATIONS[migration] as string];

    // Allow CREATE/INSERT DDL by using raw snowflake-sdk connection
    const snowflake = (await import('snowflake-sdk')).default;
    const conn = snowflake.createConnection({
      account:   process.env.SNOWFLAKE_ACCOUNT!,
      username:  process.env.SNOWFLAKE_USER!,
      password:  process.env.SNOWFLAKE_PASSWORD!,
      warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'QRY_WAREHOUSE',
      database:  process.env.SNOWFLAKE_DATABASE  || 'PROPERTYANALYTICS',
      schema:    process.env.SNOWFLAKE_SCHEMA    || 'PUBLIC',
    });

    const result = await new Promise<{ success: boolean; message?: string; error?: string }>(
      (resolve) => {
        conn.connect((err) => {
          if (err) { resolve({ success: false, error: err.message }); return; }

          let idx = 0;
          const runNext = () => {
            if (idx >= sqlStatements.length) {
              conn.destroy(() => {});
              resolve({ success: true, message: `Migration "${migration}" applied successfully (${sqlStatements.length} statement(s)).` });
              return;
            }
            conn.execute({
              sqlText: sqlStatements[idx++],
              complete: (execErr) => {
                if (execErr) {
                  conn.destroy(() => {});
                  resolve({ success: false, error: execErr.message });
                } else {
                  runNext();
                }
              },
            });
          };
          runNext();
        });
      }
    );

    return NextResponse.json(result, { status: result.success ? 200 : 500 });
  } catch (err: any) {
    console.error('[/api/snowflake/migrate]', err);
    return NextResponse.json(
      { success: false, error: err?.message ?? 'Internal server error' },
      { status: 500 }
    );
  }
}
