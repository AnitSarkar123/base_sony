"use client";

import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useSetAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useFilter } from "@/hooks/useFilter";
import { useCars } from "@/hooks/useCars";
import { delay } from "@/lib/utils";
import { useCallback, useState } from "react";

export const ResetFilters = ({ disabled }: { disabled?: boolean }) => {
  const setPagination = useSetAtom(carPaginationAtom);
  const { refetch: refetchFilter, refetchMakes, refetchModels, refetchTypes } = useFilter();
  const { refetch: refetchCars } = useCars();
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = useCallback(async () => {
    setIsResetting(true);
    try {
      setPagination(prev => ({
        ...prev,
        details: [{ name: "make", values: [] }],
        selectedFeatures: [],
        sortBy: undefined,
        minPrice: undefined,
        maxPrice: undefined
      }));

      await delay(300);
      
      await Promise.allSettled([
        refetchCars(),
        refetchFilter(),
        refetchMakes(),
        refetchModels(),
        refetchTypes()
      ]);

      console.log("All filters reset successfully");
    } catch (error) {
      console.error("Error during reset:", error);
    } finally {
      setIsResetting(false);
    }
  }, [setPagination, refetchCars, refetchFilter, refetchMakes, refetchModels, refetchTypes]);

  return (
    <div className="relative group h-12">
      <Button
        variant="ghost"
        size="icon"
        className="h-12 w-12 text-white hover:bg-gray-700/50 hover:text-white rounded-none absolute right-0"
        onClick={handleReset}
        disabled={disabled || isResetting}
        title="Reset all filters"
      >
        {isResetting ? (
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <RotateCcw className="h-6 w-6" />
        )}
      </Button>
      {/* Sliding label with bold white text */}
      <div className="absolute right-12 top-0 h-full overflow-hidden">
        <div className="h-full flex items-center bg-gray-700/50 px-4 whitespace-nowrap transform transition-all duration-300 ease-out translate-x-full group-hover:translate-x-0">
          <span className="text-sm font-bold text-white">Reset All</span>
        </div>
      </div>
    </div>
  );
};