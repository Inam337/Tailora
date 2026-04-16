import type { Table } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';

type TablePaginationBarProps<TData> = {
  table: Table<TData>;
};

export function TablePaginationBar<TData>({ table }: TablePaginationBarProps<TData>) {
  const { t } = useTranslation('common');
  const filteredCount = table.getFilteredRowModel().rows.length;
  const pageCount = Math.max(1, table.getPageCount());
  const current = table.getState().pagination.pageIndex + 1;
  const canPrev = table.getCanPreviousPage();
  const canNext = table.getCanNextPage();

  if (filteredCount === 0) {
    return (
      <div
        className="flex flex-col sm:flex-row items-center justify-center sm:justify-between
        px-1 sm:px-4 py-3 sm:py-4 border-t border-gray-200 gap-3 shrink-0 max-w-full min-w-0"
      >
        <span className="text-xs sm:text-sm text-gray-500 text-center">
          {t('pagination.noResults')}
        </span>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-center sm:justify-between
      px-1 sm:px-4 py-3 sm:py-4 border-t border-gray-200 gap-3 sm:gap-4 shrink-0 max-w-full min-w-0"
    >
      <div className="flex items-center text-xs sm:text-sm text-gray-500 text-center">
        <span className="break-words">
          {t('pagination.pageInfo', {
            current,
            total: pageCount,
            count: filteredCount,
          })}
        </span>
      </div>
      <div
        className="flex flex-row items-center justify-center space-x-1 flex-wrap gap-1
        w-full sm:w-auto"
      >
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(0)}
          disabled={!canPrev}
          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300
          disabled:opacity-50 disabled:cursor-not-allowed h-7 px-2 text-xs min-w-[45px]"
          title={t('pagination.first')}
        >
          <span className="text-xs">{t('pagination.first')}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.previousPage()}
          disabled={!canPrev}
          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300
          disabled:opacity-50 disabled:cursor-not-allowed h-7 px-2 text-xs min-w-[50px]"
        >
          <span className="text-xs">{t('pagination.prev')}</span>
        </Button>
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-500 whitespace-nowrap hidden sm:inline">
            {t('pagination.goTo')}
          </span>
          <Select
            value={String(current)}
            onValueChange={value => table.setPageIndex(Number.parseInt(value, 10) - 1)}
          >
            <SelectTrigger
              className="w-14 h-7 px-2 text-xs bg-white border-blue-300 focus:ring-1 focus:ring-blue-200"
            >
              <SelectValue placeholder="1" />
            </SelectTrigger>
            <SelectContent className="max-h-60">
              {Array.from({ length: pageCount }, (_, i) => i + 1).map(pageNum => (
                <SelectItem
                  key={pageNum}
                  value={String(pageNum)}
                  className="cursor-pointer hover:bg-blue-50 text-xs"
                >
                  {pageNum}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.nextPage()}
          disabled={!canNext}
          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300
          disabled:opacity-50 disabled:cursor-not-allowed h-7 px-2 text-xs min-w-[50px]"
        >
          <span className="text-xs">{t('pagination.next')}</span>
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => table.setPageIndex(pageCount - 1)}
          disabled={!canNext}
          className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300
          disabled:opacity-50 disabled:cursor-not-allowed h-7 px-2 text-xs min-w-[45px]"
          title={t('pagination.last')}
        >
          <span className="text-xs">{t('pagination.last')}</span>
        </Button>
      </div>
    </div>
  );
}
