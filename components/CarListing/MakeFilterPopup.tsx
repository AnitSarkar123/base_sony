"use client";

import { X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useFilter } from "@/hooks/useFilter";
import { useCars } from "@/hooks/useCars";
import { delay } from "@/lib/utils";
import Loader from "@/components/Loader";
import { Button } from "@/components/ui/button";

interface MakeFilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MakeFilterPopup = ({ open, onOpenChange }: MakeFilterPopupProps) => {
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const {
    makes,
    refetchTypes,
    refetch: refetchFilters,
    refetchModels,
    refetchFeatures,
    isLoadingMakes,
    isRefetchingMakes,
  } = useFilter();
  const { refetch } = useCars();

  const handleFilterChange = async (name: string, values: string[]) => {
    setPagination(prev => {
      const updatedDetails = prev.details.map(detail =>
        detail.name === name ? { ...detail, values } : detail
      );

      if (!updatedDetails.some(detail => detail.name === name)) {
        updatedDetails.push({ name, values });
      }

      return { ...prev, details: updatedDetails };
    });
  };

  const toggleMakeFilter = async (make: string) => {
    const currentValues = 
      pagination.details.find(d => d.name === "make")?.values || [];
    const newValues = currentValues.includes(make)
      ? currentValues.filter(v => v !== make)
      : [...currentValues, make];

    await handleFilterChange("make", newValues);
    await handleFilterChange("type", []);
    await handleFilterChange("model", []);
    await delay(10);
    await Promise.all([
      refetchModels(),
      refetchTypes(),
      refetchFilters(),
      refetchFeatures(),
      refetch()
    ]);
  };

  const isMakeSelected = (makeName: string) => {
    return !!pagination.details
      ?.find(detail => detail.name === "make")
      ?.values.includes(makeName);
  };

  const hasSelectedMakes = () => {
    const makeFilters = pagination.details.find(d => d.name === "make");
    return makeFilters && makeFilters.values.length > 0;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[80vh] overflow-y-auto w-[90vw] max-w-[1200px]"
        style={{
          width: 'clamp(300px, 90vw, 1200px)'
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg">
            Make
            <button 
              onClick={() => onOpenChange(false)}
              className="rounded-full p-1 hover:bg-gray-100"
            >
              <X className="h-[1.2em] w-[1.2em]" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <div className="py-4">
          {(isRefetchingMakes || isLoadingMakes) ? (
            <Loader style={{}} className="h-40" />
          ) : (
            <>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
                {makes?.map((make) => (
                  <button
                    key={make.name}
                    onClick={() => toggleMakeFilter(make.name)}
                    className={`group relative flex flex-col items-center rounded-lg border-2 p-2 sm:p-3 transition-all ${
                      isMakeSelected(make.name)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                    style={{
                      minHeight: '120px'
                    }}
                  >
                    {make.icon && (
                      <div className="mb-1 sm:mb-2 h-12 sm:h-16 w-full">
                        <img
                          src={`/${make.icon}`}
                          alt={make.name}
                          className="h-full w-full object-contain object-center"
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%'
                          }}
                        />
                      </div>
                    )}

                    <div className="flex w-full items-center justify-center gap-1 sm:gap-2">
                      {isMakeSelected(make.name) ? (
                        <Check className="h-[1em] w-[1em] text-blue-600" />
                      ) : (
                        <div className="h-[1em] w-[1em] rounded border border-gray-300" />
                      )}
                      <span className="text-xs sm:text-sm font-medium">{make.name}</span>
                    </div>

                    <span className="mt-1 text-xs text-gray-500">
                      {make.count} available
                    </span>
                  </button>
                ))}
              </div>
              {hasSelectedMakes() && (
                <div className="mt-4 flex justify-end">
                  <Button 
                    onClick={() => onOpenChange(false)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm sm:text-base"
                    style={{
                      padding: '0.5em 1em',
                      minHeight: '2.5em'
                    }}
                  >
                    Continue
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};