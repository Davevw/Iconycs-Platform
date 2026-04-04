/**
 * ICONYCS Snowflake Connection Module
 * Server-side only — never imported in client components
 */

import snowflake from 'snowflake-sdk';

const connectionConfig = {
  account: process.env.SNOWFLAKE_ACCOUNT!,
  username: process.env.SNOWFLAKE_USER!,
  password: process.env.SNOWFLAKE_PASSWORD!,
  warehouse: 'QRY_WAREHOUSE',
  database: process.env.SNOWFLAKE_DATABASE || 'PROPERTYANALYTICS',
  schema: process.env.SNOWFLAKE_SCHEMA || 'PUBLIC',
  role: process.env.SNOWFLAKE_ROLE || 'PUBLIC',
  clientSessionKeepAlive: true,
};

const ALLOWED_OBJECTS = new Set([
  'VW_PROP_SAMPLE', 'VW_PROP_SAMPLE2', 'VW_NARC3_SAMPLE',
  'VW_RESIDENTIAL_PROP', 'VW_RESIDENTIAL_DEMO',
  'VW_DASHBOARD_NATIONAL', 'VW_DASHBOARD_STATE', 'VW_DASHBOARD_COUNTY',
  'VW_DASHBOARD_CITY', 'VW_DASHBOARD_ZIP',
  'VW_LENDER_ANALYSIS', 'VW_LTV_TIERS', 'VW_BI_PROP',
  'VW_CASCADE_PROPERTY', 'VW_CASCADE_OWNERSHIP',
  'NARC3', 'NACR_MRKTHOMEVAL', 'PROP_MTGLOANCD',
]);

function validateSQL(sql: string): boolean {
  const normalized = sql.toUpperCase().trim();
  if (!normalized.startsWith('SELECT')) return false;
  const blocked = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE'];
  for (const keyword of blocked) {
    const outsideQuotes = normalized.replace(/'[^']*'/g, '');
    if (outsideQuotes.includes(keyword)) return false;
  }
  return true;
}

function runQuery(sql: string): Promise<{ success: boolean; data?: Record<string, any>[]; columns?: string[]; rowCount?: number; error?: string; executionTime?: number }> {
  const startTime = Date.now();
  return new Promise((resolve) => {
    const connection = snowflake.createConnection(connectionConfig);
    connection.connect((err) => {
      if (err) {
        resolve({ success: false, error: `Connection error: ${err.message}` });
        return;
      }
      // Always set warehouse explicitly
      const wh = 'QRY_WAREHOUSE';
      connection.execute({
        sqlText: `USE WAREHOUSE ${wh}`,
        complete: () => {
          connection.execute({
            sqlText: sql,
            complete: (err2, stmt, rows) => {
              connection.destroy(() => {});
              const executionTime = Date.now() - startTime;
              if (err2) {
                resolve({ success: false, error: `SQL execution error: ${err2.message}`, executionTime });
                return;
              }
              const columns = stmt?.getColumns()?.map((col: any) => col.getName()) || [];
              resolve({ success: true, data: rows || [], columns, rowCount: rows?.length || 0, executionTime });
            },
          });
        },
      });
    });
  });
}

export async function executeQuery(sql: string): Promise<{ success: boolean; data?: Record<string, any>[]; columns?: string[]; rowCount?: number; error?: string; executionTime?: number }> {
  if (!validateSQL(sql)) {
    return { success: false, error: 'Query rejected: only SELECT statements are allowed.' };
  }
  return runQuery(sql);
}

// Simple in-memory query cache (5 min TTL)
const queryCache = new Map<string, { data: Record<string, any>[]; ts: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function executeQueryCached(sql: string): Promise<{ success: boolean; data?: Record<string, any>[]; columns?: string[]; rowCount?: number; error?: string; executionTime?: number; fromCache?: boolean }> {
  const cached = queryCache.get(sql);
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return { success: true, data: cached.data, rowCount: cached.data.length, fromCache: true };
  }
  const result = await executeQuery(sql);
  if (result.success && result.data) {
    queryCache.set(sql, { data: result.data, ts: Date.now() });
  }
  return result;
}

export async function testConnection(): Promise<{ success: boolean; message: string; details?: { account: string; warehouse: string; database: string; schema: string } }> {
  const result = await runQuery('SELECT CURRENT_TIMESTAMP() AS ts, CURRENT_DATABASE() AS db, CURRENT_SCHEMA() AS schema_name, CURRENT_WAREHOUSE() AS wh');
  if (!result.success) return { success: false, message: result.error || 'Failed' };
  return {
    success: true,
    message: 'Connected successfully',
    details: {
      account: process.env.SNOWFLAKE_ACCOUNT || 'xp62895.west-us-2.azure',
      warehouse: 'QRY_WAREHOUSE',
      database: process.env.SNOWFLAKE_DATABASE || 'PROPERTYANALYTICS',
      schema: process.env.SNOWFLAKE_SCHEMA || 'PUBLIC',
    },
  };
}

export async function fetchSchema(tableName: string): Promise<{ success: boolean; columns?: Array<{ name: string; type: string; nullable: boolean }>; error?: string }> {
  if (!ALLOWED_OBJECTS.has(tableName.toUpperCase())) {
    return { success: false, error: `Table "${tableName}" is not in the allowed list.` };
  }
  return new Promise((resolve) => {
    const connection = snowflake.createConnection(connectionConfig);
    connection.connect((err) => {
      if (err) { resolve({ success: false, error: `Connection error: ${err.message}` }); return; }
      connection.execute({
        sqlText: `USE WAREHOUSE ${process.env.SNOWFLAKE_WAREHOUSE || 'QRY_WAREHOUSE'}`,
        complete: () => {
          connection.execute({
            sqlText: `DESCRIBE TABLE ${tableName}`,
            complete: (err2, stmt, rows) => {
              connection.destroy(() => {});
              if (err2) { resolve({ success: false, error: `Schema fetch error: ${err2.message}` }); return; }
              const columns = (rows || []).map((row: any) => ({ name: row.name, type: row.type, nullable: row['null?'] === 'Y' }));
              resolve({ success: true, columns });
            },
          });
        },
      });
    });
  });
}



