"use client";

import { useMemo, useState } from "react";
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragEndEvent,
    DragStartEvent,
    DragOverlay,
} from "@dnd-kit/core";
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    rectSortingStrategy,
} from "@dnd-kit/sortable";
import { useClockStore } from "@/lib/store/clockStore";
import { GridClockTile } from "./GridClockTile";
import { EmptyTile } from "./EmptyTile";
import { Clock } from "./Clock";
import { cn } from "@/lib/utils";

export function WorldGrid() {
    const { cities, reorderCities } = useClockStore();
    const [activeId, setActiveId] = useState<string | null>(null);

    // Responsive grid slots: 9 on desktop, 6 on tablet, 4 on mobile
    // We'll handle this via CSS and show all cities + empty slots up to max
    const maxSlots = 9;
    const emptySlots = Math.max(0, maxSlots - cities.length);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 8,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const activeCity = useMemo(
        () => cities.find((c) => c.id === activeId),
        [activeId, cities]
    );

    const handleDragStart = (event: DragStartEvent) => {
        setActiveId(event.active.id as string);
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActiveId(null);

        if (over && active.id !== over.id) {
            const oldIndex = cities.findIndex((c) => c.id === active.id);
            const newIndex = cities.findIndex((c) => c.id === over.id);

            if (oldIndex !== -1 && newIndex !== -1) {
                reorderCities(arrayMove(cities, oldIndex, newIndex));
            }
        }
    };

    const handleDragCancel = () => {
        setActiveId(null);
    };

    return (
        <div className="flex-1 flex items-center justify-center p-4 pt-16 sm:p-6 sm:pt-16 lg:p-8 lg:pt-16">
            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
                onDragCancel={handleDragCancel}
            >
                <div
                    className={cn(
                        "grid gap-4 sm:gap-5 lg:gap-6 w-full max-w-6xl",
                        // Responsive grid columns
                        "grid-cols-2 md:grid-cols-3"
                    )}
                >
                    <SortableContext
                        items={cities.map((c) => c.id)}
                        strategy={rectSortingStrategy}
                    >
                        {cities.map((city, index) => (
                            <GridClockTile
                                key={city.id}
                                city={city}
                                isHome={index === 0}
                            />
                        ))}
                    </SortableContext>

                    {/* Empty slots for adding more cities */}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                        <EmptyTile
                            key={`empty-${i}`}
                            className={cn(
                                // Hide extra slots on smaller screens
                                i >= 2 && "hidden md:flex"
                            )}
                        />
                    ))}
                </div>

                {/* Drag overlay for smooth dragging */}
                <DragOverlay>
                    {activeCity && (
                        <div className={cn(
                            "aspect-square rounded-2xl flex flex-col",
                            "bg-[hsl(var(--clock-background))]",
                            "border-2 border-[hsl(var(--clock-accent))]",
                            "shadow-2xl shadow-[hsl(var(--clock-glow))]",
                            "opacity-95"
                        )}>
                            <div className="flex-1 flex items-center justify-center p-4">
                                <Clock
                                    timezone={activeCity.timezone}
                                    size="grid"
                                />
                            </div>
                            <div className={cn(
                                "py-2 px-3 text-center",
                                "border-t border-[hsl(var(--clock-border)/0.2)]",
                                "bg-[hsl(var(--clock-foreground)/0.02)]",
                                "rounded-b-2xl"
                            )}>
                                <span className="text-sm">{activeCity.flag}</span>
                                <span className="ml-1.5 text-sm font-medium text-[hsl(var(--clock-foreground))]">
                                    {activeCity.name}
                                </span>
                            </div>
                        </div>
                    )}
                </DragOverlay>
            </DndContext>
        </div>
    );
}
