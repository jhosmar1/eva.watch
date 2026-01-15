"use client";

import { useClockStore } from "@/lib/store/clockStore";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { X, Code2 } from "lucide-react";
import { EmbedGenerator } from "./EmbedGenerator";

export function EmbedModal() {
    const { embedModalOpen, toggleEmbedModal } = useClockStore();

    return (
        <AnimatePresence>
            {embedModalOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={toggleEmbedModal}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: "spring", damping: 25, stiffness: 300 }}
                        className={cn(
                            "fixed z-50",
                            // Mobile: full width at bottom, Desktop: centered
                            "bottom-0 left-0 right-0 sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2",
                            "w-full sm:max-w-4xl",
                            "bg-[hsl(var(--clock-background))]",
                            "rounded-t-3xl sm:rounded-2xl",
                            "border border-[hsl(var(--clock-border))]",
                            "shadow-2xl overflow-hidden",
                            "max-h-[95vh] sm:max-h-[90vh]"
                        )}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-[hsl(var(--clock-border))] bg-[hsl(var(--clock-foreground)/0.02)]">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-xl bg-[hsl(var(--clock-accent)/0.1)]">
                                    <Code2 className="w-5 h-5 text-[hsl(var(--clock-accent))]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-[hsl(var(--clock-foreground))]">
                                        Embed Widget
                                    </h2>
                                    <p className="text-xs text-[hsl(var(--clock-muted))]">
                                        Add a beautiful clock to your website
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={toggleEmbedModal}
                                className="p-2.5 rounded-xl hover:bg-[hsl(var(--clock-foreground)/0.1)] transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
                            >
                                <X className="w-5 h-5 text-[hsl(var(--clock-muted))]" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="overflow-y-auto max-h-[calc(95vh-5rem)] sm:max-h-[calc(90vh-5rem)]">
                            <EmbedGenerator />
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
