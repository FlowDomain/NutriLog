"use client";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface GradeIndicatorProps {
    grade: "A" | "B" | "C" | "D";
    score?: number;
    size?: "sm" | "md" | "lg";
    showScore?: boolean;
}

export function GradeIndicator({ grade, score, size = "md", showScore = false }: GradeIndicatorProps) {
    const gradeColors = {
        A: "bg-green-500 hover:bg-green-600 text-white",
        B: "bg-blue-500 hover:bg-blue-600 text-white",
        C: "bg-orange-500 hover:bg-orange-600 text-white",
        D: "bg-red-500 hover:bg-red-600 text-white",
    };

    const sizeClasses = {
        sm: "text-xs px-2 py-0.5",
        md: "text-sm px-3 py-1",
        lg: "text-base px-4 py-2",
    };

    return (
        <Badge className={cn(gradeColors[grade], sizeClasses[size])}>
            Grade {grade}
            {showScore && score !== undefined && ` (${score})`}
        </Badge>
    );
}