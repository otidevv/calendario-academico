"use client";

import type { CalendarEvent } from "@/types/calendar";
import { categories } from "@/data/calendar-data";

interface EventBoxProps {
  event: CalendarEvent;
  onClick?: () => void;
  showSemester?: boolean;
}

function getDayName(dateString: string): string {
  const days = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];
  const date = new Date(dateString + "T00:00:00");
  return days[date.getDay()];
}

function getDay(dateString: string): number {
  return new Date(dateString + "T00:00:00").getDate();
}

function formatDateRange(startDate: string, endDate?: string): string {
  const startDay = getDay(startDate);
  if (!endDate) return String(startDay);

  const endDay = getDay(endDate);
  const startMonth = new Date(startDate + "T00:00:00").getMonth();
  const endMonth = new Date(endDate + "T00:00:00").getMonth();

  if (startMonth === endMonth) {
    return `${startDay} - ${endDay}`;
  }
  return `${startDay}/${startMonth + 1} - ${endDay}/${endMonth + 1}`;
}

const SEMESTER_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  "2026-0": {
    bg: "bg-blue-100 dark:bg-blue-900/30",
    text: "text-blue-700 dark:text-blue-400",
    dot: "bg-blue-500",
  },
  "2026-1": {
    bg: "bg-green-100 dark:bg-green-900/30",
    text: "text-green-700 dark:text-green-400",
    dot: "bg-green-500",
  },
  "2026-2": {
    bg: "bg-purple-100 dark:bg-purple-900/30",
    text: "text-purple-700 dark:text-purple-400",
    dot: "bg-purple-500",
  },
  general: {
    bg: "bg-gray-100 dark:bg-gray-800",
    text: "text-gray-700 dark:text-gray-400",
    dot: "bg-gray-500",
  },
};

const SEMESTER_LABELS: Record<string, string> = {
  "2026-0": "Nivelación",
  "2026-1": "2026-1",
  "2026-2": "2026-2",
  general: "General",
};

export function EventBox({ event, onClick, showSemester = false }: EventBoxProps) {
  const category = categories.find((c) => c.id === event.category);
  const dayName = getDayName(event.startDate);
  const isRange = event.isRange && event.endDate;
  const semesterColor = SEMESTER_COLORS[event.semester] || SEMESTER_COLORS.general;

  return (
    <div
      onClick={onClick}
      className={`
        relative cursor-pointer rounded-xl p-4 transition-all duration-200
        hover:scale-[1.02] hover:shadow-lg
        ${category?.bgColor || "bg-amber-100 dark:bg-amber-900/40"}
        border-2 ${category?.borderColor || "border-amber-500"}
      `}
    >
      {/* Semester badge */}
      {showSemester && (
        <div className="absolute -top-2 -right-2">
          <span
            className={`
              inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold
              ${semesterColor.bg} ${semesterColor.text}
              border border-white dark:border-gray-900
              shadow-sm
            `}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${semesterColor.dot}`}></span>
            {SEMESTER_LABELS[event.semester]}
          </span>
        </div>
      )}

      {/* Day indicator */}
      <div className="flex items-start gap-3">
        <div className={`text-center ${category?.color || "text-amber-700 dark:text-amber-400"}`}>
          <div className="text-xs font-bold uppercase">{dayName}</div>
          <div className="text-2xl font-black">
            {isRange ? (
              <span className="text-base">{formatDateRange(event.startDate, event.endDate)}</span>
            ) : (
              getDay(event.startDate)
            )}
          </div>
        </div>

        {/* Event content */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold text-sm leading-tight ${category?.color || "text-amber-700 dark:text-amber-400"}`}>
            {event.title}
          </h4>
          {event.description && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
              {event.description}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
