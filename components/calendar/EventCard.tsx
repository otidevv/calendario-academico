"use client";

import { Card, CardContent } from "@/components/ui/card";
import { CategoryBadge } from "./CategoryBadge";
import type { CalendarEvent } from "@/types/calendar";
import { categories } from "@/data/calendar-data";

interface EventCardProps {
  event: CalendarEvent;
  onClick?: () => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatDateRange(startDate: string, endDate?: string): string {
  if (!endDate) return formatDate(startDate);

  const start = new Date(startDate + "T00:00:00");
  const end = new Date(endDate + "T00:00:00");

  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString("es-PE", { month: "short", year: "numeric" })}`;
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
}

export function EventCard({ event, onClick }: EventCardProps) {
  const categoryData = categories.find((c) => c.id === event.category);

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md hover:scale-[1.01] border-l-4 ${categoryData?.borderColor || "border-gray-300"}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
              {event.title}
            </h3>
            {event.description && (
              <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
          <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
            <CategoryBadge category={event.category} size="sm" />
            <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
              {event.isRange
                ? formatDateRange(event.startDate, event.endDate)
                : formatDate(event.startDate)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
