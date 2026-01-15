"use client";

import { useHotkeys } from "react-hotkeys-hook";
import { useClockStore } from "@/lib/store/clockStore";

export function KeyboardShortcuts() {
    const {
        toggleSearch,
        toggleSkinsDrawer,
        toggleFullscreen,
        toggle24Hour,
        toggleQuietMode,
        toggleLayoutMode,
        toggleEmbedModal,
        setClockType,
        clockType,
        cycleShowSeconds,
        cycleSkin,
    } = useClockStore();

    // Register keyboard shortcuts
    useHotkeys("slash", (e) => {
        e.preventDefault();
        toggleSearch();
    });

    useHotkeys("s", (e) => {
        e.preventDefault();
        toggleSkinsDrawer();
    });

    useHotkeys("f", (e) => {
        e.preventDefault();
        toggleFullscreen();
    });

    useHotkeys("h", (e) => {
        e.preventDefault();
        toggle24Hour();
    });

    useHotkeys("q", (e) => {
        e.preventDefault();
        toggleQuietMode();
    });

    useHotkeys("t", (e) => {
        e.preventDefault();
        setClockType(clockType === "digital" ? "analog" : "digital");
    });

    useHotkeys("d", (e) => {
        e.preventDefault();
        cycleShowSeconds();
    });

    useHotkeys("g", (e) => {
        e.preventDefault();
        toggleLayoutMode();
    });

    useHotkeys("e", (e) => {
        e.preventDefault();
        toggleEmbedModal();
    });

    useHotkeys("left", (e) => {
        e.preventDefault();
        cycleSkin(-1);
    });

    useHotkeys("right", (e) => {
        e.preventDefault();
        cycleSkin(1);
    });

    useHotkeys("escape", () => {
        const { searchOpen, skinsDrawerOpen, embedModalOpen, toggleSearch, toggleSkinsDrawer, toggleEmbedModal } = useClockStore.getState();
        if (searchOpen) toggleSearch();
        if (skinsDrawerOpen) toggleSkinsDrawer();
        if (embedModalOpen) toggleEmbedModal();
    });

    return null;
}
