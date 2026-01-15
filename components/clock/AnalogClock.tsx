"use client";

import { cn } from "@/lib/utils";
import { useTime } from "@/hooks/useTime";
import { useClockStore } from "@/lib/store/clockStore";

interface AnalogClockProps {
    timezone?: string;
    size?: "hero" | "large" | "medium" | "small" | "mini" | "grid";
    className?: string;
    showCity?: boolean;
    cityName?: string;
    flag?: string;
}

// Base sizes for SVG viewBox calculations (used at largest breakpoint)
const BASE_SIZES = {
    hero: 500,
    large: 300,
    medium: 200,
    small: 150,
    mini: 100,
    grid: 180,
};

// Responsive CSS classes for each size
const RESPONSIVE_CLASSES = {
    hero: "w-[280px] h-[280px] sm:w-[380px] sm:h-[380px] md:w-[450px] md:h-[450px] lg:w-[500px] lg:h-[500px]",
    large: "w-[200px] h-[200px] sm:w-[250px] sm:h-[250px] md:w-[300px] md:h-[300px]",
    medium: "w-[150px] h-[150px] sm:w-[175px] sm:h-[175px] md:w-[200px] md:h-[200px]",
    small: "w-[120px] h-[120px] sm:w-[135px] sm:h-[135px] md:w-[150px] md:h-[150px]",
    mini: "w-[80px] h-[80px] sm:w-[90px] sm:h-[90px] md:w-[100px] md:h-[100px]",
    grid: "w-[140px] h-[140px] sm:w-[160px] sm:h-[160px] md:w-[180px] md:h-[180px]",
};

export function AnalogClock({
    timezone,
    size = "hero",
    className,
    showCity = false,
    cityName,
    flag,
}: AnalogClockProps) {
    const time = useTime(timezone);
    const { showSeconds, activeSkin } = useClockStore();

    // Use base size for viewBox calculations (SVG scales proportionally)
    const clockSize = BASE_SIZES[size];
    const center = clockSize / 2;
    const radius = clockSize * 0.45;

    // Calculate hand angles (smooth sweep using milliseconds)
    const secondAngle = ((time.seconds + time.milliseconds / 1000) / 60) * 360;
    const minuteAngle = ((time.minutes + time.seconds / 60) / 60) * 360;
    const hourAngle = ((time.hours % 12 + time.minutes / 60) / 12) * 360;

    // Hand lengths relative to radius
    const hourHandLength = radius * 0.5;
    const minuteHandLength = radius * 0.75;
    const secondHandLength = radius * 0.85;

    // Check if current skin has glow
    const hasGlow = ["skeleton-mechanical", "neon-ring", "dark-brass", "oled-night", "cyber-neon"].includes(activeSkin);

    // Generate hour markers
    const hourMarkers = Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * 360 - 90;
        const markerLength = i % 3 === 0 ? radius * 0.12 : radius * 0.06;
        const outerRadius = radius - 4; // Keep markers inside the circle
        const outerX = center + Math.cos((angle * Math.PI) / 180) * outerRadius;
        const outerY = center + Math.sin((angle * Math.PI) / 180) * outerRadius;
        const innerX = center + Math.cos((angle * Math.PI) / 180) * (outerRadius - markerLength);
        const innerY = center + Math.sin((angle * Math.PI) / 180) * (outerRadius - markerLength);

        return (
            <line
                key={i}
                x1={innerX}
                y1={innerY}
                x2={outerX}
                y2={outerY}
                stroke="hsl(var(--clock-foreground))"
                strokeWidth={i % 3 === 0 ? 2.5 : 1.5}
                strokeLinecap="round"
            />
        );
    });

    return (
        <div className={cn("relative flex flex-col items-center justify-center", className)}>
            <svg
                viewBox={`0 0 ${clockSize} ${clockSize}`}
                className={cn(
                    RESPONSIVE_CLASSES[size],
                    hasGlow && "clock-glow"
                )}
                style={{ willChange: "transform" }}
            >
                {/* Clock face background */}
                <circle
                    cx={center}
                    cy={center}
                    r={radius}
                    fill="hsl(var(--clock-background))"
                    stroke="hsl(var(--clock-border))"
                    strokeWidth={1.5}
                />

                {/* Hour markers */}
                {hourMarkers}

                {/* Hour hand */}
                <line
                    x1={center}
                    y1={center}
                    x2={center + Math.sin((hourAngle * Math.PI) / 180) * hourHandLength}
                    y2={center - Math.cos((hourAngle * Math.PI) / 180) * hourHandLength}
                    stroke="hsl(var(--clock-foreground))"
                    strokeWidth={size === "hero" ? 8 : 4}
                    strokeLinecap="round"
                    style={{ willChange: "transform" }}
                />

                {/* Minute hand */}
                <line
                    x1={center}
                    y1={center}
                    x2={center + Math.sin((minuteAngle * Math.PI) / 180) * minuteHandLength}
                    y2={center - Math.cos((minuteAngle * Math.PI) / 180) * minuteHandLength}
                    stroke="hsl(var(--clock-foreground))"
                    strokeWidth={size === "hero" ? 5 : 3}
                    strokeLinecap="round"
                    style={{ willChange: "transform" }}
                />

                {/* Second hand */}
                {showSeconds !== "hidden" && (
                    <>
                        <line
                            x1={center}
                            y1={center}
                            x2={center + Math.sin((secondAngle * Math.PI) / 180) * secondHandLength}
                            y2={center - Math.cos((secondAngle * Math.PI) / 180) * secondHandLength}
                            stroke="hsl(var(--clock-accent))"
                            strokeWidth={size === "hero" ? 2 : 1}
                            strokeLinecap="round"
                            style={{ willChange: "transform" }}
                        />
                        {/* Second hand tail */}
                        <line
                            x1={center}
                            y1={center}
                            x2={center - Math.sin((secondAngle * Math.PI) / 180) * (radius * 0.15)}
                            y2={center + Math.cos((secondAngle * Math.PI) / 180) * (radius * 0.15)}
                            stroke="hsl(var(--clock-accent))"
                            strokeWidth={size === "hero" ? 2 : 1}
                            strokeLinecap="round"
                            style={{ willChange: "transform" }}
                        />
                    </>
                )}

                {/* Center cap */}
                <circle
                    cx={center}
                    cy={center}
                    r={size === "hero" ? 10 : 5}
                    fill="hsl(var(--clock-accent))"
                />
            </svg>

            {/* City name */}
            {showCity && cityName && (
                <div className="mt-2 sm:mt-4 flex items-center gap-1.5 sm:gap-2 text-[hsl(var(--clock-muted))]">
                    {flag && <span className="text-base sm:text-lg">{flag}</span>}
                    <span className="text-xs sm:text-sm font-medium tracking-wide uppercase">{cityName}</span>
                </div>
            )}
        </div>
    );
}
