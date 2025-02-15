"use client";

import { Button } from "@/components/ui/button";
import { Constants } from "@/constants";
import {
  Authenticated,
  Unauthenticated,
  useQuery,
  useConvexAuth,
} from "convex/react";
import { LogOut, LogOutIcon, Menu, PackageIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { AvatarDropdown } from "./avatar-dropdown";
import { Routes } from "@/lib/routes";
import { useAuthActions } from "@convex-dev/auth/react";
import { SIDEBAR_WIDTH_PX } from "@/lib/constants";

export function Header() {
  const { isAuthenticated } = useConvexAuth();
  const user = useQuery(api.users.getMe);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { signOut } = useAuthActions();
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

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
