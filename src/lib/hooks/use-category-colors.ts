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

const categoryColors: Record<string, string> = {
  [CATEGORIES.FOOD]: "bg-emerald-500",
  [CATEGORIES.TRANSPORTATION]: "bg-blue-500",
  [CATEGORIES.RENT_BILLS]: "bg-purple-500",
  [CATEGORIES.SHOPPING]: "bg-pink-500",
  [CATEGORIES.TRAVEL]: "bg-amber-500",
  [CATEGORIES.LEISURE]: "bg-indigo-500",
  [CATEGORIES.EDUCATION]: "bg-cyan-500",
  [CATEGORIES.WELLNESS_BEAUTY]: "bg-rose-500",
  [CATEGORIES.OTHER]: "bg-gray-500",
  [CATEGORIES.GIFTS]: "bg-red-500",
  [CATEGORIES.PAYCHECK]: "bg-green-600",
  [CATEGORIES.GIFT]: "bg-teal-500",
};

// Default color for unknown categories
const DEFAULT_COLOR = "bg-gray-500";

export function useCategoryColors() {
  const getCategoryColor = (categoryName: string): string => {
    return categoryColors[categoryName] || DEFAULT_COLOR;
  };

  const getCategoryBorderColor = (categoryName: string): string => {
    const bgColor = getCategoryColor(categoryName);
    return bgColor.replace("bg-", "border-");
  };

  return {
    getCategoryColor,
    getCategoryBorderColor,
  };
}
