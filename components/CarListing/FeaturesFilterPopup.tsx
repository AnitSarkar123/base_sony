"use client";

import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Loader from "@/components/Loader";

interface FeaturesFilterPopupProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  features: { name: string; count: number }[];
  selectedFeatures: string[];
  onValueChange: (names: string[]) => void;
}

export const FeaturesFilterPopup = ({
  open,
  onOpenChange,
  features,
  selectedFeatures,
  onValueChange,
}: FeaturesFilterPopupProps) => {
  const isFeatureSelected = (featureName: string) => {
    return selectedFeatures.includes(featureName);
  };

  const hasSelectedFeatures = () => {
    return selectedFeatures.length > 0;
  };

  const handleFeatureClick = (featureName: string) => {
    const newValues = isFeatureSelected(featureName)
      ? selectedFeatures.filter(v => v !== featureName)
      : [...selectedFeatures, featureName];
    onValueChange(newValues);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[80vh] flex flex-col w-[90vw] max-w-[1200px] p-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto">
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="flex items-center justify-between text-lg">
              Features
              <button 
                onClick={() => onOpenChange(false)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-4">
            {features.length === 0 ? (
              <Loader className="h-40" />
            ) : (
              <div className="grid grid-cols-6 gap-4">
                {features?.map((feature) => (
                  <button
                    key={feature.name}
                    onClick={() => handleFeatureClick(feature.name)}
                    className={`group relative flex items-start rounded-lg border-2 p-3 transition-all h-full ${
                      isFeatureSelected(feature.name)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}
                  >
                    <div className="flex flex-col w-full h-full">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">
                          {isFeatureSelected(feature.name) ? (
                            <Check className="h-4 w-4 text-blue-600" />
                          ) : (
                            <div className="h-4 w-4 rounded border border-gray-300" />
                          )}
                        </div>
                        <span className="text-sm font-medium text-left break-words">
                          {feature.name}
                        </span>
                      </div>
                      <div className="mt-2 text-xs text-gray-500 text-left pl-7">
                        {feature.count} available
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Continue button */}
        <div className={`sticky bottom-0 bg-background px-6 py-4 border-t transition-opacity ${
          hasSelectedFeatures() ? 'opacity-100' : 'opacity-0 h-0 py-0 overflow-hidden'
        }`}>
          <div className="flex justify-end">
            <Button 
              onClick={() => onOpenChange(false)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};