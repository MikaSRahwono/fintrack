-- FinTrack Initial Schema
-- Run this in your Supabase SQL Editor

-- expenses
CREATE TABLE IF NOT EXISTS expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  account TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- forecast
CREATE TABLE IF NOT EXISTS forecast (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  is_expended BOOLEAN DEFAULT FALSE,
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- income
CREATE TABLE IF NOT EXISTS income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  name TEXT NOT NULL,
  income_category TEXT NOT NULL,
  account TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- transfers
CREATE TABLE IF NOT EXISTS transfers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  account_from TEXT NOT NULL,
  account_to TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- reimburse
CREATE TABLE IF NOT EXISTS reimburse (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  account TEXT NOT NULL,
  amount INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- budget (upsert per category per month)
CREATE TABLE IF NOT EXISTS budget (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  category TEXT NOT NULL,
  planned INTEGER NOT NULL DEFAULT 0,
  UNIQUE(month, year, category)
);

-- planned_income (upsert per income category per month)
CREATE TABLE IF NOT EXISTS planned_income (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  income_category TEXT NOT NULL,
  planned INTEGER NOT NULL DEFAULT 0,
  UNIQUE(month, year, income_category)
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_forecast_date ON forecast(date);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
CREATE INDEX IF NOT EXISTS idx_transfers_date ON transfers(date);
CREATE INDEX IF NOT EXISTS idx_reimburse_date ON reimburse(date);
CREATE INDEX IF NOT EXISTS idx_budget_month_year ON budget(month, year);
CREATE INDEX IF NOT EXISTS idx_planned_income_month_year ON planned_income(month, year);

-- Enable Row Level Security (optional, uncomment if you add auth)
-- ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE forecast ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE income ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE transfers ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE reimburse ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE budget ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE planned_income ENABLE ROW LEVEL SECURITY;
