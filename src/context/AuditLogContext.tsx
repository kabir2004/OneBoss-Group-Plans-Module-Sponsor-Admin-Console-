import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type AuditEntry = {
  id: string;
  action: string;
  detail: string;
  user: string;
  timestamp: string; // display string e.g. "Today • 2:45 PM"
  timestampISO: string; // for sorting
  type: string;
};

type AuditLogContextType = {
  entries: AuditEntry[];
  addEntry: (entry: Omit<AuditEntry, 'id' | 'timestamp' | 'timestampISO'>) => void;
};

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();
  const isYesterday = new Date(now.getTime() - 86400000).toDateString() === date.toDateString();
  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  if (isToday) return `Today • ${time}`;
  if (isYesterday) return `Yesterday • ${time}`;
  return `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined })} • ${time}`;
};

const seedEntries: AuditEntry[] = [
  { id: '0', action: 'Trade Submitted', detail: 'Buy order • AGF Balanced', user: 'Antoine Marsh', timestamp: 'Today • 2:45 PM', timestampISO: new Date().toISOString(), type: 'Trade' },
  { id: '1', action: 'Plan Edited', detail: 'Allocation update • Williams Education Savings', user: 'Sonia Patel', timestamp: 'Yesterday • 4:10 PM', timestampISO: new Date(Date.now() - 86400000).toISOString(), type: 'Plan' },
  { id: '2', action: 'Client Created', detail: 'Davis Tax-Free Account', user: 'Antoine Marsh', timestamp: 'Yesterday • 9:22 AM', timestampISO: new Date(Date.now() - 86400000).toISOString(), type: 'Client' },
  { id: '3', action: 'Trade Approved', detail: 'Switch order • Maple Leaf Holdings', user: 'Compliance Desk', timestamp: 'Nov 8 • 3:52 PM', timestampISO: new Date().toISOString(), type: 'Compliance' },
  { id: '4', action: 'Password Reset', detail: 'User credential refresh', user: 'Support Desk', timestamp: 'Nov 6 • 10:07 AM', timestampISO: new Date().toISOString(), type: 'Security' },
  { id: '5', action: 'Document Expired', detail: 'Suitability assessment • Brown Emergency Fund', user: 'System', timestamp: 'Nov 4 • 6:00 AM', timestampISO: new Date().toISOString(), type: 'System' },
];

const AuditLogContext = createContext<AuditLogContextType | undefined>(undefined);

let idCounter = 100;

export function AuditLogProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<AuditEntry[]>(seedEntries);

  const addEntry = useCallback((entry: Omit<AuditEntry, 'id' | 'timestamp' | 'timestampISO'>) => {
    const date = new Date();
    const newEntry: AuditEntry = {
      ...entry,
      id: String(idCounter++),
      timestamp: formatTimestamp(date),
      timestampISO: date.toISOString(),
    };
    setEntries((prev) => [newEntry, ...prev]);
  }, []);

  return (
    <AuditLogContext.Provider value={{ entries, addEntry }}>
      {children}
    </AuditLogContext.Provider>
  );
}

export function useAuditLog() {
  const context = useContext(AuditLogContext);
  if (context === undefined) {
    throw new Error('useAuditLog must be used within an AuditLogProvider');
  }
  return context;
}
