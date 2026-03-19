# FinTrack — Personal Finance OS

A refined dark fintech dashboard for personal finance tracking. Built with Next.js 14 (App Router), TypeScript, Tailwind CSS, Supabase (PostgreSQL), and Chart.js.

## Features

- **Dashboard** — Summary cards, daily expense vs forecast combo chart, income & expense pie charts
- **Expenses** — Full CRUD with date, name, category, account, amount
- **Forecasted Expenses** — Planned spending with expended toggle
- **Income** — Track salary, bonuses, and other income
- **Transfers** — Between-account transfers (excluded from income/expense totals)
- **Reimbursements** — Received money back, tracked separately
- **Budget** — Inline-editable planned amounts per category, Actual vs Diff vs Available
- **Planned Income** — Income targets per category, auto-saved with 500ms debounce
- **Account Balance** — Paycheck-cycle summary (25th prev → 24th current month)
- **Global month selector** in header — filters all pages
- **Keyboard shortcut `N`** — opens add modal on any transaction page
- **Quick-add FAB** — floating button for Expense / Income / Transfer from any page
- All amounts formatted as `Rp 1.234.567` (Indonesian format)

---

## Tech Stack

| Layer        | Choice                          |
|--------------|---------------------------------|
| Framework    | Next.js 14 (App Router)         |
| Language     | TypeScript                      |
| Styling      | Tailwind CSS                    |
| Database     | Supabase (PostgreSQL)           |
| Charts       | Chart.js via react-chartjs-2    |
| Data fetching| SWR                             |
| Fonts        | JetBrains Mono + Syne (Google)  |
| Deployment   | Vercel                          |

---

## Local Development

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/fintrack.git
cd fintrack
npm install
```

### 2. Set up environment variables

```bash
cp .env.local.example .env.local
```

Open `.env.local` and fill in your Supabase credentials (see Supabase Setup below).

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Supabase Setup

### 1. Create a new Supabase project

Go to [supabase.com](https://supabase.com), create a new project.

### 2. Run the migration

In your Supabase dashboard → **SQL Editor** → paste the contents of:

```
supabase/migrations/001_initial_schema.sql
```

Click **Run**. This creates all 7 tables with proper indexes.

### 3. Copy your API keys

In your Supabase dashboard → **Project Settings** → **API**:

- Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon / public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Paste both into `.env.local`.

---

## Vercel Deployment

### 1. Push to GitHub

```bash
git add .
git commit -m "initial commit"
git push origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**

Vercel auto-detects Next.js — no configuration needed.

---

## Project Structure

```
fintrack/
├── app/
│   ├── layout.tsx                # Root layout (sidebar + header + fonts)
│   ├── page.tsx                  # Redirects to /dashboard
│   ├── dashboard/page.tsx        # Dashboard with charts and summary
│   ├── expenses/page.tsx
│   ├── forecast/page.tsx
│   ├── budget/page.tsx
│   ├── income/page.tsx
│   ├── transfers/page.tsx
│   ├── reimburse/page.tsx
│   ├── planned-income/page.tsx
│   ├── balance/page.tsx
│   └── api/                      # All API routes (REST)
├── components/
│   ├── layout/                   # Sidebar, Header
│   ├── ui/                       # Button, Input, Select, Modal, Table, Toast...
│   ├── dashboard/                # SummaryCards, chart components
│   ├── forms/                    # Form modals for each entity
│   └── fab/                      # QuickAddFAB
├── lib/
│   ├── supabase.ts               # Browser + server Supabase clients
│   ├── constants.ts              # Categories, accounts, income categories
│   ├── formatters.ts             # Rupiah formatter, date helpers
│   └── types.ts                  # All TypeScript interfaces
├── context/
│   └── MonthContext.tsx          # Global month/year state
├── hooks/                        # SWR data hooks per entity
└── supabase/
    └── migrations/
        └── 001_initial_schema.sql
```

---

## Notes

- **No authentication** — this is a single-user personal finance app. If you want multi-user support, enable Supabase Auth and Row Level Security (the SQL migration includes commented-out RLS lines).
- **Inline editing** (Budget & Planned Income) debounces saves by 500ms — changes persist automatically on blur or Enter.
- **Transfers** do not affect income or expense totals — they only affect the Account Balance summary.
- **Account Balance** uses a paycheck cycle: 25th of previous month → 24th of current month.
# fintrack
