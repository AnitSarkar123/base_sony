"use client";

import React from "react";
import { useAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useFilter } from "@/hooks/useFilter";
import { Button } from "@/components/ui/button";
import { 
  Car, 
  SlidersHorizontal, 
  ListFilter, 
  ListChecks, 
  RotateCcw,
  BadgeCheck,
  Calendar,
  Fuel,
  Armchair,
  Droplet
} from "lucide-react";
import { MakeFilterPopup } from "@/components/CarListing/MakeFilterPopup";
import { ModelFilterPopup } from "@/components/CarListing/ModelFilterPopup";
import { TypeFilterPopup } from "@/components/CarListing/TypeFilterPopup";
import { InventoryFilterPopup } from "@/components/CarListing/InventoryFilterPopup";
import { MasterSortPopup } from "@/components/CarListing/MasterSortPopup";
import { FeaturesFilterPopup } from "@/components/CarListing/FeaturesFilterPopup";

interface HomeJapanFiltersProps {
  resetKey: number;
  onSortChange: (value: string) => void;
  onFilterFeatureChange: (names: string[]) => void;
  onInventoryFilterChange: (filterName: string, values: string[]) => void;
  totalCars: number;
}

const HomeJapanFilters: React.FC<HomeJapanFiltersProps> = ({
  resetKey,
  onSortChange,
  onFilterFeatureChange,
  onInventoryFilterChange,
  totalCars
}) => {
  const [pagination] = useAtom(carPaginationAtom);
  const { filters, makes, models, types } = useFilter();
  
  // Filter sidebar state
  const [makeFilterOpen, setMakeFilterOpen] = React.useState(false);
  const [modelFilterOpen, setModelFilterOpen] = React.useState(false);
  const [typeFilterOpen, setTypeFilterOpen] = React.useState(false);
  const [activeInventoryFilter, setActiveInventoryFilter] = React.useState<string | null>(null);
  const [masterSortOpen, setMasterSortOpen] = React.useState(false);
  const [selectedSort, setSelectedSort] = React.useState<string | null>(null);
  const [featuresFilterOpen, setFeaturesFilterOpen] = React.useState(false);
  
  // Filter the same way as in CarListing.tsx
  const targetFilters = filters
    ?.filter(filter => filter?.name && ['condition', 'year', 'fuel', 'seats', 'color']
      .includes(filter.name.toLowerCase()))
    .filter(Boolean) || [];

  return (
    <>
      {/* Integrated Filter Sidebar - fixed position with separate scroll */}
      <div className="lg:w-[80px] flex-shrink-0 lg:sticky lg:top-20 lg:self-start">
        <div className="flex flex-row lg:flex-col gap-2 p-1 max-h-[calc(100vh-200px)] overflow-y-auto modern-scrollbar bg-gray-50/50 rounded-md">
          {/* Total Cars */}
          <div className="flex-shrink-0 aspect-square">
            <Button 
              variant="ghost" 
              className="h-[60px] w-[60px] flex-col gap-0 p-1 bg-gray-100/70 rounded-sm border border-white/20"
            >
              <span className="text-lg font-bold text-gray-800">
                {totalCars}
              </span>
              <span className="text-[9px] font-medium text-gray-600">Total</span>
            </Button>
          </div>

          {/* Make Filter */}
          <div className="flex-shrink-0 aspect-square">
            <Button
              variant="ghost"
              className="h-[60px] w-[60px] flex-col gap-0 p-1 bg-gray-100/70 rounded-sm border border-white/20"
              onClick={() => setMakeFilterOpen(true)}
            >
              <SlidersHorizontal className="h-5 w-5 text-gray-700 mt-0.5" />
              <span className="text-[9px] font-medium text-gray-600">Make</span>
            </Button>
          </div>

          {/* Model Filter */}
          <div className="flex-shrink-0 aspect-square">
            <Button
              variant="ghost"
              className="h-[60px] w-[60px] flex-col gap-0 p-1 bg-gray-100/70 rounded-sm border border-white/20"
              onClick={() => setModelFilterOpen(true)}
            >
              <Car className="h-5 w-5 rotate-90 text-gray-700 mt-0.5" />
              <span className="text-[9px] font-medium text-gray-600">Model</span>
            </Button>
          </div>

          {/* Type Filter */}
          <div className="flex-shrink-0 aspect-square">
            <Button
              variant="ghost"
              className="h-[60px] w-[60px] flex-col gap-0 p-1 bg-gray-100/70 rounded-sm border border-white/20"
              onClick={() => setTypeFilterOpen(true)}
            >
              <Car className="h-5 w-5 rotate-90 text-gray-700 mt-0.5" />
              <span className="text-[9px] font-medium text-gray-600">Body</span>
            </Button>
          </div>

          {/* Dynamic Inventory Filters */}
          {targetFilters?.map((filter) => {
            const FILTER_ICONS = {
              condition: <BadgeCheck className="h-5 w-5 text-gray-700 mt-0.5" />,
              year: <Calendar className="h-5 w-5 text-gray-700 mt-0.5" />,
              fuel: <Fuel className="h-5 w-5 text-gray-700 mt-0.5" />,
              seats: <Armchair className="h-5 w-5 text-gray-700 mt-0.5" />,
              color: <Droplet className="h-5 w-5 text-gray-700 mt-0.5" />,
            };
            const FILTER_LABELS = {
              condition: "Cond.",
              year: "Year",
              fuel: "Fuel",
              seats: "Seats",
              color: "Color",
            };

            const filterKey = filter.name.toLowerCase() as keyof typeof FILTER_ICONS;

            return (
              <div key={`inventory-${filter.name}-${resetKey}`} className="flex-shrink-0 aspect-square">
                <Button
                  variant="ghost"
                  className="h-[60px] w-[60px] flex-col gap-0 p-1 bg-gray-100/70 rounded-sm border border-white/20"
                  onClick={() => setActiveInventoryFilter(filter.name)}
                >
                  {FILTER_ICONS[filterKey]}
                  <span className="text-[9px] font-medium text-gray-600">{FILTER_LABELS[filterKey]}</span>
                </Button>
              </div>
            );
          })}

          {/* Sort Filter */}
          <div className="flex-shrink-0 aspect-square">
            <Button
              variant="ghost"
              className="h-[60px] w-[60px] flex-col gap-0 p-1 bg-gray-100/70 rounded-sm border border-white/20"
              onClick={() => setMasterSortOpen(true)}
            >
              <ListFilter className="h-5 w-5 text-gray-700 mt-0.5" />
              <span className="text-[9px] font-medium text-gray-600">Sort</span>
            </Button>
          </div>

          {/* Features Filter */}
          <div className="flex-shrink-0 aspect-square">
            <Button
              variant="ghost"
              className="h-[60px] w-[60px] flex-col gap-0 p-1 bg-gray-100/70 rounded-sm border border-white/20"
              onClick={() => setFeaturesFilterOpen(true)}
            >
              <ListChecks className="h-5 w-5 text-gray-700 mt-0.5" />
              <span className="text-[9px] font-medium text-gray-600">Features</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Popup components */}
      <MakeFilterPopup 
        open={makeFilterOpen} 
        onOpenChange={setMakeFilterOpen} 
      />
      
      <ModelFilterPopup 
        open={modelFilterOpen} 
        onOpenChange={setModelFilterOpen} 
      />
      
      <TypeFilterPopup 
        open={typeFilterOpen} 
        onOpenChange={setTypeFilterOpen} 
      />
      
      <InventoryFilterPopup 
        open={!!activeInventoryFilter}
        onOpenChange={(open) => setActiveInventoryFilter(open ? activeInventoryFilter : null)}
        activeFilter={activeInventoryFilter}
        onApply={(values) => {
          if (activeInventoryFilter) {
            onInventoryFilterChange(activeInventoryFilter, values);
            setActiveInventoryFilter(null);
          }
        }}
      />
      
      <MasterSortPopup
        open={masterSortOpen}
        onOpenChange={setMasterSortOpen}
        selectedSort={selectedSort}
        onSortChange={setSelectedSort}
        onApply={() => {
          if (selectedSort) {
            onSortChange(selectedSort);
          }
          setMasterSortOpen(false);
        }}
      />
      
      <FeaturesFilterPopup
        open={featuresFilterOpen}
        onOpenChange={setFeaturesFilterOpen}
        features={pagination.features || []}
        selectedFeatures={pagination.selectedFeatures?.map(f => f.name) || []}
        onValueChange={onFilterFeatureChange}
      />
    </>
  );
};

export default HomeJapanFilters;