"use client";

import { Routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export default function Home() {
  redirect(Routes.auctionsList(new Date().getFullYear()));
}
