"use client";
import React, {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = {
  label: string;
  value: string;
};

interface MultiSelectProps {
  options: Option[];
  selected: string[];
  onChange: (selected: string[]) => void;
  placeholder?: string;
  className?: string;
}

// 👇 Define the type of what the ref will expose
export type MultiSelectRef = {
  focus: () => void;
};

// ✅ Use forwardRef to allow ref to be passed in
export const MultiSelect = forwardRef<MultiSelectRef, MultiSelectProps>(
  (
    { options, selected, onChange, placeholder = "Select options", className },
    ref
  ) => {
    const [open, setOpen] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);

    // 👇 Expose focus() to parent via ref
    useImperativeHandle(ref, () => ({
      focus: () => {
        buttonRef.current?.focus();
      },
    }));

    const toggleOption = (value: string) => {
      if (selected.includes(value)) {
        onChange(selected.filter((v) => v !== value));
      } else {
        onChange([...selected, value]);
      }
    };

    const allSelected = selected.length === options.length;

    const toggleSelectAll = () => {
      if (allSelected) {
        onChange([]);
      } else {
        onChange(options.map((o) => o.value));
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={buttonRef}
            variant="outline"
            className={cn("w-[300px] justify-between", className)}>
            <span>
              {selected.length > 0
                ? `${selected.length} selected`
                : placeholder}
            </span>
            <ChevronDown
              className={cn(
                "h-4 w-4 transition-transform duration-200",
                open && "rotate-180"
              )}
            />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0">
          <Command>
            <CommandGroup heading="Actions">
              <CommandItem onSelect={toggleSelectAll}>
                <span>{allSelected ? "Deselect All" : "Select All"}</span>
              </CommandItem>
            </CommandGroup>
            <CommandGroup heading="Outlets">
              {options.map((opt) => (
                <CommandItem
                  key={opt.value}
                  onSelect={() => toggleOption(opt.value)}
                  className="flex items-center justify-between">
                  <span>{opt.label}</span>
                  {selected.includes(opt.value) && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

// ✅ Give the component a display name (good for debugging in dev tools)
MultiSelect.displayName = "MultiSelect";
