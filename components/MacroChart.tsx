"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface MacroChartProps {
    macros: {
        carbs: number
        protein: number
        fats: number
    }
}

const COLORS = {
    carbs: "#3b82f6",
    protein: "#10b981",
    fats: "#f59e0b",
}


export function MacroChart({ macros }: MacroChartProps) {
    const total = macros.carbs + macros.protein + macros.fats

    const data = [
        {
            name: "Carbs",
            value: Math.round(macros.carbs),
            percentage: Math.round((macros.carbs / total) * 100)
        },
        {
            name: "Protein",
            value: Math.round(macros.protein),
            percentage: Math.round((macros.protein / total) * 100)
        },
        {
            name: "Fats",
            value: Math.round(macros.fats),
            percentage: Math.round((macros.fats / total) * 100)
        }
    ]

    return (
        <ResponsiveContainer width="100%" height={300}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                >
                    {data.map((entry, index) => (
                        <Cell
                            key={`cell-${index}`}
                            fill={COLORS[entry.name.toLowerCase() as keyof typeof COLORS]}
                        />
                    ))}
                </Pie>
                <Tooltip
                    formatter={(value: number) => `${value}g`}
                    contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                    }}
                />
                <Legend />
            </PieChart>
        </ResponsiveContainer>
    );
}