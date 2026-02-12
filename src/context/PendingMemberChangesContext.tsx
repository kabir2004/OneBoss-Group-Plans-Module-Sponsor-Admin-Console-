import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { RepDetails } from '@/data/representativeDetails';

/** Proposed edits for a representative (subset of RepDetails; nested objects are partial). */
export type ProposedMemberEdits = Partial<{
  id: string;
  nrdNumber: string;
  surname: string;
  name: string;
  dateOfBirth: string;
  mr72OnFile: string;
  mr72OnFileDate: string;
  businessName: string;
  federalBN: string;
  provincialBN: string;
  startDate: string;
  endDate: string;
  serviceLevel: string;
  note: string;
  officeContact: Partial<RepDetails['officeContact']>;
  homeContact: Partial<RepDetails['homeContact']>;
  dealerMaximums: string;
  managerMaximums: string;
  officeAddress: Partial<RepDetails['officeAddress']>;
  residentialAddress: Partial<RepDetails['residentialAddress']>;
  officeMailingAddress: Partial<RepDetails['officeMailingAddress']>;
  residentialMailingAddress: Partial<RepDetails['residentialMailingAddress']>;
}>;

export type PendingStatus = 'submitted';

/** Role that submitted the pending change: Admin Assistant → Admin or Super Admin approves; Admin → Super Admin only approves. */
export type SubmitterRole = 'admin' | 'admin-assistant' | 'super-admin';

export type PendingChange = {
  status: PendingStatus;
  proposed: ProposedMemberEdits;
  /** Who submitted; determines who can approve (admin-assistant → admin/super-admin; admin → super-admin only). */
  submittedByRole?: SubmitterRole;
  rejectedComment?: string;
};

type ContextType = {
  /** Representative ID -> pending change (submitted for review). */
  pendingByRep: Record<string, PendingChange>;
  /** Representative ID -> applied edits (approved or Super Admin direct). Merged on top of base details. */
  appliedEditsByRep: Record<string, ProposedMemberEdits>;
  /** IDs of representatives that have submitted pending changes (for badge). */
  repIdsWithPendingChanges: string[];
  submitPending: (repId: string, proposed: ProposedMemberEdits, submittedByRole?: SubmitterRole) => void;
  approvePending: (repId: string) => void;
  rejectPending: (repId: string, comment: string) => void;
  applyDirectEdits: (repId: string, proposed: ProposedMemberEdits) => void;
  getEffectiveDetails: (base: RepDetails) => RepDetails;
  getPendingForRep: (repId: string) => PendingChange | null;
};

function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T> | undefined): T {
  if (!source) return target;
  const out = { ...target };
  for (const key of Object.keys(source) as (keyof T)[]) {
    const s = source[key];
    if (s === undefined) continue;
    const t = out[key];
    if (t != null && typeof t === 'object' && !Array.isArray(t) && typeof s === 'object' && !Array.isArray(s)) {
      (out as Record<string, unknown>)[key as string] = deepMerge(
        t as Record<string, unknown>,
        s as Record<string, unknown>
      );
    } else {
      (out as Record<string, unknown>)[key as string] = s;
    }
  }
  return out;
}

const PendingMemberChangesContext = createContext<ContextType | undefined>(undefined);

export function PendingMemberChangesProvider({ children }: { children: ReactNode }) {
  const [pendingByRep, setPendingByRep] = useState<Record<string, PendingChange>>({});
  const [appliedEditsByRep, setAppliedEditsByRep] = useState<Record<string, ProposedMemberEdits>>({});

  const repIdsWithPendingChanges = Object.keys(pendingByRep);

  const submitPending = useCallback((repId: string, proposed: ProposedMemberEdits, submittedByRole?: SubmitterRole) => {
    setPendingByRep((prev) => ({
      ...prev,
      [repId]: { status: 'submitted', proposed, submittedByRole },
    }));
  }, []);

  const approvePending = useCallback((repId: string) => {
    setPendingByRep((prev) => {
      const pending = prev[repId];
      if (!pending) return prev;
      setAppliedEditsByRep((a) => ({
        ...a,
        [repId]: deepMerge(a[repId] ?? {}, pending.proposed) as ProposedMemberEdits,
      }));
      const next = { ...prev };
      delete next[repId];
      return next;
    });
  }, []);

  const rejectPending = useCallback((repId: string, comment: string) => {
    setPendingByRep((prev) => {
      const next = { ...prev };
      const existing = next[repId];
      if (existing) next[repId] = { ...existing, rejectedComment: comment };
      delete next[repId];
      return next;
    });
  }, []);

  const applyDirectEdits = useCallback((repId: string, proposed: ProposedMemberEdits) => {
    setAppliedEditsByRep((prev) => ({
      ...prev,
      [repId]: deepMerge(prev[repId] ?? {}, proposed) as ProposedMemberEdits,
    }));
  }, []);

  const getEffectiveDetails = useCallback(
    (base: RepDetails): RepDetails => {
      const repId = base.id;
      const applied = appliedEditsByRep[repId];
      if (!applied) return base;
      return deepMerge(base, applied) as RepDetails;
    },
    [appliedEditsByRep]
  );

  const getPendingForRep = useCallback(
    (repId: string): PendingChange | null => pendingByRep[repId] ?? null,
    [pendingByRep]
  );

  const value: ContextType = {
    pendingByRep,
    appliedEditsByRep,
    repIdsWithPendingChanges,
    submitPending,
    approvePending,
    rejectPending,
    applyDirectEdits,
    getEffectiveDetails,
    getPendingForRep,
  };

  return (
    <PendingMemberChangesContext.Provider value={value}>
      {children}
    </PendingMemberChangesContext.Provider>
  );
}

export function usePendingMemberChanges() {
  const ctx = useContext(PendingMemberChangesContext);
  if (ctx === undefined) {
    throw new Error('usePendingMemberChanges must be used within PendingMemberChangesProvider');
  }
  return ctx;
}
