"use client"


// LINE CHART FOR CALORIE TRENDS
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";
import { format } from "date-fns";

interface CalorieChartProps {
    data: Array<{
        date: string;
        calories: number;
        meals: number
    }>
    target?: number
}

export function CalorieChart({ data, target }: CalorieChartProps) {
    const chartData = data.map((item) => ({
        date: format(new Date(item.date), "MMM dd"),
        calories: item.calories,
        target: target || 2000,
    }))

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                    dataKey="date"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} />
                <Tooltip
                    contentStyle={{
                        backgroundColor: "white",
                        border: "1px solid #e5e7eb",
                        borderRadius: "8px",
                    }}
                />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="calories"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                    name="Calories"
                />
                {target && (
                    <Line
                        type="monotone"
                        dataKey="target"
                        stroke="#94a3b8"
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        name="Target"
                    />
                )}
            </LineChart>
        </ResponsiveContainer>
    );
}