/**
 * POST /api/snowflake/migrate
 * Runs one-time DDL migrations (create views, etc.)
 * Protected by admin secret header: x-admin-secret
 */

import { NextRequest, NextResponse } from 'next/server';
import { executeQuery } from '@/lib/snowflake';
import { CREATE_LTV_VIEW_SQL } from '@/lib/snowflake-queries';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-admin-secret');
  if (!secret || secret !== process.env.ADMIN_MIGRATE_SECRET) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { migration } = await request.json();

    let sql: string;
    if (migration === 'ltv_view') {
      sql = CREATE_LTV_VIEW_SQL;
    } else {
      return NextResponse.json({ success: false, error: `Unknown migration: ${migration}` }, { status: 400 });
    }

    // Allow CREATE statements in migrate route by bypassing the executeQuery guard
    // We use the raw connection pattern since CREATE is blocked by the guard
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
          conn.execute({
            sqlText: sql,
            complete: (execErr) => {
              conn.destroy(() => {});
              if (execErr) resolve({ success: false, error: execErr.message });
              else resolve({ success: true, message: `Migration "${migration}" applied successfully.` });
            },
          });
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
