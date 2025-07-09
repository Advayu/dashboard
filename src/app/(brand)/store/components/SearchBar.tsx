// components/outlets/SearchBar.tsx
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="flex space-x-2 items-center relative w-full md:w-72">
      <Input
        type="text"
        placeholder="Search by outlet name"
        value={value}
        onChange={onChange}
        className="pl-10 py-5 border-gray-400 w-full"
      />
      <Search
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
        width={16}
        height={16}
      />
      {/* <Filter width={16} height={16} /> */}
    </div>
  );
}
