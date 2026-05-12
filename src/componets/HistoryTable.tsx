"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ModelBadge from "./ModelBadge";

type LogItem = {
    id: string;
    prompt: string;
    response: string;
    model: "Gemini" | "Claude";
    status: "success" | "fallback";
    execution_time: number;
    created_at: string;
};

export default function HistoryTable() {
    const [logs, setLogs] = useState<LogItem[]>([]);

    useEffect(() => {
        const fetchLogs = async () => {
            const { data } = await supabase
                .from("ai_logs")
                .select("*")
                .order("created_at", { ascending: false });

            setLogs((data as LogItem[]) || []);
        };

        fetchLogs();

        const channel = supabase
            .channel("ai_logs")
            .on(
                "postgres_changes",
                { event: "*", schema: "public", table: "ai_logs" },
                (payload) => {
                    setLogs((prev) => [
                        payload.new as LogItem,
                        ...prev,
                    ]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    return (
        <div className="border rounded-xl overflow-hidden bg-white">
            <table className="w-full text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Prompt</th>
                        <th>Model</th>
                        <th>Status</th>
                        <th>Time</th>
                    </tr>
                </thead>

                <tbody>
                    {logs.map((log) => (
                        <tr key={log.id} className="border-t">
                            <td className="p-3">{log.prompt}</td>

                            <td>
                                <ModelBadge model={log.model} />
                            </td>

                            <td>
                                <span
                                    className={
                                        log.status === "success"
                                            ? "text-green-600"
                                            : "text-orange-500"
                                    }
                                >
                                    {log.status}
                                </span>
                            </td>

                            <td>{log.execution_time} ms</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}