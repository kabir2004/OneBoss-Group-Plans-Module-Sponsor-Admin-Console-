import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useInterface } from '@/context/InterfaceContext';

// Mock: sponsors available to dealer-role users (replace with API when available)
export const AVAILABLE_SPONSORS = ['Acme Group Plans', 'Beta Retirement Corp', 'Gamma Benefits Inc'];

type SponsorContextValue = {
  currentSponsorName: string;
  setCurrentSponsorName: (name: string) => void;
  hasMultipleSponsors: boolean;
  availableSponsors: string[];
};

const SponsorContext = createContext<SponsorContextValue | undefined>(undefined);

export function SponsorProvider({ children }: { children: ReactNode }) {
  const { currentInterface } = useInterface();
  const hasMultipleSponsors =
    currentInterface === 'super-admin';
  const [currentSponsorName, setCurrentSponsorName] = useState(AVAILABLE_SPONSORS[0]);

  return (
    <SponsorContext.Provider
      value={{
        currentSponsorName,
        setCurrentSponsorName,
        hasMultipleSponsors,
        availableSponsors: AVAILABLE_SPONSORS,
      }}
    >
      {children}
    </SponsorContext.Provider>
  );
}

export function useSponsor() {
  const context = useContext(SponsorContext);
  if (context === undefined) {
    throw new Error('useSponsor must be used within a SponsorProvider');
  }
  return context;
}
