"use client";

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import * as React from "react";

interface ComboboxInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "value"
  > {
  value: string;
  onChange: (value: string) => void;
  onInputChange?: (value: string) => void;
  suggestions: string[];
  placeholder?: string;
  className?: string;
  emptyMessage?: string;
}

export const ComboboxInput = React.forwardRef<
  HTMLInputElement,
  ComboboxInputProps
>(
  (
    {
      value,
      onChange,
      onInputChange,
      suggestions,
      placeholder = "",
      className = "",
      emptyMessage = "No suggestions found.",
      ...props
    },
    ref
  ) => {
    // We'll always keep the popover open when there are suggestions
    // and the input has some text, except when there's only one suggestion
    // that exactly matches the input value
    const showSuggestions =
      suggestions.length > 0 &&
      value.trim().length > 0 &&
      !(suggestions.length === 1 && suggestions[0] === value.trim());

    const [inputValue, setInputValue] = React.useState(value || "");

    // Update internal state when external value changes
    React.useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange(newValue);
      if (onInputChange) {
        onInputChange(newValue);
      }
    };

    return (
      <div className="relative w-full">
        <FormControl>
          <Input
            ref={ref}
            type="text"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            className={className}
            {...props}
          />
        </FormControl>

        {showSuggestions && (
          <div className="absolute z-50 w-full mt-1 bg-popover rounded-md border shadow-md">
            <Command>
              <CommandList>
                <CommandGroup>
                  {suggestions.map((suggestion) => (
                    <CommandItem
                      key={suggestion}
                      value={suggestion}
                      onSelect={(value) => {
                        onChange(value);
                        setInputValue(value);
                        if (onInputChange) {
                          onInputChange(value);
                        }
                      }}
                    >
                      {suggestion}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </div>
        )}
      </div>
    );
  }
);

ComboboxInput.displayName = "ComboboxInput";
