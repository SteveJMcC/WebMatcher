"use client";

import * as React from "react";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { Command as CommandPrimitive } from "cmdk"; // Removed useCommandState as it's not used
import { cn } from "@/lib/utils";
import type { Tag } from "@/lib/types";

interface MultiSelectProps {
  value: Tag[];
  onChange: (value: Tag[]) => void;
  placeholder?: string;
  options: Tag[];
  className?: string;
}

export function MultiSelect({
  value,
  onChange,
  placeholder = "Select skills...",
  options,
  className,
}: MultiSelectProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const selected = value;
  const setSelected = onChange;

  const handleUnselect = React.useCallback(
    (tag: Tag) => {
      setSelected(selected.filter((s) => s.id !== tag.id));
    },
    [selected, setSelected]
  );

  const handleKeyDown = React.useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === "Delete" || e.key === "Backspace") {
          if (input.value === "" && selected.length > 0) {
            const lastSelected = selected[selected.length - 1];
            if (lastSelected) {
              handleUnselect(lastSelected);
            }
          }
        }
        if (e.key === "Escape") {
          input.blur();
        }
      }
    },
    [handleUnselect, selected]
  );

  const selectables = React.useMemo(() => {
    return options.filter(
      (option) => !selected.some((s) => s.id === option.id)
    );
  }, [options, selected]);

  // Custom filtering logic for suggestions
  // Initialize with the first 5 selectables or all if less than 5.
  const [filteredOptions, setFilteredOptions] = React.useState<Tag[]>(() => selectables.slice(0, 5));


  React.useEffect(() => {
    if (inputValue === "") {
      setFilteredOptions(selectables.slice(0, 5)); // Show top 5 or all if less
      return;
    }
    const lowercasedInput = inputValue.toLowerCase();
    setFilteredOptions(
      selectables.filter(option =>
        option.text.toLowerCase().includes(lowercasedInput)
      ).slice(0, 5) // Limit suggestions
    );
  }, [inputValue, selectables]);


  return (
    <Command
      onKeyDown={handleKeyDown}
      className={cn("overflow-visible bg-transparent", className)}
      shouldFilter={false} // We handle filtering manually
    >
      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
        <div className="flex flex-wrap gap-1">
          {selected.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
              {tag.text}
              <button
                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleUnselect(tag);
                  }
                }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                }}
                onClick={() => handleUnselect(tag)}
              >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
              </button>
            </Badge>
          ))}
          <CommandPrimitive.Input
            ref={inputRef}
            value={inputValue}
            onValueChange={setInputValue}
            onBlur={() => setOpen(false)}
            onFocus={() => setOpen(true)}
            placeholder={placeholder}
            className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <div className="relative mt-2">
        {open && filteredOptions.length > 0 ? (
          <div className="absolute top-0 z-10 w-full rounded-md border bg-popover text-popover-foreground shadow-md outline-none animate-in">
            <CommandList>
              <CommandGroup className="h-full overflow-auto">
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onSelect={() => {
                      setInputValue("");
                      setSelected([...selected, option]);
                    }}
                    className="cursor-pointer"
                  >
                    {option.text}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </div>
        ) : null}
      </div>
    </Command>
  );
}
