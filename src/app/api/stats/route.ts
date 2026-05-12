import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("ai_logs").select("*");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const total = data.length;

  const gemini = data.filter((i) => i.model === "Gemini").length;
  const claude = data.filter((i) => i.model === "Claude").length;

  const fallback = data.filter((i) => i.status === "fallback").length;
  const success = data.filter((i) => i.status === "success").length;

  const avgTime =
    data.reduce((acc, i) => acc + i.execution_time, 0) / total || 0;

  return NextResponse.json({
    total,
    gemini,
    claude,
    success,
    fallback,
    avgTime: Math.round(avgTime),
  });
}
