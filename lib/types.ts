export interface Expense {
  id: string;
  date: string;
  name: string;
  category: string;
  account: string;
  amount: number;
  created_at?: string;
}

export interface Forecast {
  id: string;
  date: string;
  name: string;
  category: string;
  is_expended: boolean;
  amount: number;
  created_at?: string;
}

export interface Income {
  id: string;
  date: string;
  name: string;
  income_category: string;
  account: string;
  amount: number;
  created_at?: string;
}

export interface Transfer {
  id: string;
  date: string;
  account_from: string;
  account_to: string;
  amount: number;
  created_at?: string;
}

export interface Reimburse {
  id: string;
  date: string;
  name: string;
  category: string;
  account: string;
  amount: number;
  created_at?: string;
}

export interface Budget {
  id: string;
  month: number;
  year: number;
  category: string;
  planned: number;
}

export interface PlannedIncome {
  id: string;
  month: number;
  year: number;
  income_category: string;
  planned: number;
}

export interface AccountBalance {
  account: string;
  expenses: number;
  income: number;
  transfers_in: number;
  transfers_out: number;
  total: number;
}

export interface MonthContextType {
  month: number; // 1–12
  year: number;
  setMonth: (month: number) => void;
  setYear: (year: number) => void;
  prev: () => void;
  next: () => void;
  label: string;
}

// Form types (omit id/created_at for new entries)
export type ExpenseForm = Omit<Expense, "id" | "created_at">;
export type ForecastForm = Omit<Forecast, "id" | "created_at">;
export type IncomeForm = Omit<Income, "id" | "created_at">;
export type TransferForm = Omit<Transfer, "id" | "created_at">;
export type ReimburseForm = Omit<Reimburse, "id" | "created_at">;
