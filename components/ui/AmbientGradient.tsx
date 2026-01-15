"use client";

import { useClockStore } from "@/lib/store/clockStore";
import { ALL_SKINS } from "@/types/clock";
import { cn } from "@/lib/utils";

export function AmbientGradient() {
    const { activeSkin } = useClockStore();
    const skin = ALL_SKINS.find(s => s.id === activeSkin);

    // Only show for skins with ambient gradient
    if (!skin?.hasAmbientGradient) return null;

    return <div className="ambient-gradient" />;
}
