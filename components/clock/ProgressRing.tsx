"use client";

import { cn } from "@/lib/utils";

interface ProgressRingProps {
    progress: number; // 0 to 1
    size?: number;
    strokeWidth?: number;
    className?: string;
    responsive?: boolean;
}

export function ProgressRing({
    progress,
    size = 400,
    strokeWidth = 2,
    className,
    responsive = false,
}: ProgressRingProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - progress * circumference;

    return (
        <svg
            viewBox={`0 0 ${size} ${size}`}
            className={cn(
                "transform -rotate-90",
                responsive && "w-full h-full",
                className
            )}
            style={{
                willChange: "transform",
                ...(!responsive && { width: size, height: size })
            }}
        >
            {/* Background ring */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="hsl(var(--clock-ring) / 0.2)"
                strokeWidth={strokeWidth}
            />
            {/* Progress ring */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="hsl(var(--clock-ring))"
                strokeWidth={strokeWidth}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-none"
                style={{
                    willChange: "stroke-dashoffset",
                    filter: "drop-shadow(0 0 4px hsl(var(--clock-glow)))"
                }}
            />
        </svg>
    );
}
