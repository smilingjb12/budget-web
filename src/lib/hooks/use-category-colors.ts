// Define category names as constants to avoid duplication
const CATEGORIES = {
  // Expense categories
  FOOD: "Food",
  TRANSPORTATION: "Transportation",
  RENT_BILLS: "Rent & Bills",
  SHOPPING: "Shopping",
  TRAVEL: "Travel",
  LEISURE: "Leisure",
  EDUCATION: "Education",
  WELLNESS_BEAUTY: "Wellness and Beauty",
  OTHER: "Other",
  GIFTS: "Gifts",
  // Income categories
  PAYCHECK: "Paycheck",
  GIFT: "Gift",
} as const;

type ColorConfig = {
  bg: string;
  border: string;
};

const categoryColors: Record<string, ColorConfig> = {
  [CATEGORIES.FOOD]: { bg: "bg-emerald-500", border: "border-emerald-500" },
  [CATEGORIES.TRANSPORTATION]: { bg: "bg-blue-500", border: "border-blue-500" },
  [CATEGORIES.RENT_BILLS]: { bg: "bg-purple-500", border: "border-purple-500" },
  [CATEGORIES.SHOPPING]: { bg: "bg-pink-500", border: "border-pink-500" },
  [CATEGORIES.TRAVEL]: { bg: "bg-amber-500", border: "border-amber-500" },
  [CATEGORIES.LEISURE]: { bg: "bg-indigo-500", border: "border-indigo-500" },
  [CATEGORIES.EDUCATION]: { bg: "bg-cyan-500", border: "border-cyan-500" },
  [CATEGORIES.WELLNESS_BEAUTY]: {
    bg: "bg-rose-500",
    border: "border-rose-500",
  },
  [CATEGORIES.OTHER]: { bg: "bg-gray-500", border: "border-gray-500" },
  [CATEGORIES.GIFTS]: { bg: "bg-red-500", border: "border-red-500" },
  [CATEGORIES.PAYCHECK]: { bg: "bg-green-600", border: "border-green-600" },
  [CATEGORIES.GIFT]: { bg: "bg-teal-500", border: "border-teal-500" },
};

// Default colors for unknown categories
const DEFAULT_COLORS: ColorConfig = {
  bg: "bg-gray-500",
  border: "border-gray-500",
};

export function useCategoryColors() {
  const getCategoryColor = (categoryName: string): string => {
    return categoryColors[categoryName]?.bg || DEFAULT_COLORS.bg;
  };

  const getCategoryBorderColor = (categoryName: string): string => {
    return categoryColors[categoryName]?.border || DEFAULT_COLORS.border;
  };

  return {
    getCategoryColor,
    getCategoryBorderColor,
  };
}
