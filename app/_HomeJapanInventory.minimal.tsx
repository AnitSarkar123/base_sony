"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import InventoryCard from "@/components/InventoryCard";
import Loader from "@/components/Loader";
import { useAtom } from "jotai";
import { carPaginationAtom, carsAtom } from "@/jotai/carsAtom";
import { Button } from "@/components/ui/button";
import { useFilter } from "@/hooks/useFilter";
import { delay } from "@/lib/utils";

const HomeJapanInventory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cars, setCars] = useAtom(carsAtom);
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [resetKey, setResetKey] = useState(0);
  
  // Get filter data
  const {
    isLoading: isFilterLoading,
    refetch: refetchFilters,
    refetchMakes,
    refetchTypes,
    filters,
  } = useFilter();
  
  // Filter the same way as in CarListing.tsx
  const targetFilters = filters
    ?.filter(filter => filter?.name && ['condition', 'year', 'fuel', 'seats', 'color']
      .includes(filter.name.toLowerCase()))
    .filter(Boolean) || [];
  
  // Fetch cars when component mounts
  useEffect(() => {
    const fetchJapanInventory = async () => {
      setIsLoading(true);
      
      try {
        const { data } = await axios.get(`/api/home-japan?page=1&limit=${pagination.limit}`);
        setCars(data.data);
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination.totalPages,
          totalItems: data.pagination.totalItems,
        }));
      } catch (err) {
        console.error("Error fetching Japan inventory:", err);
        setError("Failed to load Japan inventory");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchJapanInventory();
    
    return () => {
      setCars([]);
    };
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold mb-4">Japan Inventory</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car) => (
          <div key={car._id}>
            <InventoryCard
              car={car}
              onSelect={() => {}}
              isDragging={false}
              isSelected={false}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomeJapanInventory;