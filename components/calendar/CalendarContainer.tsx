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

const MONTH_COLORS: Record<number, { bg: string; bgSolid: string; text: string; hover: string }> = {
  0: { bg: "bg-gradient-to-r from-amber-400 to-amber-500", bgSolid: "bg-amber-500", text: "text-amber-600 dark:text-amber-400", hover: "hover:bg-amber-100 dark:hover:bg-amber-900/30" },
  1: { bg: "bg-gradient-to-r from-blue-400 to-blue-500", bgSolid: "bg-blue-500", text: "text-blue-600 dark:text-blue-400", hover: "hover:bg-blue-100 dark:hover:bg-blue-900/30" },
  2: { bg: "bg-gradient-to-r from-green-400 to-green-500", bgSolid: "bg-green-500", text: "text-green-600 dark:text-green-400", hover: "hover:bg-green-100 dark:hover:bg-green-900/30" },
  3: { bg: "bg-gradient-to-r from-purple-400 to-purple-500", bgSolid: "bg-purple-500", text: "text-purple-600 dark:text-purple-400", hover: "hover:bg-purple-100 dark:hover:bg-purple-900/30" },
  4: { bg: "bg-gradient-to-r from-rose-400 to-rose-500", bgSolid: "bg-rose-500", text: "text-rose-600 dark:text-rose-400", hover: "hover:bg-rose-100 dark:hover:bg-rose-900/30" },
  5: { bg: "bg-gradient-to-r from-cyan-400 to-cyan-500", bgSolid: "bg-cyan-500", text: "text-cyan-600 dark:text-cyan-400", hover: "hover:bg-cyan-100 dark:hover:bg-cyan-900/30" },
  6: { bg: "bg-gradient-to-r from-orange-400 to-orange-500", bgSolid: "bg-orange-500", text: "text-orange-600 dark:text-orange-400", hover: "hover:bg-orange-100 dark:hover:bg-orange-900/30" },
  7: { bg: "bg-gradient-to-r from-indigo-400 to-indigo-500", bgSolid: "bg-indigo-500", text: "text-indigo-600 dark:text-indigo-400", hover: "hover:bg-indigo-100 dark:hover:bg-indigo-900/30" },
  8: { bg: "bg-gradient-to-r from-pink-400 to-pink-500", bgSolid: "bg-pink-500", text: "text-pink-600 dark:text-pink-400", hover: "hover:bg-pink-100 dark:hover:bg-pink-900/30" },
  9: { bg: "bg-gradient-to-r from-teal-400 to-teal-500", bgSolid: "bg-teal-500", text: "text-teal-600 dark:text-teal-400", hover: "hover:bg-teal-100 dark:hover:bg-teal-900/30" },
  10: { bg: "bg-gradient-to-r from-violet-400 to-violet-500", bgSolid: "bg-violet-500", text: "text-violet-600 dark:text-violet-400", hover: "hover:bg-violet-100 dark:hover:bg-violet-900/30" },
  11: { bg: "bg-gradient-to-r from-yellow-400 to-yellow-500", bgSolid: "bg-yellow-500", text: "text-yellow-600 dark:text-yellow-400", hover: "hover:bg-yellow-100 dark:hover:bg-yellow-900/30" },
};

export function CalendarContainer() {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [expandedMonth, setExpandedMonth] = useState<number | null>(null);
  const [selectedSemester, setSelectedSemester] = useState<SemesterType | null>(null);

  const filteredEvents = useMemo(() => {
    // Si no hay período seleccionado, no mostrar eventos
    if (!selectedSemester) return [];

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

  // Calcular qué meses tienen eventos
  const monthsWithEvents = useMemo(() => {
    const months = new Set<number>();
    filteredEvents.forEach((event) => {
      const startDate = new Date(event.startDate + "T00:00:00");
      const endDate = event.endDate
        ? new Date(event.endDate + "T00:00:00")
        : startDate;

      // Agregar todos los meses entre inicio y fin del evento
      let current = new Date(startDate);
      while (current <= endDate) {
        if (current.getFullYear() === 2026) {
          months.add(current.getMonth());
        }
        current.setMonth(current.getMonth() + 1);
        current.setDate(1);
      }
    });
    return Array.from(months).sort((a, b) => a - b);
  }, [filteredEvents]);

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const scrollToMonth = (month: number) => {
    setSelectedMonth(month);
    setExpandedMonth(month); // También expandir el mes

    const scrollToElement = () => {
      const element = document.getElementById(`month-${month}`);
      if (element) {
        const headerOffset = 140;
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth"
        });
      }
    };

    // Pequeño delay para permitir que React actualice el estado
    requestAnimationFrame(() => {
      scrollToElement();
      // Scroll de ajuste después de que la animación termine
      setTimeout(scrollToElement, 450);
    });
  };

  const toggleMonth = (month: number) => {
    const isOpening = expandedMonth !== month;
    setExpandedMonth(isOpening ? month : null);

    // Si se está abriendo, hacer scroll para mostrar el mes completo
    if (isOpening) {
      const scrollToElement = () => {
        const element = document.getElementById(`month-${month}`);
        if (element) {
          const headerOffset = 140;
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          window.scrollTo({
            top: Math.max(0, offsetPosition),
            behavior: "smooth"
          });
        }
      };

      // Usar requestAnimationFrame para mejor sincronización
      requestAnimationFrame(() => {
        scrollToElement();
        setTimeout(scrollToElement, 450);
      });
    }
  };

  const handleSemesterChange = (semester: SemesterType) => {
    setSelectedSemester(semester);
    setExpandedMonth(null); // Resetear mes expandido al cambiar de periodo
    setSelectedMonth(null); // Resetear mes seleccionado también
  };

  // Get semester info for display
  const getSemesterInfo = (id: SemesterType | null) => {
    if (!id) return { name: "Selecciona un período", description: "" };
    const sem = semesters.find((s) => s.id === id);
    return sem || { name: id, description: "" };
  };

  const currentSemesterInfo = getSemesterInfo(selectedSemester);

  return (
    <div className="min-h-screen">
      {/* Banner con OTO */}
      <div className="relative py-10 md:py-14 overflow-hidden">
        {/* Gradiente de fondo oscuro */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)"
          }}
        ></div>

        {/* Imagen de fondo sutil */}
        <div
          className="absolute inset-0 opacity-[0.15]"
          style={{
            backgroundImage: "url('/img/body/imagenunamad.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>

        {/* Decoración de círculos con color */}
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-pink-500/10 rounded-full -translate-y-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full translate-y-1/2 pointer-events-none"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12 lg:gap-16">
            {/* Texto central */}
            <div className="text-center">
              {/* Bienvenido al - Estilo editorial */}
              <div className="mb-2">
                <span className="text-xs md:text-sm font-bold tracking-[0.3em] uppercase text-pink-300">
                  — bienvenido al —
                </span>
              </div>

              {/* Título principal */}
              <h2 className="relative mb-3">
                <span className="block text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white">
                  CALENDARIO
                </span>
                <span
                  className="block text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mt-1 md:mt-2"
                  style={{
                    background: "linear-gradient(135deg, #ff4d8d, #db0455, #ff6b9d)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent"
                  }}
                >
                  ACADÉMICO
                </span>
              </h2>
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-pink-500 rounded-full"></div>
                <span
                  className="text-base md:text-lg font-bold px-5 py-1.5 rounded-full border border-pink-500/30"
                  style={{
                    background: "linear-gradient(135deg, rgba(219, 4, 85, 0.2), rgba(147, 51, 234, 0.2))",
                    color: "white",
                    boxShadow: "0 0 20px rgba(219, 4, 85, 0.3)"
                  }}
                >
                  con OTO
                </span>
                <div className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-purple-500 rounded-full"></div>
              </div>
              <p className="text-sm md:text-base text-white font-semibold max-w-md mx-auto">
                Tu guía oficial para organizar el año académico <span className="font-black text-pink-400">2026</span>
              </p>
            </div>

            {/* Mascota derecha - OTO con like */}
            <img
              src="/img/mascota/otolike.png"
              alt="OTO - Mascota UNAMAD"
              loading="eager"
              className="w-32 md:w-40 lg:w-48 h-auto"
            />
          </div>
        </div>
      </div>

      {/* Semester Filter Tabs */}
      <div className="relative bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden">
        {/* Patrón de fondo */}
        <div
          className="absolute inset-0 opacity-[0.5] dark:opacity-[0.2]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23db0455' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='13' cy='13' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 py-6">
            {/* 2026-0 */}
            <button
              onClick={() => handleSemesterChange("2026-0")}
              className="group relative px-10 py-5 rounded-2xl font-bold text-base min-w-[220px] cursor-pointer overflow-hidden "
              style={{
                background: selectedSemester === "2026-0"
                  ? "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
                  : undefined,
                transform: selectedSemester === "2026-0" ? "scale(1.05)" : "scale(1)",
                boxShadow: selectedSemester === "2026-0"
                  ? "0 20px 40px -10px rgba(59, 130, 246, 0.5)"
                  : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease"
              }}
            >
              <div className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 transition-opacity duration-300 ${selectedSemester === "2026-0" ? "opacity-0" : "opacity-100"}`} />
              <div className={`absolute inset-0 bg-gradient-to-r from-blue-400 to-blue-600 transition-opacity duration-300 ${selectedSemester === "2026-0" ? "opacity-0" : "opacity-0 group-hover:opacity-20"}`} />
              <div className="relative z-10">
                <span className={`block text-3xl md:text-4xl font-black transition-colors duration-300 ${selectedSemester === "2026-0" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                  2026-0
                </span>
                <span className={`text-base transition-colors duration-300 ${selectedSemester === "2026-0" ? "text-blue-100" : "text-gray-500 dark:text-gray-400"}`}>
                  Nivelación
                </span>
              </div>
              {selectedSemester === "2026-0" && (
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-white rounded-full mb-1 animate-pulse" />
              )}
            </button>

            {/* 2026-1 */}
            <button
                  onClick={() => handleSemesterChange("2026-1")}
                  className="group relative px-10 py-5 rounded-2xl font-bold text-base min-w-[220px] cursor-pointer overflow-hidden "
                  style={{
                    background: selectedSemester === "2026-1"
                      ? "linear-gradient(135deg, #22c55e 0%, #15803d 100%)"
                      : undefined,
                    transform: selectedSemester === "2026-1" ? "scale(1.05)" : "scale(1)",
                    boxShadow: selectedSemester === "2026-1"
                      ? "0 20px 40px -10px rgba(34, 197, 94, 0.5)"
                      : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                    transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease"
                  }}
                >
                  <div className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 transition-opacity duration-300 ${selectedSemester === "2026-1" ? "opacity-0" : "opacity-100"}`} />
                  <div className={`absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 transition-opacity duration-300 ${selectedSemester === "2026-1" ? "opacity-0" : "opacity-0 group-hover:opacity-20"}`} />
                  <div className="relative z-10">
                    <span className={`block text-3xl md:text-4xl font-black transition-colors duration-300 ${selectedSemester === "2026-1" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                      2026-1
                    </span>
                    <span className={`text-base transition-colors duration-300 ${selectedSemester === "2026-1" ? "text-green-100" : "text-gray-500 dark:text-gray-400"}`}>
                      Primer Semestre
                    </span>
                  </div>
                  {selectedSemester === "2026-1" && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-white rounded-full mb-1 animate-pulse" />
                  )}
            </button>

            {/* 2026-2 */}
            <button
                onClick={() => handleSemesterChange("2026-2")}
                className="group relative px-10 py-5 rounded-2xl font-bold text-base min-w-[220px] cursor-pointer overflow-hidden "
                style={{
                  background: selectedSemester === "2026-2"
                    ? "linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)"
                    : undefined,
                  transform: selectedSemester === "2026-2" ? "scale(1.05)" : "scale(1)",
                  boxShadow: selectedSemester === "2026-2"
                    ? "0 20px 40px -10px rgba(168, 85, 247, 0.5)"
                    : "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease"
                }}
              >
                <div className={`absolute inset-0 bg-gray-100 dark:bg-gray-800 transition-opacity duration-300 ${selectedSemester === "2026-2" ? "opacity-0" : "opacity-100"}`} />
                <div className={`absolute inset-0 bg-gradient-to-r from-purple-400 to-purple-600 transition-opacity duration-300 ${selectedSemester === "2026-2" ? "opacity-0" : "opacity-0 group-hover:opacity-20"}`} />
                <div className="relative z-10">
                  <span className={`block text-3xl md:text-4xl font-black transition-colors duration-300 ${selectedSemester === "2026-2" ? "text-white" : "text-gray-700 dark:text-gray-300"}`}>
                    2026-2
                  </span>
                  <span className={`text-base transition-colors duration-300 ${selectedSemester === "2026-2" ? "text-purple-100" : "text-gray-500 dark:text-gray-400"}`}>
                    Segundo Semestre
                  </span>
                </div>
                {selectedSemester === "2026-2" && (
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-1 bg-white rounded-full mb-1 animate-pulse" />
                )}
            </button>

            {/* Mascota OTO */}
            <img
              src="/img/mascota/mascota.png"
              alt="OTO - Mascota UNAMAD"
              className="w-40 md:w-48 h-auto hidden md:block"
            />
          </div>
        </div>
      </div>

      {/* Navigation - Solo visible cuando hay período seleccionado */}
      {selectedSemester && (
      <div className="sticky top-16 z-40 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
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

            {/* Month shortcuts - Solo meses con eventos */}
            <div className="flex flex-wrap gap-1.5">
              {monthsWithEvents.map((index) => {
                const isSelected = selectedMonth === index;
                const colorMap: Record<number, string> = {
                  0: "#f59e0b", 1: "#3b82f6", 2: "#22c55e", 3: "#a855f7",
                  4: "#f43f5e", 5: "#06b6d4", 6: "#f97316", 7: "#6366f1",
                  8: "#ec4899", 9: "#14b8a6", 10: "#8b5cf6", 11: "#eab308"
                };
                return (
                  <button
                    key={MONTHS[index]}
                    onClick={() => scrollToMonth(index)}
                    className="px-3 py-1.5 text-xs font-semibold rounded-md transition-all duration-200 cursor-pointer hover:scale-105"
                    style={{
                      backgroundColor: isSelected ? colorMap[index] : undefined,
                      color: isSelected ? "white" : colorMap[index],
                      border: isSelected ? "none" : `2px solid ${colorMap[index]}`,
                      boxShadow: isSelected ? `0 4px 12px ${colorMap[index]}40` : undefined
                    }}
                  >
                    {MONTHS[index].slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      )}

      {/* Calendar months */}
      <div className="container mx-auto px-4 py-8">
        {selectedSemester ? (
          <div
            key={selectedSemester}
            className="space-y-6"
          >
            {MONTHS.map((monthName, index) => (
              <div key={monthName} id={`month-${index}`} className="scroll-mt-36 scroll-snap-item">
                <MonthView
                  year={2026}
                  month={index}
                  monthName={monthName}
                  events={filteredEvents}
                  onEventClick={handleEventClick}
                  isExpanded={expandedMonth === index}
                  onToggle={() => toggleMonth(index)}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            {/* Icono de calendario */}
            <div className="relative inline-block mb-6">
              <div
                className="w-24 h-24 rounded-2xl flex flex-col items-center justify-center shadow-xl"
                style={{
                  background: "linear-gradient(135deg, #db0455 0%, #a855f7 100%)"
                }}
              >
                {/* Barra superior del calendario */}
                <div className="absolute -top-2 left-4 right-4 h-3 bg-white/30 rounded-full"></div>
                <div className="absolute -top-1 left-6 w-2 h-4 bg-gray-700 rounded-full"></div>
                <div className="absolute -top-1 right-6 w-2 h-4 bg-gray-700 rounded-full"></div>

                {/* Contenido del calendario */}
                <div className="text-white text-xs font-bold mt-2 tracking-wider">2026</div>
                <div className="text-white text-3xl font-black">OTO</div>
              </div>

              {/* Efecto de brillo */}
              <div
                className="absolute inset-0 rounded-2xl opacity-50 pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 50%)"
                }}
              ></div>
            </div>

            <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-3">
              Selecciona un período académico
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Haz clic en uno de los botones de arriba para ver el calendario de actividades
            </p>
          </div>
        )}
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
