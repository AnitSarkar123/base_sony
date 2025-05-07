"use client";

import { Button } from "@/components/ui/button";
import {
  DollarSign,
  Calendar,
  Weight,
  Gauge,
  Expand,
  ArrowUp,
  ArrowDown,
  X,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MasterSortPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedSort: string | null;
  onSortChange: (value: string) => void;
  onApply: () => void;
}

export const MasterSortPopup = ({
  open,
  onOpenChange,
  selectedSort,
  onSortChange,
  onApply,
}: MasterSortPopupProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            Sort Options
            <button onClick={() => onOpenChange(false)}>
              <X className="h-5 w-5" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {/* Price Sort */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center">
              <DollarSign className="h-4 w-4 mr-2" />
              Price
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedSort === "price-asc" ? "default" : "outline"}
                className="w-full"
                onClick={() => onSortChange("price-asc")}
              >
                <ArrowDown className="mr-2 h-4 w-4" />
                Low to High
              </Button>
              <Button
                variant={selectedSort === "price-desc" ? "default" : "outline"}
                className="w-full"
                onClick={() => onSortChange("price-desc")}
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                High to Low
              </Button>
            </div>
          </div>

          {/* Year Sort */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Year
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedSort === "year-asc" ? "default" : "outline"}
                className="w-full"
                onClick={() => onSortChange("year-asc")}
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Oldest
              </Button>
              <Button
                variant={selectedSort === "year-desc" ? "default" : "outline"}
                className="w-full"
                onClick={() => onSortChange("year-desc")}
              >
                <ArrowDown className="mr-2 h-4 w-4" />
                Newest
              </Button>
            </div>
          </div>

          {/* Weight Sort */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center">
              <Weight className="h-4 w-4 mr-2" />
              Weight
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedSort === "weight-asc" ? "default" : "outline"}
                className="w-full"
                onClick={() => onSortChange("weight-asc")}
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Light to Heavy
              </Button>
              <Button
                variant={selectedSort === "weight-desc" ? "default" : "outline"}
                className="w-full"
                onClick={() => onSortChange("weight-desc")}
              >
                <ArrowDown className="mr-2 h-4 w-4" />
                Heavy to Light
              </Button>
            </div>
          </div>

          {/* Mileage Sort */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center">
              <Gauge className="h-4 w-4 mr-2" />
              Mileage
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedSort === "mileage-asc" ? "default" : "outline"}
                className="w-full"
                onClick={() => onSortChange("mileage-asc")}
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Low Mileage
              </Button>
              <Button
                variant={selectedSort === "mileage-desc" ? "default" : "outline"}
                className="w-full"
                onClick={() => onSortChange("mileage-desc")}
              >
                <ArrowDown className="mr-2 h-4 w-4" />
                High Mileage
              </Button>
            </div>
          </div>

          {/* Size Sort */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium flex items-center">
              <Expand className="h-4 w-4 mr-2" />
              Size
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={selectedSort === "size-asc" ? "default" : "outline"}
                className="w-full"
                onClick={() => onSortChange("size-asc")}
              >
                <ArrowUp className="mr-2 h-4 w-4" />
                Small to Large
              </Button>
              <Button
                variant={selectedSort === "size-desc" ? "default" : "outline"}
                className="w-full"
                onClick={() => onSortChange("size-desc")}
              >
                <ArrowDown className="mr-2 h-4 w-4" />
                Large to Small
              </Button>
            </div>
          </div>
        </div>
        
        <div className="flex justify-end pt-4 border-t">
          <Button 
            onClick={onApply}
            className="bg-blue-600 hover:bg-blue-700 text-white"
            disabled={!selectedSort}
          >
            Continue
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};