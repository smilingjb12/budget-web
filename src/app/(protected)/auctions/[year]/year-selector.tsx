import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";

export function YearSelector() {
  const params = useParams<{ year: string }>();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [optimisticYear, setOptimisticYear] = useState<number | null>(null);

  const selectedYear = optimisticYear ?? Number(params.year);
  const currentYear = new Date().getFullYear();
  const allYears = Array.from({ length: 15 }, (_, i) => currentYear - i);

  const yearChunks = Array.from(
    { length: Math.ceil(allYears.length / 5) },
    (_, i) => allYears.slice(i * 5, (i + 1) * 5)
  );

  return (
    <div className="w-full max-w-md p-4 pl-0">
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            // Reset optimistic year when popover closes
            setOptimisticYear(null);
          }
        }}
      >
        <PopoverTrigger asChild>
          <button
            className="cursor-pointer flex items-center text-3xl font-bold text-foreground hover:text-foreground/80 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            aria-label="Select year"
          >
            {selectedYear}
            <ChevronDown
              className={`ml-1 h-5 w-5 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
            />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-6" align="start">
          {yearChunks.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className="grid grid-cols-5 gap-2 mb-2 last:mb-0"
            >
              {row.map((year) => (
                <button
                  key={year}
                  onClick={() => {
                    setOptimisticYear(year);
                    router.push(`/auctions/${year}`);
                    setIsOpen(false);
                  }}
                  className={`p-2 px-4 rounded-full text-center transition-colors cursor-pointer
                    hover:text-primary hover:outline-none hover:ring-2 hover:ring-primary
                    ${selectedYear === year ? "bg-primary text-primary-foreground hover:text-primary-foreground" : ""}
                  `}
                >
                  {year}
                </button>
              ))}
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  );
}
