// import { useCars } from "@/hooks/useCars";
// import { cn } from "@/lib/utils";
// import { useState } from "react";

// const CarPagination = () => {
//   const { pagination, setPage, cars } = useCars();
//   const { page, totalPages, totalItems, limit } = pagination;
//   const [loading, setLoading] = useState(false);

//   const handlePageChange = async (newPage: number) => {
// 	  if (newPage === page || loading) return;
// 	  setLoading(true);
// 	  await setPage(newPage);
// 	  setLoading(false);
// 	};

//   const getPageRange = () => {
//     const visiblePages = [];
//     const maxVisible = 5;
//     let start = Math.max(1, page - 2);
//     let end = Math.min(totalPages, start + maxVisible - 1);

//     if (end - start + 1 < maxVisible) {
//       start = Math.max(1, end - maxVisible + 1);
//     }

//     if (start > 1) visiblePages.push(1);
//     if (start > 2) visiblePages.push('...');

//     for (let i = start; i <= end; i++) {
//       visiblePages.push(i);
//     }

//     if (end < totalPages - 1) visiblePages.push('...');
//     if (end < totalPages) visiblePages.push(totalPages);

//     return visiblePages;
//   };

//   return (
//     <div className="flex w-full flex-col items-center gap-4 py-4">
//       <div className="text-sm font-medium text-gray-600">
//         Showing {(page - 1) * limit + 1}-{Math.min(page * limit, totalItems)} of {totalItems} cars
//       </div>

//       <div className="flex items-center gap-1">
//         <button
//           onClick={() => handlePageChange(page - 1)}
//           disabled={page <= 1 || loading}
//           className={cn(
//             "rounded px-3 py-1 text-sm",
//             page <= 1 || loading ? "text-gray-400" : "hover:bg-gray-100"
//           )}
//         >
//           Prev
//         </button>

//         {getPageRange().map((pageNum, i) => (
//           pageNum === '...' ? (
//             <span key={i} className="px-1">...</span>
//           ) : (
//             <button
//               key={i}
//               onClick={() => handlePageChange(Number(pageNum))}
//               disabled={loading}
//               className={cn(
//                 "rounded px-3 py-1 text-sm",
//                 page === pageNum
//                   ? "bg-blue-500 text-white"
//                   : "hover:bg-gray-100"
//               )}
//             >
//               {pageNum}
//             </button>
//           )
//         ))}

//         <button
//           onClick={() => handlePageChange(page + 1)}
//           disabled={page >= totalPages || loading}
//           className={cn(
//             "rounded px-3 py-1 text-sm",
//             page >= totalPages || loading ? "text-gray-400" : "hover:bg-gray-100"
//           )}
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default CarPagination;
import { useCars } from "@/hooks/useCars";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { Loader2 } from "lucide-react";

/**
 * A pagination component for navigating through pages of car listings.
 */
const CarPagination: React.FC = () => {
  const { pagination, setPage } = useCars();
  const { page, totalPages, totalItems, limit } = pagination;
  const [loading, setLoading] = useState(false);

  // No items to paginate
  if (totalItems === 0 || totalPages <= 1) {
    return null;
  }

  const handlePageChange = async (newPage: number): Promise<void> => {
    if (newPage === page || loading || newPage < 1 || newPage > totalPages) {
      return;
    }

    setLoading(true);
    try {
      await setPage(newPage);
    } catch (error) {
      console.error("Failed to change page:", error);
    } finally {
      setLoading(false);
    }
  };

  const getPageRange = (): (number | string)[] => {
    const visiblePages: (number | string)[] = [];
    const maxVisible = 5;
    const ellipsis = "...";

    // Calculate start and end page numbers to display
    let start = Math.max(1, page - Math.floor(maxVisible / 2));
    const end = Math.min(totalPages, start + maxVisible - 1);

    // Adjust start if we're near the end of the pages
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    // Add first page and ellipsis if needed
    if (start > 1) visiblePages.push(1);
    if (start > 2) visiblePages.push(ellipsis);

    // Add visible page numbers
    for (let i = start; i <= end; i++) {
      visiblePages.push(i);
    }

    // Add ellipsis and last page if needed
    if (end < totalPages - 1) visiblePages.push(ellipsis);
    if (end < totalPages) visiblePages.push(totalPages);

    return visiblePages;
  };

  // Calculate the range of items being displayed
  const startItem = (page - 1) * limit + 1;
  const endItem = Math.min(page * limit, totalItems);

  // Determine if prev/next buttons should be disabled
  const isPrevDisabled = page <= 1 || loading;
  const isNextDisabled = page >= totalPages || loading;

  return (
    <nav
      className="flex w-full flex-col items-center gap-4 py-4"
      aria-label="Pagination navigation"
    >
      <div className="text-sm font-medium text-gray-600" aria-live="polite">
        {totalItems > 0 ? (
          <>
            Showing {startItem}-{endItem} of {totalItems} cars
          </>
        ) : (
          <>No cars found</>
        )}
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={isPrevDisabled}
          aria-label="Previous page"
          className={cn(
            "flex items-center rounded px-3 py-1 text-sm",
            isPrevDisabled
              ? "cursor-not-allowed text-gray-400"
              : "hover:bg-gray-100",
          )}
        >
          {loading && page > 1 ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : null}
          Prev
        </button>

        {getPageRange().map((pageNum, i) =>
          pageNum === "..." ? (
            <span key={`ellipsis-${i}`} className="px-1" aria-hidden="true">
              ...
            </span>
          ) : (
            <button
              key={`page-${pageNum}`}
              onClick={() => handlePageChange(Number(pageNum))}
              disabled={loading}
              aria-label={`Page ${pageNum}`}
              aria-current={page === pageNum ? "page" : undefined}
              className={cn(
                "min-w-[2rem] rounded px-3 py-1 text-sm",
                page === pageNum
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100",
              )}
            >
              {pageNum}
            </button>
          ),
        )}

        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={isNextDisabled}
          aria-label="Next page"
          className={cn(
            "flex items-center rounded px-3 py-1 text-sm",
            isNextDisabled
              ? "cursor-not-allowed text-gray-400"
              : "hover:bg-gray-100",
          )}
        >
          Next
          {loading && page < totalPages ? (
            <Loader2 className="ml-1 h-4 w-4 animate-spin" />
          ) : null}
        </button>
      </div>
    </nav>
  );
};

export default CarPagination;
