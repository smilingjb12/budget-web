import { Header } from "../header";
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
