import React, { createContext, useContext, ReactNode } from 'react';
import { useInterface } from '@/context/InterfaceContext';
import type { InterfaceType } from '@/components/InterfaceSwitcher';

export type Role = InterfaceType; // 'super-admin' | 'admin' | 'admin-assistant'

interface RolePermissionsContextType {
  role: Role;
  /** Admin Assistant: false. Admin + Super Admin: true. */
  canManageUsers: boolean;
  /** All roles can view Users & Access and member details (Assistant can submit edits for approval). */
  canViewUsersAccess: boolean;
  /** Admin Assistant: false (no configure). Admin + Super Admin: true. */
  canConfigure: boolean;
  /** Admin Assistant: false. Admin + Super Admin: true (approve changes). */
  canApproveChanges: boolean;
  /** All roles can view members and edit tombstone info. */
  canEditTombstone: boolean;
  /** Only Super Admin can manage admins (e.g. edit Super Admin/Admin roles). */
  canManageAdmins: boolean;
  /** Super Admin has full control. */
  isSuperAdmin: boolean;
  isAdmin: boolean;
  isAdminAssistant: boolean;
}

const RolePermissionsContext = createContext<RolePermissionsContextType | undefined>(undefined);

export function RolePermissionsProvider({ children }: { children: ReactNode }) {
  const { currentInterface } = useInterface();
  const role = currentInterface;

  const isSuperAdmin = role === 'super-admin';
  const isAdmin = role === 'admin';
  const isAdminAssistant = role === 'admin-assistant';

  const canManageUsers = isSuperAdmin || isAdmin;
  const canViewUsersAccess = true;
  const canConfigure = isSuperAdmin || isAdmin;
  const canApproveChanges = isSuperAdmin || isAdmin;
  const canEditTombstone = true;
  const canManageAdmins = isSuperAdmin;

  const value: RolePermissionsContextType = {
    role,
    canManageUsers,
    canViewUsersAccess,
    canConfigure,
    canApproveChanges,
    canEditTombstone,
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
