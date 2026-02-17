import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

type RepresentativesSearchState = {
  name: string;
  surname: string;
  businessName: string;
  nrdNumber: string;
  city: string;
  province: string;
  status: string;
  serviceLevel: string;
  mr72OnFile: string;
};

const initialSearch: RepresentativesSearchState = {
  name: '',
  surname: '',
  businessName: '',
  nrdNumber: '',
  city: '',
  province: 'all',
  status: 'all',
  serviceLevel: 'all',
  mr72OnFile: 'all',
};

export type RepresentativeItem = {
  id: string;
  name: string;
  status: string;
  /** Optional role id for Administrator page list (for dot color). */
  role?: string;
};

type ContextType = {
  search: RepresentativesSearchState;
  setSearchField: (field: keyof RepresentativesSearchState, value: string) => void;
  resetSearch: () => void;
  representativesCount: number;
  setRepresentativesCount: (n: number) => void;
  representativesList: RepresentativeItem[];
  setRepresentativesList: (list: RepresentativeItem[]) => void;
  selectedRepresentativeId: string | null;
  setSelectedRepresentativeId: (id: string | null) => void;
};

const RepresentativesSearchContext = createContext<ContextType | undefined>(undefined);

export function RepresentativesSearchProvider({ children }: { children: ReactNode }) {
  const [search, setSearchState] = useState<RepresentativesSearchState>(initialSearch);
  const [representativesCount, setRepresentativesCount] = useState(0);
  const [representativesList, setRepresentativesList] = useState<RepresentativeItem[]>([]);
  const [selectedRepresentativeId, setSelectedRepresentativeId] = useState<string | null>(null);

  const setSearchField = useCallback((field: keyof RepresentativesSearchState, value: string) => {
    setSearchState((prev) => ({ ...prev, [field]: value }));
  }, []);

  const resetSearch = useCallback(() => {
    setSearchState(initialSearch);
  }, []);

  return (
    <RepresentativesSearchContext.Provider
      value={{ search, setSearchField, resetSearch, representativesCount, setRepresentativesCount, representativesList, setRepresentativesList, selectedRepresentativeId, setSelectedRepresentativeId }}
    >
      {children}
    </RepresentativesSearchContext.Provider>
  );
}

export function useRepresentativesSearch() {
  const ctx = useContext(RepresentativesSearchContext);
  if (ctx === undefined) {
    throw new Error('useRepresentativesSearch must be used within RepresentativesSearchProvider');
  }
  return ctx;
}
