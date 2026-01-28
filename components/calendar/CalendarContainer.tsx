"use client";

import { useState, useMemo } from "react";
import { MonthView } from "./MonthView";
import { EventDetail } from "./EventDetail";
import { Input } from "@/components/ui/input";
import { calendarEvents, semesters } from "@/data/calendar-data";
import type { CalendarEvent, SemesterType } from "@/types/calendar";

// Función para normalizar texto (quitar tildes)
function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const MONTHS = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

export function CalendarContainer() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterType>("2026-1");

  const filteredEvents = useMemo(() => {
    let events = [...calendarEvents];

    // Filter by semester
    events = events.filter(
      (event) => event.semester === selectedSemester || event.semester === "general"
    );

    // Filter by search query (ignoring accents)
    if (searchQuery.trim()) {
      const query = normalizeText(searchQuery);
      events = events.filter(
        (event) =>
          normalizeText(event.title).includes(query) ||
          normalizeText(event.description || "").includes(query)
      );
    }

    return events;
  }, [searchQuery, selectedSemester]);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const scrollToMonth = (month: number) => {
    setSelectedMonth(month);
    const element = document.getElementById(`month-${month}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Get semester info for display
  const getSemesterInfo = (id: SemesterType) => {
    const sem = semesters.find((s) => s.id === id);
    return sem || { name: id, description: "" };
  };

  const currentSemesterInfo = getSemesterInfo(selectedSemester);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div
        className="relative text-white overflow-hidden"
        style={{ backgroundColor: "#db0455" }}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: "url('/img/body/imagenunamad.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="relative container mx-auto px-4 py-12 md:py-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight mb-4 drop-shadow-lg">
              Calendario Académico de Pregrado UNAMAD - 2026
            </h1>
            <p className="text-sm md:text-base opacity-90">
              Universidad Nacional Amazónica de Madre de Dios
            </p>
          </div>
        </div>
      </div>

      {/* Semester Filter Tabs */}
      <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-2 py-4">
            <button
              onClick={() => setSelectedSemester("2026-0")}
              className={`
                px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer
                ${
                  selectedSemester === "2026-0"
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30 scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              <span className="block">2026-0</span>
              <span className="text-xs opacity-75">Nivelación</span>
            </button>

            <button
              onClick={() => setSelectedSemester("2026-1")}
              className={`
                px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer
                ${
                  selectedSemester === "2026-1"
                    ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/30 scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              <span className="block">2026-1</span>
              <span className="text-xs opacity-75">Primer Semestre</span>
            </button>

            <button
              onClick={() => setSelectedSemester("2026-2")}
              className={`
                px-6 py-3 rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer
                ${
                  selectedSemester === "2026-2"
                    ? "bg-gradient-to-r from-purple-500 to-violet-500 text-white shadow-lg shadow-purple-500/30 scale-105"
                    : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700"
                }
              `}
            >
              <span className="block">2026-2</span>
              <span className="text-xs opacity-75">Segundo Semestre</span>
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="sticky top-16 z-40 bg-white/95 dark:bg-gray-950/95 backdrop-blur border-b border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                />
              </svg>
              <Input
                type="search"
                placeholder="Buscar eventos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* Current filter info */}
            <div className="hidden md:flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
              <span>Mostrando:</span>
              <span className="font-semibold text-gray-900 dark:text-white">
                {currentSemesterInfo.name}
              </span>
              <span className="text-gray-400">|</span>
              <span>{filteredEvents.length} eventos</span>
            </div>

            {/* Month shortcuts */}
            <div className="flex gap-1 overflow-x-auto pb-2 md:pb-0">
              {MONTHS.map((month, index) => (
                <button
                  key={month}
                  onClick={() => scrollToMonth(index)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-full whitespace-nowrap
                    transition-all duration-200 cursor-pointer
                    ${
                      selectedMonth === index
                        ? "text-white"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-pink-100 dark:hover:bg-pink-900/30"
                    }
                  `}
                  style={selectedMonth === index ? { backgroundColor: "#db0455" } : {}}
                >
                  {month.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Calendar months */}
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {MONTHS.map((monthName, index) => (
            <div key={monthName} id={`month-${index}`} className="scroll-mt-32">
              <MonthView
                year={2026}
                month={index}
                monthName={monthName}
                events={filteredEvents}
                onEventClick={handleEventClick}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="bg-gray-100 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Universidad Nacional Amazónica de Madre de Dios - UNAMAD
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            * Plazos y procedimientos de acuerdo con lo dispuesto en el Reglamento de Estudios de Pregrado
          </p>
        </div>
      </div>

      <EventDetail
        event={selectedEvent}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
