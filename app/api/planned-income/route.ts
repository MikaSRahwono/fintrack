import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const month = parseInt(searchParams.get("month") || "0");
  const year  = parseInt(searchParams.get("year")  || "0");

  const supabase = getSupabaseServerClient();
  let query = supabase.from("planned_income").select("*");

  if (month && year) {
    query = query.eq("month", month).eq("year", year);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json(); // { month, year, income_category, planned }
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase
    .from("planned_income")
    .upsert(body, { onConflict: "month,year,income_category" })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
