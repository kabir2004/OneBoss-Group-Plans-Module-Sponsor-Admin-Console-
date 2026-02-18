import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useInterface } from '@/context/InterfaceContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DollarSign,
  Users,
  BriefcaseBusiness,
  ShieldCheck,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Plus,
  Upload,
  Layers,
  HandCoins,
  History,
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Sparkles,
  Loader2,
  Check,
  AlertTriangle,
  Calendar as CalendarIcon,
  User,
  Filter,
  XCircle,
  Wallet2,
  BarChart3,
  Building2,
  Settings,
  TrendingUp,
  UserCheck,
  FileText,
} from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fundsData } from '@/data/fundsData';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { ScrollArea } from '@/components/ui/scroll-area';

type PlanType = "OPEN" | "RRSP" | "RESP" | "TFSA" | "RRIF" | "Non-Registered" | "LIRA" | "LIF";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const Index = () => {
  const navigate = useNavigate();
  const { isIntermediaryInterface } = useInterface();
  const [activeTradeTab, setActiveTradeTab] = useState<'progress' | 'rejected' | 'confirmed'>('progress');
  const [isPlansExpanded, setIsPlansExpanded] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [createdPlan, setCreatedPlan] = useState<{ id: string; type: PlanType; accountNumber: string; clientName: string } | null>(null);
  const [selectedFundCompany, setSelectedFundCompany] = useState("");
  const [selectedProduct, setSelectedProduct] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  const [openFundCompany, setOpenFundCompany] = useState(false);
  const [openProduct, setOpenProduct] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [orderDetails, setOrderDetails] = useState<{
    company: string;
    product: string;
    symbol: string;
    amount: string;
    time: string;
  } | null>(null);

  // Recent Activity Filters
  const [activityFilter, setActivityFilter] = useState<{
    type: 'all' | 'positive' | 'negative';
    timePeriod: 'all' | 'today' | 'yesterday' | 'week' | 'month';
  }>({
    type: 'all',
    timePeriod: 'all',
  });

  // Trades View Toggle
  const [tradesView, setTradesView] = useState<'progress' | 'rejected' | 'confirmed'>('progress');

  // Contributions by Plan Type time filter (Sponsor perspective)
  const [contributionsPeriod, setContributionsPeriod] = useState<'MTD' | 'QTD' | 'YTD' | 'All'>('YTD');

  // Widget Configuration
  const [showWidgetConfig, setShowWidgetConfig] = useState(false);
  const [activeWidgets, setActiveWidgets] = useState<Set<string>>(new Set([
    'contributionsByPlanType',
    'assetsBySupplier',
    'eStatementSignup',
    'topFiveClients'
  ]));

  // Total Assets widget: toggle between 2-slice (Net Invested/Growth) and 4-slice AUA/AUM split
  const [splitView, setSplitView] = useState(false);
  const [totalAssetsChartHovered, setTotalAssetsChartHovered] = useState(false);

  const allWidgets = [
    { id: 'assetsByPlanType', name: 'Assets By Plan Type' },
    { id: 'contributionsByPlanType', name: 'Contributions by Plan Type' },
    { id: 'plansOverview', name: 'Plans Overview' },
    { id: 'assetsBySupplier', name: 'Total Assets' },
    { id: 'eStatementSignup', name: 'KYC' },
    { id: 'topFiveClients', name: 'Analyze My Book' },
    { id: 'topFiveProducts', name: 'Top Five Products' },
    { id: 'topFiveProductsPerformance', name: 'Top Five Products Performance' },
  ];

  const toggleWidget = (widgetId: string) => {
    setActiveWidgets(prev => {
      const newSet = new Set(prev);
      if (newSet.has(widgetId)) {
        newSet.delete(widgetId);
      } else {
        if (newSet.size < 4) {
          newSet.add(widgetId);
        }
      }
      return newSet;
    });
  };

  // New Client Dialog State
  const [showNewClient, setShowNewClient] = useState(false);
  const [showClientConfirmation, setShowClientConfirmation] = useState(false);
  const [createdClientInfo, setCreatedClientInfo] = useState<{
    firstName: string;
    lastName: string;
    sin: string;
    phone: string;
    email: string;
    dateOfBirth: Date | null;
    address: string;
    beneficiaryFirstName: string;
    beneficiaryLastName: string;
    beneficiaryRelationship: string;
    beneficiarySIN: string;
    beneficiaryEmail: string;
    beneficiaryDateOfBirth: Date | null;
    beneficiaryAddress: string;
  } | null>(null);
  const [clientCurrentStep, setClientCurrentStep] = useState(0);
  const [clientDateOfBirth, setClientDateOfBirth] = useState<Date | null>(null);
  const [beneficiaryDateOfBirth, setBeneficiaryDateOfBirth] = useState<Date | null>(null);
  const [clientFormValues, setClientFormValues] = useState({
    firstName: "",
    lastName: "",
    sin: "",
    phone: "",
    email: "",
    dateOfBirth: null as Date | null,
    address: "",
    beneficiaryFirstName: "",
    beneficiaryLastName: "",
    beneficiaryRelationship: "",
    beneficiarySIN: "",
    beneficiaryEmail: "",
    beneficiaryDateOfBirth: null as Date | null,
    beneficiaryAddress: "",
    planSelection: "create" as "create" | "existing",
    selectedPlanId: "",
  });

  const [formValues, setFormValues] = useState({
    type: "" as PlanType | "",
    ownerName: "",
    beneficiaryName: "",
    intermediaryCode: "",
    intermediaryAccountCode: "",
    notes: "",
    objectives: "",
    riskTolerance: "",
    timeHorizon: "",
  });

  const planTypeOptions: PlanType[] = ["OPEN", "RRSP", "RESP", "TFSA", "RRIF", "Non-Registered", "LIRA", "LIF"];

  // Get unique fund companies from fundsData
  const fundCompanies = useMemo(() => {
    const companies = new Set<string>();
    fundsData.forEach((client) => {
      client.companies.forEach((company) => {
        companies.add(company.name);
      });
    });
    return Array.from(companies).sort();
  }, []);

  // Get products from selected fund company
  const fundProducts = useMemo(() => {
    if (!selectedFundCompany) return [];
    
    for (const client of fundsData) {
      const company = client.companies.find((c) => c.name === selectedFundCompany);
      if (company) {
        return company.products.map((product) => ({
          code: product.code,
          name: product.name,
        }));
      }
    }
    return [];
  }, [selectedFundCompany]);

  const handleNewClient = () => {
    setClientCurrentStep(0);
    resetClientForm();
    setShowNewClient(true);
  };

  const resetClientForm = () => {
    setClientFormValues({
      firstName: "",
      lastName: "",
      sin: "",
      phone: "",
      email: "",
      dateOfBirth: null,
      address: "",
      beneficiaryFirstName: "",
      beneficiaryLastName: "",
      beneficiaryRelationship: "",
      beneficiarySIN: "",
      beneficiaryEmail: "",
      beneficiaryDateOfBirth: null,
      beneficiaryAddress: "",
      planSelection: "create",
      selectedPlanId: "",
    });
    setClientDateOfBirth(null);
    setBeneficiaryDateOfBirth(null);
    setClientCurrentStep(0);
  };

  const handleCloseClientDialog = () => {
    setShowNewClient(false);
    resetClientForm();
  };

  const handleClientNextStep = () => {
    if (clientCurrentStep === 0 && (!clientFormValues.firstName || !clientFormValues.lastName || !clientFormValues.sin || !clientFormValues.phone || !clientFormValues.email || !clientDateOfBirth || !clientFormValues.address)) return;
    if (clientCurrentStep === 1 && (!clientFormValues.beneficiaryFirstName || !clientFormValues.beneficiaryLastName || !clientFormValues.beneficiaryRelationship || !clientFormValues.beneficiaryEmail || !beneficiaryDateOfBirth || !clientFormValues.beneficiaryAddress)) return;
    if (clientCurrentStep === 1) {
      // Submit client after beneficiary details
      handleSubmitClient();
    } else {
      setClientCurrentStep(clientCurrentStep + 1);
    }
  };

  const handleClientPreviousStep = () => {
    if (clientCurrentStep > 0) {
      setClientCurrentStep(clientCurrentStep - 1);
    }
  };

  const handleSubmitClient = () => {
    setIsLoading(true);
    // Preserve client info before closing dialog
    setCreatedClientInfo({
      firstName: clientFormValues.firstName,
      lastName: clientFormValues.lastName,
      sin: clientFormValues.sin,
      phone: clientFormValues.phone,
      email: clientFormValues.email,
      dateOfBirth: clientDateOfBirth,
      address: clientFormValues.address,
      beneficiaryFirstName: clientFormValues.beneficiaryFirstName,
      beneficiaryLastName: clientFormValues.beneficiaryLastName,
      beneficiaryRelationship: clientFormValues.beneficiaryRelationship,
      beneficiarySIN: clientFormValues.beneficiarySIN,
      beneficiaryEmail: clientFormValues.beneficiaryEmail,
      beneficiaryDateOfBirth: beneficiaryDateOfBirth,
      beneficiaryAddress: clientFormValues.beneficiaryAddress,
    });
    setTimeout(() => {
      setIsLoading(false);
      handleCloseClientDialog();
      // Show confirmation dialog after closing the client dialog
      setTimeout(() => {
        setShowClientConfirmation(true);
      }, 100);
    }, 500);
  };

  const handleCreatePlan = () => {
    setCurrentStep(0);
    resetForm();
    setShowAddPlan(true);
  };

  const resetForm = () => {
    setFormValues({
      type: "" as PlanType | "",
      ownerName: "",
      beneficiaryName: "",
      intermediaryCode: "",
      intermediaryAccountCode: "",
      notes: "",
      objectives: "",
      riskTolerance: "",
      timeHorizon: "",
    });
    setCurrentStep(0);
    setCreatedPlan(null);
    setSelectedFundCompany("");
    setSelectedProduct("");
    setInvestmentAmount("");
    setOpenFundCompany(false);
    setOpenProduct(false);
  };

  const handleCloseDialog = () => {
    setShowAddPlan(false);
    resetForm();
  };

  const handleNextStep = () => {
    if (currentStep === 0 && !formValues.type) return;
    if (currentStep === 1 && (!formValues.ownerName || !formValues.beneficiaryName)) return;
    if (currentStep === 2 && (!formValues.intermediaryCode || !formValues.intermediaryAccountCode)) return;
    if (currentStep === 3 && (!formValues.objectives || !formValues.riskTolerance || !formValues.timeHorizon)) return;
    
    if (currentStep === 3) {
      handleSubmitPlan();
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmitPlan = () => {
    setIsLoading(true);
    setTimeout(() => {
      const planId = `PLN-${Date.now()}-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;
      const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      
      const newPlan = {
        id: planId,
        type: formValues.type as PlanType,
        accountNumber: accountNumber,
        clientName: formValues.ownerName,
      };

      setCreatedPlan(newPlan);
      setCurrentStep(4);
      setIsLoading(false);
    }, 500);
  };

  // Intermediary stats cards (matching the image)
  // Top row: 2 cards
  const intermediaryTopStatsCards = [
    { label: 'ASSETS UNDER ADMINISTRATION', value: '$1,055,611.55', icon: DollarSign, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    { label: 'PLAN MEMBERS', value: '27', icon: Users, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
  ];

  // Plans and Trades cards (second row)
  const plansCard = { label: 'PLANS', value: '39', icon: BriefcaseBusiness, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' };
  const tradesPendingCard = { label: 'TRADES PENDING', value: '3', icon: Clock, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' };

  const statsCards = [
    { label: 'Group Assets', value: '$127,400,000', tooltip: 'Total market value of all plans sponsored by this organization.', icon: Wallet2, iconBg: 'bg-green-100', iconColor: 'text-green-600' },
    // Members: "active" = enrolled members (default). Optional filter for 'active contributors' if available later.
    { label: 'Members', value: '1,247', tooltip: 'Number of unique plan participants across sponsored plans.', icon: Users, iconBg: 'bg-blue-100', iconColor: 'text-blue-600' },
    { label: 'AVERAGE ACCOUNT SIZE', value: '$102.2K', tooltip: 'Average account size across plans sponsored by this organization.', icon: BarChart3, iconBg: 'bg-purple-100', iconColor: 'text-purple-600' },
    { label: 'Fund Families', value: '', tooltip: 'Number of fund families used in plans sponsored by this organization.', icon: Building2, iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  ];

  const fundCategories = [
    { label: 'Canadian Equity', value: '$45.2M', amount: 45.2, color: 'bg-blue-500' },
    { label: 'Fixed Income', value: '$38.7M', amount: 38.7, color: 'bg-green-500' },
    { label: 'US Equity', value: '$28.9M', amount: 28.9, color: 'bg-purple-500' },
  ];

  // Calculate max amount for percentage calculation
  const maxAmount = Math.max(...fundCategories.map(cat => cat.amount));

  // Charts and Analytics data

  const assetsBySupplier = [
    { name: 'CIG', value: 27, color: '#f97316' },
    { name: 'MMF', value: 14, color: '#ef4444' },
    { name: 'MFC', value: 14, color: '#eab308' },
    { name: 'Other', value: 45, color: '#e5e7eb' },
  ];

  // Total Assets data with dollar amounts
  // Using the AUM from statsCards: $127,400,000
  const totalAUM = 127400000;
  const netInvestedAmount = Math.round(totalAUM * 0.60); // 60% of total
  const growthAmount = Math.round(totalAUM * 0.30); // 30% of total
  const irrPercentage = 18.5; // IRR as percentage
  
  const totalAssetsData = [
    { name: 'Net Invested', value: 60, color: '#3b82f6', amount: netInvestedAmount },
    { name: 'Growth', value: 30, color: '#10b981', amount: growthAmount },
  ];

  // 4-slice AUA/AUM split view (splitView=true): same totals, split by AUA/AUM ratios
  const NET_INV_AUM = 0.60;
  const GROWTH_AUM = 0.60;
  const NET_INV_AUA = 1 - NET_INV_AUM;
  const GROWTH_AUA = 1 - GROWTH_AUM;
  const netInvestedTotal = netInvestedAmount; // 76,440,000 (already shown in widget)
  const growthTotal = growthAmount; // 38,220,000 (already shown in widget)
  const totalAssetsSplitData = [
    { key: 'net-aua', name: 'Net Invested (AUA)', value: Math.round(netInvestedTotal * NET_INV_AUA), color: '#3b82f6', pattern: false },
    { key: 'net-aum', name: 'Net Invested (AUM)', value: Math.round(netInvestedTotal * NET_INV_AUM), color: '#3b82f6', pattern: true },
    { key: 'growth-aua', name: 'Growth (AUA)', value: Math.round(growthTotal * GROWTH_AUA), color: '#10b981', pattern: false },
    { key: 'growth-aum', name: 'Growth (AUM)', value: Math.round(growthTotal * GROWTH_AUM), color: '#10b981', pattern: true },
  ];

  const eStatementData = [
    { name: 'eStatement', value: 25, color: '#10b981' },
    { name: 'Mail Delivery', value: 75, color: '#e5e7eb' },
  ];

  // KYC data with dollar amounts and counts
  // Based on total AUM: $127,400,000
  const expiredKYCAmount = 25480000; // 20% of total
  const expiringKYCAmount = 19110000; // 15% of total
  const validKYCAmount = 82781000; // 65% of total
  
  const kycData = [
    { name: 'Expired', value: 20, color: '#ef4444', amount: expiredKYCAmount, count: 8 },
    { name: 'Expiring < 60 Days', value: 15, color: '#f59e0b', amount: expiringKYCAmount, count: 6 },
    { name: 'Valid', value: 65, color: '#10b981', amount: validKYCAmount, count: 26 },
  ];

  const topClients = [
    { name: 'Sharma, Melanie', value: 1.7, color: '#3b82f6' },
    { name: 'Martinez, Neil', value: 0.55, color: '#10b981' },
    { name: 'Salinas, Gus', value: 0.4, color: '#8b5cf6' },
    { name: 'Mueller, Oliver', value: 0.3, color: '#f97316' },
    { name: 'Robertson, Name', value: 0.25, color: '#ef4444' },
  ];

  // Work In Progress data
  const workInProgress = [
    {
      title: 'Trading',
      icon: TrendingUp,
      iconBg: 'bg-blue-500',
      items: [
        { label: 'Unsubmitted Trades', count: 2 },
        { label: 'Submit a Trade', count: 0 },
      ],
    },
    {
      title: 'Account Opening',
      icon: Users,
      iconBg: 'bg-green-500',
      items: [
        { label: 'My Drafts', count: 12 },
        { label: 'Submitted for Review', count: 0 },
        { label: 'Ensemble Drafts', count: 6 },
        { label: 'Awaiting Ensemble Response', count: 4 },
        { label: 'Imported from Ensemble', count: 4 },
      ],
    },
    { title: 'KYC Update', icon: ShieldCheck, iconBg: 'bg-purple-500', items: [], blank: true },
    { title: 'Client Approval', icon: CheckCircle2, iconBg: 'bg-green-600', items: [], blank: true },
    { title: 'Faxing', icon: FileText, iconBg: 'bg-orange-500', items: [], blank: true },
  ];

  // Plan types with counts, AUA, and hover colors
  const planTypes = [
    { type: 'TFSA', count: 8, aua: 245000, hoverColor: 'hover:bg-blue-50 hover:border-blue-200' },
    { type: 'RRIF', count: 5, aua: 185000, hoverColor: 'hover:bg-purple-50 hover:border-purple-200' },
    { type: 'RRSP', count: 12, aua: 385000, hoverColor: 'hover:bg-green-50 hover:border-green-200' },
    { type: 'RESP', count: 4, aua: 125000, hoverColor: 'hover:bg-yellow-50 hover:border-yellow-200' },
    { type: 'OPEN', count: 6, aua: 285000, hoverColor: 'hover:bg-gray-50 hover:border-gray-200' },
    { type: 'Non-Registered', count: 6, aua: 285000, hoverColor: 'hover:bg-gray-50 hover:border-gray-200' },
    { type: 'LIRA', count: 2, aua: 95000, hoverColor: 'hover:bg-indigo-50 hover:border-indigo-200' },
    { type: 'LIF', count: 1, aua: 45000, hoverColor: 'hover:bg-pink-50 hover:border-pink-200' },
    { type: 'RDSP', count: 1, aua: 35000, hoverColor: 'hover:bg-orange-50 hover:border-orange-200' },
    { type: 'Other', count: 3, aua: 120000, hoverColor: 'hover:bg-slate-50 hover:border-slate-200' },
  ];

  // Format currency helper
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Calculate total plans
  const totalPlans = planTypes.reduce((sum, plan) => sum + plan.count, 0);
  
  // Calculate total AUA for percentage calculation
  const totalAUA = planTypes.reduce((sum, plan) => sum + plan.aua, 0);
  
  // Calculate AUA for the four plan types (RRSP, RRIF, OPEN, Other) for Assets By Plan Type chart
  const rrspAUA = planTypes.find(p => p.type === 'RRSP')?.aua || 0;
  const rrifAUA = planTypes.find(p => p.type === 'RRIF')?.aua || 0;
  const openAUA = planTypes.find(p => p.type === 'OPEN')?.aua || 0;
  const otherAUA = planTypes.find(p => p.type === 'Other')?.aua || 0;
  
  // Calculate total AUA for these four types
  const totalSelectedAUA = rrspAUA + rrifAUA + openAUA + otherAUA;
  
  // Calculate percentages that total to 100%
  const calculatePercentage = (aua: number) => {
    if (totalSelectedAUA === 0) return 0;
    return (aua / totalSelectedAUA) * 100;
  };
  
  const rrspPercentage = calculatePercentage(rrspAUA);
  const rrifPercentage = calculatePercentage(rrifAUA);
  const openPercentage = calculatePercentage(openAUA);
  const otherPercentage = calculatePercentage(otherAUA);
  
  // Charts and Analytics data
  const assetsByPlanType = [
    { name: 'RRSP', value: rrspPercentage, color: '#3b82f6', percentage: rrspPercentage, count: planTypes.find(p => p.type === 'RRSP')?.count || 0 },
    { name: 'RRIF', value: rrifPercentage, color: '#10b981', percentage: rrifPercentage, count: planTypes.find(p => p.type === 'RRIF')?.count || 0 },
    { name: 'OPEN', value: openPercentage, color: '#8b5cf6', percentage: openPercentage, count: planTypes.find(p => p.type === 'OPEN')?.count || 0 },
    { name: 'Other', value: otherPercentage, color: '#e5e7eb', percentage: otherPercentage, count: planTypes.find(p => p.type === 'Other')?.count || 0 },
  ];

  // Contributions by Plan Type (Sponsor perspective): Group RRSP, TFSA, DPSP — Employee vs Employer (Match/Company)
  const contributionsByPlanTypeData = useMemo(() => {
    const periodMultipliers: Record<typeof contributionsPeriod, { groupRRSP: [number, number]; tfsa: [number, number]; dpsp: [number, number] }> = {
      MTD: { groupRRSP: [42000, 16800], tfsa: [28000, 0], dpsp: [0, 0] },
      QTD: { groupRRSP: [85000, 34000], tfsa: [62000, 0], dpsp: [72000, 28800] },
      YTD: { groupRRSP: [120000, 48000], tfsa: [85000, 0], dpsp: [95000, 38000] },
      All: { groupRRSP: [285000, 114000], tfsa: [198000, 0], dpsp: [220000, 88000] },
    };
    const m = periodMultipliers[contributionsPeriod];
    const rows = [
      { planType: 'Group RRSP', employeeContributions: m.groupRRSP[0], employerContributions: m.groupRRSP[1] },
      { planType: 'TFSA', employeeContributions: m.tfsa[0], employerContributions: m.tfsa[1] },
      { planType: 'DPSP', employeeContributions: m.dpsp[0], employerContributions: m.dpsp[1] },
    ];
    const maxTotal = Math.max(...rows.map((r) => r.employeeContributions + r.employerContributions), 1);
    return rows.map((r) => {
      const total = r.employeeContributions + r.employerContributions;
      return { ...r, emptyPlaceholder: total === 0 ? maxTotal * 0.03 : 0 };
    });
  }, [contributionsPeriod]);

  const totalContributionsSelectedPeriod = useMemo(() => {
    return contributionsByPlanTypeData.reduce(
      (sum, row) => sum + row.employeeContributions + row.employerContributions,
      0
    );
  }, [contributionsByPlanTypeData]);

  const transactions = [
    { name: 'Smith Trust - Fund Purchase', time: 'Today • 2:45 PM', amount: '-$25,000.00', isNegative: true, icon: HandCoins },
    { name: 'Johnson Fund - Dividend', time: 'Today • 9:00 AM', amount: '+$1,250.00', isNegative: false, icon: CreditCard },
    { name: 'Williams Account - Rebalance', time: 'Yesterday', amount: '-$5,500.00', isNegative: true, icon: HandCoins },
    { name: 'Brown Emergency - Deposit', time: 'Yesterday', amount: '+$10,000.00', isNegative: false, icon: CreditCard },
    { name: 'Davis Account - Fee Payment', time: '2 days ago', amount: '-$150.00', isNegative: true, icon: CreditCard },
    { name: 'Smith Trust - Capital Gain', time: '3 days ago', amount: '+$3,200.00', isNegative: false, icon: CreditCard },
    { name: 'Hamilton Family - New Account Setup', time: '3 days ago', amount: '+$50,000.00', isNegative: false, icon: BriefcaseBusiness },
    { name: 'Sunrise Portfolio - Switch Order', time: '4 days ago', amount: '-$12,750.00', isNegative: true, icon: HandCoins },
    { name: 'Evergreen Wealth - Distribution', time: '4 days ago', amount: '+$2,480.00', isNegative: false, icon: CreditCard },
    { name: 'Maple Leaf Holdings - Redemption', time: '5 days ago', amount: '-$18,600.00', isNegative: true, icon: HandCoins },
    { name: 'Aurora RESP - Contribution', time: '6 days ago', amount: '+$6,000.00', isNegative: false, icon: CreditCard },
    { name: 'Harper Estate - Advisory Fee', time: '6 days ago', amount: '-$325.00', isNegative: true, icon: CreditCard },
    { name: 'Taylor Investment - Fund Purchase', time: '7 days ago', amount: '-$8,500.00', isNegative: true, icon: HandCoins },
    { name: 'Roberts Family - Dividend Payment', time: '7 days ago', amount: '+$950.00', isNegative: false, icon: CreditCard },
    { name: 'Mitchell Account - Rebalance', time: '8 days ago', amount: '-$3,200.00', isNegative: true, icon: HandCoins },
    { name: 'Campbell Trust - Deposit', time: '8 days ago', amount: '+$15,000.00', isNegative: false, icon: CreditCard },
    { name: 'Stewart Portfolio - Fee Payment', time: '9 days ago', amount: '-$200.00', isNegative: true, icon: CreditCard },
    { name: 'Morris Account - Capital Gain', time: '9 days ago', amount: '+$4,500.00', isNegative: false, icon: CreditCard },
    { name: 'Ward Family - New Account', time: '10 days ago', amount: '+$30,000.00', isNegative: false, icon: BriefcaseBusiness },
    { name: 'Turner Investment - Switch', time: '10 days ago', amount: '-$7,800.00', isNegative: true, icon: HandCoins },
    { name: 'Phillips Wealth - Distribution', time: '11 days ago', amount: '+$1,800.00', isNegative: false, icon: CreditCard },
    { name: 'Cooper Holdings - Redemption', time: '11 days ago', amount: '-$22,000.00', isNegative: true, icon: HandCoins },
    { name: 'Richardson RESP - Contribution', time: '12 days ago', amount: '+$5,500.00', isNegative: false, icon: CreditCard },
    { name: 'Cox Estate - Advisory Fee', time: '12 days ago', amount: '-$450.00', isNegative: true, icon: CreditCard },
  ];

  // Filter transactions based on selected filters
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filter by type (positive/negative)
      if (activityFilter.type === 'positive' && transaction.isNegative) return false;
      if (activityFilter.type === 'negative' && !transaction.isNegative) return false;

      // Filter by time period
      if (activityFilter.timePeriod !== 'all') {
        const timeLower = transaction.time.toLowerCase();
        if (activityFilter.timePeriod === 'today' && !timeLower.includes('today')) return false;
        if (activityFilter.timePeriod === 'yesterday' && !timeLower.includes('yesterday')) return false;
        if (activityFilter.timePeriod === 'week') {
          const daysMatch = timeLower.match(/(\d+)\s*days?\s*ago/);
          if (daysMatch) {
            const days = parseInt(daysMatch[1]);
            if (days > 7) return false;
          } else if (!timeLower.includes('today') && !timeLower.includes('yesterday')) {
            return false;
          }
        }
        if (activityFilter.timePeriod === 'month') {
          const daysMatch = timeLower.match(/(\d+)\s*days?\s*ago/);
          if (daysMatch) {
            const days = parseInt(daysMatch[1]);
            if (days > 30) return false;
          }
        }
      }

      return true;
    });
  }, [activityFilter]);

  const tradesInProgress = [
    { 
      symbol: 'AGF Balanced Fund', 
      company: 'AGF Investments', 
      type: 'Buy Order', 
      amount: '$25,000.00', 
      status: 'Pending', 
      client: 'Smith Family Trust',
      plan: 'RRSP - Account: RRSP-984512',
      time: 'Today • 2:45 PM' 
    },
    { 
      symbol: 'TD Canadian Equity Fund', 
      company: 'TD Asset Management', 
      type: 'Sell Order', 
      amount: '$15,000.00', 
      status: 'Processing', 
      client: 'Johnson Retirement Fund',
      plan: 'TFSA - Account: TFSA-984512',
      time: 'Today • 1:30 PM' 
    },
    { 
      symbol: 'RBC Global Bond Fund', 
      company: 'RBC Global Asset Management', 
      type: 'Buy Order', 
      amount: '$10,000.00', 
      status: 'Pending', 
      client: 'Williams Education Savings',
      plan: 'RESP - Account: RESP-782341',
      time: 'Yesterday • 4:20 PM' 
    },
    { 
      symbol: 'Mackenzie Growth Fund', 
      company: 'Mackenzie Investments', 
      type: 'Buy Order', 
      amount: '$30,000.00', 
      status: 'Processing', 
      client: 'Martinez Investment Group',
      plan: 'RRIF - Account: RRIF-456789',
      time: 'Yesterday • 3:15 PM' 
    },
    { 
      symbol: 'CIBC Dividend Fund', 
      company: 'CIBC Asset Management', 
      type: 'Sell Order', 
      amount: '$12,500.00', 
      status: 'Pending', 
      client: 'Brown Family Trust',
      plan: 'Non-Registered - Account: NR-984512',
      time: 'Yesterday • 11:30 AM' 
    },
    { 
      symbol: 'BMO Balanced Fund', 
      company: 'BMO Global Asset Management', 
      type: 'Buy Order', 
      amount: '$18,000.00', 
      status: 'Processing', 
      client: 'Davis Tax-Free Account',
      plan: 'TFSA - Account: TFSA-123456',
      time: '2 days ago • 5:00 PM' 
    },
    { 
      symbol: 'Scotia Global Equity Fund', 
      company: 'Scotia Asset Management', 
      type: 'Buy Order', 
      amount: '$22,000.00', 
      status: 'Pending', 
      client: 'Hamilton Family Trust',
      plan: 'RRSP - Account: RRSP-789012',
      time: '2 days ago • 2:15 PM' 
    },
    { 
      symbol: 'Fidelity Canadian Fund', 
      company: 'Fidelity Investments', 
      type: 'Sell Order', 
      amount: '$8,500.00', 
      status: 'Processing', 
      client: 'Sunrise Portfolio',
      plan: 'LIRA - Account: LIRA-345678',
      time: '3 days ago • 10:45 AM' 
    },
    { 
      symbol: 'Invesco Balanced Fund', 
      company: 'Invesco Canada', 
      type: 'Buy Order', 
      amount: '$20,000.00', 
      status: 'Pending', 
      client: 'Evergreen Wealth',
      plan: 'RRSP - Account: RRSP-234567',
      time: '3 days ago • 9:20 AM' 
    },
    { 
      symbol: 'Manulife Bond Fund', 
      company: 'Manulife Investment Management', 
      type: 'Buy Order', 
      amount: '$14,000.00', 
      status: 'Processing', 
      client: 'Maple Leaf Holdings',
      plan: 'LIF - Account: LIF-901234',
      time: '4 days ago • 3:30 PM' 
    },
  ];

  const rejectedTrades = [
    { 
      symbol: 'CIBC Global Equity Fund', 
      company: 'CIBC Asset Management', 
      type: 'Buy Order', 
      amount: '$35,000.00', 
      client: 'Anderson Family Trust',
      plan: 'RRSP - Account: RRSP-567890',
      rejectionMessage: 'Insufficient funds in account. Required: $35,000.00, Available: $28,500.00',
      time: 'Today • 11:20 AM' 
    },
    { 
      symbol: 'BMO International Fund', 
      company: 'BMO Global Asset Management', 
      type: 'Sell Order', 
      amount: '$20,000.00', 
      client: 'Thompson Retirement',
      plan: 'RRIF - Account: RRIF-789012',
      rejectionMessage: 'Trade rejected due to compliance restrictions. Please contact compliance team.',
      time: 'Yesterday • 3:45 PM' 
    },
    { 
      symbol: 'Fidelity Growth Fund', 
      company: 'Fidelity Investments', 
      type: 'Buy Order', 
      amount: '$15,000.00', 
      client: 'Wilson Education Fund',
      plan: 'RESP - Account: RESP-345678',
      rejectionMessage: 'Please submit required documents before placing a trade.',
      time: '2 days ago • 10:15 AM' 
    },
    { 
      symbol: 'Scotia Dividend Fund', 
      company: 'Scotia Asset Management', 
      type: 'Buy Order', 
      amount: '$12,000.00', 
      client: 'Miller Investment Group',
      plan: 'TFSA - Account: TFSA-456789',
      rejectionMessage: 'Account status inactive. Please reactivate account before trading.',
      time: '3 days ago • 2:30 PM' 
    },
  ];

  const confirmedTrades = [
    { 
      symbol: 'AGF Balanced Fund', 
      company: 'AGF Investments', 
      type: 'Buy Order', 
      amount: '$25,000.00', 
      client: 'Smith Family Trust',
      plan: 'RRSP - Account: RRSP-984512',
      confirmationNumber: 'CONF-2024-001234',
      time: 'Today • 3:15 PM' 
    },
    { 
      symbol: 'TD Canadian Equity Fund', 
      company: 'TD Asset Management', 
      type: 'Sell Order', 
      amount: '$15,000.00', 
      client: 'Johnson Retirement Fund',
      plan: 'TFSA - Account: TFSA-984512',
      confirmationNumber: 'CONF-2024-001189',
      time: 'Today • 1:45 PM' 
    },
    { 
      symbol: 'RBC Global Bond Fund', 
      company: 'RBC Global Asset Management', 
      type: 'Buy Order', 
      amount: '$10,000.00', 
      client: 'Williams Education Savings',
      plan: 'RESP - Account: RESP-782341',
      confirmationNumber: 'CONF-2024-001156',
      time: 'Yesterday • 5:20 PM' 
    },
    { 
      symbol: 'Mackenzie Growth Fund', 
      company: 'Mackenzie Investments', 
      type: 'Buy Order', 
      amount: '$30,000.00', 
      client: 'Martinez Investment Group',
      plan: 'RRIF - Account: RRIF-456789',
      confirmationNumber: 'CONF-2024-001098',
      time: 'Yesterday • 4:10 PM' 
    },
    { 
      symbol: 'CIBC Dividend Fund', 
      company: 'CIBC Asset Management', 
      type: 'Sell Order', 
      amount: '$12,500.00', 
      client: 'Brown Family Trust',
      plan: 'Non-Registered - Account: NR-984512',
      confirmationNumber: 'CONF-2024-001045',
      time: '2 days ago • 2:30 PM' 
    },
  ];

  // All interfaces use the same dashboard layout
  // Removed Intermediary-specific layout - all use OneBoss layout
  if (false) {
    return (
      <PageLayout title="">
        <div className="space-y-6">
          {/* Top Stats Cards - 2 cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {intermediaryTopStatsCards.map((stat, index) => {
              const isClients = stat.label === 'PLAN MEMBERS';
              return (
                <Card 
                  key={index} 
                  className={`border border-gray-200 shadow-sm bg-white ${isClients ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                  onClick={isClients ? () => navigate('/plan-members') : undefined}
                >
                  <CardContent className="flex items-center justify-between py-3 h-[80px]">
                    <div className="space-y-0.5">
                      <CardDescription className="text-gray-500 text-[10px] uppercase tracking-wide">
                        {stat.label}
                      </CardDescription>
                      <CardTitle className="text-base font-semibold text-gray-900">{stat.value}</CardTitle>
                    </div>
                    <div className={`${stat.iconBg} ${stat.iconColor} p-2 rounded-lg`}>
                      <stat.icon className="h-4 w-4" />
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Plans and Trades Pending Cards - 2 cards side by side */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Plans Card - Expandable */}
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent 
                className="flex items-center justify-between py-3 h-[80px] cursor-pointer hover:bg-gray-50 transition-colors"
                onClick={() => setIsPlansExpanded(!isPlansExpanded)}
              >
                <div className="space-y-0.5">
                  <CardDescription className="text-gray-500 text-[10px] uppercase tracking-wide">
                    {plansCard.label}
                  </CardDescription>
                  <CardTitle className="text-base font-semibold text-gray-900">
                    {plansCard.value}
                  </CardTitle>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`${plansCard.iconBg} ${plansCard.iconColor} p-2 rounded-lg`}>
                    <plansCard.icon className="h-4 w-4" />
                  </div>
                  {isPlansExpanded ? (
                    <ChevronUp className="h-3 w-3 text-gray-400" />
                  ) : (
                    <ChevronDown className="h-3 w-3 text-gray-400" />
                  )}
                </div>
              </CardContent>
            {isPlansExpanded && (
              <CardContent className="pt-0 pb-3">
                <div className="space-y-1.5">
                  {planTypes.map((plan, index) => {
                    const percentage = totalAUA > 0 ? ((plan.aua / totalAUA) * 100).toFixed(1) : '0.0';
                    const showPercentage = ['RRSP', 'RRIF', 'OPEN', 'Other'].includes(plan.type);
                    
                    return (
                      <div
                        key={index}
                        className={`flex items-center justify-between p-2 rounded-lg border border-gray-200 ${plan.hoverColor} transition-colors`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-medium text-gray-900">{plan.type}:</span>
                          <span className="text-xs text-gray-700">{formatCurrency(plan.aua)}</span>
                          {showPercentage && (
                            <span className="text-xs text-gray-500">({percentage}%)</span>
                          )}
                        </div>
                        <span className="text-xs text-gray-600">({plan.count} accounts)</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            )}
          </Card>

            {/* Trades Pending Card */}
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="flex items-center justify-between py-3 h-[80px]">
                <div className="space-y-0.5">
                  <CardDescription className="text-gray-500 text-[10px] uppercase tracking-wide">
                    {tradesPendingCard.label}
                  </CardDescription>
                  <CardTitle className="text-base font-semibold text-gray-900">{tradesPendingCard.value}</CardTitle>
                </div>
                <div className={`${tradesPendingCard.iconBg} ${tradesPendingCard.iconColor} p-2 rounded-lg`}>
                  <tradesPendingCard.icon className="h-4 w-4" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity and Trades Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Activity - Left Side */}
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-gray-900">Recent Activity</CardTitle>
                  <Select value={activityFilter.timePeriod} onValueChange={(value) => setActivityFilter({ ...activityFilter, timePeriod: value as any })}>
                    <SelectTrigger className="w-[120px] h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Time</SelectItem>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px]">
                  <div className="space-y-2 p-4">
                    {filteredTransactions.slice(0, 15).map((transaction, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="bg-gray-100 p-2 rounded-lg flex-shrink-0">
                            <transaction.icon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{transaction.name}</p>
                            <p className="text-xs text-gray-500">{transaction.time}</p>
                          </div>
                        </div>
                        <div className={`text-sm font-semibold flex items-center gap-1 flex-shrink-0 ${
                          transaction.isNegative ? 'text-red-600' : 'text-green-600'
                        }`}>
                          {transaction.isNegative ? (
                            <ArrowUpRight className="h-4 w-4" />
                          ) : (
                            <ArrowDownRight className="h-4 w-4" />
                          )}
                          {transaction.amount}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                <div className="p-4 border-t border-gray-200">
                  <Button variant="outline" size="sm" className="w-full text-xs">
                    View all transactions
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Trades Section - Right Side */}
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-0">
                <Tabs value={activeTradeTab} onValueChange={(value) => setActiveTradeTab(value as any)} className="w-full">
                  <div className="px-4 pt-2 border-b border-gray-200">
                    <TabsList className="grid w-full grid-cols-3 bg-transparent">
                      <TabsTrigger 
                        value="progress" 
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs"
                      >
                        Trades in Progress
                      </TabsTrigger>
                      <TabsTrigger 
                        value="rejected"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs"
                      >
                        Rejected Trades
                      </TabsTrigger>
                      <TabsTrigger 
                        value="confirmed"
                        className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-xs"
                      >
                        Trades Confirmed
                      </TabsTrigger>
                    </TabsList>
                  </div>
                  
                  <TabsContent value="progress" className="m-0">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-3 p-4">
                        {tradesInProgress.map((trade, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{trade.symbol}</p>
                                <p className="text-xs text-gray-500">{trade.company}</p>
                              </div>
                              <Badge 
                                className={
                                  trade.status === 'Pending' 
                                    ? 'bg-orange-100 text-orange-700' 
                                    : 'bg-blue-100 text-blue-700'
                                }
                              >
                                {trade.status}
                              </Badge>
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
                              <p><span className="font-medium">Client:</span> {trade.client}</p>
                              <p><span className="font-medium">Plan:</span> {trade.plan}</p>
                              <p><span className="font-medium">Type:</span> {trade.type}</p>
                              <p><span className="font-medium">Amount:</span> {trade.amount}</p>
                              <p className="text-gray-500">{trade.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                    <div className="p-4 border-t border-gray-200">
                      <Button variant="outline" size="sm" className="w-full text-xs">
                        View all trades
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="rejected" className="m-0">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-3 p-4">
                        {rejectedTrades.map((trade, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{trade.symbol}</p>
                                <p className="text-xs text-gray-500">{trade.company}</p>
                              </div>
                              <Badge className="bg-red-100 text-red-700">Rejected</Badge>
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
                              <p><span className="font-medium">Client:</span> {trade.client}</p>
                              <p><span className="font-medium">Plan:</span> {trade.plan}</p>
                              <p><span className="font-medium">Type:</span> {trade.type}</p>
                              <p><span className="font-medium">Amount:</span> {trade.amount}</p>
                              <p className="text-red-600 mt-2"><span className="font-medium">Reason:</span> {trade.rejectionMessage}</p>
                              <p className="text-gray-500">{trade.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>

                  <TabsContent value="confirmed" className="m-0">
                    <ScrollArea className="h-[500px]">
                      <div className="space-y-3 p-4">
                        {confirmedTrades.map((trade, index) => (
                          <div
                            key={index}
                            className="p-4 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <p className="text-sm font-semibold text-gray-900">{trade.symbol}</p>
                                <p className="text-xs text-gray-500">{trade.company}</p>
                              </div>
                              <Badge className="bg-green-100 text-green-700">Confirmed</Badge>
                            </div>
                            <div className="space-y-1 text-xs text-gray-600">
                              <p><span className="font-medium">Client:</span> {trade.client}</p>
                              <p><span className="font-medium">Plan:</span> {trade.plan}</p>
                              <p><span className="font-medium">Type:</span> {trade.type}</p>
                              <p><span className="font-medium">Amount:</span> {trade.amount}</p>
                              <p><span className="font-medium">Confirmation:</span> {trade.confirmationNumber}</p>
                              <p className="text-gray-500">{trade.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageLayout>
    );
  }

  // OneBoss Dashboard Layout (existing)
  return (
    <PageLayout title="">
      <div className="space-y-6">
        {/* Advisor Snapshot */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {statsCards.map((stat, index) => {
            const isFundFamilies = stat.label === 'Fund Families';
            if (isFundFamilies) {
              return (
                <Card key={index} className="border border-gray-200 shadow-sm bg-white min-h-[88px]">
                  <CardContent className="flex items-center justify-center py-4 h-full min-h-[88px]" />
                </Card>
              );
            }
            const isGroupAssets = stat.label === 'Group Assets';
            const displayValue = isGroupAssets ? formatCurrency(totalAUA) : stat.value;
            const cardContent = (
              <Card 
                key={index} 
                className={`border border-gray-200 shadow-sm bg-white ${stat.label === 'Members' ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}`}
                onClick={stat.label === 'Members' ? () => navigate('/plan-members') : undefined}
              >
                <CardContent className="flex items-center justify-between py-4">
                  <div className="space-y-1">
                    <CardDescription className="text-gray-500 text-xs uppercase tracking-wide">
                      {stat.label}
                    </CardDescription>
                    <CardTitle className="text-xl font-semibold text-gray-900">{displayValue}</CardTitle>
                  </div>
                  <div className={`${stat.iconBg} ${stat.iconColor} p-3 rounded-lg`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                </CardContent>
              </Card>
            );
            const cardWithTooltip = 'tooltip' in stat && stat.tooltip ? (
              <TooltipProvider key={index}>
                <Tooltip>
                  <TooltipTrigger asChild>{cardContent}</TooltipTrigger>
                  <TooltipContent side="top" className="max-w-xs">
                    <p>{stat.tooltip}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ) : cardContent;
            return cardWithTooltip;
          })}
        </div>

        {/* Top Fund Categories */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Top Fund Categories</h2>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              Reports
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fundCategories.map((category, index) => {
              const percentage = (category.amount / maxAmount) * 100;
              return (
                <Card key={index} className="border border-gray-200 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <CardDescription className="text-gray-500 text-sm font-medium">
                        {category.label}
                      </CardDescription>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {category.value}
              </CardTitle>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div
                        className={`${category.color} h-2 rounded-full transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                  </div>
            </CardContent>
          </Card>
              );
            })}
          </div>
        </div>

        {/* Charts and Analytics */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Charts and Analytics</h2>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-8 text-xs shrink-0"
              onClick={() => setShowWidgetConfig(!showWidgetConfig)}
            >
              <Settings className="h-3 w-3 mr-1" />
              {showWidgetConfig ? 'Hide Configure' : 'Configure'}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {/* Assets By Plan Type */}
            {activeWidgets.has('assetsByPlanType') && (
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-900">Assets By Plan Type</CardTitle>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={assetsByPlanType}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={55}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive
                      animationDuration={400}
                      animationBegin={0}
                      animationEasing="cubic-bezier(0.33, 1, 0.68, 1)"
                    >
                      {assetsByPlanType.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const count = data.count || 0;
                          const name = data.name || '';
                          return (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                              <p className="text-sm font-medium text-gray-900">{name}:</p>
                              <p className="text-sm text-gray-700">{count} {count === 1 ? 'Plan' : 'Plans'}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-gray-700">RRSP: {rrspPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-700">RRIF: {rrifPercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-gray-700">OPEN: {openPercentage.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                      <span className="text-xs text-gray-700">Other: {otherPercentage.toFixed(1)}%</span>
                    </div>
                  </div>
                </div>
            </CardContent>
          </Card>
            )}

            {/* Contributions by Plan Type */}
            {activeWidgets.has('contributionsByPlanType') && (
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle className="text-sm font-semibold text-gray-900">Contributions by Plan Type</CardTitle>
                <Select value={contributionsPeriod} onValueChange={(v) => setContributionsPeriod(v as typeof contributionsPeriod)}>
                  <SelectTrigger className="h-7 w-[72px] text-xs py-0 min-h-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="min-w-0">
                    <SelectItem value="MTD" className="text-xs py-1.5">MTD</SelectItem>
                    <SelectItem value="QTD" className="text-xs py-1.5">QTD</SelectItem>
                    <SelectItem value="YTD" className="text-xs py-1.5">YTD</SelectItem>
                    <SelectItem value="All" className="text-xs py-1.5">All</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <p className="text-xs font-medium text-gray-700 mt-1 py-4">
                Total Contributions (Selected Period): {formatCurrency(totalContributionsSelectedPeriod)}
              </p>
            </CardHeader>
            <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart
                    data={contributionsByPlanTypeData}
                    margin={{ top: 4, right: 8, left: 4, bottom: 24 }}
                  >
                    <XAxis dataKey="planType" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                    <YAxis
                      type="number"
                      tickFormatter={(v) => (v >= 1000 ? `$${v / 1000}k` : `$${v}`)}
                      tick={{ fontSize: 10 }}
                      tickLine={false}
                      axisLine={false}
                      width={36}
                    />
                    <RechartsTooltip
                      content={({ active, payload, label }) => {
                        if (!active || !payload?.length || !label) return null;
                        const row = payload[0]?.payload as (typeof contributionsByPlanTypeData)[0];
                        const employee = row?.employeeContributions ?? 0;
                        const employer = row?.employerContributions ?? 0;
                        const total = employee + employer;
                        return (
                          <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2 min-w-[160px]">
                            <p className="text-sm font-medium text-gray-900">{label}</p>
                            <p className="text-xs text-gray-600">Employee: {formatCurrency(employee)}</p>
                            <p className="text-xs text-gray-600">Employer (Match/Company): {formatCurrency(employer)}</p>
                            <p className="text-xs font-medium text-gray-900 mt-1 pt-1 border-t border-gray-100">Total: {formatCurrency(total)}</p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="emptyPlaceholder" name="" stackId="contributions" fill="#e5e7eb" radius={[0, 2, 2, 0]} isAnimationActive={false} />
                    <Bar dataKey="employeeContributions" name="Employee" stackId="contributions" fill="#3b82f6" radius={[0, 2, 2, 0]} />
                    <Bar dataKey="employerContributions" name="Employer (Match/Company)" stackId="contributions" fill="#10b981" radius={[0, 2, 2, 0]} />
                  </BarChart>
                </ResponsiveContainer>
                <div className="flex items-center justify-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-blue-500" />
                    <span className="text-xs text-gray-700">Employee</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-sm bg-green-500" />
                    <span className="text-xs text-gray-700">Employer (Match/Company)</span>
                  </div>
                </div>
            </CardContent>
          </Card>
            )}

            {/* Plans Overview: Group RRSP, TFSA, DPSP + All Plans aggregate */}
            {activeWidgets.has('plansOverview') && (
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-gray-900">Plans Overview</CardTitle>
            </CardHeader>
            <CardContent className="py-4">
              <div className="grid grid-cols-2 gap-3 min-h-[140px]">
                {contributionsByPlanTypeData.map((row) => {
                  const total = row.employeeContributions + row.employerContributions;
                  const iconHoverClasses: Record<string, string> = {
                    'Group RRSP': 'group-hover:text-blue-600',
                    'TFSA': 'group-hover:text-emerald-600',
                    'DPSP': 'group-hover:text-violet-600',
                  };
                  const iconMap: Record<string, React.ReactNode> = {
                    'Group RRSP': <BriefcaseBusiness className={`h-6 w-6 text-gray-600 transition-colors ${iconHoverClasses[row.planType]}`} />,
                    'TFSA': <Wallet2 className={`h-6 w-6 text-gray-600 transition-colors ${iconHoverClasses[row.planType]}`} />,
                    'DPSP': <Building2 className={`h-6 w-6 text-gray-600 transition-colors ${iconHoverClasses[row.planType]}`} />,
                  };
                  return (
                    <div
                      key={row.planType}
                      className="group flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4 cursor-default"
                    >
                      <span className="mb-2" aria-hidden>{iconMap[row.planType]}</span>
                      <p className="text-xs font-medium text-gray-600 text-center">{row.planType}</p>
                      <p className="text-sm font-semibold text-gray-900 mt-2 text-center">
                        {formatCurrency(total)}
                      </p>
                    </div>
                  );
                })}
                <div className="group flex flex-col items-center justify-center rounded-lg border border-gray-200 bg-gray-50 p-4 cursor-default">
                  <Layers className="h-6 w-6 text-gray-600 mb-2 transition-colors group-hover:text-amber-600" aria-hidden />
                  <p className="text-xs font-medium text-gray-600 text-center">All Plans</p>
                  <p className="text-sm font-semibold text-gray-900 mt-2 text-center">
                    {formatCurrency(totalContributionsSelectedPeriod)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
            )}

            {/* Total Assets */}
            {activeWidgets.has('assetsBySupplier') && (
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-900">Total Assets</CardTitle>
            </CardHeader>
              <CardContent>
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => setSplitView(v => !v)}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSplitView(v => !v); } }}
                  onMouseEnter={() => setTotalAssetsChartHovered(true)}
                  onMouseLeave={() => setTotalAssetsChartHovered(false)}
                  aria-label="Toggle AUA/AUM split"
                  className="cursor-pointer transition-[opacity,transform] duration-200 ease-out"
                  style={{ outline: 'none' }}
                >
                  {splitView && (
                    <svg width={0} height={0} aria-hidden="true">
                      <defs>
                        <pattern id="blueHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                          <rect width="8" height="8" fill="#3b82f6" />
                          <line x1="0" y1="4" x2="8" y2="4" stroke="#ffffff" strokeWidth="1.5" opacity="1" />
                        </pattern>
                        <pattern id="greenHatch" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                          <rect width="8" height="8" fill="#10b981" />
                          <line x1="0" y1="4" x2="8" y2="4" stroke="#ffffff" strokeWidth="1.5" opacity="1" />
                        </pattern>
                      </defs>
                    </svg>
                  )}
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={splitView ? totalAssetsSplitData : totalAssetsData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={55}
                        fill="#8884d8"
                        dataKey="value"
                        isAnimationActive
                        animationDuration={400}
                        animationBegin={0}
                        animationEasing="cubic-bezier(0.33, 1, 0.68, 1)"
                      >
                        {splitView
                          ? totalAssetsSplitData.map((entry, index) => (
                              <Cell
                                key={entry.key}
                                fill={entry.pattern ? (entry.color === '#3b82f6' ? 'url(#blueHatch)' : 'url(#greenHatch)') : entry.color}
                              />
                            ))
                          : totalAssetsData.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                      </Pie>
                      <RechartsTooltip 
                        cursor={false}
                        wrapperStyle={{ pointerEvents: 'none' }}
                        content={({ active, payload }) => {
                          if (!totalAssetsChartHovered) return null;
                          if (active && payload && payload.length) {
                            const data = payload[0].payload;
                            if (splitView) {
                              const value = data.value != null ? data.value : 0;
                              const name = data.name || '';
                              return (
                                <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                                  <p className="text-sm font-medium text-gray-900">{name}:</p>
                                  <p className="text-sm text-gray-700">{formatCurrency(value)}</p>
                                </div>
                              );
                            }
                            const amount = data.amount || 0;
                            const name = data.name || '';
                            return (
                              <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                                <p className="text-sm font-medium text-gray-900">{name}:</p>
                                <p className="text-sm text-gray-700">{formatCurrency(amount)}</p>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                      <span className="text-xs text-gray-700">Net Invested: {formatCurrency(netInvestedAmount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-700">Growth: {formatCurrency(growthAmount)}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                      <span className="text-xs text-gray-700">IRR: {irrPercentage}%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-xs font-semibold text-gray-900">Total Assets</span>
                  </div>
                </div>
            </CardContent>
          </Card>
            )}

            {/* KYC */}
            {activeWidgets.has('eStatementSignup') && (
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-900">KYC</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={150}>
                  <PieChart>
                    <Pie
                      data={kycData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={55}
                      fill="#8884d8"
                      dataKey="value"
                      isAnimationActive
                      animationDuration={400}
                      animationBegin={0}
                      animationEasing="cubic-bezier(0.33, 1, 0.68, 1)"
                    >
                      {kycData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          const data = payload[0].payload;
                          const count = data.count || 0;
                          const name = data.name || '';
                          return (
                            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-2">
                              <p className="text-sm font-medium text-gray-900">{name}:</p>
                              <p className="text-sm text-gray-700">{count}</p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="mt-3 space-y-1.5">
                  <div className="flex items-center justify-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-xs text-gray-700">Expired: 20%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-xs text-gray-700">Expiring &lt; 60 Days: 15%</span>
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-xs text-gray-700">Valid: 65%</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}

            {/* Analyze My Book - completely blank tile */}
            {activeWidgets.has('topFiveClients') && (
            <Card className="border border-gray-200 shadow-sm bg-white min-h-[160px]" />
            )}
                      </div>
          {showWidgetConfig && (
            <Card className="border border-gray-200 shadow-sm bg-white mt-4">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-semibold text-gray-900">
                  Widget Configuration ({activeWidgets.size}/4 Active)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {allWidgets.map((widget) => {
                    const isActive = activeWidgets.has(widget.id);
                    return (
                      <div
                        key={widget.id}
                        onClick={() => toggleWidget(widget.id)}
                        className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-colors ${
                          isActive
                            ? 'bg-gray-900 text-white border-gray-900'
                            : 'bg-white border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <span className={`text-sm font-medium ${isActive ? 'text-white' : 'text-gray-900'}`}>
                          {widget.name}
                        </span>
                        {isActive && <CheckCircle2 className="h-4 w-4 text-white" />}
                    </div>
                    );
                  })}
                      </div>
                <p className="text-xs text-gray-500">
                  Click widgets to toggle them on/off. Maximum 4 widgets can be active at once.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Work In Progress */}
                              <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900">Work In Progress</h2>
            <Button variant="outline" size="sm" className="h-8 text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Add New
            </Button>
                </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {workInProgress.map((category, index) =>
              (category as { blank?: boolean }).blank ? (
                <Card key={index} className="border border-gray-200 shadow-sm bg-white min-h-[160px]" />
              ) : (
              <Card key={index} className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <div className={`${category.iconBg} p-2 rounded-lg`}>
                      <category.icon className="h-4 w-4 text-white" />
                            </div>
                    <CardTitle className="text-sm font-semibold text-gray-900">{category.title}</CardTitle>
                          </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-2 bg-white hover:bg-gray-50 transition-colors"
                    >
                      <span className="text-xs text-gray-700">{item.label}</span>
                      <span className="text-sm font-semibold text-gray-900">{item.count}</span>
                        </div>
                      ))}
              </CardContent>
            </Card>
            )
            )}
          </div>
        </div>
      </div>

      {/* Add Plan Dialog - Multi-Step Wizard */}
      <Dialog open={showAddPlan} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            {currentStep === 0 ? (
              <DialogTitle>Select Plan Type</DialogTitle>
            ) : currentStep === 4 ? (
              <DialogTitle className="flex items-center gap-2 text-gray-900">
                <Plus className="h-5 w-5" />
                Add Product
              </DialogTitle>
            ) : (
              <DialogTitle>
                Plan Setup - {formValues.type}
              </DialogTitle>
            )}
          </DialogHeader>

          {currentStep === 0 ? (
            /* Step 0: Select Plan Type */
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="planType" className="text-sm font-medium text-gray-700">
                  Plan Type
                </Label>
                <Select
                  value={formValues.type}
                  onValueChange={(value) =>
                    setFormValues({ ...formValues, type: value as PlanType })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a plan type..." />
                  </SelectTrigger>
                  <SelectContent>
                    {planTypeOptions.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="w-full flex justify-center pt-2">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                        currentStep === step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step + 1}
                    </div>
                  ))}
                </div>
              </div>
              <DialogFooter className="flex-row items-center">
                <div className="flex-1"></div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!formValues.type}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </DialogFooter>
            </div>
          ) : currentStep === 1 ? (
            /* Step 1: Owner/Annuitant and Beneficiary */
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="ownerName" className="text-sm font-medium text-gray-700">
                  Owner/Annuitant Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="ownerName"
                  value={formValues.ownerName}
                  onChange={(e) =>
                    setFormValues({ ...formValues, ownerName: e.target.value })
                  }
                  placeholder="John Smith"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiaryName" className="text-sm font-medium text-gray-700">
                  Beneficiary Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="beneficiaryName"
                  value={formValues.beneficiaryName}
                  onChange={(e) =>
                    setFormValues({ ...formValues, beneficiaryName: e.target.value })
                  }
                  placeholder="Enter beneficiary name"
                  className="w-full"
                />
              </div>

              <div className="w-full flex justify-center pt-2">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                        currentStep === step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step + 1}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex-row items-center">
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <div className="flex-1"></div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={!formValues.ownerName || !formValues.beneficiaryName}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </DialogFooter>
            </div>
          ) : currentStep === 2 ? (
            /* Step 2: Intermediary Codes */
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="intermediaryCode" className="text-sm font-medium text-gray-700">
                  Intermediary Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="intermediaryCode"
                  value={formValues.intermediaryCode}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 10);
                    setFormValues({ ...formValues, intermediaryCode: value });
                  }}
                  maxLength={10}
                  placeholder="Enter intermediary code (max 10 characters)"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  {formValues.intermediaryCode.length}/10 characters
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="intermediaryAccountCode" className="text-sm font-medium text-gray-700">
                  Intermediary Account Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="intermediaryAccountCode"
                  value={formValues.intermediaryAccountCode}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 10);
                    setFormValues({ ...formValues, intermediaryAccountCode: value });
                  }}
                  maxLength={10}
                  placeholder="Enter intermediary account code (max 10 characters)"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">
                  {formValues.intermediaryAccountCode.length}/10 characters
                </p>
              </div>

              <div className="w-full flex justify-center pt-2">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                        currentStep === step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step + 1}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex-row items-center">
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <div className="flex-1"></div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      !formValues.intermediaryCode ||
                      !formValues.intermediaryAccountCode
                    }
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </DialogFooter>
            </div>
          ) : currentStep === 3 ? (
            /* Step 3: Objectives, Risk Tolerance, Time Horizon */
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
                  Notes (Optional)
                </Label>
                <textarea
                  id="notes"
                  value={formValues.notes}
                  onChange={(e) =>
                    setFormValues({ ...formValues, notes: e.target.value })
                  }
                  placeholder="Enter any additional notes..."
                  className="w-full min-h-[100px] rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objectives" className="text-sm font-medium text-gray-700">
                  Objectives <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="objectives"
                  value={formValues.objectives}
                  onChange={(e) =>
                    setFormValues({ ...formValues, objectives: e.target.value })
                  }
                  placeholder="Enter plan objectives"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="riskTolerance" className="text-sm font-medium text-gray-700">
                  Risk Tolerance <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formValues.riskTolerance}
                  onValueChange={(value) =>
                    setFormValues({ ...formValues, riskTolerance: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select risk tolerance..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conservative">Conservative</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Aggressive">Aggressive</SelectItem>
                    <SelectItem value="Very Aggressive">Very Aggressive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeHorizon" className="text-sm font-medium text-gray-700">
                  Time Horizon (Years) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="timeHorizon"
                  type="number"
                  min="1"
                  max="50"
                  value={formValues.timeHorizon}
                  onChange={(e) =>
                    setFormValues({ ...formValues, timeHorizon: e.target.value })
                  }
                  placeholder="Enter time horizon (1-50 years)"
                  className="w-full"
                />
              </div>

              <div className="w-full flex justify-center pt-2">
                <div className="flex gap-1.5 items-center">
                  {[0, 1, 2, 3].map((step) => (
                    <div
                      key={step}
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                        currentStep === step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step + 1}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex-row items-center">
                <Button variant="outline" onClick={handlePreviousStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <div className="flex-1"></div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      !formValues.objectives ||
                      !formValues.riskTolerance ||
                      !formValues.timeHorizon ||
                      parseInt(formValues.timeHorizon) < 1 ||
                      parseInt(formValues.timeHorizon) > 50
                    }
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </div>
          ) : currentStep === 4 && createdPlan ? (
            /* Step 4: Success Screen with Add Product */
            <div className="space-y-6 py-4">
              {/* Success Message */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="pt-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        New Plan Created Successfully!
                      </h3>
                      <div className="space-y-1 text-sm text-gray-700">
                        <p>
                          <span className="font-medium">Plan Type:</span>{" "}
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                            {createdPlan.type}
                          </Badge>
                        </p>
                        <p>
                          <span className="font-medium">Plan ID:</span>{" "}
                          <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                            {createdPlan.id}
                          </Badge>
                        </p>
                        <p>
                          <span className="font-medium">Account Number:</span>{" "}
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                            {createdPlan.accountNumber}
                          </Badge>
                        </p>
                        <p>
                          <span className="font-medium">Owner:</span> {createdPlan.clientName}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Account CAD */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="pt-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-green-600">
                        $ Trust Account CAD
                      </span>
                    </div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatCurrency(1250)}
                    </div>
                    <div className="flex gap-3 text-xs pt-1.5 border-t border-gray-200">
                      <span className="text-green-600">Settled: {formatCurrency(1250)}</span>
                      <span className="text-red-600">Unsettled: {formatCurrency(0)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add Product Form */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fundCompany" className="text-sm font-medium text-gray-700">
                    Select Fund Company
                  </Label>
                  <Popover open={openFundCompany} onOpenChange={setOpenFundCompany}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={openFundCompany}
                        className="w-full justify-between text-left font-normal"
                      >
                        {selectedFundCompany || "Choose a company that offers funds"}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent 
                      className="w-[var(--radix-popover-trigger-width)] max-w-none p-0" 
                      align="start" 
                      side="bottom"
                      style={{ maxWidth: 'calc(100vw - 2rem)' }}
                    >
                      <Command className="max-h-[300px]">
                        <CommandInput placeholder="Search company..." className="h-9" />
                        <CommandList className="max-h-[250px] overflow-y-auto overflow-x-hidden">
                          <CommandEmpty>No company found.</CommandEmpty>
                          <CommandGroup>
                            {fundCompanies.map((company) => (
                              <CommandItem
                                key={company}
                                value={company}
                                onSelect={() => {
                                  setSelectedFundCompany(company === selectedFundCompany ? "" : company);
                                  setSelectedProduct(""); // Reset product when company changes
                                  setOpenFundCompany(false);
                                }}
                              >
                                {company}
                                <Check
                                  className={`ml-auto h-4 w-4 ${
                                    selectedFundCompany === company ? "opacity-100" : "opacity-0"
                                  }`}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Select Product - Only show when fund company is selected */}
                {selectedFundCompany && (
                  <div className="space-y-2">
                    <Label htmlFor="product" className="text-sm font-medium text-gray-700">
                      Select Product
                    </Label>
                    <Popover open={openProduct} onOpenChange={setOpenProduct}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openProduct}
                          className="w-full justify-between text-left font-normal"
                        >
                          {selectedProduct || "Choose a product from " + selectedFundCompany}
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent 
                        className="w-[var(--radix-popover-trigger-width)] max-w-none p-0" 
                        align="start" 
                        side="bottom"
                        style={{ maxWidth: 'calc(100vw - 2rem)' }}
                      >
                        <Command className="max-h-[300px]">
                          <CommandInput placeholder="Search product..." className="h-9" />
                          <CommandList className="max-h-[250px] overflow-y-auto overflow-x-hidden">
                            <CommandEmpty>No product found.</CommandEmpty>
                            <CommandGroup>
                              {fundProducts.map((product) => (
                                <CommandItem
                                  key={product.code}
                                  value={product.name}
                                  onSelect={() => {
                                    setSelectedProduct(product.name === selectedProduct ? "" : product.name);
                                    setOpenProduct(false);
                                  }}
                                >
                                  <div className="flex flex-col">
                                    <span className="font-medium">{product.name}</span>
                                    <span className="text-xs text-gray-500">{product.code}</span>
                                  </div>
                                  <Check
                                    className={`ml-auto h-4 w-4 ${
                                      selectedProduct === product.name ? "opacity-100" : "opacity-0"
                                    }`}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="investmentAmount" className="text-sm font-medium text-gray-700">
                    Investment Amount ($)
                  </Label>
                  <Input
                    id="investmentAmount"
                    type="number"
                    value={investmentAmount}
                    onChange={(e) => setInvestmentAmount(e.target.value)}
                    placeholder="Enter amount to invest"
                    className="w-full"
                  />
                </div>

                {/* Order Preview */}
                <Card className="border border-gray-200 bg-white">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-900">Order Preview:</p>
                      <p className="text-sm text-gray-700">
                        Amount: {formatCurrency(parseFloat(investmentAmount) || 0)}
                      </p>
                      <p className="text-xs text-gray-600">
                        This will purchase the selected fund with the specified amount
                      </p>
                      {parseFloat(investmentAmount) > 1250 && (
                        <div className="flex items-start gap-2 pt-2 border-t border-gray-200">
                          <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 shrink-0" />
                          <p className="text-xs text-orange-600">
                            ⚠️ Purchase amount exceeds settled balance ({formatCurrency(1250)}) - this order may require additional funds
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    if (selectedFundCompany && selectedProduct && investmentAmount) {
                      const now = new Date();
                      const timeString = now.toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true
                      });
                      
                      // Find the product code/symbol
                      const selectedProductData = fundProducts.find(p => p.name === selectedProduct);
                      
                      setOrderDetails({
                        company: selectedFundCompany,
                        product: selectedProduct,
                        symbol: selectedProductData?.code || '',
                        amount: investmentAmount,
                        time: timeString,
                      });
                      
                      // Close the Add Product dialog first
                      setShowAddPlan(false);
                      // Then show the confirmation dialog
                      setTimeout(() => {
                        setShowOrderConfirmation(true);
                      }, 100);
                    }
                  }}
                  disabled={!selectedFundCompany || !selectedProduct || !investmentAmount}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  Place Order
                </Button>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Order Confirmation Dialog */}
      <Dialog open={showOrderConfirmation} onOpenChange={setShowOrderConfirmation}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-gray-900">
              <CheckCircle2 className="h-5 w-5 text-green-600" />
              Investment Order Confirmed
            </DialogTitle>
          </DialogHeader>

          {orderDetails && (
            <div className="space-y-4 py-4">
              {/* Order Details */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="pt-4">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-gray-900 mb-3">Order Details:</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Company:</span>
                        <span className="font-medium text-gray-900">{orderDetails.company}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Fund:</span>
                        <span className="font-medium text-gray-900">{orderDetails.product}</span>
                      </div>
                      {orderDetails.symbol && (
                        <div className="flex justify-between">
                          <span className="text-gray-600">Symbol:</span>
                          <span className="font-medium text-gray-900">{orderDetails.symbol}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-medium text-gray-900">{formatCurrency(parseFloat(orderDetails.amount))}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium text-gray-900">{orderDetails.time}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Processing Status */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="pt-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-900">Processing Status:</span>
                      <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                        Pending
                      </Badge>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <p className="text-xs text-gray-600">
                        Order will be processed at next market close
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => {
                setShowOrderConfirmation(false);
                setOrderDetails(null);
                resetForm();
              }}
              className="bg-gray-900 hover:bg-gray-800 text-white w-full"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* New Client Dialog - Multi-Step Wizard */}
      <Dialog open={showNewClient} onOpenChange={handleCloseClientDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {clientCurrentStep === 0 
                ? "Client Information" 
                : "Beneficiary Information"}
            </DialogTitle>
          </DialogHeader>

          {clientCurrentStep === 0 ? (
            /* Step 1: Basic Client Information */
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="firstName"
                    value={clientFormValues.firstName}
                    onChange={(e) =>
                      setClientFormValues({ ...clientFormValues, firstName: e.target.value })
                    }
                    placeholder="Enter first name"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="lastName"
                    value={clientFormValues.lastName}
                    onChange={(e) =>
                      setClientFormValues({ ...clientFormValues, lastName: e.target.value })
                    }
                    placeholder="Enter last name"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sin" className="text-sm font-medium text-gray-700">
                  SIN <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sin"
                  value={clientFormValues.sin}
                  onChange={(e) =>
                    setClientFormValues({ ...clientFormValues, sin: e.target.value })
                  }
                  placeholder="000-000-000"
                  className="w-full"
                  maxLength={11}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Phone <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={clientFormValues.phone}
                    onChange={(e) =>
                      setClientFormValues({ ...clientFormValues, phone: e.target.value })
                    }
                    placeholder="(000) 000-0000"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={clientFormValues.email}
                    onChange={(e) =>
                      setClientFormValues({ ...clientFormValues, email: e.target.value })
                    }
                    placeholder="email@example.com"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth" className="text-sm font-medium text-gray-700">
                  Date of Birth <span className="text-red-500">*</span>
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {clientDateOfBirth ? format(clientDateOfBirth, "PPP") : <span className="text-gray-500">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={clientDateOfBirth || undefined}
                      onSelect={(date) => {
                        setClientDateOfBirth(date || null);
                        setClientFormValues({ ...clientFormValues, dateOfBirth: date || null });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="address"
                  value={clientFormValues.address}
                  onChange={(e) =>
                    setClientFormValues({ ...clientFormValues, address: e.target.value })
                  }
                  placeholder="Enter full address"
                  className="w-full"
                />
              </div>

              <div className="w-full flex justify-center pt-2">
                <div className="flex gap-1.5 items-center">
                  {[0, 1].map((step) => (
                    <div
                      key={step}
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                        clientCurrentStep === step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step + 1}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex-row items-center">
                <div className="flex-1"></div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCloseClientDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleClientNextStep}
                    disabled={!clientFormValues.firstName || !clientFormValues.lastName || !clientFormValues.sin || !clientFormValues.phone || !clientFormValues.email || !clientDateOfBirth || !clientFormValues.address}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Next
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </DialogFooter>
            </div>
          ) : clientCurrentStep === 1 ? (
            /* Step 2: Beneficiary Information */
            <div className="space-y-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="beneficiaryFirstName" className="text-sm font-medium text-gray-700">
                    Beneficiary First Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="beneficiaryFirstName"
                    value={clientFormValues.beneficiaryFirstName}
                    onChange={(e) =>
                      setClientFormValues({ ...clientFormValues, beneficiaryFirstName: e.target.value })
                    }
                    placeholder="Enter first name"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="beneficiaryLastName" className="text-sm font-medium text-gray-700">
                    Beneficiary Last Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="beneficiaryLastName"
                    value={clientFormValues.beneficiaryLastName}
                    onChange={(e) =>
                      setClientFormValues({ ...clientFormValues, beneficiaryLastName: e.target.value })
                    }
                    placeholder="Enter last name"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiaryRelationship" className="text-sm font-medium text-gray-700">
                  Relationship <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={clientFormValues.beneficiaryRelationship}
                  onValueChange={(value) =>
                    setClientFormValues({ ...clientFormValues, beneficiaryRelationship: value })
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select relationship..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Spouse">Spouse</SelectItem>
                    <SelectItem value="Child">Child</SelectItem>
                    <SelectItem value="Parent">Parent</SelectItem>
                    <SelectItem value="Sibling">Sibling</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiarySIN" className="text-sm font-medium text-gray-700">
                  Beneficiary SIN
                </Label>
                <Input
                  id="beneficiarySIN"
                  value={clientFormValues.beneficiarySIN}
                  onChange={(e) =>
                    setClientFormValues({ ...clientFormValues, beneficiarySIN: e.target.value })
                  }
                  placeholder="000-000-000"
                  className="w-full"
                  maxLength={11}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiaryEmail" className="text-sm font-medium text-gray-700">
                  Beneficiary Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="beneficiaryEmail"
                  type="email"
                  value={clientFormValues.beneficiaryEmail}
                  onChange={(e) =>
                    setClientFormValues({ ...clientFormValues, beneficiaryEmail: e.target.value })
                  }
                  placeholder="email@example.com"
                  className="w-full"
                />
              </div>

                <div className="space-y-2">
                <Label htmlFor="beneficiaryDateOfBirth" className="text-sm font-medium text-gray-700">
                  Beneficiary Date of Birth <span className="text-red-500">*</span>
                  </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {beneficiaryDateOfBirth ? format(beneficiaryDateOfBirth, "PPP") : <span className="text-gray-500">Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={beneficiaryDateOfBirth || undefined}
                      onSelect={(date) => {
                        setBeneficiaryDateOfBirth(date || null);
                        setClientFormValues({ ...clientFormValues, beneficiaryDateOfBirth: date || null });
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                </div>

                  <div className="space-y-2">
                <Label htmlFor="beneficiaryAddress" className="text-sm font-medium text-gray-700">
                  Beneficiary Address <span className="text-red-500">*</span>
                    </Label>
                <Input
                  id="beneficiaryAddress"
                  value={clientFormValues.beneficiaryAddress}
                  onChange={(e) =>
                    setClientFormValues({ ...clientFormValues, beneficiaryAddress: e.target.value })
                  }
                  placeholder="Enter full address"
                  className="w-full"
                />
              </div>

              <div className="w-full flex justify-center pt-2">
                <div className="flex gap-1.5 items-center">
                  {[0, 1].map((step) => (
                    <div
                      key={step}
                      className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-medium transition-colors ${
                        clientCurrentStep === step
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step + 1}
                    </div>
                  ))}
                </div>
              </div>

              <DialogFooter className="flex-row items-center">
                <Button variant="outline" onClick={handleClientPreviousStep}>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <div className="flex-1"></div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleCloseClientDialog}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleClientNextStep}
                    disabled={!clientFormValues.beneficiaryFirstName || !clientFormValues.beneficiaryLastName || !clientFormValues.beneficiaryRelationship || !clientFormValues.beneficiaryEmail || !beneficiaryDateOfBirth || !clientFormValues.beneficiaryAddress}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Client"
                    )}
                  </Button>
                </div>
              </DialogFooter>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>

      {/* Client Creation Confirmation Dialog */}
      <Dialog open={showClientConfirmation} onOpenChange={setShowClientConfirmation}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader className="pb-4">
            <DialogTitle className="flex items-center gap-2 text-gray-900 text-xl">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
              Client Created Successfully
            </DialogTitle>
          </DialogHeader>

          {createdClientInfo && (
            <div className="space-y-6">
              {/* Client Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <User className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-base text-gray-900">Client Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {createdClientInfo.firstName} {createdClientInfo.lastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SIN</p>
                      <p className="text-sm text-gray-700">{createdClientInfo.sin}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Phone</p>
                      <p className="text-sm text-gray-700">{createdClientInfo.phone}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-sm text-gray-700">{createdClientInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date of Birth</p>
                      <p className="text-sm text-gray-700">
                        {createdClientInfo.dateOfBirth ? format(createdClientInfo.dateOfBirth, "PPP") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-sm text-gray-700">{createdClientInfo.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Beneficiary Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                  <Users className="h-5 w-5 text-purple-600" />
                  <h3 className="font-semibold text-base text-gray-900">Beneficiary Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-7">
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Full Name</p>
                      <p className="text-sm font-medium text-gray-900">
                        {createdClientInfo.beneficiaryFirstName} {createdClientInfo.beneficiaryLastName}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Relationship</p>
                      <p className="text-sm text-gray-700">{createdClientInfo.beneficiaryRelationship}</p>
                    </div>
                    {createdClientInfo.beneficiarySIN && (
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">SIN</p>
                        <p className="text-sm text-gray-700">{createdClientInfo.beneficiarySIN}</p>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                      <p className="text-sm text-gray-700">{createdClientInfo.beneficiaryEmail}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Date of Birth</p>
                      <p className="text-sm text-gray-700">
                        {createdClientInfo.beneficiaryDateOfBirth ? format(createdClientInfo.beneficiaryDateOfBirth, "PPP") : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Address</p>
                      <p className="text-sm text-gray-700">{createdClientInfo.beneficiaryAddress}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="pt-6">
            <Button
              onClick={() => {
                setShowClientConfirmation(false);
                setCreatedClientInfo(null);
              }}
              className="bg-gray-900 hover:bg-gray-800 text-white w-full"
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Index;
