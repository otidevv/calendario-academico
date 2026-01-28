export type CategoryType =
  | "nivelacion"
  | "admision"
  | "bienestar"
  | "biblioteca"
  | "proyeccion"
  | "academico"
  | "examenes"
  | "no-lectivo"
  | "feriado-nacional"
  | "feriado-regional";

export type SemesterType = "2026-0" | "2026-1" | "2026-2" | "general";

export type ViewType = "list" | "timeline";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  category: CategoryType;
  semester: SemesterType;
  isRange?: boolean;
}

export interface Category {
  id: CategoryType;
  name: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

export interface Semester {
  id: SemesterType;
  name: string;
  description: string;
}

export interface FilterState {
  semester: SemesterType | "all";
  categories: CategoryType[];
  searchQuery: string;
}
