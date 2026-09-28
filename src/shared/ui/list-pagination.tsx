"use client";

import { Button } from "@/shared/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/shared/ui/pagination";

import { getVisiblePages } from "@/shared/lib/get-visible-pages";

type ListPaginationProps = {
  page: number;
  totalPages: number;
  ariaLabel: string;
  prevLabel: string;
  nextLabel: string;
  morePagesLabel: string;
  onPageChange: (page: number) => void;
};

export function ListPagination({
  page,
  totalPages,
  ariaLabel,
  prevLabel,
  nextLabel,
  morePagesLabel,
  onPageChange,
}: ListPaginationProps) {
  const pages = getVisiblePages(page, Math.max(totalPages, 1));

  return (
    <Pagination aria-label={ariaLabel}>
      <PaginationContent>
        <PaginationItem>
          <Button
            type="button"
            variant="ghost"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
          >
            {prevLabel}
          </Button>
        </PaginationItem>

        {pages.map((item, index) => (
          <PaginationItem
            key={item === "ellipsis" ? `ellipsis-${index}` : item}
          >
            {item === "ellipsis" ? (
              <PaginationEllipsis srOnlyLabel={morePagesLabel} />
            ) : (
              <Button
                type="button"
                size="icon"
                variant={item === page ? "outline" : "ghost"}
                aria-current={item === page ? "page" : undefined}
                onClick={() => onPageChange(item)}
              >
                {item}
              </Button>
            )}
          </PaginationItem>
        ))}

        <PaginationItem>
          <Button
            type="button"
            variant="ghost"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
          >
            {nextLabel}
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
