import { Constants } from "@/constants";
import { cn } from "@/lib/utils";
import { Pencil } from "lucide-react";
import * as React from "react";
import { Input } from "./ui/input";

interface InlineEditInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  value: string;
  displayValue?: string;
  displayNode?: React.ReactNode;
  onSave: (value: string) => void;
  className?: string;
}

export const InlineEditInput = React.forwardRef<
  HTMLInputElement,
  InlineEditInputProps
>(
  (
    { value, displayValue, displayNode, onSave, className, ...props },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ref
  ) => {
    const [isEditing, setIsEditing] = React.useState(false);
    const [inputValue, setInputValue] = React.useState(value);
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      setInputValue(value);
    }, [value]);

    React.useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    const handleBlur = () => {
      setIsEditing(false);
      const trimmedValue = inputValue.trim();
      setInputValue(trimmedValue);
      if (trimmedValue !== value) {
        onSave(trimmedValue);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleBlur();
      } else if (e.key === "Escape") {
        setIsEditing(false);
        setInputValue(value);
      }
    };

    if (!isEditing && displayNode) {
      return (
        <div
          onClick={() => setIsEditing(true)}
          className="group relative mr-1 cursor-pointer rounded-md hover:bg-muted/70 p-1"
        >
          {displayNode}
          <Pencil className="absolute text-primary right-3 top-1/2 size-4.5 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
        </div>
      );
    }

    return (
      <div className="group relative mr-1">
        <Input
          {...props}
          ref={inputRef}
          value={isEditing ? inputValue : (displayValue ?? inputValue)}
          onChange={(e) => setInputValue(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          readOnly={!isEditing}
          onClick={() => !isEditing && setIsEditing(true)}
          className={cn(
            "h-8",
            Constants.TABLE_TEXT_SIZE,
            !isEditing &&
              `${Constants.EDITABLE_CELL_INPUT_PADDING} cursor-pointer hover:bg-muted/70 border-transparent focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0`,
            className
          )}
        />
        {!isEditing && (
          <Pencil className="absolute text-primary right-3 top-1/2 size-4.5 -translate-y-1/2 opacity-0 group-hover:opacity-100" />
        )}
      </div>
    );
  }
);

InlineEditInput.displayName = "InlineEditInput";
