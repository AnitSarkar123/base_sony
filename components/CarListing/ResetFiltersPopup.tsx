"use client";

import { useSetAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";
import { useFilter } from "@/hooks/useFilter";
import { useCars } from "@/hooks/useCars";
import { delay } from "@/lib/utils";
import { useCallback, useState } from "react";

interface ResetFiltersPopupProps {
  onReset: () => void;
  disabled?: boolean;
}

export const ResetFiltersPopup = ({ onReset, disabled }: ResetFiltersPopupProps) => {
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = useCallback(async () => {
    setIsResetting(true);
    try {
      await onReset();
    } finally {
      setIsResetting(false);
    }
  }, [onReset]);

  return (
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
  );
};