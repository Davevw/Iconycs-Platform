/**
 * ICONYCS Claude AI Integration
 * Server-side only — handles all Anthropic API calls
 * 
 * Tiered model strategy:
 *   - Opus 4.6 → SQL generation (complex reasoning, schema mapping)
 *   - Sonnet 4.6 → Result interpretation (business analysis, lighter task)
 * 
 * Prompt caching: The Snowflake schema is sent with cache_control
 * so subsequent queries reuse the cached schema at 90% discount.
 */

import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// ═══════════════════════════════════════════════
// SNOWFLAKE SCHEMA — cached across API calls
// ═══════════════════════════════════════════════
const SNOWFLAKE_SCHEMA = `
### VW_PROP_SAMPLE (Property Records — 130M+ rows nationally)
Columns:
- PID (VARCHAR): Primary property identifier
- PID2 (VARCHAR): Secondary property identifier  
- HOUSE (VARCHAR): House number
- PREDIR (VARCHAR): Street prefix direction
- STREET (VARCHAR): Street name
- STRTYPE (VARCHAR): Street type
- POSTDIR (VARCHAR): Street postfix direction
- APTTYPE (VARCHAR): Apartment type
- APTNBR (VARCHAR): Apartment number
- CITY (VARCHAR): City
- STATE (VARCHAR): State abbreviation
- ZIP (VARCHAR): ZIP code
- PROP_LANDUSE (VARCHAR): Land use code
- PROP_VALCALC (NUMBER): Calculated property value
- PROP_ASSED_VAL (NUMBER): Assessed value
- PROP_MRKTVAL (NUMBER): Market value
- PROP_IMP_VALCALC (NUMBER): Improvement value
- PROP_ASSED_LANDVAL (NUMBER): Assessed land value
- PROP_ASSED_IMPVAL (NUMBER): Assessed improvement value
- PROP_APPRAISED_VAL (NUMBER): Appraised value
- PROP_GROSSSQFT (NUMBER): Gross square footage
- PROP_BLDSQFT (NUMBER): Building square footage
- PROP_BEDRMS (NUMBER): Number of bedrooms
- PROP_BATHS (NUMBER): Number of bathrooms
- PROP_SALESTRANSCD (VARCHAR): Sales transaction code
- PROP_MTGLOANCD (VARCHAR): Mortgage loan code
- PROP_MTGAMT (NUMBER): Mortgage amount
- PROP_MTGTERM (NUMBER): Mortgage term
- PROP_MTGDUEDATE (DATE): Mortgage due date

### VW_NARC3_SAMPLE (Owner Demographics — 187M+ profiles)
Columns:
- PID (VARCHAR): Property ID (joins to VW_PROP_SAMPLE.PID)
- STATE (VARCHAR): State
- "Homeowner or Renter" (VARCHAR): 'Homeowner' or 'Renter'
- "Ethnicity" (VARCHAR): Hispanic, African American, Asian, or Unknown
- "EHI Desc" (VARCHAR): Estimated Household Income bracket
- "Marital Status" (VARCHAR): Married, Single, or Unknown
- "Income/Ownership/Assets Owned" (VARCHAR): Wealth score bracket
- "Dwell Type" (VARCHAR): Single Family / Multi Family / Unknown
- "Market Home Value" (VARCHAR): Market home value range
- "Education Level" (VARCHAR): High School, College, Graduate School, Vocational/Technical, Unknown
- "Fireplace" (VARCHAR): Yes or Unknown
- Black (VARCHAR): Percentage range of Black population in area
- White (VARCHAR): Percentage range of White population in area
- Hispanic (VARCHAR): Percentage range of Hispanic population in area
- Asian (VARCHAR): Percentage range of Asian population in area

RULES:
- Column names with spaces/mixed case MUST use double quotes: "Ethnicity", "Marital Status"
- Join on PID: VW_PROP_SAMPLE.PID = VW_NARC3_SAMPLE.PID
- Use Snowflake SQL dialect (IFNULL, IFF, LISTAGG, etc.)
- Do NOT use backticks or smart quotes
`.trim();

// ═══════════════════════════════════════════════
// SQL GENERATION — Uses Opus 4.6 for maximum accuracy
// ═══════════════════════════════════════════════
export async function generateSQL(userQuestion: string): Promise<{
  sql: string;
  tables_used: string[];
  description: string;
}> {
  const response = await anthropic.messages.create({
    model: 'claude-opus-4-6',
    max_tokens: 1024,
    system: [
      {
        type: 'text',
        text: `You are an expert Snowflake SQL analyst for ICONYCS housing analytics.

Given a natural language question, generate a valid Snowflake SQL query using ONLY these tables:

${SNOWFLAKE_SCHEMA}

Respond ONLY with JSON: {"sql": "QUERY", "tables_used": ["TABLE"], "description": "What this does"}`,
        // Enable prompt caching on the schema — saves 90% on input costs
        cache_control: { type: 'ephemeral' },
      },
    ],
    messages: [
      { role: 'user', content: userQuestion },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  return JSON.parse(clean);
}

// ═══════════════════════════════════════════════
// RESULT INTERPRETATION — Uses Sonnet 4.6 (cheaper, still excellent)
// ═══════════════════════════════════════════════
export async function interpretResults(
  userQuestion: string,
  sql: string,
  queryResults: Record<string, any>[] | null,
  columns: string[] | null
): Promise<{
  interpretation: string;
  insights: string[];
  chart: {
    type: 'bar' | 'pie' | 'line' | 'area';
    title: string;
    data: Record<string, any>[];
    xKey: string;
    yKeys: Array<{ key: string; name: string }>;
  } | null;
}> {
  const resultsText = queryResults
    ? `Query returned ${queryResults.length} rows.\nColumns: ${(columns || []).join(', ')}\nSample data (first 20 rows):\n${JSON.stringify(queryResults.slice(0, 20), null, 2)}`
    : 'Query has not been executed yet. Generate realistic expected results based on typical US housing demographics.';

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 2048,
    system: `You are a senior housing analytics business analyst for ICONYCS.

Interpret SQL query results and provide actionable insights.

Respond ONLY with JSON:
{
  "interpretation": "Business interpretation with **bold** emphasis",
  "insights": ["insight 1", "insight 2", "insight 3"],
  "chart": {
    "type": "bar|pie|line|area",
    "title": "Chart title",
    "data": [{"label": "Category", "value": 42}],
    "xKey": "label",
    "yKeys": [{"key": "value", "name": "Display Name"}]
  }
}
Set chart to null if data is not chartable.`,
    messages: [
      {
        role: 'user',
        content: `User asked: "${userQuestion}"
SQL: ${sql}
Results: ${resultsText}`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  return JSON.parse(clean);
}

// ═══════════════════════════════════════════════
// LINKEDIN POST GENERATION — Uses Sonnet 4.6
// ═══════════════════════════════════════════════
export async function generateLinkedInPost(
  topic: string,
  data?: string
): Promise<{
  post: string;
  hashtags: string[];
}> {
  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 1024,
    system: `You write LinkedIn posts for ICONYCS Housing Analytics, published under the WRFCO "Home Ownership News" business page.

Posts should be:
- Professional but engaging
- Data-driven when data is provided
- Include relevant emojis sparingly
- 150-250 words
- End with 3-5 relevant hashtags

Respond with JSON: {"post": "content", "hashtags": ["#tag1", "#tag2"]}`,
    messages: [
      {
        role: 'user',
        content: data
          ? `Topic: ${topic}\nData context: ${data}`
          : `Topic: ${topic}`,
      },
    ],
  });

  const text = response.content
    .filter((b): b is Anthropic.TextBlock => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const clean = text.replace(/```json\s*/g, '').replace(/```\s*/g, '').trim();
  return JSON.parse(clean);
}
