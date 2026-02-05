import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { InterfaceType } from '@/components/InterfaceSwitcher';

interface InterfaceContextType {
  currentInterface: InterfaceType;
  setCurrentInterface: (interfaceType: InterfaceType) => void;
  isIntermediaryInterface: boolean;
}

const InterfaceContext = createContext<InterfaceContextType | undefined>(undefined);

export function InterfaceProvider({ children }: { children: ReactNode }) {
  const [currentInterface, setCurrentInterfaceState] = useState<InterfaceType>(() => {
    const saved = localStorage.getItem('selectedInterface');
    return (saved as InterfaceType) || 'oneboss-advisor';
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

  const isIntermediaryInterface = 
    currentInterface === 'intermediary-dealer' ||
    currentInterface === 'intermediary-advisor' ||
    currentInterface === 'intermediary-client';

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



