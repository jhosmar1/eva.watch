"use client";

import { useState, useEffect, useRef } from "react";
import { useClockStore } from "@/lib/store/clockStore";
import { searchCities, generateCityId } from "@/config/cities";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Plus } from "lucide-react";
import type { City } from "@/types/clock";

export function CitySearch() {
    const { searchOpen, toggleSearch, addCity, cities } = useClockStore();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Omit<City, "id">[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (searchOpen && inputRef.current) {
            inputRef.current.focus();
        }
        if (!searchOpen) {
            setQuery("");
            setResults([]);
        }
    }, [searchOpen]);

    useEffect(() => {
        const matches = searchCities(query);
        // Filter out already added cities
        const existingTimezones = new Set(cities.map(c => c.timezone));
        setResults(matches.filter(m => !existingTimezones.has(m.timezone)));
    }, [query, cities]);

    const handleAddCity = (cityData: Omit<City, "id">) => {
        const city: City = {
            ...cityData,
            id: generateCityId(cityData.name),
        };
        addCity(city);
        setQuery("");
        toggleSearch();
    };

    return (
        <AnimatePresence>
            {searchOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleSearch}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Search Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        className={cn(
                            "fixed z-50",
                            // Mobile: full width at bottom, Desktop: centered
                            "bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/4 sm:left-1/2 sm:-translate-x-1/2",
                            "w-full sm:max-w-lg",
                            "bg-[hsl(var(--clock-background))]",
                            "rounded-t-2xl sm:rounded-2xl",
                            "border border-[hsl(var(--clock-border))]",
                            "shadow-2xl overflow-hidden",
                            "max-h-[80vh] sm:max-h-none"
                        )}
                    >
                        {/* Search input */}
                        <div className="flex items-center gap-3 p-4 border-b border-[hsl(var(--clock-border))]">
                            <Search className="w-5 h-5 text-[hsl(var(--clock-muted))]" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Search cities..."
                                className={cn(
                                    "flex-1 bg-transparent text-base sm:text-lg",
                                    "text-[hsl(var(--clock-foreground))]",
                                    "placeholder:text-[hsl(var(--clock-muted))]",
                                    "focus:outline-none"
                                )}
                            />
                            <button
                                onClick={toggleSearch}
                                className="p-2 rounded-lg hover:bg-[hsl(var(--clock-foreground)/0.1)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-[hsl(var(--clock-muted))]" />
                            </button>
                        </div>

                        {/* Results */}
                        <div className="max-h-[60vh] sm:max-h-80 overflow-y-auto overscroll-contain">
                            {results.length === 0 && query && (
                                <div className="p-6 text-center text-[hsl(var(--clock-muted))]">
                                    No cities found
                                </div>
                            )}
                            {results.map((city, i) => (
                                <button
                                    key={`${city.timezone}-${city.name}`}
                                    onClick={() => handleAddCity(city)}
                                    className={cn(
                                        "w-full flex items-center justify-between p-4 min-h-[56px]",
                                        "hover:bg-[hsl(var(--clock-foreground)/0.05)]",
                                        "active:bg-[hsl(var(--clock-foreground)/0.1)]",
                                        "transition-colors text-left",
                                        i !== results.length - 1 && "border-b border-[hsl(var(--clock-border)/0.5)]"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-xl">{city.flag}</span>
                                        <div>
                                            <div className="font-medium text-[hsl(var(--clock-foreground))]">
                                                {city.name}
                                            </div>
                                            <div className="text-xs sm:text-sm text-[hsl(var(--clock-muted))]">
                                                {city.timezone}
                                            </div>
                                        </div>
                                    </div>
                                    <Plus className="w-6 h-6 text-[hsl(var(--clock-accent))]" />
                                </button>
                            ))}
                        </div>

                        {/* Safe area padding for mobile */}
                        <div className="h-[env(safe-area-inset-bottom)] sm:hidden" />
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
