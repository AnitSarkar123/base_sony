// "use client";

// import React, { useEffect } from "react";
// import CarListing from "@/components/CarListing";
// import { usePathname } from "next/navigation";
// import { useAtom } from "jotai";
// import { carPaginationAtom } from "@/jotai/carsAtom";

// const JapanSection = () => {
//   const [pagination, setPagination] = useAtom(carPaginationAtom);

//   // Force the component to behave as if it's on the Japan page
//   useEffect(() => {
//     // Store the original pathname in session storage
//     if (typeof window !== 'undefined') {
//       // Set a flag to indicate we're viewing the Japan section on the home page
//       sessionStorage.setItem('viewingJapanSection', 'true');
//     }

//     // Reset pagination when component mounts
//     setPagination(prev => ({
//       ...prev,
//       page: 1,
//       details: [],
//       selectedFeatures: [],
//       sortBy: undefined,
//       minPrice: undefined,
//       maxPrice: undefined
//     }));

//     return () => {
//       // Clean up when component unmounts
//       if (typeof window !== 'undefined') {
//         sessionStorage.removeItem('viewingJapanSection');
//       }
//     };
//   }, [setPagination]);

//   return (
//     <div className="japan-section w-full">
//       <div className="text-center my-8">
//         <h2 className="text-3xl font-bold mb-2">Japan Inventory</h2>
//         <p className="text-gray-600">Browse our available inventory in Japan</p>
//       </div>
//       <CarListing />
//     </div>
//   );
// };

// export default JapanSection;
"use client";

import React, { useEffect } from "react";
import CarListing from "@/components/CarListing";
import { useAtom } from "jotai";
import { carPaginationAtom } from "@/jotai/carsAtom";

/**
 * JapanSection component displays Japan inventory on the homepage
 * It manages pagination state and session storage flags
 */
const JapanSection: React.FC = () => {
  const [, setPagination] = useAtom(carPaginationAtom);

  useEffect(() => {
    // Set session flag for Japan section view
    if (typeof window !== "undefined") {
      sessionStorage.setItem("viewingJapanSection", "true");
    }

    // Reset pagination state on mount
    setPagination((prev) => ({
      ...prev,
      page: 1,
      details: [],
      selectedFeatures: [],
      sortBy: undefined,
      minPrice: undefined,
      maxPrice: undefined,
    }));

    // Cleanup on unmount
    return () => {
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("viewingJapanSection");
      }
    };
  }, [setPagination]);

  return (
    <section className="japan-section w-full">
      <div className="my-8 text-center">
        <h2 className="mb-2 text-3xl font-bold">Japan Inventory</h2>
        <p className="text-gray-600">Browse our available inventory in Japan</p>
      </div>
      <CarListing />
    </section>
  );
};

export default JapanSection;
