"use client";

import { SegmentedProgress } from "@/components/ui/segmented-progress";
import { useCategoryColors } from "@/lib/hooks/use-category-colors";
import { useCategoryIcon } from "@/lib/hooks/use-category-icon";
import { formatUSD } from "@/lib/utils";

type Category = {
  categoryName: string;
  totalValue: number;
  icon: string;
};

type CategoryProgressSectionProps = {
  sortedCategories: Category[];
  totalMonthlyAmount: number;
};

export function CategoryProgressSection({
  sortedCategories,
  totalMonthlyAmount,
}: CategoryProgressSectionProps) {
  const { getCategoryIcon } = useCategoryIcon();
  const { getCategoryColor } = useCategoryColors();

  return (
    <div className="mb-6">
      <SegmentedProgress
        height={24}
        segments={sortedCategories.map((category) => {
          const IconComponent = getCategoryIcon(category.icon);
          return {
            value: Number(category.totalValue),
            color: getCategoryColor(category.categoryName),
            tooltip: (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <IconComponent className="size-4" />
                  <span>{category.categoryName}</span>
                </div>
                <div className="text-xs mt-1">
                  {formatUSD(Number(category.totalValue))} (
                  {(
                    (Number(category.totalValue) / totalMonthlyAmount) *
                    100
                  ).toFixed(1)}
                  %)
                </div>
              </div>
            ),
            icon: <IconComponent className="size-4" />,
          };
        })}
      />
    </div>
  );
}
