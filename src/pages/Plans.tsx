import { useMemo, useState, useEffect } from "react";
import { useLocation, useSearchParams, useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from "@/components/ui/resizable";
import { Loader2, Plus, Eye, Pencil, Search, ChevronDown, ChevronUp, Minus, ArrowLeftRight, X, CheckCircle2, ChevronLeft, ChevronRight, Sparkles, ArrowLeft, UploadCloud, Calendar as CalendarIcon } from "lucide-react";
import { fundsData } from "@/data/fundsData";

type Fund = {
  symbol: string;
  name: string;
  company: string;
  category?: string;
};

// Fund database with companies and their funds
const FUND_DATABASE: Fund[] = [
  // Fidelity Funds
  { symbol: "FID001", name: "FIDELITY NORTHSTAR FUND", company: "Fidelity", category: "Equity" },
  { symbol: "FID002", name: "Fidelity Monthly Income Fund - Series B ISC", company: "Fidelity", category: "Income" },
  { symbol: "FID003", name: "Fidelity Canadian Growth Fund", company: "Fidelity", category: "Equity" },
  { symbol: "FID004", name: "Fidelity Global Equity Fund", company: "Fidelity", category: "Equity" },
  { symbol: "FID005", name: "Fidelity Balanced Fund", company: "Fidelity", category: "Balanced" },
  { symbol: "FID006", name: "Fidelity Dividend Fund", company: "Fidelity", category: "Income" },
  { symbol: "FID007", name: "Fidelity International Equity Fund", company: "Fidelity", category: "Equity" },
  { symbol: "FID008", name: "Fidelity Bond Fund", company: "Fidelity", category: "Fixed Income" },
  
  // TD Asset Management Funds
  { symbol: "TD001", name: "TD Monthly Income Fund - Series A", company: "TD Asset Management", category: "Income" },
  { symbol: "TD002", name: "TD Canadian Equity Fund", company: "TD Asset Management", category: "Equity" },
  { symbol: "TD003", name: "TD Balanced Growth Fund", company: "TD Asset Management", category: "Balanced" },
  { symbol: "TD004", name: "TD Global Equity Fund", company: "TD Asset Management", category: "Equity" },
  { symbol: "TD005", name: "TD Dividend Growth Fund", company: "TD Asset Management", category: "Equity" },
  { symbol: "TD006", name: "TD Canadian Bond Fund", company: "TD Asset Management", category: "Fixed Income" },
  { symbol: "TD007", name: "TD International Equity Fund", company: "TD Asset Management", category: "Equity" },
  { symbol: "TD008", name: "TD Money Market Fund", company: "TD Asset Management", category: "Money Market" },
  
  // Vanguard Funds
  { symbol: "VAN001", name: "Vanguard S&P 500 Index ETF", company: "Vanguard", category: "Equity" },
  { symbol: "VAN002", name: "Vanguard FTSE Canada All Cap Index ETF", company: "Vanguard", category: "Equity" },
  { symbol: "VAN003", name: "Vanguard Canadian Aggregate Bond Index ETF", company: "Vanguard", category: "Fixed Income" },
  { symbol: "VAN004", name: "Vanguard Global Equity Index ETF", company: "Vanguard", category: "Equity" },
  { symbol: "VAN005", name: "Vanguard Balanced ETF Portfolio", company: "Vanguard", category: "Balanced" },
  
  // iShares Funds
  { symbol: "ISH001", name: "iShares Core S&P/TSX Capped Composite Index ETF", company: "iShares", category: "Equity" },
  { symbol: "ISH002", name: "iShares Core MSCI All Country World ex Canada Index ETF", company: "iShares", category: "Equity" },
  { symbol: "ISH003", name: "iShares Canadian Corporate Bond Index ETF", company: "iShares", category: "Fixed Income" },
  { symbol: "ISH004", name: "iShares S&P 500 Index ETF", company: "iShares", category: "Equity" },
  
  // BMO Funds
  { symbol: "BMO001", name: "BMO Aggregate Bond Index ETF", company: "BMO", category: "Fixed Income" },
  { symbol: "BMO002", name: "BMO Canadian Equity Fund", company: "BMO", category: "Equity" },
  { symbol: "BMO003", name: "BMO Global Equity Fund", company: "BMO", category: "Equity" },
  { symbol: "BMO004", name: "BMO Balanced Fund", company: "BMO", category: "Balanced" },
  
  // RBC Funds
  { symbol: "RBC001", name: "RBC Canadian Equity Fund", company: "RBC", category: "Equity" },
  { symbol: "RBC002", name: "RBC Global Equity Fund", company: "RBC", category: "Equity" },
  { symbol: "RBC003", name: "RBC Balanced Fund", company: "RBC", category: "Balanced" },
  { symbol: "RBC004", name: "RBC Bond Fund", company: "RBC", category: "Fixed Income" },
  
  // CIBC Funds
  { symbol: "CIBC001", name: "CIBC Canadian Equity Fund", company: "CIBC", category: "Equity" },
  { symbol: "CIBC002", name: "CIBC Global Equity Fund", company: "CIBC", category: "Equity" },
  { symbol: "CIBC003", name: "CIBC Balanced Fund", company: "CIBC", category: "Balanced" },
  
  // Scotia Funds
  { symbol: "SCOT001", name: "Scotia Canadian Equity Fund", company: "Scotia", category: "Equity" },
  { symbol: "SCOT002", name: "Scotia Global Equity Fund", company: "Scotia", category: "Equity" },
  { symbol: "SCOT003", name: "Scotia Balanced Fund", company: "Scotia", category: "Balanced" },
];

type PlanType = "OPEN" | "RRSP" | "RESP" | "TFSA" | "RRIF" | "Non-Registered" | "LIRA" | "LIF" | "RDSP";
type PlanStatus = "Active" | "Inactive" | "Closed";

type Holding = {
  symbol: string;
  name: string;
  shares: number;
  price: number;
  marketValue: number;
  costBasis: number;
  gainLoss: number;
  gainLossPercent: number;
  assetClass: string;
  sector?: string;
};

type Plan = {
  id: string;
  type: PlanType;
  accountNumber: string;
  accountHolder?: string;
  clientId: string;
  clientName: string;
  status: PlanStatus;
  marketValue: number;
  costBasis: number;
  totalGainLoss: number;
  totalGainLossPercent: number;
  holdings: Holding[];
  openedDate: string;
  contributionRoom?: number;
  contributionUsed?: number;
  // Important Dates
  startDate: string;
  kycOnFileDate: string;
  kycAge: string;
  kycOriginalReceivedDate: string;
};

const PLANS: Plan[] = [
  {
    id: "P-001",
    type: "RRSP",
    accountNumber: "RRSP-984512",
    accountHolder: "Smith Family Trust",
    clientId: "CL-001",
    clientName: "Smith Family Trust",
    status: "Active",
    marketValue: 285230.80,
    costBasis: 250000.00,
    totalGainLoss: 35230.80,
    totalGainLossPercent: 14.09,
    openedDate: "2020-03-15",
    contributionRoom: 50000,
    contributionUsed: 250000,
    startDate: "2020-03-15",
    kycOnFileDate: "2020-02-10",
    kycAge: "1420 days Old",
    kycOriginalReceivedDate: "2020-01-28",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 450,
        price: 98.50,
        marketValue: 44325.00,
        costBasis: 40000.00,
        gainLoss: 4325.00,
        gainLossPercent: 10.81,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1200,
        price: 32.15,
        marketValue: 38580.00,
        costBasis: 35000.00,
        gainLoss: 3580.00,
        gainLossPercent: 10.23,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 2500,
        price: 15.82,
        marketValue: 39550.00,
        costBasis: 40000.00,
        gainLoss: -450.00,
        gainLossPercent: -1.13,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        shares: 150,
        price: 175.50,
        marketValue: 26325.00,
        costBasis: 22000.00,
        gainLoss: 4325.00,
        gainLossPercent: 19.66,
        assetClass: "Equity",
        sector: "Technology",
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        shares: 80,
        price: 380.25,
        marketValue: 30420.00,
        costBasis: 28000.00,
        gainLoss: 2420.00,
        gainLossPercent: 8.64,
        assetClass: "Equity",
        sector: "Technology",
      },
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 800,
        price: 78.90,
        marketValue: 63120.00,
        costBasis: 60000.00,
        gainLoss: 3120.00,
        gainLossPercent: 5.20,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 600,
        price: 42.75,
        marketValue: 25650.00,
        costBasis: 25000.00,
        gainLoss: 650.00,
        gainLossPercent: 2.60,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 1500,
        price: 27.15,
        marketValue: 40725.00,
        costBasis: 40000.00,
        gainLoss: 725.00,
        gainLossPercent: 1.81,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-002",
    type: "TFSA",
    accountNumber: "TFSA-984512",
    accountHolder: "Smith Family Trust",
    clientId: "CL-001",
    clientName: "Smith Family Trust",
    status: "Active",
    marketValue: 125000.00,
    costBasis: 100000.00,
    totalGainLoss: 25000.00,
    totalGainLossPercent: 25.00,
    openedDate: "2019-06-10",
    contributionRoom: 95000,
    contributionUsed: 100000,
    startDate: "2019-06-10",
    kycOnFileDate: "2019-05-05",
    kycAge: "1680 days Old",
    kycOriginalReceivedDate: "2019-04-22",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 600,
        price: 98.50,
        marketValue: 59100.00,
        costBasis: 50000.00,
        gainLoss: 9100.00,
        gainLossPercent: 18.20,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1500,
        price: 32.15,
        marketValue: 48225.00,
        costBasis: 40000.00,
        gainLoss: 8225.00,
        gainLossPercent: 20.56,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        shares: 120,
        price: 145.30,
        marketValue: 17436.00,
        costBasis: 10000.00,
        gainLoss: 7436.00,
        gainLossPercent: 74.36,
        assetClass: "Equity",
        sector: "Technology",
      },
    ],
  },
  {
    id: "P-003",
    type: "Non-Registered",
    accountNumber: "NR-984512",
    accountHolder: "Smith Family Trust",
    clientId: "CL-001",
    clientName: "Smith Family Trust",
    status: "Active",
    marketValue: 75000.00,
    costBasis: 70000.00,
    totalGainLoss: 5000.00,
    totalGainLossPercent: 7.14,
    openedDate: "2021-01-20",
    startDate: "2021-01-20",
    kycOnFileDate: "2020-12-15",
    kycAge: "1115 days Old",
    kycOriginalReceivedDate: "2020-11-30",
    holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 500,
        price: 78.90,
        marketValue: 39450.00,
        costBasis: 35000.00,
        gainLoss: 4450.00,
        gainLossPercent: 12.71,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 800,
        price: 42.75,
        marketValue: 34200.00,
        costBasis: 35000.00,
        gainLoss: -800.00,
        gainLossPercent: -2.29,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 85,
        price: 15.82,
        marketValue: 1350.00,
        costBasis: 0.00,
        gainLoss: 1350.00,
        gainLossPercent: 0.00,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-004",
    type: "RESP",
    accountNumber: "RESP-782341",
    accountHolder: "Johnson Retirement Fund",
    clientId: "CL-002",
    clientName: "Johnson Retirement Fund",
    status: "Active",
    marketValue: 185000.00,
    costBasis: 150000.00,
    totalGainLoss: 35000.00,
    totalGainLossPercent: 23.33,
    openedDate: "2018-09-05",
    contributionRoom: 50000,
    contributionUsed: 150000,
    startDate: "2018-09-05",
    kycOnFileDate: "2018-08-20",
    kycAge: "1980 days Old",
    kycOriginalReceivedDate: "2018-08-05",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 1000,
        price: 98.50,
        marketValue: 98500.00,
        costBasis: 80000.00,
        gainLoss: 18500.00,
        gainLossPercent: 23.13,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 2000,
        price: 32.15,
        marketValue: 64300.00,
        costBasis: 50000.00,
        gainLoss: 14300.00,
        gainLossPercent: 28.60,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 800,
        price: 27.15,
        marketValue: 21720.00,
        costBasis: 20000.00,
        gainLoss: 1720.00,
        gainLossPercent: 8.60,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-005",
    type: "RRIF",
    accountNumber: "RRIF-456789",
    accountHolder: "Martinez Investment Group",
    clientId: "CL-003",
    clientName: "Martinez Investment Group",
    status: "Active",
    marketValue: 320000.00,
    costBasis: 280000.00,
    totalGainLoss: 40000.00,
    totalGainLossPercent: 14.29,
    openedDate: "2022-04-12",
    startDate: "2022-04-12",
    kycOnFileDate: "2022-03-28",
    kycAge: "625 days Old",
    kycOriginalReceivedDate: "2022-03-15",
    holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 2000,
        price: 78.90,
        marketValue: 157800.00,
        costBasis: 140000.00,
        gainLoss: 17800.00,
        gainLossPercent: 12.71,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 3000,
        price: 27.15,
        marketValue: 81450.00,
        costBasis: 75000.00,
        gainLoss: 6450.00,
        gainLossPercent: 8.60,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 2000,
        price: 15.82,
        marketValue: 31640.00,
        costBasis: 30000.00,
        gainLoss: 1640.00,
        gainLossPercent: 5.47,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 500,
        price: 98.50,
        marketValue: 49250.00,
        costBasis: 35000.00,
        gainLoss: 14250.00,
        gainLossPercent: 40.71,
        assetClass: "Equity",
        sector: "Diversified",
      },
    ],
  },
  // Additional RRSP plans (need 11 more, total 12)
  {
    id: "P-006",
    type: "RRSP",
    accountNumber: "RRSP-123456",
    accountHolder: "Williams Education Savings",
    clientId: "CL-004",
    clientName: "Williams Education Savings",
    status: "Active",
    marketValue: 195000.00,
    costBasis: 180000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 8.33,
    openedDate: "2021-05-20",
    contributionRoom: 45000,
    contributionUsed: 180000,
    startDate: "2021-05-20",
    kycOnFileDate: "2021-04-25",
    kycAge: "960 days Old",
    kycOriginalReceivedDate: "2021-04-10",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 350,
        price: 98.50,
        marketValue: 34475.00,
        costBasis: 30000.00,
        gainLoss: 4475.00,
        gainLossPercent: 14.92,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1000,
        price: 32.15,
        marketValue: 32150.00,
        costBasis: 30000.00,
        gainLoss: 2150.00,
        gainLossPercent: 7.17,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 2000,
        price: 27.15,
        marketValue: 54300.00,
        costBasis: 50000.00,
        gainLoss: 4300.00,
        gainLossPercent: 8.60,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 900,
        price: 78.90,
        marketValue: 71010.00,
        costBasis: 70000.00,
        gainLoss: 1010.00,
        gainLossPercent: 1.44,
        assetClass: "Equity",
        sector: "International Equity",
      },
    ],
  },
  {
    id: "P-007",
    type: "RRSP",
    accountNumber: "RRSP-234567",
    accountHolder: "Brown Family Trust",
    clientId: "CL-005",
    clientName: "Brown Family Trust",
    status: "Active",
    marketValue: 165000.00,
    costBasis: 150000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 10.00,
    openedDate: "2020-08-15",
    contributionRoom: 50000,
    contributionUsed: 150000,
    startDate: "2020-08-15",
    kycOnFileDate: "2020-07-20",
    kycAge: "1235 days Old",
    kycOriginalReceivedDate: "2020-07-05",
    holdings: [
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1500,
        price: 32.15,
        marketValue: 48225.00,
        costBasis: 45000.00,
        gainLoss: 3225.00,
        gainLossPercent: 7.17,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 1000,
        price: 42.75,
        marketValue: 42750.00,
        costBasis: 40000.00,
        gainLoss: 2750.00,
        gainLossPercent: 6.88,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 2000,
        price: 15.82,
        marketValue: 31640.00,
        costBasis: 30000.00,
        gainLoss: 1640.00,
        gainLossPercent: 5.47,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 400,
        price: 98.50,
        marketValue: 39400.00,
        costBasis: 35000.00,
        gainLoss: 4400.00,
        gainLossPercent: 12.57,
        assetClass: "Equity",
        sector: "Diversified",
      },
    ],
  },
  {
    id: "P-008",
    type: "RRSP",
    accountNumber: "RRSP-345678",
    accountHolder: "Davis Tax-Free Account",
    clientId: "CL-006",
    clientName: "Davis Tax-Free Account",
    status: "Active",
    marketValue: 220000.00,
    costBasis: 200000.00,
    totalGainLoss: 20000.00,
    totalGainLossPercent: 10.00,
    openedDate: "2019-11-30",
    contributionRoom: 50000,
    contributionUsed: 200000,
    startDate: "2019-11-30",
    kycOnFileDate: "2019-11-05",
    kycAge: "1525 days Old",
    kycOriginalReceivedDate: "2019-10-20",
    holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 1200,
        price: 78.90,
        marketValue: 94680.00,
        costBasis: 85000.00,
        gainLoss: 9680.00,
        gainLossPercent: 11.39,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 500,
        price: 98.50,
        marketValue: 49250.00,
        costBasis: 45000.00,
        gainLoss: 4250.00,
        gainLossPercent: 9.44,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 2500,
        price: 27.15,
        marketValue: 67875.00,
        costBasis: 70000.00,
        gainLoss: -2125.00,
        gainLossPercent: -3.04,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-009",
    type: "RRSP",
    accountNumber: "RRSP-456789",
    accountHolder: "Hamilton Family Trust",
    clientId: "CL-007",
    clientName: "Hamilton Family Trust",
    status: "Active",
    marketValue: 145000.00,
    costBasis: 135000.00,
    totalGainLoss: 10000.00,
    totalGainLossPercent: 7.41,
    openedDate: "2022-01-10",
    contributionRoom: 50000,
    contributionUsed: 135000,
    startDate: "2022-01-10",
    kycOnFileDate: "2021-12-25",
    kycAge: "715 days Old",
    kycOriginalReceivedDate: "2021-12-10",
    holdings: [
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1200,
        price: 32.15,
        marketValue: 38580.00,
        costBasis: 35000.00,
        gainLoss: 3580.00,
        gainLossPercent: 10.23,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 800,
        price: 42.75,
        marketValue: 34200.00,
        costBasis: 30000.00,
        gainLoss: 4200.00,
        gainLossPercent: 14.00,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 1500,
        price: 15.82,
        marketValue: 23730.00,
        costBasis: 25000.00,
        gainLoss: -1270.00,
        gainLossPercent: -5.08,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 400,
        price: 98.50,
        marketValue: 39400.00,
        costBasis: 45000.00,
        gainLoss: -5600.00,
        gainLossPercent: -12.44,
        assetClass: "Equity",
        sector: "Diversified",
      },
    ],
  },
  {
    id: "P-010",
    type: "RRSP",
    accountNumber: "RRSP-567890",
    accountHolder: "Sunrise Portfolio",
    clientId: "CL-008",
    clientName: "Sunrise Portfolio",
    status: "Active",
    marketValue: 275000.00,
    costBasis: 250000.00,
    totalGainLoss: 25000.00,
    totalGainLossPercent: 10.00,
    openedDate: "2020-02-28",
    contributionRoom: 50000,
    contributionUsed: 250000,
    startDate: "2020-02-28",
    kycOnFileDate: "2020-02-10",
    kycAge: "1400 days Old",
    kycOriginalReceivedDate: "2020-01-25",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 800,
        price: 98.50,
        marketValue: 78800.00,
        costBasis: 70000.00,
        gainLoss: 8800.00,
        gainLossPercent: 12.57,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 1000,
        price: 78.90,
        marketValue: 78900.00,
        costBasis: 70000.00,
        gainLoss: 8900.00,
        gainLossPercent: 12.71,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 3000,
        price: 27.15,
        marketValue: 81450.00,
        costBasis: 80000.00,
        gainLoss: 1450.00,
        gainLossPercent: 1.81,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1000,
        price: 32.15,
        marketValue: 32150.00,
        costBasis: 30000.00,
        gainLoss: 2150.00,
        gainLossPercent: 7.17,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
    ],
  },
  {
    id: "P-011",
    type: "RRSP",
    accountNumber: "RRSP-678901",
    accountHolder: "Evergreen Wealth",
    clientId: "CL-009",
    clientName: "Evergreen Wealth",
    status: "Active",
    marketValue: 180000.00,
    costBasis: 165000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 9.09,
    openedDate: "2021-07-22",
    contributionRoom: 50000,
    contributionUsed: 165000,
    startDate: "2021-07-22",
    kycOnFileDate: "2021-07-05",
    kycAge: "900 days Old",
    kycOriginalReceivedDate: "2021-06-20",
    holdings: [
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1800,
        price: 32.15,
        marketValue: 57870.00,
        costBasis: 55000.00,
        gainLoss: 2870.00,
        gainLossPercent: 5.22,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 1200,
        price: 42.75,
        marketValue: 51300.00,
        costBasis: 50000.00,
        gainLoss: 1300.00,
        gainLossPercent: 2.60,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 500,
        price: 98.50,
        marketValue: 49250.00,
        costBasis: 45000.00,
        gainLoss: 4250.00,
        gainLossPercent: 9.44,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 1000,
        price: 15.82,
        marketValue: 15820.00,
        costBasis: 15000.00,
        gainLoss: 820.00,
        gainLossPercent: 5.47,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-012",
    type: "RRSP",
    accountNumber: "RRSP-789012",
    accountHolder: "Maple Leaf Holdings",
    clientId: "CL-010",
    clientName: "Maple Leaf Holdings",
    status: "Active",
    marketValue: 210000.00,
    costBasis: 195000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 7.69,
    openedDate: "2020-12-05",
    contributionRoom: 50000,
    contributionUsed: 195000,
    startDate: "2020-12-05",
    kycOnFileDate: "2020-11-20",
    kycAge: "1120 days Old",
    kycOriginalReceivedDate: "2020-11-05",
    holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 1100,
        price: 78.90,
        marketValue: 86790.00,
        costBasis: 80000.00,
        gainLoss: 6790.00,
        gainLossPercent: 8.49,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 600,
        price: 98.50,
        marketValue: 59100.00,
        costBasis: 55000.00,
        gainLoss: 4100.00,
        gainLossPercent: 7.45,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 2000,
        price: 27.15,
        marketValue: 54300.00,
        costBasis: 60000.00,
        gainLoss: -5700.00,
        gainLossPercent: -9.50,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-013",
    type: "RRSP",
    accountNumber: "RRSP-890123",
    accountHolder: "Aurora RESP",
    clientId: "CL-011",
    clientName: "Aurora RESP",
    status: "Active",
    marketValue: 155000.00,
    costBasis: 145000.00,
    totalGainLoss: 10000.00,
    totalGainLossPercent: 6.90,
    openedDate: "2021-09-18",
    contributionRoom: 50000,
    contributionUsed: 145000,
    startDate: "2021-09-18",
    kycOnFileDate: "2021-09-01",
    kycAge: "835 days Old",
    kycOriginalReceivedDate: "2021-08-15",
    holdings: [
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1400,
        price: 32.15,
        marketValue: 45010.00,
        costBasis: 40000.00,
        gainLoss: 5010.00,
        gainLossPercent: 12.53,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 900,
        price: 42.75,
        marketValue: 38475.00,
        costBasis: 35000.00,
        gainLoss: 3475.00,
        gainLossPercent: 9.93,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 450,
        price: 98.50,
        marketValue: 44325.00,
        costBasis: 40000.00,
        gainLoss: 4325.00,
        gainLossPercent: 10.81,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 1500,
        price: 15.82,
        marketValue: 23730.00,
        costBasis: 27000.00,
        gainLoss: -3270.00,
        gainLossPercent: -12.11,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-014",
    type: "RRSP",
    accountNumber: "RRSP-901234",
    clientId: "CL-012",
    clientName: "Harper Estate",
    status: "Active",
    marketValue: 190000.00,
    costBasis: 175000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 8.57,
    openedDate: "2020-06-14",
        accountHolder: "Harper Estate",
    startDate: "2020-06-14",
    kycOnFileDate: "2020-05-26",
    kycAge: "2045 days Old",
    kycOriginalReceivedDate: "2020-05-16",
    contributionRoom: 50000,
    contributionUsed: 175000,holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 700,
        price: 98.50,
        marketValue: 68950.00,
        costBasis: 60000.00,
        gainLoss: 8950.00,
        gainLossPercent: 14.92,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 900,
        price: 78.90,
        marketValue: 71010.00,
        costBasis: 65000.00,
        gainLoss: 6010.00,
        gainLossPercent: 9.25,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 1800,
        price: 27.15,
        marketValue: 48870.00,
        costBasis: 50000.00,
        gainLoss: -1130.00,
        gainLossPercent: -2.26,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-015",
    type: "RRSP",
    accountNumber: "RRSP-012345",
    clientId: "CL-013",
    clientName: "Taylor Investment",
    status: "Active",
    marketValue: 175000.00,
    costBasis: 160000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 9.38,
    openedDate: "2021-03-25",
        accountHolder: "Taylor Investment",
    startDate: "2021-03-25",
    kycOnFileDate: "2021-03-05",
    kycAge: "1762 days Old",
    kycOriginalReceivedDate: "2021-02-22",
    contributionRoom: 50000,
    contributionUsed: 160000,holdings: [
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1600,
        price: 32.15,
        marketValue: 51440.00,
        costBasis: 50000.00,
        gainLoss: 1440.00,
        gainLossPercent: 2.88,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 1000,
        price: 42.75,
        marketValue: 42750.00,
        costBasis: 40000.00,
        gainLoss: 2750.00,
        gainLossPercent: 6.88,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 550,
        price: 98.50,
        marketValue: 54175.00,
        costBasis: 50000.00,
        gainLoss: 4175.00,
        gainLossPercent: 8.35,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 1700,
        price: 15.82,
        marketValue: 26894.00,
        costBasis: 20000.00,
        gainLoss: 6894.00,
        gainLossPercent: 34.47,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-016",
    type: "RRSP",
    accountNumber: "RRSP-135792",
    clientId: "CL-014",
    clientName: "Roberts Family",
    status: "Active",
    marketValue: 200000.00,
    costBasis: 185000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 8.11,
    openedDate: "2020-10-08",
        accountHolder: "Roberts Family",
    startDate: "2020-10-08",
    kycOnFileDate: "2020-09-17",
    kycAge: "1931 days Old",
    kycOriginalReceivedDate: "2020-09-05",
    contributionRoom: 50000,
    contributionUsed: 185000,holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 1000,
        price: 78.90,
        marketValue: 78900.00,
        costBasis: 70000.00,
        gainLoss: 8900.00,
        gainLossPercent: 12.71,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 650,
        price: 98.50,
        marketValue: 64025.00,
        costBasis: 60000.00,
        gainLoss: 4025.00,
        gainLossPercent: 6.71,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 2100,
        price: 27.15,
        marketValue: 57015.00,
        costBasis: 55000.00,
        gainLoss: 2015.00,gainLossPercent: 3.66,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  // Additional TFSA plans (need 7 more, total 8)
  {
    id: "P-017",
    type: "TFSA",
    accountNumber: "TFSA-123456",
    clientId: "CL-004",
    clientName: "Williams Education Savings",
    status: "Active",
    marketValue: 95000.00,
    costBasis: 85000.00,
    totalGainLoss: 10000.00,
    totalGainLossPercent: 11.76,
    openedDate: "2021-02-14",
        accountHolder: "Williams Education Savings",
    startDate: "2021-02-14",
    kycOnFileDate: "2021-01-23",
    kycAge: "1803 days Old",
    kycOriginalReceivedDate: "2021-01-10",
    contributionRoom: 95000,
    contributionUsed: 85000,
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 400,
        price: 98.50,
        marketValue: 39400.00,
        costBasis: 35000.00,
        gainLoss: 4400.00,
        gainLossPercent: 12.57,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1000,
        price: 32.15,
        marketValue: 32150.00,
        costBasis: 30000.00,
        gainLoss: 2150.00,
        gainLossPercent: 7.17,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        shares: 80,
        price: 145.30,
        marketValue: 11624.00,
        costBasis: 10000.00,
        gainLoss: 1624.00,
        gainLossPercent: 16.24,
        assetClass: "Equity",
        sector: "Technology",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 300,
        price: 42.75,
        marketValue: 12825.00,
        costBasis: 10000.00,
        gainLoss: 2825.00,
        gainLossPercent: 28.25,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
    ],
  },
  {
    id: "P-018",
    type: "TFSA",
    accountNumber: "TFSA-234567",
    clientId: "CL-005",
    clientName: "Brown Family Trust",
    status: "Active",
    marketValue: 110000.00,
    costBasis: 95000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 15.79,
    openedDate: "2020-07-22",
        accountHolder: "Brown Family Trust",
    startDate: "2020-07-22",
    kycOnFileDate: "2020-06-29",
    kycAge: "2011 days Old",
    kycOriginalReceivedDate: "2020-06-15",
    contributionRoom: 95000,
    contributionUsed: 95000,
    holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 600,
        price: 78.90,
        marketValue: 47340.00,
        costBasis: 40000.00,
        gainLoss: 7340.00,
        gainLossPercent: 18.35,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 500,
        price: 98.50,marketValue: 49250.00,
        costBasis: 45000.00,
        gainLoss: 4250.00,
        gainLossPercent: 9.44,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 300,
        price: 42.75,
        marketValue: 12825.00,
        costBasis: 10000.00,
        gainLoss: 2825.00,
        gainLossPercent: 28.25,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
    ],
  },
  {
    id: "P-019",
    type: "TFSA",
    accountNumber: "TFSA-345678",
    clientId: "CL-006",
    clientName: "Davis Tax-Free Account",
    status: "Active",
    marketValue: 105000.00,
    costBasis: 90000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 16.67,
    openedDate: "2021-01-05",
        accountHolder: "Davis Tax-Free Account",
    startDate: "2021-01-05",
    kycOnFileDate: "2020-12-12",
    kycAge: "1845 days Old",
    kycOriginalReceivedDate: "2020-11-27",
    contributionRoom: 95000,
    contributionUsed: 90000,
    holdings: [
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1200,
        price: 32.15,
        marketValue: 38580.00,
        costBasis: 35000.00,
        gainLoss: 3580.00,
        gainLossPercent: 10.23,assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 450,
        price: 98.50,
        marketValue: 44325.00,
        costBasis: 40000.00,
        gainLoss: 4325.00,
        gainLossPercent: 10.81,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        shares: 50,
        price: 380.25,
        marketValue: 19012.50,
        costBasis: 15000.00,
        gainLoss: 4012.50,
        gainLossPercent: 26.75,
        assetClass: "Equity",
        sector: "Technology",
      },
    ],
  },
  {
    id: "P-020",
    type: "TFSA",
    accountNumber: "TFSA-456789",
    clientId: "CL-007",
    clientName: "Hamilton Family Trust",
    status: "Active",
    marketValue: 98000.00,
    costBasis: 88000.00,
    totalGainLoss: 10000.00,
    totalGainLossPercent: 11.36,
    openedDate: "2022-03-12",
        accountHolder: "Hamilton Family Trust",
    startDate: "2022-03-12",
    kycOnFileDate: "2022-02-25",
    kycAge: "1405 days Old",
    kycOriginalReceivedDate: "2022-02-09",
    contributionRoom: 95000,
    contributionUsed: 88000,
    holdings: [
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 800,price: 42.75,
        marketValue: 34200.00,
        costBasis: 30000.00,
        gainLoss: 4200.00,
        gainLossPercent: 14.00,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 500,
        price: 78.90,
        marketValue: 39450.00,
        costBasis: 35000.00,
        gainLoss: 4450.00,
        gainLossPercent: 12.71,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 250,
        price: 98.50,
        marketValue: 24625.00,
        costBasis: 23000.00,
        gainLoss: 1625.00,
        gainLossPercent: 7.07,
        assetClass: "Equity",
        sector: "Diversified",
      },
    ],
  },
  {
    id: "P-021",
    type: "TFSA",
    accountNumber: "TFSA-567890",
    clientId: "CL-008",
    clientName: "Sunrise Portfolio",
    status: "Active",
    marketValue: 115000.00,
    costBasis: 100000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 15.00,openedDate: "2020-05-18",
        accountHolder: "Sunrise Portfolio",
    startDate: "2020-05-18",
    kycOnFileDate: "2020-05-02",
    kycAge: "2069 days Old",
    kycOriginalReceivedDate: "2020-04-22",
    contributionRoom: 95000,
    contributionUsed: 100000,
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 550,
        price: 98.50,
        marketValue: 54175.00,
        costBasis: 50000.00,
        gainLoss: 4175.00,
        gainLossPercent: 8.35,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1400,
        price: 32.15,
        marketValue: 45010.00,
        costBasis: 40000.00,
        gainLoss: 5010.00,
        gainLossPercent: 12.53,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        shares: 60,
        price: 175.50,
        marketValue: 10530.00,
        costBasis: 10000.00,
        gainLoss: 530.00,
        gainLossPercent: 5.30,
        assetClass: "Equity",
        sector: "Technology",
      },
    ],
  },
  {
    id: "P-022",
    type: "TFSA",
    accountNumber: "TFSA-678901",
    clientId: "CL-009",
    clientName: "Evergreen Wealth",
    status: "Active",marketValue: 102000.00,
    costBasis: 92000.00,
    totalGainLoss: 10000.00,
    totalGainLossPercent: 10.87,
    openedDate: "2021-08-30",
        accountHolder: "Evergreen Wealth",
    startDate: "2021-08-30",
    kycOnFileDate: "2021-08-13",
    kycAge: "1601 days Old",
    kycOriginalReceivedDate: "2021-08-02",
    contributionRoom: 95000,
    contributionUsed: 92000,
    holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 550,
        price: 78.90,
        marketValue: 43395.00,
        costBasis: 40000.00,
        gainLoss: 3395.00,
        gainLossPercent: 8.49,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 700,
        price: 42.75,
        marketValue: 29925.00,
        costBasis: 27000.00,
        gainLoss: 2925.00,
        gainLossPercent: 10.83,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 300,
        price: 98.50,
        marketValue: 29550.00,
        costBasis: 25000.00,
        gainLoss: 4550.00,
        gainLossPercent: 18.20,
        assetClass: "Equity",
        sector: "Diversified",
      },
    ],
  },
  {
    id: "P-023",
    type: "TFSA",
    accountNumber: "TFSA-789012",
    clientId: "CL-010",
    clientName: "Maple Leaf Holdings",
    status: "Active",
    marketValue: 108000.00,
    costBasis: 98000.00,
    totalGainLoss: 10000.00,totalGainLossPercent: 10.20,
    openedDate: "2020-11-20",
        accountHolder: "Maple Leaf Holdings",
    startDate: "2020-11-20",
    kycOnFileDate: "2020-11-02",
    kycAge: "1885 days Old",
    kycOriginalReceivedDate: "2020-10-21",
    contributionRoom: 95000,
    contributionUsed: 98000,
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 500,
        price: 98.50,
        marketValue: 49250.00,
        costBasis: 45000.00,
        gainLoss: 4250.00,
        gainLossPercent: 9.44,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1100,
        price: 32.15,
        marketValue: 35365.00,
        costBasis: 33000.00,
        gainLoss: 2365.00,
        gainLossPercent: 7.17,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        shares: 100,
        price: 145.30,
        marketValue: 14530.00,
        costBasis: 10000.00,
        gainLoss: 4530.00,
        gainLossPercent: 45.30,
        assetClass: "Equity",
        sector: "Technology",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 200,
        price: 42.75,marketValue: 8550.00,
        costBasis: 10000.00,
        gainLoss: -1450.00,
        gainLossPercent: -14.50,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
    ],
  },
  {
    id: "P-024",
    type: "TFSA",
    accountNumber: "TFSA-890123",
    clientId: "CL-011",
    clientName: "Aurora RESP",
    status: "Active",
    marketValue: 99000.00,
    costBasis: 89000.00,
    totalGainLoss: 10000.00,
    totalGainLossPercent: 11.24,
    openedDate: "2022-01-15",
        accountHolder: "Aurora RESP",
    startDate: "2022-01-15",
    kycOnFileDate: "2021-12-27",
    kycAge: "1465 days Old",
    kycOriginalReceivedDate: "2021-12-14",
    contributionRoom: 95000,
    contributionUsed: 89000,
    holdings: [
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1300,
        price: 32.15,
        marketValue: 41795.00,
        costBasis: 40000.00,
        gainLoss: 1795.00,
        gainLossPercent: 4.49,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 400,
        price: 98.50,
        marketValue: 39400.00,
        costBasis: 35000.00,
        gainLoss: 4400.00,gainLossPercent: 12.57,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 400,
        price: 42.75,
        marketValue: 17100.00,
        costBasis: 14000.00,
        gainLoss: 3100.00,
        gainLossPercent: 22.14,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
    ],
  },
  // Additional RRIF plans (need 4 more, total 5)
  {
    id: "P-025",
    type: "RRIF",
    accountNumber: "RRIF-123456",
    clientId: "CL-004",
    clientName: "Williams Education Savings",
    status: "Active",
    marketValue: 285000.00,
    costBasis: 260000.00,
    totalGainLoss: 25000.00,
    totalGainLossPercent: 9.62,
    openedDate: "2021-06-10",
        accountHolder: "Williams Education Savings",
    startDate: "2021-06-10",
    kycOnFileDate: "2021-05-21",
    kycAge: "1685 days Old",
    kycOriginalReceivedDate: "2021-05-07",
    holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 1500,
        price: 78.90,
        marketValue: 118350.00,
        costBasis: 110000.00,
        gainLoss: 8350.00,
        gainLossPercent: 7.59,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 4000,
        price: 27.15,
        marketValue: 108600.00,
        costBasis: 100000.00,
        gainLoss: 8600.00,
        gainLossPercent: 8.60,
        assetClass: "Fixed Income",sector: "Bonds",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 600,
        price: 98.50,
        marketValue: 59100.00,
        costBasis: 50000.00,
        gainLoss: 9100.00,
        gainLossPercent: 18.20,
        assetClass: "Equity",
        sector: "Diversified",
      },
    ],
  },
  {
    id: "P-026",
    type: "RRIF",
    accountNumber: "RRIF-234567",
    clientId: "CL-005",
    clientName: "Brown Family Trust",
    status: "Active",
    marketValue: 295000.00,
    costBasis: 270000.00,
    totalGainLoss: 25000.00,
    totalGainLossPercent: 9.26,
    openedDate: "2020-09-25",
        accountHolder: "Brown Family Trust",
    startDate: "2020-09-25",
    kycOnFileDate: "2020-09-04",
    kycAge: "1944 days Old",
    kycOriginalReceivedDate: "2020-08-20",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 800,
        price: 98.50,
        marketValue: 78800.00,
        costBasis: 70000.00,
        gainLoss: 8800.00,
        gainLossPercent: 12.57,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 2000,
        price: 32.15,marketValue: 64300.00,
        costBasis: 60000.00,
        gainLoss: 4300.00,
        gainLossPercent: 7.17,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 3500,
        price: 27.15,
        marketValue: 95025.00,
        costBasis: 90000.00,
        gainLoss: 5025.00,
        gainLossPercent: 5.58,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 1500,
        price: 15.82,
        marketValue: 23730.00,
        costBasis: 20000.00,
        gainLoss: 3730.00,
        gainLossPercent: 18.65,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-027",
    type: "RRIF",
    accountNumber: "RRIF-345678",
    clientId: "CL-006",
    clientName: "Davis Tax-Free Account",
    status: "Active",
    marketValue: 310000.00,
    costBasis: 285000.00,
    totalGainLoss: 25000.00,
    totalGainLossPercent: 8.77,
    openedDate: "2022-02-18",
        accountHolder: "Davis Tax-Free Account",
    startDate: "2022-02-18",
    kycOnFileDate: "2022-01-27",
    kycAge: "1434 days Old",
    kycOriginalReceivedDate: "2022-01-11",
    holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 1800,
        price: 78.90,
        marketValue: 142020.00,
        costBasis: 130000.00,
        gainLoss: 12020.00,
        gainLossPercent: 9.25,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VFV.TO",name: "Vanguard S&P 500 Index ETF",
        shares: 700,
        price: 98.50,
        marketValue: 68950.00,
        costBasis: 60000.00,
        gainLoss: 8950.00,
        gainLossPercent: 14.92,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 3600,
        price: 27.15,
        marketValue: 97740.00,
        costBasis: 95000.00,
        gainLoss: 2740.00,
        gainLossPercent: 2.88,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-028",
    type: "RRIF",
    accountNumber: "RRIF-456789",
    clientId: "CL-007",
    clientName: "Hamilton Family Trust",
    status: "Active",
    marketValue: 275000.00,
    costBasis: 255000.00,
    totalGainLoss: 20000.00,
    totalGainLossPercent: 7.84,
    openedDate: "2021-04-05",
        accountHolder: "Hamilton Family Trust",
    startDate: "2021-04-05",
    kycOnFileDate: "2021-03-13",
    kycAge: "1754 days Old",
    kycOriginalReceivedDate: "2021-03-03",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 750,
        price: 98.50,
        marketValue: 73875.00,
        costBasis: 65000.00,
        gainLoss: 8875.00,
        gainLossPercent: 13.65,assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1800,
        price: 32.15,
        marketValue: 57870.00,
        costBasis: 55000.00,
        gainLoss: 2870.00,
        gainLossPercent: 5.22,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 3000,
        price: 27.15,
        marketValue: 81450.00,
        costBasis: 80000.00,
        gainLoss: 1450.00,
        gainLossPercent: 1.81,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 2500,
        price: 15.82,
        marketValue: 39550.00,
        costBasis: 35000.00,
        gainLoss: 4550.00,
        gainLossPercent: 13.00,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  // Additional RESP plans (need 3 more, total 4)
  {
    id: "P-029",
    type: "RESP",
    accountNumber: "RESP-123456",
    clientId: "CL-004",clientName: "Williams Education Savings",
    status: "Active",
    marketValue: 165000.00,
    costBasis: 140000.00,
    totalGainLoss: 25000.00,
    totalGainLossPercent: 17.86,
    openedDate: "2019-03-20",
        accountHolder: "Williams Education Savings",
    startDate: "2019-03-20",
    kycOnFileDate: "2019-02-24",
    kycAge: "2502 days Old",
    kycOriginalReceivedDate: "2019-02-13",
    contributionRoom: 50000,
    contributionUsed: 140000,
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 800,
        price: 98.50,
        marketValue: 78800.00,
        costBasis: 70000.00,
        gainLoss: 8800.00,
        gainLossPercent: 12.57,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1500,
        price: 32.15,
        marketValue: 48225.00,
        costBasis: 45000.00,
        gainLoss: 3225.00,
        gainLossPercent: 7.17,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 1200,
        price: 27.15,
        marketValue: 32580.00,
        costBasis: 25000.00,
        gainLoss: 7580.00,
        gainLossPercent: 30.32,assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-030",
    type: "RESP",
    accountNumber: "RESP-234567",
    clientId: "CL-005",
    clientName: "Brown Family Trust",
    status: "Active",
    marketValue: 195000.00,
    costBasis: 170000.00,
    totalGainLoss: 25000.00,
    totalGainLossPercent: 14.71,
    openedDate: "2018-11-12",
        accountHolder: "Brown Family Trust",
    startDate: "2018-11-12",
    kycOnFileDate: "2018-10-28",
    kycAge: "2621 days Old",
    kycOriginalReceivedDate: "2018-10-16",
    contributionRoom: 50000,
    contributionUsed: 170000,
    holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 1200,
        price: 78.90,
        marketValue: 94680.00,
        costBasis: 85000.00,
        gainLoss: 9680.00,
        gainLossPercent: 11.39,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 600,
        price: 98.50,
        marketValue: 59100.00,
        costBasis: 50000.00,
        gainLoss: 9100.00,
        gainLossPercent: 18.20,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "VCN.TO",name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 1000,
        price: 42.75,
        marketValue: 42750.00,
        costBasis: 35000.00,
        gainLoss: 7750.00,
        gainLossPercent: 22.14,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
    ],
  },
  {
    id: "P-031",
    type: "RESP",
    accountNumber: "RESP-345678",
    clientId: "CL-006",
    clientName: "Davis Tax-Free Account",
    status: "Active",
    marketValue: 175000.00,
    costBasis: 155000.00,
    totalGainLoss: 20000.00,
    totalGainLossPercent: 12.90,
    openedDate: "2020-01-08",
        accountHolder: "Davis Tax-Free Account",
    startDate: "2020-01-08",
    kycOnFileDate: "2019-12-23",
    kycAge: "2200 days Old",
    kycOriginalReceivedDate: "2019-12-10",
    contributionRoom: 50000,
    contributionUsed: 155000,
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 700,
        price: 98.50,
        marketValue: 68950.00,
        costBasis: 60000.00,
        gainLoss: 8950.00,
        gainLossPercent: 14.92,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1700,price: 32.15,
        marketValue: 54655.00,
        costBasis: 50000.00,
        gainLoss: 4655.00,
        gainLossPercent: 9.31,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 1800,
        price: 27.15,
        marketValue: 48870.00,
        costBasis: 45000.00,
        gainLoss: 3870.00,
        gainLossPercent: 8.60,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  // Additional Non-Registered plans (need 5 more, total 6)
  {
    id: "P-032",
    type: "Non-Registered",
    accountNumber: "NR-123456",
    clientId: "CL-004",
    clientName: "Williams Education Savings",
    status: "Active",
    marketValue: 68000.00,
    costBasis: 63000.00,
    totalGainLoss: 5000.00,
    totalGainLossPercent: 7.94,
    openedDate: "2021-10-15",    accountHolder: "Williams Education Savings",
    startDate: "2021-10-15",
    kycOnFileDate: "2021-09-28",
    kycAge: "1555 days Old",
    kycOriginalReceivedDate: "2021-09-14",
    holdings: [
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 400,
        price: 78.90,
        marketValue: 31560.00,
        costBasis: 30000.00,
        gainLoss: 1560.00,
        gainLossPercent: 5.20,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 300,
        price: 98.50,
        marketValue: 29550.00,
        costBasis: 25000.00,
        gainLoss: 4550.00,
        gainLossPercent: 18.20,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 200,
        price: 42.75,
        marketValue: 8550.00,
        costBasis: 8000.00,
        gainLoss: 550.00,
        gainLossPercent: 6.88,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
    ],
  },
  {
    id: "P-033",
    type: "Non-Registered",
    accountNumber: "NR-234567",
    clientId: "CL-005",
    clientName: "Brown Family Trust",
    status: "Active",
    marketValue: 72000.00,
    costBasis: 67000.00,
    totalGainLoss: 5000.00,
    totalGainLossPercent: 7.46,
    openedDate: "2022-05-22",
        accountHolder: "Brown Family Trust",
    startDate: "2022-05-22",
    kycOnFileDate: "2022-05-04",
    kycAge: "1337 days Old",
    kycOriginalReceivedDate: "2022-04-19",
    holdings: [
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1000,
        price: 32.15,
        marketValue: 32150.00,
        costBasis: 30000.00,
        gainLoss: 2150.00,
        gainLossPercent: 7.17,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 350,
        price: 98.50,
        marketValue: 34475.00,
        costBasis: 30000.00,gainLoss: 4475.00,
        gainLossPercent: 14.92,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "ZAG.TO",
        name: "BMO Aggregate Bond Index ETF",
        shares: 300,
        price: 15.82,
        marketValue: 4746.00,
        costBasis: 7000.00,
        gainLoss: -2254.00,
        gainLossPercent: -32.20,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-034",
    type: "Non-Registered",
    accountNumber: "NR-345678",
    clientId: "CL-006",
    clientName: "Davis Tax-Free Account",
    status: "Active",
    marketValue: 81000.00,
    costBasis: 75000.00,
    totalGainLoss: 6000.00,
    totalGainLossPercent: 8.00,
    openedDate: "2020-08-30",
    accountHolder: "Davis Tax-Free Account",
    startDate: "2020-08-30",
    kycOnFileDate: "2020-08-10",
    kycAge: "1240 days Old",
    kycOriginalReceivedDate: "2020-07-28",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 400,
        price: 98.50,
        marketValue: 39400.00,
        costBasis: 35000.00,
        gainLoss: 4400.00,
        gainLossPercent: 12.57,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 500,
        price: 78.90,
        marketValue: 39450.00,
        costBasis: 40000.00,
        gainLoss: -550.00,
        gainLossPercent: -1.38,
        assetClass: "Equity",
        sector: "International Equity",
      },
    ],
  },
  {
    id: "P-035",
    type: "Non-Registered",
    accountNumber: "NR-456789",
    clientId: "CL-007",
    clientName: "Hamilton Family Trust",
    status: "Active",
    marketValue: 69000.00,
    costBasis: 64000.00,
    totalGainLoss: 5000.00,
    totalGainLossPercent: 7.81,
    openedDate: "2021-12-10",
    accountHolder: "Hamilton Family Trust",
    startDate: "2021-12-10",
    kycOnFileDate: "2021-11-25",
    kycAge: "1502 days Old",
    kycOriginalReceivedDate: "2021-11-15",
    holdings: [
      {
        symbol: "VCN.TO",
        name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 800,
        price: 42.75,
        marketValue: 34200.00,
        costBasis: 30000.00,
        gainLoss: 4200.00,
        gainLossPercent: 14.00,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 900,
        price: 32.15,
        marketValue: 28935.00,
        costBasis: 25000.00,
        gainLoss: 3935.00,
        gainLossPercent: 15.74,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 150,
        price: 98.50,
        marketValue: 14775.00,
        costBasis: 9000.00,
        gainLoss: 5775.00,
        gainLossPercent: 64.17,
        assetClass: "Equity",
        sector: "Diversified",
      },
    ],
  },
  {
    id: "P-036",
    type: "Non-Registered",
    accountNumber: "NR-567890",
    clientId: "CL-008",
    clientName: "Sunrise Portfolio",
    status: "Active",
    marketValue: 73000.00,
    costBasis: 68000.00,
    totalGainLoss: 5000.00,
    totalGainLossPercent: 7.35,
    openedDate: "2022-03-08",
    accountHolder: "Sunrise Portfolio",
    startDate: "2022-03-08",
    kycOnFileDate: "2022-02-20",
    kycAge: "1415 days Old",
    kycOriginalReceivedDate: "2022-02-10",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 450,
        price: 98.50,
        marketValue: 44325.00,
        costBasis: 40000.00,
        gainLoss: 4325.00,
        gainLossPercent: 10.81,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "VCN.TO",name: "Vanguard FTSE Canada All Cap Index ETF",
        shares: 600,
        price: 42.75,
        marketValue: 25650.00,
        costBasis: 28000.00,
        gainLoss: -2350.00,
        gainLossPercent: -8.39,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
    ],
  },
  // LIRA plans (need 2, total 2)
  {
    id: "P-037",
    type: "LIRA",
    accountNumber: "LIRA-123456",
    clientId: "CL-009",
    clientName: "Evergreen Wealth",
    status: "Active",
    marketValue: 185000.00,
    costBasis: 170000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 8.82,
    openedDate: "2020-07-14",
    accountHolder: "Evergreen Wealth",
    startDate: "2020-07-14",
    kycOnFileDate: "2020-06-28",
    kycAge: "2031 days Old",
    kycOriginalReceivedDate: "2020-06-15",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 700,
        price: 98.50,
        marketValue: 68950.00,
        costBasis: 60000.00,
        gainLoss: 8950.00,
        gainLossPercent: 14.92,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 900,
        price: 78.90,
        marketValue: 71010.00,
        costBasis: 65000.00,
        gainLoss: 6010.00,
        gainLossPercent: 9.25,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 1600,
        price: 27.15,
        marketValue: 43440.00,
        costBasis: 45000.00,
        gainLoss: -1560.00,
        gainLossPercent: -3.47,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  {
    id: "P-038",
    type: "LIRA",
    accountNumber: "LIRA-234567",
    clientId: "CL-010",
    clientName: "Maple Leaf Holdings",
    status: "Active",
    marketValue: 195000.00,
    costBasis: 180000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 8.33,
    openedDate: "2021-11-25",
    accountHolder: "Maple Leaf Holdings",
    startDate: "2021-11-25",
    kycOnFileDate: "2021-11-10",
    kycAge: "1520 days Old",
    kycOriginalReceivedDate: "2021-10-28",
    holdings: [
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 2000,
        price: 32.15,
        marketValue: 64300.00,
        costBasis: 60000.00,
        gainLoss: 4300.00,
        gainLossPercent: 7.17,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 800,
        price: 98.50,
        marketValue: 78800.00,
        costBasis: 70000.00,
        gainLoss: 8800.00,
        gainLossPercent: 12.57,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 1900,
        price: 27.15,
        marketValue: 51585.00,
        costBasis: 50000.00,
        gainLoss: 1585.00,
        gainLossPercent: 3.17,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  // LIF plan (need 1, total 1)
  {
    id: "P-039",
    type: "LIF",
    accountNumber: "LIF-123456",
    clientId: "CL-011",
    clientName: "Aurora RESP",
    status: "Active",
    marketValue: 175000.00,
    costBasis: 160000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 9.38,
    openedDate: "2022-06-18",
    accountHolder: "Aurora RESP",
    startDate: "2022-06-18",
    kycOnFileDate: "2022-06-01",
    kycAge: "570 days Old",
    kycOriginalReceivedDate: "2022-05-18",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 600,
        price: 98.50,
        marketValue: 59100.00,
        costBasis: 50000.00,
        gainLoss: 9100.00,
        gainLossPercent: 18.20,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XAW.TO",
        name: "iShares Core MSCI All Country World ex Canada Index ETF",
        shares: 800,
        price: 78.90,
        marketValue: 63120.00,
        costBasis: 60000.00,
        gainLoss: 3120.00,
        gainLossPercent: 5.20,
        assetClass: "Equity",
        sector: "International Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 1900,
        price: 27.15,
        marketValue: 51585.00,
        costBasis: 50000.00,
        gainLoss: 1585.00,
        gainLossPercent: 3.17,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
  // RDSP plan (need 1, total 1)
  {
    id: "P-040",
    type: "RDSP",
    accountNumber: "RDSP-123456",
    clientId: "CL-012",
    clientName: "Harper Estate",
    status: "Active",
    marketValue: 125000.00,
    costBasis: 110000.00,
    totalGainLoss: 15000.00,
    totalGainLossPercent: 13.64,
    openedDate: "2021-05-12",
    accountHolder: "Harper Estate",
    startDate: "2021-05-12",
    kycOnFileDate: "2021-04-25",
    kycAge: "960 days Old",
    kycOriginalReceivedDate: "2021-04-12",
    holdings: [
      {
        symbol: "VFV.TO",
        name: "Vanguard S&P 500 Index ETF",
        shares: 500,
        price: 98.50,
        marketValue: 49250.00,
        costBasis: 45000.00,
        gainLoss: 4250.00,
        gainLossPercent: 9.44,
        assetClass: "Equity",
        sector: "Diversified",
      },
      {
        symbol: "XIC.TO",
        name: "iShares Core S&P/TSX Capped Composite Index ETF",
        shares: 1200,
        price: 32.15,
        marketValue: 38580.00,
        costBasis: 35000.00,
        gainLoss: 3580.00,
        gainLossPercent: 10.23,
        assetClass: "Equity",
        sector: "Canadian Equity",
      },
      {
        symbol: "VAB.TO",
        name: "Vanguard Canadian Aggregate Bond Index ETF",
        shares: 1300,
        price: 27.15,
        marketValue: 35295.00,
        costBasis: 30000.00,
        gainLoss: 5295.00,
        gainLossPercent: 17.65,
        assetClass: "Fixed Income",
        sector: "Bonds",
      },
    ],
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function Plans() {
  const navigate = useNavigate();
  const location = useLocation();
  const [plans, setPlans] = useState<Plan[]>(PLANS);
  const [searchQuery, setSearchQuery] = useState("");
  
  const planTypeOptions: PlanType[] = ["OPEN", "RRSP", "RESP", "TFSA", "RRIF", "Non-Registered", "LIRA", "LIF", "RDSP"];
  
  // Initialize typeFilter from URL parameter if present
  const getInitialTypeFilter = (): Set<PlanType> => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    if (typeParam && planTypeOptions.includes(typeParam as PlanType)) {
      return new Set([typeParam as PlanType]);
    }
    return new Set();
  };
  
  const [typeFilter, setTypeFilter] = useState<Set<PlanType>>(getInitialTypeFilter());
  
  // Update filter when URL changes
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const typeParam = searchParams.get('type');
    if (typeParam && planTypeOptions.includes(typeParam as PlanType)) {
      setTypeFilter(new Set([typeParam as PlanType]));
    } else if (!typeParam) {
      setTypeFilter(new Set());
    }
  }, [location.search, planTypeOptions]);
  
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [planViewTab, setPlanViewTab] = useState<"details" | "edit">("details");
  const [expandedHoldings, setExpandedHoldings] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0); // 0: Select Plan Type, 1-3: Setup steps, 4: Success
  const [createdPlan, setCreatedPlan] = useState<Plan | null>(null);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [selectedFundCompany, setSelectedFundCompany] = useState("");
  const [investmentAmount, setInvestmentAmount] = useState("");
  
  // Buy/Sell/Switch dialog states
  const [showBuyUnits, setShowBuyUnits] = useState(false);
  const [showSellUnits, setShowSellUnits] = useState(false);
  const [showSwitchFund, setShowSwitchFund] = useState(false);
  const [showConvertFund, setShowConvertFund] = useState(false);
  const [isConvertMode, setIsConvertMode] = useState(false);
  const [showOrderConfirmation, setShowOrderConfirmation] = useState(false);
  const [showSellOrderConfirmation, setShowSellOrderConfirmation] = useState(false);
  const [showSwitchConfirmation, setShowSwitchConfirmation] = useState(false);
  const [showConvertConfirmation, setShowConvertConfirmation] = useState(false);
  const [selectedHolding, setSelectedHolding] = useState<{ holding: Holding; plan: Plan } | null>(null);
  
  const [buyOrderData, setBuyOrderData] = useState<{
    investmentAmount: string;
    units: string;
    estimatedCost: number;
    unitsToPurchase: number;
  }>({
    investmentAmount: "",
    units: "",
    estimatedCost: 0,
    unitsToPurchase: 0,
  });
  
  const [sellOrderData, setSellOrderData] = useState<{
    units: string;
    dollarAmount: string;
    estimatedProceeds: number;
    unitsToSell: number;
  }>({
    units: "",
    dollarAmount: "",
    estimatedProceeds: 0,
    unitsToSell: 0,
  });
  
  const [switchData, setSwitchData] = useState<{
    units: string;
    selectedCompany: string;
    selectedFund: string;
    selectedFundSymbol?: string;
    estimatedValue: number;
  }>({
    units: "",
    selectedCompany: "",
    selectedFund: "",
    selectedFundSymbol: "",
    estimatedValue: 0,
  });
  
  const [convertData, setConvertData] = useState<{
    units: string;
    selectedCompany: string;
    selectedFund: string;
    selectedFundSymbol?: string;
    estimatedValue: number;
  }>({
    units: "",
    selectedCompany: "",
    selectedFund: "",
    selectedFundSymbol: "",
    estimatedValue: 0,
  });
  
  const [orderConfirmationData, setOrderConfirmationData] = useState<{
    symbol: string;
    name: string;
    units: number;
    price: number;
    totalCost: number;
  } | null>(null);
  
  const [sellOrderConfirmationData, setSellOrderConfirmationData] = useState<{
    symbol: string;
    name: string;
    units: number;
    price: number;
    totalProceeds: number;
  } | null>(null);
  
  const [switchConfirmationData, setSwitchConfirmationData] = useState<{
    fromFund: string;
    toFund: string;
    units: number;
    estimatedValue: number;
  } | null>(null);
  
  const [convertConfirmationData, setConvertConfirmationData] = useState<{
    fromFund: string;
    toFund: string;
    units: number;
    estimatedValue: number;
  } | null>(null);

  const [formValues, setFormValues] = useState({
    type: "" as PlanType | "",
    accountNumber: "",
    clientId: "",
    clientName: "",
    status: "Active" as PlanStatus,
    openedDate: "",
    contributionRoom: "",
    contributionUsed: "",
    // Step 1 fields
    ownerName: "",
    beneficiaryName: "",
    // Step 2 fields
    intermediaryCode: "",
    intermediaryAccountCode: "",
    // Step 3 fields
    notes: "",
    objectives: "",
    riskTolerance: "",
    timeHorizon: "",
  });

  const [editFormValues, setEditFormValues] = useState({
    type: "" as PlanType | "",
    accountNumber: "",
    clientId: "",
    clientName: "",
    openedDate: "",
    contributionRoom: "",
    contributionUsed: "",
  });

  const filteredPlans = useMemo(() => {
    return plans.filter((plan) => {
      const matchesSearch =
        searchQuery === "" ||
        plan.accountNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        plan.type.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = typeFilter.size === 0 || typeFilter.has(plan.type);

      return matchesSearch && matchesType;
    });
  }, [plans, searchQuery, typeFilter]);

  // Set first plan as default selected
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  
  useEffect(() => {
    if (filteredPlans.length > 0 && !selectedPlan) {
      setSelectedPlan(filteredPlans[0]);
      setExpandedHoldings(new Set());
    } else if (filteredPlans.length === 0) {
      setSelectedPlan(null);
    } else if (selectedPlan && !filteredPlans.find(p => p.id === selectedPlan.id)) {
      // If selected plan is no longer in filtered list, select first one
      setSelectedPlan(filteredPlans[0]);
      setExpandedHoldings(new Set());
    }
  }, [filteredPlans]);

  const toggleTypeFilter = (type: PlanType) => {
    setTypeFilter((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        next.delete(type);
      } else {
        next.add(type);
      }
      return next;
    });
  };


  const resetForm = () => {
    setFormValues({
      type: "" as PlanType | "",
      accountNumber: "",
      clientId: "",
      clientName: "",
      status: "Active",
      openedDate: "",
      contributionRoom: "",
      contributionUsed: "",
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
    setShowAddProduct(false);
    setSelectedFundCompany("");
    setInvestmentAmount("");
  };

  // Check if we should open the dialog from navigation state
  useEffect(() => {
    const state = location.state as { openCreateDialog?: boolean } | null;
    if (state?.openCreateDialog) {
      setCurrentStep(0);
      setFormValues({
        type: "" as PlanType | "",
        accountNumber: "",
        clientId: "",
        clientName: "",
        status: "Active",
        openedDate: "",
        contributionRoom: "",
        contributionUsed: "",
        ownerName: "",
        beneficiaryName: "",
        intermediaryCode: "",
        intermediaryAccountCode: "",
        notes: "",
        objectives: "",
        riskTolerance: "",
        timeHorizon: "",
      });
      setCreatedPlan(null);
      setShowAddProduct(false);
      setSelectedFundCompany("");
      setInvestmentAmount("");
      setShowAddPlan(true);
      // Clear the state to prevent reopening on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleNextStep = () => {
    if (currentStep === 0 && !formValues.type) return;
    if (currentStep === 1 && (!formValues.ownerName || !formValues.beneficiaryName)) return;
    if (currentStep === 2 && (!formValues.intermediaryCode || !formValues.intermediaryAccountCode)) return;
    if (currentStep === 3 && (!formValues.objectives || !formValues.riskTolerance || !formValues.timeHorizon)) return;
    
    if (currentStep === 3) {
      // Submit and show success
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
      
      const newPlan: Plan = {
        id: planId,
        type: formValues.type as PlanType,
        accountNumber: accountNumber,
        clientId: formValues.clientId || `CL-${String(plans.length + 1).padStart(3, "0")}`,
        clientName: formValues.ownerName,
        status: "Active",
        marketValue: 0,
        costBasis: 0,
        totalGainLoss: 0,
        totalGainLossPercent: 0,
        holdings: [],
        openedDate: new Date().toISOString().split("T")[0],
        contributionRoom: formValues.contributionRoom ? parseFloat(formValues.contributionRoom) : undefined,
        contributionUsed: formValues.contributionUsed ? parseFloat(formValues.contributionUsed) : undefined,
        accountHolder: formValues.ownerName,
        startDate: new Date().toISOString().split("T")[0],
        kycOnFileDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        kycAge: "15 days Old",
        kycOriginalReceivedDate: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      };

      setPlans([...plans, newPlan]);
      setCreatedPlan(newPlan);
      setCurrentStep(4); // Show success screen
      setIsLoading(false);
    }, 500);
  };

  const handleCloseDialog = () => {
    setShowAddPlan(false);
    resetForm();
  };


  const handleSaveEdit = () => {
    if (!selectedPlan || !editFormValues.type || !editFormValues.accountNumber) {
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setPlans(
        plans.map((plan) =>
          plan.id === selectedPlan.id
            ? {
                ...plan,
                type: editFormValues.type as PlanType,
                accountNumber: editFormValues.accountNumber,
                clientId: editFormValues.clientId,
                clientName: editFormValues.clientName,
                status: editFormValues.status,
                openedDate: editFormValues.openedDate,
                contributionRoom: editFormValues.contributionRoom ? parseFloat(editFormValues.contributionRoom) : undefined,
                contributionUsed: editFormValues.contributionUsed ? parseFloat(editFormValues.contributionUsed) : undefined,
              }
            : plan
        )
      );
      // Update selected plan with new values
      setSelectedPlan({
        ...selectedPlan,
        type: editFormValues.type as PlanType,
        accountNumber: editFormValues.accountNumber,
        clientId: editFormValues.clientId,
        clientName: editFormValues.clientName,
        status: editFormValues.status,
        openedDate: editFormValues.openedDate,
        contributionRoom: editFormValues.contributionRoom ? parseFloat(editFormValues.contributionRoom) : undefined,
        contributionUsed: editFormValues.contributionUsed ? parseFloat(editFormValues.contributionUsed) : undefined,
      });
      setPlanViewTab("details");
      setIsLoading(false);
    }, 500);
  };

  const toggleHoldingExpansion = (planId: string) => {
    setExpandedHoldings((prev) => {
      const next = new Set(prev);
      if (next.has(planId)) {
        next.delete(planId);
      } else {
        next.add(planId);
      }
      return next;
    });
  };

  // Helper function to get company from fund name
  const getCompanyFromFundName = (fundName: string): string => {
    // First try to find in fund database
    const fund = FUND_DATABASE.find(f => 
      f.name.toUpperCase() === fundName.toUpperCase() ||
      fundName.toUpperCase().includes(f.name.toUpperCase()) ||
      f.name.toUpperCase().includes(fundName.toUpperCase())
    );
    if (fund) return fund.company;
    
    // Fallback to pattern matching
    const name = fundName.toUpperCase();
    if (name.includes("FIDELITY")) return "Fidelity";
    if (name.includes("TD")) return "TD Asset Management";
    if (name.includes("VANGUARD")) return "Vanguard";
    if (name.includes("ISHARES")) return "iShares";
    if (name.includes("BMO")) return "BMO";
    if (name.includes("RBC")) return "RBC";
    if (name.includes("CIBC")) return "CIBC";
    if (name.includes("SCOTIA")) return "Scotia";
    // Default extraction - try to get first word or common pattern
    const words = fundName.split(" ");
    return words[0] || "Unknown";
  };

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

  const planTypeBadgeStyles: Record<PlanType, string> = {
    OPEN: "bg-blue-100 text-blue-700",
    RRSP: "bg-blue-100 text-blue-700",
    RESP: "bg-purple-100 text-purple-700",
    TFSA: "bg-green-100 text-green-700",
    RRIF: "bg-orange-100 text-orange-700",
    "Non-Registered": "bg-gray-100 text-gray-700",
    LIRA: "bg-indigo-100 text-indigo-700",
    LIF: "bg-pink-100 text-pink-700",
  };

  return (
    <PageLayout title="">
      <div className="space-y-6">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="mb-2 border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                Plans
              </CardTitle>

              <div className="flex w-full flex-col gap-4 lg:w-auto lg:flex-row lg:items-start lg:justify-end">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by account number, client name, or plan type..."
                    className="text-sm pl-10 lg:w-72 xl:w-96"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-[180px] justify-between text-sm font-normal"
                      >
                        {typeFilter.size === 0
                          ? "All Plan Types"
                          : typeFilter.size === 1
                          ? Array.from(typeFilter)[0]
                          : `${typeFilter.size} selected`}
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[180px] p-2" align="start">
                      <div className="space-y-1">
                        {planTypeOptions.map((type) => (
                          <label
                            key={type}
                            className="flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-gray-100 rounded cursor-pointer"
                          >
                            <Checkbox
                              checked={typeFilter.has(type)}
                              onCheckedChange={() => toggleTypeFilter(type)}
                              className="h-4 w-4"
                            />
                            <span>{type}</span>
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>

                <Button
                  onClick={() => {
                    setCurrentStep(0);
                    resetForm();
                    setShowAddPlan(true);
                  }}
                  className="bg-gray-900 hover:bg-gray-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Plan
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {isLoading ? (
              <div className="flex items-center justify-center py-16 text-gray-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Loading plans…
              </div>
            ) : filteredPlans.length === 0 ? (
              <div className="py-16 text-center">
                <h3 className="text-base font-semibold text-gray-900">
                  No plans found
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {plans.length === 0
                    ? 'No plans yet. Click "Add Plan" to create your first record.'
                    : "No plans match your filters. Try adjusting your search."}
                </p>
                <Button
                  onClick={() => {
                    setCurrentStep(0);
                    resetForm();
                    setShowAddPlan(true);
                  }}
                  className="mt-4 bg-gray-900 hover:bg-gray-800"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Plan
                </Button>
              </div>
            ) : selectedPlan ? (
              <ResizablePanelGroup direction="horizontal" className="min-h-0">
                {/* Table Section */}
                <ResizablePanel defaultSize={55} minSize={10} maxSize={90} className="min-w-0">
                  <div className="overflow-x-auto h-full pr-2">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-center">Account Number</TableHead>
                          <TableHead className="text-center">Plan Type</TableHead>
                          <TableHead className="text-center">Client</TableHead>
                          <TableHead className="text-center">Market Value</TableHead>
                          <TableHead className="text-center">Holdings</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredPlans.map((plan) => (
                          <TableRow 
                            key={plan.id} 
                            className={`hover:bg-gray-50 cursor-pointer ${selectedPlan?.id === plan.id ? 'bg-blue-50' : ''}`}
                            onClick={() => {
                              setSelectedPlan(plan);
                              setPlanViewTab("details");
                              setExpandedHoldings(new Set());
                            }}
                          >
                            <TableCell className="text-center font-medium text-gray-900">
                              {plan.accountNumber}
                            </TableCell>
                            <TableCell className="text-center">
                              <span
                                className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${planTypeBadgeStyles[plan.type]}`}
                              >
                                {plan.type}
                              </span>
                            </TableCell>
                            <TableCell className="text-center text-sm text-gray-700">
                              {plan.clientName}
                            </TableCell>
                            <TableCell className="text-center text-sm font-medium text-gray-900">
                              {formatCurrency(plan.marketValue)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge variant="secondary" className="text-xs">
                                {plan.holdings.length} holding(s)
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </ResizablePanel>

                <ResizableHandle withHandle />

                {/* Plan View - Right Side with Tabs */}
                <ResizablePanel defaultSize={45} minSize={25} maxSize={95} className="min-w-0">
                  <div className="h-full border-l border-gray-200 pl-4 pr-4 pb-4">
                    <div className="sticky top-0 pt-4 bg-white z-10 pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {selectedPlan.accountNumber}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {selectedPlan.clientName} • {selectedPlan.type}
                          </p>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedPlan(null);
                            setPlanViewTab("details");
                          }}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <Tabs value={planViewTab} onValueChange={(value) => setPlanViewTab(value as "details" | "edit")}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="details">Details</TabsTrigger>
                          <TabsTrigger value="edit">Edit</TabsTrigger>
                        </TabsList>
                        
                        <TabsContent value="details" className="mt-4">
                          <ScrollArea className="h-[calc(100vh-380px)] pr-2">
                            <div className="space-y-4">
                          {/* Investment Summary and Trading Actions Tiles */}
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                          {/* Investment Summary Tile */}
                          <Card className="border border-gray-200 shadow-sm bg-white">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Investment Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-1 space-y-1">
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] text-gray-600">Gross Invested</span>
                                <span className="flex-1 border-b border-dotted border-gray-300 mx-2"></span>
                                <span className="text-[10px] font-semibold text-gray-900">$425,000</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] text-gray-600">Net Invested</span>
                                <span className="flex-1 border-b border-dotted border-gray-300 mx-2"></span>
                                <span className="text-[10px] font-semibold text-gray-900">$410,000</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] text-gray-600">Net Gain</span>
                                <span className="flex-1 border-b border-dotted border-gray-300 mx-2"></span>
                                <span className="text-[10px] font-semibold text-green-600">+$38,500</span>
                              </div>
                              <div className="flex items-center justify-between">
                                <span className="text-[9px] text-gray-600">Rate of Return</span>
                                <span className="flex-1 border-b border-dotted border-gray-300 mx-2"></span>
                                <span className="text-[10px] font-semibold text-green-600">+7.4%</span>
                              </div>
                            </CardContent>
                          </Card>

                            {/* Trading Actions Tile */}
                            <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                              <CardContent className="p-6 flex-1 flex items-center justify-center">
                                <div className="flex items-center justify-center gap-3">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 hover:bg-gray-100"
                                    title="Buy more units"
                                    onClick={() => {
                                      if (selectedPlan && selectedPlan.holdings.length > 0) {
                                        setSelectedHolding({ holding: selectedPlan.holdings[0], plan: selectedPlan });
                                        setBuyOrderData({
                                          investmentAmount: "",
                                          units: "",
                                          estimatedCost: 0,
                                          unitsToPurchase: 0,
                                        });
                                        setShowBuyUnits(true);
                                      }
                                    }}
                                  >
                                    <Plus className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 hover:bg-gray-100"
                                    title="Sell units"
                                    onClick={() => {
                                      if (selectedPlan && selectedPlan.holdings.length > 0) {
                                        setSelectedHolding({ holding: selectedPlan.holdings[0], plan: selectedPlan });
                                        setSellOrderData({
                                          units: "",
                                          dollarAmount: "",
                                          estimatedProceeds: 0,
                                          unitsToSell: 0,
                                        });
                                        setShowSellUnits(true);
                                      }
                                    }}
                                  >
                                    <Minus className="h-4 w-4" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-8 w-8 p-0 hover:bg-gray-100"
                                    title="Switch/Conversion"
                                    onClick={() => {
                                      if (selectedPlan && selectedPlan.holdings.length > 0) {
                                        setSelectedHolding({ holding: selectedPlan.holdings[0], plan: selectedPlan });
                                        setSwitchData({
                                          units: "",
                                          selectedCompany: "",
                                          selectedFund: "",
                                          selectedFundSymbol: "",
                                          estimatedValue: 0,
                                        });
                                        setConvertData({
                                          units: "",
                                          selectedCompany: "",
                                          selectedFund: "",
                                          selectedFundSymbol: "",
                                          estimatedValue: 0,
                                        });
                                        setIsConvertMode(false);
                                        setShowSwitchFund(true);
                                      }
                                    }}
                                  >
                                    <ArrowLeftRight className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          </div>

                          {/* New Card Above Plan Summary */}
                          <Card className="border border-gray-200 shadow-sm bg-white">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Overview</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Account Number</p>
                                  <p className="text-sm font-medium text-gray-900">{selectedPlan.accountNumber}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Account Holder</p>
                                  <p className="text-sm font-medium text-gray-900">{selectedPlan.accountHolder}</p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Plan Summary */}
                          <Card className="border border-gray-200 shadow-sm bg-white">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Plan Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Plan Type</p>
                                  <span
                                    className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${planTypeBadgeStyles[selectedPlan.type]}`}
                                  >
                                    {selectedPlan.type}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Client</p>
                                  <p className="text-sm font-medium text-gray-900">{selectedPlan.clientName}</p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Opened Date</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatDate(selectedPlan.openedDate)}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Important Dates - Moved up for better visibility */}
                          <Card className="border-2 border-blue-200 shadow-md bg-white" key={selectedPlan.id}>
                            <CardHeader className="pb-3 bg-blue-50">
                              <CardTitle className="text-sm font-bold text-gray-900">Important Dates</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-2 border-b border-gray-100 pb-3">
                                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Start Date</Label>
                                  <div className="text-base font-semibold text-blue-700">
                                    {formatDate(selectedPlan.startDate)}
                                  </div>
                                </div>
                                <div className="space-y-2 border-b border-gray-100 pb-3">
                                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">KYC On File Date</Label>
                                  <div className="text-base font-semibold text-blue-700">
                                    {formatDate(selectedPlan.kycOnFileDate)}
                                  </div>
                                </div>
                                <div className="space-y-2 border-b border-gray-100 pb-3">
                                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">KYC Age</Label>
                                  <div className="text-base font-semibold text-orange-600">
                                    {selectedPlan.kycAge}
                                  </div>
                                </div>
                                <div className="space-y-2 border-b border-gray-100 pb-3">
                                  <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">KYC Original Received Date</Label>
                                  <div className="text-base font-semibold text-blue-700">
                                    {formatDate(selectedPlan.kycOriginalReceivedDate)}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Total Holdings Summary */}
                          <Card className="border border-gray-200 shadow-sm bg-white">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">
                                Total Plan Holdings
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Market Value</p>
                                  <p className="text-base font-semibold text-gray-900">
                                    {formatCurrency(selectedPlan.marketValue)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Cost Basis</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatCurrency(selectedPlan.costBasis)}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 mb-1">Number of Holdings</p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {selectedPlan.holdings.length}
                                  </p>
                                </div>
                                {selectedPlan.contributionRoom !== undefined && (
                                  <>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">Contribution Room</p>
                                      <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(selectedPlan.contributionRoom)}
                                      </p>
                                    </div>
                                    <div>
                                      <p className="text-xs text-gray-500 mb-1">Contribution Used</p>
                                      <p className="text-sm font-medium text-gray-900">
                                        {formatCurrency(selectedPlan.contributionUsed || 0)}
                                      </p>
                                    </div>
                                  </>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Holdings Table */}
                          <Card className="border border-gray-200 shadow-sm bg-white">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">
                                Holdings ({selectedPlan.holdings.length})
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="overflow-x-auto">
                                <Table>
                                  <TableHeader>
                                    <TableRow className="border-gray-200">
                                      <TableHead className="text-gray-700 font-semibold text-xs">Symbol</TableHead>
                                      <TableHead className="text-gray-700 font-semibold text-xs">Product</TableHead>
                                      <TableHead className="text-gray-700 font-semibold text-xs text-right">Shares</TableHead>
                                      <TableHead className="text-gray-700 font-semibold text-xs text-right">Price</TableHead>
                                      <TableHead className="text-gray-700 font-semibold text-xs text-right">Market Value</TableHead>
                                      <TableHead className="text-gray-700 font-semibold text-xs text-center">Actions</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {selectedPlan.holdings.map((holding, index) => (
                                      <TableRow key={index} className="border-gray-200">
                                        <TableCell className="font-medium text-gray-900 text-xs">
                                          {holding.symbol}
                                        </TableCell>
                                        <TableCell>
                                          <div>
                                            <p className="text-xs font-medium text-gray-900">{holding.name}</p>
                                            <p className="text-[10px] text-gray-500">
                                              {holding.assetClass} {holding.sector && `• ${holding.sector}`}
                                            </p>
                                          </div>
                                        </TableCell>
                                        <TableCell className="text-right text-gray-700 text-xs">
                                          {holding.shares.toLocaleString()}
                                        </TableCell>
                                        <TableCell className="text-right text-xs">
                                          <span className="text-xs font-medium text-gray-900">
                                            {formatCurrency(holding.price)}
                                          </span>
                                        </TableCell>
                                        <TableCell className="text-right text-xs">
                                          <span className="text-xs font-medium text-gray-900">
                                            {formatCurrency(holding.marketValue)}
                                          </span>
                                        </TableCell>
                                        <TableCell>
                                          <div className="flex items-center justify-center gap-1">
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0"
                                              title="Buy more units"
                                              onClick={() => {
                                                setSelectedHolding({ holding, plan: selectedPlan });
                                                setBuyOrderData({
                                                  investmentAmount: "",
                                                  units: "",
                                                  estimatedCost: 0,
                                                  unitsToPurchase: 0,
                                                });
                                                setShowBuyUnits(true);
                                              }}
                                            >
                                              <Plus className="h-3 w-3 text-gray-600" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0"
                                              title="Sell units"
                                              onClick={() => {
                                                setSelectedHolding({ holding, plan: selectedPlan });
                                                setSellOrderData({
                                                  units: "",
                                                  dollarAmount: "",
                                                  estimatedProceeds: 0,
                                                  unitsToSell: 0,
                                                });
                                                setShowSellUnits(true);
                                              }}
                                            >
                                              <Minus className="h-3 w-3 text-gray-600" />
                                            </Button>
                                            <Button
                                              variant="ghost"
                                              size="sm"
                                              className="h-6 w-6 p-0"
                                              title="Switch/Conversion"
                                              onClick={() => {
                                                setSelectedHolding({ holding, plan: selectedPlan });
                                                setSwitchData({
                                                  units: "",
                                                  selectedCompany: "",
                                                  selectedFund: "",
                                                  selectedFundSymbol: "",
                                                  estimatedValue: 0,
                                                });
                                                setConvertData({
                                                  units: "",
                                                  selectedCompany: "",
                                                  selectedFund: "",
                                                  selectedFundSymbol: "",
                                                  estimatedValue: 0,
                                                });
                                                setIsConvertMode(false);
                                                setShowSwitchFund(true);
                                              }}
                                            >
                                              <ArrowLeftRight className="h-3 w-3 text-gray-600" />
                                            </Button>
                                          </div>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </div>
                            </CardContent>
                          </Card>
                            </div>
                          </ScrollArea>
                        </TabsContent>
                        
                        <TabsContent value="edit" className="mt-4">
                          <ScrollArea className="h-[calc(100vh-380px)] pr-2">
                            <form
                              onSubmit={(e) => {
                                e.preventDefault();
                                handleSaveEdit();
                              }}
                              className="space-y-4"
                            >
                          <Card className="border border-gray-200 shadow-sm bg-white">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">
                                Plan Information
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                              <div className="grid grid-cols-1 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="edit-type" className="text-xs">Plan Type *</Label>
                                  <Select
                                    value={editFormValues.type}
                                    onValueChange={(value) =>
                                      setEditFormValues({ ...editFormValues, type: value as PlanType })
                                    }
                                  >
                                    <SelectTrigger className="h-9 text-sm">
                                      <SelectValue placeholder="Select plan type" />
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

                                <div className="space-y-2">
                                  <Label htmlFor="edit-accountNumber" className="text-xs">Account Number *</Label>
                                  <Input
                                    id="edit-accountNumber"
                                    value={editFormValues.accountNumber}
                                    onChange={(e) =>
                                      setEditFormValues({
                                        ...editFormValues,
                                        accountNumber: e.target.value,
                                      })
                                    }
                                    className="h-9 text-sm"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-clientName" className="text-xs">Client Name *</Label>
                                  <Input
                                    id="edit-clientName"
                                    value={editFormValues.clientName}
                                    onChange={(e) =>
                                      setEditFormValues({ ...editFormValues, clientName: e.target.value })
                                    }
                                    className="h-9 text-sm"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-clientId" className="text-xs">Client ID</Label>
                                  <Input
                                    id="edit-clientId"
                                    value={editFormValues.clientId}
                                    onChange={(e) =>
                                      setEditFormValues({ ...editFormValues, clientId: e.target.value })
                                    }
                                    className="h-9 text-sm"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-openedDate" className="text-xs">Opened Date</Label>
                                  <Input
                                    id="edit-openedDate"
                                    type="date"
                                    value={editFormValues.openedDate}
                                    onChange={(e) =>
                                      setEditFormValues({ ...editFormValues, openedDate: e.target.value })
                                    }
                                    className="h-9 text-sm"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-contributionRoom" className="text-xs">Contribution Room</Label>
                                  <Input
                                    id="edit-contributionRoom"
                                    type="number"
                                    value={editFormValues.contributionRoom}
                                    onChange={(e) =>
                                      setEditFormValues({
                                        ...editFormValues,
                                        contributionRoom: e.target.value,
                                      })
                                    }
                                    className="h-9 text-sm"
                                  />
                                </div>

                                <div className="space-y-2">
                                  <Label htmlFor="edit-contributionUsed" className="text-xs">Contribution Used</Label>
                                  <Input
                                    id="edit-contributionUsed"
                                    type="number"
                                    value={editFormValues.contributionUsed}
                                    onChange={(e) =>
                                      setEditFormValues({
                                        ...editFormValues,
                                        contributionUsed: e.target.value,
                                      })
                                    }
                                    className="h-9 text-sm"
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                              <div className="flex justify-end gap-3 pb-4">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => {
                                    setPlanViewTab("details");
                                  }}
                                  className="h-9 text-sm"
                                >
                                  Cancel
                                </Button>
                                <Button type="submit" disabled={isLoading} className="bg-gray-900 hover:bg-gray-800 h-9 text-sm">
                                  {isLoading ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Saving...
                                    </>
                                  ) : (
                                    "Save Changes"
                                  )}
                                </Button>
                              </div>
                            </form>
                          </ScrollArea>
                        </TabsContent>
                      </Tabs>
                    </div>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            ) : (
              <div className="overflow-x-auto w-full">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">Account Number</TableHead>
                      <TableHead className="text-center">Plan Type</TableHead>
                      <TableHead className="text-center">Client</TableHead>
                      <TableHead className="text-center">Market Value</TableHead>
                      <TableHead className="text-center">Holdings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPlans.map((plan) => (
                      <TableRow 
                        key={plan.id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => {
                          setSelectedPlan(plan);
                          setPlanViewTab("details");
                          setExpandedHoldings(new Set());
                        }}
                      >
                        <TableCell className="text-center font-medium text-gray-900">
                          {plan.accountNumber}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${planTypeBadgeStyles[plan.type]}`}
                          >
                            {plan.type}
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-sm text-gray-700">
                          {plan.clientName}
                        </TableCell>
                        <TableCell className="text-center text-sm font-medium text-gray-900">
                          {formatCurrency(plan.marketValue)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge variant="secondary" className="text-xs">
                            {plan.holdings.length} holding(s)
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Add Plan Dialog - Multi-Step Wizard */}
        <Dialog open={showAddPlan} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader className="relative">
              {currentStep === 0 ? (
                <>
                  <DialogTitle>Select Plan Type</DialogTitle>
                </>
              ) : currentStep === 4 ? (
                <>
                  <DialogTitle className="flex items-center gap-2 text-blue-600">
                    <Plus className="h-5 w-5" />
                    Add Product
                  </DialogTitle>
                  <DialogDescription>Add a new investment product to your portfolio.</DialogDescription>
                </>
              ) : (
                <DialogTitle>
                  Plan Setup - {formValues.type} (Step {currentStep} of 3)
                </DialogTitle>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-6 w-6"
                onClick={handleCloseDialog}
              >
                <X className="h-4 w-4" />
              </Button>
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

                <DialogFooter>
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

                <DialogFooter>
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

                <DialogFooter>
                  <Button variant="outline" onClick={handlePreviousStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
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

                <DialogFooter>
                  <Button variant="outline" onClick={handlePreviousStep}>
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
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
                </DialogFooter>
              </div>
            ) : currentStep === 4 && createdPlan ? (
              /* Step 4: Success Screen with Add Product */
              <div className="space-y-6 py-4">
                {/* Success Message */}
                <Card className="border border-green-200 bg-green-50">
                  <CardContent className="pt-4">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-6 w-6 text-green-600 mt-0.5" />
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-900 mb-2">
                          New Plan Created Successfully!
                        </h3>
                        <div className="space-y-1 text-sm text-gray-700">
                          <p>
                            <span className="font-medium">Plan Type:</span>{" "}
                            <span className="text-blue-600">{createdPlan.type}</span>
                          </p>
                          <p>
                            <span className="font-medium">Plan ID:</span> {createdPlan.id}
                          </p>
                          <p>
                            <span className="font-medium">Account Number:</span>{" "}
                            {createdPlan.accountNumber}
                          </p>
                          <p>
                            <span className="font-medium">Owner:</span> {createdPlan.clientName}
                          </p>
                        </div>
                        <div className="mt-3 flex items-center gap-2 text-sm text-blue-600">
                          <Sparkles className="h-4 w-4" />
                          <span>+ Add your first investment to this plan below</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Trust Account CAD */}
                <Card className="border border-blue-200 bg-blue-50">
                  <CardContent className="pt-3">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-gray-700">
                          $ Trust Account CAD
                        </span>
                      </div>
                      <div className="text-lg font-bold text-gray-900">
                        {formatCurrency(1250)}
                      </div>
                      <div className="flex gap-3 text-xs text-gray-600 pt-1.5 border-t border-blue-200">
                        <span className="text-green-600">Settled: {formatCurrency(1250)}</span>
                        <span className="text-orange-600">Unsettled: {formatCurrency(0)}</span>
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
                    <Select
                      value={selectedFundCompany}
                      onValueChange={setSelectedFundCompany}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Choose a company that offers funds" />
                      </SelectTrigger>
                      <SelectContent>
                        {fundCompanies.map((company) => (
                          <SelectItem key={company} value={company}>
                            {company}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

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
                  <Card className="border border-blue-200 bg-blue-50">
                    <CardContent className="pt-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-blue-600">Order Preview:</p>
                        <p className="text-sm text-blue-600">
                          Amount: {formatCurrency(parseFloat(investmentAmount) || 0)}
                        </p>
                        <p className="text-xs text-blue-600/80">
                          This will purchase the selected fund with the specified amount
                        </p>
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
                      handleCloseDialog();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    Place Order
                  </Button>
                </DialogFooter>
              </div>
            ) : null}
          </DialogContent>
        </Dialog>

        {/* Buy More Units Dialog */}
        <Dialog open={showBuyUnits} onOpenChange={setShowBuyUnits}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-green-600">
                <Plus className="h-5 w-5 text-green-600" />
                Buy More Units
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Purchase additional units of {selectedHolding?.holding.name || ""}
              </DialogDescription>
            </DialogHeader>

            {selectedHolding && (
              <div className="space-y-6 py-4">
                {/* Account Balance */}
                <Card className="border border-blue-200 bg-blue-50">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Account Balance</span>
                        <span className="text-sm font-semibold text-blue-700">
                          {selectedHolding.plan.type} CAD
                        </span>
                      </div>
                      <div className="text-2xl font-bold text-gray-900">
                        {formatCurrency(selectedHolding.plan.marketValue)}
                      </div>
                      <div className="flex gap-4 text-xs text-gray-600 pt-2 border-t border-blue-200">
                        <span>Settled: {formatCurrency(selectedHolding.plan.marketValue)}</span>
                        <span>Unsettled: {formatCurrency(0)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Holdings */}
                <Card className="border border-gray-200">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      Current Holdings ({selectedHolding.plan.type})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedHolding.holding.shares.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Price</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(selectedHolding.holding.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Market Value</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(selectedHolding.holding.marketValue)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Input */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="investmentAmount" className="text-sm font-medium text-gray-700">
                      Investment Amount ($)
                    </Label>
                    <Input
                      id="investmentAmount"
                      type="number"
                      placeholder="Enter amount to invest"
                      value={buyOrderData.investmentAmount}
                      onChange={(e) => {
                        const amount = e.target.value;
                        setBuyOrderData({
                          ...buyOrderData,
                          investmentAmount: amount,
                          units: amount
                            ? (
                                parseFloat(amount) / selectedHolding.holding.price
                              ).toFixed(4)
                            : "",
                          estimatedCost: amount ? parseFloat(amount) : 0,
                          unitsToPurchase: amount
                            ? parseFloat(amount) / selectedHolding.holding.price
                            : 0,
                        });
                      }}
                      className="w-full"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="units" className="text-sm font-medium text-gray-700">
                      Or Number of Units
                    </Label>
                    <Input
                      id="units"
                      type="number"
                      step="0.0001"
                      placeholder="Enter number of units"
                      value={buyOrderData.units}
                      onChange={(e) => {
                        const units = e.target.value;
                        const unitsNum = parseFloat(units) || 0;
                        setBuyOrderData({
                          ...buyOrderData,
                          units: units,
                          investmentAmount: unitsNum
                            ? (unitsNum * selectedHolding.holding.price).toFixed(2)
                            : "",
                          estimatedCost: unitsNum * selectedHolding.holding.price,
                          unitsToPurchase: unitsNum,
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Estimated Cost */}
                <Card className="border border-blue-200 bg-blue-50">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Estimated Cost</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(buyOrderData.estimatedCost)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Units to purchase:</span>
                        <span className="font-medium">
                          {buyOrderData.unitsToPurchase.toFixed(4)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 pt-2 border-t border-blue-200">
                        Based on avg. cost {formatCurrency(selectedHolding.holding.price)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowBuyUnits(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedHolding && buyOrderData.estimatedCost > 0) {
                    setOrderConfirmationData({
                      symbol: selectedHolding.holding.symbol,
                      name: selectedHolding.holding.name,
                      units: buyOrderData.unitsToPurchase,
                      price: selectedHolding.holding.price,
                      totalCost: buyOrderData.estimatedCost,
                    });
                    setShowBuyUnits(false);
                    setShowOrderConfirmation(true);
                  }
                }}
                disabled={buyOrderData.estimatedCost === 0}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                Place Buy Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Order Confirmation Dialog */}
        <Dialog open={showOrderConfirmation} onOpenChange={setShowOrderConfirmation}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl font-semibold text-gray-900">
                Order Confirmation
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-gray-600">
                Your buy order has been placed successfully
              </DialogDescription>
            </DialogHeader>

            {orderConfirmationData && (
              <div className="space-y-4 py-4">
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Product</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {orderConfirmationData.symbol} - {orderConfirmationData.name}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Units</p>
                          <p className="text-sm font-medium text-gray-900">
                            {orderConfirmationData.units.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Price per Unit</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(orderConfirmationData.price)}
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Total Cost</span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(orderConfirmationData.totalCost)}
                          </span>
                        </div>
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
                  setOrderConfirmationData(null);
                  setBuyOrderData({
                    investmentAmount: "",
                    units: "",
                    estimatedCost: 0,
                    unitsToPurchase: 0,
                  });
                }}
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sell Units Dialog */}
        <Dialog open={showSellUnits} onOpenChange={setShowSellUnits}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold text-red-600">
                <Minus className="h-5 w-5 text-red-600" />
                Sell Units
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                Sell units of {selectedHolding?.holding.name || ""}
              </DialogDescription>
            </DialogHeader>

            {selectedHolding && (
              <div className="space-y-6 py-4">
                {/* Current Holdings */}
                <Card className="border border-gray-200 bg-gray-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      Current Holdings ({selectedHolding.plan.type})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units Available</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedHolding.holding.shares.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Price</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(selectedHolding.holding.price)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Market Value</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(selectedHolding.holding.marketValue)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Sell Input */}
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sellUnits" className="text-sm font-medium text-gray-700">
                      Number of Units to Sell
                    </Label>
                    <div className="relative">
                      <Input
                        id="sellUnits"
                        type="number"
                        step="0.0001"
                        placeholder={`Max: ${selectedHolding.holding.shares.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}`}
                        value={sellOrderData.units}
                        onChange={(e) => {
                          const units = e.target.value;
                          const unitsNum = parseFloat(units) || 0;
                          const maxUnits = selectedHolding.holding.shares;
                          const validUnits = unitsNum > maxUnits ? maxUnits : unitsNum;
                          setSellOrderData({
                            ...sellOrderData,
                            units: units,
                            dollarAmount: validUnits
                              ? (validUnits * selectedHolding.holding.price).toFixed(2)
                              : "",
                            estimatedProceeds: validUnits * selectedHolding.holding.price,
                            unitsToSell: validUnits,
                          });
                        }}
                        className="w-full pr-20"
                        max={selectedHolding.holding.shares}
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col">
                        <button
                          type="button"
                          onClick={() => {
                            const current = parseFloat(sellOrderData.units) || 0;
                            const newValue = Math.min(current + 1, selectedHolding.holding.shares);
                            setSellOrderData({
                              ...sellOrderData,
                              units: newValue.toString(),
                              dollarAmount: (newValue * selectedHolding.holding.price).toFixed(2),
                              estimatedProceeds: newValue * selectedHolding.holding.price,
                              unitsToSell: newValue,
                            });
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ChevronUp className="h-3 w-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const current = parseFloat(sellOrderData.units) || 0;
                            const newValue = Math.max(current - 1, 0);
                            setSellOrderData({
                              ...sellOrderData,
                              units: newValue > 0 ? newValue.toString() : "",
                              dollarAmount: newValue > 0 ? (newValue * selectedHolding.holding.price).toFixed(2) : "",
                              estimatedProceeds: newValue * selectedHolding.holding.price,
                              unitsToSell: newValue,
                            });
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <ChevronDown className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sellDollarAmount" className="text-sm font-medium text-gray-700">
                      Or Dollar Amount ($)
                    </Label>
                    <Input
                      id="sellDollarAmount"
                      type="number"
                      placeholder="Enter dollar amount"
                      value={sellOrderData.dollarAmount}
                      onChange={(e) => {
                        const amount = e.target.value;
                        const amountNum = parseFloat(amount) || 0;
                        const maxAmount = selectedHolding.holding.marketValue;
                        const validAmount = amountNum > maxAmount ? maxAmount : amountNum;
                        const unitsFromAmount = validAmount / selectedHolding.holding.price;
                        setSellOrderData({
                          ...sellOrderData,
                          dollarAmount: amount,
                          units: validAmount > 0 ? unitsFromAmount.toFixed(4) : "",
                          estimatedProceeds: validAmount,
                          unitsToSell: unitsFromAmount,
                        });
                      }}
                      className="w-full"
                    />
                  </div>
                </div>

                {/* Estimated Proceeds */}
                <Card className="border border-yellow-200 bg-yellow-50">
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">Estimated Proceeds</span>
                        <span className="text-lg font-bold text-gray-900">
                          {formatCurrency(sellOrderData.estimatedProceeds)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-gray-600">
                        <span>Units to sell:</span>
                        <span className="font-medium">
                          {sellOrderData.unitsToSell.toFixed(4)}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 pt-2 border-t border-yellow-200">
                        Before fees and taxes • Based on avg. cost {formatCurrency(selectedHolding.holding.price)}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => setShowSellUnits(false)}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedHolding && sellOrderData.estimatedProceeds > 0) {
                    setSellOrderConfirmationData({
                      symbol: selectedHolding.holding.symbol,
                      name: selectedHolding.holding.name,
                      units: sellOrderData.unitsToSell,
                      price: selectedHolding.holding.price,
                      totalProceeds: sellOrderData.estimatedProceeds,
                    });
                    setShowSellUnits(false);
                    setShowSellOrderConfirmation(true);
                  }
                }}
                disabled={sellOrderData.estimatedProceeds === 0}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                Place Sell Order
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Sell Order Confirmation Dialog */}
        <Dialog open={showSellOrderConfirmation} onOpenChange={setShowSellOrderConfirmation}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-red-100 p-3">
                  <CheckCircle2 className="h-8 w-8 text-red-600" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl font-semibold text-gray-900">
                Order Confirmation
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-gray-600">
                Your sell order has been placed successfully
              </DialogDescription>
            </DialogHeader>

            {sellOrderConfirmationData && (
              <div className="space-y-4 py-4">
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Product</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {sellOrderConfirmationData.symbol} - {sellOrderConfirmationData.name}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Units</p>
                          <p className="text-sm font-medium text-gray-900">
                            {sellOrderConfirmationData.units.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Price per Unit</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(sellOrderConfirmationData.price)}
                          </p>
                        </div>
                      </div>
                      <div className="pt-3 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-700">Total Proceeds</span>
                          <span className="text-lg font-bold text-gray-900">
                            {formatCurrency(sellOrderConfirmationData.totalProceeds)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={() => {
                  setShowSellOrderConfirmation(false);
                  setSellOrderConfirmationData(null);
                  setSellOrderData({
                    units: "",
                    dollarAmount: "",
                    estimatedProceeds: 0,
                    unitsToSell: 0,
                  });
                }}
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Switch/Convert Fund Dialog */}
        <Dialog open={showSwitchFund || showConvertFund} onOpenChange={(open) => {
          if (!open) {
            setShowSwitchFund(false);
            setShowConvertFund(false);
            setIsConvertMode(false);
          }
        }}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className={`flex items-center gap-2 text-xl font-semibold ${isConvertMode ? "text-orange-600" : "text-blue-600"}`}>
                <ArrowLeftRight className={`h-5 w-5 ${isConvertMode ? "text-orange-600" : "text-blue-600"}`} />
                {isConvertMode ? "Convert Fund" : "Switch Fund"}
              </DialogTitle>
              <DialogDescription className="text-sm text-gray-600">
                {isConvertMode 
                  ? `Convert from ${selectedHolding?.holding.name || ""} (${selectedHolding && getCompanyFromFundName(selectedHolding.holding.name)}) to a ${convertData.selectedCompany || "different company"} fund`
                  : `Switch from ${selectedHolding?.holding.name || ""} to another ${selectedHolding && getCompanyFromFundName(selectedHolding.holding.name)} fund`
                }
              </DialogDescription>
            </DialogHeader>

            {selectedHolding && (
              <div className="space-y-6 py-4">
                {/* Current Fund */}
                <Card className="border border-gray-200 bg-gray-50">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold text-gray-900">
                      Current Fund ({selectedHolding.plan.type})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <p className="text-sm font-semibold text-gray-900 mb-1">
                        {selectedHolding.holding.name}
                      </p>
                      <p className="text-xs text-gray-600">Company: {getCompanyFromFundName(selectedHolding.holding.name)}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-200">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units Available</p>
                        <p className="text-sm font-medium text-gray-900">
                          {selectedHolding.holding.shares.toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Market Value</p>
                        <p className="text-sm font-medium text-gray-900">
                          {formatCurrency(selectedHolding.holding.marketValue)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Select Fund Company */}
                <div className="space-y-2">
                  <Label htmlFor="switchCompany" className="text-sm font-medium text-gray-700">
                    Select Fund Company
                  </Label>
                  <Select
                    value={isConvertMode ? convertData.selectedCompany : switchData.selectedCompany}
                    onValueChange={(value) => {
                      const currentCompany = getCompanyFromFundName(selectedHolding.holding.name);
                      const isSameCompany = value === currentCompany;
                      
                      if (!isSameCompany) {
                        setIsConvertMode(true);
                        setConvertData({
                          units: switchData.units,
                          selectedCompany: value,
                          selectedFund: "",
                          selectedFundSymbol: "",
                          estimatedValue: 0,
                        });
                      } else {
                        setIsConvertMode(false);
                        setSwitchData({
                          ...switchData,
                          selectedCompany: value,
                          selectedFund: "",
                          selectedFundSymbol: "",
                          estimatedValue: 0,
                        });
                      }
                    }}
                  >
                    <SelectTrigger id="switchCompany" className="w-full">
                      <SelectValue placeholder="Select fund company" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from(new Set(FUND_DATABASE.map(f => f.company))).map((company) => {
                        const currentCompany = getCompanyFromFundName(selectedHolding.holding.name);
                        const isSameCompany = company === currentCompany;
                        return (
                          <SelectItem key={company} value={company}>
                            <div className="flex items-center justify-between w-full">
                              <span>{company}</span>
                              {isSameCompany && (
                                <Badge className="ml-2 bg-blue-100 text-blue-700 text-xs">Switch</Badge>
                              )}
                              {!isSameCompany && (
                                <Badge className="ml-2 bg-orange-100 text-orange-700 text-xs">Convert</Badge>
                              )}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                  {(isConvertMode ? convertData.selectedCompany : switchData.selectedCompany) && (
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className={isConvertMode ? "bg-orange-100 text-orange-700 border-orange-200" : "bg-blue-100 text-blue-700 border-blue-200"}>
                        {isConvertMode ? "Conversion" : "Switch"}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        ({selectedHolding.holding.name}) → ({isConvertMode ? convertData.selectedCompany : switchData.selectedCompany})
                      </span>
                    </div>
                  )}
                </div>

                {/* Select Fund to Switch/Convert to */}
                {(isConvertMode ? convertData.selectedCompany : switchData.selectedCompany) && (
                  <div className="space-y-2">
                    <Label htmlFor="switchFund" className="text-sm font-medium text-gray-700">
                      Select Fund to {isConvertMode ? "Convert" : "Switch"} to
                    </Label>
                    <Select
                      value={isConvertMode ? convertData.selectedFund : switchData.selectedFund}
                      onValueChange={(value) => {
                        const selectedFund = FUND_DATABASE.find(f => f.name === value);
                        if (selectedFund) {
                          const units = isConvertMode ? convertData.units : switchData.units;
                          const unitsNum = parseFloat(units) || 0;
                          const estimatedValue = unitsNum > 0 ? unitsNum * selectedHolding.holding.price : 0;
                          
                          if (isConvertMode) {
                            setConvertData({
                              ...convertData,
                              selectedFund: selectedFund.name,
                              selectedFundSymbol: selectedFund.symbol,
                              estimatedValue: estimatedValue,
                            });
                          } else {
                            setSwitchData({
                              ...switchData,
                              selectedFund: selectedFund.name,
                              selectedFundSymbol: selectedFund.symbol,
                              estimatedValue: estimatedValue,
                            });
                          }
                        }
                      }}
                    >
                      <SelectTrigger id="switchFund" className="w-full">
                        <SelectValue placeholder={`Select ${isConvertMode ? convertData.selectedCompany : switchData.selectedCompany} fund`} />
                      </SelectTrigger>
                      <SelectContent>
                        {FUND_DATABASE.filter(f => f.company === (isConvertMode ? convertData.selectedCompany : switchData.selectedCompany)).map((fund) => (
                          <SelectItem key={fund.symbol} value={fund.name}>
                            <div className="flex flex-col">
                              <span className="font-medium">{fund.name}</span>
                              <span className="text-xs text-gray-500">{fund.symbol} • {fund.category || "N/A"}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Units to Switch/Convert */}
                <div className="space-y-2">
                  <Label htmlFor="switchUnits" className="text-sm font-medium text-gray-700">
                    Units to {isConvertMode ? "Convert" : "Switch"}
                  </Label>
                  <div className="relative">
                    <Input
                      id="switchUnits"
                      type="number"
                      step="0.0001"
                      placeholder={`Max: ${selectedHolding.holding.shares.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`}
                      value={isConvertMode ? convertData.units : switchData.units}
                      onChange={(e) => {
                        const units = e.target.value;
                        const unitsNum = parseFloat(units) || 0;
                        const maxUnits = selectedHolding.holding.shares;
                        const validUnits = unitsNum > maxUnits ? maxUnits : unitsNum;
                        const estimatedValue = validUnits * selectedHolding.holding.price;
                        
                        if (isConvertMode) {
                          setConvertData({
                            ...convertData,
                            units: units,
                            estimatedValue: estimatedValue,
                          });
                        } else {
                          setSwitchData({
                            ...switchData,
                            units: units,
                            estimatedValue: estimatedValue,
                          });
                        }
                      }}
                      className="w-full pr-20"
                      max={selectedHolding.holding.shares}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col">
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseFloat(isConvertMode ? convertData.units : switchData.units) || 0;
                          const newValue = Math.min(current + 1, selectedHolding.holding.shares);
                          const estimatedValue = newValue * selectedHolding.holding.price;
                          
                          if (isConvertMode) {
                            setConvertData({
                              ...convertData,
                              units: newValue.toString(),
                              estimatedValue: estimatedValue,
                            });
                          } else {
                            setSwitchData({
                              ...switchData,
                              units: newValue.toString(),
                              estimatedValue: estimatedValue,
                            });
                          }
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ChevronUp className="h-3 w-3" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          const current = parseFloat(isConvertMode ? convertData.units : switchData.units) || 0;
                          const newValue = Math.max(current - 1, 0);
                          const estimatedValue = newValue * selectedHolding.holding.price;
                          
                          if (isConvertMode) {
                            setConvertData({
                              ...convertData,
                              units: newValue > 0 ? newValue.toString() : "",
                              estimatedValue: estimatedValue,
                            });
                          } else {
                            setSwitchData({
                              ...switchData,
                              units: newValue > 0 ? newValue.toString() : "",
                              estimatedValue: estimatedValue,
                            });
                          }
                        }}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Switch/Convert Preview */}
                <Card className={isConvertMode ? "border border-orange-200 bg-orange-50" : "border border-blue-200 bg-blue-50"}>
                  <CardContent className="pt-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={isConvertMode ? "bg-orange-600 text-white" : "bg-blue-600 text-white"}>
                          {isConvertMode ? "CONVERSION" : "SWITCH"}
                        </Badge>
                        <span className={`text-sm font-medium ${isConvertMode ? "text-orange-700" : "text-blue-700"}`}>
                          ({selectedHolding.holding.name}) → ({(isConvertMode ? convertData.selectedFund : switchData.selectedFund) || (isConvertMode ? convertData.selectedCompany : switchData.selectedCompany) || "Select fund"})
                        </span>
                      </div>
                      <div className={`flex items-center justify-between text-sm ${isConvertMode ? "text-orange-700" : "text-blue-700"}`}>
                        <span>Units to {isConvertMode ? "convert" : "switch"}:</span>
                        <span className="font-medium">
                          {parseFloat(isConvertMode ? convertData.units : switchData.units) || 0}
                        </span>
                      </div>
                      <div className={`flex items-center justify-between text-sm ${isConvertMode ? "text-orange-700" : "text-blue-700"}`}>
                        <span>Estimated value:</span>
                        <span className="font-medium">
                          {formatCurrency(isConvertMode ? convertData.estimatedValue : switchData.estimatedValue)}
                        </span>
                      </div>
                      <div className={`text-xs pt-2 border-t ${isConvertMode ? "text-orange-600 border-orange-200" : "text-blue-600 border-blue-200"}`}>
                        This will {isConvertMode ? "convert" : "switch"} {selectedHolding.holding.name} to {(isConvertMode ? convertData.selectedFund : switchData.selectedFund) || (isConvertMode ? convertData.selectedCompany : switchData.selectedCompany) || "selected fund"}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setShowSwitchFund(false);
                setShowConvertFund(false);
                setIsConvertMode(false);
              }}>
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (isConvertMode) {
                    if (selectedHolding && convertData.estimatedValue > 0 && convertData.selectedFund) {
                      setConvertConfirmationData({
                        fromFund: selectedHolding.holding.name,
                        toFund: convertData.selectedFund,
                        units: parseFloat(convertData.units) || 0,
                        estimatedValue: convertData.estimatedValue,
                      });
                      setShowSwitchFund(false);
                      setShowConvertFund(false);
                      setIsConvertMode(false);
                      setShowConvertConfirmation(true);
                    }
                  } else {
                    if (selectedHolding && switchData.estimatedValue > 0 && switchData.selectedFund) {
                      setSwitchConfirmationData({
                        fromFund: selectedHolding.holding.name,
                        toFund: switchData.selectedFund,
                        units: parseFloat(switchData.units) || 0,
                        estimatedValue: switchData.estimatedValue,
                      });
                      setShowSwitchFund(false);
                      setShowConvertFund(false);
                      setIsConvertMode(false);
                      setShowSwitchConfirmation(true);
                    }
                  }
                }}
                disabled={(isConvertMode ? convertData.estimatedValue : switchData.estimatedValue) === 0 || !(isConvertMode ? convertData.selectedFund : switchData.selectedFund)}
                className={isConvertMode ? "bg-orange-600 hover:bg-orange-700 text-white" : "bg-blue-600 hover:bg-blue-700 text-white"}
              >
                Execute {isConvertMode ? "Conversion" : "Switch"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Switch Confirmation Dialog */}
        <Dialog open={showSwitchConfirmation} onOpenChange={setShowSwitchConfirmation}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-blue-100 p-3">
                  <CheckCircle2 className="h-8 w-8 text-blue-600" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl font-semibold text-gray-900">
                Switch Confirmation
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-gray-600">
                Your switch order has been executed successfully
              </DialogDescription>
            </DialogHeader>

            {switchConfirmationData && (
              <div className="space-y-4 py-4">
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">From Fund</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {switchConfirmationData.fromFund}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">To Fund</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {switchConfirmationData.toFund}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Units Switched</p>
                          <p className="text-sm font-medium text-gray-900">
                            {switchConfirmationData.units.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Estimated Value</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(switchConfirmationData.estimatedValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={() => {
                  setShowSwitchConfirmation(false);
                  setSwitchConfirmationData(null);
                  setSwitchData({
                    units: "",
                    selectedCompany: "",
                    selectedFund: "",
                    selectedFundSymbol: "",
                    estimatedValue: 0,
                  });
                }}
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Convert Confirmation Dialog */}
        <Dialog open={showConvertConfirmation} onOpenChange={setShowConvertConfirmation}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="rounded-full bg-orange-100 p-3">
                  <CheckCircle2 className="h-8 w-8 text-orange-600" />
                </div>
              </div>
              <DialogTitle className="text-center text-xl font-semibold text-gray-900">
                Conversion Confirmation
              </DialogTitle>
              <DialogDescription className="text-center text-sm text-gray-600">
                Your conversion order has been executed successfully
              </DialogDescription>
            </DialogHeader>

            {convertConfirmationData && (
              <div className="space-y-4 py-4">
                <Card className="border border-gray-200">
                  <CardContent className="pt-4">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">From Fund</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {convertConfirmationData.fromFund}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">To Fund</p>
                        <p className="text-sm font-semibold text-gray-900">
                          {convertConfirmationData.toFund}
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-4 pt-3 border-t border-gray-200">
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Units Converted</p>
                          <p className="text-sm font-medium text-gray-900">
                            {convertConfirmationData.units.toFixed(4)}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 mb-1">Estimated Value</p>
                          <p className="text-sm font-medium text-gray-900">
                            {formatCurrency(convertConfirmationData.estimatedValue)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <DialogFooter>
              <Button
                onClick={() => {
                  setShowConvertConfirmation(false);
                  setConvertConfirmationData(null);
                  setConvertData({
                    units: "",
                    selectedCompany: "",
                    selectedFund: "",
                    selectedFundSymbol: "",
                    estimatedValue: 0,
                  });
                }}
                className="w-full bg-gray-900 hover:bg-gray-800"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

      </div>
    </PageLayout>
  );
}
