import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRoles } from '@/context/RoleContext';

/** Current interface is a role id (e.g. 'super-admin', 'admin', or a custom role id). */
export type InterfaceType = string;

interface InterfaceContextType {
  currentInterface: InterfaceType;
  setCurrentInterface: (interfaceType: InterfaceType) => void;
  isIntermediaryInterface: boolean;
}

const InterfaceContext = createContext<InterfaceContextType | undefined>(undefined);

const LEGACY_TO_NEW: Record<string, string> = {
  'intermediary-dealer': 'super-admin',
  'oneboss-dealer': 'super-admin',
  'intermediary-advisor': 'admin',
  'oneboss-advisor': 'admin',
  'intermediary-client': 'admin-assistant',
};

export function InterfaceProvider({ children }: { children: ReactNode }) {
  const { rolesOrdered } = useRoles();
  const [currentInterface, setCurrentInterfaceState] = useState<InterfaceType>(() => {
    const saved = localStorage.getItem('selectedInterface');
    if (saved && LEGACY_TO_NEW[saved]) return LEGACY_TO_NEW[saved];
    const valid = ['super-admin', 'admin', 'admin-assistant'];
    return valid.includes(saved ?? '') ? saved! : 'admin';
  });

  useEffect(() => {
    const validIds = new Set(rolesOrdered.map((r) => r.id));
    if (!validIds.has(currentInterface)) {
      const fallback = rolesOrdered[0]?.id ?? 'super-admin';
      setCurrentInterfaceState(fallback);
      localStorage.setItem('selectedInterface', fallback);
    }
  }, [rolesOrdered, currentInterface]);

  const setCurrentInterface = (interfaceType: InterfaceType) => {
    setCurrentInterfaceState(interfaceType);
    localStorage.setItem('selectedInterface', interfaceType);
    window.dispatchEvent(new CustomEvent('interfaceChanged', { detail: interfaceType }));
  };

  useEffect(() => {
    const handleInterfaceChange = (event: CustomEvent) => {
      setCurrentInterfaceState(event.detail as InterfaceType);
    };

    window.addEventListener('interfaceChanged', handleInterfaceChange as EventListener);

    return () => {
      window.removeEventListener('interfaceChanged', handleInterfaceChange as EventListener);
    };
  }, []);

  const isIntermediaryInterface = currentInterface === 'admin-assistant';

  return (
    <InterfaceContext.Provider
      value={{
        currentInterface,
        setCurrentInterface,
        isIntermediaryInterface,
      }}
    >
      {children}
    </InterfaceContext.Provider>
  );
}

export function useInterface() {
  const context = useContext(InterfaceContext);
  if (context === undefined) {
    throw new Error('useInterface must be used within an InterfaceProvider');
  }
  return context;
}



