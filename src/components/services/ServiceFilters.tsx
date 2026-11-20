"use client";

import { MapPin, Search, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const CATEGORIES = [
  "Photography & Videography",
  "Wedding Venues",
  "Decoration & Florist",
  "Catering Services",
  "Makeup & Styling",
  "Wedding Fashion",
];

export type Filters = {
  search: string;
  category: string;
  location: string;
  sort: string;
  page: number;
};

export default function ServiceFilters({
  filters,
  searchText,
  onSearchChange,
  onCategoryChange,
  onLocationChange,
  onSortChange,
}: {
  filters: Filters;
  searchText: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onLocationChange: (value: string) => void;
  onSortChange: (value: string) => void;
}) {
  return (
    <div className="mb-8 rounded-2xl border border-rose-100 bg-white p-4 shadow-sm dark:border-rose-900/40 dark:bg-card sm:p-5">
      <div className="mb-4 flex items-center gap-2 text-sm font-medium text-rose-800 dark:text-rose-200">
        <SlidersHorizontal className="size-4" />
        Filter services
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="search"
              className="h-10 pl-9"
              placeholder="Service name..."
              value={searchText}
              onChange={(event) => onSearchChange(event.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category || "all"}
            onValueChange={(value) =>
              onCategoryChange(value === "all" || value === null ? "" : value)
            }
          >
            <SelectTrigger id="category" className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {CATEGORIES.map((name) => (
                <SelectItem key={name} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="location">Location</Label>
          <div className="relative">
            <MapPin className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="location"
              className="h-10 pl-9"
              placeholder="City or area..."
              value={filters.location}
              onChange={(event) => onLocationChange(event.target.value)}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="sort">Price sort</Label>
          <Select
            value={filters.sort || "default"}
            onValueChange={(value) =>
              onSortChange(value === "default" || value === null ? "" : value)
            }
          >
            <SelectTrigger id="sort" className="h-10 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">Default</SelectItem>
              <SelectItem value="price_asc">Price: Low to High</SelectItem>
              <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
