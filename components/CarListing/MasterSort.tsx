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
  ListFilter,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export const MasterSort = ({
  onValueChange,
}: {
  onValueChange: (value: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState<string | null>(null);

  const handleSortSelection = (value: string) => {
    setSelectedSort(value);
  };

  const applyAndClose = () => {
    if (selectedSort) {
      onValueChange(selectedSort);
    }
    setOpen(false);
  };

  return (
    <>
      <div className="relative group h-12">
        <Button
          variant="ghost"
          size="icon"
          className="h-12 w-12 text-white hover:bg-gray-700/50 hover:text-white rounded-none absolute right-0"
          onClick={() => setOpen(true)}
          title="Sort Options"
        >
          <ListFilter className="h-6 w-6" />
        </Button>

        <div className="absolute right-12 top-0 h-full overflow-hidden">
          <div className="h-full flex items-center bg-gray-700/50 px-4 whitespace-nowrap transform transition-all duration-300 ease-out translate-x-full group-hover:translate-x-0">
            <span className="text-sm font-bold text-white">Sort</span>
          </div>
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              Sort Options
              <button onClick={() => setOpen(false)}>
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
                  className={`w-full transition-colors ${
                    selectedSort === "price-asc" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                  }`}
                  onClick={() => handleSortSelection("price-asc")}
                >
                  <ArrowDown className="mr-2 h-4 w-4" />
                  Low to High
                </Button>
                <Button
                  variant={selectedSort === "price-desc" ? "default" : "outline"}
                  className={`w-full transition-colors ${
                    selectedSort === "price-desc" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                  }`}
                  onClick={() => handleSortSelection("price-desc")}
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
                  className={`w-full transition-colors ${
                    selectedSort === "year-asc" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                  }`}
                  onClick={() => handleSortSelection("year-asc")}
                >
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Oldest
                </Button>
                <Button
                  variant={selectedSort === "year-desc" ? "default" : "outline"}
                  className={`w-full transition-colors ${
                    selectedSort === "year-desc" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                  }`}
                  onClick={() => handleSortSelection("year-desc")}
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
                  className={`w-full transition-colors ${
                    selectedSort === "weight-asc" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                  }`}
                  onClick={() => handleSortSelection("weight-asc")}
                >
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Light to Heavy
                </Button>
                <Button
                  variant={selectedSort === "weight-desc" ? "default" : "outline"}
                  className={`w-full transition-colors ${
                    selectedSort === "weight-desc" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                  }`}
                  onClick={() => handleSortSelection("weight-desc")}
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
                  className={`w-full transition-colors ${
                    selectedSort === "mileage-asc" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                  }`}
                  onClick={() => handleSortSelection("mileage-asc")}
                >
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Low Mileage
                </Button>
                <Button
                  variant={selectedSort === "mileage-desc" ? "default" : "outline"}
                  className={`w-full transition-colors ${
                    selectedSort === "mileage-desc" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                  }`}
                  onClick={() => handleSortSelection("mileage-desc")}
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
                  className={`w-full transition-colors ${
                    selectedSort === "size-asc" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                  }`}
                  onClick={() => handleSortSelection("size-asc")}
                >
                  <ArrowUp className="mr-2 h-4 w-4" />
                  Small to Large
                </Button>
                <Button
                  variant={selectedSort === "size-desc" ? "default" : "outline"}
                  className={`w-full transition-colors ${
                    selectedSort === "size-desc" ? "bg-blue-600 hover:bg-blue-700 text-white" : ""
                  }`}
                  onClick={() => handleSortSelection("size-desc")}
                >
                  <ArrowDown className="mr-2 h-4 w-4" />
                  Large to Small
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end pt-4 border-t">
            <Button 
              onClick={applyAndClose}
              className="bg-blue-600 hover:bg-blue-700 text-white"
              disabled={!selectedSort}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};