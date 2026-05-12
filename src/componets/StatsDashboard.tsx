"use client";

import { useEffect, useState } from "react";

type Stats = {
    total: number;
    gemini: number;
    claude: number;
    success: number;
    fallback: number;
    avgTime: number;
};

export default function StatsDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);

    const fetchStats = async () => {
        const res = await fetch("/api/stats");
        const data = await res.json();
        setStats(data);
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (!stats) return <p>Loading stats...</p>;

    return (
        <div className="grid grid-cols-3 gap-6 mt-10">
            <Card title="Total Requests" value={stats.total} />
            <Card title="Gemini" value={stats.gemini} />
            <Card title="Claude" value={stats.claude} />
            <Card title="Success" value={stats.success} />
            <Card title="Fallback" value={stats.fallback} />
            <Card title="Avg Time (ms)" value={stats.avgTime} />
        </div>
    );
}

function Card({ title, value }: any) {
    return (
        <div className="border rounded-xl p-6 shadow-sm">
            <p className="text-gray-500">{title}</p>
            <h2 className="text-3xl font-bold">{value}</h2>
        </div>
    );
}