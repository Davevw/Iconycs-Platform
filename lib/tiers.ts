/**
 * ICONYCS  -  Tier & Range Lookups (Single Source of Truth)
 * All bucket definitions live here. Never hard-code ranges in components.
 *
 * Spec source: TOP_CASCADE_SPEC.md  -  David Van Waldick
 */

// --- Types -----------------------------------------------------------------

export interface TierRange {
  label: string;
  minVal: number;
  maxVal: number;
  sortOrder: number;
}

export interface TierGroup {
  type: string;
  ranges: TierRange[];
}

// --- Purchase & Market Value Ranges ----------------------------------------

export const PURCHASE_VALUE_TIERS: TierRange[] = [
  { label: '$25K-$100K',  minVal: 25000,    maxVal: 100000,    sortOrder: 1 },
  { label: '$100K-$250K', minVal: 100001,   maxVal: 250000,    sortOrder: 2 },
  { label: '$250K-$400K', minVal: 250001,   maxVal: 400000,    sortOrder: 3 },
  { label: '$400K-$750K', minVal: 400001,   maxVal: 750000,    sortOrder: 4 },
  { label: '$750K-$1M',   minVal: 750001,   maxVal: 1000000,   sortOrder: 5 },
  { label: '$1M+',        minVal: 1000001,  maxVal: 999999999, sortOrder: 6 },
  { label: 'Unknown',     minVal: 0,        maxVal: 0,         sortOrder: 7 },
];

export const MARKET_VALUE_TIERS: TierRange[] = [...PURCHASE_VALUE_TIERS];

// --- Ownership Duration (Purchase Date Range) ------------------------------

export interface DurationTier {
  label: string;
  minMonths: number;
  maxMonths: number;
  sortOrder: number;
}

export const OWNERSHIP_DURATION_TIERS: DurationTier[] = [
  { label: '0-1 Year',   minMonths: 0,   maxMonths: 12,  sortOrder: 1 },
  { label: '1-2 Years',  minMonths: 13,  maxMonths: 24,  sortOrder: 2 },
  { label: '2-5 Years',  minMonths: 25,  maxMonths: 60,  sortOrder: 3 },
  { label: '5-10 Years', minMonths: 61,  maxMonths: 120, sortOrder: 4 },
  { label: '10-20 Years',minMonths: 121, maxMonths: 240, sortOrder: 5 },
  { label: '20+ Years',  minMonths: 241, maxMonths: 9999,sortOrder: 6 },
  { label: 'Unknown',    minMonths: -1,  maxMonths: -1,  sortOrder: 7 },
];

// --- LTV (Loan-to-Value) Tiers  -  FNMA Standard ----------------------------

export const LTV_TIERS: TierRange[] = [
  { label: '0-60%',  minVal: 0,  maxVal: 60,  sortOrder: 1 },
  { label: '60-70%', minVal: 60, maxVal: 70,  sortOrder: 2 },
  { label: '70-80%', minVal: 70, maxVal: 80,  sortOrder: 3 },
  { label: '80-90%', minVal: 80, maxVal: 90,  sortOrder: 4 },
  { label: '90-95%', minVal: 90, maxVal: 95,  sortOrder: 5 },
  { label: '95%+',   minVal: 95, maxVal: 100, sortOrder: 6 },
  { label: 'Unknown',minVal: -1, maxVal: -1,  sortOrder: 7 },
];

// --- Loan Type Codes -------------------------------------------------------

export interface LoanTypeCode {
  code: string;
  description: string;
  color: string;
}

export const LOAN_TYPES: LoanTypeCode[] = [
  { code: 'C', description: 'Conventional (Fannie/Freddie)', color: '#1B2A4A' },
  { code: 'F', description: 'FHA',                           color: '#C4653A' },
  { code: 'V', description: 'VA',                            color: '#5D7E52' },
  { code: 'O', description: 'Other',                         color: '#B8860B' },
];

export function loanTypeLabel(code: string): string {
  return LOAN_TYPES.find(t => t.code === code)?.description ?? code;
}

// --- Income Level Tiers (EHI Code mapping) --------------------------------

export const INCOME_TIERS: TierRange[] = [
  { label: '$10K-$30K',   minVal: 10000,  maxVal: 30000,  sortOrder: 1 },
  { label: '$30K-$50K',   minVal: 30001,  maxVal: 50000,  sortOrder: 2 },
  { label: '$50K-$100K',  minVal: 50001,  maxVal: 100000, sortOrder: 3 },
  { label: '$100K-$250K', minVal: 100001, maxVal: 250000, sortOrder: 4 },
  { label: '$250K-$500K', minVal: 250001, maxVal: 500000, sortOrder: 5 },
  { label: '$500K+',      minVal: 500001, maxVal: 9999999,sortOrder: 6 },
];

// Maps EHI_CODE numeric value to income tier label
export function ehiCodeToIncomeTier(code: number): string {
  if (code <= 3)  return '$10K-$30K';
  if (code <= 5)  return '$30K-$50K';
  if (code <= 8)  return '$50K-$100K';
  if (code <= 12) return '$100K-$250K';
  if (code <= 15) return '$250K-$500K';
  return '$500K+';
}

// --- Credit Score Tiers ----------------------------------------------------

export const CREDIT_SCORE_TIERS: TierRange[] = [
  { label: '<500',    minVal: 0,   maxVal: 499, sortOrder: 1 },
  { label: '501-600', minVal: 501, maxVal: 600, sortOrder: 2 },
  { label: '601-660', minVal: 601, maxVal: 660, sortOrder: 3 },
  { label: '661-700', minVal: 661, maxVal: 700, sortOrder: 4 },
  { label: '701-800', minVal: 701, maxVal: 800, sortOrder: 5 },
  { label: '801+',    minVal: 801, maxVal: 999, sortOrder: 6 },
];

// --- Ethnicity Codes --------------------------------------------------------

export interface EthnicityCode {
  code: string;
  description: string;
  color: string;
  confidenceBadge: string;
}

export const ETHNICITY_CODES: EthnicityCode[] = [
  { code: 'Y', description: 'Hispanic',          color: '#C4653A', confidenceBadge: 'High' },
  { code: 'F', description: 'African American',  color: '#1B2A4A', confidenceBadge: 'High' },
  { code: 'A', description: 'Asian',             color: '#5D7E52', confidenceBadge: 'High' },
  { code: 'X', description: 'Not Identified',    color: '#A8A29E', confidenceBadge: 'N/A'  },
];

export function ethnicityLabel(code: string): string {
  return ETHNICITY_CODES.find(e => e.code === code)?.description ?? 'Not Identified';
}

export function ethnicityColor(code: string): string {
  return ETHNICITY_CODES.find(e => e.code === code)?.color ?? '#A8A29E';
}

// --- Education Codes --------------------------------------------------------

export interface EducationCode {
  code: string;
  label: string;
  sortOrder: number;
}

export const EDUCATION_CODES: EducationCode[] = [
  { code: 'A', label: 'High School', sortOrder: 1 },
  { code: 'B', label: 'College',     sortOrder: 2 },
  { code: 'C', label: 'Graduate',    sortOrder: 3 },
  { code: 'D', label: 'Other',       sortOrder: 4 },
];

export function educationLabel(code: string): string {
  return EDUCATION_CODES.find(e => e.code === code)?.label ?? 'Unknown';
}

// --- Wealth Score Tiers (WEALTHSCR A-H) ------------------------------------

export interface WealthScoreTier {
  score: string;
  description: string;
  color: string;
  sortOrder: number;
}

export const WEALTH_SCORE_TIERS: WealthScoreTier[] = [
  { score: 'A', description: 'Top Wealth (Top 1%)',        color: '#1B2A4A', sortOrder: 1 },
  { score: 'B', description: 'High Wealth (Top 5%)',       color: '#2A4A7F', sortOrder: 2 },
  { score: 'C', description: 'Upper Middle (Top 15%)',     color: '#4A7FB5', sortOrder: 3 },
  { score: 'D', description: 'Middle (Top 30%)',           color: '#5D7E52', sortOrder: 4 },
  { score: 'E', description: 'Lower Middle (Top 50%)',     color: '#B8860B', sortOrder: 5 },
  { score: 'F', description: 'Working Class (Top 70%)',    color: '#C4653A', sortOrder: 6 },
  { score: 'G', description: 'Low Income (Bottom 30%)',    color: '#A85D8A', sortOrder: 7 },
  { score: 'H', description: 'Very Low Income (Bottom 10%)',color: '#8B0000',sortOrder: 8 },
];

export function wealthScoreColor(score: string): string {
  return WEALTH_SCORE_TIERS.find(w => w.score === score)?.color ?? '#A8A29E';
}

export function wealthScoreDescription(score: string): string {
  return WEALTH_SCORE_TIERS.find(w => w.score === score)?.description ?? `Score ${score}`;
}

// --- Subscription Tiers -----------------------------------------------------

export interface SubscriptionTier {
  id: 'free' | 'pro' | 'enterprise' | 'data_partner';
  name: string;
  price: string;
  color: string;
  bgColor: string;
  features: string[];
  locked: string[];
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 'free',
    name: 'Explore',
    price: 'Free',
    color: '#78716C',
    bgColor: '#F5F0E8',
    features: [
      'National & State level data',
      'Basic ethnicity + loan type breakdown',
      '3 report views/day',
      'Basic map navigation',
    ],
    locked: [
      'County/City/ZIP drill-down',
      'Demographics Deep Dive',
      'Social Housing Score',
      'Cascade Report Builder',
      'PDF Export',
      'API Access',
    ],
  },
  {
    id: 'pro',
    name: 'Pro Analyst',
    price: '$49/mo',
    color: '#FFFFFF',
    bgColor: '#C4653A',
    features: [
      'Full geography drill-down',
      'All demographics dimensions',
      'PDF export',
      'Cascade Report Builder',
      'Unlimited report views',
    ],
    locked: [
      'Social Housing Score',
      'Matrix Builder',
      'API Access',
      'Custom data feeds',
    ],
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: '$199/mo',
    color: '#FFFFFF',
    bgColor: '#1B2A4A',
    features: [
      'Everything in Pro',
      'Social Housing Score',
      'Matrix Builder',
      'API access',
      'Custom data feeds',
      'Priority support',
    ],
    locked: [
      'Snowflake direct access',
      'Bulk data export',
      'Custom views',
    ],
  },
  {
    id: 'data_partner',
    name: 'Data Partner',
    price: '$999/mo',
    color: '#1C1917',
    bgColor: '#B8860B',
    features: [
      'Everything in Enterprise',
      'Snowflake direct access',
      'Bulk data export',
      'Custom views on demand',
      'Dedicated data engineer',
    ],
    locked: [],
  },
];

// --- Feature Access Map ------------------------------------------------------

export type FeatureKey =
  | 'geo_drilldown'
  | 'demographics_deepdive'
  | 'social_housing_score'
  | 'cascade_builder'
  | 'pdf_export'
  | 'api_access'
  | 'bulk_export'
  | 'custom_views';

export const FEATURE_MIN_TIER: Record<FeatureKey, SubscriptionTier['id']> = {
  geo_drilldown:         'pro',
  demographics_deepdive: 'pro',
  social_housing_score:  'enterprise',
  cascade_builder:       'pro',
  pdf_export:            'pro',
  api_access:            'enterprise',
  bulk_export:           'data_partner',
  custom_views:          'data_partner',
};

const TIER_ORDER: SubscriptionTier['id'][] = ['free', 'pro', 'enterprise', 'data_partner'];

export function hasAccess(
  userTier: SubscriptionTier['id'],
  feature: FeatureKey
): boolean {
  const minTier = FEATURE_MIN_TIER[feature];
  return TIER_ORDER.indexOf(userTier) >= TIER_ORDER.indexOf(minTier);
}

// --- Top 10 Default Lenders --------------------------------------------------

export const DEFAULT_TOP_LENDERS: string[] = [
  'Wells Fargo Bank',
  'Chase Bank',
  'Bank of America',
  'US Bank',
  'United Wholesale',
  'Loan Depot',
  'Quicken Loans',
  'Fairway Independent',
  'Freedom Mortgage',
  'All Others',
];

// --- Cascade Start Points ---------------------------------------------------

export type CascadeType = 'property' | 'ownership' | 'social' | 'media' | 'lender';

export interface CascadeStartPoint {
  id: CascadeType;
  label: string;
  icon: string;
  description: string;
  minTier: SubscriptionTier['id'];
  dimensions: string[];
}

export const CASCADE_START_POINTS: CascadeStartPoint[] = [
  {
    id: 'property',
    label: 'Property',
    icon: '🏠',
    description: 'Value tiers, LTV, ownership duration, loan type',
    minTier: 'pro',
    dimensions: ['Purchase Value', 'Market Value', 'Ownership Duration', 'LTV', 'Loan Type', 'Top 10 Lenders'],
  },
  {
    id: 'ownership',
    label: 'Ownership',
    icon: '👥',
    description: 'Direct Identified Records  -  ethnicity, income, education, wealth',
    minTier: 'pro',
    dimensions: ['Ethnicity', 'Gender', 'Marital Status', 'Education', 'Income', 'Wealth Score'],
  },
  {
    id: 'social',
    label: 'Social Network',
    icon: '🌐',
    description: 'Education, political affiliation, organizations',
    minTier: 'enterprise',
    dimensions: ['Education', 'Political Party', 'Business / Orgs / Non-Profit'],
  },
  {
    id: 'media',
    label: 'Social Media',
    icon: '📱',
    description: 'Platform presence and media signals',
    minTier: 'enterprise',
    dimensions: ['Instagram', 'Snapchat', 'Twitter/X', 'LinkedIn', 'News Media'],
  },
  {
    id: 'lender',
    label: 'Lender',
    icon: '🏦',
    description: 'Lender volume, avg loan, loan type mix',
    minTier: 'pro',
    dimensions: ['Lender Name', 'Loan Volume', 'Avg Loan Amount', 'Loan Type Mix'],
  },
];
