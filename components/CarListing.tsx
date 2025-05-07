"use client";

/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect } from "react";
import InventoryCard from "@/components/InventoryCard";
import { Car, Save, SlidersHorizontal } from "lucide-react";
import { RotateCcw } from "lucide-react";
import { MakeFilterPopup } from "@/components/CarListing/MakeFilterPopup";
import { ModelFilterPopup } from "@/components/CarListing/ModelFilterPopup";
import { TypeFilterPopup } from "@/components/CarListing/TypeFilterPopup";
import { InventoryFilterPopup } from "@/components/CarListing/InventoryFilterPopup";
import { MasterSortPopup } from "@/components/CarListing/MasterSortPopup";
import { FeaturesFilterPopup } from "@/components/CarListing/FeaturesFilterPopup";
// import { ResetFiltersPopup } from "@/components/CarListing/ResetFiltersPopup";
import { useCars } from "@/hooks/useCars";
import CarPagination from "@/components/CarPagination";
import { delay, getPageTitle } from "@/lib/utils";
import { useAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import Loader from "@/components/Loader";
import ResultFilter from "@/components/CarListing/ResultFilter";
import { ListFilter, ListChecks } from "lucide-react";
import { useFilter } from "@/hooks/useFilter";
import {
  closestCenter,
  defaultDropAnimationSideEffects,
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import { rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { Droplet, Fuel, Calendar, Armchair, BadgeCheck } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { Button } from "./ui/button";

const CarListing = () => {
  const {
    cars,
    setCars,
    isLoading,
    isError,
    isRefetching,
    saveOrder: { mutate: saveOrder, isLoading: isPatching },
    refetch: refetchCars,
  } = useCars();
  const {
    isLoading: isFilterLoading,
    isRefetchingFeatures,
    isRefetchingMakes,
    isRefetchingModels,
    isRefetchingTypes,
    isRefetchingFilters,
    refetch: refetchFilter,
    refetchMakes,
    refetchTypes,
  } = useFilter();
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const { isAuthenticated } = useAuth();
  const [pageTitle, setPageTitle] = useState("");

  const { filters } = useFilter();
  const targetFilters = filters
    ?.filter(filter => filter?.name && ['condition', 'year', 'fuel', 'seats', 'color']
      .includes(filter.name.toLowerCase()))
    .filter(Boolean) || [];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [makeFilterOpen, setMakeFilterOpen] = useState(false);
  const [modelFilterOpen, setModelFilterOpen] = useState(false);
  const [typeFilterOpen, setTypeFilterOpen] = useState(false);
  const [activeInventoryFilter, setActiveInventoryFilter] = useState<string | null>(null);
  const [masterSortOpen, setMasterSortOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);
  const [featuresFilterOpen, setFeaturesFilterOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    const title = getPageTitle(window.location.pathname);
    setPageTitle(title);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
    return () => {
      if (typeof window !== 'undefined' && 'scrollRestoration' in window.history) {
        window.history.scrollRestoration = 'auto';
      }
    };
  }, []);
  
  useEffect(() => {
    if (resetKey > 0) {
      refetchCars();
      refetchFilter();
    }
  }, [resetKey, refetchCars, refetchFilter]);

  const isFilterActive = pagination.details.some(
    (detail) => detail.values.length > 0,
  );

  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: "0.5",
        },
      },
    }),
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (!active) return;
    const id = String(active.id);
    setActiveId(id);
    if (!selectedIds.includes(id)) {
      setSelectedIds([id]);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setCars((prevCars) => {
        const overIndex = prevCars.findIndex((car) => car._id === over.id);
        const newCars = prevCars.filter((car) => !selectedIds.includes(car._id));
        const selectedCars = prevCars.filter((car) => selectedIds.includes(car._id));
        newCars.splice(overIndex, 0, ...selectedCars);
        return newCars;
      });
    }
    setActiveId(null);
  };

  const toggleSelection = (id: string) => {
    setSelectedIds((prev) => {
      return prev.includes(id)
        ? prev.filter((itemId) => itemId !== id)
        : [...prev, id];
    });
  };

  const handleSortChange = async (value: string) => {
    const [name, order] = value.split("-");
    setPagination((prev) => ({
      ...prev,
      sortBy: { name, order },
    }));
    await delay(500);
    await refetchCars();
  };

  const handleFilterFeatureChange = async (names: string[]) => {
    setPagination((prev) => ({
      ...prev,
      selectedFeatures: names.map((name) => ({ name })),
    }));
    await delay(500);
    await Promise.all([
      refetchCars(),
      refetchFilter(),
      refetchMakes(),
      refetchTypes(),
    ]);
  };

  return (
    <div className="container-md-mx flex-1">
      {/* Only show title if pageTitle exists */}
      {pageTitle && (
        <h2 className="mx-auto my-4 text-center text-2xl font-bold">
          {pageTitle}
        </h2>
      )}

      {/* Main content with integrated sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] lg:min-h-[700px]">
        {/* Car listing area - scrollable without visible scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Header section */}
          <div className="flex flex-col mb-4 sticky top-0 bg-white z-10 pt-2 pb-4">
            <div className="relative flex flex-1 flex-col items-center justify-center gap-4 md:flex-row md:items-center">
              {!isLoading && !isRefetching && (
                <>
                  <h3 className="text-lg font-semibold">
                    {pagination.totalItems || cars.length || 0}
                    {isFilterActive && " Matching"} Cars Found
                  </h3>
                  {isAuthenticated && cars && cars.length > 0 && (
                    <Button
                      title="Save Order"
                      variant="ghost"
                      disabled={isPatching}
                      className="flex items-center gap-2 bg-gray-50 text-gray-600 shadow hover:bg-gray-200 hover:text-gray-800"
                      onClick={saveOrder}
                    >
                      {isPatching ? (
                        <Loader className="h-auto animate-spin text-gray-500" size="1.25em" />
                      ) : (
                        <Save size="1.25em" className="cursor-pointer" />
                      )}
                      <span className="text-sm font-medium">Save Order</span>
                    </Button>
                  )}
                </>
              )}
            </div>
            <ResultFilter />
          </div>

          {/* Car cards grid - 4 columns */}
          {(!cars.length && isLoading) ||
          isRefetching ||
          isFilterLoading ||
          isRefetchingFeatures ||
          isRefetchingMakes ||
          isRefetchingModels ||
          isRefetchingTypes ||
          isRefetchingFilters ? (
            <div className="flex h-96 items-center justify-center" style={{ minHeight: "calc(40vh)" }}>
              <Loader />
            </div>
          ) : isError ? (
            <div className="flex h-96 items-center justify-center" style={{ minHeight: "calc(100vh - 4rem)" }}>
              Error fetching car data
            </div>
          ) : cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-8">
              <DndContext
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={cars.map((field) => field._id)}
                  strategy={rectSortingStrategy}
                >
                  {cars.map((car) => (
                    <div key={car._id} className="inventory-card">
                      <InventoryCard
                        car={car}
                        onSelect={toggleSelection}
                        isDragging={activeId === car._id}
                        isSelected={selectedIds.includes(car._id)}
                      />
                    </div>
                  ))}
                </SortableContext>
                <DragOverlay dropAnimation={dropAnimation}>
                  {activeId && (
                    <div className="flex gap-2">
                      {selectedIds.map((id) => {
                        const car = cars.find((c) => c._id === id);
                        return car ? (
                          <div key={id} className="inventory-card relative w-48 opacity-80 shadow-lg">
                            <InventoryCard
                              car={car}
                              onSelect={() => {}}
                              isDragging={true}
                              isSelected={true}
                            />
                          </div>
                        ) : null;
                      })}
                    </div>
                  )}
                </DragOverlay>
              </DndContext>
            </div>
          ) : (
            <div className="col-span-1 flex h-96 items-center justify-center sm:col-span-2 lg:col-span-3 xl:col-span-4">
              No cars found
            </div>
          )}

          <div className="sticky bottom-0 bg-white pt-4 pb-6">
            <CarPagination />
          </div>
        </div>

        {/* Integrated Filter Sidebar - fixed height with modern scroll */}
        {cars && cars.length > 0 && (
          <div className="lg:w-[80px] flex-shrink-0 h-full">
            <div className="flex flex-row lg:flex-col gap-2 p-1 h-full overflow-y-auto modern-scrollbar bg-gray-50/50 rounded-md">
              {/* Total Cars */}
              <div className="flex-shrink-0 aspect-square">
                <Button 
                  variant="ghost" 
                  className="h-[60px] w-[60px] flex-col gap-0 p-1 bg-gray-100/70 rounded-sm border border-white/20"
                >
                  <span className="text-lg font-bold text-gray-800">
                    {pagination.totalItems || cars.length || 0}
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
                <MakeFilterPopup open={makeFilterOpen} onOpenChange={setMakeFilterOpen} />
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
                <ModelFilterPopup open={modelFilterOpen} onOpenChange={setModelFilterOpen} />
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
                <TypeFilterPopup open={typeFilterOpen} onOpenChange={setTypeFilterOpen} />
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
                <MasterSortPopup
                  open={masterSortOpen}
                  onOpenChange={setMasterSortOpen}
                  selectedSort={selectedSort}
                  onSortChange={setSelectedSort}
                  onApply={() => {
                    if (selectedSort) {
                      handleSortChange(selectedSort);
                    }
                    setMasterSortOpen(false);
                  }}
                />
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
                <FeaturesFilterPopup
                  open={featuresFilterOpen}
                  onOpenChange={setFeaturesFilterOpen}
                  features={pagination.features || []}
                  selectedFeatures={pagination.selectedFeatures?.map(f => f.name) || []}
                  onValueChange={handleFilterFeatureChange}
                />
              </div>

              {/* Reset Filters */}
              <div className="flex-shrink-0 aspect-square">
                <Button
                  variant="ghost"
                  className="h-[60px] w-[60px] flex-col gap-0 p-1 bg-gray-100/70 rounded-sm border border-white/20"
                  onClick={() => {
                    setResetKey(prev => prev + 1);
                    setPagination(prev => ({
                      ...prev,
                      details: [],
                      selectedFeatures: [],
                      sortBy: undefined,
                      minPrice: undefined,
                      maxPrice: undefined
                    }));
                  }}
                  disabled={isLoading}
                >
                  <RotateCcw className="h-5 w-5 text-gray-700 mt-0.5" />
                  <span className="text-[9px] font-medium text-gray-600">Reset</span>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Popup components */}
      <InventoryFilterPopup 
        open={!!activeInventoryFilter}
        onOpenChange={(open) => setActiveInventoryFilter(open ? activeInventoryFilter : null)}
        activeFilter={activeInventoryFilter}
      />
    </div>
  );
};

export default CarListing;