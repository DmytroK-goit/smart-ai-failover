"use client";

import { useState } from "react";

type ResponseData = {
    answer: string;
    model: string;
    status: string;
    execution_time: number;
};

export default function PromptForm() {
    const [text, setText] = useState("");
    const [forceError, setForceError] = useState(false);
    const [loading, setLoading] = useState(false);
    const [response, setResponse] = useState<ResponseData | null>(null);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        if (!text.trim()) {
            setError("Prompt required");
            return;
        }

        setLoading(true);
        setError("");
        setResponse(null);

        try {
            const res = await fetch("/api/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    text,
                    force_error: forceError,
                }),
            });

            const data: ResponseData | { error: string } = await res.json();

            if (!res.ok) {
                throw new Error("error" in data ? data.error : "Request failed");
            }

            setResponse(data as ResponseData);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Unexpected error");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter prompt..."
                className="w-full h-40 border rounded-xl p-4"
            />

            <label className="flex gap-3">
                <input
                    type="checkbox"
                    checked={forceError}
                    onChange={() => setForceError(!forceError)}
                />
                Simulate Gemini Failure
            </label>

            <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-black text-white px-6 py-3 rounded-xl disabled:opacity-50"
            >
                {loading ? "Loading..." : "Send"}
            </button>

            {error && <p className="text-red-500">{error}</p>}

            {response && (
                <div className="border rounded-xl p-5 space-y-3">
                    <p>
                        <b>Model:</b> {response.model}
                    </p>
                    <p>
                        <b>Status:</b> {response.status}
                    </p>
                    <p>
                        <b>Time:</b> {response.execution_time} ms
                    </p>
                    <p>{response.answer}</p>
                </div>
            )}
        </div>
    );
}