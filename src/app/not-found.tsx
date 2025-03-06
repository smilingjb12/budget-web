import { Month, Routes } from "@/lib/routes";
import { redirect } from "next/navigation";

export default function NotFound() {
  const currentDate = new Date();
  redirect(
    Routes.monthlyExpensesSummary(
      currentDate.getFullYear(),
      (currentDate.getMonth() + 1) as Month
    )
  );
}
