import { ChevronRight } from "lucide-react";
import { ReactNode } from "react";

interface BreadcrumbItemProps {
  isActive?: boolean;
  children: ReactNode;
}

export function BreadcrumbItem({
  isActive = false,
  children,
}: BreadcrumbItemProps) {
  return (
    <span className={`${isActive ? "font-semibold" : "text-muted-foreground"}`}>
      {children}
    </span>
  );
}

export function BreadcrumbSeparator() {
  return <ChevronRight className="w-4 h-4 mx-2 text-muted-foreground" />;
}

export function Breadcrumbs({ children }: { children: ReactNode }) {
  return <div className="flex items-center text-sm">{children}</div>;
}
