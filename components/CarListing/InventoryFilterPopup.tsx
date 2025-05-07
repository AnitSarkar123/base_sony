"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { useAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useFilter } from "@/hooks/useFilter";
import { useCars } from "@/hooks/useCars";
import { delay } from "@/lib/utils";
import Loader from "@/components/Loader";

interface InventoryFilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilter: string | null;
  onApply?: (values: string[]) => void;
}

export const InventoryFilterPopup = ({
  open,
  onOpenChange,
  activeFilter,
  onApply
}: InventoryFilterPopupProps) => {
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const { filters, refetch: refetchFilters } = useFilter();
  const { refetch } = useCars();

  const handleFilterChange = async (name: string, values: string[]) => {
    setPagination(prev => ({
      ...prev,
      details: (prev?.details || [])
        .filter(d => d?.name !== name)
        .concat(values.length ? [{ name, values }] : [])
    }));
    await delay(300);
    await Promise.all([refetch(), refetchFilters()]);
  };

  const filter = filters?.find(f => f.name === activeFilter);
  const selectedValues = pagination.details?.find(d => d?.name === activeFilter)?.values || [];
  const hasSelected = selectedValues.length > 0;

  if (!filter) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] overflow-y-auto w-[90vw] max-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-lg">
            {activeFilter}
            <button onClick={() => onOpenChange(false)} className="rounded-full p-1 hover:bg-gray-100">
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {filter.values.map((option) => (
              <button
                key={option.name}
                onClick={async () => {
                  const newValues = selectedValues.includes(option.name)
                    ? selectedValues.filter(v => v !== option.name)
                    : [...selectedValues, option.name];
                  await handleFilterChange(filter.name, newValues);
                }}
                className={`group relative flex flex-col items-center rounded-lg border-2 p-3 transition-all ${
                  selectedValues.includes(option.name)
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div className="flex w-full items-center justify-center gap-2">
                  {selectedValues.includes(option.name) ? (
                    <Check className="h-4 w-4 text-blue-600" />
                  ) : (
                    <div className="h-4 w-4 rounded border border-gray-300" />
                  )}
                  <span className="text-sm font-medium">{option.name}</span>
                </div>
                <span className="mt-1 text-xs text-gray-500">
                  {option.count} available
                </span>
              </button>
            ))}
          </div>
          
          {hasSelected && (
            <div className="mt-4 flex justify-end">
              <Button 
                onClick={() => {
                  if (onApply) {
                    onApply(selectedValues);
                  } else {
                    handleFilterChange(activeFilter!, selectedValues);
                    onOpenChange(false);
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Continue
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};