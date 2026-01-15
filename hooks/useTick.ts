"use client";

import { useEffect, useRef } from "react";
import { useClockStore } from "@/lib/store/clockStore";

export function useTick() {
    const { quietMode, tickVolume } = useClockStore();
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lastSecondRef = useRef<number>(-1);

    // Initialize audio element
    useEffect(() => {
        if (typeof window === "undefined") return;

        if (!audioRef.current) {
            audioRef.current = new Audio("/clock-tick-1.mp3");
            audioRef.current.preload = "auto";
        }

        audioRef.current.volume = tickVolume / 100;
    }, [tickVolume]);

    useEffect(() => {
        // Play tick when quietMode is OFF (sound enabled)
        if (quietMode) return;

        // Reset lastSecondRef to current second to prevent immediate tick on enable
        lastSecondRef.current = new Date().getSeconds();

        const playTick = () => {
            if (audioRef.current) {
                audioRef.current.currentTime = 0;
                audioRef.current.play().catch(() => {
                    // Ignore autoplay errors
                });
            }
        };

        const tick = () => {
            const now = new Date();
            const currentSecond = now.getSeconds();

            if (currentSecond !== lastSecondRef.current) {
                lastSecondRef.current = currentSecond;
                playTick();
            }
        };

        const interval = setInterval(tick, 100);

        return () => {
            clearInterval(interval);
        };
    }, [quietMode]);
}
