/**
 * ICONYCS Data Labels  -  Single Source of Truth
 * Never use "Infutor" anywhere. Use the terms defined here.
 */

export const DATA_SOURCES = {
  DIRECT_IDENTIFIED: 'Direct Identified Records',
  AREA_ESTIMATES: 'Area Estimates',
  PROPERTY_RECORDS: 'Property Records',
} as const;

export const DEMOLVL_LABELS: Record<number, { label: string; indicator: string; color: string }> = {
  1: { label: 'Direct Identified', indicator: '🟢', color: '#5D7E52' },
  2: { label: 'Household Modeled', indicator: '🟡', color: '#B8860B' },
  3: { label: 'Area Estimated',    indicator: '🔴', color: '#C4653A' },
};

export const METHODOLOGY_NOTE =
  'Data sourced from Direct Identified Records (individually sourced property and ownership data) and public records. ' +
  'Geographic coverage: 50 states + DC. Property count: 130M+.';

export const ETHNICITY_CODES: Record<string, string> = {
  Y: 'Hispanic',
  F: 'African American',
  A: 'Asian',
  W: 'White / Non-Hispanic',
  B: 'African American',
  I: 'Native American',
  P: 'Pacific Islander',
};

export const LOAN_CATEGORY_LABELS: Record<string, string> = {
  CONV: 'Conventional',
  FHA:  'FHA',
  VA:   'VA',
  PRIV: 'Private Party',
  CASH: 'Cash Purchase',
  OTHER: 'Other / Unknown',
};

export const LTV_TIER_ORDER = [
  '≤60%  -  Tier 1',
  '60-65%  -  Tier 2',
  '65-70%  -  Tier 3',
  '70-75%  -  Tier 4',
  '75-80%  -  Tier 5',
  '80-85%  -  Tier 6',
  '85-90%  -  Tier 7',
  '90-95%  -  Tier 8',
  '95-97%  -  Tier 9',
  'Over 97%',
];
