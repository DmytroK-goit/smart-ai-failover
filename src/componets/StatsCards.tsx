"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type LogItem = {
    id: string;
    prompt: string;
    response: string;
    model: "Gemini" | "Claude";
    status: "success" | "fallback";
    execution_time: number;
    created_at: string;
};

type Stats = {
    total: number;
    success: number;
    fallback: number;
    avg: number;
};

export default function StatsCards() {
    const [stats, setStats] = useState<Stats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            const { data } = await supabase
                .from("ai_logs")
                .select("*");

            const logs = (data as LogItem[]) || [];

            if (!logs.length) return;

            const total = logs.length;
            const fallback = logs.filter(d => d.status === "fallback").length;
            const success = total - fallback;

            const avg =
                logs.reduce((acc, d) => acc + d.execution_time, 0) / total;

            setStats({
                total,
                success,
                fallback,
                avg,
            });
        };

        fetchStats();
    }, []);

    if (!stats) return null;

    return (
        <div className="grid grid-cols-4 gap-4 my-8">
            <div className="p-4 border rounded-xl">
                Total: {stats.total}
            </div>

            <div className="p-4 border rounded-xl text-green-600">
                Success: {stats.success}
            </div>

            <div className="p-4 border rounded-xl text-orange-500">
                Fallback: {stats.fallback}
            </div>

            <div className="p-4 border rounded-xl">
                Avg: {Math.round(stats.avg)} ms
            </div>
        </div>
    );
}