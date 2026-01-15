"use client";

import { useClockStore } from "@/lib/store/clockStore";
import { cn } from "@/lib/utils";
import {
    Palette,
    Maximize,
    Minimize,
    Clock,
    Volume2,
    VolumeX,
    Search,
    Settings
} from "lucide-react";

export function Controls() {
    const {
        toggleSkinsDrawer,
        toggleFullscreen,
        isFullscreen,
        toggle24Hour,
        is24Hour,
        toggleQuietMode,
        quietMode,
        toggleSearch,
        showSeconds,
        setShowSeconds,
    } = useClockStore();

    const controls = [
        {
            icon: Search,
            label: "Search cities",
            onClick: toggleSearch,
            shortcut: "/",
        },
        {
            icon: Palette,
            label: "Change skin",
            onClick: toggleSkinsDrawer,
            shortcut: "S",
        },
        {
            icon: Clock,
            label: is24Hour ? "Switch to 12h" : "Switch to 24h",
            onClick: toggle24Hour,
            shortcut: "H",
        },
        {
            icon: quietMode ? Volume2 : VolumeX,
            label: quietMode ? "Mute tick" : "Enable tick sound",
            onClick: toggleQuietMode,
            shortcut: "Q",
        },
        {
            icon: isFullscreen ? Minimize : Maximize,
            label: isFullscreen ? "Exit fullscreen" : "Fullscreen",
            onClick: toggleFullscreen,
            shortcut: "F",
        },
    ];

    return (
        <div className={cn(
            "fixed bottom-6 left-1/2 -translate-x-1/2 z-30",
            "flex items-center gap-1 p-2 rounded-2xl",
            "bg-[hsl(var(--clock-foreground)/0.05)] backdrop-blur-xl",
            "border border-[hsl(var(--clock-border)/0.3)]",
            "opacity-30 hover:opacity-100 transition-opacity duration-300"
        )}>
            {controls.map((control, i) => (
                <button
                    key={i}
                    onClick={control.onClick}
                    title={`${control.label} (${control.shortcut})`}
                    className={cn(
                        "p-3 rounded-xl transition-all",
                        "hover:bg-[hsl(var(--clock-foreground)/0.1)]",
                        "text-[hsl(var(--clock-muted))] hover:text-[hsl(var(--clock-foreground))]",
                        "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--clock-accent))]"
                    )}
                >
                    <control.icon className="w-5 h-5" />
                </button>
            ))}

            {/* Seconds display toggle */}
            <div className="h-6 w-px bg-[hsl(var(--clock-border))] mx-1" />
            <select
                value={showSeconds}
                onChange={(e) => setShowSeconds(e.target.value as "digits" | "ring" | "hidden")}
                className={cn(
                    "bg-transparent text-sm px-2 py-1 rounded-lg",
                    "text-[hsl(var(--clock-muted))]",
                    "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--clock-accent))]",
                    "cursor-pointer"
                )}
            >
                <option value="ring">Ring</option>
                <option value="digits">Digits</option>
                <option value="hidden">Hidden</option>
            </select>
        </div>
    );
}
