"use client";

import { useClockStore } from "@/lib/store/clockStore";
import { DigitalClock } from "./DigitalClock";
import { AnalogClock } from "./AnalogClock";
import type { ClockType } from "@/types/clock";

interface ClockProps {
    timezone?: string;
    size?: "hero" | "large" | "medium" | "small" | "mini" | "grid";
    className?: string;
    showCity?: boolean;
    cityName?: string;
    flag?: string;
    type?: ClockType; // Override store value (for embeds)
}

export function Clock({ type, ...props }: ClockProps) {
    const { clockType: storeClockType } = useClockStore();
    const clockType = type ?? storeClockType;

    if (clockType === "analog") {
        return <AnalogClock {...props} />;
    }

    return <DigitalClock {...props} />;
}
