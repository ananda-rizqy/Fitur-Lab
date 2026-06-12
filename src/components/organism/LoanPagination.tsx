import React, { useMemo } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

interface LoanPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function LoanPagination({
  currentPage,
  totalPages,
  onPageChange,
}: LoanPaginationProps) {
  const delta = 1;

  const renderItems = useMemo(() => {
    const pages: React.ReactNode[] = [];

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        const isPageActive = currentPage === i;
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              isActive={isPageActive}
              onClick={() => onPageChange(i)}
              className={`h-9 w-9 text-xs font-mono font-black  cursor-pointer flex items-center justify-center border-2 transition-all ${
                isPageActive
                  ? "bg-zinc-950 border-zinc-950 text-white dark:bg-white dark:border-white dark:text-zinc-950"
                  : "border-transparent text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              }`}
            >
              {i}
            </PaginationLink>
          </PaginationItem>,
        );
      } else if (
        i === currentPage - delta - 1 ||
        i === currentPage + delta + 1
      ) {
        pages.push(
          <PaginationItem
            key={`ellipsis-${i}`}
            className="text-zinc-400 dark:text-zinc-600 px-1"
          >
            <PaginationEllipsis className="h-9 w-9 flex items-center justify-center" />
          </PaginationItem>,
        );
      }
    }
    return pages;
  }, [totalPages, currentPage, onPageChange]);

  return (
    <Pagination className="pt-2 flex justify-center select-none">
      <PaginationContent className="flex items-center gap-1 border-2 border-zinc-950 dark:border-zinc-800 p-1.5 bg-white dark:bg-zinc-900  shadow-[4px_4px_0px_0px_rgba(9,9,11,1)] dark:shadow-none">
        <PaginationItem>
          <PaginationPrevious
            onClick={() => onPageChange(Math.max(1, currentPage - 1))}
            className={`h-9 px-3 text-[10px] font-mono font-black uppercase tracking-wider  cursor-pointer flex items-center gap-1 border-2 border-transparent transition-all ${
              currentPage === 1
                ? "opacity-30 pointer-events-none"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
            }`}
          />
        </PaginationItem>

        {renderItems}

        <PaginationItem>
          <PaginationNext
            onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
            className={`h-9 px-3 text-[10px] font-mono font-black uppercase tracking-wider rounded-lg cursor-pointer flex items-center gap-1 border-2 border-transparent transition-all ${
              currentPage === totalPages
                ? "opacity-30 pointer-events-none"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200"
            }`}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
