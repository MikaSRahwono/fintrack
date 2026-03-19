import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getPaycheckDateRange } from "@/lib/formatters";
import type { AccountBalance } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const month = parseInt(searchParams.get("month") || "0");
  const year  = parseInt(searchParams.get("year")  || "0");

  if (!month || !year) {
    return NextResponse.json({ error: "month and year required" }, { status: 400 });
  }

  const { start, end } = getPaycheckDateRange(month, year);
  const supabase = getSupabaseServerClient();

  const [expenses, income, reimburse, transfers] = await Promise.all([
    supabase.from("expenses").select("account, amount").gte("date", start).lte("date", end),
    supabase.from("income").select("account, amount").gte("date", start).lte("date", end),
    supabase.from("reimburse").select("account, amount").gte("date", start).lte("date", end),
    supabase.from("transfers").select("account_from, account_to, amount").gte("date", start).lte("date", end),
  ]);

  if (expenses.error || income.error || reimburse.error || transfers.error) {
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }

  // Gather all accounts with at least one transaction
  const accSet = new Set<string>();
  expenses.data?.forEach(r => accSet.add(r.account));
  income.data?.forEach(r => accSet.add(r.account));
  reimburse.data?.forEach(r => accSet.add(r.account));
  transfers.data?.forEach(r => { accSet.add(r.account_from); accSet.add(r.account_to); });

  const rows: AccountBalance[] = [...accSet].sort().map(acc => {
    const exp = expenses.data!.filter(r => r.account === acc).reduce((s, r) => s + r.amount, 0);
    const inc = income.data!.filter(r => r.account === acc).reduce((s, r) => s + r.amount, 0);
    const rei = reimburse.data!.filter(r => r.account === acc).reduce((s, r) => s + r.amount, 0);
    const trIn  = transfers.data!.filter(r => r.account_to   === acc).reduce((s, r) => s + r.amount, 0);
    const trOut = transfers.data!.filter(r => r.account_from === acc).reduce((s, r) => s + r.amount, 0);
    return {
      account: acc,
      expenses: exp,
      income: inc + rei,
      transfers_in: trIn,
      transfers_out: trOut,
      total: inc + rei + trIn - exp - trOut,
    };
  });

  return NextResponse.json({ rows, period: { start, end } });
}
