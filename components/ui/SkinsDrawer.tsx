"use client";

import { useClockStore } from "@/lib/store/clockStore";
import { ALL_SKINS } from "@/types/clock";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
    X,
    Sparkles,
    Search,
    Maximize,
    Minimize,
    Volume2,
    VolumeX,
    Settings,
    LayoutGrid,
    Square,
} from "lucide-react";

export function SkinsDrawer() {
    const {
        skinsDrawerOpen,
        toggleSkinsDrawer,
        activeSkin,
        setSkin,
        clockType,
        setClockType,
        layoutMode,
        toggleLayoutMode,
        toggleSearch,
        toggleFullscreen,
        isFullscreen,
        toggle24Hour,
        is24Hour,
        toggleQuietMode,
        quietMode,
        showSeconds,
        setShowSeconds,
    } = useClockStore();

    const filteredSkins = ALL_SKINS.filter(
        (skin) => skin.category === clockType
    );

    return (
        <AnimatePresence>
            {skinsDrawerOpen && (
                <motion.div
                    initial={{ x: "100%" }}
                    animate={{ x: 0 }}
                    exit={{ x: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 200 }}
                    className={cn(
                        "fixed right-0 top-0 bottom-0 w-80 max-w-[85vw] z-50",
                        "bg-[hsl(var(--clock-background)/0.95)] backdrop-blur-xl",
                        "border-l border-[hsl(var(--clock-border))]",
                        "flex flex-col shadow-2xl"
                    )}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-[hsl(var(--clock-border))]">
                        <h2 className="text-lg font-semibold text-[hsl(var(--clock-foreground))]">
                            Settings
                        </h2>
                        <button
                            onClick={toggleSkinsDrawer}
                            className="p-2 rounded-lg hover:bg-[hsl(var(--clock-foreground)/0.1)] transition-colors"
                        >
                            <X className="w-5 h-5 text-[hsl(var(--clock-foreground))]" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto flex flex-col min-h-0">
                        {/* Quick Actions - Mobile only */}
                        <div className="p-4 border-b border-[hsl(var(--clock-border))] md:hidden">
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => {
                                        toggleSearch();
                                        toggleSkinsDrawer();
                                    }}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-all min-h-[44px]",
                                        "bg-[hsl(var(--clock-foreground)/0.1)] text-[hsl(var(--clock-foreground))]",
                                        "hover:bg-[hsl(var(--clock-foreground)/0.15)] active:scale-95"
                                    )}
                                >
                                    <Search className="w-5 h-5" />
                                    Add City
                                </button>
                                <button
                                    onClick={toggleFullscreen}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-all min-h-[44px]",
                                        "bg-[hsl(var(--clock-foreground)/0.1)] text-[hsl(var(--clock-foreground))]",
                                        "hover:bg-[hsl(var(--clock-foreground)/0.15)] active:scale-95"
                                    )}
                                >
                                    {isFullscreen ? (
                                        <Minimize className="w-5 h-5" />
                                    ) : (
                                        <Maximize className="w-5 h-5" />
                                    )}
                                    {isFullscreen ? "Exit" : "Fullscreen"}
                                </button>
                                <button
                                    onClick={toggleQuietMode}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-all min-h-[44px]",
                                        !quietMode
                                            ? "bg-[hsl(var(--clock-accent))] text-white"
                                            : "bg-[hsl(var(--clock-foreground)/0.1)] text-[hsl(var(--clock-foreground))]",
                                        "hover:bg-[hsl(var(--clock-foreground)/0.15)] active:scale-95"
                                    )}
                                >
                                    {quietMode ? (
                                        <VolumeX className="w-5 h-5" />
                                    ) : (
                                        <Volume2 className="w-5 h-5" />
                                    )}
                                    Tick
                                </button>
                                <button
                                    onClick={toggleLayoutMode}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-3 rounded-lg text-sm transition-all min-h-[44px]",
                                        "bg-[hsl(var(--clock-foreground)/0.1)] text-[hsl(var(--clock-foreground))]",
                                        "hover:bg-[hsl(var(--clock-foreground)/0.15)] active:scale-95"
                                    )}
                                >
                                    {layoutMode === "grid" ? (
                                        <Square className="w-5 h-5" />
                                    ) : (
                                        <LayoutGrid className="w-5 h-5" />
                                    )}
                                    {layoutMode === "grid" ? "Hero" : "Grid"}
                                </button>
                            </div>
                        </div>

                        {/* Clock Type Toggle - Mobile only */}
                        <div className="p-4 border-b border-[hsl(var(--clock-border))] md:hidden">
                            <label className="text-xs font-medium text-[hsl(var(--clock-muted))] uppercase tracking-wide mb-2 block">
                                Clock Type
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setClockType("digital")}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-lg font-medium transition-all min-h-[44px] active:scale-95",
                                        clockType === "digital"
                                            ? "bg-[hsl(var(--clock-accent))] text-white"
                                            : "bg-[hsl(var(--clock-foreground)/0.1)] text-[hsl(var(--clock-foreground))]"
                                    )}
                                >
                                    Digital
                                </button>
                                <button
                                    onClick={() => setClockType("analog")}
                                    className={cn(
                                        "flex-1 py-3 px-4 rounded-lg font-medium transition-all min-h-[44px] active:scale-95",
                                        clockType === "analog"
                                            ? "bg-[hsl(var(--clock-accent))] text-white"
                                            : "bg-[hsl(var(--clock-foreground)/0.1)] text-[hsl(var(--clock-foreground))]"
                                    )}
                                >
                                    Analog
                                </button>
                            </div>
                        </div>

                        {/* Clock-type specific settings - Mobile only */}
                        <div className="p-4 border-b border-[hsl(var(--clock-border))] md:hidden">
                            <label className="text-xs font-medium text-[hsl(var(--clock-muted))] uppercase tracking-wide mb-2 block">
                                <Settings className="w-3 h-3 inline mr-1" />
                                {clockType === "digital" ? "Digital Options" : "Analog Options"}
                            </label>

                            {clockType === "digital" ? (
                                <div className="space-y-3">
                                    {/* 24h Toggle */}
                                    <div className="flex items-center justify-between min-h-[44px]">
                                        <span className="text-sm text-[hsl(var(--clock-foreground))]">
                                            24-hour format
                                        </span>
                                        <button
                                            onClick={toggle24Hour}
                                            className={cn(
                                                "w-14 h-8 rounded-full transition-all relative",
                                                is24Hour
                                                    ? "bg-[hsl(var(--clock-accent))]"
                                                    : "bg-[hsl(var(--clock-foreground)/0.2)]"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "absolute top-1 w-6 h-6 rounded-full bg-white transition-all",
                                                    is24Hour ? "left-7" : "left-1"
                                                )}
                                            />
                                        </button>
                                    </div>

                                    {/* Seconds Display */}
                                    <div>
                                        <span className="text-sm text-[hsl(var(--clock-foreground))] block mb-2">
                                            Seconds display
                                        </span>
                                        <div className="flex gap-2">
                                            {(["digits", "ring", "hidden"] as const).map((opt) => (
                                                <button
                                                    key={opt}
                                                    onClick={() => setShowSeconds(opt)}
                                                    className={cn(
                                                        "flex-1 py-2.5 px-2 rounded-lg text-sm capitalize transition-all min-h-[44px]",
                                                        showSeconds === opt
                                                            ? "bg-[hsl(var(--clock-accent))] text-white"
                                                            : "bg-[hsl(var(--clock-foreground)/0.1)] text-[hsl(var(--clock-foreground))]"
                                                    )}
                                                >
                                                    {opt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {/* Show seconds hand */}
                                    <div className="flex items-center justify-between min-h-[44px]">
                                        <span className="text-sm text-[hsl(var(--clock-foreground))]">
                                            Show seconds hand
                                        </span>
                                        <button
                                            onClick={() =>
                                                setShowSeconds(showSeconds === "hidden" ? "digits" : "hidden")
                                            }
                                            className={cn(
                                                "w-14 h-8 rounded-full transition-all relative",
                                                showSeconds !== "hidden"
                                                    ? "bg-[hsl(var(--clock-accent))]"
                                                    : "bg-[hsl(var(--clock-foreground)/0.2)]"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "absolute top-1 w-6 h-6 rounded-full bg-white transition-all",
                                                    showSeconds !== "hidden" ? "left-7" : "left-1"
                                                )}
                                            />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Skins grid - Scrollable */}
                        <div className="flex-1 overflow-y-auto p-4">
                            <label className="text-xs font-medium text-[hsl(var(--clock-muted))] uppercase tracking-wide mb-3 block">
                                Skins
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                {filteredSkins.map((skin) => (
                                    <button
                                        key={skin.id}
                                        onClick={() => setSkin(skin.id)}
                                        className={cn(
                                            "relative p-4 rounded-xl border-2 transition-all",
                                            "flex flex-col items-center gap-2",
                                            activeSkin === skin.id
                                                ? "border-[hsl(var(--clock-accent))] ring-2 ring-[hsl(var(--clock-accent)/0.3)]"
                                                : "border-[hsl(var(--clock-border))] hover:border-[hsl(var(--clock-accent)/0.5)]"
                                        )}
                                        style={{
                                            backgroundColor: `hsl(${skin.background})`,
                                        }}
                                    >
                                        {/* Mini preview */}
                                        <div
                                            className="text-2xl font-mono font-light"
                                            style={{
                                                color: `hsl(${skin.foreground})`,
                                                textShadow:
                                                    skin.glowIntensity > 0
                                                        ? `0 0 ${skin.glowIntensity * 5}px hsl(${skin.accent})`
                                                        : "none",
                                            }}
                                        >
                                            12:34
                                        </div>
                                        <span
                                            className="text-xs font-medium"
                                            style={{ color: `hsl(${skin.foreground} / 0.7)` }}
                                        >
                                            {skin.name}
                                        </span>

                                        {/* Ambient gradient indicator */}
                                        {skin.hasAmbientGradient && (
                                            <Sparkles
                                                className="absolute top-2 right-2 w-3 h-3"
                                                style={{ color: `hsl(${skin.accent})` }}
                                            />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Keyboard shortcuts hint - Desktop only */}
                    <div className="hidden md:block p-3 border-t border-[hsl(var(--clock-border))] text-xs text-[hsl(var(--clock-muted))]">
                        <span className="font-medium block mb-1">Shortcuts</span>
                        <div className="space-y-0.5">
                            <div><kbd className="font-mono">S</kbd> · Settings</div>
                            <div><kbd className="font-mono">/</kbd> · Search cities</div>
                            <div><kbd className="font-mono">F</kbd> · Fullscreen</div>
                            <div><kbd className="font-mono">G</kbd> · Grid layout</div>
                            <div><kbd className="font-mono">T</kbd> · Toggle clock type</div>
                            <div><kbd className="font-mono">D</kbd> · Seconds display</div>
                            <div><kbd className="font-mono">←→</kbd> · Cycle skins</div>
                            <div><kbd className="font-mono">Q</kbd> · Tick sound</div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
