import { useState, useEffect, useRef, useCallback, memo } from 'react';
import type { ColumnDef } from '@tanstack/react-table';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import Card from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/libs/utils';
import { AppConstants } from '@/common/AppConstants';
import type {
  UserListItem,
} from '@/models/User';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { IconColors } from '@/components/icons/types/RbIcon.types';
import { DataTable } from '@/components/ui/DataTable';
import SuspenseLoading from '@/components/ui/SuspenseLoading';
import VerticalDots from '@/components/ui/vertical-dots';
import { RbIcon } from '@/components/icons/common/RbIcon';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/Tooltip';
import { UserStatus, UserTypeValues } from '@/models/User';
import { BadgeStyles } from '@/models/Role';
import InsightsCard, {
  type InsightsCardVariant,
  INSIGHTS_CARD_VARIANT_ICON_HEX,
} from '@/components/app/InsightsCard';
import { useUserStore } from '@/stores/userStore';
import { useRolePermissionStore } from '@/stores/rolePermissionStore';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  branch?: string;
  role: string;
  status: string;
  createdAt: Date;
  type: string;
}

interface FilterState {
  searchQuery: string;
  statusFilter: string;
  activeTab: string;
}

interface PaginationState {
  currentPage: number;
  pageSize: number;
}

const ACTION_ICON_SIZE = 16;
const SEARCH_ICON_SIZE = 32;
// React 19 optimized component with memo
const UserList = memo(function UserList() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const paginationNameSpace = 'pages.common.pagination';
  // Use store instead of local state
  const {
    userList,
    totalCount,
    pageSize: storePageSize,
    isLoading,
    error,
    statistics,
    isLoadingStatistics,
    statisticsError,
    fetchUserList,
    fetchUserStatistics,
    changeUserStatus,
    clearError,
  } = useUserStore();
  // Permission checks - Users List (Menu 2, SubMenu 2)
  const { hasPermission } = useRolePermissionStore();
  const canUpdateUser = hasPermission(2, 2, 'update');
  const canDeleteUser = hasPermission(2, 2, 'delete');
  // Check if any actions are available
  const hasAnyAction = canUpdateUser || canDeleteUser;
  // Local UI state
  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    statusFilter: '',
    activeTab: UserTypeValues.OFFICERS,
  });
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    pageSize: 10,
  });
  const [openDropdownId, setOpenDropdownId] = useState<number>(null);
  const [activatingUsers, setActivatingUsers] = useState<Set<number>>(new Set());
  const [dataRefreshKey, setDataRefreshKey] = useState<number>(0);
  const abortControllerRef = useRef<AbortController>(null);
  // Load user statistics using store
  const loadUserStatistics = useCallback(async () => {
    try {
      await fetchUserStatistics();
    } catch (error) {
      toast.error(t('pages.users.list.failedToLoadStats'));
    }
  }, [fetchUserStatistics, t]);
  // Load user list using store
  const loadUserList = useCallback(async () => {
    const hasValidSearchQuery = filters.searchQuery && filters.searchQuery.trim().length >= 3;
    const hasStatusFilter = filters.statusFilter && filters.statusFilter !== '';
    const shouldMakeApiCall = hasValidSearchQuery || hasStatusFilter || !filters.searchQuery;

    if (!shouldMakeApiCall) {
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    try {
      await fetchUserList({
        page: pagination.currentPage,
        pageSize: pagination.pageSize,
        searchTerm: filters.searchQuery || undefined,
        statusFilter:
          filters.statusFilter === UserStatus.ACTIVE
            ? true
            : filters.statusFilter === UserStatus.INACTIVE
              ? false
              : undefined,
        userType: filters.activeTab === UserTypeValues.MANAGERS ? 0 : 1,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        return;
      }

      const errorMessage = error instanceof Error
        ? error.message
        : 'Failed to fetch user list';

      toast.error(errorMessage);
    }
  }, [filters.activeTab, filters.statusFilter, filters.searchQuery,
    pagination.currentPage, pagination.pageSize, fetchUserList]);

  // Effects
  useEffect(() => {
    loadUserStatistics();
  }, [loadUserStatistics]);
  useEffect(() => {
    loadUserList();
  }, [filters.activeTab, filters.statusFilter, filters.searchQuery,
    pagination.currentPage, pagination.pageSize, loadUserList]);
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  // Transform API data to component format
  const transformedUsers = useCallback(() => {
    return (
      userList.map((apiUser: UserListItem) => ({
        id: apiUser.id,
        name: apiUser.fullName,
        email: apiUser.email,
        phone: apiUser.mobile || '',
        branch: apiUser.branch || '',
        role: apiUser.role || 'user',
        status: apiUser.status,
        createdAt: new Date(),
        type: filters.activeTab,
      }))
    );
  }, [userList, filters.activeTab]);
  const filteredUsers = transformedUsers();
  // Status badge component
  const getStatusBadge = useCallback(
    (status: string, userId?: number) => {
      const statusLower = status.toLowerCase();
      const isActive = statusLower === UserStatus.ACTIVE
        || statusLower === '1'
        || statusLower === 'true';
      const displayText = isActive
        ? t('pages.users.list.status.active')
        : t('pages.users.list.status.inactive');
      const isUpdating = userId && activatingUsers.has(userId);

      return (
        <div className="flex items-center gap-2">
          <Badge
            className={cn(
              isActive
                ? BadgeStyles.ACTIVE
                : BadgeStyles.INACTIVE,
              isUpdating && 'opacity-50',
            )}
          >
            {displayText}
          </Badge>
          {isUpdating && (
            <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600" />
          )}
        </div>
      );
    },
    [activatingUsers, t],
  );
  // Column definitions
  const baseColumns: ColumnDef<User>[] = [
    {
      accessorKey: 'name',
      header: t('pages.users.list.columns.fullName'),
      enableSorting: true,
      size: 180,
      minSize: 150,
      maxSize: 250,
      meta: {
        className: 'min-w-[150px] max-w-[250px] w-[180px]',
      },
    },
    {
      accessorKey: 'email',
      header: t('pages.users.list.columns.email'),
      enableSorting: false,
      size: 200,
      minSize: 180,
      maxSize: 280,
      meta: {
        className: 'min-w-[180px] max-w-[280px] w-[200px]',
      },
    },
    {
      accessorKey: 'phone',
      header: t('pages.users.list.columns.phoneNumber'),
      enableSorting: false,
      size: 140,
      minSize: 120,
      maxSize: 180,
      meta: {
        className: 'min-w-[120px] max-w-[180px] w-[140px]',
      },
    },
    {
      accessorKey: 'branch',
      header: t('pages.users.list.columns.branch'),
      enableSorting: false,
      size: 160,
      minSize: 140,
      maxSize: 220,
      meta: {
        className: 'min-w-[140px] max-w-[220px] w-[160px]',
      },
      cell: ({ row }) => {
        const branchValue = row.getValue('branch') as string;
        const displayText = branchValue || '-';

        return (
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="truncate max-w-full"
                title={displayText}
              >
                {displayText}
              </div>
            </TooltipTrigger>
            {displayText !== '-' && (
              <TooltipContent>
                <p className="max-w-xs wrap-break-word">{displayText}</p>
              </TooltipContent>
            )}
          </Tooltip>
        );
      },
    },
    {
      accessorKey: 'role',
      header: t('pages.users.list.columns.role'),
      enableSorting: false,
      size: 140,
      minSize: 120,
      maxSize: 180,
      meta: {
        className: 'min-w-[120px] max-w-[180px] w-[140px]',
      },
    },
    {
      accessorKey: 'status',
      header: t('pages.users.list.columns.status'),
      enableSorting: true,
      size: 120,
      minSize: 100,
      maxSize: 150,
      meta: {
        className: 'min-w-[100px] max-w-[150px] w-[120px]',
      },
      cell: ({ row }) => getStatusBadge(row.getValue('status'), row.original.id),
    },
  ];
  const columns: ColumnDef<User>[] = [
    ...(hasAnyAction
      ? [{
          id: 'actions',
          header: t('pages.users.list.columns.action'),
          enableSorting: false,
          size: 80,
          minSize: 70,
          maxSize: 100,
          meta: {
            className: 'min-w-[70px] max-w-[100px] w-[80px]',
          },
          cell: ({ row }) => {
            const user = row.original;

            return (
              <div className="flex items-start justify-start space-x-2">
                <DropdownMenu
                  open={openDropdownId === user.id}
                  onOpenChange={open => setOpenDropdownId(open ? user.id : null)}
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
                    {filters.activeTab === UserTypeValues.OFFICERS && canUpdateUser && (
                      <DropdownMenuItem
                        onClick={() => {
                          navigate(`${AppConstants.Routes.Private.Users.EDIT}/${user.id}`);
                          setOpenDropdownId(null);
                        }}
                        className="cursor-pointer hover:bg-gray-100"
                      >
                        <RbIcon
                          name="edit"
                          size={ACTION_ICON_SIZE}
                          color={IconColors.BLACK_COLOR_ICON}
                        />
                        {t('pages.users.list.actions.edit')}
                      </DropdownMenuItem>
                    )}
                    {canDeleteUser && (
                      <DropdownMenuItem
                        onClick={() => handleUserActivation(user)}
                        className={cn(
                          'cursor-pointer hover:bg-gray-100',
                          activatingUsers.has(user.id) && 'opacity-50 cursor-not-allowed',
                        )}
                        disabled={activatingUsers.has(user.id)}
                      >
                        {activatingUsers.has(user.id)
                          ? (
                              <div className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2
                             border-blue-600"
                                />
                                <span className="text-gray-700 font-medium">
                                  {t('pages.users.list.actions.updating')}
                                </span>
                              </div>
                            )
                          : (
                              <>
                                <RbIcon
                                  name={
                                    (() => {
                                      const statusLower = user.status.toLowerCase();
                                      const isActive = statusLower === UserStatus.ACTIVE
                                        || statusLower === '1'
                                        || statusLower === 'true';

                                      return isActive
                                        ? 'userBlock'
                                        : 'userActive';
                                    })()
                                  }
                                  size={ACTION_ICON_SIZE}
                                  color={IconColors.BLACK_COLOR_ICON}
                                />
                                {(() => {
                                  const statusLower = user.status.toLowerCase();
                                  const isActive = statusLower === UserStatus.ACTIVE
                                    || statusLower === '1' || statusLower === 'true';

                                  return isActive
                                    ? t('pages.users.list.actions.deactivate')
                                    : t('pages.users.list.actions.activate');
                                })()}
                              </>
                            )}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            );
          },
        }]
      : []),
    ...baseColumns,
  ]; // Event handlers - using store
  const handleUserActivation = useCallback(
    async (user: User) => {
      const userId = user.id;
      const statusLower = user.status.toLowerCase();
      const isCurrentlyActive = statusLower === UserStatus.ACTIVE
        || statusLower === '1'
        || statusLower === 'true';
      const newActiveStatus = !isCurrentlyActive;

      try {
        setActivatingUsers(prev => new Set(prev).add(userId));
        setOpenDropdownId(null);

        await changeUserStatus(userId, newActiveStatus);

        toast.success(newActiveStatus
          ? t('pages.users.list.messages.userActivated')
          : t('pages.users.list.messages.userDeactivated'));

        setDataRefreshKey(prev => prev + 1);
      } catch (error) {
        toast.error((newActiveStatus
          ? t('pages.users.list.messages.errorActivating')
          : t('pages.users.list.messages.errorDeactivating'))
        + `: ${error instanceof Error ? error.message : 'Unknown error'}`);
      } finally {
        setActivatingUsers((prev) => {
          const newSet = new Set(prev);

          newSet.delete(userId);

          return newSet;
        });
      }
    },
    [changeUserStatus, t],
  );
  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  }, []);
  const handleFilterChange = useCallback(
    (key: keyof FilterState, value: string) => {
      setFilters(prev => ({ ...prev, [key]: value }));

      if (key === 'searchQuery' || key === 'statusFilter'
        || key === 'activeTab') {
        setPagination(prev => ({ ...prev, currentPage: 1 }));
      }
    },
    [],
  );

  // Clear error when component unmounts
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Loading states
  if (isLoading && userList.length === 0) {
    return (
      <div className="fixed top-0 left-0 w-full inset-0 bg-blue-100/20
      h-screen flex items-center justify-center z-60"
      >
        <SuspenseLoading size="lg" />
      </div>
    );
  }

  // Format numbers for display
  const formatNumber = (num: number | undefined | null) => {
    if (num === undefined || num === null || Number.isNaN(num)) {
      return '0';
    }

    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }

    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }

    return num.toString();
  };

  return (
    <div className="p-4">
      <div className="space-y-6">

        {/* Subtitle */}
        <p className="text-sm text-gray-600 mb-4">
          {t('pages.users.list.subtitle')}
        </p>

        {/* Statistics Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {isLoadingStatistics
            ? (
                <>
                  {[1, 2, 3].map(index => (
                    <div
                      key={index}
                      className="animate-pulse"
                    >
                      <div className="w-full h-28 rounded-xl p-4 bg-white border-gray-200
                      animate-pulse flex flex-row justify-between"
                      >
                        <div className="flex flex-col gap-2">
                          <div className="h-4 w-28 bg-gray-300 rounded"></div>
                          <div className="h-6 w-16 bg-gray-300 rounded mt-2"></div>
                        </div>
                        <div className="h-8 w-8 bg-gray-300 rounded-md self-start"></div>
                      </div>
                    </div>
                  ))}
                </>
              )
            : statisticsError
              ? (
                  <div className="col-span-2 text-center py-8">
                    <p className="text-red-600 mb-2">
                      {t('pages.users.list.failedToLoadStats')}
                    </p>
                    <p className="text-gray-500 text-sm">{statisticsError}</p>
                  </div>
                )
              : statistics
                ? (

                    <>
                      {(
                        [
                          {
                            variant: 'blue' as InsightsCardVariant,
                            titleKey: 'pages.users.list.totalUsers',
                            titleFallback: undefined,
                            value: formatNumber(statistics.totalUsers),
                            iconName: 'user' as const,
                          },
                          {
                            variant: 'amber' as InsightsCardVariant,
                            titleKey: 'pages.users.list.activeUsers',
                            titleFallback: 'Active Users',
                            value: formatNumber(statistics.activeUsers),
                            iconName: 'userActive' as const,
                          },
                          {
                            variant: 'green' as InsightsCardVariant,
                            titleKey: 'pages.users.list.inactiveUsers',
                            titleFallback: 'Inactive Users',
                            value: formatNumber(statistics.inactiveUsers),
                            iconName: 'userBlock' as const,
                          },
                        ] as const
                      ).map(({ variant, titleKey, titleFallback, value, iconName }) => (
                        <InsightsCard
                          key={variant}
                          title={t(titleKey as string, titleFallback as string)}
                          value={value}
                          icon={(
                            <RbIcon
                              name={iconName}
                              size={24}
                              color={INSIGHTS_CARD_VARIANT_ICON_HEX[variant]}
                            />
                          )}
                          variant={variant}
                        />
                      ))}
                    </>

                  )
                : null}
        </div>

        {/* Main Content Card */}
        <Card className="py-0 gap-2">
          {/* Search Bar */}
          <div className="w-full flex justify-end items-center p-2">
            <div className="relative">
              <Input
                placeholder={t('pages.users.list.searchPlaceholder')}
                value={filters.searchQuery}
                onChange={(e) => {
                  const value = e.target.value;
                  const hasThreeConsecutiveSpaces = /\s{3,}/.test(value);

                  if (hasThreeConsecutiveSpaces) {
                    return;
                  }

                  if (value.startsWith(' ')) {
                    return;
                  }

                  handleFilterChange('searchQuery', value);
                }}
                className="rounded-lg border border-gray-300 bg-white pr-10 w-80"
              />
              {filters.searchQuery
                ? (
                    <button
                      type="button"
                      onClick={() => handleFilterChange('searchQuery', '')}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2
                               text-gray-400 cursor-pointer
                  hover:text-gray-600"
                      title="Clear search"
                    >
                      <RbIcon
                        name="close"
                        size={12}
                        color={IconColors.BLACK_COLOR_ICON}
                      />
                    </button>
                  )
                : (
                    <RbIcon
                      name="search"
                      size={16}
                      color={IconColors.BLACK_COLOR_ICON}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    />
                  )}
            </div>
          </div>
          <div className="p-0 rounded-none min-h-[calc(100vh-285px)]">
            {isLoading
              ? (
                  <div className="fixed inset-0 bg-white/60 z-60 w-full flex flex-col
                     justify-center items-center h-screen"
                  >
                    <SuspenseLoading size="lg" />
                  </div>
                )
              : error
                ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-red-600 mb-2">
                          {t('pages.users.list.errorLoading')}
                        </h3>
                        <p className="text-gray-500 mb-4">{error}</p>
                        <Button
                          onClick={() => loadUserList()}
                          variant="outline"
                          className="text-sm"
                        >
                          {t('pages.users.list.retry')}
                        </Button>
                      </div>
                    </div>
                  )
                : (
                    <>
                      {filteredUsers.length === 0 && filters.searchQuery && (
                        <div className="flex items-center justify-center h-64">
                          <div className="w-full flex items-center flex-col justify-center
                         text-center"
                          >
                            <RbIcon
                              name="search"
                              size={SEARCH_ICON_SIZE}
                              color={IconColors.GRAY_COLOR_ICON}
                              className="mx-auto mb-4 opacity-50"
                            />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {t('pages.users.list.noUsersFound')}
                            </h3>
                            <p className="text-gray-500 mb-4 text-base">
                              {t('pages.users.list.noUsersFoundMessage', {
                                searchQuery: filters.searchQuery,
                              })}
                            </p>
                            <div className="w-full flex items-center flex-col justify-center
                          text-center"
                            >
                              <Button
                                onClick={() => {
                                  setFilters(prev => ({ ...prev, searchQuery: '' }));
                                  setPagination(prev => ({ ...prev, currentPage: 1 }));
                                }}
                                variant="outline"
                                className="text-sm w-40"
                              >
                                {t('pages.users.list.clearSearch')}
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {filteredUsers.length > 0 && (
                        <DataTable
                          key={dataRefreshKey}
                          columns={columns}
                          data={filteredUsers}
                          showPagination={false}
                          showSearch={false}
                          itemsPerPage={storePageSize || 10}
                          className=""
                        />
                      )}

                      {/* Pagination Controls */}
                      {totalCount !== undefined && (
                        <div className="flex flex-col sm:flex-row items-center justify-center
                       sm:justify-between
                          px-1 sm:px-4 py-3 sm:py-4 border-t border-gray-200 gap-3 sm:gap-4"
                        >
                          <div className="flex items-center text-xs sm:text-sm text-gray-500
                        text-center"
                          >
                            <span className="wrap-break-word">
                              {totalCount > 0
                                ? filters.searchQuery
                                  ? t(`${paginationNameSpace}.pageInfoWithSearch`, {
                                      current: pagination.currentPage,
                                      total: Math.ceil(totalCount / pagination.pageSize),
                                      searchTerm: filters.searchQuery,
                                    })
                                  : t(`${paginationNameSpace}.pageInfo`, {
                                      current: pagination.currentPage,
                                      total: Math.ceil(totalCount / pagination.pageSize),
                                    })
                                : filters.searchQuery
                                  ? t(`${paginationNameSpace}.noResultsWithSearch`, {
                                      searchTerm: filters.searchQuery,
                                    })
                                  : t(`${paginationNameSpace}.noResults`)}
                            </span>
                          </div>

                          {totalCount > 0 && (
                            <div className="flex flex-row items-center justify-center
                             space-x-1 flex-wrap gap-1 w-full sm:w-auto"
                            >
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(1)}
                                disabled={pagination.currentPage <= 1 || isLoading}
                                className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100
                                  text-blue-700 border-blue-300 disabled:opacity-50
                                  disabled:cursor-not-allowed h-7 px-2 text-xs min-w-[45px]"
                                title={t(`${paginationNameSpace}.first`)}
                              >
                                <span className="text-xs">
                                  {t(`${paginationNameSpace}.first`)}
                                </span>
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(Math.max(1,
                                  pagination.currentPage - 1))}
                                disabled={pagination.currentPage <= 1 || isLoading}
                                className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100
                                  text-blue-700 border-blue-300 disabled:opacity-50
                                  disabled:cursor-not-allowed h-7 px-2 text-xs min-w-[50px]"
                              >
                                <span className="text-xs">
                                  {t(`${paginationNameSpace}.prev`)}
                                </span>
                              </Button>

                              <div className="flex items-center space-x-1">
                                <span className="text-xs text-gray-500 whitespace-nowrap
                              hidden sm:inline"
                                >
                                  {t(`${paginationNameSpace}.goTo`)}
                                </span>
                                <Select
                                  value={pagination.currentPage.toString()}
                                  onValueChange={value => handlePageChange(parseInt(value))}
                                  disabled={isLoading}
                                >
                                  <SelectTrigger
                                    className="w-14 h-7 px-2 text-xs bg-white border-blue-300
                                    focus:ring-1 focus:ring-blue-200"
                                  >
                                    <SelectValue placeholder="1" />
                                  </SelectTrigger>
                                  <SelectContent className="max-h-60">
                                    {Array.from(
                                      {
                                        length: Math.ceil(totalCount / pagination.pageSize),
                                      },
                                      (_, i) => i + 1,
                                    ).map(pageNum => (
                                      <SelectItem
                                        key={pageNum}
                                        value={pageNum.toString()}
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
                                onClick={() => handlePageChange(pagination.currentPage + 1)}
                                disabled={
                                  pagination.currentPage >= Math.ceil(totalCount
                                    / pagination.pageSize)
                                  || isLoading
                                }
                                className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100
                                  text-blue-700 border-blue-300 disabled:opacity-50
                                  disabled:cursor-not-allowed h-7 px-2 text-xs min-w-[50px]"
                              >
                                <span className="text-xs">
                                  {t(`${paginationNameSpace}.next`)}
                                </span>
                              </Button>

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handlePageChange(Math.ceil(totalCount
                                  / pagination.pageSize))}
                                disabled={
                                  pagination.currentPage >= Math.ceil(totalCount
                                    / pagination.pageSize) || isLoading
                                }
                                className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100
                                  text-blue-700 border-blue-300 disabled:opacity-50
                                  disabled:cursor-not-allowed h-7 px-2 text-xs min-w-[45px]"
                                title={t(`${paginationNameSpace}.last`)}
                              >
                                <span className="text-xs">
                                  {t(`${paginationNameSpace}.last`)}
                                </span>
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </>
                  )}
          </div>
        </Card>
      </div>
    </div>
  );
});

UserList.displayName = 'UserList';

export default UserList;
