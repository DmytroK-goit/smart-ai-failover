import { describe, it, expect } from "vitest";

async function askGemini(forceError: boolean) {
  if (forceError) throw new Error("fail");
  return "Gemini response";
}

async function askClaude() {
  return "Claude response";
}

async function handler(force_error: boolean) {
  try {
    return {
      model: "Gemini",
      answer: await askGemini(force_error),
    };
  } catch {
    return {
      model: "Claude",
      answer: await askClaude(),
    };
  }
}

describe("AI Failover", () => {
  it("should use Gemini when no error", async () => {
    const res = await handler(false);
    expect(res.model).toBe("Gemini");
  });

  it("should fallback to Claude on error", async () => {
    const res = await handler(true);
    expect(res.model).toBe("Claude");
  });
});
