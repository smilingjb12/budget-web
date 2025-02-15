import { Gavel } from "lucide-react";
import { SIDEBAR_WIDTH_PX } from "@/lib/constants";

export function Sidebar() {
  return (
    <div
      style={{ width: SIDEBAR_WIDTH_PX }}
      className="bg-zinc-900 fixed left-0 top-0 bottom-0 flex flex-col items-center pt-4 border-l-4 border-l-primary-foreground"
    >
      <Gavel className="size-9 text-primary-foreground" />
    </div>
  );
}
