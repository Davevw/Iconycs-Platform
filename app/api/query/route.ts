/**
 * POST /api/query
 * 
 * The core ICONYCS query pipeline:
 * 1. User sends natural language question
 * 2. Claude Opus 4.6 generates Snowflake SQL (with prompt caching)
 * 3. SQL executes against Snowflake
 * 4. Claude Sonnet 4.6 interprets results + generates chart spec
 * 5. Returns everything to the frontend
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateSQL, interpretResults } from '@/lib/claude';
import { executeQuery } from '@/lib/snowflake';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(request: NextRequest) {
  try {
    const { question } = await request.json();

    if (!question || typeof question !== 'string') {
      return NextResponse.json(
        { error: 'Missing or invalid "question" field' },
        { status: 400, headers: corsHeaders }
      );
    }

    // Phase 1: Generate SQL via Claude Opus 4.6
    const sqlResult = await generateSQL(question);

    // Phase 2: Execute on Snowflake (if configured)
    let queryResult = null;
    let snowflakeConnected = false;

    if (process.env.SNOWFLAKE_ACCOUNT && process.env.SNOWFLAKE_PASSWORD) {
      const execution = await executeQuery(sqlResult.sql);
      snowflakeConnected = true;

      if (execution.success) {
        queryResult = {
          data: execution.data,
          columns: execution.columns,
          rowCount: execution.rowCount,
          executionTime: execution.executionTime,
        };
      } else {
        // SQL execution failed — still send to interpreter with error context
        queryResult = null;
      }
    }

    // Phase 3: Interpret results via Claude Sonnet 4.6
    const interpretation = await interpretResults(
      question,
      sqlResult.sql,
      queryResult?.data || null,
      queryResult?.columns || null
    );

    return NextResponse.json({
      success: true,
      pipeline: {
        sql: {
          query: sqlResult.sql,
          tables: sqlResult.tables_used,
          description: sqlResult.description,
        },
        execution: snowflakeConnected
          ? {
              connected: true,
              rowCount: queryResult?.rowCount || 0,
              executionTime: queryResult?.executionTime || 0,
              columns: queryResult?.columns || [],
            }
          : {
              connected: false,
              message: 'Snowflake not configured — using AI-estimated results',
            },
        analysis: {
          interpretation: interpretation.interpretation,
          insights: interpretation.insights,
          chart: interpretation.chart,
        },
      },
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error('Query pipeline error:', error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Internal server error',
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
