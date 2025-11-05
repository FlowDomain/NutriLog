"use client"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";

interface GradeDistributionProps {
    distribution: {
        A: number,
        B: number,
        C: number,
        D: number,
    }
}

const GRADE_COLORS = {
    A: "#10b981",
    B: "#3b82f6",
    C: "#f59e0b",
    D: "#ef4444",
}

export function GradeDistribution({ distribution }: GradeDistributionProps) {
    const data = [
        { grade: "A", count: distribution.A },
        { grade: "B", count: distribution.B },
        { grade: "C", count: distribution.C },
        { grade: "D", count: distribution.D },
    ]


    return (
        <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="grade" stroke="#888888" fontSize={12} tickLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                    }}
                />
                <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={GRADE_COLORS[entry.grade as keyof typeof GRADE_COLORS]}
                        />
                    ))}
                </Bar>
            </BarChart>
        </ResponsiveContainer>
    );
}