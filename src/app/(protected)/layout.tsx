"use client";

import {
  APP_SEGMENT,
  CHARTS_SEGMENT,
  Month,
  Routes,
  SETTINGS_SEGMENT,
} from "@/lib/routes";
import { cn } from "@/lib/utils";
import { History, LineChart, Settings2 } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface BottomNavItemProps {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}

function BottomNavItem({ icon, label, isActive, onClick }: BottomNavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center justify-center py-2",
        isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
      )}
    >
      <div className="mb-1">{icon}</div>
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}

function MobileBottomNav() {
  const pathname = usePathname();
  const router = useRouter();

  const isHistory =
    pathname.includes(`/${APP_SEGMENT}/`) &&
    !pathname.includes(`/${APP_SEGMENT}/${CHARTS_SEGMENT}`) &&
    !pathname.includes(`/${APP_SEGMENT}/${SETTINGS_SEGMENT}`);

  const isCharts = pathname.includes(`/${APP_SEGMENT}/${CHARTS_SEGMENT}`);
  const isStats = pathname.includes(`/${APP_SEGMENT}/${SETTINGS_SEGMENT}`);

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-background">
      <nav className="flex h-16 items-center justify-around px-4">
        <BottomNavItem
          icon={<History size={24} />}
          label="History"
          isActive={isHistory}
          onClick={() => {
            // Navigate to the current year/month or default
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            router.push(Routes.monthlyExpensesSummary(year, month as Month));
          }}
        />
        <BottomNavItem
          icon={<LineChart size={24} />}
          label="Charts"
          isActive={isCharts}
          onClick={() => router.push(Routes.charts())}
        />
        <BottomNavItem
          icon={<Settings2 size={24} />}
          label="Settings"
          isActive={isStats}
          onClick={() => router.push(Routes.settings())}
        />
      </nav>
    </div>
  );
}

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen pb-16 md:pb-0">
      {children}
      <MobileBottomNav />
    </div>
  );
}
