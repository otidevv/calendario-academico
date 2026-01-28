"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { categories } from "@/data/calendar-data";
import type { CategoryType } from "@/types/calendar";

interface CalendarFiltersProps {
  selectedCategories: CategoryType[];
  searchQuery: string;
  onToggleCategory: (category: CategoryType) => void;
  onSelectAll: (selected: boolean) => void;
  onSearchChange: (query: string) => void;
}

export function CalendarFilters({
  selectedCategories,
  searchQuery,
  onToggleCategory,
  onSelectAll,
  onSearchChange,
}: CalendarFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const allSelected = selectedCategories.length === categories.length;
  const noneSelected = selectedCategories.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
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
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="sm:hidden flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
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
              d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
            />
          </svg>
          Filtros
          <span className="bg-gray-200 dark:bg-gray-700 px-2 py-0.5 rounded-full text-xs">
            {selectedCategories.length}/{categories.length}
          </span>
        </button>
      </div>

      <div className={`space-y-3 ${isExpanded ? "block" : "hidden sm:block"}`}>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Categorías
          </span>
          <button
            onClick={() => onSelectAll(!allSelected)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            {allSelected ? "Deseleccionar todo" : "Seleccionar todo"}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((category) => {
            const isSelected = selectedCategories.includes(category.id);
            return (
              <button
                key={category.id}
                onClick={() => onToggleCategory(category.id)}
                className={`px-3 py-1.5 text-xs sm:text-sm rounded-full border transition-all ${
                  isSelected
                    ? `${category.bgColor} ${category.color} ${category.borderColor}`
                    : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border-gray-200 dark:border-gray-700"
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </div>

        {noneSelected && (
          <p className="text-sm text-amber-600 dark:text-amber-400">
            Selecciona al menos una categoría para ver eventos
          </p>
        )}
      </div>
    </div>
  );
}
