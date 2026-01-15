"use client";

import { Plus } from "lucide-react";
import { useClockStore } from "@/lib/store/clockStore";
import { cn } from "@/lib/utils";

interface EmptyTileProps {
    className?: string;
}

export function EmptyTile({ className }: EmptyTileProps) {
    const { toggleSearch } = useClockStore();

    return (
        <button
            onClick={toggleSearch}
            className={cn(
                "aspect-square rounded-2xl",
                "border border-dashed border-[hsl(var(--clock-muted)/0.2)]",
                "flex flex-col items-center justify-center gap-3",
                "bg-[hsl(var(--clock-foreground)/0.01)]",
                "hover:bg-[hsl(var(--clock-foreground)/0.03)]",
                "hover:border-[hsl(var(--clock-accent)/0.4)]",
                "transition-all duration-300",
                "group cursor-pointer",
                className
            )}
        >
            <div className={cn(
                "w-14 h-14 rounded-full",
                "flex items-center justify-center",
                "bg-[hsl(var(--clock-foreground)/0.04)]",
                "group-hover:bg-[hsl(var(--clock-accent)/0.1)]",
                "group-hover:scale-110",
                "transition-all duration-300"
            )}>
                <Plus className={cn(
                    "w-7 h-7 text-[hsl(var(--clock-muted)/0.5)]",
                    "group-hover:text-[hsl(var(--clock-accent))]",
                    "transition-colors duration-300"
                )} />
            </div>
            <span className={cn(
                "text-sm text-[hsl(var(--clock-muted)/0.4)] font-medium",
                "group-hover:text-[hsl(var(--clock-muted)/0.7)]",
                "transition-colors duration-300"
            )}>
                Add City
            </span>
        </button>
    );
}
