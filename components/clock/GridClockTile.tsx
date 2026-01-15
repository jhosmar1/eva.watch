"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, X } from "lucide-react";
import { useClockStore } from "@/lib/store/clockStore";
import { Clock } from "./Clock";
import { cn } from "@/lib/utils";
import type { City } from "@/types/clock";

interface GridClockTileProps {
    city: City;
    isHome?: boolean;
}

export function GridClockTile({ city, isHome = false }: GridClockTileProps) {
    const { removeCity, cities } = useClockStore();
    const canRemove = cities.length > 1 && city.id !== "local";

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: city.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "relative aspect-square rounded-2xl",
                "bg-[hsl(var(--clock-foreground)/0.02)]",
                "border transition-all duration-200",
                "flex flex-col",
                isHome
                    ? "border-[hsl(var(--clock-accent)/0.6)] shadow-[0_0_30px_hsl(var(--clock-glow))] bg-[hsl(var(--clock-accent)/0.03)]"
                    : "border-[hsl(var(--clock-border)/0.3)] hover:border-[hsl(var(--clock-border)/0.5)]",
                isDragging && "opacity-50 scale-105 z-50",
                "group"
            )}
        >
            {/* Drag handle - visible on touch, hover on desktop */}
            <button
                {...attributes}
                {...listeners}
                className={cn(
                    "absolute top-1.5 left-1.5 sm:top-2 sm:left-2 p-2 sm:p-1 rounded-md z-10",
                    "opacity-70 sm:opacity-0 group-hover:opacity-100",
                    "bg-[hsl(var(--clock-foreground)/0.08)]",
                    "hover:bg-[hsl(var(--clock-foreground)/0.15)]",
                    "text-[hsl(var(--clock-muted)/0.7)]",
                    "transition-all duration-200 cursor-grab active:cursor-grabbing",
                    "touch-none min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0",
                    "flex items-center justify-center"
                )}
            >
                <GripVertical className="w-5 h-5 sm:w-3.5 sm:h-3.5" />
            </button>

            {/* Remove button - visible on touch, hover on desktop */}
            {canRemove && (
                <button
                    onClick={() => removeCity(city.id)}
                    className={cn(
                        "absolute top-1.5 right-1.5 sm:top-2 sm:right-2 p-2 sm:p-1 rounded-md z-10",
                        "opacity-70 sm:opacity-0 group-hover:opacity-100",
                        "bg-[hsl(var(--clock-foreground)/0.08)]",
                        "hover:bg-red-500/20 hover:text-red-400",
                        "text-[hsl(var(--clock-muted)/0.7)]",
                        "transition-all duration-200",
                        "min-w-[44px] min-h-[44px] sm:min-w-0 sm:min-h-0",
                        "flex items-center justify-center"
                    )}
                >
                    <X className="w-5 h-5 sm:w-3.5 sm:h-3.5" />
                </button>
            )}

            {/* Clock - takes most of the space */}
            <div className="flex-1 flex items-center justify-center min-h-0 p-2 sm:p-3">
                <div className="scale-[0.85] sm:scale-100 md:scale-110 lg:scale-125 transition-transform">
                    <Clock
                        timezone={city.timezone}
                        size="grid"
                    />
                </div>
            </div>

            {/* City label - compact footer */}
            <div className={cn(
                "py-2 px-3 text-center",
                "border-t border-[hsl(var(--clock-border)/0.2)]",
                "bg-[hsl(var(--clock-foreground)/0.02)]",
                "rounded-b-2xl"
            )}>
                <div className="flex items-center justify-center gap-1.5">
                    <span className="text-sm">{city.flag}</span>
                    <span className={cn(
                        "text-sm font-medium truncate max-w-[90%]",
                        isHome
                            ? "text-[hsl(var(--clock-accent))]"
                            : "text-[hsl(var(--clock-foreground)/0.8)]"
                    )}>
                        {city.name}
                    </span>
                </div>
            </div>
        </div>
    );
}
