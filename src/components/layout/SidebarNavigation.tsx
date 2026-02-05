import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  FileText,
  BriefcaseBusiness,
  ShieldCheck,
  History,
  Settings,
  Plus,
  Search,
  ChevronDown,
  ChevronUp,
  ArrowLeftRight,
  Wallet,
  UserPlus,
  Building2,
  FileCheck,
  BookOpen,
  DollarSign,
  Bell,
  HelpCircle,
  HandCoins,
  CheckCircle2,
  BarChart3,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { CLIENTS } from '@/pages/Clients';
import { getInterfaceDisplayName } from '@/components/InterfaceSwitcher';
import { useInterface } from '@/context/InterfaceContext';
import { useMenuVisibility } from '@/context/MenuVisibilityContext';

// OneBoss menu items
const oneBossMenuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    title: 'Clients',
    icon: Users,
    path: '/clients',
  },
  {
    title: 'Trust Deposits',
    icon: Wallet,
    path: '/trust-deposits',
  },
  {
    title: 'Plans',
    icon: FileText,
    path: '/plans',
  },
  {
    title: 'Trades',
    icon: ArrowLeftRight,
    path: '/trades',
  },
  {
    title: 'Prospects',
    icon: UserPlus,
    path: '/prospects',
  },
  {
    title: 'Ensemble',
    icon: Building2,
    path: '/ensemble',
  },
  {
    title: 'KYP',
    icon: FileCheck,
    path: '/kyp',
  },
  {
    title: 'Resources',
    icon: BookOpen,
    path: '/resources',
  },
  {
    title: 'Earnings',
    icon: DollarSign,
    path: '/earnings',
  },
  {
    title: 'Notices',
    icon: Bell,
    path: '/notices',
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/settings',
  },
  {
    title: 'Support',
    icon: HelpCircle,
    path: '/support',
  },
];

// Legacy menu items (for backward compatibility)
const legacyMenuItems = [
  {
    title: 'Dashboard',
    icon: LayoutDashboard,
    path: '/',
  },
  {
    title: 'Clients',
    icon: Users,
    path: '/clients',
  },
  {
    title: 'Plans',
    icon: FileText,
    path: '/plans',
  },
  {
    title: 'Accounts & Trades',
    icon: BriefcaseBusiness,
    path: '/accounts-trades',
  },
  {
    title: 'Compliance',
    icon: ShieldCheck,
    path: '/compliance',
  },
  {
    title: 'Audit Log',
    icon: History,
    path: '/audit-log',
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/settings',
  },
];

export function SidebarNavigation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isClientsExpanded, setIsClientsExpanded] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const { currentInterface, isIntermediaryInterface } = useInterface();
  const { isMenuHidden } = useMenuVisibility();
  const { state, toggleSidebar } = useSidebar();

  // Auto-expand clients dropdown when on clients page, client details page, or related pages
  useEffect(() => {
    const relatedPaths = [
      '/clients',
      '/advanced-search',
      '/households',
      '/income-plans',
      '/approvals',
      '/reports'
    ];
    
    if (location.pathname === '/clients' || 
        location.pathname.startsWith('/clients/') ||
        relatedPaths.includes(location.pathname)) {
      setIsClientsExpanded(true);
    }
  }, [location.pathname]);

  // Set selected client ID from URL when on client details page
  useEffect(() => {
    if (location.pathname.startsWith('/clients/')) {
      const clientId = location.pathname.split('/clients/')[1];
      if (clientId) {
        setSelectedClientId(clientId);
      }
    } else if (location.pathname === '/clients') {
      setSelectedClientId(null);
    }
  }, [location.pathname]);


  // Use OneBoss menu items for OneBoss interfaces, legacy for others
  let menuItems = (currentInterface === 'oneboss-dealer' || currentInterface === 'oneboss-advisor') 
    ? oneBossMenuItems 
    : legacyMenuItems;

  // Filter menu items when visibility is hidden - only show Dashboard, Clients, and Trust Deposits
  if (isMenuHidden) {
    menuItems = menuItems.filter(item => 
      item.path === '/' || 
      item.path === '/clients' || 
      item.path === '/trust-deposits'
    );
  }

  // Helper function to parse name into first and last name
  const parseName = (name: string) => {
    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return { firstName: parts[0], lastName: '' };
    }
    const lastName = parts[parts.length - 1];
    const firstName = parts.slice(0, -1).join(' ');
    return { firstName, lastName };
  };

  const handleClientClick = (clientId: string) => {
    setSelectedClientId(clientId);
    navigate(`/clients/${clientId}`);
  };

  return (
    <Sidebar collapsible="icon" variant="inset" className="bg-white [&>div>div]:!border-0 [&>div>div>div]:!border-0">
      <SidebarHeader className="bg-white !border-0 pb-0">
        <div className="flex items-center justify-between gap-3 px-3 py-4 group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:justify-center">
          <div className="flex flex-col min-w-0 group-data-[collapsible=icon]:hidden">
            <h2 className="text-base font-semibold text-gray-900 leading-tight">OneBoss</h2>
            <p className="text-xs text-gray-600 leading-tight">Welcome Back, Nelson</p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-gray-600 hover:text-gray-900 hover:bg-gray-100 flex-shrink-0 group-data-[collapsible=icon]:!h-8 group-data-[collapsible=icon]:!w-8 group-data-[collapsible=icon]:mx-2 group-data-[collapsible=icon]:text-gray-700 group-data-[collapsible=icon]:hover:bg-gray-50"
            onClick={toggleSidebar}
            title={state === "expanded" ? "Collapse sidebar" : "Expand sidebar"}
          >
            {state === "expanded" ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
            <span className="sr-only">Toggle Sidebar</span>
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent className="bg-white">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                const isClients = item.path === '/clients';
                
                return (
                  <SidebarMenuItem key={item.path}>
                    <div>
                      <SidebarMenuButton
                        onClick={() => {
                          if (isClients) {
                            setIsClientsExpanded(!isClientsExpanded);
                            navigate(item.path);
                          } else {
                            navigate(item.path);
                          }
                        }}
                        isActive={isActive}
                        tooltip={{
                          children: item.title,
                          side: "right",
                          align: "center",
                        }}
                        className="mx-2 data-[active=true]:bg-gray-100 data-[active=true]:text-gray-900 hover:bg-gray-50 text-gray-700 border-0"
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm">{item.title}</span>
                        {isClients && (
                          <span className="ml-auto group-data-[collapsible=icon]:hidden">
                            {isClientsExpanded ? (
                              <ChevronUp className="h-3 w-3" />
                            ) : (
                              <ChevronDown className="h-3 w-3" />
                            )}
                          </span>
                        )}
                      </SidebarMenuButton>
                      
                      {isClients && (
                        <div className={`mx-2 mt-1 space-y-1 group-data-[collapsible=icon]:hidden clients-dropdown-container ${
                          isClientsExpanded ? 'clients-expanded' : 'clients-collapsed'
                        }`}>
                          <div className="space-y-1.5 px-1">
                            <Button
                              size="sm"
                              onClick={() => navigate('/clients')}
                              className={`w-full h-7 text-xs ${
                                location.pathname === '/clients'
                                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                                  : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-300'
                              }`}
                            >
                              <Plus className="h-3 w-3 mr-1.5" />
                              Add Clients
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-7 text-xs"
                              onClick={() => navigate('/advanced-search')}
                            >
                              <Search className="h-3 w-3 mr-1.5" />
                              Advanced Search
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-7 text-xs"
                              onClick={() => navigate('/households')}
                            >
                              <Building2 className="h-3 w-3 mr-1.5" />
                              Households
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-7 text-xs"
                              onClick={() => navigate('/income-plans')}
                            >
                              <HandCoins className="h-3 w-3 mr-1.5" />
                              Income Plans
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-7 text-xs"
                              onClick={() => navigate('/approvals')}
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1.5" />
                              Approvals
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="w-full h-7 text-xs"
                              onClick={() => navigate('/reports')}
                            >
                              <BarChart3 className="h-3 w-3 mr-1.5" />
                              Reports
                            </Button>
                          </div>
                          <div className="mt-2 border border-gray-200 rounded-lg bg-white shadow-sm transition-all duration-300 ease-in-out overflow-hidden">
                            <ScrollArea className="h-[400px]">
                              <div className="space-y-0.5 p-2">
                                {CLIENTS.map((client) => {
                                  const { firstName, lastName } = parseName(client.name);
                                  const isSelected = selectedClientId === client.id;
                                  return (
                                    <div
                                      key={client.id}
                                      onClick={() => handleClientClick(client.id)}
                                      className={`flex items-center justify-between p-2 rounded-md text-xs cursor-pointer transition-colors ${
                                        isSelected
                                          ? 'bg-gray-100 border border-gray-300'
                                          : 'hover:bg-gray-50 border border-transparent'
                                      }`}
                                    >
                                      <div className="flex-1 min-w-0 truncate text-gray-900 font-medium">
                                        {lastName}, {firstName}
                                      </div>
                                      <div className="ml-2 flex-shrink-0">
                                        <div className={`h-2 w-2 rounded-full ${
                                          client.status === 'Active' ? 'bg-green-500' :
                                          client.status === 'Inactive' ? 'bg-gray-400' :
                                          'bg-yellow-500'
                                        }`} />
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </ScrollArea>
                          </div>
                        </div>
                      )}
                    </div>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

