import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export type RoleId = string;

export interface Role {
  id: RoleId;
  name: string;
  order: number;
}

const STORAGE_KEY = 'oneboss-custom-roles';

const DEFAULT_ROLES: Role[] = [
  { id: 'super-admin', name: 'Super Administrator', order: 0 },
  { id: 'admin', name: 'Administrator', order: 1 },
  { id: 'admin-assistant', name: 'Administrator Assistant', order: 2 },
];

function loadRoles(): Role[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_ROLES;
    const parsed = JSON.parse(raw) as Role[];
    if (!Array.isArray(parsed) || parsed.length === 0) return DEFAULT_ROLES;
    const superAdmin = parsed.find((r) => r.id === 'super-admin');
    if (!superAdmin) return DEFAULT_ROLES;
    return parsed.sort((a, b) => a.order - b.order);
  } catch {
    return DEFAULT_ROLES;
  }
}

function saveRoles(roles: Role[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(roles));
}

interface RoleContextType {
  roles: Role[];
  rolesOrdered: Role[];
  getRoleById: (id: RoleId) => Role | undefined;
  getRoleOrder: (id: RoleId) => number;
  isRoleBelow: (roleA: RoleId, roleB: RoleId) => boolean;
  addRole: (name: string) => Role;
  updateRole: (id: RoleId, name: string) => void;
  removeRole: (id: RoleId) => void;
  moveRole: (id: RoleId, newOrder: number) => void;
  getRolesBelow: (roleId: RoleId) => Role[];
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [roles, setRoles] = useState<Role[]>(() => loadRoles());

  useEffect(() => {
    saveRoles(roles);
  }, [roles]);

  const rolesOrdered = [...roles].sort((a, b) => a.order - b.order);

  const getRoleById = useCallback(
    (id: RoleId) => roles.find((r) => r.id === id),
    [roles]
  );

  const getRoleOrder = useCallback(
    (id: RoleId) => getRoleById(id)?.order ?? 999,
    [getRoleById]
  );

  const isRoleBelow = useCallback(
    (roleA: RoleId, roleB: RoleId) => getRoleOrder(roleA) > getRoleOrder(roleB),
    [getRoleOrder]
  );

  const addRole = useCallback((name: string) => {
    const trimmed = name.trim();
    if (!trimmed) throw new Error('Role name is required');
    const maxOrder = Math.max(...roles.map((r) => r.order), -1);
    const newId = `role-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const newRole: Role = { id: newId, name: trimmed, order: maxOrder + 1 };
    setRoles((prev) => [...prev, newRole].sort((a, b) => a.order - b.order));
    return newRole;
  }, [roles]);

  const updateRole = useCallback((id: RoleId, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (id === 'super-admin') return;
    setRoles((prev) =>
      prev.map((r) => (r.id === id ? { ...r, name: trimmed } : r))
    );
  }, []);

  const removeRole = useCallback((id: RoleId) => {
    if (id === 'super-admin') return;
    setRoles((prev) => prev.filter((r) => r.id !== id));
  }, []);

  const moveRole = useCallback((id: RoleId, newOrder: number) => {
    if (id === 'super-admin') return;
    setRoles((prev) => {
      const sorted = [...prev].sort((a, b) => a.order - b.order);
      const idx = sorted.findIndex((r) => r.id === id);
      if (idx === -1) return prev;
      const clamped = Math.max(1, Math.min(newOrder, sorted.length - 1));
      if (clamped === idx) return prev;
      const removed = sorted.filter((_, i) => i !== idx);
      const inserted = [...removed.slice(0, clamped), sorted[idx], ...removed.slice(clamped)];
      return inserted.map((r, i) => ({ ...r, order: i }));
    });
  }, []);

  const getRolesBelow = useCallback(
    (roleId: RoleId) => {
      const order = getRoleOrder(roleId);
      return rolesOrdered.filter((r) => r.order > order);
    },
    [rolesOrdered, getRoleOrder]
  );

  const value: RoleContextType = {
    roles,
    rolesOrdered,
    getRoleById,
    getRoleOrder,
    isRoleBelow,
    addRole,
    updateRole,
    removeRole,
    moveRole,
    getRolesBelow,
  };

  return (
    <RoleContext.Provider value={value}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RoleProvider');
  }
  return context;
}
