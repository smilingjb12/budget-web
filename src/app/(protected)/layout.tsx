import { Header } from "./header";
import { Sidebar } from "./sidebar";

export default function LoggedInLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="py-1 min-h-screen">
      <Header />
      <Sidebar />
      <>{children}</>
    </div>
  );
}
