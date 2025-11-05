"use client"

interface ProgressRingProps {
    progress: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    label?: string;
    value?: string;

}

export function ProgressRing({ progress, size = 120, strokeWidth = 8, color = "#3b82f6", label, value, }: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (progress / 100) * circumference

    return (
        <div className="relative inline-flex items-center justify-center">
            <svg width={size} height={size} className="transform -rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                {value && <div className="text-2xl font-bold">{value}</div>}
                {label && <div className="text-xs text-muted-foreground">{label}</div>}
            </div>
        </div>
    );
}