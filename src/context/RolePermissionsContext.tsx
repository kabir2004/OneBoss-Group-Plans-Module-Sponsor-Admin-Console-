import React, { createContext, useContext, ReactNode } from 'react';
import { useInterface } from '@/context/InterfaceContext';
import type { InterfaceType } from '@/context/InterfaceContext';
import { useRoles } from '@/context/RoleContext';

export type Role = InterfaceType;

interface RolePermissionsContextType {
  role: Role;
  canManageUsers: boolean;
  canViewUsersAccess: boolean;
  canConfigure: boolean;
  canApproveChanges: boolean;
  canManageAdmins: boolean;
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isAdminAssistant: boolean;
}

const RolePermissionsContext = createContext<RolePermissionsContextType | undefined>(undefined);

export function RolePermissionsProvider({ children }: { children: ReactNode }) {
  const { currentInterface } = useInterface();
  const { getRoleOrder } = useRoles();
  const role = currentInterface;
  const order = getRoleOrder(role);

  const isSuperAdmin = order === 0;
  const isAdmin = order === 1;
  const isAdminAssistant = order >= 2;

  const canManageUsers = isSuperAdmin || isAdminAssistant;
  const canViewUsersAccess = isSuperAdmin || isAdmin; // Admin Assistant cannot see Administrator page
  const canConfigure = isSuperAdmin || isAdminAssistant;
  const canApproveChanges = isSuperAdmin || isAdminAssistant;
  const canManageAdmins = isSuperAdmin;

  const value: RolePermissionsContextType = {
    role,
    canManageUsers,
    canViewUsersAccess,
    canConfigure,
    canApproveChanges,
    canManageAdmins,
    isSuperAdmin,
    isAdmin,
    isAdminAssistant,
  };

  return (
    <RolePermissionsContext.Provider value={value}>
      {children}
    </RolePermissionsContext.Provider>
  );
}

export function useRolePermissions() {
  const context = useContext(RolePermissionsContext);
  if (context === undefined) {
    throw new Error('useRolePermissions must be used within a RolePermissionsProvider');
  }
  return context;
}
