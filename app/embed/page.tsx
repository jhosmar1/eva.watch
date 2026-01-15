"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { CITY_DATABASE } from "@/config/cities";
import type { ClockType } from "@/types/clock";

// Import directly from the files, not from index
import { DigitalClock } from "@/components/clock/DigitalClock";
import { AnalogClock } from "@/components/clock/AnalogClock";

export default function EmbedPage() {
    const searchParams = useSearchParams();
    const [mounted, setMounted] = useState(false);

    // Memoize params to prevent unnecessary recalculations
    const params = useMemo(() => {
        const skin = searchParams.get("skin") || "oled-night";
        const cityParam = searchParams.get("city") || "local";
        const size = (searchParams.get("size") || "medium") as "hero" | "large" | "medium" | "small" | "mini";
        const typeParam = searchParams.get("type");
        const clockType: ClockType = typeParam === "analog" ? "analog" : "digital";

        return { skin, cityParam, size, typeParam, clockType };
    }, [searchParams]);

    // Find city timezone
    const cityData = useMemo(() => {
        return CITY_DATABASE.find(
            c => c.name.toLowerCase() === params.cityParam.toLowerCase()
        );
    }, [params.cityParam]);

    const timezone = cityData?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Apply skin class
    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        document.documentElement.className = document.documentElement.className
            .split(" ")
            .filter(c => !c.startsWith("skin-"))
            .join(" ");
        document.documentElement.classList.add(`skin-${params.skin}`);
    }, [params.skin]);

    if (!mounted) {
        return <div className="min-h-screen bg-black" />;
    }

    const clockProps = {
        timezone,
        size: params.size,
        showCity: !!cityData,
        cityName: cityData?.name,
        flag: cityData?.flag,
    };

    return (
        <div
            className={cn(
                "min-h-screen flex flex-col items-center justify-center p-4",
                "bg-[hsl(var(--clock-background))]"
            )}
        >
            {params.clockType === "digital" ? (
                <DigitalClock {...clockProps} />
            ) : (
                <AnalogClock {...clockProps} />
            )}
        </div>
    );
}
