"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { TimeData } from "@/types/clock";

export function useTime(timezone?: string): TimeData {
    const getTimeData = useCallback((): TimeData => {
        const now = new Date();

        // If timezone is provided, get the time in that timezone
        let hours: number;
        let minutes: number;
        let seconds: number;
        let milliseconds: number;

        if (timezone) {
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: timezone,
                hour: "numeric",
                minute: "numeric",
                second: "numeric",
                hour12: false,
            });
            const parts = formatter.formatToParts(now);
            hours = parseInt(parts.find(p => p.type === "hour")?.value || "0");
            minutes = parseInt(parts.find(p => p.type === "minute")?.value || "0");
            seconds = parseInt(parts.find(p => p.type === "second")?.value || "0");
            milliseconds = now.getMilliseconds();
        } else {
            hours = now.getHours();
            minutes = now.getMinutes();
            seconds = now.getSeconds();
            milliseconds = now.getMilliseconds();
        }

        return {
            hours,
            minutes,
            seconds,
            milliseconds,
            hours12: hours % 12 || 12,
            isPM: hours >= 12,
            date: now,
        };
    }, [timezone]);

    const [time, setTime] = useState<TimeData>(getTimeData);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        let lastSecond = -1;

        const tick = () => {
            const newTime = getTimeData();

            // Always update to get smooth millisecond updates for analog clocks
            setTime(newTime);

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);

        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, [getTimeData]);

    return time;
}
