import { Badge } from "@/components/ui/badge";
import { categories } from "@/data/calendar-data";
import type { CategoryType } from "@/types/calendar";

interface CategoryBadgeProps {
  category: CategoryType;
  size?: "sm" | "default";
}

export function CategoryBadge({ category, size = "default" }: CategoryBadgeProps) {
  const categoryData = categories.find((c) => c.id === category);

  if (!categoryData) return null;

  return (
    <Badge
      variant="secondary"
      className={`${categoryData.bgColor} ${categoryData.color} border ${categoryData.borderColor} ${
        size === "sm" ? "text-xs px-2 py-0.5" : "text-sm"
      }`}
    >
      {categoryData.name}
    </Badge>
  );
}
