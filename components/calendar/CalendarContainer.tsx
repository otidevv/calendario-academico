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
          <div className="flex flex-wrap justify-center gap-4 py-6">
            {/* 2026-0 */}
            <button
              onClick={() => setSelectedSemester("2026-0")}
              className="group relative px-8 py-4 rounded-2xl font-bold text-base min-w-[180px] cursor-pointer overflow-hidden transition-all duration-500 ease-out"
              style={{
                background: selectedSemester === "2026-0"
                  ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                  : undefined,
                transform: selectedSemester === "2026-0" ? "scale(1.05)" : "scale(1)",
                boxShadow: selectedSemester === "2026-0"
                  ? "0 20px 40px -10px rgba(59, 130, 246, 0.5)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 transition-opacity duration-500 ${selectedSemester === "2026-0" ? "opacity-0" : "opacity-100"}`} />
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-opacity duration-500 ${selectedSemester === "2026-0" ? "opacity-0" : "opacity-0 group-hover:opacity-20"}`} />
              <div className="relative z-10">
                <span className={`block text-xl font-black transition-colors duration-500 ${selectedSemester === "2026-0" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                  2026-0
                </span>
                <span className={`text-sm transition-colors duration-500 ${selectedSemester === "2026-0" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                  Nivelación
                </span>
              </div>
              {selectedSemester === "2026-0" && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full mb-1 animate-pulse" />
              )}
            </button>

            {/* 2026-1 */}
            <button
              onClick={() => setSelectedSemester("2026-1")}
              className="group relative px-8 py-4 rounded-2xl font-bold text-base min-w-[180px] cursor-pointer overflow-hidden transition-all duration-500 ease-out"
              style={{
                background: selectedSemester === "2026-1"
                  ? "linear-gradient(135deg, #22c55e 0%, #15803d 100%)"
                  : undefined,
                transform: selectedSemester === "2026-1" ? "scale(1.05)" : "scale(1)",
                boxShadow: selectedSemester === "2026-1"
                  ? "0 20px 40px -10px rgba(34, 197, 94, 0.5)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 transition-opacity duration-500 ${selectedSemester === "2026-1" ? "opacity-0" : "opacity-100"}`} />
              <div className={`absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 transition-opacity duration-500 ${selectedSemester === "2026-1" ? "opacity-0" : "opacity-0 group-hover:opacity-20"}`} />
              <div className="relative z-10">
                <span className={`block text-xl font-black transition-colors duration-500 ${selectedSemester === "2026-1" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                  2026-1
                </span>
                <span className={`text-sm transition-colors duration-500 ${selectedSemester === "2026-1" ? "text-green-100" : "text-gray-500 dark:text-gray-400"}`}>
                  Primer Semestre
                </span>
              </div>
              {selectedSemester === "2026-1" && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full mb-1 animate-pulse" />
              )}
            </button>

            {/* 2026-2 */}
            <button
              onClick={() => setSelectedSemester("2026-2")}
              className="group relative px-8 py-4 rounded-2xl font-bold text-base min-w-[180px] cursor-pointer overflow-hidden transition-all duration-500 ease-out"
              style={{
                background: selectedSemester === "2026-2"
                  ? "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
                  : undefined,
                transform: selectedSemester === "2026-2" ? "scale(1.05)" : "scale(1)",
                boxShadow: selectedSemester === "2026-2"
                  ? "0 20px 40px -10px rgba(168, 85, 247, 0.5)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <div className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 transition-opacity duration-500 ${selectedSemester === "2026-2" ? "opacity-0" : "opacity-100"}`} />
              <div className={`absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 transition-opacity duration-500 ${selectedSemester === "2026-2" ? "opacity-0" : "opacity-0 group-hover:opacity-20"}`} />
              <div className="relative z-10">
                <span className={`block text-xl font-black transition-colors duration-500 ${selectedSemester === "2026-2" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                  2026-2
                </span>
                <span className={`text-sm transition-colors duration-500 ${selectedSemester === "2026-2" ? "text-purple-100" : "text-gray-500 dark:text-gray-400"}`}>
                  Segundo Semestre
                </span>
              </div>
              {selectedSemester === "2026-2" && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-white rounded-full mb-1 animate-pulse" />
              )}
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
        <div
          key={selectedSemester}
          className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
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
