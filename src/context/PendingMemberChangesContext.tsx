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
  /** When the change was submitted (ISO string). */
  submittedAt?: string;
  rejectedComment?: string;
};

/** Outcome of a review shown to the submitter: which fields were accepted vs rejected (with reasons). */
export type ReviewOutcome = {
  submittedAt?: string;
  /** Role that submitted the change; widget is only shown to the user with this role. */
  submittedByRole?: SubmitterRole;
  accepted: { fieldKey: string; label: string }[];
  rejected: { fieldKey: string; label: string; reason: string }[];
};

type ContextType = {
  /** Representative ID -> pending change (submitted for review). */
  pendingByRep: Record<string, PendingChange>;
  /** Representative ID -> applied edits (approved or Super Admin direct). Merged on top of base details. */
  appliedEditsByRep: Record<string, ProposedMemberEdits>;
  /** Representative ID -> last review outcome (for submitter to see what was accepted/rejected). */
  lastReviewOutcomeByRep: Record<string, ReviewOutcome>;
  /** IDs of representatives that have submitted pending changes (for badge). */
  repIdsWithPendingChanges: string[];
  submitPending: (repId: string, proposed: ProposedMemberEdits, submittedByRole?: SubmitterRole) => void;
  approvePending: (repId: string, outcome?: ReviewOutcome) => void;
  /** Apply only a subset of the pending proposed edits (e.g. only approved fields), then clear pending. */
  approvePendingPartial: (repId: string, partialProposed: ProposedMemberEdits, outcome: ReviewOutcome) => void;
  rejectPending: (repId: string, comment: string) => void;
  applyDirectEdits: (repId: string, proposed: ProposedMemberEdits) => void;
  getEffectiveDetails: (base: RepDetails) => RepDetails;
  getPendingForRep: (repId: string) => PendingChange | null;
  getReviewOutcomeForRep: (repId: string) => ReviewOutcome | null;
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
  const [lastReviewOutcomeByRep, setLastReviewOutcomeByRep] = useState<Record<string, ReviewOutcome>>({});

  const repIdsWithPendingChanges = Object.keys(pendingByRep);

  const submitPending = useCallback((repId: string, proposed: ProposedMemberEdits, submittedByRole?: SubmitterRole) => {
    setLastReviewOutcomeByRep((prev) => {
      const next = { ...prev };
      delete next[repId];
      return next;
    });
    setPendingByRep((prev) => ({
      ...prev,
      [repId]: {
        status: 'submitted',
        proposed,
        submittedByRole,
        submittedAt: new Date().toISOString(),
      },
    }));
  }, []);

  const approvePending = useCallback((repId: string, outcome?: ReviewOutcome) => {
    setPendingByRep((prev) => {
      const pending = prev[repId];
      if (!pending) return prev;
      if (outcome) {
        setLastReviewOutcomeByRep((o) => ({ ...o, [repId]: outcome }));
      }
      setAppliedEditsByRep((a) => ({
        ...a,
        [repId]: deepMerge(a[repId] ?? {}, pending.proposed) as ProposedMemberEdits,
      }));
      const next = { ...prev };
      delete next[repId];
      return next;
    });
  }, []);

  const approvePendingPartial = useCallback((repId: string, partialProposed: ProposedMemberEdits, outcome: ReviewOutcome) => {
    setPendingByRep((prev) => {
      if (!prev[repId]) return prev;
      setLastReviewOutcomeByRep((o) => ({ ...o, [repId]: outcome }));
      setAppliedEditsByRep((a) => ({
        ...a,
        [repId]: deepMerge(a[repId] ?? {}, partialProposed) as ProposedMemberEdits,
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

  const getReviewOutcomeForRep = useCallback(
    (repId: string): ReviewOutcome | null => lastReviewOutcomeByRep[repId] ?? null,
    [lastReviewOutcomeByRep]
  );

  const value: ContextType = {
    pendingByRep,
    appliedEditsByRep,
    lastReviewOutcomeByRep,
    repIdsWithPendingChanges,
    submitPending,
    approvePending,
    approvePendingPartial,
    rejectPending,
    applyDirectEdits,
    getEffectiveDetails,
    getPendingForRep,
    getReviewOutcomeForRep,
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
