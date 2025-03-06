import { Month, Routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export default function NotFound() {
  redirect(Routes.recordsByMonth((new Date().getMonth() + 1) as Month));
}
