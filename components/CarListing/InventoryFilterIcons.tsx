"use client";

import { Button } from "@/components/ui/button";
import { useFilter } from "@/hooks/useFilter";
import { useCars } from "@/hooks/useCars";
import { useAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { delay } from "@/lib/utils";
import { useState } from "react";
import {
  Droplet,
  Fuel,
  Calendar,
  Armchair,
  BadgeCheck
} from "lucide-react";
import { InventoryFilterPopup } from "./InventoryFilterPopup";
// import { filter } from "lucide-react";

const FILTER_ICONS = {
  condition: <BadgeCheck className="h-5 w-5" />,
  year: <Calendar className="h-5 w-5" />,
  fuel: <Fuel className="h-5 w-5" />,
  seats: <Armchair className="h-5 w-5" />,
  color: <Droplet className="h-5 w-5" />,
};

const FILTER_LABELS = {
  condition: "Condition",
  year: "Year",
  fuel: "Fuel",
  seats: "Seats",
  color: "Color",
};

export const InventoryFilterIcons = () => {
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const { filters, refetch: refetchFilters } = useFilter();
  const { refetch } = useCars();
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  if (!pagination || !filters) return null;

  const targetFilters = filters
    .filter(filter => filter?.name && ['condition', 'year', 'fuel', 'seats', 'color']
      .includes(filter.name.toLowerCase()))
    .filter(Boolean);

  const handleFilterChange = async (name: string, values: string[]) => {
    if (!pagination) return;
    
    setPagination(prev => ({
      ...prev,
      details: (prev?.details || [])
        .filter(d => d?.name !== name)
        .concat(values.length ? [{ name, values }] : [])
    }));
    
    await delay(300);
    await Promise.all([refetch(), refetchFilters()]);
  };

  const getSelectedValues = (filterName: string) => {
    return pagination.details?.find(d => d?.name === filterName)?.values || [];
  };

  if (targetFilters.length === 0) return null;

  return (
    <>
      {targetFilters.map((filter) => {
        if (!filter?.name || !filter.values) return null;
        
        const selectedValues = getSelectedValues(filter.name);
        const hasSelected = selectedValues.length > 0;
        const filterKey = filter.name.toLowerCase() as keyof typeof FILTER_ICONS;

        return (
          <div key={filter.name} className="relative group h-12">
            <Button
              variant="ghost"
              size="icon"
              className={`h-12 w-12 text-white hover:bg-gray-700/50 hover:text-white rounded-none absolute right-0 ${
                hasSelected ? 'bg-blue-600/80' : ''
              }`}
              onClick={() => setActiveFilter(filter.name)}
              title={FILTER_LABELS[filterKey]}
            >
              {FILTER_ICONS[filterKey]}
            </Button>
            
            <div className="absolute right-12 top-0 h-full overflow-hidden">
              <div className="h-full flex items-center bg-gray-700/50 px-4 whitespace-nowrap transform transition-all duration-300 ease-out translate-x-full group-hover:translate-x-0">
                <span className="text-sm font-bold text-white">
                  {FILTER_LABELS[filterKey]}
                </span>
              </div>
            </div>

            <InventoryFilterPopup
              open={activeFilter === filter.name}
              onOpenChange={(open) => setActiveFilter(open ? filter.name : null)}
               filter={filter}
               selectedValues={selectedValues}
               onFilterChange={handleFilterChange}
               label={FILTER_LABELS[filterKey]}
            />
          </div>
        );
      })}
    </>
  );
};