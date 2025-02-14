"use client";

import { Button } from "@/components/ui/button";
import { Constants } from "@/constants";
import { SignInButton, useClerk, useUser } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { LogOutIcon, Menu, PackageIcon, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { api } from "../../convex/_generated/api";
import { AvatarDropdown } from "./avatar-dropdown";
import { Routes } from "@/lib/routes";

export function Header() {
  const { user } = useUser();
  const clerk = useClerk();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-md bg-secondary">
      <nav className="container flex h-16 w-full items-center justify-between px-4 md:px-6">
        <div className="flex items-center gap-12">
          <Link
            href="/"
            className="flex items-center gap-2 group hover:text-primary transition-colors duration-100"
          >
            <PackageIcon className="size-7" />
            <span className="text-base font-semibold sm:text-lg md:text-xl lg:text-xl group-hover:text-primary">
              {Constants.APP_NAME}
            </span>
          </Link>
          <div className="hidden md:flex md:items-center md:ml-20 lg:ml-40">
            <div className="flex items-center md:gap-6 lg:gap-12 text-sm sm:text-base md:text-lg lg:text-lg font-medium">
              <Authenticated>
                <Link
                  href={Routes.collectionPage()}
                  className="hover:text-primary text-foreground transition-colors duration-100"
                >
                  Collection
                </Link>
              </Authenticated>

              <Link
                href={Routes.createPage()}
                className="hover:text-primary text-foreground transition-colors duration-100"
              >
                Create
              </Link>
            </div>
          </div>
        </div>
        <Button
          className="md:hidden"
          variant="ghost"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
        <div className="hidden md:flex md:items-center gap-4 text-foreground">
          <Authenticated>
            <AvatarDropdown
              fullName={user?.fullName}
              imageUrl={user?.imageUrl}
              email={user?.emailAddresses[0].emailAddress}
            />
          </Authenticated>
          <Unauthenticated>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </Unauthenticated>
        </div>
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden bg-secondary py-4 px-6">
          <div className="flex flex-col gap-4 items-center w-full">
            <Button variant="ghost" asChild>
              <Link
                href={Routes.collectionPage()}
                className="hover:text-primary text-foreground w-full"
                onClick={toggleMobileMenu}
              >
                Collection
              </Link>
            </Button>

            <Button variant="ghost" asChild>
              <Link
                href={Routes.createPage()}
                className="hover:text-primary text-foreground w-full"
                onClick={toggleMobileMenu}
              >
                Create
              </Link>
            </Button>
            <Authenticated>
              <Button
                variant="ghost"
                className="hover:bg-transparent/20 justify-center w-full"
                onClick={() => {
                  clerk.signOut();
                  toggleMobileMenu();
                }}
              >
                <LogOutIcon className="mr-2" />
                Sign Out
              </Button>
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="redirect">
                <Button className="w-full justify-center">Sign In</Button>
              </SignInButton>
            </Unauthenticated>
          </div>
        </div>
      )}
    </header>
  );
}
