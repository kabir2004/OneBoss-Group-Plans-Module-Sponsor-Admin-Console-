import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface MenuVisibilityContextType {
  isMenuHidden: boolean;
  toggleMenuVisibility: () => void;
}

const MenuVisibilityContext = createContext<MenuVisibilityContextType | undefined>(undefined);

export function MenuVisibilityProvider({ children }: { children: ReactNode }) {
  const [isMenuHidden, setIsMenuHidden] = useState(() => {
    const saved = localStorage.getItem('menuVisibilityHidden');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('menuVisibilityHidden', String(isMenuHidden));
  }, [isMenuHidden]);

  const toggleMenuVisibility = () => {
    setIsMenuHidden(prev => !prev);
  };

  return (
    <MenuVisibilityContext.Provider
      value={{
        isMenuHidden,
        toggleMenuVisibility,
      }}
    >
      {children}
    </MenuVisibilityContext.Provider>
  );
}

export function useMenuVisibility() {
  const context = useContext(MenuVisibilityContext);
  if (context === undefined) {
    throw new Error('useMenuVisibility must be used within a MenuVisibilityProvider');
  }
  return context;
}



