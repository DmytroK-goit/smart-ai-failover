import { describe, it, expect } from "vitest";

describe("API /api/ask", () => {
  it("should return structured response", async () => {
    const res = await fetch("http://localhost:3000/api/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text: "hello",
        force_error: false,
      }),
    });

    const data = await res.json();

    expect(res.status).toBe(200);
    expect(data).toHaveProperty("answer");
    expect(data).toHaveProperty("model");
    expect(data).toHaveProperty("status");
  });
});
