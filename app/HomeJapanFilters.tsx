"use client";

import React, { useState } from "react";
import { useAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useFilter } from "@/hooks/useFilter";
import { Button } from "@/components/ui/button";
import {
  Car,
  SlidersHorizontal,
  ListFilter,
  ListChecks,
  // RotateCcw is imported but not used - keeping for future use
  //RotateCcw,
  BadgeCheck,
  Calendar,
  Fuel,
  Armchair,
  Droplet,
} from "lucide-react";

// Import filter popup components
import { MakeFilterPopup } from "@/components/CarListing/MakeFilterPopup";
import { ModelFilterPopup } from "@/components/CarListing/ModelFilterPopup";
import { TypeFilterPopup } from "@/components/CarListing/TypeFilterPopup";
import { InventoryFilterPopup } from "@/components/CarListing/InventoryFilterPopup";
import { MasterSortPopup } from "@/components/CarListing/MasterSortPopup";
import { FeaturesFilterPopup } from "@/components/CarListing/FeaturesFilterPopup";

// Mapping of filter names to icons and display labels
const FILTER_ICONS = {
  condition: <BadgeCheck className="mt-0.5 h-5 w-5 text-gray-700" />,
  year: <Calendar className="mt-0.5 h-5 w-5 text-gray-700" />,
  fuel: <Fuel className="mt-0.5 h-5 w-5 text-gray-700" />,
  seats: <Armchair className="mt-0.5 h-5 w-5 text-gray-700" />,
  color: <Droplet className="mt-0.5 h-5 w-5 text-gray-700" />,
};

const FILTER_LABELS = {
  condition: "Cond.",
  year: "Year",
  fuel: "Fuel",
  seats: "Seats",
  color: "Color",
};

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
  totalCars,
}) => {
  // Global state
  const [pagination] = useAtom(carPaginationAtom);
  const { filters /* makes, models, types are kept for future use */ } =
    useFilter();

  // Filter popup state management
  const [makeFilterOpen, setMakeFilterOpen] = useState(false);
  const [modelFilterOpen, setModelFilterOpen] = useState(false);
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [activeInventoryFilter, setActiveInventoryFilter] = useState<
    string | null
  >(null);
  const [masterSortOpen, setMasterSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [featuresFilterOpen, setFeaturesFilterOpen] = useState(false);

  // Filter data processing
  const targetFilters =
    filters
      ?.filter(
        (filter) =>
          filter?.name &&
          ["condition", "year", "fuel", "seats", "color"].includes(
            filter.name.toLowerCase(),
          ),
      )
      .filter(Boolean) || [];

  // Filter button component (to reduce repetition)
  const FilterButton = ({
    icon,
    label,
    onClick,
  }: {
    icon: React.ReactNode;
    label: string;
    onClick: () => void;
  }) => (
    <div className="aspect-square flex-shrink-0">
      <Button
        variant="ghost"
        className="h-[60px] w-[60px] flex-col gap-0 rounded-sm border border-white/20 bg-gray-100/70 p-1"
        onClick={onClick}
      >
        {icon}
        <span className="text-[9px] font-medium text-gray-600">{label}</span>
      </Button>
    </div>
  );

  return (
    <>
      {/* Sidebar Container */}
      <div className="flex-shrink-0 lg:sticky lg:top-20 lg:w-[80px] lg:self-start">
        <div className="modern-scrollbar flex max-h-[calc(100vh-200px)] flex-row gap-2 overflow-y-auto rounded-md bg-gray-50/50 p-1 lg:flex-col">
          {/* Total Cars Display */}
          <div className="aspect-square flex-shrink-0">
            <Button
              variant="ghost"
              className="h-[60px] w-[60px] flex-col gap-0 rounded-sm border border-white/20 bg-gray-100/70 p-1"
            >
              <span className="text-lg font-bold text-gray-800">
                {totalCars}
              </span>
              <span className="text-[9px] font-medium text-gray-600">
                Total
              </span>
            </Button>
          </div>

          {/* Fixed Filter Buttons */}
          <FilterButton
            icon={
              <SlidersHorizontal className="mt-0.5 h-5 w-5 text-gray-700" />
            }
            label="Make"
            onClick={() => setMakeFilterOpen(true)}
          />

          <FilterButton
            icon={<Car className="mt-0.5 h-5 w-5 rotate-90 text-gray-700" />}
            label="Model"
            onClick={() => setModelFilterOpen(true)}
          />

          <FilterButton
            icon={<Car className="mt-0.5 h-5 w-5 rotate-90 text-gray-700" />}
            label="Body"
            onClick={() => setTypeFilterOpen(true)}
          />

          {/* Dynamic Filter Buttons */}
          {targetFilters?.map((filter) => {
            const filterKey =
              filter.name.toLowerCase() as keyof typeof FILTER_ICONS;

            return (
              <FilterButton
                key={`inventory-${filter.name}-${resetKey}`}
                icon={FILTER_ICONS[filterKey]}
                label={FILTER_LABELS[filterKey]}
                onClick={() => setActiveInventoryFilter(filter.name)}
              />
            );
          })}

          {/* Sort and Features Buttons */}
          <FilterButton
            icon={<ListFilter className="mt-0.5 h-5 w-5 text-gray-700" />}
            label="Sort"
            onClick={() => setMasterSortOpen(true)}
          />

          <FilterButton
            icon={<ListChecks className="mt-0.5 h-5 w-5 text-gray-700" />}
            label="Features"
            onClick={() => setFeaturesFilterOpen(true)}
          />
        </div>
      </div>

      {/* Filter Popups */}
      <MakeFilterPopup open={makeFilterOpen} onOpenChange={setMakeFilterOpen} />

      <ModelFilterPopup
        open={modelFilterOpen}
        onOpenChange={setModelFilterOpen}
      />

      <TypeFilterPopup open={typeFilterOpen} onOpenChange={setTypeFilterOpen} />

      <InventoryFilterPopup
        open={!!activeInventoryFilter}
        onOpenChange={(open) =>
          setActiveInventoryFilter(open ? activeInventoryFilter : null)
        }
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
        selectedFeatures={pagination.selectedFeatures?.map((f) => f.name) || []}
        onValueChange={onFilterFeatureChange}
      />
    </>
  );
};

export default HomeJapanFilters;