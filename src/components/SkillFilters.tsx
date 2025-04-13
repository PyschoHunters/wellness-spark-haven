
import React, { useState } from "react";
import { Check, ChevronsUpDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { SkillCategory, SkillLevel } from "./SkillProfile";

interface SkillFiltersProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  searchTerm: string;
  categories: SkillCategory[];
  levels: SkillLevel[];
  mentorOnly: boolean;
  inPersonOnly: boolean;
  distanceRadius: number;
}

const initialFilterState: FilterState = {
  searchTerm: "",
  categories: [],
  levels: [],
  mentorOnly: false,
  inPersonOnly: false,
  distanceRadius: 50,
};

const categories: SkillCategory[] = [
  "Strength Training", 
  "Cardio", 
  "Flexibility", 
  "Nutrition", 
  "Yoga", 
  "Running", 
  "Cycling", 
  "Swimming", 
  "Hiking", 
  "Martial Arts", 
  "Dance", 
  "Other"
];

const levels: SkillLevel[] = ["Beginner", "Intermediate", "Advanced"];

const SkillFilters: React.FC<SkillFiltersProps> = ({ onFilterChange }) => {
  const [filters, setFilters] = useState<FilterState>(initialFilterState);
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [levelOpen, setLevelOpen] = useState(false);

  const updateFilters = (newFilters: Partial<FilterState>) => {
    const updated = { ...filters, ...newFilters };
    setFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, skill, or location..."
            className="pl-8"
            value={filters.searchTerm}
            onChange={(e) => updateFilters({ searchTerm: e.target.value })}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={categoryOpen}
                className="justify-between"
              >
                {filters.categories.length > 0 
                  ? `${filters.categories.length} Categories Selected` 
                  : "Select Categories"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search categories..." />
                <CommandEmpty>No category found.</CommandEmpty>
                <CommandGroup className="max-h-[300px] overflow-auto">
                  {categories.map((category) => (
                    <CommandItem
                      key={category}
                      value={category}
                      onSelect={() => {
                        const newCategories = filters.categories.includes(category)
                          ? filters.categories.filter(c => c !== category)
                          : [...filters.categories, category];
                        updateFilters({ categories: newCategories });
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.categories.includes(category) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {category}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Popover open={levelOpen} onOpenChange={setLevelOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={levelOpen}
                className="justify-between"
              >
                {filters.levels.length > 0 
                  ? `${filters.levels.length} Levels Selected` 
                  : "Select Levels"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandGroup>
                  {levels.map((level) => (
                    <CommandItem
                      key={level}
                      value={level}
                      onSelect={() => {
                        const newLevels = filters.levels.includes(level)
                          ? filters.levels.filter(l => l !== level)
                          : [...filters.levels, level];
                        updateFilters({ levels: newLevels });
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.levels.includes(level) ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {level}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>

          <Button
            variant={filters.mentorOnly ? "default" : "outline"}
            onClick={() => updateFilters({ mentorOnly: !filters.mentorOnly })}
            className="gap-1"
          >
            {filters.mentorOnly && <Check className="h-4 w-4" />}
            Mentors Only
          </Button>

          <Button
            variant={filters.inPersonOnly ? "default" : "outline"}
            onClick={() => updateFilters({ inPersonOnly: !filters.inPersonOnly })}
            className="gap-1"
          >
            {filters.inPersonOnly && <Check className="h-4 w-4" />}
            In-Person Only
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">Distance: {filters.distanceRadius} km</span>
            <span className="text-sm text-muted-foreground">
              {filters.distanceRadius === 0 ? "Any" : `${filters.distanceRadius} km`}
            </span>
          </div>
          <Slider
            value={[filters.distanceRadius]}
            min={0}
            max={100}
            step={5}
            onValueChange={(value) => updateFilters({ distanceRadius: value[0] })}
          />
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setFilters(initialFilterState);
              onFilterChange(initialFilterState);
            }}
          >
            Reset Filters
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SkillFilters;
