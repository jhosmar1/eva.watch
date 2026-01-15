import { Suspense } from "react";

export const metadata = {
    title: "eva.watch Embed",
    description: "Embeddable clock widget",
};

export default function EmbedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Suspense fallback={<div className="min-h-screen bg-black" />}>
            {children}
        </Suspense>
    );
}
