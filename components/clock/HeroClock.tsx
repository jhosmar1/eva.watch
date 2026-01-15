"use client";

import { useClockStore } from "@/lib/store/clockStore";
import { Clock } from "./Clock";
import { cn } from "@/lib/utils";

// Get city name from timezone
const getCityNameFromTimezone = (timezone: string) => {
    const parts = timezone.split("/");
    const cityPart = parts[parts.length - 1];
    return cityPart.replace(/_/g, " ");
};

interface HeroClockProps {
    className?: string;
}

export function HeroClock({ className }: HeroClockProps) {
    const { cities, heroCityId } = useClockStore();
    const heroCity = cities.find(c => c.id === heroCityId) || cities[0];

    if (!heroCity) return null;

    // Convert "Local" to actual city name from timezone
    const displayName = heroCity.name === "Local"
        ? getCityNameFromTimezone(heroCity.timezone)
        : heroCity.name;

    return (
        <div className={cn(
            "flex-1 flex items-center justify-center min-h-[50vh]",
            "px-4 sm:px-6 md:px-8",
            className
        )}>
            <Clock
                timezone={heroCity.timezone}
                size="hero"
                showCity
                cityName={displayName}
                flag={heroCity.flag}
            />
        </div>
    );
}
