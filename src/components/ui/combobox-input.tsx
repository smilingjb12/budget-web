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
      ...props
    },
    ref
  ) => {
    // Track whether a suggestion has been selected
    const [isSelected, setIsSelected] = React.useState(false);
    // Track whether the dropdown should be open
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    // Ref for the component container to detect clicks outside
    const containerRef = React.useRef<HTMLDivElement>(null);

    // We'll show suggestions when the dropdown is open,
    // there are suggestions available, and the input has some text
    const showSuggestions =
      isDropdownOpen &&
      !isSelected &&
      suggestions.length > 0 &&
      value.trim().length > 0 &&
      !(suggestions.length === 1 && suggestions[0] === value.trim());

    const [inputValue, setInputValue] = React.useState(value || "");

    // Update internal state when external value changes
    React.useEffect(() => {
      setInputValue(value || "");
    }, [value]);

    // Handle clicks outside the component to close the dropdown
    React.useEffect(() => {
      const handleClickOutside = (event: Event) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(event.target as Node)
        ) {
          setIsDropdownOpen(false);
        }
      };

      // Add event listener for mousedown
      document.addEventListener("mousedown", handleClickOutside);

      // Add event listener for tab/focus changes
      document.addEventListener("focusin", handleClickOutside);

      // Cleanup
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("focusin", handleClickOutside);
      };
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      onChange(newValue);
      // Reset the selected state when the user types
      setIsSelected(false);
      // Open the dropdown when the user starts typing
      setIsDropdownOpen(true);

      if (onInputChange) {
        onInputChange(newValue);
      }
    };

    return (
      <div className="relative w-full" ref={containerRef}>
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
                        // Mark as selected to hide the dropdown
                        setIsSelected(true);
                        // Close the dropdown
                        setIsDropdownOpen(false);
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
