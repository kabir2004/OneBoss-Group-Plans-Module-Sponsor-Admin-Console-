import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InterfaceType } from '@/components/InterfaceSwitcher';

interface InterfaceContextType {
  currentInterface: InterfaceType;
  setCurrentInterface: (interfaceType: InterfaceType) => void;
  isIntermediaryInterface: boolean;
}

const InterfaceContext = createContext<InterfaceContextType | undefined>(undefined);

const LEGACY_TO_NEW: Record<string, InterfaceType> = {
  'intermediary-dealer': 'super-admin',
  'oneboss-dealer': 'super-admin',
  'intermediary-advisor': 'admin',
  'oneboss-advisor': 'admin',
  'intermediary-client': 'admin-assistant',
};

export function InterfaceProvider({ children }: { children: ReactNode }) {
  const [currentInterface, setCurrentInterfaceState] = useState<InterfaceType>(() => {
    const saved = localStorage.getItem('selectedInterface');
    if (saved && LEGACY_TO_NEW[saved]) return LEGACY_TO_NEW[saved];
    const valid: InterfaceType[] = ['super-admin', 'admin', 'admin-assistant'];
    return (valid.includes(saved as InterfaceType) ? saved : 'admin') as InterfaceType;
  });

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



