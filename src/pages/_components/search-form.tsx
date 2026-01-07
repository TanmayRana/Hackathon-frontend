import { Search } from "lucide-react";

import { Label } from "../../components/ui/label";
import { SidebarInput } from "../../components/ui/sidebar";

interface SearchFormProps extends Omit<React.ComponentProps<"form">, "onChange"> {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function SearchForm({ value, onChange, ...props }: SearchFormProps) {
  return (
    <form {...props} className="w-full">
      <div className="relative">
        <Label htmlFor="search" className="sr-only">
          Search
        </Label>
        <SidebarInput
          id="search"
          placeholder="Type to search..."
          className="h-8 pl-7 w-full"
          value={value}
          onChange={onChange}
        />
        <Search className="pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2 opacity-50 select-none" />
      </div>
    </form>
  );
}
