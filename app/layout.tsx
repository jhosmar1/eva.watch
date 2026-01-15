import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-sans",
    display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-serif",
    display: "swap",
});

export const metadata: Metadata = {
    title: "eva.watch — Your Homepage Forever",
    description: "A luxury web clock with beautiful skins, world clocks, and smooth animations. Set it as your homepage.",
    keywords: ["clock", "world clock", "time", "homepage", "luxury", "minimal"],
    authors: [{ name: "eva.watch" }],
    manifest: "/manifest.json",
    appleWebApp: {
        capable: true,
        statusBarStyle: "black-translucent",
        title: "eva.watch",
    },
    openGraph: {
        title: "eva.watch — Your Homepage Forever",
        description: "A luxury web clock with beautiful skins, world clocks, and smooth animations.",
        type: "website",
    },
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
            { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
            { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
        ],
        apple: [
            { url: "/icons/apple-touch-icon.png", sizes: "180x180" },
        ],
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    viewportFit: "cover",
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#0f172a" },
        { media: "(prefers-color-scheme: dark)", color: "#0f172a" },
    ],
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="en"
            className={`${inter.variable} ${jetbrainsMono.variable} ${playfair.variable} skin-studio-white`}
            suppressHydrationWarning
        >
            <body className="antialiased">
                {children}
            </body>
        </html>
    );
}
