"use client";

import { useMemo } from "react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { categories } from "@/data/calendar-data";
import type { CalendarEvent } from "@/types/calendar";

interface CalendarTimelineProps {
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const MONTHS = [
  "Ene",
  "Feb",
  "Mar",
  "Abr",
  "May",
  "Jun",
  "Jul",
  "Ago",
  "Sep",
  "Oct",
  "Nov",
  "Dic",
];

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-PE", {
    day: "numeric",
    month: "short",
  });
}

export function CalendarTimeline({ events, onEventClick }: CalendarTimelineProps) {
  const timelineData = useMemo(() => {
    if (events.length === 0) return null;

    // Get date range
    const dates = events.flatMap((e) => [
      new Date(e.startDate),
      e.endDate ? new Date(e.endDate) : new Date(e.startDate),
    ]);
    const minDate = new Date(Math.min(...dates.map((d) => d.getTime())));
    const maxDate = new Date(Math.max(...dates.map((d) => d.getTime())));

    // Expand to full months
    minDate.setDate(1);
    maxDate.setMonth(maxDate.getMonth() + 1);
    maxDate.setDate(0);

    const totalDays = Math.ceil(
      (maxDate.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Generate month markers
    const months: { name: string; year: number; startOffset: number; width: number }[] =
      [];
    const current = new Date(minDate);

    while (current <= maxDate) {
      const monthStart = new Date(current);
      const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);
      const startOffset = Math.ceil(
        (monthStart.getTime() - minDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      const daysInMonth = monthEnd.getDate();

      months.push({
        name: MONTHS[current.getMonth()],
        year: current.getFullYear(),
        startOffset,
        width: daysInMonth,
      });

      current.setMonth(current.getMonth() + 1);
    }

    return { minDate, totalDays, months };
  }, [events]);

  if (!timelineData || events.length === 0) {
    return (
      <div className="text-center py-12">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-12 h-12 mx-auto text-gray-300 dark:text-gray-600 mb-4"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          />
        </svg>
        <p className="text-gray-500 dark:text-gray-400 text-lg">
          No se encontraron eventos
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
          Intenta ajustar los filtros o la búsqueda
        </p>
      </div>
    );
  }

  const { minDate, totalDays, months } = timelineData;
  const dayWidth = 4; // pixels per day
  const timelineWidth = totalDays * dayWidth;

  return (
    <TooltipProvider delayDuration={200}>
      <div className="border rounded-lg bg-white dark:bg-gray-900 overflow-hidden">
        <ScrollArea className="w-full">
          <div style={{ width: timelineWidth, minWidth: "100%" }}>
            {/* Month headers */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-gray-50 dark:bg-gray-800">
              {months.map((month, index) => (
                <div
                  key={`${month.name}-${month.year}-${index}`}
                  style={{ width: month.width * dayWidth }}
                  className="px-2 py-2 text-xs font-medium text-gray-600 dark:text-gray-300 border-r border-gray-200 dark:border-gray-700 last:border-r-0"
                >
                  {month.name} {month.year}
                </div>
              ))}
            </div>

            {/* Event rows grouped by category */}
            <div className="p-4 space-y-4">
              {categories.map((category) => {
                const categoryEvents = events.filter(
                  (e) => e.category === category.id
                );
                if (categoryEvents.length === 0) return null;

                return (
                  <div key={category.id} className="space-y-1">
                    <div
                      className={`text-xs font-medium ${category.color} mb-2`}
                    >
                      {category.name}
                    </div>
                    <div className="relative h-8">
                      {categoryEvents.map((event) => {
                        const startDate = new Date(event.startDate);
                        const endDate = event.endDate
                          ? new Date(event.endDate)
                          : startDate;

                        const startOffset = Math.ceil(
                          (startDate.getTime() - minDate.getTime()) /
                            (1000 * 60 * 60 * 24)
                        );
                        const duration =
                          Math.ceil(
                            (endDate.getTime() - startDate.getTime()) /
                              (1000 * 60 * 60 * 24)
                          ) + 1;

                        return (
                          <Tooltip key={event.id}>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => onEventClick(event)}
                                style={{
                                  left: startOffset * dayWidth,
                                  width: Math.max(duration * dayWidth, 20),
                                }}
                                className={`absolute top-0 h-6 rounded ${category.bgColor} ${category.borderColor} border hover:opacity-80 transition-opacity cursor-pointer overflow-hidden`}
                              >
                                <span
                                  className={`text-[10px] px-1 truncate block ${category.color}`}
                                >
                                  {event.title}
                                </span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <div className="space-y-1">
                                <p className="font-medium">{event.title}</p>
                                <p className="text-xs text-gray-400">
                                  {formatDate(event.startDate)}
                                  {event.endDate &&
                                    ` - ${formatDate(event.endDate)}`}
                                </p>
                              </div>
                            </TooltipContent>
                          </Tooltip>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </TooltipProvider>
  );
}
