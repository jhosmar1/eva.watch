"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { City, ClockType, SecondsDisplay, LayoutMode } from "@/types/clock";
import { DIGITAL_SKINS, ANALOG_SKINS } from "@/types/clock";

// Get local city name from timezone
const getLocalCityName = () => {
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    // Extract city name from timezone (e.g., "Asia/Kolkata" -> "Kolkata")
    const parts = timezone.split("/");
    const cityPart = parts[parts.length - 1];
    // Replace underscores with spaces (e.g., "New_York" -> "New York")
    return cityPart.replace(/_/g, " ");
};

// Default cities
const DEFAULT_CITIES: City[] = [
    { id: "local", name: getLocalCityName(), timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, country: "", flag: "🏠" },
    { id: "nyc", name: "New York", timezone: "America/New_York", country: "US", flag: "🇺🇸" },
    { id: "london", name: "London", timezone: "Europe/London", country: "GB", flag: "🇬🇧" },
    { id: "tokyo", name: "Tokyo", timezone: "Asia/Tokyo", country: "JP", flag: "🇯🇵" },
    { id: "sydney", name: "Sydney", timezone: "Australia/Sydney", country: "AU", flag: "🇦🇺" },
];

interface ClockState {
    // Cities
    cities: City[];
    heroCityId: string;

    // Display settings
    activeSkin: string;
    clockType: ClockType;
    layoutMode: LayoutMode;
    is24Hour: boolean;
    showSeconds: SecondsDisplay;

    // UI state
    isFullscreen: boolean;
    quietMode: boolean;
    tickVolume: number;
    skinsDrawerOpen: boolean;
    searchOpen: boolean;
    embedModalOpen: boolean;

    // Actions
    setHeroCity: (id: string) => void;
    setSkin: (id: string) => void;
    cycleSkin: (direction?: 1 | -1) => void;
    setClockType: (type: ClockType) => void;
    setLayoutMode: (mode: LayoutMode) => void;
    toggleLayoutMode: () => void;
    toggle24Hour: () => void;
    setShowSeconds: (display: SecondsDisplay) => void;
    cycleShowSeconds: () => void;
    toggleFullscreen: () => void;
    toggleQuietMode: () => void;
    setTickVolume: (volume: number) => void;
    toggleSkinsDrawer: () => void;
    toggleSearch: () => void;
    toggleEmbedModal: () => void;
    addCity: (city: City) => void;
    removeCity: (id: string) => void;
    reorderCities: (cities: City[]) => void;
    swapWithHero: (cityId: string) => void;
}

export const useClockStore = create<ClockState>()(
    persist(
        (set, get) => ({
            // Initial state
            cities: DEFAULT_CITIES,
            heroCityId: "local",
            activeSkin: "studio-white",
            clockType: "analog",
            layoutMode: "hero",
            is24Hour: true,
            showSeconds: "ring",
            isFullscreen: false,
            quietMode: true,
            tickVolume: 30,
            skinsDrawerOpen: false,
            searchOpen: false,
            embedModalOpen: false,

            // Actions
            setHeroCity: (id) => set({ heroCityId: id }),

            setSkin: (id) => set({ activeSkin: id }),

            cycleSkin: (direction = 1) => set((state) => {
                const skins = state.clockType === "digital" ? DIGITAL_SKINS : ANALOG_SKINS;
                const currentIndex = skins.findIndex(s => s.id === state.activeSkin);
                const nextIndex = currentIndex === -1
                    ? 0
                    : (currentIndex + direction + skins.length) % skins.length;
                return { activeSkin: skins[nextIndex].id };
            }),

            setClockType: (type) => set({ clockType: type }),

            setLayoutMode: (mode) => set({ layoutMode: mode }),

            toggleLayoutMode: () => set((state) => ({
                layoutMode: state.layoutMode === "hero" ? "grid" : "hero"
            })),

            toggle24Hour: () => set((state) => ({ is24Hour: !state.is24Hour })),

            setShowSeconds: (display) => set({ showSeconds: display }),

            cycleShowSeconds: () => set((state) => {
                // Digital hero: digits, ring, hidden
                // Digital grid: digits, hidden (no ring in grid)
                // Analog: ring, hidden (no digits display)
                let order: SecondsDisplay[];
                if (state.clockType === "digital") {
                    order = state.layoutMode === "grid"
                        ? ["digits", "hidden"]
                        : ["digits", "ring", "hidden"];
                } else {
                    order = ["ring", "hidden"];
                }
                const currentIndex = order.indexOf(state.showSeconds);
                // If current value not in order, start from 0
                const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % order.length;
                return { showSeconds: order[nextIndex] };
            }),

            toggleFullscreen: () => {
                const { isFullscreen } = get();
                if (!isFullscreen) {
                    document.documentElement.requestFullscreen?.();
                } else {
                    document.exitFullscreen?.();
                }
                set({ isFullscreen: !isFullscreen });
            },

            toggleQuietMode: () => set((state) => ({ quietMode: !state.quietMode })),

            setTickVolume: (volume) => set({ tickVolume: volume }),

            toggleSkinsDrawer: () => set((state) => ({ skinsDrawerOpen: !state.skinsDrawerOpen })),

            toggleSearch: () => set((state) => ({ searchOpen: !state.searchOpen })),

            toggleEmbedModal: () => set((state) => ({ embedModalOpen: !state.embedModalOpen })),

            addCity: (city) => set((state) => ({
                cities: [...state.cities, city]
            })),

            removeCity: (id) => set((state) => ({
                cities: state.cities.filter((c) => c.id !== id),
                heroCityId: state.heroCityId === id ? state.cities[0]?.id || "local" : state.heroCityId,
            })),

            reorderCities: (cities) => set({ cities }),

            swapWithHero: (cityId) => {
                const { cities, heroCityId } = get();
                const heroIndex = cities.findIndex(c => c.id === heroCityId);
                const clickedIndex = cities.findIndex(c => c.id === cityId);

                if (heroIndex === -1 || clickedIndex === -1) return;

                const newCities = [...cities];
                [newCities[heroIndex], newCities[clickedIndex]] = [newCities[clickedIndex], newCities[heroIndex]];

                set({ cities: newCities, heroCityId: cityId });
            },
        }),
        {
            name: "eva-watch-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                cities: state.cities,
                heroCityId: state.heroCityId,
                activeSkin: state.activeSkin,
                clockType: state.clockType,
                layoutMode: state.layoutMode,
                is24Hour: state.is24Hour,
                showSeconds: state.showSeconds,
                quietMode: state.quietMode,
                tickVolume: state.tickVolume,
            }),
        }
    )
);
