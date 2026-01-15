"use client";

import { useEffect, useState, useRef } from "react";
import { useClockStore } from "@/lib/store/clockStore";
import { HeroClock, WorldClockRow, WorldGrid } from "@/components/clock";
import { SkinsDrawer, CitySearch, KeyboardShortcuts, AmbientGradient, ServiceWorkerRegistration, EmbedModal } from "@/components/ui";
import { useTick } from "@/hooks/useTick";
import { cn } from "@/lib/utils";
import { Settings, Code } from "lucide-react";

export default function ClockApp() {
    const { activeSkin, isFullscreen, toggleSkinsDrawer, skinsDrawerOpen, layoutMode, toggleEmbedModal } = useClockStore();
    const [mounted, setMounted] = useState(false);
    const [cursorHidden, setCursorHidden] = useState(false);
    const wakeLockRef = useRef<WakeLockSentinel | null>(null);

    // Enable tick sound
    useTick();

    // Handle hydration
    useEffect(() => {
        setMounted(true);
    }, []);

    // Wake lock to prevent screen sleep
    useEffect(() => {
        const requestWakeLock = async () => {
            try {
                if ("wakeLock" in navigator) {
                    wakeLockRef.current = await navigator.wakeLock.request("screen");
                }
            } catch {
                // Wake lock request failed (e.g., low battery, tab not visible)
            }
        };

        const releaseWakeLock = async () => {
            if (wakeLockRef.current) {
                await wakeLockRef.current.release();
                wakeLockRef.current = null;
            }
        };

        // Request wake lock when app is visible
        requestWakeLock();

        // Re-acquire wake lock when tab becomes visible again
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") {
                requestWakeLock();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            releaseWakeLock();
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, []);

    // Hide cursor in fullscreen after inactivity
    useEffect(() => {
        if (!isFullscreen) {
            setCursorHidden(false);
            return;
        }

        let timeout: NodeJS.Timeout;

        const handleMove = () => {
            setCursorHidden(false);
            clearTimeout(timeout);
            timeout = setTimeout(() => setCursorHidden(true), 3000);
        };

        window.addEventListener("mousemove", handleMove);
        timeout = setTimeout(() => setCursorHidden(true), 3000);

        return () => {
            window.removeEventListener("mousemove", handleMove);
            clearTimeout(timeout);
        };
    }, [isFullscreen]);

    // Apply skin class to html element
    useEffect(() => {
        if (!mounted) return;

        // Remove all skin classes
        document.documentElement.className = document.documentElement.className
            .split(" ")
            .filter(c => !c.startsWith("skin-"))
            .join(" ");

        // Add current skin class
        document.documentElement.classList.add(`skin-${activeSkin}`);
    }, [activeSkin, mounted]);

    if (!mounted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-4xl font-mono text-cyan-400">Loading...</div>
            </div>
        );
    }

    return (
        <main
            className={cn(
                "min-h-screen flex flex-col relative overflow-hidden transition-skin",
                "bg-[hsl(var(--clock-background))]",
                cursorHidden && "cursor-hidden"
            )}
        >
            {/* Ambient gradient background */}
            <AmbientGradient />

            {/* Main clock area */}
            <div className="relative z-10 flex-1 flex flex-col">
                {layoutMode === "hero" ? (
                    <>
                        <HeroClock />
                        <WorldClockRow />
                    </>
                ) : (
                    <WorldGrid />
                )}
            </div>

            {/* Settings button */}
            {!skinsDrawerOpen && (
                <div className="fixed top-3 right-3 sm:top-6 sm:right-6 z-30 flex flex-col gap-2">
                    <button
                        onClick={toggleSkinsDrawer}
                        className={cn(
                            "p-3 sm:p-3 rounded-full",
                            "min-w-[44px] min-h-[44px]",
                            "bg-[hsl(var(--clock-foreground)/0.1)] backdrop-blur-sm",
                            "hover:bg-[hsl(var(--clock-foreground)/0.2)]",
                            "text-[hsl(var(--clock-muted))] hover:text-[hsl(var(--clock-foreground))]",
                            "transition-all duration-200",
                            "opacity-60 sm:opacity-30 hover:opacity-100",
                            "flex items-center justify-center"
                        )}
                        title="Settings (S)"
                    >
                        <Settings className="w-5 h-5" />
                    </button>
                    <button
                        onClick={toggleEmbedModal}
                        className={cn(
                            "p-3 sm:p-3 rounded-full",
                            "min-w-[44px] min-h-[44px]",
                            "bg-[hsl(var(--clock-foreground)/0.1)] backdrop-blur-sm",
                            "hover:bg-[hsl(var(--clock-foreground)/0.2)]",
                            "text-[hsl(var(--clock-muted))] hover:text-[hsl(var(--clock-foreground))]",
                            "transition-all duration-200",
                            "opacity-60 sm:opacity-30 hover:opacity-100",
                            "flex items-center justify-center"
                        )}
                        title="Embed Widget (E)"
                    >
                        <Code className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Modals & Drawers */}
            <SkinsDrawer />
            <CitySearch />
            <EmbedModal />

            {/* Keyboard shortcuts handler */}
            <KeyboardShortcuts />

            {/* PWA Service Worker */}
            <ServiceWorkerRegistration />
        </main>
    );
}
