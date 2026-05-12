import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

async function askGemini(prompt: string, forceError: boolean) {
  if (forceError) throw new Error("Gemini forced fail");

  await new Promise((r) => setTimeout(r, 1000));
  return `Gemini response for: ${prompt}`;
}

async function askClaude(prompt: string) {
  await new Promise((r) => setTimeout(r, 800));
  return `Claude response for: ${prompt}`;
}

export async function POST(req: Request) {
  const startedAt = Date.now();

  try {
    const body = await req.json();
    const text = body?.text;
    const force_error = body?.force_error;

    console.log("📩 Request received:", { text, force_error });

    if (!text?.trim()) {
      return NextResponse.json({ error: "Prompt required" }, { status: 400 });
    }

    let answer: string;
    let model = "Gemini";
    let status = "success";

    try {
      answer = await askGemini(text, force_error);
    } catch (err) {
      console.warn("⚠️ Gemini failed -> switching to Claude", err);

      answer = await askClaude(text);
      model = "Claude";
      status = "fallback";
    }

    const execution_time = Date.now() - startedAt;

    const { data, error } = await supabase
      .from("ai_logs")
      .insert([
        {
          prompt: text,
          response: answer,
          model,
          status,
          execution_time,
        },
      ])
      .select();

    if (error) {
      console.error("❌ SUPABASE INSERT FAILED:", error);

      return NextResponse.json({
        answer,
        model,
        status,
        execution_time,
        db_status: "failed",
      });
    }

    console.log("✅ SAVED TO SUPABASE:", data);

    return NextResponse.json({
      answer,
      model,
      status,
      execution_time,
      db_status: "ok",
    });
  } catch (e) {
    console.error("❌ API CRASH:", e);

    return NextResponse.json({ error: "Service unavailable" }, { status: 500 });
  }
}
