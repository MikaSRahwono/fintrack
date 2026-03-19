import { NextRequest, NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase";
import { getMonthDateRange } from "@/lib/formatters";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const month = parseInt(searchParams.get("month") || "0");
  const year  = parseInt(searchParams.get("year")  || "0");

  const supabase = getSupabaseServerClient();
  let query = supabase.from("transfers").select("*").order("date", { ascending: false });

  if (month && year) {
    const { start, end } = getMonthDateRange(month, year);
    query = query.gte("date", start).lte("date", end);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const supabase = getSupabaseServerClient();
  const { data, error } = await supabase.from("transfers").insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
