"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { useTime } from "@/hooks/useTime";
import { useClockStore } from "@/lib/store/clockStore";
import { ProgressRing } from "./ProgressRing";

const digitalClockVariants = cva(
    "font-tabular tracking-tight transition-all duration-300",
    {
        variants: {
            size: {
                hero: "text-[5rem] leading-none sm:text-[8rem] md:text-[12rem] lg:text-[16rem] xl:text-[20rem]",
                large: "text-4xl sm:text-6xl md:text-8xl",
                medium: "text-3xl sm:text-4xl md:text-5xl",
                small: "text-xl sm:text-2xl md:text-3xl",
                mini: "text-lg sm:text-xl",
                grid: "text-2xl sm:text-3xl md:text-4xl lg:text-5xl",
            },
            weight: {
                light: "font-light",
                normal: "font-normal",
                medium: "font-medium",
                bold: "font-bold",
                black: "font-black",
            },
        },
        defaultVariants: {
            size: "hero",
            weight: "light",
        },
    }
);

interface DigitalClockProps extends VariantProps<typeof digitalClockVariants> {
    timezone?: string;
    className?: string;
    showCity?: boolean;
    cityName?: string;
    flag?: string;
}

export function DigitalClock({
    timezone,
    size = "hero",
    weight = "light",
    className,
    showCity = false,
    cityName,
    flag,
}: DigitalClockProps) {
    const time = useTime(timezone);
    const { is24Hour, showSeconds, activeSkin } = useClockStore();

    const hours = is24Hour ? time.hours : time.hours12;
    const hoursStr = hours.toString().padStart(2, "0");
    const minutesStr = time.minutes.toString().padStart(2, "0");
    const secondsStr = time.seconds.toString().padStart(2, "0");

    // Check if current skin has glow
    const hasGlow = ["oled-night", "terminal-green", "aurora-glass", "cyber-neon", "neon-ring"].includes(activeSkin);
    const isIntenseGlow = ["cyber-neon", "neon-ring"].includes(activeSkin);

    return (
        <div className={cn("relative flex flex-col items-center justify-center", className)}>
            {/* Progress Ring for seconds - hero mode only */}
            {showSeconds === "ring" && size === "hero" && (
                <div className={cn(
                    "absolute inset-0 flex items-center justify-center pointer-events-none",
                    "w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] md:w-[560px] md:h-[560px] lg:w-[720px] lg:h-[720px]",
                    "-translate-x-1/2 -translate-y-1/2 left-1/2 top-1/2"
                )}>
                    <ProgressRing
                        progress={(time.seconds * 1000 + time.milliseconds) / 60000}
                        size={720}
                        strokeWidth={2}
                        responsive
                    />
                </div>
            )}

            {/* Time Display */}
            <div
                className={cn(
                    digitalClockVariants({ size, weight }),
                    "text-[hsl(var(--clock-foreground))]",
                    hasGlow && (isIntenseGlow ? "text-glow-intense" : "text-glow")
                )}
                style={{ fontFamily: "var(--font-mono)" }}
            >
                <span>{hoursStr}</span>
                <span className="opacity-80 animate-pulse">:</span>
                <span>{minutesStr}</span>
                {showSeconds === "digits" && (
                    <>
                        <span className="opacity-80 animate-pulse">:</span>
                        <span className="opacity-70">{secondsStr}</span>
                    </>
                )}
            </div>

            {/* AM/PM indicator for 12h mode */}
            {!is24Hour && size === "hero" && (
                <div
                    className={cn(
                        "text-lg sm:text-xl md:text-2xl font-medium tracking-widest uppercase mt-1 sm:mt-2",
                        "text-[hsl(var(--clock-muted))]"
                    )}
                >
                    {time.isPM ? "PM" : "AM"}
                </div>
            )}

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
