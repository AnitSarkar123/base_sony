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
import HomeJapanFilters from "./HomeJapanFilters";

const HomeJapanInventory = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cars, setCars] = useAtom(carsAtom);
  const [pagination, setPagination] = useAtom(carPaginationAtom);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  const [resetKey, setResetKey] = useState(0);
  
  // Get filter data - use the exact same approach as in CarListing.tsx
  const {
    isLoading: isFilterLoading,
    isRefetchingFeatures,
    isRefetchingMakes,
    isRefetchingModels,
    isRefetchingTypes,
    isRefetchingFilters,
    refetch: refetchFilters,
    refetchMakes,
    refetchTypes,
    filters, // Get filters from the same hook instance
  } = useFilter();
  
  // Filter the same way as in CarListing.tsx
  const targetFilters = filters
    ?.filter(filter => filter?.name && ['condition', 'year', 'fuel', 'seats', 'color']
      .includes(filter.name.toLowerCase()))
    .filter(Boolean) || [];
    
  
  // Handle scroll to show/hide scroll-to-top button
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Reference to the Japan section
  const japanSectionRef = React.useRef<HTMLDivElement>(null);
  
  // Add a useEffect to refetch filters when resetKey changes (like in CarListing.tsx)
  useEffect(() => {
    if (resetKey > 0) {
      // Refetch both cars and filters when reset is triggered
      const fetchData = async () => {
        try {
          // Fetch all filter data in parallel
          await Promise.all([
            refetchFilters(),
            refetchMakes(),
            refetchTypes(),
          ]);
        } catch (err) {
          console.error("Error refetching filters:", err);
        }
      };
      
      fetchData();
    }
  }, [resetKey, refetchFilters, refetchMakes, refetchTypes]);

  // Fetch cars and filters when component mounts (only once)
  useEffect(() => {
    const fetchJapanInventory = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Initialize pagination
        setPagination(prev => ({
          ...prev,
          page: 1,
          details: [],
          selectedFeatures: [],
          sortBy: undefined,
          minPrice: undefined,
          maxPrice: undefined
        }));
        
        // Fetch all filter data in parallel to ensure everything is loaded properly
        await Promise.all([
          refetchFilters(),
          refetchMakes(),
          refetchTypes(),
        ]);
        
        // Add a small delay to ensure filters are fully processed
        await delay(300);
        
        // Fetch first batch of cars from our custom API endpoint for Japan inventory
        const { data } = await axios.get(`/api/home-japan?page=1&limit=${pagination.limit}`, {
          headers: {
            "Cache-Control": "no-cache",
            cache: "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        });
        
        // Update cars and pagination
        setCars(data.data);
        setPagination(prev => ({
          ...prev,
          totalPages: data.pagination.totalPages,
          totalItems: data.pagination.totalItems,
          priceRange: data.pagination.priceRange,
        }));
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching Japan inventory:", err);
        setError("Failed to load Japan inventory");
        setIsLoading(false);
      }
    };
    
    fetchJapanInventory();
    
    // Cleanup function
    return () => {
      // Reset cars when component unmounts
      setCars([]);
    };
  }, [setCars, setPagination, refetchFilters, refetchMakes, refetchTypes, pagination.limit]);

  // Only show loader when cars are initially loading or there are no cars
  if (!cars.length && isLoading) {
    return (
      <div className="flex h-96 items-center justify-center" style={{ minHeight: "calc(40vh)" }}>
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-96 items-center justify-center" style={{ minHeight: "calc(40vh)" }}>
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Handle sort change
  const handleSortChange = async (value: string) => {
    const [name, order] = value.split("-");
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset to first page when sorting
      sortBy: { name, order },
    }));
    
    // Refetch cars with new sort
    setIsLoading(true);
    await delay(300);
    
    try {
      const { data } = await axios.get(
        `/api/home-japan?page=1&limit=${pagination.limit}&sortBy=${name}:${order}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            cache: "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
      
      // Replace cars with new sorted results
      setCars(data.data);
      setPagination(prev => ({
        ...prev,
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.totalItems,
        priceRange: data.pagination.priceRange,
      }));
    } catch (err) {
      console.error("Error applying sort:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle feature filter change - similar to CarListing.tsx
  const handleFilterFeatureChange = async (names: string[]) => {
    setPagination((prev) => ({
      ...prev,
      page: 1, // Reset to first page when filtering
      selectedFeatures: names.map((name) => ({ name })),
    }));
    
    // Refetch cars with new features filter
    setIsLoading(true);
    await delay(300);
    
    try {
      const featuresParam = names.length > 0 ? `&features=${names.join(',')}` : '';
      const { data } = await axios.get(
        `/api/home-japan?page=1&limit=${pagination.limit}${featuresParam}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            cache: "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
      
      // Replace cars with new filtered results
      setCars(data.data);
      setPagination(prev => ({
        ...prev,
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.totalItems,
        priceRange: data.pagination.priceRange,
      }));
      
      // We'll refetch filters in a controlled way to avoid flickering
      if (names.length > 0) {
        // Only refetch if we have active filters
        await Promise.all([
          refetchFilters(),
          refetchMakes(),
          refetchTypes(),
        ]);
      }
    } catch (err) {
      console.error("Error applying feature filter:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle inventory filter change - similar to CarListing.tsx
  const handleInventoryFilterChange = async (filterName: string, values: string[]) => {
    // Update pagination with new filter values
    setPagination((prev) => {
      const newDetails = [...prev.details];
      const existingIndex = newDetails.findIndex((d) => d.name === filterName);
      
      if (existingIndex >= 0) {
        if (values.length > 0) {
          newDetails[existingIndex] = { name: filterName, values };
        } else {
          newDetails.splice(existingIndex, 1);
        }
      } else if (values.length > 0) {
        newDetails.push({ name: filterName, values });
      }
      
      return {
        ...prev,
        page: 1, // Reset to first page when filtering
        details: newDetails,
      };
    });
    
    // Refetch cars with new filter
    setIsLoading(true);
    await delay(300);
    
    try {
      // Build details parameter
      const detailsParam = pagination.details
        .map((detail) => `${detail.name}:${detail.values.join(",")}`)
        .join(";");
      
      const detailsQueryParam = detailsParam ? `&details=${detailsParam}` : '';
      const featuresParam = pagination.selectedFeatures && pagination.selectedFeatures.length > 0 
        ? `&features=${pagination.selectedFeatures.map(f => f.name).join(',')}` 
        : '';
      
      const { data } = await axios.get(
        `/api/home-japan?page=1&limit=${pagination.limit}${detailsQueryParam}${featuresParam}`,
        {
          headers: {
            "Cache-Control": "no-cache",
            cache: "no-cache",
            Pragma: "no-cache",
            Expires: "0",
          },
        }
      );
      
      // Replace cars with new filtered results
      setCars(data.data);
      setPagination(prev => ({
        ...prev,
        totalPages: data.pagination.totalPages,
        totalItems: data.pagination.totalItems,
        priceRange: data.pagination.priceRange,
      }));
      
      // We'll refetch filters in a controlled way to avoid flickering
      if (pagination.details.length > 0) {
        // Only refetch if we have active filters
        await Promise.all([
          refetchFilters(),
          refetchMakes(),
          refetchTypes(),
        ]);
      }
    } catch (err) {
      console.error("Error applying inventory filter:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div ref={japanSectionRef} className="container-md-mx relative">
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-20 right-8 z-50 p-2 bg-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-all"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
          </svg>
        </button>
      )}
      
      <div className="text-center my-8">
        <h2 className="text-3xl font-bold mb-2">Japan Inventory</h2>
        <p className="text-gray-600">Browse our available inventory in Japan</p>
      </div>
      
      {/* Header section */}
      <div className="flex flex-col mb-4 bg-white pt-2 pb-4">
        <div className="relative flex flex-1 flex-col items-center justify-center gap-4 md:flex-row md:items-center">
          <h3 className="text-lg font-semibold">
            {pagination.totalItems || cars.length || 0} Cars Found
          </h3>
        </div>
      </div>
      
      {/* Main content with integrated sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 min-h-[600px] lg:min-h-[700px]">
        {/* Car listing area - scrollable without visible scrollbar */}
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {/* Car cards grid */}
          {cars && cars.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pb-8">
              {cars.map((car) => (
                <div key={car._id} className="inventory-card">
                  <InventoryCard
                    car={car}
                    onSelect={() => {}}
                    isDragging={false}
                    isSelected={false}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-1 flex h-96 items-center justify-center sm:col-span-2 lg:col-span-3 xl:col-span-4">
              No cars found
            </div>
          )}
        </div>
        
        {/* Integrated Filter Sidebar */}
        {cars && cars.length > 0 && (
          <HomeJapanFilters 
            resetKey={resetKey}
            onSortChange={handleSortChange}
            onFilterFeatureChange={handleFilterFeatureChange}
            onInventoryFilterChange={handleInventoryFilterChange}
            totalCars={pagination.totalItems || cars.length || 0}
          />
        )}
      </div>
      
      {/* Load more button */}
      {cars && cars.length > 0 && pagination.page < pagination.totalPages && (
        <div className="flex justify-center my-8">
          <div className="relative">
            {isLoadingMore && (
              <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-80">
                <Loader size="2em" />
              </div>
            )}
            <button
              onClick={async () => {
                const nextPage = pagination.page + 1;
                setIsLoadingMore(true);
                
                try {
                  // Build query parameters
                  let queryParams = `?page=${nextPage}&limit=${pagination.limit}`;
                  
                  // Add sort parameter if available
                  if (pagination.sortBy) {
                    queryParams += `&sortBy=${pagination.sortBy.name}:${pagination.sortBy.order}`;
                  }
                  
                  // Add details parameter if available
                  if (pagination.details.length > 0) {
                    const detailsParam = pagination.details
                      .map((detail) => `${detail.name}:${detail.values.join(",")}`)
                      .join(";");
                    queryParams += `&details=${detailsParam}`;
                  }
                  
                  // Add features parameter if available
                  if (pagination.selectedFeatures && pagination.selectedFeatures.length > 0) {
                    const featuresParam = pagination.selectedFeatures
                      .map((feature) => feature.name)
                      .join(",");
                    queryParams += `&features=${featuresParam}`;
                  }
                  
                  const { data } = await axios.get(`/api/home-japan${queryParams}`, {
                    headers: {
                      "Cache-Control": "no-cache",
                      cache: "no-cache",
                      Pragma: "no-cache",
                      Expires: "0",
                    },
                  });
                  
                  // Append new cars to existing ones
                  setCars(prev => [...prev, ...data.data]);
                  setPagination(prev => ({
                    ...prev,
                    page: nextPage,
                    totalPages: data.pagination.totalPages,
                    totalItems: data.pagination.totalItems,
                    priceRange: data.pagination.priceRange,
                  }));
                } catch (err) {
                  console.error("Error loading more cars:", err);
                } finally {
                  setIsLoadingMore(false);
                }
              }}
              className={`px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${isLoadingMore ? 'opacity-0' : ''}`}
              disabled={isLoadingMore}
            >
              <span>Show More</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomeJapanInventory;