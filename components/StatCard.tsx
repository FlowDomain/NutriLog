"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: LucideIcon;
    trend?: {
        value: number;
        label: string;
    }
}


export function StatCard({ title, value, subtitle, icon: Icon, trend }: StatCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
                {trend && (
                    <div className="flex items-center pt-1">
                        <span
                            className={`text-xs font-medium ${trend.value > 0 ? "text-green-600" : "text-red-600"
                                }`}
                        >
                            {trend.value > 0 ? "+" : ""}
                            {trend.value}%
                        </span>
                        <span className="text-xs text-muted-foreground ml-1">{trend.label}</span>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}   