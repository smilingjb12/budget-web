import { Routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export default function NotFound() {
  redirect(Routes.auctions());
}
