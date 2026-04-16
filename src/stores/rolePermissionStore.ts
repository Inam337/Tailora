import { create } from 'zustand';

interface RolePermissionState {
  userMenuPermissions: unknown;
  isLoadingUserPermissions: boolean;
  hasFetchedUserPermissions: boolean;
  fetchUserMenuPermissions: () => Promise<void>;
  resetUserPermissionsFetch: () => void;
}

export const useRolePermissionStore = create<RolePermissionState>(set => ({
  userMenuPermissions: null,
  isLoadingUserPermissions: false,
  hasFetchedUserPermissions: false,
  fetchUserMenuPermissions: async () => {
    set({ isLoadingUserPermissions: true });
    await Promise.resolve();
    set({
      isLoadingUserPermissions: false,
      hasFetchedUserPermissions: true,
    });
  },
  resetUserPermissionsFetch: () => {
    set({
      hasFetchedUserPermissions: false,
      isLoadingUserPermissions: false,
    });
  },
}));
