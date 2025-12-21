import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string | undefined>;
}

export default function Pagination({ currentPage, totalPages, baseUrl, searchParams = {} }: PaginationProps) {
  // Helper to construct URL with existing search params
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams();
    
    // Add existing params (e.g., category)
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== 'page') {
        params.append(key, value);
      }
    });
    
    // Add page param
    if (page > 1) {
      params.append("page", page.toString());
    }
    
    const queryString = params.toString();
    return `${baseUrl}${queryString ? `?${queryString}` : ""}`;
  };

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      {/* Previous Button */}
      {currentPage > 1 ? (
        <Link 
          href={createPageUrl(currentPage - 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all"
        >
          <ChevronLeft size={20} />
        </Link>
      ) : (
        <button disabled className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 text-gray-300 cursor-not-allowed">
          <ChevronLeft size={20} />
        </button>
      )}

      {/* Page Numbers */}
      <div className="flex gap-2">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
          // Logic to show limited pages if too many could be added here, 
          // but for < 100 products and 12 per page, simpler logic is fine.
          const isCurrent = page === currentPage;
          
          return (
            <Link
              key={page}
              href={createPageUrl(page)}
              className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all font-medium ${
                isCurrent
                  ? "bg-black text-white border-black"
                  : "bg-white text-gray-700 border-gray-200 hover:border-black"
              }`}
            >
              {page}
            </Link>
          );
        })}
      </div>

      {/* Next Button */}
      {currentPage < totalPages ? (
        <Link 
          href={createPageUrl(currentPage + 1)}
          className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-200 hover:border-black hover:bg-black hover:text-white transition-all"
        >
          <ChevronRight size={20} />
        </Link>
      ) : (
        <button disabled className="w-10 h-10 flex items-center justify-center rounded-full border border-gray-100 text-gray-300 cursor-not-allowed">
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
}
