// components/form/multi-select.tsx

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
import { Check } from "lucide-react";
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

export function MultiSelect({
  options,
  selected,
  onChange,
  placeholder = "Select options",
  className,
}: MultiSelectProps) {
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
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("w-[300px] justify-start", className)}>
          {selected.length > 0 ? `${selected.length} selected` : placeholder}
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
