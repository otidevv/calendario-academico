"use client";

import { useState, useMemo, useCallback } from "react";
import type { FilterState, SemesterType, CategoryType, CalendarEvent } from "@/types/calendar";
import { calendarEvents, categories } from "@/data/calendar-data";

const initialFilterState: FilterState = {
  semester: "all",
  categories: categories.map((c) => c.id),
  searchQuery: "",
};

export function useCalendarFilters() {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);

  const setSemester = useCallback((semester: SemesterType | "all") => {
    setFilters((prev) => ({ ...prev, semester }));
  }, []);

  const toggleCategory = useCallback((category: CategoryType) => {
    setFilters((prev) => {
      const isSelected = prev.categories.includes(category);
      return {
        ...prev,
        categories: isSelected
          ? prev.categories.filter((c) => c !== category)
          : [...prev.categories, category],
      };
    });
  }, []);

  const setAllCategories = useCallback((selected: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: selected ? categories.map((c) => c.id) : [],
    }));
  }, []);

  const setSearchQuery = useCallback((searchQuery: string) => {
    setFilters((prev) => ({ ...prev, searchQuery }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilterState);
  }, []);

  const filteredEvents = useMemo(() => {
    let events = [...calendarEvents];

    // Filter by semester
    if (filters.semester !== "all") {
      events = events.filter(
        (event) =>
          event.semester === filters.semester || event.semester === "general"
      );
    }

    // Filter by categories
    events = events.filter((event) =>
      filters.categories.includes(event.category)
    );

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      events = events.filter(
        (event) =>
          event.title.toLowerCase().includes(query) ||
          event.description?.toLowerCase().includes(query)
      );
    }

    // Sort by date
    events.sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
    );

    return events;
  }, [filters]);

  const groupedEvents = useMemo(() => {
    const grouped: Record<CategoryType, CalendarEvent[]> = {
      nivelacion: [],
      admision: [],
      bienestar: [],
      biblioteca: [],
      proyeccion: [],
      academico: [],
      examenes: [],
      "no-lectivo": [],
      "feriado-nacional": [],
      "feriado-regional": [],
    };

    filteredEvents.forEach((event) => {
      grouped[event.category].push(event);
    });

    return grouped;
  }, [filteredEvents]);

  return {
    filters,
    filteredEvents,
    groupedEvents,
    setSemester,
    toggleCategory,
    setAllCategories,
    setSearchQuery,
    resetFilters,
  };
}
