"use client";

import { Button } from "@/components/ui/button";
import { SIDEBAR_WIDTH_PX } from "@/lib/constants";
import { useAuthActions } from "@convex-dev/auth/react";
import { LogOut } from "lucide-react";

export function Header() {
  const { signOut } = useAuthActions();

  return (
    <div
      className="h-12 fixed top-0 right-0 bg-background z-50 flex items-center px-6 pl-10 border-b"
      style={{ left: SIDEBAR_WIDTH_PX }}
    >
      <h1 className="text-muted-foreground font-semibold text-sm">Auctions</h1>
      <div className="ml-auto">
        <Button
          variant="ghost"
          className="text-muted-foreground cursor-pointer"
          onClick={() => signOut()}
        >
          <LogOut className="w-4 h-4 mr-2 text-primary" />
          Log out
        </Button>
      </div>
    </div>
  );
}
