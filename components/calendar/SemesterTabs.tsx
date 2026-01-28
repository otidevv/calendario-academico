"use client";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { semesters } from "@/data/calendar-data";
import type { SemesterType } from "@/types/calendar";

interface SemesterTabsProps {
  value: SemesterType | "all";
  onChange: (value: SemesterType | "all") => void;
}

export function SemesterTabs({ value, onChange }: SemesterTabsProps) {
  return (
    <Tabs value={value} onValueChange={(v) => onChange(v as SemesterType | "all")}>
      <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:inline-flex">
        <TabsTrigger value="all" className="text-xs sm:text-sm">
          Todos
        </TabsTrigger>
        {semesters.slice(0, 3).map((semester) => (
          <TabsTrigger key={semester.id} value={semester.id} className="text-xs sm:text-sm">
            {semester.name}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
