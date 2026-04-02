# ICONYCS Housing Analytics Platform

> 130M+ property records · 187M+ owner profiles · AI-powered analytics

## Architecture

```
iconycs.com (public)          → Next.js SSR pages (SEO-optimized)
iconycs.com/dashboard         → React dashboard app (authenticated)  
iconycs.com/api/query         → Claude Opus 4.6 → Snowflake → Claude Sonnet 4.6
iconycs.com/api/linkedin      → LinkedIn publishing API
iconycs.com/api/news          → Housing news aggregation
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 15 | SSR for SEO + React dashboard |
| AI (SQL) | Claude Opus 4.6 | Natural language → Snowflake SQL |
| AI (Analysis) | Claude Sonnet 4.6 | Result interpretation + charts |
| Database | Snowflake | 130M+ property records |
| Hosting | Vercel | Edge deployment, auto-SSL |
| Domain | IONOS | iconycs.com registration + DNS |

## Quick Start

```bash
# Clone the repo
git clone https://github.com/your-org/iconycs-platform.git
cd iconycs-platform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
# → http://localhost:3000
```

## Environment Variables

See `.env.example` for all required variables. Key ones:

- `ANTHROPIC_API_KEY` — Your Anthropic API key
- `SNOWFLAKE_*` — Snowflake connection credentials
- `LINKEDIN_*` — LinkedIn API for post publishing
- `NEXTAUTH_SECRET` — Auth session encryption

## Domain Transfer: GoDaddy → IONOS → Vercel

### Step 1: Transfer domain to IONOS (5-7 days)

1. **At GoDaddy:** Unlock the domain at domains.godaddy.com
2. **At GoDaddy:** Get the Authorization/EPP code (Domain Settings → Transfer)
3. **At IONOS:** Go to Domains → Transfer Domain → enter `iconycs.com`
4. **At IONOS:** Paste the auth code and complete payment
5. **Wait:** Transfer takes 5-7 days. Approve any confirmation emails.

### Step 2: Deploy to Vercel (10 minutes)

1. Push this repo to GitHub
2. Go to vercel.com → New Project → Import from GitHub
3. Add environment variables in Vercel dashboard (Settings → Environment Variables)
4. Deploy — Vercel gives you `iconycs-platform.vercel.app`

### Step 3: Connect domain to Vercel (15 minutes)

1. **In Vercel:** Project Settings → Domains → Add `iconycs.com`
2. **Vercel shows you DNS records** — typically:
   - A record: `76.76.21.21` for apex domain
   - CNAME: `cname.vercel-dns.com` for www
3. **In IONOS:** Go to Domains → DNS Settings for iconycs.com
4. **Delete** old GoDaddy A records
5. **Add** the Vercel A record and CNAME
6. **Wait** 5-30 minutes for DNS propagation
7. **Vercel auto-provisions SSL** — site is live at https://iconycs.com

### Alternative: Point nameservers to Vercel

Instead of individual DNS records, you can point IONOS nameservers to Vercel:
- `ns1.vercel-dns.com`
- `ns2.vercel-dns.com`

This gives Vercel full DNS control (simpler but less flexible).

## Project Structure

```
iconycs-next/
├── app/
│   ├── layout.tsx          # Root layout, SEO metadata, fonts
│   ├── page.tsx            # Public homepage (SSR, SEO)
│   ├── globals.css         # Global styles
│   ├── sitemap.ts          # Auto-generated sitemap.xml
│   ├── robots.ts           # robots.txt for crawlers
│   ├── about/              # About Us page
│   ├── analytics/          # Analytics page
│   ├── marketplace/        # Product ordering
│   ├── partners/           # Partner directory
│   ├── investors/          # Investor relations
│   ├── blog/               # Blog/news
│   ├── contact/            # Contact form
│   ├── dashboard/          # Authenticated dashboard app
│   └── api/
│       ├── query/route.ts  # AI query pipeline
│       ├── linkedin/route.ts # LinkedIn publishing
│       └── news/route.ts   # News aggregation
├── components/
│   ├── ui/                 # Shared UI components
│   ├── marketing/          # Public page components
│   └── dashboard/          # Dashboard components
├── lib/
│   ├── snowflake.ts        # Snowflake connection (server-only)
│   └── claude.ts           # Claude AI integration (server-only)
├── public/                 # Static assets (logo, og-image)
├── .env.example            # Environment variable template
├── next.config.js          # Next.js configuration
├── package.json
├── tsconfig.json
└── README.md
```

## API Endpoints

### POST /api/query
Natural language → SQL → results → visualization

```json
{
  "question": "Show homeownership rates by ethnicity in DC"
}
```

Returns: SQL query, execution results, interpretation, chart spec.

### POST /api/linkedin
Generate or publish LinkedIn posts

```json
{
  "action": "generate",
  "topic": "Weekly housing market update"
}
```

### GET /api/news
Fetch aggregated housing news from RSS feeds

## Cost Estimates

| Component | Monthly Cost |
|-----------|-------------|
| Vercel Pro | $20 |
| Claude API (~1000 queries) | ~$30 |
| Snowflake | Existing |
| IONOS domain | ~$1 |
| **Total** | **~$51/month** |

With prompt caching enabled, Claude costs drop to ~$15/month.
