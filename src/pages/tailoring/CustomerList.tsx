import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { DeleteConfirmationModal } from '@/components/app/DeleteConfirmationModal';
import { TailoringListShell } from '@/components/tailoring/TailoringListShell';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/ui/DataTable';
import { Input } from '@/components/ui/Input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import { RbIcon } from '@/components/icons/common/RbIcon';
import VerticalDots from '@/components/ui/vertical-dots';
import { IconColors } from '@/components/icons/types/RbIcon.types';
import { CustomerService } from '@/services/customerService';
import { useTailoringStore } from '@/stores/tailoringStore';
import { AppConstants } from '@/common/AppConstants';
import type { Customer } from '@/models/tailoring';

const ACTION_ICON_SIZE = 16;
const PAGE_SIZE = 10;

type EmailFilter = 'all' | 'with' | 'without';

export default function CustomerList() {
  const { t } = useTranslation(AppConstants.Tailoring.I18nNs);
  const { t: tc } = useTranslation('common');
  const navigate = useNavigate();
  const customers = useTailoringStore(s => s.customers);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [emailFilter, setEmailFilter] = useState<EmailFilter>('all');
  const [globalFilter, setGlobalFilter] = useState('');
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const filteredCustomers = useMemo(
    () =>
      customers.filter((c) => {
        if (emailFilter === 'with') {
          return Boolean(c.email?.trim());
        }

        if (emailFilter === 'without') {
          return !c.email?.trim();
        }

        return true;
      }),
    [customers, emailFilter],
  );

  useEffect(() => {
    setGlobalFilter('');
  }, [emailFilter]);

  const setSearchFromToolbar = useCallback((raw: string) => {
    if (/\s{3,}/.test(raw)) {
      return;
    }

    if (raw.startsWith(' ')) {
      return;
    }

    setGlobalFilter(raw);
  }, []);
  const columns = useMemo<ColumnDef<Customer>[]>(
    () => [
      {
        accessorKey: 'name',
        header: t('customers.fields.name'),
        cell: ({ row }) => (
          <span className="font-medium text-foreground">{row.getValue('name')}</span>
        ),
      },
      {
        accessorKey: 'phone',
        header: t('customers.fields.phone'),
      },
      {
        accessorKey: 'email',
        header: t('customers.fields.email'),
        cell: ({ getValue }) => (getValue() as string | undefined)?.trim() || '—',
      },
      {
        accessorKey: 'address',
        header: t('customers.fields.address'),
        cell: ({ getValue }) => (getValue() as string | undefined)?.trim() || '—',
      },
      {
        accessorKey: 'id',
        header: t('common.idColumn'),
        meta: { className: 'font-mono text-xs text-muted-foreground max-w-[120px] truncate' },
      },
      {
        id: 'actions',
        header: t('list.columns.action'),
        enableSorting: false,
        meta: { className: 'min-w-[80px] max-w-[100px] w-[90px]' },
        cell: ({ row }) => {
          const c = row.original;

          return (
            <div className="flex items-start justify-start">
              <DropdownMenu
                open={openDropdownId === c.id}
                onOpenChange={open => setOpenDropdownId(open ? c.id : null)}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                  >
                    <VerticalDots
                      size={ACTION_ICON_SIZE}
                      color="bg-gray-600"
                      className="hover:bg-gray-800"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-100 gap-2"
                    onClick={() => {
                      setOpenDropdownId(null);

                      const href = `${AppConstants.Routes.Private.CustomersCreate}?edit=${
                        encodeURIComponent(c.id)}`;

                      navigate(href);
                    }}
                  >
                    <RbIcon
                      name="edit"
                      size={ACTION_ICON_SIZE}
                      color={IconColors.BLACK_COLOR_ICON}
                    />
                    {t('list.actions.edit')}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer hover:bg-gray-100 gap-2"
                    onClick={() => {
                      setOpenDropdownId(null);
                      setDeleteId(c.id);
                    }}
                  >
                    <RbIcon
                      name="trash"
                      size={ACTION_ICON_SIZE}
                      color={IconColors.BLACK_COLOR_ICON}
                    />
                    {t('list.actions.delete')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          );
        },
      },
    ],
    [t, navigate, openDropdownId],
  );
  const onConfirmDelete = useCallback(async () => {
    if (!deleteId) {
      return;
    }

    await CustomerService.remove(deleteId);
    toast.success(t('customers.deletedToast'));
  }, [deleteId, t]);
  const filterPanel = useMemo(
    () => (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">
            {t('customers.filters.title')}
          </h3>
          <button
            type="button"
            onClick={() => setFiltersOpen(false)}
            className="text-gray-400 hover:text-gray-600 cursor-pointer"
          >
            <RbIcon
              name="close"
              size={12}
              color={IconColors.GRAY_COLOR_ICON}
            />
          </button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <span className="text-sm font-medium text-gray-700">
              {t('customers.filters.emailPresence')}
            </span>
            <Select
              value={emailFilter}
              onValueChange={v => setEmailFilter(v as EmailFilter)}
            >
              <SelectTrigger className="w-full bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('customers.filters.all')}</SelectItem>
                <SelectItem value="with">{t('customers.filters.withEmail')}</SelectItem>
                <SelectItem value="without">{t('customers.filters.withoutEmail')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-200">
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              setEmailFilter('all');
              setFiltersOpen(false);
            }}
          >
            {tc('text.cancel')}
          </Button>
          <Button
            type="button"
            onClick={() => setFiltersOpen(false)}
          >
            {tc('text.applyFilter')}
          </Button>
        </div>
      </div>
    ),
    [emailFilter, t, tc],
  );
  const listTopBar = useMemo(
    () => (
      <div className="w-full flex flex-col gap-4 p-4 min-w-0 border-b border-gray-100 bg-white">
        <div className="w-full flex flex-col justify-between items-start sm:items-center gap-4">
          <div className="w-full flex relative justify-end items-center gap-4 flex-col">
            <div className="w-full flex relative justify-end items-center gap-4 flex-row flex-wrap">
              <div className="relative w-full sm:w-80 min-w-0">
                <Input
                  placeholder={t('common.tableSearch')}
                  value={globalFilter}
                  onChange={e => setSearchFromToolbar(e.target.value)}
                  className="rounded-lg border border-gray-300 bg-white pr-10"
                />
                {globalFilter
                  ? (
                      <button
                        type="button"
                        onClick={() => setGlobalFilter('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                        cursor-pointer hover:text-gray-600"
                        title={tc('text.cancel')}
                      >
                        <RbIcon
                          name="close"
                          size={12}
                          color={IconColors.GRAY_COLOR_ICON}
                        />
                      </button>
                    )
                  : (
                      <RbIcon
                        name="search"
                        size={16}
                        color={IconColors.BLACK_COLOR_ICON}
                        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      />
                    )}
              </div>
              <Button
                variant="outline"
                type="button"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2 border border-blue-900 text-blue-900
                hover:bg-blue-50 w-full sm:w-auto"
              >
                <RbIcon
                  name="filters"
                  size={16}
                  color={IconColors.BLUE_COLOR_ICON}
                />
                {tc('text.filter')}
              </Button>
            </div>
            {filtersOpen && (
              <div
                className="mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg p-4"
              >
                {filterPanel}
              </div>
            )}
          </div>
        </div>
      </div>
    ),
    [filterPanel, filtersOpen, globalFilter, setSearchFromToolbar, t, tc],
  );

  return (
    <TailoringListShell>
      <div className="flex flex-col h-full max-w-full min-w-0">
        {listTopBar}
        <div className="p-4 sm:p-6 space-y-4 max-w-full min-w-0">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{t('customers.listTitle')}</h1>
            <p className="text-sm text-muted-foreground mt-1">{t('customers.listSubtitle')}</p>
          </div>
          <DataTable
            columns={columns}
            data={filteredCustomers}
            showPagination
            richPagination
            itemsPerPage={PAGE_SIZE}
            showSearch={false}
            controlledGlobalFilter={globalFilter}
            onControlledGlobalFilterChange={setGlobalFilter}
            paginationResetKey={emailFilter}
            emptyLabel={t('common.noRecords')}
            getRowId={row => row.id}
            rowClassName="min-h-12 h-auto whitespace-normal"
            className="w-full max-w-full min-w-0"
          />
        </div>
      </div>
      <DeleteConfirmationModal
        open={deleteId != null}
        onOpenChange={(open) => {
          if (!open) setDeleteId(null);
        }}
        recordId={deleteId ?? ''}
        onConfirm={onConfirmDelete}
      />
    </TailoringListShell>
  );
}
