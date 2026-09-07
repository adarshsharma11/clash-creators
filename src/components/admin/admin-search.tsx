"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSearchProps {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  className?: string;
}

export function AdminSearch({
  id,
  label,
  value,
  placeholder,
  onChange,
  className,
}: AdminSearchProps) {
  return (
    <div className={cn("relative min-w-0 flex-1", className)}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        id={id}
        type="search"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-lg border border-border/50 bg-card/40 pl-9 pr-3 text-sm outline-none placeholder:text-muted-foreground/60 focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-ring"
      />
    </div>
  );
}
