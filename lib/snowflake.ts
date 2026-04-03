/**
 * ICONYCS Snowflake Connection Module
 * Server-side only — never imported in client components
 * 
 * Provides secure connection pooling and query execution
 * against the PROPERTYANALYTICS database.
 */

import snowflake from 'snowflake-sdk';

// Connection configuration from environment variables
const connectionConfig = {
  account: process.env.SNOWFLAKE_ACCOUNT!,
  username: process.env.SNOWFLAKE_USER!,
  password: process.env.SNOWFLAKE_PASSWORD!,
  warehouse: process.env.SNOWFLAKE_WAREHOUSE || 'COMPUTE_WH',
  database: process.env.SNOWFLAKE_DATABASE || 'PROPERTYANALYTICS',
  schema: process.env.SNOWFLAKE_SCHEMA || 'PUBLIC',
  role: process.env.SNOWFLAKE_ROLE || 'ACCOUNTADMIN',
  clientSessionKeepAlive: true,
  clientSessionKeepAliveHeartbeatFrequency: 3600,
};

// Allowed tables/views — security whitelist
const ALLOWED_OBJECTS = new Set([
  'VW_PROP_SAMPLE',
  'VW_PROP_SAMPLE2',
  'VW_NARC3_SAMPLE',
]);

// Basic SQL injection guard — blocks dangerous patterns
function validateSQL(sql: string): boolean {
  const normalized = sql.toUpperCase().trim();
  
  // Only allow SELECT statements
  if (!normalized.startsWith('SELECT')) {
    return false;
  }
  
  // Block dangerous operations
  const blocked = ['DROP', 'DELETE', 'INSERT', 'UPDATE', 'ALTER', 'CREATE', 'TRUNCATE', 'EXEC', 'EXECUTE', '--', ';'];
  for (const keyword of blocked) {
    // Allow keywords in string literals but not as SQL commands
    if (normalized.includes(keyword) && !normalized.includes(`'${keyword}`)) {
      // More nuanced: check if it's a standalone command (not inside quotes)
      const outsideQuotes = normalized.replace(/'[^']*'/g, '');
      if (outsideQuotes.includes(keyword)) {
        return false;
      }
    }
  }
  
  return true;
}

// Execute a query against Snowflake
export async function executeQuery(sql: string): Promise<{
  success: boolean;
  data?: Record<string, any>[];
  columns?: string[];
  rowCount?: number;
  error?: string;
  executionTime?: number;
}> {
  // Validate the SQL first
  if (!validateSQL(sql)) {
    return { success: false, error: 'Query rejected: only SELECT statements are allowed.' };
  }
  
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    const connection = snowflake.createConnection(connectionConfig);
    
    connection.connect((err) => {
      if (err) {
        resolve({
          success: false,
          error: `Snowflake connection error: ${err.message}`,
        });
        return;
      }
      
      connection.execute({
        sqlText: sql,
        complete: (err, stmt, rows) => {
          const executionTime = Date.now() - startTime;
          
          // Clean up connection
          connection.destroy((destroyErr) => {
            if (destroyErr) console.error('Connection cleanup error:', destroyErr);
          });
          
          if (err) {
            resolve({
              success: false,
              error: `SQL execution error: ${err.message}`,
              executionTime,
            });
            return;
          }
          
          // Extract column names from the statement
          const columns = stmt?.getColumns()?.map((col: any) => col.getName()) || [];
          
          resolve({
            success: true,
            data: rows || [],
            columns,
            rowCount: rows?.length || 0,
            executionTime,
          });
        },
      });
    });
  });
}

// Test the Snowflake connection
export async function testConnection(): Promise<{
  success: boolean;
  message: string;
  details?: {
    account: string;
    warehouse: string;
    database: string;
    schema: string;
  };
}> {
  return new Promise((resolve) => {
    const connection = snowflake.createConnection(connectionConfig);
    
    connection.connect((err) => {
      if (err) {
        resolve({
          success: false,
          message: `Connection failed: ${err.message}`,
        });
        return;
      }
      
      connection.execute({
        sqlText: 'SELECT CURRENT_TIMESTAMP() AS ts, CURRENT_DATABASE() AS db, CURRENT_SCHEMA() AS schema_name',
        complete: (err, stmt, rows) => {
          connection.destroy(() => {});
          
          if (err) {
            resolve({ success: false, message: `Query test failed: ${err.message}` });
            return;
          }
          
          resolve({
            success: true,
            message: 'Connected successfully',
            details: {
              account: process.env.SNOWFLAKE_ACCOUNT || '',
              warehouse: process.env.SNOWFLAKE_WAREHOUSE || '',
              database: process.env.SNOWFLAKE_DATABASE || '',
              schema: process.env.SNOWFLAKE_SCHEMA || '',
            },
          });
        },
      });
    });
  });
}

// Fetch schema for a table/view
export async function fetchSchema(tableName: string): Promise<{
  success: boolean;
  columns?: Array<{ name: string; type: string; nullable: boolean }>;
  error?: string;
}> {
  if (!ALLOWED_OBJECTS.has(tableName.toUpperCase())) {
    return { success: false, error: `Table "${tableName}" is not in the allowed list.` };
  }
  
  return new Promise((resolve) => {
    const connection = snowflake.createConnection(connectionConfig);
    
    connection.connect((err) => {
      if (err) {
        resolve({ success: false, error: `Connection error: ${err.message}` });
        return;
      }
      
      connection.execute({
        sqlText: `DESCRIBE TABLE ${tableName}`,
        complete: (err, stmt, rows) => {
          connection.destroy(() => {});
          
          if (err) {
            resolve({ success: false, error: `Schema fetch error: ${err.message}` });
            return;
          }
          
          const columns = (rows || []).map((row: any) => ({
            name: row.name,
            type: row.type,
            nullable: row['null?'] === 'Y',
          }));
          
          resolve({ success: true, columns });
        },
      });
    });
  });
}
