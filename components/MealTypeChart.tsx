"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

interface MealTypeChartProps {
    distribution: {
        breakfast: number;
        lunch: number;
        dinner: number;
        snack: number;
    }
}

const COLORS = {
    breakfast: "#f59e0b",
    lunch: "#10b981",
    dinner: "#3b82f6",
    snack: "#8b5cf6",
}

export function MealTypeChart({ distribution }: MealTypeChartProps) {
    const data = [
        { name: "Breakfast", value: distribution.breakfast },
        { name: "Lunch", value: distribution.lunch },
        { name: "Dinner", value: distribution.dinner },
        { name: "Snack", value: distribution.snack },
    ].filter((item) => item.value > 0)

    return (
        <ResponsiveContainer width="100%" height={250}>
            <PieChart>
                <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
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