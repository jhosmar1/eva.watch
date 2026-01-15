"use client";

import { useClockStore } from "@/lib/store/clockStore";
import { Clock } from "./Clock";
import { cn } from "@/lib/utils";
import { Reorder, motion } from "framer-motion";
import { X, GripVertical } from "lucide-react";

// Get city name from timezone
const getCityNameFromTimezone = (timezone: string) => {
    const parts = timezone.split("/");
    const cityPart = parts[parts.length - 1];
    return cityPart.replace(/_/g, " ");
};

interface WorldClockRowProps {
    className?: string;
}

export function WorldClockRow({ className }: WorldClockRowProps) {
    const { cities, heroCityId, swapWithHero, removeCity, reorderCities } = useClockStore();

    // Filter out the hero city - show all remaining cities
    const worldCities = cities.filter(c => c.id !== heroCityId);

    if (worldCities.length === 0) return null;

    const handleReorder = (newOrder: typeof worldCities) => {
        // Find the hero city
        const heroCity = cities.find(c => c.id === heroCityId);
        if (!heroCity) return;

        // Find original hero position
        const heroIndex = cities.findIndex(c => c.id === heroCityId);

        // Insert hero back at its original position
        const fullList = [...newOrder];
        fullList.splice(heroIndex, 0, heroCity);

        reorderCities(fullList);
    };

    return (
        <div className={cn(
            "overflow-x-auto scrollbar-hide",
            className
        )}>
            <Reorder.Group
                axis="x"
                values={worldCities}
                onReorder={handleReorder}
                className={cn(
                    "flex items-center justify-center gap-6 md:gap-10 py-6 px-6",
                    "min-w-max"
                )}
            >
                {worldCities.map((city) => (
                    <Reorder.Item
                        key={city.id}
                        value={city}
                        className="relative group cursor-grab active:cursor-grabbing"
                        whileDrag={{ scale: 1.05, zIndex: 50 }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            {/* Drag handle indicator */}
                            <div className={cn(
                                "absolute -top-2 left-1/2 -translate-x-1/2",
                                "opacity-0 group-hover:opacity-50 transition-opacity",
                                "text-[hsl(var(--clock-muted))]"
                            )}>
                                <GripVertical className="w-4 h-4 rotate-90" />
                            </div>

                            <button
                                onClick={() => swapWithHero(city.id)}
                                className={cn(
                                    "flex flex-col items-center gap-2 p-4 rounded-xl",
                                    "hover:bg-[hsl(var(--clock-foreground)/0.05)]",
                                    "transition-all duration-200 cursor-pointer",
                                    "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--clock-accent))]"
                                )}
                            >
                                <Clock
                                    timezone={city.timezone}
                                    size="small"
                                />
                                <div className="flex items-center gap-1.5 text-[hsl(var(--clock-muted))]">
                                    <span className="text-base">{city.flag}</span>
                                    <span className="text-xs font-medium tracking-wide uppercase">
                                        {city.name === "Local" ? getCityNameFromTimezone(city.timezone) : city.name}
                                    </span>
                                </div>
                            </button>
                            {/* Remove button - shows on hover/always on touch */}
                            {city.id !== "local" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        removeCity(city.id);
                                    }}
                                    className={cn(
                                        "absolute -top-1 -right-1 p-1.5 rounded-full",
                                        "bg-[hsl(var(--clock-foreground)/0.1)] hover:bg-red-500",
                                        "text-[hsl(var(--clock-muted))] hover:text-white",
                                        "opacity-70 sm:opacity-0 group-hover:opacity-100",
                                        "transition-all duration-200",
                                        "focus:outline-none focus:opacity-100"
                                    )}
                                    title="Remove city"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            )}
                        </motion.div>
                    </Reorder.Item>
                ))}
            </Reorder.Group>
        </div>
    );
}
