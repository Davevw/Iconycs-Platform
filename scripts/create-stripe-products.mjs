/**
 * ICONYCS — Create Stripe Products & Prices (test mode)
 * Run: node scripts/create-stripe-products.mjs
 */

import { readFileSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load key from .env.local or environment — never hardcode secrets in source
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || (() => {
  try {
    const env = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
    const match = env.match(/^STRIPE_SECRET_KEY=(.+)$/m);
    if (match) return match[1].trim();
  } catch {}
  throw new Error('STRIPE_SECRET_KEY not found. Set it in .env.local or environment.');
})();

async function stripePost(path, body) {
  const params = new URLSearchParams();
  for (const [key, val] of Object.entries(body)) {
    if (typeof val === 'object') {
      for (const [k, v] of Object.entries(val)) {
        params.append(`${key}[${k}]`, String(v));
      }
    } else {
      params.append(key, String(val));
    }
  }
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${STRIPE_SECRET_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Stripe error: ${JSON.stringify(data.error)}`);
  return data;
}

async function stripeGet(path) {
  const res = await fetch(`https://api.stripe.com/v1${path}`, {
    headers: { Authorization: `Bearer ${STRIPE_SECRET_KEY}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`Stripe error: ${JSON.stringify(data.error)}`);
  return data;
}

async function findExistingProduct(name) {
  const list = await stripeGet(`/products?limit=100&active=true`);
  return list.data.find(p => p.name === name) || null;
}

async function findExistingPrice(productId, amount, currency, type) {
  const list = await stripeGet(`/prices?product=${productId}&limit=20&active=true`);
  return list.data.find(p => {
    if (p.unit_amount !== amount) return false;
    if (type === 'recurring') return p.recurring?.interval === 'month';
    return p.type === 'one_time';
  }) || null;
}

async function createOrGetProduct(name, description) {
  let product = await findExistingProduct(name);
  if (product) {
    console.log(`  ✓ Product exists: ${name} (${product.id})`);
    return product;
  }
  product = await stripePost('/products', { name, description });
  console.log(`  + Created product: ${name} (${product.id})`);
  return product;
}

async function createOrGetPrice(productId, amount, currency, type) {
  let price = await findExistingPrice(productId, amount, currency, type);
  if (price) {
    console.log(`  ✓ Price exists: $${(amount/100).toFixed(2)} (${price.id})`);
    return price;
  }
  const body = {
    product: productId,
    unit_amount: amount,
    currency,
  };
  if (type === 'recurring') {
    body['recurring[interval]'] = 'month';
  }
  price = await stripePost('/prices', body);
  console.log(`  + Created price: $${(amount/100).toFixed(2)} (${price.id})`);
  return price;
}

async function main() {
  console.log('🔧 ICONYCS — Creating Stripe Products (test mode)\n');

  const plans = [
    { name: 'ICONYCS Analyst', description: 'Full drill-down, all demographics, PDF export, cascade builder', amount: 4900, type: 'recurring', key: 'analyst' },
    { name: 'ICONYCS Professional', description: 'Social Housing Score, API access, time-series, matrix builder', amount: 19900, type: 'recurring', key: 'professional' },
    { name: 'ICONYCS Enterprise', description: 'Snowflake direct, team seats, custom views, priority support', amount: 99900, type: 'recurring', key: 'enterprise' },
    { name: 'ICONYCS Pay-Per-Report', description: 'One-time report purchase', amount: 999, type: 'one_time', key: 'pay_per_report' },
  ];

  const result = {
    mode: 'test',
    created: new Date().toISOString(),
    secret_key: STRIPE_SECRET_KEY,
    publishable_key: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '(see .env.local)',
    account: 'ICONYCS',
    note: 'Test mode — no real payments until live mode enabled',
    prices: {},
  };

  for (const plan of plans) {
    console.log(`\n📦 ${plan.name}`);
    const product = await createOrGetProduct(plan.name, plan.description);
    const price = await createOrGetPrice(product.id, plan.amount, 'usd', plan.type);
    result.prices[plan.key] = {
      priceId: price.id,
      productId: product.id,
      amount: plan.amount,
      currency: 'usd',
      type: plan.type,
      interval: plan.type === 'recurring' ? 'month' : null,
    };
  }

  // Write to credentials file
  const credPath = 'C:\\Users\\dave\\.openclaw\\workspace\\.credentials\\stripe.json';
  writeFileSync(credPath, JSON.stringify(result, null, 2));
  console.log(`\n✅ Stripe products created! Price IDs saved to ${credPath}`);
  console.log('\nPrice IDs:');
  for (const [key, val] of Object.entries(result.prices)) {
    console.log(`  ${key}: ${val.priceId}`);
  }
}

main().catch(err => {
  console.error('❌ Error:', err.message);
  process.exit(1);
});
