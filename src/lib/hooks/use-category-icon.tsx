import {
  CarTaxiFrontIcon,
  DramaIcon,
  GiftIcon,
  GraduationCapIcon,
  HandCoinsIcon,
  HeartPulseIcon,
  HelpCircleIcon,
  HomeIcon,
  LucideIcon,
  PlaneIcon,
  ReceiptTextIcon,
  ShoppingCartIcon,
  UtensilsIcon,
} from "lucide-react";

export function useCategoryIcon() {
  const getCategoryIcon = (iconName: string): LucideIcon => {
    switch (iconName) {
      case "utensils":
        return UtensilsIcon;
      case "car-taxi-front":
        return CarTaxiFrontIcon;
      case "house":
        return HomeIcon;
      case "shopping-cart":
        return ShoppingCartIcon;
      case "plane":
        return PlaneIcon;
      case "drama":
        return DramaIcon;
      case "graduation-cap":
        return GraduationCapIcon;
      case "heart-pulse":
        return HeartPulseIcon;
      case "receipt-text":
        return ReceiptTextIcon;
      case "gift":
        return GiftIcon;
      case "hand-coins":
        return HandCoinsIcon;
      default:
        return HelpCircleIcon;
    }
  };

  return { getCategoryIcon };
}
