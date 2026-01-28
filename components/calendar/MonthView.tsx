"use client";

import { useState, useMemo } from "react";
import { MiniCalendar } from "./MiniCalendar";
import { EventBox } from "./EventBox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { CalendarEvent } from "@/types/calendar";

interface MonthViewProps {
  year: number;
  month: number; // 0-indexed
  monthName: string;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

const MONTH_COLORS: Record<number, { bg: string; text: string; accent: string }> = {
  0: { bg: "from-amber-400 to-amber-500", text: "text-amber-900", accent: "bg-amber-500" },
  1: { bg: "from-blue-400 to-blue-500", text: "text-blue-900", accent: "bg-blue-500" },
  2: { bg: "from-green-400 to-green-500", text: "text-green-900", accent: "bg-green-500" },
  3: { bg: "from-purple-400 to-purple-500", text: "text-purple-900", accent: "bg-purple-500" },
  4: { bg: "from-rose-400 to-rose-500", text: "text-rose-900", accent: "bg-rose-500" },
  5: { bg: "from-cyan-400 to-cyan-500", text: "text-cyan-900", accent: "bg-cyan-500" },
  6: { bg: "from-orange-400 to-orange-500", text: "text-orange-900", accent: "bg-orange-500" },
  7: { bg: "from-indigo-400 to-indigo-500", text: "text-indigo-900", accent: "bg-indigo-500" },
  8: { bg: "from-pink-400 to-pink-500", text: "text-pink-900", accent: "bg-pink-500" },
  9: { bg: "from-teal-400 to-teal-500", text: "text-teal-900", accent: "bg-teal-500" },
  10: { bg: "from-violet-400 to-violet-500", text: "text-violet-900", accent: "bg-violet-500" },
  11: { bg: "from-yellow-400 to-yellow-500", text: "text-yellow-900", accent: "bg-yellow-500" },
};

export function MonthView({
  year,
  month,
  monthName,
  events,
  onEventClick,
}: MonthViewProps) {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showAllEvents, setShowAllEvents] = useState(false);
  const [showNoEventsDialog, setShowNoEventsDialog] = useState(false);
  const [noEventsDate, setNoEventsDate] = useState<string>("");
  const colors = MONTH_COLORS[month];

  const monthEvents = useMemo(() => {
    return events.filter((event) => {
      const startDate = new Date(event.startDate + "T00:00:00");
      const endDate = event.endDate
        ? new Date(event.endDate + "T00:00:00")
        : startDate;

      // Check if event falls within this month
      const monthStart = new Date(year, month, 1);
      const monthEnd = new Date(year, month + 1, 0);

      return startDate <= monthEnd && endDate >= monthStart;
    });
  }, [events, year, month]);

  const selectedDateEvents = useMemo(() => {
    if (!selectedDate) return [];

    const selected = new Date(selectedDate + "T00:00:00");

    return monthEvents.filter((event) => {
      const startDate = new Date(event.startDate + "T00:00:00");
      const endDate = event.endDate
        ? new Date(event.endDate + "T00:00:00")
        : startDate;

      return selected >= startDate && selected <= endDate;
    });
  }, [selectedDate, monthEvents]);

  const handleDateClick = (date: string) => {
    const selected = new Date(date + "T00:00:00");
    const dayEvents = monthEvents.filter((event) => {
      const startDate = new Date(event.startDate + "T00:00:00");
      const endDate = event.endDate
        ? new Date(event.endDate + "T00:00:00")
        : startDate;
      return selected >= startDate && selected <= endDate;
    });

    if (dayEvents.length === 0) {
      // Show no events dialog
      setNoEventsDate(date);
      setShowNoEventsDialog(true);
    } else {
      // Toggle selection
      setSelectedDate(date === selectedDate ? null : date);
    }
  };

  const formatNoEventsDate = (dateString: string) => {
    return new Date(dateString + "T00:00:00").toLocaleDateString("es-PE", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // Don't render month if no events in selected semester
  if (monthEvents.length === 0) {
    return null;
  }

  return (
    <>
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700 relative">
        {/* Month Header */}
        <div className={`bg-gradient-to-r ${colors.bg} p-6`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-white text-3xl font-black">&gt;&gt;&gt;</span>
              <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
                {monthName}
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                {monthEvents.length} evento{monthEvents.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 relative">
          {/* Watermark Logo */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.08] dark:opacity-[0.12]"
            style={{
              backgroundImage: "url('/img/log/logounamad.png')",
              backgroundRepeat: "no-repeat",
              backgroundPosition: "center",
              backgroundSize: "350px",
            }}
          />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
            {/* Events list */}
            <div className="lg:col-span-2 space-y-4">
              {selectedDate && selectedDateEvents.length > 0 ? (
                <>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Eventos del {new Date(selectedDate + "T00:00:00").toLocaleDateString("es-PE", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}:
                    </div>
                    <button
                      onClick={() => setSelectedDate(null)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3"
                        />
                      </svg>
                      Ver todos los eventos
                    </button>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedDateEvents.map((event) => (
                      <EventBox
                        key={event.id}
                        event={event}
                        onClick={() => onEventClick(event)}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    {monthEvents.length} evento{monthEvents.length !== 1 ? "s" : ""} en {monthName.toLowerCase()}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {monthEvents.slice(0, 6).map((event) => (
                      <EventBox
                        key={event.id}
                        event={event}
                        onClick={() => onEventClick(event)}
                      />
                    ))}
                  </div>
                  {monthEvents.length > 6 && (
                    <div className="text-center mt-4">
                      <button
                        onClick={() => setShowAllEvents(true)}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm text-white transition-all duration-200 hover:scale-105 shadow-lg cursor-pointer"
                        style={{ backgroundColor: "#db0455" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                          />
                        </svg>
                        Ver todos los eventos ({monthEvents.length})
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Mini Calendar */}
            <div className="lg:col-span-1">
              <MiniCalendar
                year={year}
                month={month}
                events={monthEvents}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
              />

              {/* Legend */}
              <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">
                  Haz clic en un día para ver sus eventos
                </p>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-4 h-4 rounded bg-amber-200 dark:bg-amber-900/50"></span>
                  <span>Día con eventos</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Ver todos los eventos del mes */}
      <Dialog open={showAllEvents} onOpenChange={setShowAllEvents}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${colors.accent}`}></span>
              Eventos de {monthName}
            </DialogTitle>
            <DialogDescription>
              {monthEvents.length} evento{monthEvents.length !== 1 ? "s" : ""} en este mes
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="grid grid-cols-1 gap-3 py-4">
              {monthEvents.map((event) => (
                <EventBox
                  key={event.id}
                  event={event}
                  onClick={() => {
                    setShowAllEvents(false);
                    onEventClick(event);
                  }}
                />
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Modal: No hay eventos en este día */}
      <Dialog open={showNoEventsDialog} onOpenChange={setShowNoEventsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                  />
                </svg>
              </div>
              <span>Sin eventos</span>
            </DialogTitle>
            <DialogDescription className="text-base pt-2">
              No hay eventos programados para el{" "}
              <span className="font-semibold text-gray-900 dark:text-white capitalize">
                {noEventsDate && formatNoEventsDate(noEventsDate)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end pt-4">
            <button
              onClick={() => setShowNoEventsDialog(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors cursor-pointer"
              style={{ backgroundColor: "#db0455" }}
            >
              Entendido
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
