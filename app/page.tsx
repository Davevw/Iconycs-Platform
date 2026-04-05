import type { Metadata } from 'next';
import Homepage from '@/components/marketing/Homepage';

export const metadata: Metadata = {
  title: 'ICONYCS  -  The Socio-Economics of Home Ownership',
  description:
    'ICONYCS Housing Intelligence combines 109M+ residential properties with 158M+ owner demographic profiles. AI-powered analytics by ethnicity, income, education, and more. When Housing Markets Shift, Iconycs Knows.',
  keywords: [
    'housing analytics', 'homeowner demographics', 'property data', 'real estate analytics',
    'socio-economic housing', 'ICONYCS', 'I-PaaS', 'property data as a service',
    'fair lending analytics', 'housing market data', 'demographic analysis',
  ],
};

export default function Page() {
  return <Homepage />;
}
