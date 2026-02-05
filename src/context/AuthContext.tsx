import { createContext, useContext } from "react";

type AuthContextValue = {
  signOut: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  value: AuthContextValue;
  children: React.ReactNode;
}

export const AuthProvider = ({ value, children }: AuthProviderProps) => {
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

