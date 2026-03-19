export function formatRupiah(amount: number): string {
  const abs = Math.abs(Math.round(amount));
  const formatted = abs.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return (amount < 0 ? "-" : "") + "Rp " + formatted;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  return dateStr.slice(0, 10);
}

export function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

export function getMonthDateRange(month: number, year: number) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const lastDay = new Date(year, month, 0).getDate();
  const end = `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;
  return { start, end };
}

export function getPaycheckDateRange(month: number, year: number) {
  // 25th of previous month → 24th of current month
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth < 1) { prevMonth = 12; prevYear--; }
  const start = `${prevYear}-${String(prevMonth).padStart(2, "0")}-25`;
  const end = `${year}-${String(month).padStart(2, "0")}-24`;
  return { start, end };
}

export function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate();
}

export function buildDayKey(year: number, month: number, day: number): string {
  return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}
