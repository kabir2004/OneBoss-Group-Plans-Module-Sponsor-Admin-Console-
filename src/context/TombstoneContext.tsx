import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { useAuditLog } from '@/context/AuditLogContext';

export type TombstoneFieldChange = {
  fieldName: string;
  oldValue: string;
  newValue: string;
};

export type TombstoneSubmissionStatus = 'pending' | 'approved' | 'rejected';

export type TombstoneSubmission = {
  id: string;
  clientName: string;
  planRef?: string;
  entityType: 'client' | 'plan';
  fieldChanges: TombstoneFieldChange[];
  submittedBy: string;
  submittedAt: string;
  submittedAtISO: string;
  status: TombstoneSubmissionStatus;
  reviewedBy?: string;
  reviewedAt?: string;
};

type TombstoneContextType = {
  submissions: TombstoneSubmission[];
  pendingSubmissions: TombstoneSubmission[];
  submitTombstone: (data: Omit<TombstoneSubmission, 'id' | 'submittedAt' | 'submittedAtISO' | 'status'>) => void;
  approveTombstone: (id: string, reviewedBy: string) => void;
  rejectTombstone: (id: string, reviewedBy: string) => void;
};

const TombstoneContext = createContext<TombstoneContextType | undefined>(undefined);

let idCounter = 1;

function formatTs(date: Date) {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return isToday ? `Today • ${time}` : `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} • ${time}`;
}

function getCurrentUser() {
  return typeof window !== 'undefined' ? (localStorage.getItem('userId') || 'Current User') : 'Current User';
}

export function TombstoneProvider({ children }: { children: ReactNode }) {
  const { addEntry } = useAuditLog();
  const [submissions, setSubmissions] = useState<TombstoneSubmission[]>([]);

  const pendingSubmissions = submissions.filter((s) => s.status === 'pending');

  const submitTombstone = useCallback(
    (data: Omit<TombstoneSubmission, 'id' | 'submittedAt' | 'submittedAtISO' | 'status'>) => {
      const date = new Date();
      const sub: TombstoneSubmission = {
        ...data,
        id: `tomb-${idCounter++}`,
        submittedAt: formatTs(date),
        submittedAtISO: date.toISOString(),
        status: 'pending',
      };
      setSubmissions((prev) => [sub, ...prev]);
      const detail = data.fieldChanges.length
        ? `${data.clientName}${data.planRef ? ` • ${data.planRef}` : ''}: ${data.fieldChanges.map((f) => `${f.fieldName} → ${f.newValue}`).join(', ')}`
        : `${data.clientName}${data.planRef ? ` • ${data.planRef}` : ''}`;
      addEntry({
        action: 'Tombstone edit submitted',
        detail,
        user: data.submittedBy,
        type: 'Tombstone',
      });
    },
    [addEntry]
  );

  const approveTombstone = useCallback(
    (id: string, reviewedBy: string) => {
      const date = new Date();
      let detail = id;
      setSubmissions((prev) => {
        const sub = prev.find((s) => s.id === id);
        if (sub) detail = `${sub.clientName}${sub.planRef ? ` • ${sub.planRef}` : ''}`;
        return prev.map((s) =>
          s.id === id ? { ...s, status: 'approved' as const, reviewedBy, reviewedAt: formatTs(date) } : s
        );
      });
      addEntry({
        action: 'Tombstone edit approved',
        detail,
        user: reviewedBy,
        type: 'Tombstone',
      });
    },
    [addEntry]
  );

  const rejectTombstone = useCallback(
    (id: string, reviewedBy: string) => {
      const date = new Date();
      let detail = id;
      setSubmissions((prev) => {
        const sub = prev.find((s) => s.id === id);
        if (sub) detail = `${sub.clientName}${sub.planRef ? ` • ${sub.planRef}` : ''}`;
        return prev.map((s) =>
          s.id === id ? { ...s, status: 'rejected' as const, reviewedBy, reviewedAt: formatTs(date) } : s
        );
      });
      addEntry({
        action: 'Tombstone edit rejected',
        detail,
        user: reviewedBy,
        type: 'Tombstone',
      });
    },
    [addEntry]
  );

  return (
    <TombstoneContext.Provider
      value={{
        submissions,
        pendingSubmissions,
        submitTombstone,
        approveTombstone,
        rejectTombstone,
      }}
    >
      {children}
    </TombstoneContext.Provider>
  );
}

export function useTombstone() {
  const context = useContext(TombstoneContext);
  if (context === undefined) {
    throw new Error('useTombstone must be used within a TombstoneProvider');
  }
  return context;
}
