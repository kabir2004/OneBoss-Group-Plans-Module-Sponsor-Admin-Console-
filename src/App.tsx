import { useState, useEffect } from "react";
import { ThemeProvider } from "next-themes";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Clients from "./pages/Clients";
import ClientDetails from "./pages/ClientDetails";
import UsersAccess from "./pages/UsersAccess";
import Settings from "./pages/Settings";
import TrustDeposits from "./pages/TrustDeposits";
import AdvancedSearch from "./pages/AdvancedSearch";
import GroupContributions from "./pages/GroupContributions";
import { AuthProvider } from "./context/AuthContext";
import { RepresentativesSearchProvider } from "./context/RepresentativesSearchContext";
import { PendingMemberChangesProvider } from "./context/PendingMemberChangesContext";
import { InterfaceProvider } from "./context/InterfaceContext";
import { SponsorProvider } from "./context/SponsorContext";
import { MenuVisibilityProvider } from "./context/MenuVisibilityContext";
import { RoleProvider } from "./context/RoleContext";
import { RolePermissionsProvider } from "./context/RolePermissionsContext";
import { AddMemberModalProvider } from "./context/AddMemberModalContext";

const queryClient = new QueryClient();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if user is already authenticated (e.g., from localStorage)
    const authStatus = localStorage.getItem('isAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
      if (window.location.pathname !== '/') {
        window.history.replaceState(null, '', '/');
      }
    }
  }, []);

  const handleSignIn = (userId: string, password: string) => {
    // Simulate authentication - in a real app, this would be an API call
    // For now, accept any non-empty credentials
    if (userId && password) {
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('userId', userId);
      setIsAuthenticated(true);
      if (window.location.pathname !== '/') {
        window.history.replaceState(null, '', '/');
      }
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      forcedTheme="light"
    >
      <QueryClientProvider client={queryClient}>
        <AuthProvider value={{ signOut: handleSignOut }}>
          <RoleProvider>
            <InterfaceProvider>
            <RolePermissionsProvider>
            <SponsorProvider>
            <MenuVisibilityProvider>
              <TooltipProvider>
              <Toaster />
              <Sonner />
              {isAuthenticated ? (
                <BrowserRouter>
                  <AddMemberModalProvider>
                  <RepresentativesSearchProvider>
                  <PendingMemberChangesProvider>
                  <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/plan-members" element={<Clients />} />
                  <Route path="/plan-members/:id" element={<ClientDetails />} />
                  <Route path="/administrator" element={<UsersAccess />} />
                  <Route path="/group-contributions" element={<GroupContributions />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="/trust-deposits" element={<TrustDeposits />} />
                  <Route path="/advanced-search" element={<AdvancedSearch />} />
                    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                  </PendingMemberChangesProvider>
                  </RepresentativesSearchProvider>
                  </AddMemberModalProvider>
                </BrowserRouter>
              ) : (
                <SignIn onSignIn={handleSignIn} />
              )}
              </TooltipProvider>
            </MenuVisibilityProvider>
            </SponsorProvider>
            </RolePermissionsProvider>
            </InterfaceProvider>
          </RoleProvider>
        </AuthProvider>
    </QueryClientProvider>
    </ThemeProvider>
  );
};

export default App;
