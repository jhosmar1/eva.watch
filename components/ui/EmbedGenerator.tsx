"use client";

import { useState } from "react";
import { useClockStore } from "@/lib/store/clockStore";
import { DIGITAL_SKINS, ANALOG_SKINS } from "@/types/clock";
import { CITY_DATABASE } from "@/config/cities";
import { cn } from "@/lib/utils";
import { Copy, Check, Globe, Maximize, Palette, ExternalLink, Sparkles } from "lucide-react";

export function EmbedGenerator() {
    const { activeSkin, clockType, showSeconds, is24Hour } = useClockStore();

    const [selectedCity, setSelectedCity] = useState("local");
    const [embedSize, setEmbedSize] = useState<"small" | "medium" | "large">("medium");
    const [selectedSkin, setSelectedSkin] = useState(activeSkin);
    const [selectedType, setSelectedType] = useState(clockType);
    const [copied, setCopied] = useState(false);

    const sizes = {
        small: { width: 200, height: 150, label: "Small", desc: "200×150" },
        medium: { width: 400, height: 300, label: "Medium", desc: "400×300" },
        large: { width: 600, height: 450, label: "Large", desc: "600×450" },
    };

    const currentSkins = selectedType === "digital" ? DIGITAL_SKINS : ANALOG_SKINS;

    const embedUrl = `https://eva.watch/embed?city=${encodeURIComponent(selectedCity)}&skin=${selectedSkin}&type=${selectedType}&size=${embedSize}&seconds=${showSeconds !== "hidden"}&24h=${is24Hour}`;

    const iframeCode = `<iframe src="${embedUrl}" width="${sizes[embedSize].width}" height="${sizes[embedSize].height}" frameborder="0" style="border-radius: 12px; overflow: hidden;"></iframe>`;

    const handleCopy = () => {
        navigator.clipboard.writeText(iframeCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-4 sm:p-6">
            {/* Two column layout on desktop */}
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Left: Configuration */}
                <div className="flex-1 space-y-5">
                    {/* Clock Type Toggle */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-3 text-[hsl(var(--clock-muted))]">
                            <Palette className="w-4 h-4" />
                            Clock Style
                        </label>
                        <div className="flex gap-2 p-1 rounded-xl bg-[hsl(var(--clock-foreground)/0.05)]">
                            {(["digital", "analog"] as const).map(type => (
                                <button
                                    key={type}
                                    onClick={() => {
                                        setSelectedType(type);
                                        // Reset skin to first of new type
                                        const newSkins = type === "digital" ? DIGITAL_SKINS : ANALOG_SKINS;
                                        setSelectedSkin(newSkins[0].id);
                                    }}
                                    className={cn(
                                        "flex-1 py-2.5 px-4 rounded-lg font-medium capitalize transition-all text-sm",
                                        selectedType === type
                                            ? "bg-[hsl(var(--clock-accent))] text-white shadow-md"
                                            : "text-[hsl(var(--clock-foreground))] hover:bg-[hsl(var(--clock-foreground)/0.05)]"
                                    )}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Skin Selection with Visual Previews */}
                    <div>
                        <label className="block text-sm font-medium mb-3 text-[hsl(var(--clock-muted))]">
                            Theme
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                            {currentSkins.map(skin => (
                                <button
                                    key={skin.id}
                                    onClick={() => setSelectedSkin(skin.id)}
                                    className={cn(
                                        "relative p-3 rounded-xl border-2 transition-all flex flex-col items-center gap-1.5",
                                        selectedSkin === skin.id
                                            ? "border-[hsl(var(--clock-accent))] ring-2 ring-[hsl(var(--clock-accent)/0.3)]"
                                            : "border-transparent hover:border-[hsl(var(--clock-accent)/0.3)]"
                                    )}
                                    style={{
                                        backgroundColor: `hsl(${skin.background})`,
                                    }}
                                    title={skin.name}
                                >
                                    {/* Mini clock preview */}
                                    <div
                                        className="text-lg font-mono font-light"
                                        style={{
                                            color: `hsl(${skin.foreground})`,
                                            textShadow:
                                                skin.glowIntensity > 0
                                                    ? `0 0 ${skin.glowIntensity * 4}px hsl(${skin.accent})`
                                                    : "none",
                                        }}
                                    >
                                        12:34
                                    </div>
                                    <span
                                        className="text-[10px] font-medium truncate max-w-full"
                                        style={{ color: `hsl(${skin.foreground} / 0.7)` }}
                                    >
                                        {skin.name}
                                    </span>

                                    {/* Ambient gradient indicator */}
                                    {skin.hasAmbientGradient && (
                                        <Sparkles
                                            className="absolute top-1.5 right-1.5 w-3 h-3"
                                            style={{ color: `hsl(${skin.accent})` }}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* City Selection */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-3 text-[hsl(var(--clock-muted))]">
                            <Globe className="w-4 h-4" />
                            City
                        </label>
                        <select
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className={cn(
                                "w-full p-3 rounded-xl",
                                "bg-[hsl(var(--clock-foreground)/0.05)]",
                                "text-[hsl(var(--clock-foreground))]",
                                "border border-[hsl(var(--clock-border))]",
                                "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--clock-accent))]",
                                "cursor-pointer"
                            )}
                        >
                            <option value="local">🏠 Local Time</option>
                            {CITY_DATABASE.map(city => (
                                <option key={city.timezone + city.name} value={city.name}>
                                    {city.flag} {city.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Size Selection */}
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium mb-3 text-[hsl(var(--clock-muted))]">
                            <Maximize className="w-4 h-4" />
                            Widget Size
                        </label>
                        <div className="grid grid-cols-3 gap-2">
                            {(["small", "medium", "large"] as const).map(size => (
                                <button
                                    key={size}
                                    onClick={() => setEmbedSize(size)}
                                    className={cn(
                                        "py-3 px-3 rounded-xl font-medium transition-all flex flex-col items-center gap-1",
                                        embedSize === size
                                            ? "bg-[hsl(var(--clock-accent))] text-white shadow-md"
                                            : "bg-[hsl(var(--clock-foreground)/0.05)] text-[hsl(var(--clock-foreground))] hover:bg-[hsl(var(--clock-foreground)/0.1)]"
                                    )}
                                >
                                    <span className="text-sm capitalize">{sizes[size].label}</span>
                                    <span className={cn(
                                        "text-[10px]",
                                        embedSize === size ? "text-white/70" : "text-[hsl(var(--clock-muted))]"
                                    )}>
                                        {sizes[size].desc}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right: Preview */}
                <div className="lg:w-[420px] space-y-4">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium text-[hsl(var(--clock-muted))]">
                            Live Preview
                        </label>
                        <a
                            href={`/embed?city=${encodeURIComponent(selectedCity)}&skin=${selectedSkin}&type=${selectedType}&size=${embedSize}&seconds=${showSeconds !== "hidden"}&24h=${is24Hour}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 text-xs text-[hsl(var(--clock-accent))] hover:underline"
                        >
                            Open in new tab
                            <ExternalLink className="w-3 h-3" />
                        </a>
                    </div>
                    <div
                        className={cn(
                            "rounded-2xl overflow-hidden flex items-center justify-center",
                            "bg-[repeating-conic-gradient(hsl(var(--clock-foreground)/0.03)_0%_25%,transparent_0%_50%)]",
                            "bg-[length:16px_16px]",
                            "border border-[hsl(var(--clock-border))]",
                            "p-4",
                            embedSize === "small" ? "h-[200px]" : embedSize === "medium" ? "h-[280px]" : "h-[320px]"
                        )}
                    >
                        <div
                            className="rounded-xl overflow-hidden shadow-2xl transition-all duration-300"
                            style={{
                                width: embedSize === "small" ? 200 : embedSize === "medium" ? 340 : 380,
                                height: embedSize === "small" ? 150 : embedSize === "medium" ? 255 : 285,
                            }}
                        >
                            <iframe
                                key={`${selectedSkin}-${selectedType}-${selectedCity}-${embedSize}`}
                                src={`/embed?city=${encodeURIComponent(selectedCity)}&skin=${selectedSkin}&type=${selectedType}&size=${embedSize}&seconds=${showSeconds !== "hidden"}&24h=${is24Hour}`}
                                width="100%"
                                height="100%"
                                style={{ border: "none" }}
                            />
                        </div>
                    </div>
                    <p className="text-xs text-center text-[hsl(var(--clock-muted))]">
                        {sizes[embedSize].desc} pixels
                    </p>
                </div>
            </div>

            {/* Code Output - Full Width */}
            <div className="mt-6 pt-6 border-t border-[hsl(var(--clock-border))]">
                <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium text-[hsl(var(--clock-muted))]">
                        Embed Code
                    </label>
                    <button
                        onClick={handleCopy}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                            copied
                                ? "bg-green-500/20 text-green-400"
                                : "bg-[hsl(var(--clock-accent))] text-white hover:opacity-90"
                        )}
                    >
                        {copied ? (
                            <>
                                <Check className="w-4 h-4" />
                                Copied!
                            </>
                        ) : (
                            <>
                                <Copy className="w-4 h-4" />
                                Copy Code
                            </>
                        )}
                    </button>
                </div>
                <div className="relative group">
                    <pre
                        className={cn(
                            "p-4 rounded-xl text-xs sm:text-sm overflow-x-auto",
                            "bg-[hsl(var(--clock-foreground)/0.03)]",
                            "text-[hsl(var(--clock-foreground)/0.8)]",
                            "border border-[hsl(var(--clock-border))]",
                            "font-mono leading-relaxed"
                        )}
                    >
                        <code>{iframeCode}</code>
                    </pre>
                </div>
                <p className="mt-3 text-xs text-[hsl(var(--clock-muted))]">
                    Paste this code into your website&apos;s HTML to embed the clock widget.
                </p>
            </div>
        </div>
    );
}
