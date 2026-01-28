"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CategoryBadge } from "./CategoryBadge";
import type { CalendarEvent } from "@/types/calendar";
import { semesters } from "@/data/calendar-data";

interface EventDetailProps {
  event: CalendarEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDate(dateString: string): string {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-PE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function calculateDuration(startDate: string, endDate?: string): string {
  if (!endDate) return "1 día";

  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  if (diffDays === 1) return "1 día";
  if (diffDays < 7) return `${diffDays} días`;
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7);
    const days = diffDays % 7;
    if (days === 0) return `${weeks} semana${weeks > 1 ? "s" : ""}`;
    return `${weeks} semana${weeks > 1 ? "s" : ""} y ${days} día${days > 1 ? "s" : ""}`;
  }

  const months = Math.floor(diffDays / 30);
  const remainingDays = diffDays % 30;
  if (remainingDays === 0) return `${months} mes${months > 1 ? "es" : ""}`;
  return `${months} mes${months > 1 ? "es" : ""} y ${remainingDays} día${remainingDays > 1 ? "s" : ""}`;
}

export function EventDetail({ event, open, onOpenChange }: EventDetailProps) {
  if (!event) return null;

  const semester = semesters.find((s) => s.id === event.semester);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Detalles del evento del calendario académico
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <CategoryBadge category={event.category} />
            {semester && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Semestre {semester.name}
              </span>
            )}
          </div>

          <Separator />

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  {event.isRange ? "Fecha de inicio" : "Fecha"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  {formatDate(event.startDate)}
                </p>
              </div>
            </div>

            {event.isRange && event.endDate && (
              <>
                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Fecha de fin
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">
                      {formatDate(event.endDate)}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 text-gray-400 mt-0.5 shrink-0"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      Duración
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {calculateDuration(event.startDate, event.endDate)}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {event.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-gray-900 dark:text-white mb-1">
                  Descripción
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {event.description}
                </p>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
