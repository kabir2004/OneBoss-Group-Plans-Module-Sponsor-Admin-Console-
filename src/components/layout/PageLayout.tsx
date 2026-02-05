
import React from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { SidebarNavigation } from '@/components/layout/SidebarNavigation';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useInterface } from '@/context/InterfaceContext';

interface PageLayoutProps {
  children: React.ReactNode;
  title: string;
}

export function PageLayout({ children, title }: PageLayoutProps) {
  // All interfaces use the same layout with sidebar (like advisor)
  return (
    <SidebarProvider defaultOpen={true}>
      <SidebarNavigation />
      <SidebarInset className="min-w-0 w-full overflow-x-auto overflow-y-auto">
        <Navbar />
        <main className="flex-1 bg-white min-w-0 w-full overflow-x-auto overflow-y-auto">
          <div className="w-full px-3 lg:px-4 pb-3 lg:pb-4 pt-6 animate-fade-in" style={{ minWidth: 'max(100%, fit-content)' }}>
            {title && <h1 className="text-2xl font-bold mb-6 text-gray-900">{title}</h1>}
            {children}
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
