import { Gavel } from "lucide-react";
import { Header } from "../header";
import { SIDEBAR_WIDTH_PX } from "@/lib/constants";
import { Sidebar } from "./sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-1">
      <Header />
      <Sidebar />
      <>{children}</>
    </div>
  );
}
