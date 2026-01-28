"use client";

import { useMemo } from "react";
import type { CalendarEvent } from "@/types/calendar";
import { categories } from "@/data/calendar-data";

interface MiniCalendarProps {
  year: number;
  month: number; // 0-indexed
  events: CalendarEvent[];
  selectedDate: string | null;
  onDateClick: (date: string) => void;
}

const DAYS = ["LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB", "DOM"];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  // Convert Sunday (0) to 6, Monday (1) to 0, etc.
  return day === 0 ? 6 : day - 1;
}

function formatDateKey(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function MiniCalendar({
  year,
  month,
  events,
  selectedDate,
  onDateClick,
}: MiniCalendarProps) {
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days: (number | null)[] = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add the days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  }, [year, month]);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();

    events.forEach((event) => {
      // Agregar T00:00:00 para evitar problemas de zona horaria
      const startDate = new Date(event.startDate + "T00:00:00");
      const endDate = event.endDate
        ? new Date(event.endDate + "T00:00:00")
        : startDate;

      // Add event to all dates in range
      const current = new Date(startDate);
      while (current <= endDate) {
        const key = formatDateKey(
          current.getFullYear(),
          current.getMonth(),
          current.getDate()
        );
        if (!map.has(key)) {
          map.set(key, []);
        }
        map.get(key)!.push(event);
        current.setDate(current.getDate() + 1);
      }
    });

    return map;
  }, [events]);

  const getCategoryColor = (dayEvents: CalendarEvent[]) => {
    if (dayEvents.length === 0) return null;
    // Return the first event's category color
    const category = categories.find((c) => c.id === dayEvents[0].category);
    return category;
  };

  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700">
      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 py-1"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => {
          if (day === null) {
            return <div key={`empty-${index}`} className="aspect-square" />;
          }

          const dateKey = formatDateKey(year, month, day);
          const dayEvents = eventsByDate.get(dateKey) || [];
          const hasEvents = dayEvents.length > 0;
          const isSelected = selectedDate === dateKey;
          const categoryColor = getCategoryColor(dayEvents);

          return (
            <button
              key={day}
              onClick={() => onDateClick(dateKey)}
              className={`
                aspect-square flex items-center justify-center text-sm font-medium rounded-lg
                transition-all duration-200 relative
                ${
                  isSelected
                    ? "ring-2 ring-amber-500 ring-offset-2 dark:ring-offset-gray-900"
                    : ""
                }
                ${
                  hasEvents
                    ? `${categoryColor?.bgColor || "bg-amber-100 dark:bg-amber-900/40"} ${categoryColor?.color || "text-amber-700 dark:text-amber-400"} hover:scale-110 cursor-pointer`
                    : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                }
              `}
            >
              {day}
              {dayEvents.length > 1 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
                  {dayEvents.length}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
