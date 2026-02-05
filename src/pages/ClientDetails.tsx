import { useState, useEffect, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip as RechartsTooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, AreaChart, Area, LineChart, Line } from "recharts";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Search,
  User,
  DollarSign,
  BarChart3,
  Calendar,
  MapPin,
  Phone,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  FileText,
  AlertCircle,
  AlertTriangle,
  Plus,
  CheckCircle2,
  Clock,
  Minus,
  List,
  Grid3x3,
  ArrowLeftRight,
  X,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  Bell,
  Folder,
  ArrowUpRight,
  Star,
  ThumbsUp,
  ThumbsDown,
  Info,
  Building2,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Mic,
  Package,
  ArrowRight,
  ArrowLeft,
  Pencil,
} from "lucide-react";
import { CLIENTS } from "./Clients";

// Note type definition
type NoteType = "Client" | "Plan" | "Investment Product" | "Transaction";

interface Note {
  id: string;
  type: NoteType;
  summary: string;
  description: string;
  date: string;
  originId: string; // ID of the originating level (plan ID, transaction ID, etc.)
  originName: string; // Name/description of the originating level
  attachments?: string[];
  createdBy?: string;
}

// Available fund companies
const FUND_COMPANIES = [
  { name: "Fidelity Investments", id: "fidelity", fundsCount: 25 },
  { name: "CIBC Asset Management", id: "cibc", fundsCount: 18 },
  { name: "TD Asset Management", id: "td", fundsCount: 22 },
  { name: "RBC Global Asset Management", id: "rbc", fundsCount: 30 },
  { name: "BMO Asset Management", id: "bmo", fundsCount: 20 },
  { name: "Scotia Asset Management", id: "scotia", fundsCount: 15 },
  { name: "Manulife Investment Management", id: "manulife", fundsCount: 28 },
  { name: "Sun Life Financial", id: "sunlife", fundsCount: 12 },
  { name: "IG Wealth Management", id: "ig", fundsCount: 16 },
  { name: "Mackenzie Investments", id: "mackenzie", fundsCount: 24 },
  { name: "AGF Investments", id: "agf", fundsCount: 20 },
];

// Mock funds for each company
const COMPANY_FUNDS: { [key: string]: Array<{ name: string; symbol: string; category: string }> } = {
  "Fidelity Investments": [
    { name: "FIDELITY NORTHSTAR FUND Series B ISC", symbol: "FID-253", category: "Equity" },
    { name: "FIDELITY MONTHLY INCOME FUND Series B ISC", symbol: "FID-269", category: "Income" },
    { name: "FIDELITY TRUE NORTH FUND Series B ISC", symbol: "FID-225", category: "Equity" },
    { name: "FIDELITY U.S. FOCUSED STOCK FUND Series B ISC", symbol: "FID-234", category: "Equity" },
    { name: "FIDELITY CANADIAN BALANCED FUND Series B ISC", symbol: "FID-180", category: "Balanced" },
    { name: "FIDELITY GLOBAL EQUITY FUND Series B ISC", symbol: "FID-290", category: "Global" },
    { name: "FIDELITY DIVIDEND FUND Series B ISC", symbol: "FID-201", category: "Equity" },
  ],
  "CIBC Asset Management": [
    { name: "CIBC Canadian Equity Fund - Series A", symbol: "CIBC-CAN", category: "Equity" },
    { name: "CIBC Balanced Fund - Series A", symbol: "CIBC-BAL", category: "Balanced" },
    { name: "CIBC Monthly Income Fund - Series A", symbol: "CIBC-INC", category: "Income" },
    { name: "CIBC Global Equity Fund - Series A", symbol: "CIBC-GLO", category: "Global" },
    { name: "CIBC Dividend Growth Fund - Series A", symbol: "CIBC-DIV", category: "Equity" },
    { name: "CIBC Canadian Bond Fund - Series A", symbol: "CIBC-BND", category: "Fixed Income" },
  ],
  "TD Asset Management": [
    { name: "TD Canadian Equity Fund - Series A", symbol: "TD-CAN", category: "Equity" },
    { name: "TD Balanced Growth Fund - Series A", symbol: "TD-BAL", category: "Balanced" },
    { name: "TD Income Fund - Series A", symbol: "TD-INC", category: "Income" },
    { name: "TD Global Equity Fund - Series A", symbol: "TD-GLO", category: "Global" },
  ],
  "RBC Global Asset Management": [
    { name: "RBC Canadian Equity Fund - Series A", symbol: "RBC-CAN", category: "Equity" },
    { name: "RBC Balanced Portfolio - Series A", symbol: "RBC-BAL", category: "Balanced" },
    { name: "RBC Global Equity Fund - Series A", symbol: "RBC-GLO", category: "Global" },
  ],
  "BMO Asset Management": [
    { name: "BMO Canadian Equity Fund - Series A", symbol: "BMO-CAN", category: "Equity" },
    { name: "BMO Balanced Fund - Series A", symbol: "BMO-BAL", category: "Balanced" },
    { name: "BMO Income Fund - Series A", symbol: "BMO-INC", category: "Income" },
  ],
  "Scotia Asset Management": [
    { name: "Scotia Canadian Equity Fund - Series A", symbol: "SCOTIA-CAN", category: "Equity" },
    { name: "Scotia Balanced Fund - Series A", symbol: "SCOTIA-BAL", category: "Balanced" },
  ],
  "Manulife Investment Management": [
    { name: "Manulife Canadian Equity Fund - Series A", symbol: "MAN-CAN", category: "Equity" },
    { name: "Manulife Balanced Fund - Series A", symbol: "MAN-BAL", category: "Balanced" },
  ],
  "Sun Life Financial": [
    { name: "Sun Life Canadian Equity Fund - Series A", symbol: "SUN-CAN", category: "Equity" },
    { name: "Sun Life Balanced Fund - Series A", symbol: "SUN-BAL", category: "Balanced" },
  ],
  "IG Wealth Management": [
    { name: "IG Canadian Equity Fund - Series A", symbol: "IG-CAN", category: "Equity" },
    { name: "IG Balanced Fund - Series A", symbol: "IG-BAL", category: "Balanced" },
  ],
  "Mackenzie Investments": [
    { name: "Mackenzie Canadian Equity Fund - Series A", symbol: "MACK-CAN", category: "Equity" },
    { name: "Mackenzie Balanced Fund - Series A", symbol: "MACK-BAL", category: "Balanced" },
  ],
  "AGF Investments": [
    { name: "AGF CANADIAN DIVIDEND INCOME FUND SERIES F", symbol: "AGF-185", category: "Equity" },
    { name: "AGF GLOBAL BOND FUND SERIES F", symbol: "AGF-5555", category: "Fixed Income" },
    { name: "AGF Canadian Equity Fund - Series F", symbol: "AGF-CAN", category: "Equity" },
    { name: "AGF Balanced Fund - Series F", symbol: "AGF-BAL", category: "Balanced" },
    { name: "AGF Income Fund - Series F", symbol: "AGF-INC", category: "Income" },
    { name: "AGF Global Equity Fund - Series F", symbol: "AGF-GLO", category: "Global" },
  ],
};

// Helper function to get the company name from a product
const getProductCompany = (product: any): string => {
  if (!product) return "Fidelity Investments";
  
  const supplier = product.supplier?.toUpperCase() || "";
  const productName = product.product?.toUpperCase() || "";
  
  // Check supplier code
  if (supplier.includes("FID") || productName.includes("FIDELITY")) {
    return "Fidelity Investments";
  }
  if (supplier.includes("CIBC") || productName.includes("CIBC")) {
    return "CIBC Asset Management";
  }
  if (supplier.includes("TD") || productName.includes("TD ")) {
    return "TD Asset Management";
  }
  if (supplier.includes("RBC") || productName.includes("RBC")) {
    return "RBC Global Asset Management";
  }
  if (supplier.includes("BMO") || productName.includes("BMO")) {
    return "BMO Asset Management";
  }
  if (supplier.includes("SCOTIA") || productName.includes("SCOTIA")) {
    return "Scotia Asset Management";
  }
  if (supplier.includes("MANULIFE") || productName.includes("MANULIFE")) {
    return "Manulife Investment Management";
  }
  if (supplier.includes("SUNLIFE") || supplier.includes("SUN LIFE") || productName.includes("SUN LIFE")) {
    return "Sun Life Financial";
  }
  if (supplier.includes("IG") || productName.includes("IG ")) {
    return "IG Wealth Management";
  }
  if (supplier.includes("MACKENZIE") || productName.includes("MACKENZIE")) {
    return "Mackenzie Investments";
  }
  if (supplier.includes("AGF") || productName.includes("AGF")) {
    return "AGF Investments";
  }
  
  // Default to Fidelity if unknown
  return "Fidelity Investments";
};

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("investments");
  const [clientViewTab, setClientViewTab] = useState("summary");
  const [isPageLocked, setIsPageLocked] = useState(false);
  const [lockedTab, setLockedTab] = useState<string>("summary");
  const [showHiddenTabs, setShowHiddenTabs] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("Active");
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");
  const [expandedPlans, setExpandedPlans] = useState<Set<string>>(new Set(["plan1", "plan2"]));
  const [companySearchTerm, setCompanySearchTerm] = useState("");
  const [fundSearchTerm, setFundSearchTerm] = useState("");
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [planDetailTab, setPlanDetailTab] = useState("summary");
  const [planDetailsSubTab, setPlanDetailsSubTab] = useState("details");
  const [allocationsView, setAllocationsView] = useState<"chart" | "table">("chart");
  const [chartsSubTab, setChartsSubTab] = useState<"smart-charts" | "allocations">("smart-charts");
  const [attachmentsSubTab, setAttachmentsSubTab] = useState<"rep-attachments" | "dealer-attachments" | "statement-history" | "trade-confirmations">("rep-attachments");
  const [includeInactivePlans, setIncludeInactivePlans] = useState(false);
  const [includeInactiveAccounts, setIncludeInactiveAccounts] = useState(false);
  const [accountViewType, setAccountViewType] = useState<"fund-accounts" | "gics">("fund-accounts");
  const [selectedPlanForDetails, setSelectedPlanForDetails] = useState<string | null>(null);
  const [selectedFundAccount, setSelectedFundAccount] = useState<string | null>(null);
  const [fundAccountAllocationsView, setFundAccountAllocationsView] = useState<"chart" | "table">("chart");
  const [fundAccountDetailTab, setFundAccountDetailTab] = useState("summary");
  const [transactionsDisplayOption, setTransactionsDisplayOption] = useState("All");
  const [transactionsSortBy, setTransactionsSortBy] = useState("Sort by Trade Date");
  const [selectedAccountFilter, setSelectedAccountFilter] = useState("Selected Account");
  const [selectedTransaction, setSelectedTransaction] = useState<string | null>(null);
  const [transactionDetailTab, setTransactionDetailTab] = useState("summary");
  const [isDepositDialogOpen, setIsDepositDialogOpen] = useState(false);
  const [depositAmount, setDepositAmount] = useState("0.00");
  const [isBuyUnitsDialogOpen, setIsBuyUnitsDialogOpen] = useState(false);
  const [isOrderConfirmedDialogOpen, setIsOrderConfirmedDialogOpen] = useState(false);
  const [isSellUnitsDialogOpen, setIsSellUnitsDialogOpen] = useState(false);
  const [isSellOrderConfirmedDialogOpen, setIsSellOrderConfirmedDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [dialogContext, setDialogContext] = useState<"plan" | "fund">("fund");
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedPlanBalance, setSelectedPlanBalance] = useState<number>(0);
  const [investmentAmount, setInvestmentAmount] = useState("200");
  const [numberOfUnits, setNumberOfUnits] = useState("");
  const [sellUnits, setSellUnits] = useState("200");
  const [sellDollarAmount, setSellDollarAmount] = useState("");
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [sellOrderDetails, setSellOrderDetails] = useState<any>(null);
  const [isSwitchDialogOpen, setIsSwitchDialogOpen] = useState(false);
  const [isConvertDialogOpen, setIsConvertDialogOpen] = useState(false);
  const [isSwitchOrderConfirmedDialogOpen, setIsSwitchOrderConfirmedDialogOpen] = useState(false);
  const [isConvertOrderConfirmedDialogOpen, setIsConvertOrderConfirmedDialogOpen] = useState(false);
  const [selectedFundCompany, setSelectedFundCompany] = useState("");
  const [selectedFundToSwitch, setSelectedFundToSwitch] = useState("");
  const [unitsToSwitch, setUnitsToSwitch] = useState("");
  const [planLevelSelectedFund, setPlanLevelSelectedFund] = useState<any>(null);
  const [planLevelFundCompany, setPlanLevelFundCompany] = useState("");
  const [planLevelCompanySearch, setPlanLevelCompanySearch] = useState("");
  const [planLevelFundSearch, setPlanLevelFundSearch] = useState("");
  const [planBuyStep, setPlanBuyStep] = useState<"select" | "details">("select");
  const [planSwitchFromFund, setPlanSwitchFromFund] = useState<any>(null);
  const [planSwitchToFund, setPlanSwitchToFund] = useState<any>(null);
  const [planSwitchStep, setPlanSwitchStep] = useState<"from" | "to" | "details">("from");
  const [planSwitchUnits, setPlanSwitchUnits] = useState("");
  const [switchOrderDetails, setSwitchOrderDetails] = useState<any>(null);
  const [convertOrderDetails, setConvertOrderDetails] = useState<any>(null);
  const [isSelectPlanTypeOpen, setIsSelectPlanTypeOpen] = useState(false);
  const [selectedPlanType, setSelectedPlanType] = useState("");
  const [planSetupStep, setPlanSetupStep] = useState(0);
  const [ownerName, setOwnerName] = useState("John Smith");
  const [beneficiaryName, setBeneficiaryName] = useState("");
  const [intermediaryCode, setIntermediaryCode] = useState("");
  const [intermediaryAccountCode, setIntermediaryAccountCode] = useState("");
  const [planNotes, setPlanNotes] = useState("");
  const [planObjectives, setPlanObjectives] = useState("");
  const [riskTolerance, setRiskTolerance] = useState("");
  const [timeHorizon, setTimeHorizon] = useState("");
  const [createdPlanDetails, setCreatedPlanDetails] = useState<any>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [addProductFundCompany, setAddProductFundCompany] = useState("");
  const [addProductFundSearch, setAddProductFundSearch] = useState("");
  const [addProductSelectedFund, setAddProductSelectedFund] = useState("");
  const [addProductAmount, setAddProductAmount] = useState("");
  const [isInvestmentOrderConfirmedOpen, setIsInvestmentOrderConfirmedOpen] = useState(false);
  const [investmentOrderDetails, setInvestmentOrderDetails] = useState<any>(null);
  const [isStandaloneAddProductOpen, setIsStandaloneAddProductOpen] = useState(false);
  const [standaloneFundCompany, setStandaloneFundCompany] = useState("");
  const [standaloneFundSearch, setStandaloneFundSearch] = useState("");
  const [standaloneSelectedFund, setStandaloneSelectedFund] = useState("");
  const [standaloneAmount, setStandaloneAmount] = useState("");
  const [portfolioSubTab, setPortfolioSubTab] = useState<"investments" | "cash" | "recent-trading" | "product-documents">("investments");
  const [collapsedAccounts, setCollapsedAccounts] = useState<Set<string>>(new Set());
  const [showAdditionalNotesOptions, setShowAdditionalNotesOptions] = useState(false);
  const [selectedNoteOptions, setSelectedNoteOptions] = useState<Set<string>>(new Set(["Client Notes"]));
  const [craftedNote, setCraftedNote] = useState("");
  const [isAddClientNoteDialogOpen, setIsAddClientNoteDialogOpen] = useState(false);
  const [noteType, setNoteType] = useState<NoteType>("Client");
  const [noteSummary, setNoteSummary] = useState("");
  const [noteDescription, setNoteDescription] = useState("");
  const [noteOrigin, setNoteOrigin] = useState<string>("");
  const [isEditAddressDialogOpen, setIsEditAddressDialogOpen] = useState(false);
  const [editedResidentialAddress, setEditedResidentialAddress] = useState({ line1: "", line2: "", line3: "" });
  const [editedMailingAddress, setEditedMailingAddress] = useState({ line1: "", line2: "", line3: "" });
  const [editedContact, setEditedContact] = useState({ home: "", cell: "", email: "" });
  const [notesSearchTerm, setNotesSearchTerm] = useState("");
  const [notesFilterType, setNotesFilterType] = useState<string>("all");
  const [notesDateSortOrder, setNotesDateSortOrder] = useState<"asc" | "desc">("desc");
  const [selectedNoteForView, setSelectedNoteForView] = useState<Note | null>(null);
  const [isNoteDetailDialogOpen, setIsNoteDetailDialogOpen] = useState(false);

  // Get client-specific notes
  const getClientNotes = (clientId: string | undefined): Note[] => {
    if (!clientId) return [];

    const notesMap: Record<string, Note[]> = {
      "CL001": [
        {
          id: "note1-cl001",
          type: "Client",
          summary: "Initial client meeting with John Smith",
          description: "Discussed investment goals and risk tolerance. Client prefers conservative approach with focus on long-term growth.",
          date: "2024-01-15T10:30:00",
          originId: clientId,
          originName: "Client Profile",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note2-cl001",
          type: "Plan",
          summary: "RRIF account review",
          description: "Reviewed RRIF account performance. Client satisfied with current allocation. Discussed withdrawal strategy for upcoming year.",
          date: "2024-02-20T14:15:00",
          originId: "0137617685",
          originName: "0137617685",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note3-cl001",
          type: "Transaction",
          summary: "Monthly contribution",
          description: "Client made monthly contribution of $500 to RRIF account as per scheduled plan.",
          date: "2024-03-10T09:00:00",
          originId: "trans-cl001-001",
          originName: "Deposit - $500",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note4-cl001",
          type: "Investment Product",
          summary: "Mackenzie fund performance",
          description: "Reviewed Mackenzie Bluewater Canadian Growth Balanced Fund performance. Client satisfied with returns and risk profile.",
          date: "2024-03-25T11:45:00",
          originId: "MFC-724",
          originName: "MACKENZIE BLUEWATER CANADIAN GROWTH BALANCED FUND",
          createdBy: "Marsh, Antoine",
        },
      ],
      "CL002": [
        {
          id: "note1-cl002",
          type: "Client",
          summary: "Initial consultation with Sarah Johnson",
          description: "Met with client to discuss investment objectives. Client is interested in balanced portfolio with moderate risk tolerance.",
          date: "2024-01-20T11:00:00",
          originId: clientId,
          originName: "Client Profile",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note2-cl002",
          type: "Plan",
          summary: "TFSA account goal",
          description: "Client's goal is to purchase a car once this account reaches $60K. Currently at $45K, on track to reach goal in 18 months.",
          date: "2024-02-20T14:15:00",
          originId: "TFSA-7892",
          originName: "TFSA-7892",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note3-cl002",
          type: "Transaction",
          summary: "Birthday gift from parents",
          description: "Client received $5,000 as a birthday gift from parents. Deposited into TFSA account as per client's request.",
          date: "2024-03-10T09:00:00",
          originId: "trans-cl002-001",
          originName: "Deposit - $5,000",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note4-cl002",
          type: "Investment Product",
          summary: "TD fund performance discussion",
          description: "Reviewed TD Canadian Equity Fund performance with client. Client satisfied with returns and wants to maintain position.",
          date: "2024-03-25T11:45:00",
          originId: "TD-1234",
          originName: "TD CANADIAN EQUITY FUND",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note5-cl002",
          type: "Plan",
          summary: "RRSP contribution limit",
          description: "Discussed RRSP contribution limits and tax implications for the current year. Client plans to maximize contribution.",
          date: "2024-04-05T13:20:00",
          originId: "RRSP-4521",
          originName: "RRSP-4521",
          createdBy: "Marsh, Antoine",
        },
      ],
      "CL005": [
        {
          id: "note1-cl005",
          type: "Client",
          summary: "Meeting with Robert Wilson",
          description: "Initial meeting to discuss RESP account for children's education. Client wants aggressive growth strategy.",
          date: "2024-01-25T09:30:00",
          originId: clientId,
          originName: "Client Profile",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note2-cl005",
          type: "Plan",
          summary: "RESP account strategy",
          description: "Discussed RESP contribution strategy. Client wants to maximize government grants. Plan to contribute $2,500 annually per child.",
          date: "2024-02-15T10:00:00",
          originId: "RESP-3456",
          originName: "RESP-3456",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note3-cl005",
          type: "Investment Product",
          summary: "CIBC Dividend Fund review",
          description: "Client inquired about CIBC Dividend Fund. Reviewed fund performance and suitability for RESP account.",
          date: "2024-03-18T14:30:00",
          originId: "CIBC-2468",
          originName: "CIBC DIVIDEND FUND",
          createdBy: "Marsh, Antoine",
        },
      ],
      "CL006": [
        {
          id: "note1-cl006",
          type: "Client",
          summary: "Consultation with Elton Andrews",
          description: "Client is new to investing. Discussed basic investment concepts and risk tolerance. Recommended starting with conservative approach.",
          date: "2024-02-01T10:00:00",
          originId: clientId,
          originName: "Client Profile",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note2-cl006",
          type: "Plan",
          summary: "Non-registered account setup",
          description: "Set up non-registered account for client. Discussed tax implications and investment strategy.",
          date: "2024-02-10T11:15:00",
          originId: "NR-7890",
          originName: "NR-7890",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note3-cl006",
          type: "Transaction",
          summary: "Initial deposit",
          description: "Client made initial deposit of $10,000 to non-registered account.",
          date: "2024-02-12T09:00:00",
          originId: "trans-cl006-001",
          originName: "Deposit - $10,000",
          createdBy: "Marsh, Antoine",
        },
      ],
      "CL007": [
        {
          id: "note1-cl007",
          type: "Client",
          summary: "Meeting with Francoise Andrews",
          description: "Client is experienced investor. Discussed portfolio rebalancing and tax-efficient strategies.",
          date: "2024-01-18T13:00:00",
          originId: clientId,
          originName: "Client Profile",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note2-cl007",
          type: "Plan",
          summary: "LIF account withdrawal",
          description: "Discussed LIF minimum withdrawal requirements. Client wants to take minimum to preserve capital.",
          date: "2024-02-25T10:30:00",
          originId: "LIF-2345",
          originName: "LIF-2345",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note3-cl007",
          type: "Investment Product",
          summary: "Manulife fund performance",
          description: "Reviewed Manulife Canadian Equity Fund. Client satisfied with performance and wants to maintain position.",
          date: "2024-03-20T11:00:00",
          originId: "MANULIFE-1111",
          originName: "MANULIFE CANADIAN EQUITY FUND",
          createdBy: "Marsh, Antoine",
        },
      ],
      "CL008": [
        {
          id: "note1-cl008",
          type: "Client",
          summary: "Initial meeting with Amy Armstrong",
          description: "Client is interested in building wealth through diversified portfolio. Discussed long-term investment strategy.",
          date: "2024-01-22T14:00:00",
          originId: clientId,
          originName: "Client Profile",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note2-cl008",
          type: "Plan",
          summary: "TFSA contribution strategy",
          description: "Client wants to maximize TFSA contributions annually. Discussed contribution room and investment options.",
          date: "2024-02-28T10:15:00",
          originId: "TFSA-4567",
          originName: "TFSA-4567",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note3-cl008",
          type: "Investment Product",
          summary: "IG Wealth fund discussion",
          description: "Client inquired about IG Wealth Global Equity Fund. Reviewed fund details and suitability.",
          date: "2024-03-15T13:30:00",
          originId: "IG-3333",
          originName: "IG WEALTH GLOBAL EQUITY FUND",
          createdBy: "Marsh, Antoine",
        },
      ],
      "CL009": [
        {
          id: "note1-cl009",
          type: "Client",
          summary: "Consultation with David Thompson",
          description: "Client is tech professional with high risk tolerance. Interested in technology-focused investments.",
          date: "2024-01-30T11:00:00",
          originId: clientId,
          originName: "Client Profile",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note2-cl009",
          type: "Plan",
          summary: "DCPP account review",
          description: "Reviewed DCPP account performance. Client wants to increase contribution rate.",
          date: "2024-03-05T09:45:00",
          originId: "DCPP-6789",
          originName: "DCPP-6789",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note3-cl009",
          type: "Investment Product",
          summary: "TD Technology Fund performance",
          description: "Client satisfied with TD Global Technology Fund performance. Discussed adding more technology exposure.",
          date: "2024-04-10T14:20:00",
          originId: "TD-6666",
          originName: "TD GLOBAL TECHNOLOGY FUND",
          createdBy: "Marsh, Antoine",
        },
      ],
      "CL011": [
        {
          id: "note1-cl011",
          type: "Client",
          summary: "Meeting with James Brown",
          description: "Client is retired and focused on income generation. Discussed conservative income-focused strategy.",
          date: "2024-01-12T10:00:00",
          originId: clientId,
          originName: "Client Profile",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note2-cl011",
          type: "Plan",
          summary: "RRIF withdrawal strategy",
          description: "Discussed RRIF minimum withdrawal requirements and tax implications. Client wants to minimize tax impact.",
          date: "2024-02-08T11:30:00",
          originId: "RRIF-9012",
          originName: "RRIF-9012",
          createdBy: "Marsh, Antoine",
        },
        {
          id: "note3-cl011",
          type: "Transaction",
          summary: "Quarterly withdrawal",
          description: "Client made quarterly RRIF withdrawal of $3,000 as per minimum requirement.",
          date: "2024-03-01T09:00:00",
          originId: "trans-cl011-001",
          originName: "Withdrawal - $3,000",
          createdBy: "Marsh, Antoine",
        },
      ],
    };

    // Default notes for clients not in the map
    return notesMap[clientId] || [
      {
        id: `note-default-${clientId}`,
        type: "Client",
        summary: "Client profile created",
        description: "Initial client profile setup and onboarding completed.",
        date: new Date().toISOString(),
        originId: clientId || "",
        originName: "Client Profile",
        createdBy: "Marsh, Antoine",
      },
    ];
  };

  const [allNotes, setAllNotes] = useState<Note[]>(() => getClientNotes(id));

  // Update notes when client changes
  useEffect(() => {
    setAllNotes(getClientNotes(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = allNotes;

    // Filter by type
    if (notesFilterType !== "all") {
      filtered = filtered.filter((note) => note.type === notesFilterType);
    }

    // Search filter
    if (notesSearchTerm) {
      const term = notesSearchTerm.toLowerCase();
      filtered = filtered.filter(
        (note) =>
          note.summary.toLowerCase().includes(term) ||
          note.description.toLowerCase().includes(term) ||
          note.originName.toLowerCase().includes(term)
      );
    }

    // Sort by date based on sort order
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      if (notesDateSortOrder === "desc") {
        return dateB - dateA; // Newest first
      } else {
        return dateA - dateB; // Oldest first
      }
    });

    return sorted;
  }, [allNotes, notesSearchTerm, notesFilterType, notesDateSortOrder]);

  // Get icon for note type
  const getNoteTypeIcon = (type: NoteType) => {
    switch (type) {
      case "Client":
        return <User className="h-4 w-4" />;
      case "Plan":
        return <Folder className="h-4 w-4" />;
      case "Investment Product":
        return <Package className="h-4 w-4" />;
      case "Transaction":
        return <ArrowLeftRight className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  // Show note details popup
  const navigateToOrigin = (note: Note) => {
    // Show note details popup only - stay on the notes page
    setSelectedNoteForView(note);
    setIsNoteDetailDialogOpen(true);
  };

  // Note options based on the image
  const noteOptions = [
    "Client Notes",
    "Fund Account Notes",
    "Plan Reviews",
    "GIC Transaction Notes",
    "ETF Transaction Reviews",
    "Include Account Opening Notes",
    "Emails Sent to Client",
    "GIC Notes",
    "Fund Transaction Notes",
    "GIC Transaction Reviews",
    "Include Inactive Plans and Accounts",
    "Plan Notes",
    "ETF Account Notes",
    "Fund Transaction Reviews",
    "ETF Transaction Notes",
    "Include KYC Update Notes",
  ];

  // Handle checkbox toggle
  const toggleNoteOption = (option: string) => {
    const newSelected = new Set(selectedNoteOptions);
    if (newSelected.has(option)) {
      newSelected.delete(option);
    } else {
      newSelected.add(option);
    }
    setSelectedNoteOptions(newSelected);
  };

  // Select all options
  const selectAllOptions = () => {
    setSelectedNoteOptions(new Set(noteOptions));
  };

  // Deselect all options
  const deselectAllOptions = () => {
    setSelectedNoteOptions(new Set());
  };

  // Craft note based on selected options
  const craftNoteFromOptions = () => {
    if (selectedNoteOptions.size === 0) {
      setCraftedNote("");
      return;
    }

    const selectedArray = Array.from(selectedNoteOptions);
    const noteParts: string[] = [];

    // Group related options
    if (selectedArray.includes("Client Notes")) {
      noteParts.push("Client Notes: General client information and interactions.");
    }
    if (selectedArray.includes("Plan Notes")) {
      noteParts.push("Plan Notes: Details regarding client plans and account structures.");
    }
    if (selectedArray.includes("Plan Reviews")) {
      noteParts.push("Plan Reviews: Comprehensive review of plan performance and status.");
    }
    if (selectedArray.includes("Fund Account Notes")) {
      noteParts.push("Fund Account Notes: Information specific to fund accounts.");
    }
    if (selectedArray.includes("ETF Account Notes")) {
      noteParts.push("ETF Account Notes: Details related to ETF account holdings.");
    }
    if (selectedArray.includes("GIC Notes")) {
      noteParts.push("GIC Notes: Information about GIC investments and terms.");
    }
    if (selectedArray.includes("Fund Transaction Notes")) {
      noteParts.push("Fund Transaction Notes: Records of fund-related transactions.");
    }
    if (selectedArray.includes("Fund Transaction Reviews")) {
      noteParts.push("Fund Transaction Reviews: Analysis of fund transaction history.");
    }
    if (selectedArray.includes("GIC Transaction Notes")) {
      noteParts.push("GIC Transaction Notes: Details of GIC transaction activities.");
    }
    if (selectedArray.includes("GIC Transaction Reviews")) {
      noteParts.push("GIC Transaction Reviews: Review of GIC transaction patterns.");
    }
    if (selectedArray.includes("ETF Transaction Notes")) {
      noteParts.push("ETF Transaction Notes: Information about ETF transactions.");
    }
    if (selectedArray.includes("ETF Transaction Reviews")) {
      noteParts.push("ETF Transaction Reviews: Analysis of ETF transaction history.");
    }
    if (selectedArray.includes("Emails Sent to Client")) {
      noteParts.push("Emails Sent to Client: Communication records and email correspondence.");
    }
    if (selectedArray.includes("Include Account Opening Notes")) {
      noteParts.push("Account Opening Notes: Documentation from account establishment.");
    }
    if (selectedArray.includes("Include Inactive Plans and Accounts")) {
      noteParts.push("Inactive Plans and Accounts: Information regarding closed or inactive accounts.");
    }
    if (selectedArray.includes("Include KYC Update Notes")) {
      noteParts.push("KYC Update Notes: Know Your Client documentation and updates.");
    }

    const crafted = noteParts.join("\n\n");
    setCraftedNote(crafted);
  };

  // Update crafted note when selections change
  useEffect(() => {
    if (showAdditionalNotesOptions && selectedNoteOptions.size > 0) {
      craftNoteFromOptions();
    } else if (selectedNoteOptions.size === 0) {
      setCraftedNote("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedNoteOptions, showAdditionalNotesOptions]);
  
  // Client-specific data mapping
  const getClientData = (clientId: string | undefined) => {
    if (!clientId) {
      // Default data for CL001
      return {
        plans: [
          { id: "340009", type: "OPEN", accountNumber: "340009", name: "Client Name", category: "Joint", marketValue: "$0.00" },
          { id: "0137617685", type: "RRIF", accountNumber: "0137617685", name: "Client Name", category: "Individual", marketValue: "$23,510.16" },
        ],
        fundAccounts: [
          { id: "AGF-185", productCode: "AGF-185", accountNumber: "", fullName: "AGF-185 AGF CANADIAN DIVIDEND INCOME FUND SERIES F", productName: "AGF CANADIAN DIVIDEND INCOME FUND SERIES F", supplier: "AGF", risk: "M", investmentObjective: "100% Gr", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$0.00", priceDate: "", category: "", distributionOption: "Reinvest", startDate: "", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "0.0000", certificate: "No Certificate", active: true, lastSequence: "0", effectiveDate: "", excludeFromDuplicate: false, marketValue: "$0.00 CAD" },
          { id: "MFC-724", productCode: "MFC-724", accountNumber: "4132056511", fullName: "MFC-724 4132056511 (LM) MACKENZIE BLUEWATER CANADIAN GROWTH BALANCED FUND A FE", productName: "MACKENZIE BLUEWATER CANADIAN GROWTH BALANCED FUND A FE", supplier: "MFC", risk: "LM", investmentObjective: "25% In, 75% Gr", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$12.5499", priceDate: "04/29/2025", category: "", distributionOption: "Reinvest", startDate: "", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "0.0000", certificate: "No Certificate", active: true, lastSequence: "0", effectiveDate: "", excludeFromDuplicate: false, marketValue: "$13,792.63 CAD" },
          { id: "MFC-2238", productCode: "MFC-2238", accountNumber: "1134475341", fullName: "MFC-2238 1134475341 (LM) MACKENZIE STRATEGIC INCOME FUND A FE", productName: "MACKENZIE STRATEGIC INCOME FUND A FE", supplier: "MFC", risk: "LM", investmentObjective: "50% In, 50% Gr", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$12.5499", priceDate: "04/29/2025", category: "", distributionOption: "Reinvest", startDate: "", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "0.0000", certificate: "No Certificate", active: true, lastSequence: "0", effectiveDate: "", excludeFromDuplicate: false, marketValue: "$9,718.53 CAD" },
        ],
        summaryData: {
          plan1: { id: "340009", type: "OPEN", investments: ["AGF-185"] },
          plan2: { id: "0137617685", type: "RRIF", investments: ["MFC-724", "MFC-2238"] },
        },
      };
    }

    const clientDataMap: Record<string, any> = {
      "CL001": {
        plans: [
          { id: "340009", type: "OPEN", accountNumber: "340009", name: "John Smith", category: "Joint", marketValue: "$0.00" },
          { id: "0137617685", type: "RRIF", accountNumber: "0137617685", name: "John Smith", category: "Individual", marketValue: "$23,510.16" },
        ],
        fundAccounts: [
          { id: "AGF-185", productCode: "AGF-185", accountNumber: "", fullName: "AGF-185 AGF CANADIAN DIVIDEND INCOME FUND SERIES F", productName: "AGF CANADIAN DIVIDEND INCOME FUND SERIES F", supplier: "AGF", risk: "M", investmentObjective: "100% Gr", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$0.00", priceDate: "", category: "", distributionOption: "Reinvest", startDate: "", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "0.0000", certificate: "No Certificate", active: true, lastSequence: "0", effectiveDate: "", excludeFromDuplicate: false, marketValue: "$0.00 CAD" },
          { id: "MFC-724", productCode: "MFC-724", accountNumber: "4132056511", fullName: "MFC-724 4132056511 (LM) MACKENZIE BLUEWATER CANADIAN GROWTH BALANCED FUND A FE", productName: "MACKENZIE BLUEWATER CANADIAN GROWTH BALANCED FUND A FE", supplier: "MFC", risk: "LM", investmentObjective: "25% In, 75% Gr", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$12.5499", priceDate: "04/29/2025", category: "", distributionOption: "Reinvest", startDate: "", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "0.0000", certificate: "No Certificate", active: true, lastSequence: "0", effectiveDate: "", excludeFromDuplicate: false, marketValue: "$13,792.63 CAD" },
          { id: "MFC-2238", productCode: "MFC-2238", accountNumber: "1134475341", fullName: "MFC-2238 1134475341 (LM) MACKENZIE STRATEGIC INCOME FUND A FE", productName: "MACKENZIE STRATEGIC INCOME FUND A FE", supplier: "MFC", risk: "LM", investmentObjective: "50% In, 50% Gr", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$12.5499", priceDate: "04/29/2025", category: "", distributionOption: "Reinvest", startDate: "", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "0.0000", certificate: "No Certificate", active: true, lastSequence: "0", effectiveDate: "", excludeFromDuplicate: false, marketValue: "$9,718.53 CAD" },
        ],
        summaryData: {
          plan1: { id: "340009", type: "OPEN", investments: ["AGF-185"] },
          plan2: { id: "0137617685", type: "RRIF", investments: ["MFC-724", "MFC-2238"] },
        },
      },
      "CL002": {
        plans: [
          { id: "RRSP-4521", type: "RRSP", accountNumber: "RRSP-4521", name: "Sarah Johnson", category: "Individual", marketValue: "$125,450.00" },
          { id: "TFSA-7892", type: "TFSA", accountNumber: "TFSA-7892", name: "Sarah Johnson", category: "Individual", marketValue: "$45,230.00" },
        ],
        fundAccounts: [
          { id: "TD-1234", productCode: "TD-1234", accountNumber: "5521887488", fullName: "TD-1234 5521887488 (M) TD CANADIAN EQUITY FUND SERIES A", productName: "TD CANADIAN EQUITY FUND SERIES A", supplier: "TD", risk: "M", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$28.5432", priceDate: "04/29/2025", category: "Canadian Equity", distributionOption: "Reinvest", startDate: "01/15/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "3.2450", certificate: "No Certificate", active: true, lastSequence: "2456", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$92,650.00 CAD" },
          { id: "RBC-5678", productCode: "RBC-5678", accountNumber: "6234567890", fullName: "RBC-5678 6234567890 (H) RBC GLOBAL BOND FUND SERIES A", productName: "RBC GLOBAL BOND FUND SERIES A", supplier: "RBC", risk: "H", investmentObjective: "100% In", rateType: "FEL", dscRate: "0.0%", felMaxRate: "1.5%", currentPrice: "$15.2345", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "03/20/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.9876", certificate: "No Certificate", active: true, lastSequence: "1892", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$45,500.00 CAD" },
          { id: "BMO-9012", productCode: "BMO-9012", accountNumber: "7123456789", fullName: "BMO-9012 7123456789 (LM) BMO BALANCED FUND SERIES A", productName: "BMO BALANCED FUND SERIES A", supplier: "BMO", risk: "LM", investmentObjective: "50% In, 50% Gr", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$22.6789", priceDate: "04/29/2025", category: "Balanced", distributionOption: "Reinvest", startDate: "06/10/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "1.5432", certificate: "No Certificate", active: true, lastSequence: "987", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$32,530.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRSP-4521", type: "RRSP", investments: ["TD-1234", "RBC-5678"] },
          plan2: { id: "TFSA-7892", type: "TFSA", investments: ["BMO-9012"] },
        },
      },
      "CL005": {
        plans: [
          { id: "RESP-3456", type: "RESP", accountNumber: "RESP-3456", name: "Robert Wilson", category: "Family Plan", marketValue: "$67,890.00" },
        ],
        fundAccounts: [
          { id: "CIBC-2468", productCode: "CIBC-2468", accountNumber: "4455667788", fullName: "CIBC-2468 4455667788 (M) CIBC DIVIDEND FUND SERIES A", productName: "CIBC DIVIDEND FUND SERIES A", supplier: "CIBC", risk: "M", investmentObjective: "75% In, 25% Gr", rateType: "DSC", dscRate: "5.5%", felMaxRate: "0.0%", currentPrice: "$19.8765", priceDate: "04/29/2025", category: "Canadian Dividend", distributionOption: "Reinvest", startDate: "09/05/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "3.4123", certificate: "No Certificate", active: true, lastSequence: "1567", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$67,890.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RESP-3456", type: "RESP", investments: ["CIBC-2468"] },
        },
      },
      "CL006": {
        plans: [
          { id: "NR-7890", type: "Non-Registered", accountNumber: "NR-7890", name: "Elton Andrews", category: "Individual", marketValue: "$45,120.00" },
          { id: "TFSA-1234", type: "TFSA", accountNumber: "TFSA-1234", name: "Elton Andrews", category: "Individual", marketValue: "$18,450.00" },
        ],
        fundAccounts: [
          { id: "FID-1357", productCode: "FID-1357", accountNumber: "3344556677", fullName: "FID-1357 3344556677 (H) FIDELITY NORTHSTAR FUND SERIES B", productName: "FIDELITY NORTHSTAR FUND SERIES B", supplier: "FID", risk: "H", investmentObjective: "100% Gr", rateType: "FEL", dscRate: "0.0%", felMaxRate: "2.0%", currentPrice: "$24.5678", priceDate: "04/29/2025", category: "Global Equity", distributionOption: "Reinvest", startDate: "11/12/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "1.8345", certificate: "No Certificate", active: true, lastSequence: "2234", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$45,120.00 CAD" },
          { id: "SCOTIA-9876", productCode: "SCOTIA-9876", accountNumber: "2233445566", fullName: "SCOTIA-9876 2233445566 (LM) SCOTIA CONSERVATIVE INCOME FUND SERIES A", productName: "SCOTIA CONSERVATIVE INCOME FUND SERIES A", supplier: "SCOTIA", risk: "LM", investmentObjective: "100% In", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$11.2345", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "02/28/2024", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "1.6423", certificate: "No Certificate", active: true, lastSequence: "1123", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$18,450.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "NR-7890", type: "Non-Registered", investments: ["FID-1357"] },
          plan2: { id: "TFSA-1234", type: "TFSA", investments: ["SCOTIA-9876"] },
        },
      },
      "CL007": {
        plans: [
          { id: "RRSP-5678", type: "RRSP", accountNumber: "RRSP-5678", name: "Francoise Andrews", category: "Individual", marketValue: "$89,340.00" },
          { id: "LIF-2345", type: "LIF", accountNumber: "LIF-2345", name: "Francoise Andrews", category: "Individual", marketValue: "$156,780.00" },
        ],
        fundAccounts: [
          { id: "MANULIFE-1111", productCode: "MANULIFE-1111", accountNumber: "8899001122", fullName: "MANULIFE-1111 8899001122 (M) MANULIFE CANADIAN EQUITY FUND SERIES A", productName: "MANULIFE CANADIAN EQUITY FUND SERIES A", supplier: "MANULIFE", risk: "M", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$18.7654", priceDate: "04/29/2025", category: "Canadian Equity", distributionOption: "Reinvest", startDate: "04/10/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "4.7621", certificate: "No Certificate", active: true, lastSequence: "3456", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$89,340.00 CAD" },
          { id: "SUNLIFE-2222", productCode: "SUNLIFE-2222", accountNumber: "7788990011", fullName: "SUNLIFE-2222 7788990011 (LM) SUN LIFE BALANCED INCOME FUND SERIES A", productName: "SUN LIFE BALANCED INCOME FUND SERIES A", supplier: "SUNLIFE", risk: "LM", investmentObjective: "60% In, 40% Gr", rateType: "FEL", dscRate: "0.0%", felMaxRate: "1.2%", currentPrice: "$16.4321", priceDate: "04/29/2025", category: "Balanced", distributionOption: "Reinvest", startDate: "07/22/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "9.5432", certificate: "No Certificate", active: true, lastSequence: "4567", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$156,780.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRSP-5678", type: "RRSP", investments: ["MANULIFE-1111"] },
          plan2: { id: "LIF-2345", type: "LIF", investments: ["SUNLIFE-2222"] },
        },
      },
      "CL008": {
        plans: [
          { id: "TFSA-4567", type: "TFSA", accountNumber: "TFSA-4567", name: "Amy Armstrong", category: "Individual", marketValue: "$52,890.00" },
          { id: "RRSP-8901", type: "RRSP", accountNumber: "RRSP-8901", name: "Amy Armstrong", category: "Individual", marketValue: "$78,230.00" },
          { id: "NR-3456", type: "Non-Registered", accountNumber: "NR-3456", name: "Amy Armstrong", category: "Individual", marketValue: "$34,560.00" },
        ],
        fundAccounts: [
          { id: "IG-3333", productCode: "IG-3333", accountNumber: "6677889900", fullName: "IG-3333 6677889900 (H) IG WEALTH GLOBAL EQUITY FUND SERIES A", productName: "IG WEALTH GLOBAL EQUITY FUND SERIES A", supplier: "IG", risk: "H", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.5%", felMaxRate: "0.0%", currentPrice: "$21.9876", priceDate: "04/29/2025", category: "Global Equity", distributionOption: "Reinvest", startDate: "03/15/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.4056", certificate: "No Certificate", active: true, lastSequence: "5678", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$52,890.00 CAD" },
          { id: "MACKENZIE-4444", productCode: "MACKENZIE-4444", accountNumber: "5566778899", fullName: "MACKENZIE-4444 5566778899 (M) MACKENZIE CANADIAN GROWTH FUND SERIES A", productName: "MACKENZIE CANADIAN GROWTH FUND SERIES A", supplier: "MACKENZIE", risk: "M", investmentObjective: "100% Gr", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$19.5432", priceDate: "04/29/2025", category: "Canadian Equity", distributionOption: "Reinvest", startDate: "05/20/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "4.0012", certificate: "No Certificate", active: true, lastSequence: "6789", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$78,230.00 CAD" },
          { id: "AGF-5555", productCode: "AGF-5555", accountNumber: "4455667788", fullName: "AGF-5555 4455667788 (LM) AGF GLOBAL BOND FUND SERIES F", productName: "AGF GLOBAL BOND FUND SERIES F", supplier: "AGF", risk: "LM", investmentObjective: "100% In", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$12.3456", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "08/30/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.8012", certificate: "No Certificate", active: true, lastSequence: "7890", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$34,560.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "TFSA-4567", type: "TFSA", investments: ["IG-3333"] },
          plan2: { id: "RRSP-8901", type: "RRSP", investments: ["MACKENZIE-4444"] },
          plan3: { id: "NR-3456", type: "Non-Registered", investments: ["AGF-5555"] },
        },
      },
      "CL009": {
        plans: [
          { id: "DCPP-6789", type: "DCPP", accountNumber: "DCPP-6789", name: "David Thompson", category: "Individual", marketValue: "$234,560.00" },
        ],
        fundAccounts: [
          { id: "TD-6666", productCode: "TD-6666", accountNumber: "3344556677", fullName: "TD-6666 3344556677 (H) TD GLOBAL TECHNOLOGY FUND SERIES A", productName: "TD GLOBAL TECHNOLOGY FUND SERIES A", supplier: "TD", risk: "H", investmentObjective: "100% Gr", rateType: "FEL", dscRate: "0.0%", felMaxRate: "2.5%", currentPrice: "$35.6789", priceDate: "04/29/2025", category: "Technology", distributionOption: "Reinvest", startDate: "01/05/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "6.5789", certificate: "No Certificate", active: true, lastSequence: "8901", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$234,560.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "DCPP-6789", type: "DCPP", investments: ["TD-6666"] },
        },
      },
      "CL011": {
        plans: [
          { id: "RRIF-9012", type: "RRIF", accountNumber: "RRIF-9012", name: "James Brown", category: "Individual", marketValue: "$145,670.00" },
          { id: "LIF-5678", type: "LIF", accountNumber: "LIF-5678", name: "James Brown", category: "Individual", marketValue: "$98,340.00" },
        ],
        fundAccounts: [
          { id: "RBC-7777", productCode: "RBC-7777", accountNumber: "2233445566", fullName: "RBC-7777 2233445566 (M) RBC CANADIAN DIVIDEND FUND SERIES A", productName: "RBC CANADIAN DIVIDEND FUND SERIES A", supplier: "RBC", risk: "M", investmentObjective: "75% In, 25% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$17.8901", priceDate: "04/29/2025", category: "Canadian Dividend", distributionOption: "Reinvest", startDate: "11/18/2020", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "8.1456", certificate: "No Certificate", active: true, lastSequence: "9012", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$145,670.00 CAD" },
          { id: "BMO-8888", productCode: "BMO-8888", accountNumber: "1122334455", fullName: "BMO-8888 1122334455 (LM) BMO CONSERVATIVE INCOME FUND SERIES A", productName: "BMO CONSERVATIVE INCOME FUND SERIES A", supplier: "BMO", risk: "LM", investmentObjective: "100% In", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$13.4567", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "09/12/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "7.3123", certificate: "No Certificate", active: true, lastSequence: "0123", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$98,340.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRIF-9012", type: "RRIF", investments: ["RBC-7777"] },
          plan2: { id: "LIF-5678", type: "LIF", investments: ["BMO-8888"] },
        },
      },
      "CL012": {
        plans: [
          { id: "RRSP-1234", type: "RRSP", accountNumber: "RRSP-1234", name: "William Anderson", category: "Individual", marketValue: "$167,890.00" },
          { id: "TFSA-5678", type: "TFSA", accountNumber: "TFSA-5678", name: "William Anderson", category: "Individual", marketValue: "$43,210.00" },
        ],
        fundAccounts: [
          { id: "CIBC-9999", productCode: "CIBC-9999", accountNumber: "9988776655", fullName: "CIBC-9999 9988776655 (H) CIBC GLOBAL EQUITY FUND SERIES A", productName: "CIBC GLOBAL EQUITY FUND SERIES A", supplier: "CIBC", risk: "H", investmentObjective: "100% Gr", rateType: "FEL", dscRate: "0.0%", felMaxRate: "1.8%", currentPrice: "$27.1234", priceDate: "04/29/2025", category: "Global Equity", distributionOption: "Reinvest", startDate: "02/14/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "6.1890", certificate: "No Certificate", active: true, lastSequence: "1234", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$167,890.00 CAD" },
          { id: "FID-0000", productCode: "FID-0000", accountNumber: "8877665544", fullName: "FID-0000 8877665544 (M) FIDELITY MONTHLY INCOME FUND SERIES B", productName: "FIDELITY MONTHLY INCOME FUND SERIES B", supplier: "FID", risk: "M", investmentObjective: "100% In", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$10.8765", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "06/25/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "3.9765", certificate: "No Certificate", active: true, lastSequence: "2345", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$43,210.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRSP-1234", type: "RRSP", investments: ["CIBC-9999"] },
          plan2: { id: "TFSA-5678", type: "TFSA", investments: ["FID-0000"] },
        },
      },
      "CL013": {
        plans: [
          { id: "RESP-2345", type: "RESP", accountNumber: "RESP-2345", name: "Maria Garcia", category: "Family Plan", marketValue: "$89,450.00" },
          { id: "TFSA-8901", type: "TFSA", accountNumber: "TFSA-8901", name: "Maria Garcia", category: "Individual", marketValue: "$28,340.00" },
        ],
        fundAccounts: [
          { id: "SCOTIA-1111", productCode: "SCOTIA-1111", accountNumber: "7766554433", fullName: "SCOTIA-1111 7766554433 (M) SCOTIA CANADIAN EQUITY FUND SERIES A", productName: "SCOTIA CANADIAN EQUITY FUND SERIES A", supplier: "SCOTIA", risk: "M", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$20.5432", priceDate: "04/29/2025", category: "Canadian Equity", distributionOption: "Reinvest", startDate: "04/08/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "4.3543", certificate: "No Certificate", active: true, lastSequence: "3456", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$89,450.00 CAD" },
          { id: "MANULIFE-2222", productCode: "MANULIFE-2222", accountNumber: "6655443322", fullName: "MANULIFE-2222 6655443322 (LM) MANULIFE BALANCED FUND SERIES A", productName: "MANULIFE BALANCED FUND SERIES A", supplier: "MANULIFE", risk: "LM", investmentObjective: "50% In, 50% Gr", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$14.3210", priceDate: "04/29/2025", category: "Balanced", distributionOption: "Reinvest", startDate: "10/15/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "1.9789", certificate: "No Certificate", active: true, lastSequence: "4567", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$28,340.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RESP-2345", type: "RESP", investments: ["SCOTIA-1111"] },
          plan2: { id: "TFSA-8901", type: "TFSA", investments: ["MANULIFE-2222"] },
        },
      },
      "CL014": {
        plans: [
          { id: "RRSP-3456", type: "RRSP", accountNumber: "RRSP-3456", name: "Michael Chen", category: "Individual", marketValue: "$198,760.00" },
          { id: "NR-6789", type: "Non-Registered", accountNumber: "NR-6789", name: "Michael Chen", category: "Individual", marketValue: "$67,890.00" },
        ],
        fundAccounts: [
          { id: "SUNLIFE-3333", productCode: "SUNLIFE-3333", accountNumber: "5544332211", fullName: "SUNLIFE-3333 5544332211 (H) SUN LIFE GLOBAL GROWTH FUND SERIES A", productName: "SUN LIFE GLOBAL GROWTH FUND SERIES A", supplier: "SUNLIFE", risk: "H", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.5%", felMaxRate: "0.0%", currentPrice: "$32.1098", priceDate: "04/29/2025", category: "Global Equity", distributionOption: "Reinvest", startDate: "03/22/2020", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "6.1987", certificate: "No Certificate", active: true, lastSequence: "5678", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$198,760.00 CAD" },
          { id: "IG-4444", productCode: "IG-4444", accountNumber: "4433221100", fullName: "IG-4444 4433221100 (M) IG WEALTH CANADIAN DIVIDEND FUND SERIES A", productName: "IG WEALTH CANADIAN DIVIDEND FUND SERIES A", supplier: "IG", risk: "M", investmentObjective: "80% In, 20% Gr", rateType: "FEL", dscRate: "0.0%", felMaxRate: "1.0%", currentPrice: "$18.7654", priceDate: "04/29/2025", category: "Canadian Dividend", distributionOption: "Reinvest", startDate: "07/08/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "3.6210", certificate: "No Certificate", active: true, lastSequence: "6789", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$67,890.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRSP-3456", type: "RRSP", investments: ["SUNLIFE-3333"] },
          plan2: { id: "NR-6789", type: "Non-Registered", investments: ["IG-4444"] },
        },
      },
      "CL015": {
        plans: [
          { id: "TFSA-4567", type: "TFSA", accountNumber: "TFSA-4567", name: "Emily Davis", category: "Individual", marketValue: "$34,560.00" },
        ],
        fundAccounts: [
          { id: "MACKENZIE-5555", productCode: "MACKENZIE-5555", accountNumber: "3322110099", fullName: "MACKENZIE-5555 3322110099 (LM) MACKENZIE INCOME FUND SERIES A", productName: "MACKENZIE INCOME FUND SERIES A", supplier: "MACKENZIE", risk: "LM", investmentObjective: "100% In", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$11.5432", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "12/05/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.9921", certificate: "No Certificate", active: true, lastSequence: "7890", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$34,560.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "TFSA-4567", type: "TFSA", investments: ["MACKENZIE-5555"] },
        },
      },
      "CL016": {
        plans: [
          { id: "RRSP-5678", type: "RRSP", accountNumber: "RRSP-5678", name: "Christopher Martinez", category: "Individual", marketValue: "$123,450.00" },
          { id: "RRIF-0123", type: "RRIF", accountNumber: "RRIF-0123", name: "Christopher Martinez", category: "Individual", marketValue: "$87,230.00" },
        ],
        fundAccounts: [
          { id: "TD-6666", productCode: "TD-6666", accountNumber: "2211009988", fullName: "TD-6666 2211009988 (M) TD BALANCED GROWTH FUND SERIES A", productName: "TD BALANCED GROWTH FUND SERIES A", supplier: "TD", risk: "M", investmentObjective: "40% In, 60% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$22.4321", priceDate: "04/29/2025", category: "Balanced", distributionOption: "Reinvest", startDate: "05/12/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "5.5012", certificate: "No Certificate", active: true, lastSequence: "8901", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$123,450.00 CAD" },
          { id: "RBC-7777", productCode: "RBC-7777", accountNumber: "1100998877", fullName: "RBC-7777 1100998877 (LM) RBC CONSERVATIVE FUND SERIES A", productName: "RBC CONSERVATIVE FUND SERIES A", supplier: "RBC", risk: "LM", investmentObjective: "100% In", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$12.8901", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "08/20/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "6.7689", certificate: "No Certificate", active: true, lastSequence: "9012", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$87,230.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRSP-5678", type: "RRSP", investments: ["TD-6666"] },
          plan2: { id: "RRIF-0123", type: "RRIF", investments: ["RBC-7777"] },
        },
      },
      "CL017": {
        plans: [
          { id: "OPEN-6789", type: "OPEN", accountNumber: "OPEN-6789", name: "Jessica Taylor", category: "Joint", marketValue: "$56,780.00" },
          { id: "TFSA-2345", type: "TFSA", accountNumber: "TFSA-2345", name: "Jessica Taylor", category: "Individual", marketValue: "$29,450.00" },
        ],
        fundAccounts: [
          { id: "BMO-8888", productCode: "BMO-8888", accountNumber: "0099887766", fullName: "BMO-8888 0099887766 (M) BMO CANADIAN EQUITY FUND SERIES A", productName: "BMO CANADIAN EQUITY FUND SERIES A", supplier: "BMO", risk: "M", investmentObjective: "100% Gr", rateType: "FEL", dscRate: "0.0%", felMaxRate: "1.5%", currentPrice: "$19.6543", priceDate: "04/29/2025", category: "Canadian Equity", distributionOption: "Reinvest", startDate: "09/30/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.8901", certificate: "No Certificate", active: true, lastSequence: "0123", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$56,780.00 CAD" },
          { id: "CIBC-9999", productCode: "CIBC-9999", accountNumber: "9988776655", fullName: "CIBC-9999 9988776655 (LM) CIBC INCOME FUND SERIES A", productName: "CIBC INCOME FUND SERIES A", supplier: "CIBC", risk: "LM", investmentObjective: "100% In", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$13.2109", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "11/25/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.2289", certificate: "No Certificate", active: true, lastSequence: "1234", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$29,450.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "OPEN-6789", type: "OPEN", investments: ["BMO-8888"] },
          plan2: { id: "TFSA-2345", type: "TFSA", investments: ["CIBC-9999"] },
        },
      },
      "CL018": {
        plans: [
          { id: "RRSP-7890", type: "RRSP", accountNumber: "RRSP-7890", name: "Daniel Rodriguez", category: "Individual", marketValue: "$178,340.00" },
          { id: "LIF-3456", type: "LIF", accountNumber: "LIF-3456", name: "Daniel Rodriguez", category: "Individual", marketValue: "$112,560.00" },
        ],
        fundAccounts: [
          { id: "FID-0000", productCode: "FID-0000", accountNumber: "8877665544", fullName: "FID-0000 8877665544 (H) FIDELITY GLOBAL TECHNOLOGY FUND SERIES B", productName: "FIDELITY GLOBAL TECHNOLOGY FUND SERIES B", supplier: "FID", risk: "H", investmentObjective: "100% Gr", rateType: "FEL", dscRate: "0.0%", felMaxRate: "2.2%", currentPrice: "$38.7654", priceDate: "04/29/2025", category: "Technology", distributionOption: "Reinvest", startDate: "01/18/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "4.6012", certificate: "No Certificate", active: true, lastSequence: "2345", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$178,340.00 CAD" },
          { id: "SCOTIA-1111", productCode: "SCOTIA-1111", accountNumber: "7766554433", fullName: "SCOTIA-1111 7766554433 (M) SCOTIA BALANCED FUND SERIES A", productName: "SCOTIA BALANCED FUND SERIES A", supplier: "SCOTIA", risk: "M", investmentObjective: "50% In, 50% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$17.4321", priceDate: "04/29/2025", category: "Balanced", distributionOption: "Reinvest", startDate: "04/05/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "6.4567", certificate: "No Certificate", active: true, lastSequence: "3456", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$112,560.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRSP-7890", type: "RRSP", investments: ["FID-0000"] },
          plan2: { id: "LIF-3456", type: "LIF", investments: ["SCOTIA-1111"] },
        },
      },
      "CL019": {
        plans: [
          { id: "TFSA-8901", type: "TFSA", accountNumber: "TFSA-8901", name: "Olivia White", category: "Individual", marketValue: "$41,230.00" },
          { id: "NR-4567", type: "Non-Registered", accountNumber: "NR-4567", name: "Olivia White", category: "Individual", marketValue: "$67,890.00" },
        ],
        fundAccounts: [
          { id: "MANULIFE-2222", productCode: "MANULIFE-2222", accountNumber: "6655443322", fullName: "MANULIFE-2222 6655443322 (M) MANULIFE GLOBAL EQUITY FUND SERIES A", productName: "MANULIFE GLOBAL EQUITY FUND SERIES A", supplier: "MANULIFE", risk: "M", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$24.3210", priceDate: "04/29/2025", category: "Global Equity", distributionOption: "Reinvest", startDate: "06/12/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "1.6945", certificate: "No Certificate", active: true, lastSequence: "4567", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$41,230.00 CAD" },
          { id: "SUNLIFE-3333", productCode: "SUNLIFE-3333", accountNumber: "5544332211", fullName: "SUNLIFE-3333 5544332211 (LM) SUN LIFE CANADIAN INCOME FUND SERIES A", productName: "SUN LIFE CANADIAN INCOME FUND SERIES A", supplier: "SUNLIFE", risk: "LM", investmentObjective: "100% In", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$15.6789", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "03/28/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "4.3289", certificate: "No Certificate", active: true, lastSequence: "5678", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$67,890.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "TFSA-8901", type: "TFSA", investments: ["MANULIFE-2222"] },
          plan2: { id: "NR-4567", type: "Non-Registered", investments: ["SUNLIFE-3333"] },
        },
      },
      "CL020": {
        plans: [
          { id: "RRSP-9012", type: "RRSP", accountNumber: "RRSP-9012", name: "Matthew Harris", category: "Individual", marketValue: "$156,780.00" },
          { id: "RESP-5678", type: "RESP", accountNumber: "RESP-5678", name: "Matthew Harris", category: "Family Plan", marketValue: "$45,670.00" },
        ],
        fundAccounts: [
          { id: "IG-4444", productCode: "IG-4444", accountNumber: "4433221100", fullName: "IG-4444 4433221100 (H) IG WEALTH GLOBAL GROWTH FUND SERIES A", productName: "IG WEALTH GLOBAL GROWTH FUND SERIES A", supplier: "IG", risk: "H", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.5%", felMaxRate: "0.0%", currentPrice: "$29.8765", priceDate: "04/29/2025", category: "Global Equity", distributionOption: "Reinvest", startDate: "02/20/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "5.2456", certificate: "No Certificate", active: true, lastSequence: "6789", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$156,780.00 CAD" },
          { id: "MACKENZIE-5555", productCode: "MACKENZIE-5555", accountNumber: "3322110099", fullName: "MACKENZIE-5555 3322110099 (M) MACKENZIE CANADIAN EQUITY FUND SERIES A", productName: "MACKENZIE CANADIAN EQUITY FUND SERIES A", supplier: "MACKENZIE", risk: "M", investmentObjective: "100% Gr", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$20.5432", priceDate: "04/29/2025", category: "Canadian Equity", distributionOption: "Reinvest", startDate: "08/15/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.2234", certificate: "No Certificate", active: true, lastSequence: "7890", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$45,670.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRSP-9012", type: "RRSP", investments: ["IG-4444"] },
          plan2: { id: "RESP-5678", type: "RESP", investments: ["MACKENZIE-5555"] },
        },
      },
      "CL021": {
        plans: [
          { id: "RRIF-0123", type: "RRIF", accountNumber: "RRIF-0123", name: "Sophia Lee", category: "Individual", marketValue: "$134,560.00" },
          { id: "TFSA-3456", type: "TFSA", accountNumber: "TFSA-3456", name: "Sophia Lee", category: "Individual", marketValue: "$38,920.00" },
          { id: "NR-7890", type: "Non-Registered", accountNumber: "NR-7890", name: "Sophia Lee", category: "Individual", marketValue: "$52,340.00" },
        ],
        fundAccounts: [
          { id: "AGF-5555", productCode: "AGF-5555", accountNumber: "4455667788", fullName: "AGF-5555 4455667788 (M) AGF CANADIAN EQUITY FUND SERIES F", productName: "AGF CANADIAN EQUITY FUND SERIES F", supplier: "AGF", risk: "M", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$21.9876", priceDate: "04/29/2025", category: "Canadian Equity", distributionOption: "Reinvest", startDate: "07/22/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "6.1189", certificate: "No Certificate", active: true, lastSequence: "8901", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$134,560.00 CAD" },
          { id: "TD-6666", productCode: "TD-6666", accountNumber: "2211009988", fullName: "TD-6666 2211009988 (LM) TD INCOME FUND SERIES A", productName: "TD INCOME FUND SERIES A", supplier: "TD", risk: "LM", investmentObjective: "100% In", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$14.3210", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "09/10/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.7145", certificate: "No Certificate", active: true, lastSequence: "9012", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$38,920.00 CAD" },
          { id: "RBC-7777", productCode: "RBC-7777", accountNumber: "1100998877", fullName: "RBC-7777 1100998877 (M) RBC BALANCED GROWTH FUND SERIES A", productName: "RBC BALANCED GROWTH FUND SERIES A", supplier: "RBC", risk: "M", investmentObjective: "30% In, 70% Gr", rateType: "FEL", dscRate: "0.0%", felMaxRate: "1.2%", currentPrice: "$19.5432", priceDate: "04/29/2025", category: "Balanced", distributionOption: "Reinvest", startDate: "11/05/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.6789", certificate: "No Certificate", active: true, lastSequence: "0123", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$52,340.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRIF-0123", type: "RRIF", investments: ["AGF-5555"] },
          plan2: { id: "TFSA-3456", type: "TFSA", investments: ["TD-6666"] },
          plan3: { id: "NR-7890", type: "Non-Registered", investments: ["RBC-7777"] },
        },
      },
      "CL022": {
        plans: [
          { id: "RRSP-2345", type: "RRSP", accountNumber: "RRSP-2345", name: "Andrew Clark", category: "Individual", marketValue: "$145,670.00" },
          { id: "TFSA-6789", type: "TFSA", accountNumber: "TFSA-6789", name: "Andrew Clark", category: "Individual", marketValue: "$52,340.00" },
        ],
        fundAccounts: [
          { id: "BMO-1111", productCode: "BMO-1111", accountNumber: "9988776655", fullName: "BMO-1111 9988776655 (H) BMO GLOBAL EQUITY FUND SERIES A", productName: "BMO GLOBAL EQUITY FUND SERIES A", supplier: "BMO", risk: "H", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.5%", felMaxRate: "0.0%", currentPrice: "$31.2345", priceDate: "04/29/2025", category: "Global Equity", distributionOption: "Reinvest", startDate: "03/10/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "4.6623", certificate: "No Certificate", active: true, lastSequence: "2345", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$145,670.00 CAD" },
          { id: "CIBC-2222", productCode: "CIBC-2222", accountNumber: "8877665544", fullName: "CIBC-2222 8877665544 (M) CIBC CANADIAN EQUITY FUND SERIES A", productName: "CIBC CANADIAN EQUITY FUND SERIES A", supplier: "CIBC", risk: "M", investmentObjective: "100% Gr", rateType: "FEL", dscRate: "0.0%", felMaxRate: "1.5%", currentPrice: "$23.4567", priceDate: "04/29/2025", category: "Canadian Equity", distributionOption: "Reinvest", startDate: "08/20/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.2312", certificate: "No Certificate", active: true, lastSequence: "3456", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$52,340.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRSP-2345", type: "RRSP", investments: ["BMO-1111"] },
          plan2: { id: "TFSA-6789", type: "TFSA", investments: ["CIBC-2222"] },
        },
      },
      "CL023": {
        plans: [
          { id: "RESP-3456", type: "RESP", accountNumber: "RESP-3456", name: "Isabella Lewis", category: "Family Plan", marketValue: "$78,920.00" },
          { id: "TFSA-7890", type: "TFSA", accountNumber: "TFSA-7890", name: "Isabella Lewis", category: "Individual", marketValue: "$34,560.00" },
        ],
        fundAccounts: [
          { id: "FID-3333", productCode: "FID-3333", accountNumber: "7766554433", fullName: "FID-3333 7766554433 (M) FIDELITY CANADIAN DIVIDEND FUND SERIES B", productName: "FIDELITY CANADIAN DIVIDEND FUND SERIES B", supplier: "FID", risk: "M", investmentObjective: "70% In, 30% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$18.7654", priceDate: "04/29/2025", category: "Canadian Dividend", distributionOption: "Reinvest", startDate: "05/15/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "4.2056", certificate: "No Certificate", active: true, lastSequence: "4567", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$78,920.00 CAD" },
          { id: "SCOTIA-4444", productCode: "SCOTIA-4444", accountNumber: "6655443322", fullName: "SCOTIA-4444 6655443322 (LM) SCOTIA INCOME FUND SERIES A", productName: "SCOTIA INCOME FUND SERIES A", supplier: "SCOTIA", risk: "LM", investmentObjective: "100% In", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$12.5432", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "10/30/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.7543", certificate: "No Certificate", active: true, lastSequence: "5678", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$34,560.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RESP-3456", type: "RESP", investments: ["FID-3333"] },
          plan2: { id: "TFSA-7890", type: "TFSA", investments: ["SCOTIA-4444"] },
        },
      },
      "CL024": {
        plans: [
          { id: "RRSP-4567", type: "RRSP", accountNumber: "RRSP-4567", name: "Ryan Walker", category: "Individual", marketValue: "$167,890.00" },
          { id: "RRIF-8901", type: "RRIF", accountNumber: "RRIF-8901", name: "Ryan Walker", category: "Individual", marketValue: "$98,340.00" },
          { id: "NR-1234", type: "Non-Registered", accountNumber: "NR-1234", name: "Ryan Walker", category: "Individual", marketValue: "$45,670.00" },
        ],
        fundAccounts: [
          { id: "MANULIFE-5555", productCode: "MANULIFE-5555", accountNumber: "5544332211", fullName: "MANULIFE-5555 5544332211 (H) MANULIFE GLOBAL TECHNOLOGY FUND SERIES A", productName: "MANULIFE GLOBAL TECHNOLOGY FUND SERIES A", supplier: "MANULIFE", risk: "H", investmentObjective: "100% Gr", rateType: "FEL", dscRate: "0.0%", felMaxRate: "2.5%", currentPrice: "$36.7890", priceDate: "04/29/2025", category: "Technology", distributionOption: "Reinvest", startDate: "01/25/2020", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "4.5623", certificate: "No Certificate", active: true, lastSequence: "6789", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$167,890.00 CAD" },
          { id: "SUNLIFE-6666", productCode: "SUNLIFE-6666", accountNumber: "4433221100", fullName: "SUNLIFE-6666 4433221100 (M) SUN LIFE CANADIAN EQUITY FUND SERIES A", productName: "SUN LIFE CANADIAN EQUITY FUND SERIES A", supplier: "SUNLIFE", risk: "M", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$20.1234", priceDate: "04/29/2025", category: "Canadian Equity", distributionOption: "Reinvest", startDate: "06/18/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "4.8901", certificate: "No Certificate", active: true, lastSequence: "7890", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$98,340.00 CAD" },
          { id: "IG-7777", productCode: "IG-7777", accountNumber: "3322110099", fullName: "IG-7777 3322110099 (LM) IG WEALTH BALANCED FUND SERIES A", productName: "IG WEALTH BALANCED FUND SERIES A", supplier: "IG", risk: "LM", investmentObjective: "50% In, 50% Gr", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$16.8901", priceDate: "04/29/2025", category: "Balanced", distributionOption: "Reinvest", startDate: "09/12/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "2.7012", certificate: "No Certificate", active: true, lastSequence: "8901", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$45,670.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "RRSP-4567", type: "RRSP", investments: ["MANULIFE-5555"] },
          plan2: { id: "RRIF-8901", type: "RRIF", investments: ["SUNLIFE-6666"] },
          plan3: { id: "NR-1234", type: "Non-Registered", investments: ["IG-7777"] },
        },
      },
      "CL025": {
        plans: [
          { id: "TFSA-5678", type: "TFSA", accountNumber: "TFSA-5678", name: "Ava Hall", category: "Individual", marketValue: "$43,210.00" },
          { id: "RRSP-9012", type: "RRSP", accountNumber: "RRSP-9012", name: "Ava Hall", category: "Individual", marketValue: "$112,560.00" },
        ],
        fundAccounts: [
          { id: "MACKENZIE-8888", productCode: "MACKENZIE-8888", accountNumber: "2211009988", fullName: "MACKENZIE-8888 2211009988 (M) MACKENZIE GLOBAL EQUITY FUND SERIES A", productName: "MACKENZIE GLOBAL EQUITY FUND SERIES A", supplier: "MACKENZIE", risk: "M", investmentObjective: "100% Gr", rateType: "FE", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$25.4321", priceDate: "04/29/2025", category: "Global Equity", distributionOption: "Reinvest", startDate: "04/05/2022", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "1.7001", certificate: "No Certificate", active: true, lastSequence: "9012", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$43,210.00 CAD" },
          { id: "AGF-9999", productCode: "AGF-9999", accountNumber: "1100998877", fullName: "AGF-9999 1100998877 (H) AGF GLOBAL GROWTH FUND SERIES F", productName: "AGF GLOBAL GROWTH FUND SERIES F", supplier: "AGF", risk: "H", investmentObjective: "100% Gr", rateType: "DSC", dscRate: "5.5%", felMaxRate: "0.0%", currentPrice: "$33.1098", priceDate: "04/29/2025", category: "Global Equity", distributionOption: "Reinvest", startDate: "02/14/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "3.4012", certificate: "No Certificate", active: true, lastSequence: "0123", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$112,560.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "TFSA-5678", type: "TFSA", investments: ["MACKENZIE-8888"] },
          plan2: { id: "RRSP-9012", type: "RRSP", investments: ["AGF-9999"] },
        },
      },
      "CL026": {
        plans: [
          { id: "LIF-6789", type: "LIF", accountNumber: "LIF-6789", name: "Nathan Young", category: "Individual", marketValue: "$134,560.00" },
          { id: "OPEN-0123", type: "OPEN", accountNumber: "OPEN-0123", name: "Nathan Young", category: "Joint", marketValue: "$67,890.00" },
        ],
        fundAccounts: [
          { id: "TD-0000", productCode: "TD-0000", accountNumber: "0099887766", fullName: "TD-0000 0099887766 (M) TD CANADIAN DIVIDEND FUND SERIES A", productName: "TD CANADIAN DIVIDEND FUND SERIES A", supplier: "TD", risk: "M", investmentObjective: "80% In, 20% Gr", rateType: "DSC", dscRate: "5.0%", felMaxRate: "0.0%", currentPrice: "$19.8765", priceDate: "04/29/2025", category: "Canadian Dividend", distributionOption: "Reinvest", startDate: "07/28/2021", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "6.7689", certificate: "No Certificate", active: true, lastSequence: "1234", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$134,560.00 CAD" },
          { id: "RBC-1111", productCode: "RBC-1111", accountNumber: "9988776655", fullName: "RBC-1111 9988776655 (LM) RBC CONSERVATIVE INCOME FUND SERIES A", productName: "RBC CONSERVATIVE INCOME FUND SERIES A", supplier: "RBC", risk: "LM", investmentObjective: "100% In", rateType: "ISC", dscRate: "0.0%", felMaxRate: "0.0%", currentPrice: "$13.5432", priceDate: "04/29/2025", category: "Fixed Income", distributionOption: "Reinvest", startDate: "12/10/2023", endDate: "", totalSharesIssued: "0.0000", totalSharesUnissued: "5.0056", certificate: "No Certificate", active: true, lastSequence: "2345", effectiveDate: "04/25/2025", excludeFromDuplicate: false, marketValue: "$67,890.00 CAD" },
        ],
        summaryData: {
          plan1: { id: "LIF-6789", type: "LIF", investments: ["TD-0000"] },
          plan2: { id: "OPEN-0123", type: "OPEN", investments: ["RBC-1111"] },
        },
      },
    };

    // Return client-specific data or default
    return clientDataMap[clientId] || getClientData(undefined);
  };

  const clientData = getClientData(id);
  const plansList = clientData.plans;
  const fundAccounts = clientData.fundAccounts;
  
  // Get investments for selected plan
  const getPlanInvestments = (planId: string | null): string[] => {
    if (!planId) return [];
    const planData = Object.values(clientData.summaryData).find((p: any) => p.id === planId);
    return planData?.investments || [];
  };
  
  // Helper function to calculate KYC Age in days
  const calculateKYCAge = (kycDate: string): string => {
    if (!kycDate) return "";
    const [month, day, year] = kycDate.split("/").map(Number);
    const kycDateObj = new Date(year, month - 1, day);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - kycDateObj.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days Old`;
  };

  // Get plan-specific details
  const getPlanDetails = (planId: string | null) => {
    if (!planId) {
      return {
        accountDesignation: "Client Name",
        description: "",
        intentOfUse: "",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "",
        intermediaryAccountCode: "",
        startDate: "",
        endDate: "",
        kycOnFileDate: "",
        kycAge: "",
        kycOriginalReceivedDate: "",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      };
    }

    // Generate unique dates based on client ID and plan ID
    const generateUniqueDates = (clientId: string | undefined, planId: string) => {
      // Create a hash from client ID and plan ID for consistent but unique dates
      const clientHash = (clientId || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const planHash = planId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const hash = clientHash + planHash;
      
      // Generate dates based on hash to ensure uniqueness per client/plan
      const baseYear = 2015 + (hash % 10); // Years between 2015-2024
      const baseMonth = 1 + ((hash * 7) % 12); // Months 1-12
      const baseDay = 1 + ((hash * 13) % 28); // Days 1-28
      
      const startDate = new Date(baseYear, baseMonth - 1, baseDay);
      const kycOnFileDate = new Date(startDate);
      kycOnFileDate.setDate(kycOnFileDate.getDate() - (7 + (hash % 14))); // 7-20 days before
      const kycOriginalDate = new Date(kycOnFileDate);
      kycOriginalDate.setDate(kycOriginalDate.getDate() - (5 + (hash % 10))); // 5-14 days before
      
      const formatDate = (date: Date) => {
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const year = date.getFullYear();
        return `${month}/${day}/${year}`;
      };
      
      return {
        startDate: formatDate(startDate),
        kycOnFileDate: formatDate(kycOnFileDate),
        kycAge: calculateKYCAge(formatDate(kycOnFileDate)),
        kycOriginalReceivedDate: formatDate(kycOriginalDate),
      };
    };

    const planDetailsMap: Record<string, any> = {
      "340009": {
        accountDesignation: "Joint",
        description: "Joint OPEN account",
        intentOfUse: "Retirement savings",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "84732956",
        intermediaryAccountCode: "847329561",
        startDate: "06/18/2019",
        endDate: "",
        kycOnFileDate: "06/12/2019",
        kycAge: calculateKYCAge("06/12/2019"),
        kycOriginalReceivedDate: "06/08/2019",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "0137617685": {
        accountDesignation: "Client Name",
        description: "RRIF account for retirement income",
        intentOfUse: "Retirement income",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: true,
        recipient: "Individual",
        intermediaryCode: "29184763",
        intermediaryAccountCode: "291847632",
        startDate: "11/22/2017",
        endDate: "",
        kycOnFileDate: "11/15/2017",
        kycAge: calculateKYCAge("11/15/2017"),
        kycOriginalReceivedDate: "11/10/2017",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-4521": {
        accountDesignation: "Client Name",
        description: "RRSP retirement savings",
        intentOfUse: "Retirement savings",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "73849216",
        intermediaryAccountCode: "738492163",
        startDate: "04/14/2021",
        endDate: "",
        kycOnFileDate: "04/08/2021",
        kycAge: calculateKYCAge("04/08/2021"),
        kycOriginalReceivedDate: "04/05/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "TFSA-7892": {
        accountDesignation: "Client Name",
        description: "TFSA tax-free savings",
        intentOfUse: "Tax-free growth",
        frozen: true,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "56372849",
        intermediaryAccountCode: "563728494",
        startDate: "09/25/2020",
        endDate: "",
        kycOnFileDate: "09/18/2020",
        kycAge: calculateKYCAge("09/18/2020"),
        kycOriginalReceivedDate: "09/15/2020",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RESP-3456": {
        accountDesignation: "Individual",
        description: "RESP for children's education",
        intentOfUse: "Education savings",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "48572931",
        intermediaryAccountCode: "485729315",
        startDate: "08/30/2022",
        endDate: "",
        kycOnFileDate: "08/24/2022",
        kycAge: calculateKYCAge("08/24/2022"),
        kycOriginalReceivedDate: "08/20/2022",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "NR-7890": {
        accountDesignation: "Individual",
        description: "Non-registered investment account",
        intentOfUse: "Taxable investment growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "67294815",
        intermediaryAccountCode: "672948156",
        startDate: "03/17/2023",
        endDate: "",
        kycOnFileDate: "03/12/2023",
        kycAge: calculateKYCAge("03/12/2023"),
        kycOriginalReceivedDate: "03/08/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "TFSA-1234": {
        accountDesignation: "Individual",
        description: "TFSA conservative income fund",
        intentOfUse: "Conservative tax-free growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "81937462",
        intermediaryAccountCode: "819374627",
        startDate: "01/22/2024",
        endDate: "",
        kycOnFileDate: "01/16/2024",
        kycAge: calculateKYCAge("01/16/2024"),
        kycOriginalReceivedDate: "01/12/2024",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-5678": {
        accountDesignation: "Individual",
        description: "RRSP retirement savings plan",
        intentOfUse: "Retirement savings",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "38475629",
        intermediaryAccountCode: "384756298",
        startDate: "07/11/2021",
        endDate: "",
        kycOnFileDate: "07/05/2021",
        kycAge: calculateKYCAge("07/05/2021"),
        kycOriginalReceivedDate: "07/01/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "LIF-2345": {
        accountDesignation: "Individual",
        description: "LIF retirement income account",
        intentOfUse: "Retirement income",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: true,
        recipient: "Individual",
        intermediaryCode: "74628539",
        intermediaryAccountCode: "746285399",
        startDate: "12/05/2019",
        endDate: "",
        kycOnFileDate: "11/28/2019",
        kycAge: calculateKYCAge("11/28/2019"),
        kycOriginalReceivedDate: "11/25/2019",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "TFSA-4567": {
        accountDesignation: "Individual",
        description: "TFSA global equity fund",
        intentOfUse: "Aggressive tax-free growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "72938465",
        intermediaryAccountCode: "729384651",
        startDate: "05/28/2022",
        endDate: "",
        kycOnFileDate: "05/22/2022",
        kycAge: calculateKYCAge("05/22/2022"),
        kycOriginalReceivedDate: "05/18/2022",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-8901": {
        accountDesignation: "Individual",
        description: "RRSP Canadian growth fund",
        intentOfUse: "Long-term growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "29384756",
        intermediaryAccountCode: "293847562",
        startDate: "10/14/2020",
        endDate: "",
        kycOnFileDate: "10/08/2020",
        kycAge: calculateKYCAge("10/08/2020"),
        kycOriginalReceivedDate: "10/04/2020",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "NR-3456": {
        accountDesignation: "Individual",
        description: "Non-registered bond fund",
        intentOfUse: "Fixed income investment",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "64738291",
        intermediaryAccountCode: "647382913",
        startDate: "06/19/2023",
        endDate: "",
        kycOnFileDate: "06/13/2023",
        kycAge: calculateKYCAge("06/13/2023"),
        kycOriginalReceivedDate: "06/09/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "DCPP-6789": {
        accountDesignation: "Individual",
        description: "DCPP technology fund",
        intentOfUse: "Technology sector growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: true,
        recipient: "Individual",
        intermediaryCode: "93847562",
        intermediaryAccountCode: "938475624",
        startDate: "02/16/2020",
        endDate: "",
        kycOnFileDate: "02/10/2020",
        kycAge: calculateKYCAge("02/10/2020"),
        kycOriginalReceivedDate: "02/06/2020",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRIF-9012": {
        accountDesignation: "Individual",
        description: "RRIF dividend fund",
        intentOfUse: "Retirement income",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: true,
        recipient: "Individual",
        intermediaryCode: "56293847",
        intermediaryAccountCode: "562938475",
        startDate: "09/12/2018",
        endDate: "",
        kycOnFileDate: "09/06/2018",
        kycAge: calculateKYCAge("09/06/2018"),
        kycOriginalReceivedDate: "09/02/2018",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "LIF-5678": {
        accountDesignation: "Individual",
        description: "LIF conservative income fund",
        intentOfUse: "Conservative retirement income",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: true,
        recipient: "Individual",
        intermediaryCode: "62938475",
        intermediaryAccountCode: "629384756",
        startDate: "03/24/2019",
        endDate: "",
        kycOnFileDate: "03/18/2019",
        kycAge: calculateKYCAge("03/18/2019"),
        kycOriginalReceivedDate: "03/14/2019",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-1234": {
        accountDesignation: "Individual",
        description: "RRSP global equity fund",
        intentOfUse: "Global growth strategy",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "47582936",
        intermediaryAccountCode: "475829367",
        startDate: "12/08/2021",
        endDate: "",
        kycOnFileDate: "12/02/2021",
        kycAge: calculateKYCAge("12/02/2021"),
        kycOriginalReceivedDate: "11/28/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "TFSA-5678": {
        accountDesignation: "Individual",
        description: "TFSA monthly income fund",
        intentOfUse: "Tax-free income",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "75829364",
        intermediaryAccountCode: "758293648",
        startDate: "07/30/2022",
        endDate: "",
        kycOnFileDate: "07/24/2022",
        kycAge: calculateKYCAge("07/24/2022"),
        kycOriginalReceivedDate: "07/20/2022",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RESP-2345": {
        accountDesignation: "Individual",
        description: "RESP Canadian equity fund",
        intentOfUse: "Education savings growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "83927465",
        intermediaryAccountCode: "839274659",
        startDate: "05/19/2020",
        endDate: "",
        kycOnFileDate: "05/13/2020",
        kycAge: calculateKYCAge("05/13/2020"),
        kycOriginalReceivedDate: "05/09/2020",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "TFSA-8901": {
        accountDesignation: "Individual",
        description: "TFSA balanced fund",
        intentOfUse: "Balanced tax-free growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "39274658",
        intermediaryAccountCode: "392746581",
        startDate: "11/26/2023",
        endDate: "",
        kycOnFileDate: "11/20/2023",
        kycAge: calculateKYCAge("11/20/2023"),
        kycOriginalReceivedDate: "11/16/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-3456": {
        accountDesignation: "Individual",
        description: "RRSP global growth fund",
        intentOfUse: "Aggressive global growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "28473956",
        intermediaryAccountCode: "284739562",
        startDate: "01/28/2019",
        endDate: "",
        kycOnFileDate: "01/22/2019",
        kycAge: calculateKYCAge("01/22/2019"),
        kycOriginalReceivedDate: "01/18/2019",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "NR-6789": {
        accountDesignation: "Individual",
        description: "Non-registered dividend fund",
        intentOfUse: "Taxable dividend income",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "84739562",
        intermediaryAccountCode: "847395623",
        startDate: "04/11/2021",
        endDate: "",
        kycOnFileDate: "04/05/2021",
        kycAge: calculateKYCAge("04/05/2021"),
        kycOriginalReceivedDate: "04/01/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-5678-2": {
        accountDesignation: "Individual",
        description: "RRSP balanced growth fund",
        intentOfUse: "Balanced retirement growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "46738291",
        intermediaryAccountCode: "467382914",
        startDate: "08/03/2022",
        endDate: "",
        kycOnFileDate: "07/28/2022",
        kycAge: calculateKYCAge("07/28/2022"),
        kycOriginalReceivedDate: "07/24/2022",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRIF-0123": {
        accountDesignation: "Individual",
        description: "RRIF conservative fund",
        intentOfUse: "Conservative retirement income",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: true,
        recipient: "Individual",
        intermediaryCode: "58293746",
        intermediaryAccountCode: "582937465",
        startDate: "06/14/2023",
        endDate: "",
        kycOnFileDate: "06/08/2023",
        kycAge: calculateKYCAge("06/08/2023"),
        kycOriginalReceivedDate: "06/04/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "OPEN-6789": {
        accountDesignation: "Joint",
        description: "Joint OPEN Canadian equity account",
        intentOfUse: "Joint investment growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "47382956",
        intermediaryAccountCode: "473829566",
        startDate: "09/30/2022",
        endDate: "",
        kycOnFileDate: "09/25/2022",
        kycAge: calculateKYCAge("09/25/2022"),
        kycOriginalReceivedDate: "09/20/2022",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "TFSA-2345": {
        accountDesignation: "Individual",
        description: "TFSA income fund",
        intentOfUse: "Tax-free income generation",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "64829173",
        intermediaryAccountCode: "648291737",
        startDate: "11/25/2023",
        endDate: "",
        kycOnFileDate: "11/20/2023",
        kycAge: calculateKYCAge("11/20/2023"),
        kycOriginalReceivedDate: "11/15/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-7890": {
        accountDesignation: "Individual",
        description: "RRSP technology fund",
        intentOfUse: "Technology sector growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "57392846",
        intermediaryAccountCode: "573928468",
        startDate: "03/12/2021",
        endDate: "",
        kycOnFileDate: "03/08/2021",
        kycAge: calculateKYCAge("03/08/2021"),
        kycOriginalReceivedDate: "03/04/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "LIF-3456": {
        accountDesignation: "Individual",
        description: "LIF balanced fund",
        intentOfUse: "Balanced retirement income",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: true,
        recipient: "Individual",
        intermediaryCode: "73928465",
        intermediaryAccountCode: "739284659",
        startDate: "04/05/2022",
        endDate: "",
        kycOnFileDate: "04/01/2022",
        kycAge: calculateKYCAge("04/01/2022"),
        kycOriginalReceivedDate: "03/28/2022",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "NR-4567": {
        accountDesignation: "Individual",
        description: "Non-registered income fund",
        intentOfUse: "Taxable income generation",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "82937461",
        intermediaryAccountCode: "829374611",
        startDate: "03/28/2023",
        endDate: "",
        kycOnFileDate: "03/25/2023",
        kycAge: calculateKYCAge("03/25/2023"),
        kycOriginalReceivedDate: "03/20/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-9012": {
        accountDesignation: "Individual",
        description: "RRSP global growth fund",
        intentOfUse: "Aggressive global growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "39485762",
        intermediaryAccountCode: "394857622",
        startDate: "02/20/2021",
        endDate: "",
        kycOnFileDate: "02/15/2021",
        kycAge: calculateKYCAge("02/15/2021"),
        kycOriginalReceivedDate: "02/10/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RESP-5678": {
        accountDesignation: "Individual",
        description: "RESP Canadian equity fund",
        intentOfUse: "Education savings growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "48572936",
        intermediaryAccountCode: "485729363",
        startDate: "08/15/2023",
        endDate: "",
        kycOnFileDate: "08/10/2023",
        kycAge: calculateKYCAge("08/10/2023"),
        kycOriginalReceivedDate: "08/06/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRIF-0123-3": {
        accountDesignation: "Individual",
        description: "RRIF Canadian equity fund",
        intentOfUse: "Retirement income growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: true,
        recipient: "Individual",
        intermediaryCode: "75829364",
        intermediaryAccountCode: "758293644",
        startDate: "07/22/2021",
        endDate: "",
        kycOnFileDate: "07/18/2021",
        kycAge: calculateKYCAge("07/18/2021"),
        kycOriginalReceivedDate: "07/14/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "TFSA-3456": {
        accountDesignation: "Individual",
        description: "TFSA income fund",
        intentOfUse: "Tax-free income",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "28475693",
        intermediaryAccountCode: "284756935",
        startDate: "09/10/2023",
        endDate: "",
        kycOnFileDate: "09/05/2023",
        kycAge: calculateKYCAge("09/05/2023"),
        kycOriginalReceivedDate: "09/01/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "NR-7890-2": {
        accountDesignation: "Individual",
        description: "Non-registered balanced fund",
        intentOfUse: "Balanced taxable growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "94736285",
        intermediaryAccountCode: "947362856",
        startDate: "11/05/2022",
        endDate: "",
        kycOnFileDate: "11/01/2022",
        kycAge: calculateKYCAge("11/01/2022"),
        kycOriginalReceivedDate: "10/28/2022",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-2345": {
        accountDesignation: "Individual",
        description: "RRSP global equity fund",
        intentOfUse: "Global growth strategy",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "37482956",
        intermediaryAccountCode: "374829567",
        startDate: "03/10/2021",
        endDate: "",
        kycOnFileDate: "03/05/2021",
        kycAge: calculateKYCAge("03/05/2021"),
        kycOriginalReceivedDate: "03/01/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "TFSA-6789": {
        accountDesignation: "Individual",
        description: "TFSA Canadian equity fund",
        intentOfUse: "Tax-free Canadian growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "63927485",
        intermediaryAccountCode: "639274858",
        startDate: "08/20/2022",
        endDate: "",
        kycOnFileDate: "08/15/2022",
        kycAge: calculateKYCAge("08/15/2022"),
        kycOriginalReceivedDate: "08/11/2022",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RESP-3456-2": {
        accountDesignation: "Individual",
        description: "RESP dividend fund",
        intentOfUse: "Education savings with dividends",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "59283746",
        intermediaryAccountCode: "592837469",
        startDate: "05/15/2021",
        endDate: "",
        kycOnFileDate: "05/10/2021",
        kycAge: calculateKYCAge("05/10/2021"),
        kycOriginalReceivedDate: "05/06/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "TFSA-7890": {
        accountDesignation: "Individual",
        description: "TFSA income fund",
        intentOfUse: "Tax-free income generation",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "72938461",
        intermediaryAccountCode: "729384611",
        startDate: "10/30/2023",
        endDate: "",
        kycOnFileDate: "10/25/2023",
        kycAge: calculateKYCAge("10/25/2023"),
        kycOriginalReceivedDate: "10/21/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-4567": {
        accountDesignation: "Individual",
        description: "RRSP technology fund",
        intentOfUse: "Technology sector growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "38475629",
        intermediaryAccountCode: "384756292",
        startDate: "01/25/2020",
        endDate: "",
        kycOnFileDate: "01/20/2020",
        kycAge: "1926 days Old",
        kycOriginalReceivedDate: "01/20/2020",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRIF-8901": {
        accountDesignation: "Individual",
        description: "RRIF Canadian equity fund",
        intentOfUse: "Retirement income growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: true,
        recipient: "Individual",
        intermediaryCode: "48372659",
        intermediaryAccountCode: "483726593",
        startDate: "06/18/2022",
        endDate: "",
        kycOnFileDate: "06/15/2022",
        kycAge: "1049 days Old",
        kycOriginalReceivedDate: "06/15/2022",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "NR-1234": {
        accountDesignation: "Individual",
        description: "Non-registered balanced fund",
        intentOfUse: "Balanced taxable investment",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "73629485",
        intermediaryAccountCode: "736294854",
        startDate: "09/12/2023",
        endDate: "",
        kycOnFileDate: "09/08/2023",
        kycAge: "595 days Old",
        kycOriginalReceivedDate: "09/08/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "TFSA-5678-2": {
        accountDesignation: "Individual",
        description: "TFSA global equity fund",
        intentOfUse: "Tax-free global growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "85937264",
        intermediaryAccountCode: "859372645",
        startDate: "04/05/2022",
        endDate: "",
        kycOnFileDate: "04/01/2022",
        kycAge: "1123 days Old",
        kycOriginalReceivedDate: "04/01/2022",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "RRSP-9012-2": {
        accountDesignation: "Individual",
        description: "RRSP global growth fund",
        intentOfUse: "Aggressive global growth",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "93746285",
        intermediaryAccountCode: "937462856",
        startDate: "02/14/2021",
        endDate: "",
        kycOnFileDate: "02/10/2021",
        kycAge: "1505 days Old",
        kycOriginalReceivedDate: "02/10/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "LIF-6789": {
        accountDesignation: "Individual",
        description: "LIF dividend fund",
        intentOfUse: "Retirement income with dividends",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: true,
        recipient: "Individual",
        intermediaryCode: "64738295",
        intermediaryAccountCode: "647382957",
        startDate: "07/28/2021",
        endDate: "",
        kycOnFileDate: "07/25/2021",
        kycAge: "1375 days Old",
        kycOriginalReceivedDate: "07/25/2021",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
      "OPEN-0123": {
        accountDesignation: "Joint",
        description: "Joint OPEN conservative income account",
        intentOfUse: "Joint conservative income",
        frozen: false,
        fullFreeze: false,
        groupAccount: false,
        groupAccountId: "",
        leveraged: false,
        loanNumber: "",
        lockedIn: false,
        recipient: "Individual",
        intermediaryCode: "53847296",
        intermediaryAccountCode: "538472968",
        startDate: "12/10/2023",
        endDate: "",
        kycOnFileDate: "12/05/2023",
        kycAge: "507 days Old",
        kycOriginalReceivedDate: "12/05/2023",
        revenueModel: "Commissions",
        feeForServiceAmount: "",
        feeForServiceStartDate: "",
        feeForServiceApproved: false,
      },
    };

    const existingDetails = planDetailsMap[planId];
    if (existingDetails) {
      return existingDetails;
    }
    
    // Generate unique dates for plans not in the map based on client ID and plan ID
    const uniqueDates = generateUniqueDates(id, planId);
    
    return {
      accountDesignation: "Client Name",
      description: "",
      intentOfUse: "",
      frozen: false,
      fullFreeze: false,
      groupAccount: false,
      groupAccountId: "",
      leveraged: false,
      loanNumber: "",
      lockedIn: false,
      recipient: "Individual",
      intermediaryCode: "",
      intermediaryAccountCode: planId,
      ...uniqueDates,
      endDate: "",
      revenueModel: "Commissions",
      feeForServiceAmount: "",
      feeForServiceStartDate: "",
      feeForServiceApproved: false,
    };
  };
  
  // Set default selected plan on mount or when client changes
  useEffect(() => {
    if (plansList.length > 0) {
      // Reset selected plan when client changes
      const firstPlanId = plansList[0].id;
      if (selectedPlanForDetails !== firstPlanId) {
        setSelectedPlanForDetails(firstPlanId);
      }
    }
  }, [id]);

  // Set owner name to client's name when client changes
  useEffect(() => {
    const client = CLIENTS.find((c) => c.id === id);
    if (client) {
      setOwnerName(client.name);
    }
  }, [id]);

  // Track previous client ID to detect changes
  const prevClientIdRef = useRef<string | undefined>(id);

  // Handle tab navigation when client changes based on lock state
  useEffect(() => {
    // Only act when client ID actually changes
    if (prevClientIdRef.current !== id) {
      prevClientIdRef.current = id;
      
      if (isPageLocked) {
        // When locked, keep the current tab (don't change it)
        // lockedTab already contains the current tab
      } else {
        // When unlocked, reset to summary when client changes
        setClientViewTab("summary");
      }
    }
  }, [id, isPageLocked]);

  // Update locked tab when tab changes while locked
  useEffect(() => {
    if (isPageLocked) {
      setLockedTab(clientViewTab);
    }
  }, [clientViewTab, isPageLocked]);

  // Initialize all plans as collapsed by default
  useEffect(() => {
    const currentClientData = getClientData(id);
    const planCount = Object.values(currentClientData.summaryData).length;
    const allAccountKeys = Array.from({ length: planCount }, (_, i) => `account${i + 1}`);
    setCollapsedAccounts(new Set(allAccountKeys));
  }, [id]);
  
  // Clear selected fund account if it doesn't belong to the selected plan
  useEffect(() => {
    if (selectedPlanForDetails && selectedFundAccount) {
      const planInvestments = getPlanInvestments(selectedPlanForDetails);
      if (!planInvestments.includes(selectedFundAccount)) {
        setSelectedFundAccount(null);
        setSelectedTransaction(null);
      }
    }
  }, [selectedPlanForDetails]);
  
  // Get selected plan data for details
  const selectedPlanData = plansList.find(p => p.id === selectedPlanForDetails) || (plansList.length > 0 ? plansList[0] : null);
  
  // Get plan-specific details - memoized to update when client or plan changes
  const basePlanDetails = useMemo(() => getPlanDetails(selectedPlanForDetails), [selectedPlanForDetails, id]);
  
  // Determine account designation based on plan category
  const getAccountDesignation = () => {
    if (!selectedPlanData) return "Client Name";
    const category = selectedPlanData.category || "";
    if (category.toLowerCase().includes("joint")) {
      return "Joint";
    } else if (category.toLowerCase().includes("individual")) {
      return "Individual";
    }
    return basePlanDetails.accountDesignation || "Client Name";
  };
  
  // Merge base plan details with dynamic account designation
  const planDetails = {
    ...basePlanDetails,
    accountDesignation: getAccountDesignation(),
  };
  
  // Get fund accounts for selected plan only
  const planInvestments = getPlanInvestments(selectedPlanForDetails);
  const filteredFundAccounts = selectedPlanForDetails 
    ? fundAccounts.filter(account => planInvestments.includes(account.id))
    : fundAccounts;
  
  // Get selected fund account data
  const selectedFundAccountData = fundAccounts.find(f => f.id === selectedFundAccount) || null;
  
  // Helper function to get fund account details by ID
  const getFundAccountById = (fundId: string) => {
    return fundAccounts.find(f => f.id === fundId);
  };

  // Generate unique calculator values based on client ID and fund account ID
  const getFundAccountCalculatorValues = (clientId: string | undefined, fundAccountId: string | null) => {
    if (!fundAccountId) {
      return {
        currentMarketValue: "$0.00",
        currentShareBalance: "0.0000",
        adjustedCostBase: "$0.00",
        rateOfReturn: "0.00000 %",
        historicalMarketValue: "$0.00",
        historicalShareBalance: "0.0000",
        historicalTargetDate: "12/19/2025",
        rateOfReturnStartDate: "12/19/2025",
        rateOfReturnEndDate: "12/19/2025",
      };
    }

    // Create a hash from client ID and fund account ID for consistent but unique values
    const clientHash = (clientId || "").split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const fundHash = fundAccountId.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hash = clientHash + fundHash;

    // Generate unique market value (between $50 and $50,000)
    const marketValueBase = 50 + (hash % 4950);
    const marketValueCents = (hash * 7) % 100;
    const currentMarketValue = `$${marketValueBase.toFixed(2)}`;

    // Generate unique share balance (between 0.1 and 1000)
    const shareBalanceBase = 0.1 + ((hash * 13) % 999.9);
    const currentShareBalance = shareBalanceBase.toFixed(4);

    // Generate adjusted cost base (slightly less than market value for gain)
    const costBaseMultiplier = 0.85 + ((hash * 11) % 15) / 100; // 0.85 to 0.99
    const adjustedCostBase = `$${(marketValueBase * costBaseMultiplier).toFixed(2)}`;

    // Generate rate of return (between -5% and 25%)
    const rateOfReturnValue = -5 + ((hash * 17) % 30);
    const rateOfReturn = `${rateOfReturnValue >= 0 ? '+' : ''}${rateOfReturnValue.toFixed(5)} %`;

    // Generate historical values (slightly different from current)
    const historicalMultiplier = 0.9 + ((hash * 19) % 20) / 100; // 0.9 to 1.09
    const historicalMarketValue = `$${(marketValueBase * historicalMultiplier).toFixed(2)}`;
    const historicalShareBalance = (shareBalanceBase * historicalMultiplier).toFixed(4);

    // Generate unique dates based on hash
    const year = 2020 + ((hash * 7) % 6); // 2020-2025
    const month = 1 + ((hash * 11) % 12); // 1-12
    const day = 1 + ((hash * 13) % 28); // 1-28
    const historicalTargetDate = `${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}/${year}`;

    // Rate of return dates (start date earlier than end date)
    const startYear = 2019 + ((hash * 5) % 4); // 2019-2022
    const startMonth = 1 + ((hash * 3) % 12);
    const startDay = 1 + ((hash * 7) % 28);
    const rateOfReturnStartDate = `${String(startMonth).padStart(2, '0')}/${String(startDay).padStart(2, '0')}/${startYear}`;
    
    const endYear = startYear + 1 + ((hash * 2) % 3); // 1-3 years after start
    const endMonth = 1 + ((hash * 5) % 12);
    const endDay = 1 + ((hash * 9) % 28);
    const rateOfReturnEndDate = `${String(endMonth).padStart(2, '0')}/${String(endDay).padStart(2, '0')}/${endYear}`;

    return {
      currentMarketValue,
      currentShareBalance,
      adjustedCostBase,
      rateOfReturn,
      historicalMarketValue,
      historicalShareBalance,
      historicalTargetDate,
      rateOfReturnStartDate,
      rateOfReturnEndDate,
    };
  };

  // Get calculator values for selected fund account
  const calculatorValues = useMemo(() => 
    getFundAccountCalculatorValues(id, selectedFundAccount), 
    [id, selectedFundAccount]
  );
  
  // Helper function to calculate total market value for a plan
  const getPlanTotalValue = (planInvestments: string[]) => {
    return planInvestments.reduce((total, fundId) => {
      const fund = getFundAccountById(fundId);
      if (fund && fund.marketValue) {
        const value = parseFloat(fund.marketValue.replace(/[^0-9.]/g, ''));
        return total + value;
      }
      return total;
    }, 0);
  };
  
  // Transaction data map for each fund account
  const transactionsMap: Record<string, Array<{
    id: string;
    date: string;
    grossAmount: string;
    netAmount: string;
    price: string;
    status: string;
    type: string;
    shareBalance: string;
  }>> = {
    "MFC-724": [
      { id: "1", date: "04/25/2025", grossAmount: "$0.82", netAmount: "$0.82", price: "$12.5499", status: "Valid", type: "Reinvested Distribution", shareBalance: "11.8280" },
    { id: "2", date: "02/21/2025", grossAmount: "$25.00", netAmount: "$25.00", price: "$12.5499", status: "Valid", type: "Purchase PAC", shareBalance: "10.8280" },
    { id: "3", date: "01/21/2025", grossAmount: "$25.00", netAmount: "$25.00", price: "$12.5499", status: "Valid", type: "Purchase PAC", shareBalance: "8.8280" },
    { id: "4", date: "12/20/2024", grossAmount: "$0.69", netAmount: "$0.69", price: "$12.5499", status: "Valid", type: "Reinvested Distribution", shareBalance: "6.8280" },
    { id: "5", date: "11/20/2024", grossAmount: "$25.00", netAmount: "$25.00", price: "$12.5499", status: "Valid", type: "Purchase PAC", shareBalance: "4.8280" },
    { id: "6", date: "10/20/2024", grossAmount: "$0.56", netAmount: "$0.56", price: "$12.5499", status: "Valid", type: "Reinvested Distribution", shareBalance: "2.8280" },
    { id: "7", date: "09/20/2024", grossAmount: "$0.42", netAmount: "$0.42", price: "$12.5499", status: "Valid", type: "Reinvested Distribution", shareBalance: "0.8280" },
    { id: "8", date: "08/20/2024", grossAmount: "$0.27", netAmount: "$0.27", price: "$12.5499", status: "Valid", type: "Reinvested Distribution", shareBalance: "0.0000" },
    ],
    "MFC-2238": [
      { id: "1", date: "04/22/2025", grossAmount: "$1.15", netAmount: "$1.15", price: "$12.5499", status: "Valid", type: "Reinvested Distribution", shareBalance: "15.2340" },
      { id: "2", date: "03/15/2025", grossAmount: "$50.00", netAmount: "$50.00", price: "$12.5499", status: "Valid", type: "Purchase PAC", shareBalance: "14.2340" },
      { id: "3", date: "02/15/2025", grossAmount: "$50.00", netAmount: "$50.00", price: "$12.5499", status: "Valid", type: "Purchase PAC", shareBalance: "10.2340" },
      { id: "4", date: "01/15/2025", grossAmount: "$0.95", netAmount: "$0.95", price: "$12.5499", status: "Valid", type: "Reinvested Distribution", shareBalance: "6.2340" },
      { id: "5", date: "12/15/2024", grossAmount: "$50.00", netAmount: "$50.00", price: "$12.5499", status: "Valid", type: "Purchase PAC", shareBalance: "5.2340" },
      { id: "6", date: "11/15/2024", grossAmount: "$0.78", netAmount: "$0.78", price: "$12.5499", status: "Valid", type: "Reinvested Distribution", shareBalance: "1.2340" },
    ],
    "TD-1234": [
      { id: "1", date: "04/28/2025", grossAmount: "$2.45", netAmount: "$2.45", price: "$28.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "3245.6780" },
      { id: "2", date: "03/25/2025", grossAmount: "$100.00", netAmount: "$100.00", price: "$28.5432", status: "Valid", type: "Purchase PAC", shareBalance: "3241.6780" },
      { id: "3", date: "02/25/2025", grossAmount: "$100.00", netAmount: "$100.00", price: "$28.5432", status: "Valid", type: "Purchase PAC", shareBalance: "3197.6780" },
      { id: "4", date: "01/25/2025", grossAmount: "$2.12", netAmount: "$2.12", price: "$28.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "3161.6780" },
      { id: "5", date: "12/25/2024", grossAmount: "$100.00", netAmount: "$100.00", price: "$28.5432", status: "Valid", type: "Purchase PAC", shareBalance: "3153.6780" },
      { id: "6", date: "11/25/2024", grossAmount: "$1.89", netAmount: "$1.89", price: "$28.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "3117.6780" },
      { id: "7", date: "10/25/2024", grossAmount: "$1.65", netAmount: "$1.65", price: "$28.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "3081.6780" },
    ],
    "RBC-5678": [
      { id: "1", date: "04/27/2025", grossAmount: "$1.32", netAmount: "$1.32", price: "$15.2345", status: "Valid", type: "Reinvested Distribution", shareBalance: "2987.6540" },
      { id: "2", date: "03/20/2025", grossAmount: "$75.00", netAmount: "$75.00", price: "$15.2345", status: "Valid", type: "Purchase PAC", shareBalance: "2982.6540" },
      { id: "3", date: "02/20/2025", grossAmount: "$75.00", netAmount: "$75.00", price: "$15.2345", status: "Valid", type: "Purchase PAC", shareBalance: "2932.6540" },
      { id: "4", date: "01/20/2025", grossAmount: "$1.18", netAmount: "$1.18", price: "$15.2345", status: "Valid", type: "Reinvested Distribution", shareBalance: "2882.6540" },
      { id: "5", date: "12/20/2024", grossAmount: "$75.00", netAmount: "$75.00", price: "$15.2345", status: "Valid", type: "Purchase PAC", shareBalance: "2875.6540" },
      { id: "6", date: "11/20/2024", grossAmount: "$1.05", netAmount: "$1.05", price: "$15.2345", status: "Valid", type: "Reinvested Distribution", shareBalance: "2825.6540" },
    ],
    "BMO-9012": [
      { id: "1", date: "04/26/2025", grossAmount: "$1.78", netAmount: "$1.78", price: "$22.6789", status: "Valid", type: "Reinvested Distribution", shareBalance: "1434.5670" },
      { id: "2", date: "03/18/2025", grossAmount: "$150.00", netAmount: "$150.00", price: "$22.6789", status: "Valid", type: "Purchase PAC", shareBalance: "1427.5670" },
      { id: "3", date: "02/18/2025", grossAmount: "$150.00", netAmount: "$150.00", price: "$22.6789", status: "Valid", type: "Purchase PAC", shareBalance: "1360.5670" },
      { id: "4", date: "01/18/2025", grossAmount: "$1.54", netAmount: "$1.54", price: "$22.6789", status: "Valid", type: "Reinvested Distribution", shareBalance: "1293.5670" },
      { id: "5", date: "12/18/2024", grossAmount: "$150.00", netAmount: "$150.00", price: "$22.6789", status: "Valid", type: "Purchase PAC", shareBalance: "1286.5670" },
      { id: "6", date: "11/18/2024", grossAmount: "$1.31", netAmount: "$1.31", price: "$22.6789", status: "Valid", type: "Reinvested Distribution", shareBalance: "1219.5670" },
    ],
    "CIBC-2468": [
      { id: "1", date: "04/24/2025", grossAmount: "$1.92", netAmount: "$1.92", price: "$19.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "3416.7890" },
      { id: "2", date: "03/22/2025", grossAmount: "$200.00", netAmount: "$200.00", price: "$19.8765", status: "Valid", type: "Purchase PAC", shareBalance: "3406.7890" },
      { id: "3", date: "02/22/2025", grossAmount: "$200.00", netAmount: "$200.00", price: "$19.8765", status: "Valid", type: "Purchase PAC", shareBalance: "3306.7890" },
      { id: "4", date: "01/22/2025", grossAmount: "$1.67", netAmount: "$1.67", price: "$19.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "3206.7890" },
      { id: "5", date: "12/22/2024", grossAmount: "$200.00", netAmount: "$200.00", price: "$19.8765", status: "Valid", type: "Purchase PAC", shareBalance: "3196.7890" },
      { id: "6", date: "11/22/2024", grossAmount: "$1.42", netAmount: "$1.42", price: "$19.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "3096.7890" },
      { id: "7", date: "10/22/2024", grossAmount: "$1.18", netAmount: "$1.18", price: "$19.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "2996.7890" },
    ],
    "FID-1357": [
      { id: "1", date: "04/23/2025", grossAmount: "$2.18", netAmount: "$2.18", price: "$24.5678", status: "Valid", type: "Reinvested Distribution", shareBalance: "1836.4520" },
      { id: "2", date: "03/19/2025", grossAmount: "$125.00", netAmount: "$125.00", price: "$24.5678", status: "Valid", type: "Purchase PAC", shareBalance: "1831.4520" },
      { id: "3", date: "02/19/2025", grossAmount: "$125.00", netAmount: "$125.00", price: "$24.5678", status: "Valid", type: "Purchase PAC", shareBalance: "1781.4520" },
      { id: "4", date: "01/19/2025", grossAmount: "$1.89", netAmount: "$1.89", price: "$24.5678", status: "Valid", type: "Reinvested Distribution", shareBalance: "1731.4520" },
      { id: "5", date: "12/19/2024", grossAmount: "$125.00", netAmount: "$125.00", price: "$24.5678", status: "Valid", type: "Purchase PAC", shareBalance: "1726.4520" },
      { id: "6", date: "11/19/2024", grossAmount: "$1.61", netAmount: "$1.61", price: "$24.5678", status: "Valid", type: "Reinvested Distribution", shareBalance: "1676.4520" },
    ],
    "SCOTIA-9876": [
      { id: "1", date: "04/21/2025", grossAmount: "$0.95", netAmount: "$0.95", price: "$11.2345", status: "Valid", type: "Reinvested Distribution", shareBalance: "1643.7890" },
      { id: "2", date: "03/17/2025", grossAmount: "$60.00", netAmount: "$60.00", price: "$11.2345", status: "Valid", type: "Purchase PAC", shareBalance: "1638.7890" },
      { id: "3", date: "02/17/2025", grossAmount: "$60.00", netAmount: "$60.00", price: "$11.2345", status: "Valid", type: "Purchase PAC", shareBalance: "1583.7890" },
      { id: "4", date: "01/17/2025", grossAmount: "$0.82", netAmount: "$0.82", price: "$11.2345", status: "Valid", type: "Reinvested Distribution", shareBalance: "1528.7890" },
      { id: "5", date: "12/17/2024", grossAmount: "$60.00", netAmount: "$60.00", price: "$11.2345", status: "Valid", type: "Purchase PAC", shareBalance: "1521.7890" },
      { id: "6", date: "11/17/2024", grossAmount: "$0.69", netAmount: "$0.69", price: "$11.2345", status: "Valid", type: "Reinvested Distribution", shareBalance: "1466.7890" },
    ],
    "AGF-185": [
      { id: "1", date: "04/20/2025", grossAmount: "$0.00", netAmount: "$0.00", price: "$0.00", status: "Valid", type: "Reinvested Distribution", shareBalance: "0.0000" },
      { id: "2", date: "03/20/2025", grossAmount: "$0.00", netAmount: "$0.00", price: "$0.00", status: "Valid", type: "Initial Purchase", shareBalance: "0.0000" },
    ],
    "TD-0000": [
      { id: "1", date: "04/29/2025", grossAmount: "$3.25", netAmount: "$3.25", price: "$19.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "6768.9012" },
      { id: "2", date: "03/28/2025", grossAmount: "$250.00", netAmount: "$250.00", price: "$19.8765", status: "Valid", type: "Purchase PAC", shareBalance: "6753.9012" },
      { id: "3", date: "02/28/2025", grossAmount: "$250.00", netAmount: "$250.00", price: "$19.8765", status: "Valid", type: "Purchase PAC", shareBalance: "6541.9012" },
      { id: "4", date: "01/28/2025", grossAmount: "$2.82", netAmount: "$2.82", price: "$19.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "6329.9012" },
      { id: "5", date: "12/28/2024", grossAmount: "$250.00", netAmount: "$250.00", price: "$19.8765", status: "Valid", type: "Purchase PAC", shareBalance: "6314.9012" },
      { id: "6", date: "11/28/2024", grossAmount: "$2.39", netAmount: "$2.39", price: "$19.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "6102.9012" },
      { id: "7", date: "10/28/2024", grossAmount: "$1.96", netAmount: "$1.96", price: "$19.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "5889.9012" },
    ],
    "RBC-1111": [
      { id: "1", date: "04/30/2025", grossAmount: "$1.45", netAmount: "$1.45", price: "$13.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "5005.6789" },
      { id: "2", date: "03/30/2025", grossAmount: "$180.00", netAmount: "$180.00", price: "$13.5432", status: "Valid", type: "Purchase PAC", shareBalance: "4992.6789" },
      { id: "3", date: "02/28/2025", grossAmount: "$180.00", netAmount: "$180.00", price: "$13.5432", status: "Valid", type: "Purchase PAC", shareBalance: "4857.6789" },
      { id: "4", date: "01/30/2025", grossAmount: "$1.26", netAmount: "$1.26", price: "$13.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "4722.6789" },
      { id: "5", date: "12/30/2024", grossAmount: "$180.00", netAmount: "$180.00", price: "$13.5432", status: "Valid", type: "Purchase PAC", shareBalance: "4713.6789" },
      { id: "6", date: "11/30/2024", grossAmount: "$1.08", netAmount: "$1.08", price: "$13.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "4578.6789" },
    ],
    "MANULIFE-1111": [
      { id: "1", date: "04/25/2025", grossAmount: "$2.85", netAmount: "$2.85", price: "$18.7654", status: "Valid", type: "Reinvested Distribution", shareBalance: "4762.1234" },
      { id: "2", date: "03/10/2025", grossAmount: "$150.00", netAmount: "$150.00", price: "$18.7654", status: "Valid", type: "Purchase PAC", shareBalance: "4760.1234" },
      { id: "3", date: "02/10/2025", grossAmount: "$150.00", netAmount: "$150.00", price: "$18.7654", status: "Valid", type: "Purchase PAC", shareBalance: "4678.1234" },
      { id: "4", date: "01/10/2025", grossAmount: "$2.48", netAmount: "$2.48", price: "$18.7654", status: "Valid", type: "Reinvested Distribution", shareBalance: "4596.1234" },
      { id: "5", date: "12/10/2024", grossAmount: "$150.00", netAmount: "$150.00", price: "$18.7654", status: "Valid", type: "Purchase PAC", shareBalance: "4591.1234" },
      { id: "6", date: "11/10/2024", grossAmount: "$2.12", netAmount: "$2.12", price: "$18.7654", status: "Valid", type: "Reinvested Distribution", shareBalance: "4511.1234" },
      { id: "7", date: "10/10/2024", grossAmount: "$150.00", netAmount: "$150.00", price: "$18.7654", status: "Valid", type: "Purchase PAC", shareBalance: "4498.1234" },
    ],
    "SUNLIFE-2222": [
      { id: "1", date: "04/22/2025", grossAmount: "$3.15", netAmount: "$3.15", price: "$16.4321", status: "Valid", type: "Reinvested Distribution", shareBalance: "9543.2567" },
      { id: "2", date: "03/22/2025", grossAmount: "$200.00", netAmount: "$200.00", price: "$16.4321", status: "Valid", type: "Purchase PAC", shareBalance: "9534.2567" },
      { id: "3", date: "02/22/2025", grossAmount: "$200.00", netAmount: "$200.00", price: "$16.4321", status: "Valid", type: "Purchase PAC", shareBalance: "9412.2567" },
      { id: "4", date: "01/22/2025", grossAmount: "$2.73", netAmount: "$2.73", price: "$16.4321", status: "Valid", type: "Reinvested Distribution", shareBalance: "9290.2567" },
      { id: "5", date: "12/22/2024", grossAmount: "$200.00", netAmount: "$200.00", price: "$16.4321", status: "Valid", type: "Purchase PAC", shareBalance: "9276.2567" },
      { id: "6", date: "11/22/2024", grossAmount: "$2.31", netAmount: "$2.31", price: "$16.4321", status: "Valid", type: "Reinvested Distribution", shareBalance: "9154.2567" },
      { id: "7", date: "10/22/2024", grossAmount: "$200.00", netAmount: "$200.00", price: "$16.4321", status: "Valid", type: "Purchase PAC", shareBalance: "9140.2567" },
    ],
    "IG-3333": [
      { id: "1", date: "04/15/2025", grossAmount: "$1.92", netAmount: "$1.92", price: "$21.9876", status: "Valid", type: "Reinvested Distribution", shareBalance: "2405.6123" },
      { id: "2", date: "03/15/2025", grossAmount: "$100.00", netAmount: "$100.00", price: "$21.9876", status: "Valid", type: "Purchase PAC", shareBalance: "2401.6123" },
      { id: "3", date: "02/15/2025", grossAmount: "$100.00", netAmount: "$100.00", price: "$21.9876", status: "Valid", type: "Purchase PAC", shareBalance: "2356.6123" },
      { id: "4", date: "01/15/2025", grossAmount: "$1.67", netAmount: "$1.67", price: "$21.9876", status: "Valid", type: "Reinvested Distribution", shareBalance: "2311.6123" },
      { id: "5", date: "12/15/2024", grossAmount: "$100.00", netAmount: "$100.00", price: "$21.9876", status: "Valid", type: "Purchase PAC", shareBalance: "2304.6123" },
      { id: "6", date: "11/15/2024", grossAmount: "$1.42", netAmount: "$1.42", price: "$21.9876", status: "Valid", type: "Reinvested Distribution", shareBalance: "2259.6123" },
    ],
    "MACKENZIE-4444": [
      { id: "1", date: "04/20/2025", grossAmount: "$3.45", netAmount: "$3.45", price: "$19.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "4001.2345" },
      { id: "2", date: "03/20/2025", grossAmount: "$175.00", netAmount: "$175.00", price: "$19.5432", status: "Valid", type: "Purchase PAC", shareBalance: "3983.2345" },
      { id: "3", date: "02/20/2025", grossAmount: "$175.00", netAmount: "$175.00", price: "$19.5432", status: "Valid", type: "Purchase PAC", shareBalance: "3891.2345" },
      { id: "4", date: "01/20/2025", grossAmount: "$2.99", netAmount: "$2.99", price: "$19.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "3799.2345" },
      { id: "5", date: "12/20/2024", grossAmount: "$175.00", netAmount: "$175.00", price: "$19.5432", status: "Valid", type: "Purchase PAC", shareBalance: "3784.2345" },
      { id: "6", date: "11/20/2024", grossAmount: "$2.53", netAmount: "$2.53", price: "$19.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "3692.2345" },
      { id: "7", date: "10/20/2024", grossAmount: "$175.00", netAmount: "$175.00", price: "$19.5432", status: "Valid", type: "Purchase PAC", shareBalance: "3677.2345" },
    ],
    "AGF-5555": [
      { id: "1", date: "04/18/2025", grossAmount: "$1.25", netAmount: "$1.25", price: "$12.3456", status: "Valid", type: "Reinvested Distribution", shareBalance: "2801.2345" },
      { id: "2", date: "03/18/2025", grossAmount: "$85.00", netAmount: "$85.00", price: "$12.3456", status: "Valid", type: "Purchase PAC", shareBalance: "2794.2345" },
      { id: "3", date: "02/18/2025", grossAmount: "$85.00", netAmount: "$85.00", price: "$12.3456", status: "Valid", type: "Purchase PAC", shareBalance: "2726.2345" },
      { id: "4", date: "01/18/2025", grossAmount: "$1.08", netAmount: "$1.08", price: "$12.3456", status: "Valid", type: "Reinvested Distribution", shareBalance: "2658.2345" },
      { id: "5", date: "12/18/2024", grossAmount: "$85.00", netAmount: "$85.00", price: "$12.3456", status: "Valid", type: "Purchase PAC", shareBalance: "2650.2345" },
      { id: "6", date: "11/18/2024", grossAmount: "$0.91", netAmount: "$0.91", price: "$12.3456", status: "Valid", type: "Reinvested Distribution", shareBalance: "2582.2345" },
    ],
    "TD-6666": [
      { id: "1", date: "04/05/2025", grossAmount: "$4.25", netAmount: "$4.25", price: "$35.6789", status: "Valid", type: "Reinvested Distribution", shareBalance: "6578.9012" },
      { id: "2", date: "03/05/2025", grossAmount: "$300.00", netAmount: "$300.00", price: "$35.6789", status: "Valid", type: "Purchase PAC", shareBalance: "6565.9012" },
      { id: "3", date: "02/05/2025", grossAmount: "$300.00", netAmount: "$300.00", price: "$35.6789", status: "Valid", type: "Purchase PAC", shareBalance: "6476.9012" },
      { id: "4", date: "01/05/2025", grossAmount: "$3.68", netAmount: "$3.68", price: "$35.6789", status: "Valid", type: "Reinvested Distribution", shareBalance: "6387.9012" },
      { id: "5", date: "12/05/2024", grossAmount: "$300.00", netAmount: "$300.00", price: "$35.6789", status: "Valid", type: "Purchase PAC", shareBalance: "6377.9012" },
      { id: "6", date: "11/05/2024", grossAmount: "$3.11", netAmount: "$3.11", price: "$35.6789", status: "Valid", type: "Reinvested Distribution", shareBalance: "6288.9012" },
      { id: "7", date: "10/05/2024", grossAmount: "$300.00", netAmount: "$300.00", price: "$35.6789", status: "Valid", type: "Purchase PAC", shareBalance: "6278.9012" },
    ],
    "RBC-7777": [
      { id: "1", date: "04/24/2025", grossAmount: "$3.25", netAmount: "$3.25", price: "$17.8901", status: "Valid", type: "Reinvested Distribution", shareBalance: "8145.6789" },
      { id: "2", date: "03/18/2025", grossAmount: "$225.00", netAmount: "$225.00", price: "$17.8901", status: "Valid", type: "Purchase PAC", shareBalance: "8132.6789" },
      { id: "3", date: "02/18/2025", grossAmount: "$225.00", netAmount: "$225.00", price: "$17.8901", status: "Valid", type: "Purchase PAC", shareBalance: "7999.6789" },
      { id: "4", date: "01/18/2025", grossAmount: "$2.82", netAmount: "$2.82", price: "$17.8901", status: "Valid", type: "Reinvested Distribution", shareBalance: "7866.6789" },
      { id: "5", date: "12/18/2024", grossAmount: "$225.00", netAmount: "$225.00", price: "$17.8901", status: "Valid", type: "Purchase PAC", shareBalance: "7850.6789" },
      { id: "6", date: "11/18/2024", grossAmount: "$2.39", netAmount: "$2.39", price: "$17.8901", status: "Valid", type: "Reinvested Distribution", shareBalance: "7717.6789" },
    ],
    "BMO-8888": [
      { id: "1", date: "04/19/2025", grossAmount: "$2.15", netAmount: "$2.15", price: "$13.4567", status: "Valid", type: "Reinvested Distribution", shareBalance: "7312.3456" },
      { id: "2", date: "03/12/2025", grossAmount: "$180.00", netAmount: "$180.00", price: "$13.4567", status: "Valid", type: "Purchase PAC", shareBalance: "7298.3456" },
      { id: "3", date: "02/12/2025", grossAmount: "$180.00", netAmount: "$180.00", price: "$13.4567", status: "Valid", type: "Purchase PAC", shareBalance: "7164.3456" },
      { id: "4", date: "01/12/2025", grossAmount: "$1.87", netAmount: "$1.87", price: "$13.4567", status: "Valid", type: "Reinvested Distribution", shareBalance: "7030.3456" },
      { id: "5", date: "12/12/2024", grossAmount: "$180.00", netAmount: "$180.00", price: "$13.4567", status: "Valid", type: "Purchase PAC", shareBalance: "7016.3456" },
      { id: "6", date: "11/12/2024", grossAmount: "$1.59", netAmount: "$1.59", price: "$13.4567", status: "Valid", type: "Reinvested Distribution", shareBalance: "6882.3456" },
    ],
    "CIBC-9999": [
      { id: "1", date: "04/14/2025", grossAmount: "$4.15", netAmount: "$4.15", price: "$27.1234", status: "Valid", type: "Reinvested Distribution", shareBalance: "6189.0123" },
      { id: "2", date: "03/14/2025", grossAmount: "$275.00", netAmount: "$275.00", price: "$27.1234", status: "Valid", type: "Purchase PAC", shareBalance: "6174.0123" },
      { id: "3", date: "02/14/2025", grossAmount: "$275.00", netAmount: "$275.00", price: "$27.1234", status: "Valid", type: "Purchase PAC", shareBalance: "6073.0123" },
      { id: "4", date: "01/14/2025", grossAmount: "$3.60", netAmount: "$3.60", price: "$27.1234", status: "Valid", type: "Reinvested Distribution", shareBalance: "5972.0123" },
      { id: "5", date: "12/14/2024", grossAmount: "$275.00", netAmount: "$275.00", price: "$27.1234", status: "Valid", type: "Purchase PAC", shareBalance: "5957.0123" },
      { id: "6", date: "11/14/2024", grossAmount: "$3.05", netAmount: "$3.05", price: "$27.1234", status: "Valid", type: "Reinvested Distribution", shareBalance: "5856.0123" },
      { id: "7", date: "10/14/2024", grossAmount: "$275.00", netAmount: "$275.00", price: "$27.1234", status: "Valid", type: "Purchase PAC", shareBalance: "5841.0123" },
    ],
    "FID-0000": [
      { id: "1", date: "04/25/2025", grossAmount: "$1.05", netAmount: "$1.05", price: "$10.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "3976.5432" },
      { id: "2", date: "03/25/2025", grossAmount: "$90.00", netAmount: "$90.00", price: "$10.8765", status: "Valid", type: "Purchase PAC", shareBalance: "3968.5432" },
      { id: "3", date: "02/25/2025", grossAmount: "$90.00", netAmount: "$90.00", price: "$10.8765", status: "Valid", type: "Purchase PAC", shareBalance: "3884.5432" },
      { id: "4", date: "01/25/2025", grossAmount: "$0.91", netAmount: "$0.91", price: "$10.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "3800.5432" },
      { id: "5", date: "12/25/2024", grossAmount: "$90.00", netAmount: "$90.00", price: "$10.8765", status: "Valid", type: "Purchase PAC", shareBalance: "3792.5432" },
      { id: "6", date: "11/25/2024", grossAmount: "$0.77", netAmount: "$0.77", price: "$10.8765", status: "Valid", type: "Reinvested Distribution", shareBalance: "3708.5432" },
    ],
    "SCOTIA-1111": [
      { id: "1", date: "04/08/2025", grossAmount: "$3.85", netAmount: "$3.85", price: "$20.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "4354.3210" },
      { id: "2", date: "03/08/2025", grossAmount: "$200.00", netAmount: "$200.00", price: "$20.5432", status: "Valid", type: "Purchase PAC", shareBalance: "4344.3210" },
      { id: "3", date: "02/08/2025", grossAmount: "$200.00", netAmount: "$200.00", price: "$20.5432", status: "Valid", type: "Purchase PAC", shareBalance: "4244.3210" },
      { id: "4", date: "01/08/2025", grossAmount: "$3.34", netAmount: "$3.34", price: "$20.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "4144.3210" },
      { id: "5", date: "12/08/2024", grossAmount: "$200.00", netAmount: "$200.00", price: "$20.5432", status: "Valid", type: "Purchase PAC", shareBalance: "4131.3210" },
      { id: "6", date: "11/08/2024", grossAmount: "$2.83", netAmount: "$2.83", price: "$20.5432", status: "Valid", type: "Reinvested Distribution", shareBalance: "4031.3210" },
    ],
    "MANULIFE-2222": [
      { id: "1", date: "04/15/2025", grossAmount: "$1.25", netAmount: "$1.25", price: "$14.3210", status: "Valid", type: "Reinvested Distribution", shareBalance: "1978.9012" },
      { id: "2", date: "03/15/2025", grossAmount: "$70.00", netAmount: "$70.00", price: "$14.3210", status: "Valid", type: "Purchase PAC", shareBalance: "1974.9012" },
      { id: "3", date: "02/15/2025", grossAmount: "$70.00", netAmount: "$70.00", price: "$14.3210", status: "Valid", type: "Purchase PAC", shareBalance: "1929.9012" },
      { id: "4", date: "01/15/2025", grossAmount: "$1.08", netAmount: "$1.08", price: "$14.3210", status: "Valid", type: "Reinvested Distribution", shareBalance: "1884.9012" },
      { id: "5", date: "12/15/2024", grossAmount: "$70.00", netAmount: "$70.00", price: "$14.3210", status: "Valid", type: "Purchase PAC", shareBalance: "1877.9012" },
      { id: "6", date: "11/15/2024", grossAmount: "$0.91", netAmount: "$0.91", price: "$14.3210", status: "Valid", type: "Reinvested Distribution", shareBalance: "1832.9012" },
    ],
    "SUNLIFE-3333": [
      { id: "1", date: "04/22/2025", grossAmount: "$4.85", netAmount: "$4.85", price: "$32.1098", status: "Valid", type: "Reinvested Distribution", shareBalance: "6198.7654" },
      { id: "2", date: "03/22/2025", grossAmount: "$350.00", netAmount: "$350.00", price: "$32.1098", status: "Valid", type: "Purchase PAC", shareBalance: "6184.7654" },
      { id: "3", date: "02/22/2025", grossAmount: "$350.00", netAmount: "$350.00", price: "$32.1098", status: "Valid", type: "Purchase PAC", shareBalance: "6073.7654" },
      { id: "4", date: "01/22/2025", grossAmount: "$4.21", netAmount: "$4.21", price: "$32.1098", status: "Valid", type: "Reinvested Distribution", shareBalance: "5962.7654" },
      { id: "5", date: "12/22/2024", grossAmount: "$350.00", netAmount: "$350.00", price: "$32.1098", status: "Valid", type: "Purchase PAC", shareBalance: "5948.7654" },
      { id: "6", date: "11/22/2024", grossAmount: "$3.57", netAmount: "$3.57", price: "$32.1098", status: "Valid", type: "Reinvested Distribution", shareBalance: "5837.7654" },
      { id: "7", date: "10/22/2024", grossAmount: "$350.00", netAmount: "$350.00", price: "$32.1098", status: "Valid", type: "Purchase PAC", shareBalance: "5823.7654" },
    ],
    "IG-4444": [
      { id: "1", date: "04/08/2025", grossAmount: "$2.25", netAmount: "$2.25", price: "$18.7654", status: "Valid", type: "Reinvested Distribution", shareBalance: "3621.0876" },
      { id: "2", date: "03/08/2025", grossAmount: "$125.00", netAmount: "$125.00", price: "$18.7654", status: "Valid", type: "Purchase PAC", shareBalance: "3614.0876" },
      { id: "3", date: "02/08/2025", grossAmount: "$125.00", netAmount: "$125.00", price: "$18.7654", status: "Valid", type: "Purchase PAC", shareBalance: "3548.0876" },
      { id: "4", date: "01/08/2025", grossAmount: "$1.95", netAmount: "$1.95", price: "$18.7654", status: "Valid", type: "Reinvested Distribution", shareBalance: "3482.0876" },
      { id: "5", date: "12/08/2024", grossAmount: "$125.00", netAmount: "$125.00", price: "$18.7654", status: "Valid", type: "Purchase PAC", shareBalance: "3475.0876" },
      { id: "6", date: "11/08/2024", grossAmount: "$1.65", netAmount: "$1.65", price: "$18.7654", status: "Valid", type: "Reinvested Distribution", shareBalance: "3409.0876" },
    ],
  };

  // Get transactions for selected fund account
  const transactions = selectedFundAccount && transactionsMap[selectedFundAccount] ? transactionsMap[selectedFundAccount] : [];
  
  // Get selected transaction data
  const selectedTransactionData = transactions.find(t => t.id === selectedTransaction) || null;

  // Find the client by ID
  const client = CLIENTS.find((c) => c.id === id);

  if (!client) {
    return (
      <PageLayout title="">
        <div className="text-center py-12">
          <p className="text-gray-500">Client not found</p>
          <Button onClick={() => navigate("/clients")} className="mt-4">
            Back to Clients
          </Button>
        </div>
      </PageLayout>
    );
  }

  // Calculate total assets from plans
  const calculateTotalAssets = () => {
    const total = plansList.reduce((sum, plan) => {
      const value = parseFloat(plan.marketValue.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(value) ? 0 : value);
    }, 0);
    return `$${total.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Client-specific contact information mapping
  const getClientContactInfo = (clientId: string | undefined) => {
    const contactInfoMap: Record<string, {
      residentialAddress: { line1: string; line2: string; line3: string };
      mailingAddress: { line1: string; line2: string; line3: string };
      contact: { home: string; cell: string; email: string };
    }> = {
      "CL001": {
        residentialAddress: {
          line1: "456 Oak Avenue",
          line2: "Unit 12B",
          line3: "TORONTO ON M4B 1K3",
        },
    mailingAddress: {
          line1: "P.O. Box 1234",
          line2: "Mail Service Centre",
          line3: "TORONTO ON M5H 2N2",
        },
        contact: {
          home: "416-555-0123",
          cell: "416-555-0124",
          email: "john.smith@email.com",
        },
      },
      "CL002": {
        residentialAddress: {
          line1: "789 Maple Drive",
          line2: "Apt 5C",
          line3: "LOS ANGELES CA 90001",
        },
        mailingAddress: {
          line1: "P.O. Box 5678",
          line2: "Business Mail Services",
          line3: "LOS ANGELES CA 90002",
        },
        contact: {
          home: "323-555-0234",
          cell: "323-555-0235",
          email: "sarah.j@company.com",
        },
      },
      "CL005": {
        residentialAddress: {
          line1: "321 Elm Street",
          line2: "Floor 3",
          line3: "BOSTON MA 02101",
        },
        mailingAddress: {
          line1: "P.O. Box 9012",
          line2: "Mail Processing Center",
          line3: "BOSTON MA 02102",
        },
        contact: {
          home: "617-555-0345",
          cell: "617-555-0346",
          email: "r.wilson@capital.com",
        },
      },
      "CL006": {
        residentialAddress: {
          line1: "654 Pine Boulevard",
          line2: "Suite 100",
          line3: "TORONTO ON M5J 2N8",
        },
        mailingAddress: {
          line1: "P.O. Box 3456",
          line2: "Corporate Mail Services",
          line3: "TORONTO ON M5K 1A1",
        },
        contact: {
          home: "416-555-0456",
          cell: "416-555-0457",
          email: "elton.andrews@email.com",
        },
      },
      "CL007": {
        residentialAddress: {
          line1: "987 Cedar Lane",
          line2: "Unit 8A",
          line3: "VANCOUVER BC V6B 1A1",
        },
        mailingAddress: {
          line1: "P.O. Box 7890",
          line2: "Pacific Mail Centre",
          line3: "VANCOUVER BC V6C 1B2",
        },
        contact: {
          home: "604-555-0567",
          cell: "604-555-0568",
          email: "francoise.andrews@email.com",
        },
      },
      "CL008": {
        residentialAddress: {
          line1: "147 Birch Road",
          line2: "Apt 22",
          line3: "MONTREAL QC H3A 0G4",
        },
        mailingAddress: {
          line1: "P.O. Box 2345",
          line2: "Quebec Mail Services",
          line3: "MONTREAL QC H3B 1H5",
        },
        contact: {
          home: "514-555-0678",
          cell: "514-555-0679",
          email: "amy.armstrong@email.com",
        },
      },
      "CL009": {
        residentialAddress: {
          line1: "258 Spruce Court",
          line2: "Suite 450",
          line3: "SEATTLE WA 98101",
        },
        mailingAddress: {
          line1: "P.O. Box 6789",
          line2: "Northwest Mail Hub",
          line3: "SEATTLE WA 98102",
        },
        contact: {
          home: "206-555-0789",
          cell: "206-555-0790",
          email: "david.thompson@finance.com",
        },
      },
      "CL011": {
        residentialAddress: {
          line1: "369 Willow Way",
          line2: "Floor 2",
          line3: "DENVER CO 80202",
        },
        mailingAddress: {
          line1: "P.O. Box 1122",
          line2: "Mountain Mail Services",
          line3: "DENVER CO 80203",
        },
        contact: {
          home: "303-555-0890",
          cell: "303-555-0891",
          email: "james.brown@capital.com",
        },
      },
      "CL012": {
        residentialAddress: {
          line1: "741 Ash Street",
          line2: "Unit 15",
          line3: "ATLANTA GA 30301",
        },
        mailingAddress: {
          line1: "P.O. Box 4455",
          line2: "Southern Mail Center",
          line3: "ATLANTA GA 30302",
        },
        contact: {
          home: "404-555-0901",
          cell: "404-555-0902",
          email: "will.anderson@finance.com",
        },
      },
      "CL013": {
        residentialAddress: {
          line1: "852 Poplar Avenue",
          line2: "Apt 9B",
          line3: "MIAMI FL 33101",
        },
        mailingAddress: {
          line1: "P.O. Box 7788",
          line2: "Tropical Mail Services",
          line3: "MIAMI FL 33102",
        },
        contact: {
          home: "305-555-1012",
          cell: "305-555-1013",
          email: "maria.garcia@email.com",
        },
      },
      "CL014": {
        residentialAddress: {
          line1: "963 Fir Boulevard",
          line2: "Suite 200",
          line3: "SAN FRANCISCO CA 94102",
        },
        mailingAddress: {
          line1: "P.O. Box 3344",
          line2: "Bay Area Mail Hub",
          line3: "SAN FRANCISCO CA 94103",
        },
        contact: {
          home: "415-555-1123",
          cell: "415-555-1124",
          email: "michael.chen@tech.com",
        },
      },
      "CL015": {
        residentialAddress: {
          line1: "159 Hemlock Drive",
          line2: "Unit 7C",
          line3: "CHICAGO IL 60601",
        },
        mailingAddress: {
          line1: "P.O. Box 5566",
          line2: "Midwest Mail Center",
          line3: "CHICAGO IL 60602",
        },
        contact: {
          home: "312-555-1234",
          cell: "312-555-1235",
          email: "emily.davis@email.com",
        },
      },
      "CL016": {
        residentialAddress: {
          line1: "357 Cypress Lane",
          line2: "Apt 4D",
          line3: "PHOENIX AZ 85001",
        },
        mailingAddress: {
          line1: "P.O. Box 9900",
          line2: "Desert Mail Services",
          line3: "PHOENIX AZ 85002",
        },
        contact: {
          home: "602-555-1345",
          cell: "602-555-1346",
          email: "chris.martinez@finance.com",
        },
      },
      "CL017": {
        residentialAddress: {
          line1: "468 Juniper Road",
          line2: "Suite 300",
          line3: "CALGARY AB T2P 1J1",
        },
        mailingAddress: {
          line1: "P.O. Box 2233",
          line2: "Prairie Mail Services",
          line3: "CALGARY AB T2P 2K2",
        },
        contact: {
          home: "403-555-1456",
          cell: "403-555-1457",
          email: "jessica.taylor@email.com",
        },
      },
      "CL018": {
        residentialAddress: {
          line1: "579 Magnolia Street",
          line2: "Floor 5",
          line3: "HOUSTON TX 77001",
        },
        mailingAddress: {
          line1: "P.O. Box 6677",
          line2: "Gulf Coast Mail Hub",
          line3: "HOUSTON TX 77002",
        },
        contact: {
          home: "713-555-1567",
          cell: "713-555-1568",
          email: "daniel.rodriguez@capital.com",
        },
      },
      "CL019": {
        residentialAddress: {
          line1: "680 Dogwood Court",
          line2: "Unit 11A",
          line3: "PORTLAND OR 97201",
        },
        mailingAddress: {
          line1: "P.O. Box 8899",
          line2: "Pacific Northwest Mail",
          line3: "PORTLAND OR 97202",
        },
        contact: {
          home: "503-555-1678",
          cell: "503-555-1679",
          email: "olivia.white@email.com",
        },
      },
      "CL020": {
        residentialAddress: {
          line1: "791 Redwood Avenue",
          line2: "Apt 6B",
          line3: "OTTAWA ON K1A 0A6",
        },
        mailingAddress: {
          line1: "P.O. Box 1011",
          line2: "Capital Mail Services",
          line3: "OTTAWA ON K1A 1B7",
        },
        contact: {
          home: "613-555-1789",
          cell: "613-555-1790",
          email: "matthew.harris@finance.com",
        },
      },
      "CL021": {
        residentialAddress: {
          line1: "802 Sequoia Boulevard",
          line2: "Suite 150",
          line3: "SAN DIEGO CA 92101",
        },
        mailingAddress: {
          line1: "P.O. Box 1212",
          line2: "Coastal Mail Services",
          line3: "SAN DIEGO CA 92102",
        },
        contact: {
          home: "619-555-1890",
          cell: "619-555-1891",
          email: "sophia.lee@email.com",
        },
      },
      "CL022": {
        residentialAddress: {
          line1: "913 Hickory Drive",
          line2: "Unit 3E",
          line3: "EDMONTON AB T5J 2R7",
        },
        mailingAddress: {
          line1: "P.O. Box 1313",
          line2: "Alberta Mail Centre",
          line3: "EDMONTON AB T5J 3S8",
        },
        contact: {
          home: "780-555-1901",
          cell: "780-555-1902",
          email: "andrew.clark@capital.com",
        },
      },
      "CL023": {
        residentialAddress: {
          line1: "124 Walnut Street",
          line2: "Apt 10C",
          line3: "AUSTIN TX 78701",
        },
        mailingAddress: {
          line1: "P.O. Box 1414",
          line2: "Texas Mail Services",
          line3: "AUSTIN TX 78702",
        },
        contact: {
          home: "512-555-2012",
          cell: "512-555-2013",
          email: "isabella.lewis@email.com",
        },
      },
      "CL024": {
        residentialAddress: {
          line1: "235 Chestnut Lane",
          line2: "Floor 4",
          line3: "MINNEAPOLIS MN 55401",
        },
        mailingAddress: {
          line1: "P.O. Box 1515",
          line2: "North Central Mail Hub",
          line3: "MINNEAPOLIS MN 55402",
        },
        contact: {
          home: "612-555-2123",
          cell: "612-555-2124",
          email: "ryan.walker@finance.com",
        },
      },
      "CL025": {
        residentialAddress: {
          line1: "346 Beech Road",
          line2: "Suite 250",
          line3: "WINNIPEG MB R3C 0B1",
        },
        mailingAddress: {
          line1: "P.O. Box 1616",
          line2: "Manitoba Mail Services",
          line3: "WINNIPEG MB R3C 1C2",
        },
        contact: {
          home: "204-555-2234",
          cell: "204-555-2235",
          email: "ava.hall@email.com",
        },
      },
      "CL026": {
        residentialAddress: {
          line1: "457 Sycamore Court",
          line2: "Unit 14D",
          line3: "DETROIT MI 48201",
        },
        mailingAddress: {
          line1: "P.O. Box 1717",
          line2: "Great Lakes Mail Center",
          line3: "DETROIT MI 48202",
        },
        contact: {
          home: "313-555-2345",
          cell: "313-555-2346",
          email: "nathan.young@capital.com",
        },
      },
      "CL027": {
        residentialAddress: {
          line1: "568 Alder Avenue",
          line2: "Apt 8F",
          line3: "HALIFAX NS B3H 4R2",
        },
        mailingAddress: {
          line1: "P.O. Box 1818",
          line2: "Maritime Mail Services",
          line3: "HALIFAX NS B3H 5S3",
        },
        contact: {
          home: "902-555-2456",
          cell: "902-555-2457",
          email: "mia.king@email.com",
        },
      },
      "CL028": {
        residentialAddress: {
          line1: "679 Larch Boulevard",
          line2: "Suite 350",
          line3: "PHILADELPHIA PA 19101",
        },
        mailingAddress: {
          line1: "P.O. Box 1919",
          line2: "East Coast Mail Hub",
          line3: "PHILADELPHIA PA 19102",
        },
        contact: {
          home: "215-555-2567",
          cell: "215-555-2568",
          email: "benjamin.wright@finance.com",
        },
      },
      "CL029": {
        residentialAddress: {
          line1: "780 Yew Street",
          line2: "Unit 12G",
          line3: "QUEBEC CITY QC G1R 2J7",
        },
        mailingAddress: {
          line1: "P.O. Box 2020",
          line2: "Quebec City Mail Services",
          line3: "QUEBEC CITY QC G1R 3K8",
        },
        contact: {
          home: "418-555-2678",
          cell: "418-555-2679",
          email: "charlotte.scott@email.com",
        },
      },
      "CL030": {
        residentialAddress: {
          line1: "891 Mahogany Drive",
          line2: "Floor 6",
          line3: "LAS VEGAS NV 89101",
        },
        mailingAddress: {
          line1: "P.O. Box 2121",
          line2: "Desert Mail Center",
          line3: "LAS VEGAS NV 89102",
        },
        contact: {
          home: "702-555-2789",
          cell: "702-555-2790",
          email: "lucas.green@capital.com",
        },
      },
    };

    // Default fallback if client ID not found
    return contactInfoMap[clientId || ""] || {
      residentialAddress: {
      line1: "123 Main Street",
      line2: "Suite 200",
      line3: "TORONTO ON M5H 2N2",
    },
      mailingAddress: {
        line1: "P.O. Box 9999",
        line2: "General Mail Services",
        line3: "TORONTO ON M5H 3N3",
    },
    contact: {
      home: "555-555-5555",
      cell: "555-555-5555",
      email: "client@onebosstest.com",
    },
    };
  };

  const clientContactInfo = getClientContactInfo(id);

  // State for address information (allows editing)
  const [currentResidentialAddress, setCurrentResidentialAddress] = useState(clientContactInfo.residentialAddress);
  const [currentMailingAddress, setCurrentMailingAddress] = useState(clientContactInfo.mailingAddress);
  const [currentContact, setCurrentContact] = useState(clientContactInfo.contact);

  // Update state when client changes
  useEffect(() => {
    const contactInfo = getClientContactInfo(id);
    setCurrentResidentialAddress(contactInfo.residentialAddress);
    setCurrentMailingAddress(contactInfo.mailingAddress);
    setCurrentContact(contactInfo.contact);
  }, [id]);

  // Mock data for the client details
  const clientDetails = {
    totalAssets: calculateTotalAssets(),
    totalTrades: 45,
    joinDate: "2024-01-15",
    residentialAddress: currentResidentialAddress,
    mailingAddress: currentMailingAddress,
    contact: currentContact,
    representative: {
      name: "Marsh, Antoine",
      id: "9823-2232",
      language: "English",
    },
    plans: [
      {
        id: "plan1",
        type: "DCPP",
        shortType: "DCPP",
        account: "5434273615",
        category: "Individual",
        holder: "Client Name",
        risk: "Medium",
        objective: "Growth",
        marketValue: "$180.53",
        accountDesignation: "Broker/Nominee",
        badgeColor: "bg-blue-100 text-blue-700",
        products: [
          {
            supplier: "FID-253",
            account: "3448232822",
            product: "FIDELITY NORTHSTAR FUND Series B ISC",
            objective: "Speculation",
            units: "1,247.32 Units",
            price: "$9.41 Per Unit",
            netInvested: "$10,000.00",
            marketValue: "$11,734.85",
            marketValueChange: "+$0.35 (0.003%)",
            marketValueChangePositive: true,
            bookValue: "$11,734.50",
          },
          {
            supplier: "FID-269",
            account: "6503857600",
            product: "FIDELITY MONTHLY INCOME FUND Series B ISC",
            objective: "Balanced",
            units: "2,789.44 Units",
            price: "$10.85 Per Unit",
            netInvested: "$25,000.00",
            marketValue: "$30,265.27",
            marketValueChange: "-$0.25 (-0.001%)",
            marketValueChangePositive: false,
            bookValue: "$30,265.52",
          },
        ],
        totals: {
          netInvested: "$35,000.00",
          totalMarketValue: "$82,905.00",
          totalBookValue: "$42,000.02",
        },
      },
      {
        id: "plan2",
        type: "TFSA",
        shortType: "TFSA",
        account: "TFSA-984512",
        category: "Individual Plan",
        holder: "Smith, John",
        risk: "Medium",
        objective: "Growth",
        marketValue: "$107,325.00",
        accountDesignation: "Broker/Nominee",
        badgeColor: "bg-green-100 text-green-700",
        products: [
          {
            supplier: "FID-253",
            account: "3448232822",
            product: "FIDELITY NORTHSTAR FUND Series B ISC",
            objective: "Speculation",
            units: "1,247.32 Units",
            price: "$9.41 Per Unit",
            netInvested: "$10,000.00",
            marketValue: "$11,734.85",
            marketValueChange: "+$0.35 (0.003%)",
            marketValueChangePositive: true,
            bookValue: "$11,734.50",
          },
        ],
        totals: {
          netInvested: "$10,000.00",
          totalMarketValue: "$107,325.00",
          totalBookValue: "$11,734.50",
        },
      },
      {
        id: "plan3",
        type: "Non-Registered",
        shortType: "Non-Registered",
        account: "NR-984512",
        category: "Individual Plan",
        holder: "Smith, John",
        risk: "Medium",
        objective: "Growth",
        marketValue: "$73,650.00",
        accountDesignation: "Broker/Nominee",
        badgeColor: "bg-purple-100 text-purple-700",
        products: [],
        totals: {
          netInvested: "$0.00",
          totalMarketValue: "$73,650.00",
          totalBookValue: "$0.00",
        },
      },
      {
        id: "plan4",
        type: "RESP Education Savings Plan",
        shortType: "RESP",
        account: "3238677748",
        category: "Family Plan",
        holder: "Smith, John",
        risk: "Medium",
        objective: "Speculation",
        marketValue: "$65,120.00",
        accountDesignation: "Broker/Nominee",
        badgeColor: "bg-yellow-100 text-yellow-700",
        products: [
          {
            supplier: "FID-253",
            account: "3448232822",
            product: "FIDELITY NORTHSTAR FUND Series B ISC",
            objective: "Speculation",
            units: "1,247.32 Units",
            price: "$9.41 Per Unit",
            netInvested: "$10,000.00",
            marketValue: "$11,734.85",
            marketValueChange: "+$0.35 (0.003%)",
            marketValueChangePositive: true,
            bookValue: "$11,734.50",
          },
        ],
        totals: {
          netInvested: "$10,000.00",
          totalMarketValue: "$65,120.00",
          totalBookValue: "$11,734.50",
        },
      },
    ],
  };

  const togglePlanExpansion = (planId: string) => {
    const newExpanded = new Set(expandedPlans);
    if (newExpanded.has(planId)) {
      newExpanded.delete(planId);
    } else {
      newExpanded.add(planId);
    }
    setExpandedPlans(newExpanded);
  };

  return (
    <PageLayout title={""}>
      <div className="space-y-6">
        {/* Client Name and Account */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">Client: {client.name.split(" ").reverse().join(", ")}</h1>
              <div className="flex items-center gap-2">
                <div className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 whitespace-nowrap font-bold">
                  Account {client.id}
                </div>
                <div className="px-3 py-1.5 border border-gray-300 rounded text-sm text-gray-700 whitespace-nowrap">
                  {clientDetails.representative.language}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="px-3 py-1.5 border border-gray-300 rounded text-sm text-green-600 font-semibold whitespace-nowrap">
                Net Acct Value: {clientDetails.totalAssets}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => navigate("/clients")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Client View Navigation Tabs */}
        <div className="border-b border-gray-200 pb-2">
          <div className="bg-gray-50 rounded-lg p-2 shadow-inner border border-gray-200 w-fit">
            <div className="flex items-center gap-1.5 flex-wrap">
              <Button
                variant={clientViewTab === "summary" ? "default" : "ghost"}
                className={`border border-gray-300 rounded-md px-3 py-2 shadow-sm transition-all ${clientViewTab === "summary" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 underline shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setClientViewTab("summary")}
              >
                Summary
              </Button>
              <Button
                variant={clientViewTab === "about" ? "default" : "ghost"}
                className={`border border-gray-300 rounded-md px-3 py-2 shadow-sm transition-all ${clientViewTab === "about" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 underline shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setClientViewTab("about")}
              >
                About
              </Button>
              <Button
                variant={clientViewTab === "notes" ? "default" : "ghost"}
                className={`border border-gray-300 rounded-md px-3 py-2 shadow-sm transition-all ${clientViewTab === "notes" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 underline shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setClientViewTab("notes")}
              >
                Notes
              </Button>
              <Button
                variant={clientViewTab === "portfolio" ? "default" : "ghost"}
                className={`border border-gray-300 rounded-md px-3 py-2 shadow-sm transition-all ${clientViewTab === "portfolio" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 underline shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setClientViewTab("portfolio")}
              >
                Plans
              </Button>
              <Button
                variant={clientViewTab === "trading" ? "default" : "ghost"}
                className={`border border-gray-300 rounded-md px-3 py-2 shadow-sm transition-all ${clientViewTab === "trading" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 underline shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                onClick={() => setClientViewTab("trading")}
              >
                Trading
              </Button>
              <div className="relative">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  onClick={() => {
                    const hiddenTabValues = ["questionnaires", "client-reports", "charts", "approvals", "attachments"];
                    const isCurrentlyVisible = showHiddenTabs.has(client.id);
                    if (isCurrentlyVisible && hiddenTabValues.includes(clientViewTab)) {
                      setClientViewTab("summary");
                    }
                    setShowHiddenTabs(prev => {
                      const newSet = new Set(prev);
                      if (newSet.has(client.id)) {
                        newSet.delete(client.id);
                      } else {
                        newSet.add(client.id);
                      }
                      return newSet;
                    });
                  }}
                  title={showHiddenTabs.has(client.id) ? "Hide tabs" : "Show tabs"}
                >
                  {showHiddenTabs.has(client.id) ? (
                    <Eye className="h-4 w-4 text-gray-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-600" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={`absolute -top-1 -right-1 h-2.5 w-2.5 p-0 hover:bg-transparent ${isPageLocked ? "text-blue-600" : "text-gray-600"}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsPageLocked(prev => {
                      const newLocked = !prev;
                      if (newLocked) {
                        // When locking, save current tab
                        setLockedTab(clientViewTab);
                      }
                      return newLocked;
                    });
                  }}
                  title={isPageLocked ? "Unlock page - will reset to Summary when switching clients" : "Lock page - will stay on current page when switching clients"}
                >
                  {isPageLocked ? (
                    <Lock className="h-1.5 w-1.5" />
                  ) : (
                    <Unlock className="h-1.5 w-1.5" />
                  )}
                </Button>
              </div>
              {showHiddenTabs.has(client.id) && (
                <>
                  <Button
                    variant={clientViewTab === "questionnaires" ? "default" : "ghost"}
                    className={`border border-gray-300 rounded-md px-3 py-2 shadow-sm transition-all ${clientViewTab === "questionnaires" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 underline shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setClientViewTab("questionnaires")}
                  >
                    Questionnaires
                  </Button>
                  <Button
                    variant={clientViewTab === "client-reports" ? "default" : "ghost"}
                    className={`border border-gray-300 rounded-md px-3 py-2 shadow-sm transition-all ${clientViewTab === "client-reports" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 underline shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setClientViewTab("client-reports")}
                  >
                    Client Reports
                  </Button>
                  <Button
                    variant={clientViewTab === "charts" ? "default" : "ghost"}
                    className={`border border-gray-300 rounded-md px-3 py-2 shadow-sm transition-all ${clientViewTab === "charts" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 underline shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setClientViewTab("charts")}
                  >
                    Charts
                  </Button>
                  <Button
                    variant={clientViewTab === "approvals" ? "default" : "ghost"}
                    className={`border border-gray-300 rounded-md px-3 py-2 shadow-sm transition-all ${clientViewTab === "approvals" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 underline shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setClientViewTab("approvals")}
                  >
                    Approvals
                  </Button>
                  <Button
                    variant={clientViewTab === "attachments" ? "default" : "ghost"}
                    className={`border border-gray-300 rounded-md px-3 py-2 shadow-sm transition-all ${clientViewTab === "attachments" ? "bg-blue-600 text-white hover:bg-blue-700 border-blue-600 underline shadow-md" : "bg-white text-gray-700 hover:bg-gray-50"}`}
                    onClick={() => setClientViewTab("attachments")}
                  >
                    Attachments
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>


        {/* Content based on selected tab */}
        {clientViewTab === "summary" && (
          <>
            {/* Two Column Layout: Left - Financial Portfolio, Right - Tiles */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_0.7fr] gap-3">
          {/* Left Column - Financial Portfolio Section */}
          <div className="space-y-4">
          {/* Financial Portfolio Section */}
          <Card className="border border-gray-200 shadow-sm">
          <CardContent className="pt-2 pb-3">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="bg-gray-50 rounded-lg p-2 mb-2 shadow-inner border border-gray-200">
                <TabsList className="flex w-full h-9 bg-transparent p-0 gap-1.5">
                  <TabsTrigger value="investments" className="text-[10px] px-3 py-2 flex-1 whitespace-nowrap min-w-0 border border-gray-300 rounded-md bg-white shadow-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-blue-600 data-[state=active]:shadow-md data-[state=active]:underline hover:bg-gray-50 transition-all">
                    Investments
                  </TabsTrigger>
                  <TabsTrigger value="cash" className="text-[10px] px-3 py-2 flex-1 whitespace-nowrap min-w-0 border border-gray-300 rounded-md bg-white shadow-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-blue-600 data-[state=active]:shadow-md data-[state=active]:underline hover:bg-gray-50 transition-all">
                    Cash
                  </TabsTrigger>
                  <TabsTrigger value="trading-activity" className="text-[10px] px-3 py-2 flex-1 whitespace-nowrap min-w-0 border border-gray-300 rounded-md bg-white shadow-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-blue-600 data-[state=active]:shadow-md data-[state=active]:underline hover:bg-gray-50 transition-all">
                    Recent Trading Activity
                  </TabsTrigger>
                  <TabsTrigger value="documents" className="text-[10px] px-3 py-2 flex-1 relative whitespace-nowrap min-w-0 border border-gray-300 rounded-md bg-white shadow-sm data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:font-semibold data-[state=active]:border-blue-600 data-[state=active]:shadow-md data-[state=active]:underline hover:bg-gray-50 transition-all">
                    Documents
                    <span className="absolute top-1 right-1 h-1.5 w-1.5 bg-orange-500 rounded-full"></span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="investments" className="space-y-2 mt-2">
                {Object.values(clientData.summaryData).map((planData: any, planIndex: number) => {
                  const plan = plansList.find(p => p.id === planData.id);
                  if (!plan) return null;
                  
                  const planInvestments = planData.investments || [];
                  const planTotal = getPlanTotalValue(planInvestments);
                  const accountKey = `account${planIndex + 1}`;
                  const isCollapsed = collapsedAccounts.has(accountKey);
                  
                  // Get first fund for collapsed view actions
                  const firstFundId = planInvestments.length > 0 ? planInvestments[0] : null;
                  const firstFund = firstFundId ? getFundAccountById(firstFundId) : null;
                  
                  // Determine plan category display text
                  const getPlanCategoryText = () => {
                    if (plan.category === "Joint") {
                      return `(${plan.type} Broker/Nominee, Joint) NOM ${plan.accountNumber}`;
                    }
                    return `(${plan.type} ${plan.name || "Client Name"}, ${plan.category})`;
                  };
                  
                  return (
                    <div key={plan.id} className="border border-gray-300 rounded bg-white">
                      <div className="bg-white text-gray-900 px-2.5 py-1.5 flex items-center gap-0.5 border-b border-gray-200">
                        <div className="flex items-center gap-1.5 flex-1 min-w-0">
                          <Folder className="h-3 w-3 text-gray-600 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] text-gray-900">
                              <span 
                                className="underline cursor-pointer font-medium"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setClientViewTab("portfolio");
                                  setSelectedPlanForDetails(plan.id);
                                  setSelectedFundAccount(null);
                                  setSelectedTransaction(null);
                                }}
                              >{plan.accountNumber} {getPlanCategoryText()}</span>
                            </p>
                            {plan.category === "Joint" && (
                              <p className="text-[9px] text-gray-700 mt-0.5">Joint with <span className="underline cursor-pointer">Armstrong, Oliver</span> (Primary)</p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-0.5 flex-shrink-0">
                          <Badge className="bg-green-100 text-green-700 border-green-200 hover:bg-green-100 text-[10px] font-semibold whitespace-nowrap mr-12 px-2.5 py-1">
                            ${planTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </Badge>
                          {(() => {
                              const isZeroBalance = planTotal === 0;
                              const priceStr = firstFund?.currentPrice || "$0.00";
                              const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
                              const marketValueNum = firstFund ? parseFloat(firstFund.marketValue.replace(/[^0-9.]/g, '')) || 0 : 0;
                              const units = price > 0 ? (marketValueNum / price) : 0;
                              const marketValueFormatted = marketValueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                              
                              return (
                                <div className="flex items-center gap-0.5">
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 w-5 p-0 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDialogContext("plan");
                                      setSelectedProduct(null);
                                      setSelectedPlan({
                                        shortType: plan.type || "RRSP",
                                        accountNumber: plan.accountNumber || ""
                                      });
                                      setSelectedPlanBalance(planTotal);
                                      setInvestmentAmount("");
                                      setNumberOfUnits("");
                                      setPlanLevelSelectedFund(null);
                                      setPlanLevelFundCompany("");
                                      setPlanLevelCompanySearch("");
                                      setPlanLevelFundSearch("");
                                      setPlanBuyStep("select");
                                      setIsBuyUnitsDialogOpen(true);
                                    }}
                                  >
                                    <Plus className="h-2.5 w-2.5" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 w-5 p-0 hover:bg-gray-100"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDialogContext("plan");
                                      setSelectedProduct(null);
                                      setSelectedPlan({
                                        shortType: plan.type || "RRSP",
                                        accountNumber: plan.accountNumber || ""
                                      });
                                      setSelectedPlanBalance(planTotal);
                                      setSellUnits("");
                                      setSellDollarAmount("");
                                      setPlanLevelSelectedFund(null);
                                      setPlanLevelFundCompany("");
                                      setPlanLevelCompanySearch("");
                                      setPlanLevelFundSearch("");
                                      setIsSellUnitsDialogOpen(true);
                                    }}
                                  >
                                    <Minus className="h-2.5 w-2.5" />
                                  </Button>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-5 w-5 p-0 hover:bg-gray-100 mr-24"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setDialogContext("plan");
                                      setSelectedProduct(null);
                                      setSelectedPlan({
                                        shortType: plan.type || "RRSP",
                                        accountNumber: plan.accountNumber || ""
                                      });
                                      setSelectedPlanBalance(planTotal);
                                      setSelectedFundCompany("");
                                      setSelectedFundToSwitch("");
                                      setUnitsToSwitch("");
                                      setCompanySearchTerm("");
                                      setFundSearchTerm("");
                                      setPlanLevelSelectedFund(null);
                                      setPlanLevelFundCompany("");
                                      setPlanLevelCompanySearch("");
                                      setPlanLevelFundSearch("");
                                      setPlanSwitchFromFund(null);
                                      setPlanSwitchToFund(null);
                                      setPlanSwitchStep("from");
                                      setIsSwitchDialogOpen(true);
                                    }}
                                  >
                                    <ArrowLeftRight className="h-2.5 w-2.5" />
                                  </Button>
                                </div>
                              );
                            })()}
                          <BarChart3 className="h-3 w-3 cursor-pointer text-gray-700 hover:text-gray-900 ml-0.5" />
                          <div className="bg-green-600 p-0.5 rounded">
                            <DollarSign className="h-2.5 w-2.5 text-white" />
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-5 w-5 p-0 text-gray-700 hover:bg-gray-100"
                            onClick={() => {
                              const newCollapsed = new Set(collapsedAccounts);
                              if (newCollapsed.has(accountKey)) {
                                newCollapsed.delete(accountKey);
                              } else {
                                newCollapsed.add(accountKey);
                              }
                              setCollapsedAccounts(newCollapsed);
                            }}
                          >
                            <Minus className="h-2.5 w-2.5" />
                          </Button>
                        </div>
                      </div>
                      {!isCollapsed && (
                        <div className="p-2">
                          {/* Investment Details Table */}
                          <div className="border border-gray-200 rounded overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-100">
                                  <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2 w-[100px]">Supplier</TableHead>
                                  <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2 w-[120px]">Account</TableHead>
                                  <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2 min-w-[180px]">Product</TableHead>
                                  <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2 w-[60px]">Risk</TableHead>
                                  <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2 w-[120px]">Objective</TableHead>
                                  <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2 w-[90px] text-center">Actions</TableHead>
                                  <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2 w-[100px] text-right">Market value</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {planInvestments.map((fundId: string, fundIndex: number) => {
                                const fund = getFundAccountById(fundId);
                                if (!fund) return null;
                                
                                const marketValueNum = parseFloat(fund.marketValue.replace(/[^0-9.]/g, ''));
                                const marketValueFormatted = marketValueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                
                                return (
                                  <TableRow 
                                    key={fundId}
                                    className={fundIndex === 0 ? "bg-blue-50 cursor-pointer hover:bg-blue-100" : "cursor-pointer hover:bg-gray-50"}
                                    onClick={() => {
                                      setClientViewTab("portfolio");
                                      setSelectedPlanForDetails(plan.id);
                                      setSelectedFundAccount(fundId);
                                      setSelectedTransaction(null);
                                    }}
                                  >
                                    <TableCell className="text-[10px] py-1 px-2">
                                      <span className="font-bold text-blue-600 underline cursor-pointer">{fund.id}</span>
                                    </TableCell>
                                    <TableCell className="text-[10px] py-1 px-2">{fund.accountNumber || ""}</TableCell>
                                    <TableCell className="text-[10px] py-1 px-2">{fund.productName}</TableCell>
                                    <TableCell className="text-[10px] py-1 px-2">{fund.risk}</TableCell>
                                    <TableCell className="text-[10px] py-1 px-2">
                                      <div className="flex flex-col gap-0.5">
                                        <span>{fund.investmentObjective}</span>
                                        <div className="flex items-center gap-0.5">
                                          <FileText className="h-2 w-2 text-blue-600" />
                                          <Folder className="h-2 w-2 text-red-600" />
                                          <Lightbulb className="h-2 w-2 text-yellow-600" />
                                        </div>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-[10px] py-1 px-2 text-center">
                                      <div className="flex items-center justify-center gap-0.5">
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-5 w-5 p-0 hover:bg-gray-100"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const priceStr = fund.currentPrice || "$0.00";
                                            const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
                                            const marketValueNum = parseFloat(fund.marketValue.replace(/[^0-9.]/g, ''));
                                            const units = price > 0 ? (marketValueNum / price) : 0;
                                            const planBalance = getPlanTotalValue(planInvestments);
                                            
                                            setDialogContext("fund");
                                            setSelectedProduct({
                                              product: fund.productName,
                                              units: units > 0 ? units.toFixed(2) : "0.00",
                                              price: price > 0 ? `$${price.toFixed(2)}` : "$0.00",
                                              marketValue: `$${marketValueFormatted}`
                                            });
                                            setSelectedPlan({
                                              shortType: plan.type || "RRSP",
                                              accountNumber: plan.accountNumber || ""
                                            });
                                            setSelectedPlanBalance(planBalance);
                                            setInvestmentAmount("");
                                            setNumberOfUnits("");
                                            setIsBuyUnitsDialogOpen(true);
                                          }}
                                        >
                                          <Plus className="h-2.5 w-2.5" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-5 w-5 p-0 hover:bg-gray-100"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const priceStr = fund.currentPrice || "$0.00";
                                            const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
                                            const marketValueNum = parseFloat(fund.marketValue.replace(/[^0-9.]/g, ''));
                                            const units = price > 0 ? (marketValueNum / price) : 0;
                                            const planBalance = getPlanTotalValue(planInvestments);
                                            
                                            setDialogContext("fund");
                                            setSelectedProduct({
                                              product: fund.productName,
                                              units: units > 0 ? units.toFixed(2) : "0.00",
                                              price: price > 0 ? `$${price.toFixed(2)}` : "$0.00",
                                              marketValue: `$${marketValueFormatted}`
                                            });
                                            setSelectedPlan({
                                              shortType: plan.type || "RRSP",
                                              accountNumber: plan.accountNumber || ""
                                            });
                                            setSelectedPlanBalance(planBalance);
                                            setSellUnits("");
                                            setSellDollarAmount("");
                                            setIsSellUnitsDialogOpen(true);
                                          }}
                                        >
                                          <Minus className="h-2.5 w-2.5" />
                                        </Button>
                                        <Button 
                                          variant="ghost" 
                                          size="sm" 
                                          className="h-5 w-5 p-0 hover:bg-gray-100"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            const priceStr = fund.currentPrice || "$0.00";
                                            const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
                                            const marketValueNum = parseFloat(fund.marketValue.replace(/[^0-9.]/g, ''));
                                            const units = price > 0 ? (marketValueNum / price) : 0;
                                            const planBalance = getPlanTotalValue(planInvestments);
                                            
                                            setDialogContext("fund");
                                            setSelectedProduct({
                                              product: fund.productName,
                                              units: units > 0 ? units.toFixed(2) : "0.00",
                                              price: price > 0 ? `$${price.toFixed(2)}` : "$0.00",
                                              marketValue: `$${marketValueFormatted}`,
                                              supplier: fund.supplier
                                            });
                                            setSelectedPlan({
                                              shortType: plan.type || "RRSP",
                                              accountNumber: plan.accountNumber || ""
                                            });
                                            setSelectedPlanBalance(planBalance);
                                            setSelectedFundCompany("");
                                            setSelectedFundToSwitch("");
                                            setUnitsToSwitch("");
                                            setCompanySearchTerm("");
                                            setFundSearchTerm("");
                                            setIsSwitchDialogOpen(true);
                                          }}
                                        >
                                          <ArrowLeftRight className="h-2.5 w-2.5" />
                                        </Button>
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-[10px] font-semibold py-1 px-2 text-right">
                                      {marketValueNum > 0 ? (
                                        `$${marketValueFormatted}`
                                      ) : (
                                        "$0.00"
                                      )}
                                    </TableCell>
                                  </TableRow>
                                );
                              })}
                            </TableBody>
                          </Table>
                          </div>
                          {/* Settled Trust Account Balance */}
                          <div className="bg-blue-50 mt-2 p-2 rounded border border-blue-200">
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] text-gray-700">Settled Trust Account Balance CAD</span>
                              <span className="text-[10px] font-semibold text-gray-900">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-[10px] text-gray-700">Settled Trust Account Balance USD</span>
                              <span className="text-[10px] font-semibold text-gray-900">$0.00</span>
                            </div>
                            <div className="flex justify-between items-center pt-1.5 border-t border-blue-300">
                              <span className="text-[10px] font-semibold text-gray-900">Total in CAD</span>
                              <span className="text-[10px] font-bold text-gray-900">${planTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </TabsContent>

              <TabsContent value="cash">
                <div className="space-y-4">
                  {/* Cash Summary Section */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Left Column - CAD */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">Cash Available CAD</span>
                        <span className="flex-1 border-b border-dotted border-gray-400"></span>
                        <span className="text-xs text-gray-900">$0.00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">Cash Used For Trades CAD</span>
                        <span className="flex-1 border-b border-dotted border-gray-400"></span>
                        <span className="text-xs text-gray-900">$0.00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">Cash Total CAD</span>
                        <span className="flex-1 border-b border-dotted border-gray-400"></span>
                        <span className="text-xs text-gray-900">$0.00</span>
                      </div>
                    </div>
                    {/* Right Column - USD */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">Cash Available USD</span>
                        <span className="flex-1 border-b border-dotted border-gray-400"></span>
                        <span className="text-xs text-gray-900">$0.00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">Cash Used For Trades USD</span>
                        <span className="flex-1 border-b border-dotted border-gray-400"></span>
                        <span className="text-xs text-gray-900">$0.00</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">Cash Total USD</span>
                        <span className="flex-1 border-b border-dotted border-gray-400"></span>
                        <span className="text-xs text-gray-900">$0.00</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Trust Transactions Section */}
                  <div className="mt-4">
                    <h3 className="text-xs font-semibold text-blue-600 underline mb-2 cursor-pointer">Recent Trust Transactions</h3>
                    <Card className="border border-gray-200 shadow-sm">
                      <CardContent className="p-0">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-100">
                              <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Plan</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Date</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Trust Account Code</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Transaction Type</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Status</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Settled Date</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Amount</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell colSpan={7} className="text-center py-4">
                                <p className="text-xs text-gray-500 italic">No Trust Transactions Found</p>
                              </TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trading-activity">
                <Card className="border border-gray-200 shadow-sm">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-100">
                          <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Plan</TableHead>
                          <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Fund Account</TableHead>
                          <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Trade Type</TableHead>
                          <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Trade Status</TableHead>
                          <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Net Amount</TableHead>
                          <TableHead className="text-[10px] font-semibold text-gray-700 py-1.5 px-2">Trade Date</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4">
                            <p className="text-xs text-gray-500 italic">No Trading Activities Found</p>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents">
                <div className="space-y-4">
                  {/* Product Documents Header */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      Product Documents for Active Products
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </h3>
                  </div>

                  {/* Documents Table */}
                  <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="text-xs font-semibold text-gray-700">Security</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-700">Document Type</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-700">Delivery Type</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-700">Delivery Date</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-start gap-2">
                                <Checkbox className="mt-1" />
                                <div className="text-xs text-gray-900">
                                  <p className="font-medium">FID-225 FIDELITY TRUE NORTH FUND</p>
                                  <p className="text-gray-600">SERIES B ISC</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select defaultValue="fund-facts">
                                <SelectTrigger className="h-8 text-xs w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fund-facts">Fund Facts</SelectItem>
                                  <SelectItem value="prospectus">Prospectus</SelectItem>
                                  <SelectItem value="annual-report">Annual Report</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs text-gray-700">Downloaded</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-700">02-12-2025 02:02 PM</span>
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-start gap-2">
                                <Checkbox className="mt-1" />
                                <div className="text-xs text-gray-900">
                                  <p className="font-medium">FID-234 FIDELITY U.S. FOCUSED STOCK FUND</p>
                                  <p className="text-gray-600">SERIES B ISC</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select defaultValue="fund-facts">
                                <SelectTrigger className="h-8 text-xs w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fund-facts">Fund Facts</SelectItem>
                                  <SelectItem value="prospectus">Prospectus</SelectItem>
                                  <SelectItem value="annual-report">Annual Report</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs text-gray-700">Downloaded</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-700">02-12-2025 02:02 PM</span>
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-start gap-2">
                                <Checkbox className="mt-1" />
                                <div className="text-xs text-gray-900">
                                  <p className="font-medium">FID-253 FIDELITY NORTHSTAR FUND</p>
                                  <p className="text-gray-600">SERIES B ISC</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select defaultValue="fund-facts">
                                <SelectTrigger className="h-8 text-xs w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fund-facts">Fund Facts</SelectItem>
                                  <SelectItem value="prospectus">Prospectus</SelectItem>
                                  <SelectItem value="annual-report">Annual Report</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs text-gray-700">Downloaded</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-700">02-12-2025 02:02 PM</span>
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                              </div>
                            </TableCell>
                          </TableRow>
                          <TableRow className="hover:bg-gray-50">
                            <TableCell>
                              <div className="flex items-start gap-2">
                                <Checkbox className="mt-1" />
                                <div className="text-xs text-gray-900">
                                  <p className="font-medium">FID-269 FIDELITY MONTHLY INCOME FUND</p>
                                  <p className="text-gray-600">SERIES B ISC</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Select defaultValue="fund-facts">
                                <SelectTrigger className="h-8 text-xs w-[140px]">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="fund-facts">Fund Facts</SelectItem>
                                  <SelectItem value="prospectus">Prospectus</SelectItem>
                                  <SelectItem value="annual-report">Annual Report</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell className="text-xs text-gray-700">Downloaded</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-700">02-12-2025 02:02 PM</span>
                                <AlertTriangle className="h-3 w-3 text-orange-500" />
                              </div>
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Bottom Action Bar */}
                  <div className="flex items-center gap-4 pt-2">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Deliver
                    </Button>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Checkbox defaultChecked id="lang-en" />
                        <label htmlFor="lang-en" className="text-xs text-gray-700 cursor-pointer">EN</label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="lang-fr" />
                        <label htmlFor="lang-fr" className="text-xs text-gray-700 cursor-pointer">FR</label>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-gray-700">Select Delivery Method</label>
                      <Select defaultValue="email">
                        <SelectTrigger className="h-8 text-xs w-[180px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="mail">Mail</SelectItem>
                          <SelectItem value="download">Download</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          </Card>
          </div>

          {/* Right Column - Tiles */}
          <div className="space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5 auto-rows-min">
              {/* Residential Address Card - Full width */}
              <Card className="border border-gray-200 shadow-sm bg-white col-span-2">
                <CardHeader className="pb-0.5 px-2 pt-1.5 relative">
                  <div className="grid grid-cols-2 gap-2 items-center">
                    <div className="flex items-center">
                      <CardTitle className="text-[10px] font-semibold text-gray-900">Residential Address</CardTitle>
                    </div>
                    <div className="flex items-center justify-start gap-2 pl-2">
                      <CardTitle className="text-[10px] font-semibold text-gray-900">Mailing Address</CardTitle>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute top-1.5 right-2 h-2.5 w-2.5 p-0 hover:bg-transparent transition-all duration-200 hover:drop-shadow-[0_0_4px_rgba(59,130,246,0.5)]"
                    onClick={() => {
                      setEditedResidentialAddress({ ...clientDetails.residentialAddress });
                      setEditedMailingAddress(clientDetails.mailingAddress ? { ...clientDetails.mailingAddress } : { line1: "", line2: "", line3: "" });
                      setEditedContact({ ...clientDetails.contact });
                      setIsEditAddressDialogOpen(true);
                    }}
                  >
                    <Pencil className="h-1.5 w-1.5 text-gray-500 hover:text-blue-600 transition-colors" />
                  </Button>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                  <div className="grid grid-cols-2 gap-2">
                    {/* Left Column - Residential Address */}
                    <div className="pr-2 border-r border-gray-300">
                      <p className="text-[10px] text-gray-700 break-words">
                        {clientDetails.residentialAddress.line1}
                        {clientDetails.residentialAddress.line2 && `, ${clientDetails.residentialAddress.line2}`}
                        {clientDetails.residentialAddress.line3 && `, ${clientDetails.residentialAddress.line3}`}
                      </p>
                      <p className="text-[9px] text-gray-700 mt-0.5"><span className="font-semibold">Home:</span> {clientDetails.contact.home} | <span className="font-semibold">Cell:</span> {clientDetails.contact.cell}</p>
                      <p className="text-[9px] text-gray-700 mt-0.5"><span className="font-semibold">Email:</span> {clientDetails.contact.email}</p>
                    </div>
                    {/* Right Column - Mailing Address */}
                    <div className="pl-2">
                      {clientDetails.mailingAddress ? (
                        <p className="text-[10px] text-gray-700 break-words">
                          {clientDetails.mailingAddress.line1}
                          {clientDetails.mailingAddress.line2 && `, ${clientDetails.mailingAddress.line2}`}
                          {clientDetails.mailingAddress.line3 && `, ${clientDetails.mailingAddress.line3}`}
                        </p>
                      ) : (
                        <p className="text-[10px] text-gray-500 italic">No mailing address on file</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Add a New Plan Button */}
              <Card className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Actions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1.5 px-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full h-7 text-[9px] font-medium text-gray-700 hover:bg-gray-50 border-gray-300"
                    onClick={() => {
                      setClientViewTab("plans");
                      setIsSelectPlanTypeOpen(true);
                      setSelectedPlanType("");
                      setPlanSetupStep(0);
                      const currentClient = CLIENTS.find((c) => c.id === id);
                      setOwnerName(currentClient?.name || "");
                    }}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add a New Plan
                  </Button>
                </CardContent>
              </Card>

              {/* Client and Plan Exceptions Card - Single column, compact */}
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Client and Plan Exceptions</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                  <div className="space-y-0.5">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-0.5 cursor-pointer">
                          <div className="flex-1 h-2 bg-gray-100 rounded overflow-hidden">
                            <div className="h-full bg-red-500 rounded" style={{ width: '50%' }}></div>
                          </div>
                          <span className="text-[8px] text-gray-700 min-w-[55px]">Expired KYC's</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>5 Expired KYC's</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-0.5 cursor-pointer">
                          <div className="flex-1 h-2 bg-gray-100 rounded overflow-hidden">
                            <div className="h-full bg-orange-500 rounded" style={{ width: '30%' }}></div>
                          </div>
                          <span className="text-[8px] text-gray-700 min-w-[55px]">NIGO's</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>3 NIGO's</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex items-center gap-0.5 cursor-pointer">
                          <div className="flex-1 h-2 bg-gray-100 rounded overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded" style={{ width: '20%' }}></div>
                          </div>
                          <span className="text-[8px] text-gray-700 min-w-[55px]">Missing KYP's</span>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>2 Missing KYP's</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                </CardContent>
              </Card>

              {/* Client Profiler Card */}
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Client Profiler</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1.5 px-2 space-y-0.5">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] text-gray-700">Retention Score</span>
                      <span className="text-[9px] font-semibold text-gray-900">36.37</span>
                    </div>
                    <div className="h-0.5 bg-gray-100 rounded overflow-hidden">
                      <div className="h-full bg-green-500 rounded" style={{ width: '86.37%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] text-gray-700">Engagement Score</span>
                      <span className="text-[9px] font-semibold text-gray-900">N/A</span>
                    </div>
                    <div className="h-0.5 bg-red-500 rounded"></div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <span className="text-[9px] text-gray-700">Share of Wallet</span>
                      <span className="text-[9px] font-semibold text-gray-900">100%</span>
                    </div>
                    <div className="h-0.5 bg-blue-500 rounded"></div>
                  </div>
                </CardContent>
              </Card>

              {/* Investment Summary Tile */}
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Investment Summary</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-gray-600">Gross Invested</span>
                    <span className="flex-1 border-b border-dotted border-gray-300 mx-1.5"></span>
                    <span className="text-[9px] font-semibold text-gray-900">$425,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-gray-600">Net Invested</span>
                    <span className="flex-1 border-b border-dotted border-gray-300 mx-1.5"></span>
                    <span className="text-[9px] font-semibold text-gray-900">$410,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-gray-600">Net Gain</span>
                    <span className="flex-1 border-b border-dotted border-gray-300 mx-1.5"></span>
                    <span className="text-[9px] font-semibold text-green-600">+$38,500</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[8px] text-gray-600">Rate of Return</span>
                    <span className="flex-1 border-b border-dotted border-gray-300 mx-1.5"></span>
                    <span className="text-[9px] font-semibold text-green-600">+7.4%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Allocations Tile - Combined Asset, Geographic, and Sector - Single column, same size as Client Exceptions */}
              <Card 
                className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md hover:border-blue-300 transition-all duration-200"
                onClick={() => {
                  setChartsSubTab("allocations");
                  setClientViewTab("charts");
                }}
              >
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Allocations</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                  <div className="grid grid-cols-3 gap-0 w-full">
                    {/* Asset Allocation */}
                    <div className="flex flex-col items-center">
                      <p className="text-[7px] font-semibold text-gray-700 mb-0.5">Asset</p>
                      <ResponsiveContainer width="100%" height={32}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Equity", value: 45 },
                              { name: "Bonds", value: 30 },
                              { name: "Cash", value: 15 },
                              { name: "Other", value: 10 },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={12}
                            paddingAngle={1}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#2563eb" />
                            <Cell fill="#16a34a" />
                            <Cell fill="#ca8a04" />
                            <Cell fill="#64748b" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Geographic Allocation */}
                    <div className="flex flex-col items-center">
                      <p className="text-[7px] font-semibold text-gray-700 mb-0.5">Geographic</p>
                      <ResponsiveContainer width="100%" height={32}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "North America", value: 50 },
                              { name: "Europe", value: 25 },
                              { name: "Asia", value: 15 },
                              { name: "Other", value: 10 },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={12}
                            paddingAngle={1}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#2563eb" />
                            <Cell fill="#16a34a" />
                            <Cell fill="#ca8a04" />
                            <Cell fill="#64748b" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>

                    {/* Sector Allocation */}
                    <div className="flex flex-col items-center">
                      <p className="text-[7px] font-semibold text-gray-700 mb-0.5">Sector</p>
                      <ResponsiveContainer width="100%" height={32}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Technology", value: 30 },
                              { name: "Financial", value: 25 },
                              { name: "Healthcare", value: 20 },
                              { name: "Other", value: 25 },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={12}
                            paddingAngle={1}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#2563eb" />
                            <Cell fill="#16a34a" />
                            <Cell fill="#ca8a04" />
                            <Cell fill="#64748b" />
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Notices Tile - Small */}
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Notices</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                  <div className="text-center">
                    <p className="text-[9px] text-gray-400 italic">No notices</p>
                  </div>
                </CardContent>
              </Card>

              {/* Empty Tiles - Grid layout */}
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Empty Tile</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Empty Tile</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Empty Tile</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Empty Tile</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Empty Tile</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Empty Tile</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                </CardContent>
              </Card>
              <Card className="border border-gray-200 shadow-sm bg-white">
                <CardHeader className="pb-0.5 px-2 pt-1.5">
                  <CardTitle className="text-[10px] font-semibold text-gray-900">Empty Tile</CardTitle>
                </CardHeader>
                <CardContent className="pt-0 pb-1 px-2">
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
          </>
        )}

        {clientViewTab === "about" && (
          <ScrollArea className="h-[calc(100vh-300px)] pr-4 bg-gray-50">
            <div className="space-y-6 p-4">
            {/* Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  // Handle Save Client Details
                }}
              >
                Save Client Details
              </Button>
              <Button 
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // Handle Cancel
                }}
              >
                Cancel
              </Button>
              <Button 
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // Handle Non Financial Change
                }}
              >
                Non Financial Change
              </Button>
              <Button 
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // Handle View NFC Submissions
                }}
              >
                View NFC Submissions
              </Button>
              <Button 
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // Handle View NFU Messages
                }}
              >
                View NFU Messages
              </Button>
              <Button 
                variant="default"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  // Handle Start KYP Review
                }}
              >
                Start KYP Review
              </Button>
            </div>
            
            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                {/* Personal Information */}
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">Personal Information</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">ID</Label>
                    <Input className="h-8 text-sm" defaultValue="30013" readOnly />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Title</Label>
                    <Select defaultValue="mr">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mr">Mr.</SelectItem>
                        <SelectItem value="mrs">Mrs.</SelectItem>
                        <SelectItem value="ms">Ms.</SelectItem>
                        <SelectItem value="dr">Dr.</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Type</Label>
                    <Select defaultValue="individual">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="individual">Individual</SelectItem>
                        <SelectItem value="joint">Joint</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">First Name</Label>
                    <Input className="h-8 text-sm" defaultValue="Toney" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Surname</Label>
                    <Input className="h-8 text-sm" defaultValue="Andrews" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Alias</Label>
                    <Input className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Gender</Label>
                    <Select defaultValue="male">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Marital Status</Label>
                    <div className="flex items-center gap-2">
                      <Select defaultValue="none">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="single">Single</SelectItem>
                          <SelectItem value="married">Married</SelectItem>
                          <SelectItem value="divorced">Divorced</SelectItem>
                          <SelectItem value="widowed">Widowed</SelectItem>
                          <SelectItem value="none">None</SelectItem>
                        </SelectContent>
                      </Select>
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Dependants</Label>
                    <Select defaultValue="0">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">0</SelectItem>
                        <SelectItem value="1">1</SelectItem>
                        <SelectItem value="2">2</SelectItem>
                        <SelectItem value="3">3</SelectItem>
                        <SelectItem value="4+">4+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Date of Birth</Label>
                    <div className="flex items-center gap-2">
                      <Input className="h-8 text-sm" defaultValue="11/06/1960" />
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Age</Label>
                    <Input className="h-8 text-sm" defaultValue="65" readOnly />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Language</Label>
                    <Select defaultValue="english">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">SIN</Label>
                    <Input className="h-8 text-sm" defaultValue="912174828" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">CDIC Client Identifier</Label>
                    <Input className="h-8 text-sm" defaultValue="OBW1K0" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">File ID</Label>
                    <Input className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Delivery Status</Label>
                    <Select defaultValue="estatements">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="estatements">eStatements</SelectItem>
                        <SelectItem value="mail">Mail</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Delivery Status Consent Date</Label>
                    <div className="flex items-center gap-2">
                      <Input className="h-8 text-sm" defaultValue="03/21/2017" />
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Status</Label>
                    <Select defaultValue="active">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">LTA Date</Label>
                    <div className="flex items-center gap-2">
                      <Input className="h-8 text-sm" />
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">LTA</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox id="lta" />
                      <Input className="h-8 text-sm flex-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">POA Date</Label>
                    <div className="flex items-center gap-2">
                      <Input className="h-8 text-sm" />
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">POA</Label>
                    <div className="flex items-center gap-2">
                      <Checkbox id="poa" />
                      <Input className="h-8 text-sm flex-1" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">POA Name</Label>
                    <Input className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">POA Address</Label>
                    <Input className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Tax Code</Label>
                    <Input className="h-8 text-sm" defaultValue="ONTARIO" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Citizenship</Label>
                    <Select defaultValue="unknown">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="canadian">Canadian</SelectItem>
                        <SelectItem value="us">US</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Pro Account</Label>
                    <Select>
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Pro Account Date</Label>
                    <div className="flex items-center gap-2">
                      <Input className="h-8 text-sm" />
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Representative Defined Field 1</Label>
                    <Input className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Representative Defined Field 2</Label>
                    <Input className="h-8 text-sm" defaultValue="3" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Representative Defined Field 3</Label>
                    <Input className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Date of Death</Label>
                    <div className="flex items-center gap-2">
                      <Input className="h-8 text-sm" />
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">CASL Permission (consents to receive emails)</Label>
                    <Checkbox id="casl" />
                  </div>
                </div>
                </div>

                {/* Spouse Residential Address */}
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">Spouse Residential Address</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="spouse-residential-same" />
                      <Label htmlFor="spouse-residential-same" className="text-xs text-gray-700 cursor-pointer">Same as Client Residential Address</Label>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Address Line 1</Label>
                      <Input className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Address Line 2</Label>
                      <Input className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">City</Label>
                      <Input className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Country</Label>
                      <Select defaultValue="canada">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Province</Label>
                      <Select>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="on">Ontario</SelectItem>
                          <SelectItem value="bc">British Columbia</SelectItem>
                          <SelectItem value="ab">Alberta</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Postal</Label>
                      <Input className="h-8 text-sm" />
                    </div>
                  </div>
                </div>

                {/* Spouse Mailing Address */}
                <div className="bg-white p-4 rounded border border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">Spouse Mailing Address</h3>
                  <div className="grid grid-cols-2 gap-4 mt-4">
                    <div className="flex items-center gap-2">
                      <Checkbox id="spouse-mailing-same" />
                      <Label htmlFor="spouse-mailing-same" className="text-xs text-gray-700 cursor-pointer">Same as residential</Label>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Address Line 1</Label>
                      <Input className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Address Line 2</Label>
                      <Input className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">City</Label>
                      <Input className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Country</Label>
                      <Select defaultValue="unknown">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Province</Label>
                      <Select>
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue placeholder="Select province" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="on">Ontario</SelectItem>
                          <SelectItem value="bc">British Columbia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Postal</Label>
                      <Input className="h-8 text-sm" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Right Column */}
              <div className="space-y-6">
            {/* Contact Information */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">Contact Information</h3>
              <div className="mt-4 space-y-4">
                {/* Returned Mail */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Returned Mail</Label>
                    <Select defaultValue="no">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Returned Mail Date</Label>
                    <div className="flex items-center gap-2">
                      <Input className="h-8 text-sm" />
                      <Calendar className="h-4 w-4 text-gray-500" />
                    </div>
                  </div>
                </div>
                {/* Mobility Exemption */}
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Mobility Exemption</Label>
                  <p className="text-xs text-gray-700">No Mobility Exemptions</p>
                </div>
                {/* Residential Address */}
                <div>
                  <Label className="text-xs font-semibold text-gray-900 mb-2 block">Residential Address</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Address Line 1</Label>
                      <Input className="h-8 text-sm" defaultValue="3460 Keele Street Apt. 502" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Address Line 2</Label>
                      <Input className="h-8 text-sm" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">City</Label>
                      <Input className="h-8 text-sm" defaultValue="Toronto" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Country</Label>
                      <Select defaultValue="canada">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="usa">United States</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Province</Label>
                      <Select defaultValue="ontario">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="ontario">ONTARIO</SelectItem>
                          <SelectItem value="bc">British Columbia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Postal</Label>
                      <Input className="h-8 text-sm" defaultValue="HOH OHO" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Home</Label>
                      <Input className="h-8 text-sm" defaultValue="555-555-5555" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Cell</Label>
                      <Input className="h-8 text-sm" defaultValue="555-555-5555" />
                    </div>
                  </div>
                </div>
                {/* Mailing Address */}
                <div>
                  <Label className="text-xs font-semibold text-gray-900 mb-2 block">Mailing Address</Label>
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox id="mailing-same" defaultChecked />
                    <Label htmlFor="mailing-same" className="text-xs text-gray-700 cursor-pointer">Same as residential</Label>
                  </div>
                </div>
                {/* Phone and Email */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Home Phone</Label>
                    <Input className="h-8 text-sm" defaultValue="555-555-5555" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Work Phone</Label>
                    <Input className="h-8 text-sm" defaultValue="555-555-5555" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Cell Phone</Label>
                    <Input className="h-8 text-sm" defaultValue="555-555-5555" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Fax</Label>
                    <Input className="h-8 text-sm" defaultValue="000-000-0000" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Email</Label>
                    <Input className="h-8 text-sm" defaultValue="client@onebosstest.com" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Verify Email</Label>
                    <Input className="h-8 text-sm" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Email (Secondary)</Label>
                    <Input className="h-8 text-sm" defaultValue="client30013@onebosstest.com" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Verify Secondary Email</Label>
                    <Input className="h-8 text-sm" />
                  </div>
                </div>
                {/* Reset Client Web Access Buttons */}
                <div className="space-y-2 pt-2 border-t border-gray-200">
                  <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    View Client Portal as {client.name.split(" ").reverse().join(", ")}
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    Reset Client Web Access
                  </Button>
                  <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                    View Portal Login History
                  </Button>
                </div>
                {/* Permissions */}
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Checkbox id="fund-alerts" />
                    <Label htmlFor="fund-alerts" className="text-xs text-gray-700 cursor-pointer">
                      Client may access Fund Alerts
                    </Label>
                  </div>
                  <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                    Apply Permissions
                  </Button>
                </div>
              </div>
            </div>


            {/* Employment Information */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">Employment Information</h3>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Occupation</Label>
                    <Input className="h-8 text-sm" defaultValue="Records Managment" />
                  </div>
                  <div>
                    <Label className="text-xs text-gray-500 mb-1 block">Employer</Label>
                    <Input className="h-8 text-sm" defaultValue="City of Mississauga" />
                  </div>
                </div>
              </div>
            </div>

            {/* Bank Account Information */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-blue-600">
                <h3 className="text-sm font-semibold text-gray-900">Bank Account Information</h3>
                <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Bank Account
                </Button>
              </div>
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-semibold text-gray-700">Description</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Transit Number</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Institution Number</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Account Number</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Holder Name</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs text-gray-900">Demo bank account 62110</TableCell>
                      <TableCell className="text-xs text-gray-700">001</TableCell>
                      <TableCell className="text-xs text-gray-700">0167132</TableCell>
                      <TableCell className="text-xs text-gray-700"></TableCell>
                      <TableCell className="text-xs text-gray-700">Toney Andrews</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                          <FileText className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Personal KYC Information */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">Personal KYC Information</h3>
              <div className="mt-4">
                <div className="grid grid-cols-2 gap-4">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Liquid Assets</Label>
                      <Input className="h-8 text-sm" defaultValue="$0.00" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Fixed Assets</Label>
                      <Input className="h-8 text-sm" defaultValue="$35,000.00" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Liabilities</Label>
                      <Input className="h-8 text-sm" defaultValue="$0.00" />
                    </div>
                    <div className="flex items-center gap-2">
                      <Label className="text-xs text-gray-500">Total</Label>
                      <Input className="h-8 text-sm flex-1" defaultValue="$35,000.00" readOnly />
                      <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        Calculate
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="assets-includes-spouse" />
                      <Label htmlFor="assets-includes-spouse" className="text-xs text-gray-700 cursor-pointer">
                        Assets Includes Spouse
                      </Label>
                    </div>
                  </div>
                  {/* Right Column */}
                  <div className="space-y-4">
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Personal Income</Label>
                      <Input className="h-8 text-sm" defaultValue="$0.00" />
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Personal Income</Label>
                      <Select defaultValue="25000-49999">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-24999">$0 - $24,999</SelectItem>
                          <SelectItem value="25000-49999">$25,000 - $49,999</SelectItem>
                          <SelectItem value="50000-99999">$50,000 - $99,999</SelectItem>
                          <SelectItem value="100000+">$100,000+</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="income-includes-spouse" />
                      <Label htmlFor="income-includes-spouse" className="text-xs text-gray-700 cursor-pointer">
                        Income Includes Spouse
                      </Label>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Investor Knowledge</Label>
                      <Select defaultValue="fair">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="novice">Novice</SelectItem>
                          <SelectItem value="fair">Fair</SelectItem>
                          <SelectItem value="intermediate">Intermediate</SelectItem>
                          <SelectItem value="advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-xs text-gray-500 mb-1 block">Accredited Investor</Label>
                      <Select defaultValue="no">
                        <SelectTrigger className="h-8 text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="yes">Yes</SelectItem>
                          <SelectItem value="no">No</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Politically Exposed Person Information */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">Politically Exposed Person Information</h3>
              <div className="mt-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Label className="text-xs text-gray-700">Politically exposed person?</Label>
                    <Select defaultValue="unknown">
                      <SelectTrigger className="h-8 text-sm w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="unknown">Unknown</SelectItem>
                      </SelectContent>
                    </Select>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </div>
                  <p className="text-xs text-gray-500 italic">Client or family member</p>
                </div>
              </div>
            </div>

            {/* FATCA/CRS Information */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">FATCA/CRS Information</h3>
              <div className="mt-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Label className="text-xs text-gray-700">Tax resident of a jurisdiction other than Canada*</Label>
                  <Select defaultValue="yes">
                    <SelectTrigger className="h-8 text-sm w-[120px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">FATCA Eligible</Label>
                  <Select defaultValue="reportable">
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reportable">Reportable</SelectItem>
                      <SelectItem value="non-reportable">Non Reportable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">SSN</Label>
                  <Input className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">FATCA No TIN Reason</Label>
                  <div className="flex items-center gap-2">
                    <Select defaultValue="none">
                      <SelectTrigger className="h-8 text-sm">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">None</SelectItem>
                      </SelectContent>
                    </Select>
                    <AlertTriangle className="h-4 w-4 text-orange-500" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox id="w8ben" />
                  <Label htmlFor="w8ben" className="text-xs text-gray-700 cursor-pointer">W-8BEN/W9</Label>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">W-8BEN/W9 Date</Label>
                  <div className="flex items-center gap-2">
                    <Input className="h-8 text-sm" />
                    <Calendar className="h-4 w-4 text-gray-500" />
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">CRS Eligible</Label>
                  <Select defaultValue="non-reportable">
                    <SelectTrigger className="h-8 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="reportable">Reportable</SelectItem>
                      <SelectItem value="non-reportable">Non Reportable</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* ID Documents */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <div className="flex items-center justify-between mb-2 pb-2 border-b-2 border-blue-600">
                <h3 className="text-sm font-semibold text-gray-900">ID Documents</h3>
                <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New ID Document
                </Button>
              </div>
              <div className="mt-4">
                <div className="mb-4">
                  <Label className="text-xs font-semibold text-gray-900 mb-2 block">Identification Methods</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="id-in-person" defaultChecked />
                      <Label htmlFor="id-in-person" className="text-xs text-gray-700 cursor-pointer">In Person</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="id-video" />
                      <Label htmlFor="id-video" className="text-xs text-gray-700 cursor-pointer">Video Conference</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="id-agent" />
                      <Label htmlFor="id-agent" className="text-xs text-gray-700 cursor-pointer">By Agent</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="id-affiliate" />
                      <Label htmlFor="id-affiliate" className="text-xs text-gray-700 cursor-pointer">By Affiliate</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="id-cccs" />
                      <Label htmlFor="id-cccs" className="text-xs text-gray-700 cursor-pointer">By CCCSMember</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="id-independent" />
                      <Label htmlFor="id-independent" className="text-xs text-gray-700 cursor-pointer">Independent Product</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="id-credit" />
                      <Label htmlFor="id-credit" className="text-xs text-gray-700 cursor-pointer">By Credit File</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="id-attestation" />
                      <Label htmlFor="id-attestation" className="text-xs text-gray-700 cursor-pointer">Attestation From Commissioner</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="id-cheque" />
                      <Label htmlFor="id-cheque" className="text-xs text-gray-700 cursor-pointer">Cleared Cheque</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="id-deposit" />
                      <Label htmlFor="id-deposit" className="text-xs text-gray-700 cursor-pointer">Deposit Account</Label>
                    </div>
                  </div>
                </div>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-semibold text-gray-700">Type</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">ID/License Number</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Description</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Location</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Issued Date</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Expiry Date</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Owner</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs text-gray-900">Driver's License</TableCell>
                      <TableCell className="text-xs text-gray-700">8127274056</TableCell>
                      <TableCell className="text-xs text-gray-700"></TableCell>
                      <TableCell className="text-xs text-gray-700">ON CA</TableCell>
                      <TableCell className="text-xs text-gray-700">01/01/2015</TableCell>
                      <TableCell className="text-xs text-gray-700">01/01/2025</TableCell>
                      <TableCell className="text-xs text-gray-700">Client</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-6 text-xs bg-blue-600 hover:bg-blue-700 text-white">
                          <FileText className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Trusted Contact Persons */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">Trusted Contact Persons</h3>
              <div className="mt-4">
                <Select defaultValue="not-set">
                  <SelectTrigger className="h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-set">Not Set</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Client Custom Questions */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">Client Custom Questions</h3>
              <div className="mt-4 space-y-4">
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Test</Label>
                  <Input className="h-8 text-sm" />
                </div>
                <div>
                  <Label className="text-xs text-gray-500 mb-1 block">Test2</Label>
                  <Input className="h-8 text-sm" />
                </div>
              </div>
            </div>

            {/* User Defined Flags */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">User Defined Flags</h3>
              <div className="mt-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="flag-1" defaultChecked />
                      <Label htmlFor="flag-1" className="text-xs text-gray-700 cursor-pointer">1</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="rebate-primary" />
                      <Label htmlFor="rebate-primary" className="text-xs text-gray-700 cursor-pointer">Rebate- Primary</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="hdof-1" />
                      <Label htmlFor="hdof-1" className="text-xs text-gray-700 cursor-pointer">HDOF-1</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="third-party-ipp" />
                      <Label htmlFor="third-party-ipp" className="text-xs text-gray-700 cursor-pointer">Third Party IPP</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="transfer-fee" />
                      <Label htmlFor="transfer-fee" className="text-xs text-gray-700 cursor-pointer">Transfer Fee Agreement on file</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="flag-1-2" />
                      <Label htmlFor="flag-1-2" className="text-xs text-gray-700 cursor-pointer">1</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="something-new" />
                      <Label htmlFor="something-new" className="text-xs text-gray-700 cursor-pointer">SOMETHING NEW</Label>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="flag-1-3" />
                      <Label htmlFor="flag-1-3" className="text-xs text-gray-700 cursor-pointer">1</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="rebate-secondary" />
                      <Label htmlFor="rebate-secondary" className="text-xs text-gray-700 cursor-pointer">Rebate - Secondary</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="testing" />
                      <Label htmlFor="testing" className="text-xs text-gray-700 cursor-pointer">Testing</Label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              </div>
            </div>
            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                Save Client Details
              </Button>
              <div className="flex-1"></div>
              <div className="bg-white p-4 rounded border border-gray-200">
                <h3 className="text-sm font-semibold text-gray-900 mb-2 pb-2 border-b-2 border-blue-600">Pendings</h3>
                <p className="text-xs text-gray-500 mt-2">No pendings found</p>
              </div>
            </div>
            </div>
          </ScrollArea>
        )}

        {clientViewTab === "questionnaires" && (
          <div className="space-y-4">
            {/* Investor Questionnaire Section */}
            <div className="bg-white p-4 rounded border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Investor Questionnaire</h3>
              <div className="space-y-4">
                <p className="text-xs text-gray-500">There are no Investor Questionnaires</p>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-xs h-8 w-8 p-0">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                    New Questionnaire
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {clientViewTab === "client-reports" && (
          <div className="space-y-4">
            {/* Client Reports Section */}
            <div className="bg-blue-600 px-4 py-3 rounded-t border border-blue-600">
              <div className="flex items-center gap-2">
                <ChevronDown className="h-4 w-4 text-white" />
                <h3 className="text-sm font-semibold text-white">Client Reports</h3>
              </div>
            </div>
            <div className="bg-white p-4 rounded-b border-l border-r border-b border-gray-200">
              <div className="space-y-2">
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Portfolio Summary Report</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">CRM2 Performance Report</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Portfolio Position Report</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Quick Summary Report</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Year Over Year Plan Performance Report</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Plan Performance Report</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Capital Gain</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Charges And Compensation Report</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Tax-Free Savings Accounts Calculator</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Systematic Payments Summary Report</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Retirement Savings Report</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Asset Mix</a>
                <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800 block">Client Profiler</a>
              </div>
            </div>
          </div>
        )}

        {clientViewTab === "charts" && (
          <div className="space-y-4">
            {/* Secondary Navigation Tabs */}
            <Tabs value={chartsSubTab} onValueChange={(value) => setChartsSubTab(value as "smart-charts" | "allocations")}>
              <TabsList className="grid w-full grid-cols-2 h-8 mb-4">
                <TabsTrigger value="smart-charts" className="text-xs">
                  Smart Charts
                  <HelpCircle className="h-3 w-3 ml-1" />
                </TabsTrigger>
                <TabsTrigger value="allocations" className="text-xs">Allocations</TabsTrigger>
              </TabsList>

              <TabsContent value="smart-charts" className="mt-4">
                <div className="space-y-4">
                  {/* Top Controls */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <Checkbox id="zoom-pan" />
                        <Label htmlFor="zoom-pan" className="text-xs text-gray-700 cursor-pointer">Zoom & Pan</Label>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                        Print
                      </Button>
                    </div>
                  </div>

                  {/* Client Name Heading */}
                  <h2 className="text-lg font-semibold text-gray-900">Armstrong, Amy</h2>

                  {/* Financial Summary and Account Selection */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Financial Summary Table */}
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50">
                            <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3"></TableHead>
                            <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Mar 31, 2020</TableHead>
                            <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Dec 14, 2025</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-xs py-2 px-3 font-medium">Market Value</TableCell>
                            <TableCell className="text-xs py-2 px-3">0.00</TableCell>
                            <TableCell className="text-xs py-2 px-3">15,214.29</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-2 px-3 font-medium">Net Invested</TableCell>
                            <TableCell className="text-xs py-2 px-3"></TableCell>
                            <TableCell className="text-xs py-2 px-3">13,040.00</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs py-2 px-3 font-medium">Gain</TableCell>
                            <TableCell className="text-xs py-2 px-3"></TableCell>
                            <TableCell className="text-xs py-2 px-3">2,174.29</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-2 px-3 font-medium">Rate of Return</TableCell>
                            <TableCell className="text-xs py-2 px-3"></TableCell>
                            <TableCell className="text-xs py-2 px-3">4.29</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* Account Selection */}
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800">Select All</a>
                          <a href="#" className="text-xs text-blue-600 underline hover:text-blue-800">Select None</a>
                        </div>
                        <div className="flex items-center gap-2">
                          <Checkbox id="resp-family" defaultChecked />
                          <Label htmlFor="resp-family" className="text-xs text-gray-700 cursor-pointer">RESP Family 7886147741</Label>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Date Range Filters */}
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs text-gray-700 mb-1 block">Start Date</Label>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="march">
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="march">March</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="31">
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="31">31</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="2020">
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2020">2020</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <Label className="text-xs text-gray-700 mb-1 block">End Date</Label>
                        <div className="flex items-center gap-2">
                          <Select defaultValue="december">
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="december">December</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="14">
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="14">14</SelectItem>
                            </SelectContent>
                          </Select>
                          <Select defaultValue="2025">
                            <SelectTrigger className="h-8 text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="2025">2025</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <ResponsiveContainer width="100%" height={400}>
                      <AreaChart
                        data={[
                          { date: "2021-01", marketValue: 0, netInvested: 0 },
                          { date: "2021-06", marketValue: 2000, netInvested: 2000 },
                          { date: "2022-01", marketValue: 4500, netInvested: 4000 },
                          { date: "2022-06", marketValue: 6800, netInvested: 6000 },
                          { date: "2023-01", marketValue: 9200, netInvested: 8000 },
                          { date: "2023-06", marketValue: 11000, netInvested: 10000 },
                          { date: "2024-01", marketValue: 12800, netInvested: 11500 },
                          { date: "2024-06", marketValue: 14200, netInvested: 13000 },
                          { date: "2025-01", marketValue: 15100, netInvested: 13040 },
                          { date: "2025-12", marketValue: 15214.29, netInvested: 13040 },
                        ]}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient id="colorMarketValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tick={{ fontSize: 10 }}
                          tickFormatter={(value) => {
                            const year = value.split("-")[0];
                            return year;
                          }}
                        />
                        <YAxis 
                          domain={[0, 14000]} 
                          tick={{ fontSize: 10 }}
                          ticks={[0, 2000, 4000, 6000, 8000, 10000, 12000, 14000]}
                        />
                        <RechartsTooltip />
                        <Area 
                          type="monotone" 
                          dataKey="marketValue" 
                          stroke="#8884d8" 
                          fillOpacity={1} 
                          fill="url(#colorMarketValue)" 
                        />
                        <Line 
                          type="step" 
                          dataKey="netInvested" 
                          stroke="#ef4444" 
                          strokeWidth={2}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="allocations" className="mt-4">
                <div className="space-y-4">
                  {/* Header with Title and Print Button */}
                  <div className="flex items-center justify-between border-b border-gray-300 pb-2">
                    <h3 className="text-sm font-semibold text-gray-900">Asset Allocations</h3>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                      Print
                    </Button>
                  </div>

                  {/* Top Row - Three Charts */}
                  <div className="grid grid-cols-3 gap-4">
                    {/* Equity Product Allocation */}
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-900 mb-3 text-center">Equity Product Allocation</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "MMF-564", value: 24.63 },
                              { name: "MMF-4529", value: 75.37 },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#ef4444" />
                            <Cell fill="#3b82f6" />
                          </Pie>
                          <RechartsTooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                      <Table className="mt-3">
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-xs py-1 px-2">MMF-564</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">24.63%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$3,747.33</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-1 px-2">MMF-4529</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">75.37%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$11,466.96</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* Geographic Allocation */}
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-900 mb-3 text-center">Geographic Allocation</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Canada", value: 60.42 },
                              { name: "United States", value: 34.04 },
                              { name: "European Union", value: 3.86 },
                              { name: "Asia/Pacific Rim", value: 0.71 },
                              { name: "Japan", value: 0.41 },
                              { name: "Other European", value: 0.23 },
                              { name: "Other Asian", value: 0.17 },
                              { name: "All Others", value: 0.15 },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#ef4444" />
                            <Cell fill="#eab308" />
                            <Cell fill="#f97316" />
                            <Cell fill="#84cc16" />
                            <Cell fill="#3b82f6" />
                            <Cell fill="#6b7280" />
                            <Cell fill="#6b7280" />
                            <Cell fill="#6b7280" />
                          </Pie>
                          <RechartsTooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                      <Table className="mt-3">
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-xs py-1 px-2">Canada</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">60.42%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$9,192.77</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-1 px-2">Other European</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">0.23%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$34.85</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs py-1 px-2">European Union</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">3.86%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$587.96</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-1 px-2">United States</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">34.04%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$5,178.35</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs py-1 px-2">Japan</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">0.41%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$62.58</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-1 px-2">Asia/Pacific Rim</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">0.71%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$108.30</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs py-1 px-2">Other Asian</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">0.17%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$26.61</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-1 px-2">All Others</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">0.15%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$22.88</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>

                    {/* Asset Allocation */}
                    <div className="bg-white p-4 rounded border border-gray-200">
                      <h4 className="text-xs font-semibold text-gray-900 mb-3 text-center">Asset Allocation</h4>
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Canadian Equity", value: 44.97 },
                              { name: "US Equity", value: 30.75 },
                              { name: "Domestic Bonds", value: 11.87 },
                              { name: "International Equity", value: 5.10 },
                              { name: "Cash and Equivalents", value: 3.72 },
                              { name: "Foreign Bonds", value: 3.31 },
                              { name: "Other", value: 0.18 },
                              { name: "All Others", value: 0.09 },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#3b82f6" />
                            <Cell fill="#eab308" />
                            <Cell fill="#9333ea" />
                            <Cell fill="#f97316" />
                            <Cell fill="#84cc16" />
                            <Cell fill="#ef4444" />
                            <Cell fill="#6b7280" />
                            <Cell fill="#6b7280" />
                          </Pie>
                          <RechartsTooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                      <Table className="mt-3">
                        <TableBody>
                          <TableRow>
                            <TableCell className="text-xs py-1 px-2">Foreign Bonds</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">3.31%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$504.23</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-1 px-2">International Equity</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">5.10%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$776.08</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs py-1 px-2">Domestic Bonds</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">11.87%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$1,806.10</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-1 px-2">US Equity</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">30.75%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$4,678.13</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs py-1 px-2">Cash and Equivalents</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">3.72%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$566.26</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-1 px-2">Canadian Equity</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">44.97%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$6,841.88</TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell className="text-xs py-1 px-2">All Others</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">0.09%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$13.49</TableCell>
                          </TableRow>
                          <TableRow className="bg-gray-50">
                            <TableCell className="text-xs py-1 px-2">Other</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">0.18%</TableCell>
                            <TableCell className="text-xs py-1 px-2 text-right">$28.13</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </div>

                  {/* Bottom Row - Sector Allocation */}
                  <div className="bg-white p-4 rounded border border-gray-200">
                    <h4 className="text-xs font-semibold text-gray-900 mb-3 text-center">Sector Allocation</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                          <Pie
                            data={[
                              { name: "Financial Services", value: 21.51 },
                              { name: "All Others", value: 18.70 },
                              { name: "Fixed Income", value: 15.35 },
                              { name: "Technology", value: 16.00 },
                              { name: "Consumer Services", value: 8.39 },
                              { name: "Industrial Services", value: 7.89 },
                              { name: "Basic Materials", value: 6.60 },
                              { name: "Energy", value: 5.56 },
                            ]}
                            cx="50%"
                            cy="50%"
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                          >
                            <Cell fill="#ef4444" />
                            <Cell fill="#3b82f6" />
                            <Cell fill="#ec4899" />
                            <Cell fill="#22c55e" />
                            <Cell fill="#1e40af" />
                            <Cell fill="#9333ea" />
                            <Cell fill="#eab308" />
                            <Cell fill="#f97316" />
                          </Pie>
                          <RechartsTooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div>
                        <Table>
                          <TableBody>
                            <TableRow>
                              <TableCell className="text-xs py-1 px-2">Financial Services</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">21.51%</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">$3,273.31</TableCell>
                            </TableRow>
                            <TableRow className="bg-gray-50">
                              <TableCell className="text-xs py-1 px-2">Energy</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">5.56%</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">$846.16</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs py-1 px-2">Basic Materials</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">6.60%</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">$1,004.34</TableCell>
                            </TableRow>
                            <TableRow className="bg-gray-50">
                              <TableCell className="text-xs py-1 px-2">Industrial Services</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">7.89%</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">$1,199.88</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs py-1 px-2">Technology</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">16.00%</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">$2,433.61</TableCell>
                            </TableRow>
                            <TableRow className="bg-gray-50">
                              <TableCell className="text-xs py-1 px-2">Consumer Services</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">8.39%</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">$1,276.65</TableCell>
                            </TableRow>
                            <TableRow>
                              <TableCell className="text-xs py-1 px-2">Fixed Income</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">15.35%</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">$2,335.79</TableCell>
                            </TableRow>
                            <TableRow className="bg-gray-50">
                              <TableCell className="text-xs py-1 px-2">All Others</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">18.70%</TableCell>
                              <TableCell className="text-xs py-1 px-2 text-right">$2,844.55</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {clientViewTab === "trading" && (
          <div className="space-y-4">
            {/* Plan Selection */}
            <div className="flex items-center gap-3">
              <Label className="text-xs text-gray-700">Plan:</Label>
              <Select>
                <SelectTrigger className="h-8 text-sm w-64">
                  <SelectValue placeholder="Select a Plan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7886147741">7886147741 (RESP Family Client Name, Joint)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Plan Header Bar */}
            <div className="bg-gray-200 px-4 py-3 rounded border border-gray-300">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">
                    7886147741 (RESP Family Client Name, Joint)
                  </p>
                  <div className="mt-1">
                    <p className="text-xs text-gray-700">Joint with <span className="underline cursor-pointer">Armstrong, Oliver</span> (Primary)</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 cursor-pointer text-gray-700" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 text-gray-700 hover:bg-gray-100"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Investment/Product Table */}
            <div className="border border-gray-300 rounded">
              <div className="p-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-100">
                      <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3 w-[120px]">Supplier</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3 w-[140px]">Account</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3 min-w-[200px]">Product</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3 w-[80px]">Risk</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3 w-[150px]">Objective</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3 w-[120px] text-center">Actions</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3 w-[130px] text-right">Market value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="text-xs py-2 px-3">
                        <span className="font-bold text-blue-600 underline cursor-pointer">MMF-564</span>
                      </TableCell>
                      <TableCell className="text-xs py-2 px-3">6237058732</TableCell>
                      <TableCell className="text-xs py-2 px-3">MANULIFE SIMPLICITY MODERATE PORTFOLIO</TableCell>
                      <TableCell className="text-xs py-2 px-3">LM</TableCell>
                      <TableCell className="text-xs py-2 px-3">
                        <div className="flex flex-col gap-0.5">
                          <span>75% In, 25% Gr</span>
                          <div className="flex items-center gap-0.5">
                            <FileText className="h-2.5 w-2.5 text-blue-600" />
                            <Folder className="h-2.5 w-2.5 text-red-600" />
                            <Lightbulb className="h-2.5 w-2.5 text-yellow-600" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              const planInvestments = getPlanInvestments(selectedPlanForDetails);
                              const planBalance = getPlanTotalValue(planInvestments);
                              
                              setDialogContext("fund");
                              setSelectedProduct({
                                product: "MANULIFE SIMPLICITY MODERATE PORTFOLIO",
                                units: "150.00",
                                price: "$175.50",
                                marketValue: "$3,747.33"
                              });
                              setSelectedPlan({
                                shortType: selectedPlanData?.type || "RRSP",
                                accountNumber: selectedPlanData?.accountNumber || ""
                              });
                              setSelectedPlanBalance(planBalance);
                              setInvestmentAmount("");
                              setNumberOfUnits("");
                              setIsBuyUnitsDialogOpen(true);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              const planInvestments = getPlanInvestments(selectedPlanForDetails);
                              const planBalance = getPlanTotalValue(planInvestments);
                              
                              setDialogContext("fund");
                              setSelectedProduct({
                                product: "MANULIFE SIMPLICITY MODERATE PORTFOLIO",
                                units: "150.00",
                                price: "$175.50",
                                marketValue: "$3,747.33"
                              });
                              setSelectedPlan({
                                shortType: selectedPlanData?.type || "RRSP",
                                accountNumber: selectedPlanData?.accountNumber || ""
                              });
                              setSelectedPlanBalance(planBalance);
                              setSellUnits("");
                              setSellDollarAmount("");
                              setIsSellUnitsDialogOpen(true);
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              const planInvestments = getPlanInvestments(selectedPlanForDetails);
                              const planBalance = getPlanTotalValue(planInvestments);
                              
                              setDialogContext("fund");
                              setSelectedProduct({
                                product: "MANULIFE SIMPLICITY MODERATE PORTFOLIO",
                                units: "150.00",
                                price: "$175.50",
                                marketValue: "$3,747.33",
                                supplier: "MFC"
                              });
                              setSelectedPlan({
                                shortType: selectedPlanData?.type || "RRSP",
                                accountNumber: selectedPlanData?.accountNumber || ""
                              });
                              setSelectedPlanBalance(planBalance);
                              setSelectedFundCompany("");
                              setSelectedFundToSwitch("");
                              setUnitsToSwitch("");
                              setCompanySearchTerm("");
                              setFundSearchTerm("");
                              setIsSwitchDialogOpen(true);
                            }}
                          >
                            <ArrowLeftRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold py-2 px-3 text-right">$3,747.33</TableCell>
                    </TableRow>
                    <TableRow className="bg-blue-50">
                      <TableCell className="text-xs py-2 px-3">
                        <span className="font-bold text-blue-600 underline cursor-pointer">MMF-4529</span>
                      </TableCell>
                      <TableCell className="text-xs py-2 px-3">0205734337</TableCell>
                      <TableCell className="text-xs py-2 px-3">MANULIFE DIVIDEND INCOME FUND</TableCell>
                      <TableCell className="text-xs py-2 px-3">M</TableCell>
                      <TableCell className="text-xs py-2 px-3">
                        <div className="flex flex-col gap-0.5">
                          <span>100% Ba</span>
                          <div className="flex items-center gap-0.5">
                            <FileText className="h-2.5 w-2.5 text-blue-600" />
                            <Folder className="h-2.5 w-2.5 text-red-600" />
                            <Lightbulb className="h-2.5 w-2.5 text-yellow-600" />
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs py-2 px-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              const planInvestments = getPlanInvestments(selectedPlanForDetails);
                              const planBalance = getPlanTotalValue(planInvestments);
                              
                              setDialogContext("fund");
                              setSelectedProduct({
                                product: "MANULIFE DIVIDEND INCOME FUND",
                                units: "150.00",
                                price: "$175.50",
                                marketValue: "$11,466.96"
                              });
                              setSelectedPlan({
                                shortType: selectedPlanData?.type || "RRSP",
                                accountNumber: selectedPlanData?.accountNumber || ""
                              });
                              setSelectedPlanBalance(planBalance);
                              setInvestmentAmount("");
                              setNumberOfUnits("");
                              setIsBuyUnitsDialogOpen(true);
                            }}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              const planInvestments = getPlanInvestments(selectedPlanForDetails);
                              const planBalance = getPlanTotalValue(planInvestments);
                              
                              setDialogContext("fund");
                              setSelectedProduct({
                                product: "MANULIFE DIVIDEND INCOME FUND",
                                units: "150.00",
                                price: "$175.50",
                                marketValue: "$11,466.96"
                              });
                              setSelectedPlan({
                                shortType: selectedPlanData?.type || "RRSP",
                                accountNumber: selectedPlanData?.accountNumber || ""
                              });
                              setSelectedPlanBalance(planBalance);
                              setSellUnits("");
                              setSellDollarAmount("");
                              setIsSellUnitsDialogOpen(true);
                            }}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 hover:bg-gray-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              const planInvestments = getPlanInvestments(selectedPlanForDetails);
                              const planBalance = getPlanTotalValue(planInvestments);
                              
                              setDialogContext("fund");
                              setSelectedProduct({
                                product: "MANULIFE SIMPLICITY MODERATE PORTFOLIO",
                                units: "150.00",
                                price: "$175.50",
                                marketValue: "$3,747.33",
                                supplier: "MFC"
                              });
                              setSelectedPlan({
                                shortType: selectedPlanData?.type || "RRSP",
                                accountNumber: selectedPlanData?.accountNumber || ""
                              });
                              setSelectedPlanBalance(planBalance);
                              setSelectedFundCompany("");
                              setSelectedFundToSwitch("");
                              setUnitsToSwitch("");
                              setCompanySearchTerm("");
                              setFundSearchTerm("");
                              setIsSwitchDialogOpen(true);
                            }}
                          >
                            <ArrowLeftRight className="h-3 w-3" />
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs font-semibold py-2 px-3 text-right">$11,466.96</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Trust Account Balance Summary */}
            <div className="bg-blue-50 p-4 rounded border border-blue-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">Settled Trust Account Balance CAD</span>
                <span className="text-sm font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-700">Settled Trust Account Balance USD</span>
                <span className="text-sm font-semibold">$0.00</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-blue-200">
                <span className="text-sm font-semibold text-gray-900">Total in CAD</span>
                <span className="text-sm font-bold">$15,214.29</span>
              </div>
            </div>
          </div>
        )}

        {clientViewTab === "portfolio" && (
          <div className="w-full">
            <div className="flex gap-4">
              {/* Left Pane - Plan Selection */}
              <div className="w-1/3 border-r border-gray-200 pr-4">
                <div className="space-y-4 py-2">
                  {/* Include Inactive Plans */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Checkbox id="include-inactive-plans" checked={includeInactivePlans} onCheckedChange={(checked) => setIncludeInactivePlans(checked as boolean)} />
                      <Label htmlFor="include-inactive-plans" className="text-xs text-gray-700 cursor-pointer">Include Inactive Plans</Label>
                    </div>
                    <Button 
                      size="sm" 
                      className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7"
                      onClick={() => {
                        setIsSelectPlanTypeOpen(true);
                        setSelectedPlanType("");
                        setPlanSetupStep(0);
                        const currentClient = CLIENTS.find((c) => c.id === id);
                        setOwnerName(currentClient?.name || "John Smith");
                        setBeneficiaryName("");
                        setIntermediaryCode("");
                        setIntermediaryAccountCode("");
                        setPlanNotes("");
                        setPlanObjectives("");
                        setRiskTolerance("");
                        setTimeHorizon("");
                        setCreatedPlanDetails(null);
                      }}
                    >
                      Add New Plan
                    </Button>
                  </div>

                {/* Plans List */}
                <div className="space-y-2">
                  {plansList.map((plan) => (
                    <div
                      key={plan.id}
                      onClick={() => {
                        setSelectedPlanForDetails(plan.id);
                        setSelectedFundAccount(null);
                        setSelectedTransaction(null);
                      }}
                      className={`border rounded p-2 cursor-pointer transition-colors ${
                        selectedPlanForDetails === plan.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-gray-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-900">
                              {plan.accountNumber} ({plan.type} {plan.name}, {plan.category})
                            </p>
                          </div>
                        </div>
                        <span className="text-xs font-semibold text-gray-900">{plan.marketValue}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Account Tabs */}
                <Tabs value={accountViewType} onValueChange={(value) => setAccountViewType(value as "fund-accounts" | "gics")}>
                  <div className="w-full overflow-x-auto overflow-y-visible mb-4 min-w-0">
                    <TabsList className="inline-flex h-auto p-1 gap-8 min-w-full w-max">
                      <TabsTrigger value="fund-accounts" className="text-xs whitespace-nowrap flex-shrink-0">
                        Fund Accounts
                        <HelpCircle className="h-3 w-3 ml-1" />
                      </TabsTrigger>
                      <TabsTrigger value="gics" className="text-xs whitespace-nowrap flex-shrink-0">
                        GICs
                        <HelpCircle className="h-3 w-3 ml-1" />
                      </TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="fund-accounts" className="mt-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Checkbox id="include-inactive-accounts" checked={includeInactiveAccounts} onCheckedChange={(checked) => setIncludeInactiveAccounts(checked as boolean)} />
                      <Label htmlFor="include-inactive-accounts" className="text-xs text-gray-700 cursor-pointer">Include Inactive Accounts</Label>
                    </div>
                    <div className="space-y-2">
                      {filteredFundAccounts.length > 0 ? (
                        filteredFundAccounts.map((account) => (
                        <div
                          key={account.id}
                          onClick={() => {
                            setSelectedFundAccount(account.id);
                            setSelectedTransaction(null); // Clear transaction selection to show fund account details
                          }}
                          className={`border rounded p-2 cursor-pointer transition-colors ${
                            selectedFundAccount === account.id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-900 truncate">{account.fullName}</p>
                            </div>
                            <div className="flex items-center gap-2 ml-2">
                              <span className="text-xs font-semibold text-gray-900">{account.marketValue}</span>
                              <div className="flex items-center gap-1">
                                <BarChart3 className="h-3 w-3 text-gray-500" />
                                <FileText className="h-3 w-3 text-gray-500" />
                                <HelpCircle className="h-3 w-3 text-gray-500" />
                              </div>
                            </div>
                          </div>
                        </div>
                        ))
                      ) : (
                        <div className="text-center py-4 text-xs text-gray-500">
                          {selectedPlanForDetails ? "No fund accounts found for this plan." : "Please select a plan to view fund accounts."}
                        </div>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="gics" className="mt-4">
                    <p className="text-xs text-gray-500">No GIC accounts found</p>
                  </TabsContent>
                </Tabs>

                {/* Transactions Tab */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-1 mb-3">
                    <span className="text-xs font-semibold text-gray-900">Transactions</span>
                    <HelpCircle className="h-3 w-3 text-gray-500" />
                  </div>
                  
                  {selectedFundAccount ? (
                    <div className="space-y-3">
                      {/* Filter Dropdowns */}
                      <div className="flex items-end gap-3">
                        <div className="flex-1">
                          <Label className="text-[10px] text-gray-500 mb-0.5 block">Display Options</Label>
                          <Select value={transactionsDisplayOption} onValueChange={setTransactionsDisplayOption}>
                            <SelectTrigger className="h-7 text-[11px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="All">All</SelectItem>
                              <SelectItem value="Valid and Pending">Valid and Pending</SelectItem>
                              <SelectItem value="Valid and Manual">Valid and Manual</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label className="text-[10px] text-gray-500 mb-0.5 block">Trade Date</Label>
                          <Select value={transactionsSortBy} onValueChange={setTransactionsSortBy}>
                            <SelectTrigger className="h-7 text-[11px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Sort by Trade Date">Sort by Trade Date</SelectItem>
                              <SelectItem value="Sort by Processing Date">Sort by Processing Date</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex-1">
                          <Label className="text-[10px] text-gray-500 mb-0.5 block">Selected Account</Label>
                          <Select value={selectedAccountFilter} onValueChange={setSelectedAccountFilter}>
                            <SelectTrigger className="h-7 text-[11px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Selected Account">Selected Account</SelectItem>
                              <SelectItem value="Selected Plan">Selected Plan</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      {/* Transactions Table */}
                      <div className="border border-gray-200 rounded overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow className="bg-gray-100">
                              <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2 w-8"></TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Date</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Gross Amount</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Net Amount</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Price</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Status</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Type</TableHead>
                              <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Calculated Share Balance</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {transactions.map((transaction) => (
                              <TableRow
                                key={transaction.id}
                                onClick={() => setSelectedTransaction(transaction.id)}
                                className={`cursor-pointer ${
                                  selectedTransaction === transaction.id
                                    ? "bg-blue-100"
                                    : "hover:bg-gray-50"
                                }`}
                              >
                                <TableCell className="py-1.5 px-2" onClick={(e) => e.stopPropagation()}>
                                  {selectedTransaction === transaction.id ? (
                                    <div className="w-3 h-3 bg-white border border-gray-300"></div>
                                  ) : (
                                    <Checkbox
                                      checked={false}
                                      onCheckedChange={(checked) => {
                                        if (checked) {
                                          setSelectedTransaction(transaction.id);
                                        }
                                      }}
                                    />
                                  )}
                                </TableCell>
                                <TableCell className="text-[10px] py-1.5 px-2 text-gray-900">{transaction.date}</TableCell>
                                <TableCell className="text-[10px] py-1.5 px-2 text-gray-900">{transaction.grossAmount}</TableCell>
                                <TableCell className="text-[10px] py-1.5 px-2 text-gray-900">{transaction.netAmount}</TableCell>
                                <TableCell className="text-[10px] py-1.5 px-2 text-gray-900">{transaction.price}</TableCell>
                                <TableCell className="text-[10px] py-1.5 px-2">
                                  <span className="underline text-blue-600 cursor-pointer">{transaction.status}</span>
                                </TableCell>
                                <TableCell className="text-[10px] py-1.5 px-2 text-gray-900">{transaction.type}</TableCell>
                                <TableCell className="text-[10px] py-1.5 px-2 text-gray-900">{transaction.shareBalance}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500 italic">Please select a fund account above.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Right Pane - Plan Details, Fund Account Details, or Transaction Details */}
            <div className="flex-1 pl-4">
              <div className="space-y-4 py-2">
                {selectedTransactionData ? (
                  /* Transaction Details */
                  <div className="space-y-4">
                    <Tabs value={transactionDetailTab} onValueChange={setTransactionDetailTab}>
                      <div className="w-full overflow-x-auto overflow-y-visible mb-4 min-w-0">
                        <TabsList className="inline-flex h-auto p-1 gap-6 min-w-full w-max">
                          <TabsTrigger value="summary" className="text-xs whitespace-nowrap flex-shrink-0">Summary</TabsTrigger>
                          <TabsTrigger value="details" className="text-xs whitespace-nowrap flex-shrink-0">Details</TabsTrigger>
                          <TabsTrigger value="fundserv" className="text-xs whitespace-nowrap flex-shrink-0">
                            Fundserv
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TabsTrigger>
                          <TabsTrigger value="payment-instructions" className="text-xs whitespace-nowrap flex-shrink-0">
                            Payment Instructions
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TabsTrigger>
                          <TabsTrigger value="notes" className="text-xs whitespace-nowrap flex-shrink-0">
                            Notes
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TabsTrigger>
                          <TabsTrigger value="attachments" className="text-xs whitespace-nowrap flex-shrink-0">
                            Attachments
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TabsTrigger>
                          <TabsTrigger value="reviews" className="text-xs whitespace-nowrap flex-shrink-0">
                            Reviews
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TabsTrigger>
                          <TabsTrigger value="related-transactions" className="text-xs whitespace-nowrap flex-shrink-0">Related Transactions</TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="summary" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                          {/* Investment Summary Tile - Row 1, Col 1 */}
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

                          {/* Asset Allocation Tile - Row 1, Col 2 */}
                          <Card 
                            className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              // Navigate to allocations tab - placeholder for now
                              console.log("Navigate to Asset Allocation");
                            }}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-semibold text-gray-900">Asset Allocation</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-2">
                              <ResponsiveContainer width="100%" height={120}>
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: "Equity", value: 45 },
                                      { name: "Bonds", value: 30 },
                                      { name: "Cash", value: 15 },
                                      { name: "Other", value: 10 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#eab308" />
                                    <Cell fill="#6b7280" />
                                  </Pie>
                                  <RechartsTooltip formatter={(value: number) => `${value}%`} />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>

                          {/* Geographic Allocation Tile - Row 1, Col 3 */}
                          <Card 
                            className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              // Navigate to allocations tab - placeholder for now
                              console.log("Navigate to Geographic Allocation");
                            }}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-semibold text-gray-900">Geographic Allocation</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-2">
                              <ResponsiveContainer width="100%" height={120}>
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: "North America", value: 50 },
                                      { name: "Europe", value: 25 },
                                      { name: "Asia", value: 15 },
                                      { name: "Other", value: 10 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#eab308" />
                                    <Cell fill="#6b7280" />
                                  </Pie>
                                  <RechartsTooltip formatter={(value: number) => `${value}%`} />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>

                          {/* Sector Allocation Tile - Row 1, Col 4 */}
                          <Card 
                            className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              // Navigate to allocations tab - placeholder for now
                              console.log("Navigate to Sector Allocation");
                            }}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-semibold text-gray-900">Sector Allocation</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-2">
                              <ResponsiveContainer width="100%" height={120}>
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: "Technology", value: 30 },
                                      { name: "Financial", value: 25 },
                                      { name: "Healthcare", value: 20 },
                                      { name: "Other", value: 25 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#eab308" />
                                    <Cell fill="#6b7280" />
                                  </Pie>
                                  <RechartsTooltip formatter={(value: number) => `${value}%`} />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="details" className="mt-4">
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold text-gray-900">Details</h3>
                          
                          {/* Transaction Information Section */}
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Transaction Information</h4>
                            <div className="grid grid-cols-2 gap-4">
                              {/* Left Column */}
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Status</Label>
                                  <Input className="h-7 text-[11px]" value={selectedTransactionData.status} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Transaction Type</Label>
                                  <Input className="h-7 text-[11px] font-semibold" value={selectedTransactionData.type} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Source Identifier</Label>
                                  <Input className="h-7 text-[11px]" value="470704410" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">ID</Label>
                                  <Input className="h-7 text-[11px]" value="43453037" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Sequence</Label>
                                  <Input className="h-7 text-[11px]" value="185" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Product Indicator</Label>
                                  <Input className="h-7 text-[11px]" value="-" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Contribution Type</Label>
                                  <Input className="h-7 text-[11px]" value="N/A" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">EPA Status</Label>
                                  <Input className="h-7 text-[11px]" value="Unknown" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Conversion</Label>
                                  <Input className="h-7 text-[11px]" value="No" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Trade Context</Label>
                                  <Input className="h-7 text-[11px]" value="Not Set" readOnly />
                                </div>
                              </div>
                              
                              {/* Right Column */}
                              <div className="space-y-3">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Trade Date</Label>
                                  <Input className="h-7 text-[11px]" value={selectedTransactionData.date} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Processing Date</Label>
                                  <Input className="h-7 text-[11px]" value={selectedTransactionData.date} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Order Date</Label>
                                  <Input className="h-7 text-[11px]" value={selectedTransactionData.date} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Settlement Date</Label>
                                  <Input className="h-7 text-[11px]" value={selectedTransactionData.date} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Use Trust Accounting</Label>
                                  <Input className="h-7 text-[11px]" value="No" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Trust Bank Account</Label>
                                  <Input className="h-7 text-[11px]" value="" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Wire Order</Label>
                                  <Input className="h-7 text-[11px]" value="" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Taxable Event Indicator</Label>
                                  <Input className="h-7 text-[11px]" value="" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">First 60 days</Label>
                                  <Input className="h-7 text-[11px]" value="No" readOnly />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Sub-Sections */}
                          <div className="grid grid-cols-3 gap-4">
                            {/* Quantities */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Quantities</h4>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Amount</Label>
                                  <Input className="h-7 text-[11px]" value={selectedTransactionData.grossAmount} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Unit Type</Label>
                                  <Input className="h-7 text-[11px]" value="dollars" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Shares</Label>
                                  <Input className="h-7 text-[11px]" value="0.0650" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Share Balance</Label>
                                  <Input className="h-7 text-[11px]" value={selectedTransactionData.shareBalance} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Unit Price</Label>
                                  <Input className="h-7 text-[11px]" value={selectedTransactionData.price} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Average Cost</Label>
                                  <Input className="h-7 text-[11px]" value="$12.9084" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Gross Amount</Label>
                                  <Input className="h-7 text-[11px]" value={selectedTransactionData.grossAmount} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Reversal</Label>
                                  <Input className="h-7 text-[11px]" value="No" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Settlement Amount</Label>
                                  <Input className="h-7 text-[11px]" value="$0.00" readOnly />
                                </div>
                              </div>
                            </div>

                            {/* Earnings */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Earnings</h4>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">FEL Max Rate (%)</Label>
                                  <Input className="h-7 text-[11px]" value="0" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">DSC Rate (%)</Label>
                                  <Input className="h-7 text-[11px]" value="0" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Dealer Commission</Label>
                                  <Input className="h-7 text-[11px]" value="$0.00" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Dealer At Time Of Trade</Label>
                                  <Input className="h-7 text-[11px]" value="9823" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Rep At Time Of Trade</Label>
                                  <Input className="h-7 text-[11px]" value="2232 Marsh, Antoine" readOnly />
                                </div>
                              </div>
                            </div>

                            {/* Fees And Charges */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Fees And Charges</h4>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Withholding Tax</Label>
                                  <Input className="h-7 text-[11px]" value="0.0000" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">DSC</Label>
                                  <Input className="h-7 text-[11px]" value="0.0000" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">HST</Label>
                                  <Input className="h-7 text-[11px]" value="$0.00" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Fees</Label>
                                  <Input className="h-7 text-[11px]" value="$0.00" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">LSIF Federal Clawback</Label>
                                  <Input className="h-7 text-[11px]" value="$0.00" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">LSIF Provincial Clawback</Label>
                                  <Input className="h-7 text-[11px]" value="$0.00" readOnly />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="fundserv" className="mt-4">
                        <div className="space-y-4">
                          {/* Fundserv Processing Section */}
                          <div className="bg-blue-50 p-3 rounded border border-blue-200">
                            <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Fundserv Processing</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Net Commission Settlement</Label>
                                <Input className="h-7 text-[11px]" value="N/A" readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Response Status</Label>
                                <Input className="h-7 text-[11px]" value="Unknown" readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Response Source</Label>
                                <Input className="h-7 text-[11px]" value="" readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Settlement Source</Label>
                                <Input className="h-7 text-[11px]" value="N/A" readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Order Source</Label>
                                <Input className="h-7 text-[11px]" value="Fund Company" readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Interactive Order Status</Label>
                                <Input className="h-7 text-[11px]" value="Unreleased" readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Settlement Method</Label>
                                <Input className="h-7 text-[11px]" value="N/A" readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Revision Number</Label>
                                <Input className="h-7 text-[11px]" value="0" readOnly />
                              </div>
                            </div>
                          </div>

                          {/* Trading Files Section */}
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Trading Files</h4>
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-100">
                                  <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Created</TableHead>
                                  <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Type</TableHead>
                                  <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">File Name</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="text-[10px] py-1.5 px-2 text-gray-900">04-28-2025 07:13:58</TableCell>
                                  <TableCell className="text-[10px] py-1.5 px-2 text-gray-900">Transaction Reconciliation</TableCell>
                                  <TableCell className="text-[10px] py-1.5 px-2 text-gray-900">TSP0009823.042525CIG9.Z01</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>

                          {/* Errors Section */}
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Errors</h4>
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-100">
                                  <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Error Message</TableHead>
                                  <TableHead className="text-[10px] font-semibold text-gray-900 py-1.5 px-2">Return Code</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell colSpan={2} className="text-center py-4">
                                    <p className="text-xs text-gray-500">No errors found</p>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="payment-instructions" className="mt-4">
                        <div className="space-y-4">
                          {/* Misc Payment Settings Section */}
                          <div className="bg-white rounded border border-gray-200 overflow-hidden">
                            <div className="bg-blue-600 text-white px-3 py-2">
                              <h4 className="text-xs font-semibold">Misc Payment Settings</h4>
                            </div>
                            <div className="p-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Nominee Payment Option</Label>
                                  <Input className="h-7 text-[11px] font-semibold" value="N/A" readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Cash Distribution Payment Option</Label>
                                  <Input className="h-7 text-[11px] font-semibold" value="Default (N$M if eligible)" readOnly />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Cheque Information Section */}
                          <div className="bg-white rounded border border-gray-200 overflow-hidden">
                            <div className="bg-blue-600 text-white px-3 py-2">
                              <h4 className="text-xs font-semibold">Cheque Information</h4>
                            </div>
                            <div className="p-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">Cheque Paid To Client</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">City</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">Country</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">No</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">Address</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">Province</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">Postal</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* EFT Information Section */}
                          <div className="bg-white rounded border border-gray-200 overflow-hidden">
                            <div className="bg-blue-600 text-white px-3 py-2">
                              <h4 className="text-xs font-semibold">EFT Information</h4>
                            </div>
                            <div className="p-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">Account Holder</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">Institution Number</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                </div>
                                <div className="space-y-3">
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">Transit Number</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                  <div>
                                    <Label className="text-[10px] text-gray-500 mb-0.5 block">Account Number</Label>
                                    <Input className="h-7 text-[11px]" value="" readOnly />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="notes" className="mt-4">
                        <div className="space-y-4">
                          <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                            New Transaction Note
                          </Button>
                          <div className="bg-gray-100 border border-gray-200 rounded p-8 min-h-[300px]">
                            {/* Empty notes area - notes will be displayed here */}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="attachments" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Fund Transaction Attachments</h3>
                            <div className="flex items-center gap-2 mb-4">
                              <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                                Add New Attachment
                              </Button>
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                                Link Existing Attachment
                              </Button>
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                                Unlink Attachment
                              </Button>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2">
                                <Checkbox id="include-inactive-transaction-attachments" />
                                <Label htmlFor="include-inactive-transaction-attachments" className="text-[10px] text-gray-700 cursor-pointer">Include Inactive</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox id="include-trust-transaction-attachments" />
                                <Label htmlFor="include-trust-transaction-attachments" className="text-[10px] text-gray-700 cursor-pointer">Include attachments from Trust Transactions</Label>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Attachments</h4>
                            <div className="py-8">
                              <p className="text-xs text-gray-500 text-center">No attachments found</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="reviews" className="mt-4">
                        <div className="space-y-4">
                          <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                            Add New Response
                          </Button>
                          <div>
                            <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Reviews</h3>
                            <div className="py-8">
                              <p className="text-xs text-gray-500 italic text-center">No reviews found</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="related-transactions" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Related Transactions</h3>
                            <div className="bg-blue-50 p-4 rounded border border-blue-200">
                              <div className="flex items-center gap-2 mb-4">
                                <Checkbox id="conversion" />
                                <Label htmlFor="conversion" className="text-[10px] text-gray-700 cursor-pointer">Conversion</Label>
                              </div>
                              <p className="text-xs text-gray-500 italic">No Related Transactions</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : selectedFundAccountData ? (
                  /* Fund Account Details */
                  <div className="space-y-4">
                    <Tabs value={fundAccountDetailTab} onValueChange={(value) => setFundAccountDetailTab(value)}>
                      <div className="w-full overflow-x-auto overflow-y-visible mb-4 min-w-0">
                        <TabsList className="inline-flex h-auto p-1 gap-6 min-w-full w-max">
                          <TabsTrigger value="summary" className="text-xs whitespace-nowrap flex-shrink-0">Summary</TabsTrigger>
                          <TabsTrigger value="details" className="text-xs whitespace-nowrap flex-shrink-0">Details</TabsTrigger>
                          <TabsTrigger value="tools" className="text-xs whitespace-nowrap flex-shrink-0">Tools</TabsTrigger>
                          <TabsTrigger value="notes" className="text-xs whitespace-nowrap flex-shrink-0">
                            Notes
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TabsTrigger>
                          <TabsTrigger value="attachments" className="text-xs whitespace-nowrap flex-shrink-0">
                            Attachments
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TabsTrigger>
                          <TabsTrigger value="allocations" className="text-xs whitespace-nowrap flex-shrink-0">
                            Allocations
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TabsTrigger>
                          <TabsTrigger value="product-documents-delivery" className="text-xs whitespace-nowrap flex-shrink-0">
                            Product Documents Delivery
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TabsTrigger>
                          <TabsTrigger value="price-history" className="text-xs whitespace-nowrap flex-shrink-0">
                            Price History
                            <HelpCircle className="h-3 w-3 ml-1" />
                          </TabsTrigger>
                        </TabsList>
                      </div>
                      
                      <TabsContent value="summary" className="mt-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          {/* Investment Summary Tile - Row 1, Col 1 */}
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

                          {/* Asset Allocation Tile - Row 1, Col 2 */}
                          <Card 
                            className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              setFundAccountDetailTab("allocations");
                            }}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-semibold text-gray-900">Asset Allocation</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-2">
                              <ResponsiveContainer width="100%" height={120}>
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: "Equity", value: 45 },
                                      { name: "Bonds", value: 30 },
                                      { name: "Cash", value: 15 },
                                      { name: "Other", value: 10 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#eab308" />
                                    <Cell fill="#6b7280" />
                                  </Pie>
                                  <RechartsTooltip formatter={(value: number) => `${value}%`} />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>

                          {/* Geographic Allocation Tile - Row 1, Col 3 */}
                          <Card 
                            className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              setFundAccountDetailTab("allocations");
                            }}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-semibold text-gray-900">Geographic Allocation</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-2">
                              <ResponsiveContainer width="100%" height={120}>
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: "North America", value: 50 },
                                      { name: "Europe", value: 25 },
                                      { name: "Asia", value: 15 },
                                      { name: "Other", value: 10 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#eab308" />
                                    <Cell fill="#6b7280" />
                                  </Pie>
                                  <RechartsTooltip formatter={(value: number) => `${value}%`} />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>

                          {/* Sector Allocation Tile - Row 1, Col 4 */}
                          <Card 
                            className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => {
                              setFundAccountDetailTab("allocations");
                            }}
                          >
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm font-semibold text-gray-900">Sector Allocation</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-2">
                              <ResponsiveContainer width="100%" height={120}>
                                <PieChart>
                                  <Pie
                                    data={[
                                      { name: "Technology", value: 30 },
                                      { name: "Financial", value: 25 },
                                      { name: "Healthcare", value: 20 },
                                      { name: "Other", value: 25 },
                                    ]}
                                    cx="50%"
                                    cy="50%"
                                    outerRadius={50}
                                    fill="#8884d8"
                                    dataKey="value"
                                  >
                                    <Cell fill="#3b82f6" />
                                    <Cell fill="#22c55e" />
                                    <Cell fill="#eab308" />
                                    <Cell fill="#6b7280" />
                                  </Pie>
                                  <RechartsTooltip formatter={(value: number) => `${value}%`} />
                                </PieChart>
                              </ResponsiveContainer>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Second Row - Trading Actions Tile */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch mt-4">
                          {/* Trading Actions Tile */}
                          <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                            <CardContent className="p-6 flex-1 flex items-center justify-center">
                              <div className="flex items-center justify-center gap-3">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 w-8 p-0 hover:bg-gray-100"
                                  title="Buy more units"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedFundAccountData) {
                                      const priceStr = selectedFundAccountData.currentPrice || "$0.00";
                                      const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
                                      const marketValueNum = parseFloat(selectedFundAccountData.marketValue.replace(/[^0-9.]/g, ''));
                                      const units = price > 0 ? (marketValueNum / price) : 0;
                                      const marketValueFormatted = marketValueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                      
                                      // Find the plan that contains this fund account
                                      const planData = Object.values(clientData.summaryData).find((p: any) => 
                                        p.investments && p.investments.includes(selectedFundAccount)
                                      ) as any;
                                      const plan = planData ? plansList.find(p => p.id === planData.id) : null;
                                      const planInvestments = planData ? getPlanInvestments(planData.id) : [];
                                      const planBalance = getPlanTotalValue(planInvestments);
                                      
                                      setDialogContext("fund");
                                      setSelectedProduct({
                                        product: selectedFundAccountData.productName,
                                        units: units > 0 ? units.toFixed(2) : "0.00",
                                        price: price > 0 ? `$${price.toFixed(2)}` : "$0.00",
                                        marketValue: `$${marketValueFormatted}`
                                      });
                                      setSelectedPlan({
                                        shortType: plan?.type || "RRSP",
                                        accountNumber: plan?.accountNumber || ""
                                      });
                                      setSelectedPlanBalance(planBalance);
                                      setInvestmentAmount("");
                                      setNumberOfUnits("");
                                      setIsBuyUnitsDialogOpen(true);
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedFundAccountData) {
                                      const priceStr = selectedFundAccountData.currentPrice || "$0.00";
                                      const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
                                      const marketValueNum = parseFloat(selectedFundAccountData.marketValue.replace(/[^0-9.]/g, ''));
                                      const units = price > 0 ? (marketValueNum / price) : 0;
                                      const marketValueFormatted = marketValueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                      
                                      // Find the plan that contains this fund account
                                      const planData = Object.values(clientData.summaryData).find((p: any) => 
                                        p.investments && p.investments.includes(selectedFundAccount)
                                      ) as any;
                                      const plan = planData ? plansList.find(p => p.id === planData.id) : null;
                                      const planInvestments = planData ? getPlanInvestments(planData.id) : [];
                                      const planBalance = getPlanTotalValue(planInvestments);
                                      
                                      setDialogContext("fund");
                                      setSelectedProduct({
                                        product: selectedFundAccountData.productName,
                                        units: units > 0 ? units.toFixed(2) : "0.00",
                                        price: price > 0 ? `$${price.toFixed(2)}` : "$0.00",
                                        marketValue: `$${marketValueFormatted}`
                                      });
                                      setSelectedPlan({
                                        shortType: plan?.type || "RRSP",
                                        accountNumber: plan?.accountNumber || ""
                                      });
                                      setSelectedPlanBalance(planBalance);
                                      setSellUnits("");
                                      setSellDollarAmount("");
                                      setIsSellUnitsDialogOpen(true);
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
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (selectedFundAccountData) {
                                      const priceStr = selectedFundAccountData.currentPrice || "$0.00";
                                      const price = parseFloat(priceStr.replace(/[^0-9.]/g, '')) || 0;
                                      const marketValueNum = parseFloat(selectedFundAccountData.marketValue.replace(/[^0-9.]/g, ''));
                                      const units = price > 0 ? (marketValueNum / price) : 0;
                                      const marketValueFormatted = marketValueNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
                                      
                                      // Find the plan that contains this fund account
                                      const planData = Object.values(clientData.summaryData).find((p: any) => 
                                        p.investments && p.investments.includes(selectedFundAccount)
                                      ) as any;
                                      const plan = planData ? plansList.find(p => p.id === planData.id) : null;
                                      const planInvestments = planData ? getPlanInvestments(planData.id) : [];
                                      const planBalance = getPlanTotalValue(planInvestments);
                                      
                                      setDialogContext("fund");
                                      setSelectedProduct({
                                        product: selectedFundAccountData.productName,
                                        units: units > 0 ? units.toFixed(2) : "0.00",
                                        price: price > 0 ? `$${price.toFixed(2)}` : "$0.00",
                                        marketValue: `$${marketValueFormatted}`,
                                        supplier: selectedFundAccountData.supplier
                                      });
                                      setSelectedPlan({
                                        shortType: plan?.type || "RRSP",
                                        accountNumber: plan?.accountNumber || ""
                                      });
                                      setSelectedPlanBalance(planBalance);
                                      setSelectedFundCompany("");
                                      setSelectedFundToSwitch("");
                                      setUnitsToSwitch("");
                                      setCompanySearchTerm("");
                                      setFundSearchTerm("");
                                      setIsSwitchDialogOpen(true);
                                    }
                                  }}
                                >
                                  <ArrowLeftRight className="h-4 w-4" />
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Third Row - Additional Empty Tiles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch mt-4">
                          {/* Empty Tile */}
                          <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-3 flex-1">
                            </CardContent>
                          </Card>

                          {/* Empty Tile */}
                          <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-3 flex-1">
                            </CardContent>
                          </Card>

                          {/* Empty Tile */}
                          <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-3 flex-1">
                            </CardContent>
                          </Card>

                          {/* Notices Tile */}
                          <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Notices</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-3 flex-1 flex items-center justify-center">
                              <p className="text-xs text-gray-400">No notices</p>
                            </CardContent>
                          </Card>
                        </div>

                        {/* Fourth Row - Additional Empty Tiles */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch mt-4">
                          {/* Empty Tile */}
                          <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-3 flex-1">
                            </CardContent>
                          </Card>

                          {/* Empty Tile */}
                          <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-3 flex-1">
                            </CardContent>
                          </Card>

                          {/* Empty Tile */}
                          <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-3 flex-1">
                            </CardContent>
                          </Card>

                          {/* Empty Tile */}
                          <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                            <CardHeader className="pb-3">
                              <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                            </CardHeader>
                            <CardContent className="pt-0 pb-3 flex-1">
                            </CardContent>
                          </Card>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="details" className="mt-4">
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold text-gray-900">Details</h3>
                          
                          {/* Product Information Section */}
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Product Information</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Product Code</Label>
                                <div className="flex items-center gap-2">
                                  <span className="text-xs text-blue-600 underline cursor-pointer">{selectedFundAccountData.productCode}</span>
                                  <Button size="sm" className="h-6 text-[10px] bg-blue-600 hover:bg-blue-700 text-white">
                                    View Fund Info
                                  </Button>
                                </div>
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Product Name</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.productName} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Supplier</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.supplier} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Category</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.category} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Risk</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.risk} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Investment Objective</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.investmentObjective} readOnly />
                              </div>
                            </div>
                          </div>

                          {/* Account & Rate Information Section */}
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Account & Rate Information</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Account Number</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.accountNumber} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Rate Type</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.rateType} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">DSC Rate</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.dscRate} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">FEL Max Rate</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.felMaxRate} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Distribution Option</Label>
                                <Select defaultValue={selectedFundAccountData.distributionOption.toLowerCase().replace(/\s+/g, '-')}>
                                  <SelectTrigger className="h-7 text-[11px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="reinvest">Reinvest</SelectItem>
                                    <SelectItem value="cash">Cash</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Certificate</Label>
                                <Select defaultValue={selectedFundAccountData.certificate.toLowerCase().replace(/\s+/g, '-')}>
                                  <SelectTrigger className="h-7 text-[11px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="no-certificate">No Certificate</SelectItem>
                                    <SelectItem value="certificate">Certificate</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                          </div>

                          {/* Price & Share Information Section */}
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Price & Share Information</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Current Price</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.currentPrice} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Price Date</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.priceDate} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Total Shares Issued</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.totalSharesIssued} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Total Shares Unissued</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.totalSharesUnissued} readOnly />
                              </div>
                            </div>
                          </div>

                          {/* Date & Status Information Section */}
                          <div className="bg-white p-3 rounded border border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-900 mb-3 pb-1 border-b-2 border-blue-600">Date & Status Information</h4>
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Start Date</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.startDate} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">End Date</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.endDate || ""} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Effective Date</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.effectiveDate} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Last Sequence</Label>
                                <Input className="h-7 text-[11px]" value={selectedFundAccountData.lastSequence} readOnly />
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox id="active" checked={selectedFundAccountData.active} />
                                <Label htmlFor="active" className="text-[10px] text-gray-500 cursor-pointer">Active</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox id="exclude-duplicate" checked={selectedFundAccountData.excludeFromDuplicate} />
                                <Label htmlFor="exclude-duplicate" className="text-[10px] text-gray-500 cursor-pointer">Exclude from Duplicate exception reports</Label>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="tools" className="mt-4" key={`tools-${id}-${selectedFundAccount}`}>
                        <div className="space-y-4">
                          {/* Market Value Calculator */}
                          <div className="bg-blue-50 rounded border border-blue-200">
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-t">
                              <h3 className="text-xs font-semibold">Market Value Calculator</h3>
                            </div>
                            <div className="p-3 space-y-3" key={`market-value-${id}-${selectedFundAccount}`}>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Current Market Value</Label>
                                <Input className="h-7 text-[11px]" value={calculatorValues.currentMarketValue} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Historical Market Value Target Date</Label>
                                <div className="flex items-center gap-2">
                                  <Input className="h-7 text-[11px]" value={calculatorValues.historicalTargetDate} readOnly />
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white">
                                  Historical Market Value
                                </Button>
                                <div className="flex-1">
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">CAD</Label>
                                  <Input className="h-7 text-[11px]" value={calculatorValues.historicalMarketValue} readOnly />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Share Balance Calculator */}
                          <div className="bg-blue-50 rounded border border-blue-200">
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-t">
                              <h3 className="text-xs font-semibold">Share Balance Calculator</h3>
                            </div>
                            <div className="p-3 space-y-3" key={`share-balance-${id}-${selectedFundAccount}`}>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Current Share Balance</Label>
                                <Input className="h-7 text-[11px]" value={calculatorValues.currentShareBalance} readOnly />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Historical Share Balance Target Date</Label>
                                <div className="flex items-center gap-2">
                                  <Input className="h-7 text-[11px]" value={calculatorValues.historicalTargetDate} readOnly />
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white">
                                  Calculate Historical Share Balance
                                </Button>
                                <div className="flex-1">
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Historical Share Balance</Label>
                                  <Input className="h-7 text-[11px]" value={calculatorValues.historicalShareBalance} readOnly />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Adjusted Cost Base Calculator */}
                          <div className="bg-blue-50 rounded border border-blue-200">
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-t">
                              <h3 className="text-xs font-semibold">Adjusted Cost Base (Book Value) Calculator</h3>
                            </div>
                            <div className="p-3" key={`cost-base-${id}-${selectedFundAccount}`}>
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white">
                                  Adjusted Cost Base
                                </Button>
                                <div className="flex-1">
                                  <Input className="h-7 text-[11px]" value={calculatorValues.adjustedCostBase} readOnly />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Rate Of Return Calculator */}
                          <div className="bg-blue-50 rounded border border-blue-200">
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-t">
                              <h3 className="text-xs font-semibold">Rate Of Return Calculator</h3>
                            </div>
                            <div className="p-3 space-y-3" key={`rate-return-${id}-${selectedFundAccount}`}>
                              <div className="flex items-center gap-2">
                                <Checkbox id="since-inception" />
                                <Label htmlFor="since-inception" className="text-[10px] text-gray-500 cursor-pointer">Since Inception</Label>
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Rate of Return Start Date</Label>
                                <div className="flex items-center gap-2">
                                  <Input className="h-7 text-[11px]" value={calculatorValues.rateOfReturnStartDate} readOnly />
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                </div>
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Rate of Return End Date</Label>
                                <div className="flex items-center gap-2">
                                  <Input className="h-7 text-[11px]" value={calculatorValues.rateOfReturnEndDate} readOnly />
                                  <Calendar className="h-4 w-4 text-gray-500" />
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white">
                                  Rate of Return
                                </Button>
                                <div className="flex-1">
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">XIRR Rate of Return</Label>
                                  <Input className="h-7 text-[11px]" value={calculatorValues.rateOfReturn} readOnly />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Other Section */}
                          <div className="bg-blue-50 rounded border border-blue-200">
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-t">
                              <h3 className="text-xs font-semibold">Other</h3>
                            </div>
                            <div className="p-3 flex gap-2">
                              <Button size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white">
                                Fund Alerts
                              </Button>
                              <Button size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white">
                                Start KYP Review
                              </Button>
                            </div>
                          </div>

                          {/* Redemption Calculator */}
                          <div className="bg-blue-50 rounded border border-blue-200">
                            <div className="bg-blue-600 text-white px-3 py-2 rounded-t">
                              <h3 className="text-xs font-semibold">Redemption Calculator</h3>
                            </div>
                            <div className="p-3 space-y-3">
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Gross Amount</Label>
                                <Input className="h-7 text-[11px]" value="$0.00" />
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Withholding Tax Rate</Label>
                                <p className="text-[10px] text-gray-700">Auto calculated.</p>
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Fee</Label>
                                <Select defaultValue="partial-redemption">
                                  <SelectTrigger className="h-7 text-[11px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="partial-redemption">Partial Redemption: $50.00 + Tax</SelectItem>
                                    <SelectItem value="full-redemption">Full Redemption: $0.00</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Provincial Tax</Label>
                                <Select defaultValue="ontario">
                                  <SelectTrigger className="h-7 text-[11px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="ontario">ONTARIO 13.0%</SelectItem>
                                    <SelectItem value="quebec">QUEBEC 14.975%</SelectItem>
                                    <SelectItem value="bc">BRITISH COLUMBIA 12.0%</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Net Amount</Label>
                                <Input className="h-7 text-[11px]" value="$0.00" readOnly />
                              </div>
                              <div className="flex gap-2">
                                <Button size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white flex-1">
                                  Calculate Net Amount
                                </Button>
                                <Button size="sm" className="h-7 text-[10px] bg-blue-600 hover:bg-blue-700 text-white flex-1">
                                  Calculate Gross Amount
                                </Button>
                              </div>
                              <p className="text-[9px] text-gray-500 italic mt-2">
                                *Calculator only valid for clients residing in provinces your dealership is registered to service.
                              </p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="notes" className="mt-4">
                        <div className="space-y-4">
                          <h3 className="text-xs font-semibold text-gray-900">Notes</h3>
                          <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                            New Fund Account Note
                          </Button>
                          <div className="bg-gray-100 border border-gray-200 rounded p-8 min-h-[200px]">
                            {/* Empty notes area - notes will be displayed here */}
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="attachments" className="mt-4">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Fund Account Attachments</h3>
                            <div className="flex items-center gap-2 mb-4">
                              <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                                Add New Attachment
                              </Button>
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                                Link Existing Attachment
                              </Button>
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                                Unlink Attachment
                              </Button>
                            </div>
                            <div className="space-y-2 mb-4">
                              <div className="flex items-center gap-2">
                                <Checkbox id="include-inactive-attachments" />
                                <Label htmlFor="include-inactive-attachments" className="text-[10px] text-gray-700 cursor-pointer">Include Inactive</Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox id="include-transaction-attachments" />
                                <Label htmlFor="include-transaction-attachments" className="text-[10px] text-gray-700 cursor-pointer">Include attachments from Transactions and Trust Transactions</Label>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Attachments</h4>
                            <div className="py-8">
                              <p className="text-xs text-gray-500 text-center">No attachments found</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="allocations" className="mt-4">
                        <div className="space-y-4">
                          <Tabs value={fundAccountAllocationsView} onValueChange={(value) => setFundAccountAllocationsView(value as "chart" | "table")}>
                            <TabsList className="grid w-full grid-cols-2 h-8 mb-4">
                              <TabsTrigger value="chart" className="text-xs">Allocations (Chart)</TabsTrigger>
                              <TabsTrigger value="table" className="text-xs">Allocations (Table)</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="chart" className="mt-4">
                              <div className="grid grid-cols-3 gap-4">
                                {/* Geographic Allocation */}
                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <h4 className="text-xs font-semibold text-gray-900 mb-4 text-center">Geographic Allocation</h4>
                                  <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                      <Pie
                                        data={[
                                          { name: "United States", value: 53.38, color: "#FFC107" },
                                          { name: "Canada", value: 35.58, color: "#F44336" },
                                          { name: "European Union", value: 3.93, color: "#4CAF50" },
                                          { name: "Multi-National", value: 3.38, color: "#2196F3" },
                                          { name: "Asia/Pacific Rim", value: 2.57, color: "#E91E63" },
                                          { name: "All others", value: 1.16, color: "#9E9E9E" },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={false}
                                      >
                                        <Cell fill="#FFC107" />
                                        <Cell fill="#F44336" />
                                        <Cell fill="#4CAF50" />
                                        <Cell fill="#2196F3" />
                                        <Cell fill="#E91E63" />
                                        <Cell fill="#9E9E9E" />
                                      </Pie>
                                      <RechartsTooltip />
                                    </PieChart>
                                  </ResponsiveContainer>
                                  <div className="mt-4 space-y-1">
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#FFC107" }}></div>
                                      <span className="text-gray-700">United States</span>
                                      <span className="ml-auto text-gray-500">53.38%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F44336" }}></div>
                                      <span className="text-gray-700">Canada</span>
                                      <span className="ml-auto text-gray-500">35.58%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#4CAF50" }}></div>
                                      <span className="text-gray-700">European Union</span>
                                      <span className="ml-auto text-gray-500">3.93%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#2196F3" }}></div>
                                      <span className="text-gray-700">Multi-National</span>
                                      <span className="ml-auto text-gray-500">3.38%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#E91E63" }}></div>
                                      <span className="text-gray-700">Asia/Pacific Rim</span>
                                      <span className="ml-auto text-gray-500">2.57%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#9E9E9E" }}></div>
                                      <span className="text-gray-700">All others</span>
                                      <span className="ml-auto text-gray-500">1.16%</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Asset Allocation */}
                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <h4 className="text-xs font-semibold text-gray-900 mb-4 text-center">Asset Allocation</h4>
                                  <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                      <Pie
                                        data={[
                                          { name: "US Equity", value: 27.34, color: "#03A9F4" },
                                          { name: "Foreign Bonds", value: 25.86, color: "#3F51B5" },
                                          { name: "Canadian Equity", value: 14.88, color: "#E91E63" },
                                          { name: "Domestic Bonds", value: 9.90, color: "#4CAF50" },
                                          { name: "Income Trust Units", value: 9.41, color: "#FFC107" },
                                          { name: "International Equity", value: 4.77, color: "#F44336" },
                                          { name: "Cash and Equivalents", value: 4.54, color: "#FF9800" },
                                          { name: "Other", value: 3.30, color: "#9E9E9E" },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={false}
                                      >
                                        <Cell fill="#03A9F4" />
                                        <Cell fill="#3F51B5" />
                                        <Cell fill="#E91E63" />
                                        <Cell fill="#4CAF50" />
                                        <Cell fill="#FFC107" />
                                        <Cell fill="#F44336" />
                                        <Cell fill="#FF9800" />
                                        <Cell fill="#9E9E9E" />
                                      </Pie>
                                      <RechartsTooltip />
                                    </PieChart>
                                  </ResponsiveContainer>
                                  <div className="mt-4 space-y-1">
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#03A9F4" }}></div>
                                      <span className="text-gray-700">US Equity</span>
                                      <span className="ml-auto text-gray-500">27.34%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#3F51B5" }}></div>
                                      <span className="text-gray-700">Foreign Bonds</span>
                                      <span className="ml-auto text-gray-500">25.86%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#E91E63" }}></div>
                                      <span className="text-gray-700">Canadian Equity</span>
                                      <span className="ml-auto text-gray-500">14.88%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#4CAF50" }}></div>
                                      <span className="text-gray-700">Domestic Bonds</span>
                                      <span className="ml-auto text-gray-500">9.90%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#FFC107" }}></div>
                                      <span className="text-gray-700">Income Trust Units</span>
                                      <span className="ml-auto text-gray-500">9.41%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F44336" }}></div>
                                      <span className="text-gray-700">International Equity</span>
                                      <span className="ml-auto text-gray-500">4.77%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#FF9800" }}></div>
                                      <span className="text-gray-700">Cash and Equivalents</span>
                                      <span className="ml-auto text-gray-500">4.54%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#9E9E9E" }}></div>
                                      <span className="text-gray-700">Other</span>
                                      <span className="ml-auto text-gray-500">3.30%</span>
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Sector Allocation */}
                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <h4 className="text-xs font-semibold text-gray-900 mb-4 text-center">Sector Allocation</h4>
                                  <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                      <Pie
                                        data={[
                                          { name: "Fixed Income", value: 35.61, color: "#E91E63" },
                                          { name: "Real Estate", value: 22.78, color: "#F44336" },
                                          { name: "Energy", value: 13.14, color: "#E91E63" },
                                          { name: "Financial Services", value: 7.67, color: "#3F51B5" },
                                          { name: "Utilities", value: 6.18, color: "#4CAF50" },
                                          { name: "Cash and Cash Equivalent", value: 4.54, color: "#FFC107" },
                                          { name: "Mutual Fund", value: 3.43, color: "#4CAF50" },
                                          { name: "Industrial Services", value: 2.41, color: "#FF9800" },
                                          { name: "Telecommunications", value: 2.29, color: "#E91E63" },
                                          { name: "All others", value: 1.95, color: "#9E9E9E" },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={70}
                                        fill="#8884d8"
                                        dataKey="value"
                                        label={false}
                                      >
                                        <Cell fill="#E91E63" />
                                        <Cell fill="#F44336" />
                                        <Cell fill="#E91E63" />
                                        <Cell fill="#3F51B5" />
                                        <Cell fill="#4CAF50" />
                                        <Cell fill="#FFC107" />
                                        <Cell fill="#4CAF50" />
                                        <Cell fill="#FF9800" />
                                        <Cell fill="#E91E63" />
                                        <Cell fill="#9E9E9E" />
                                      </Pie>
                                      <RechartsTooltip />
                                    </PieChart>
                                  </ResponsiveContainer>
                                  <div className="mt-4 space-y-1">
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#E91E63" }}></div>
                                      <span className="text-gray-700">Fixed Income</span>
                                      <span className="ml-auto text-gray-500">35.61%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#F44336" }}></div>
                                      <span className="text-gray-700">Real Estate</span>
                                      <span className="ml-auto text-gray-500">22.78%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#E91E63" }}></div>
                                      <span className="text-gray-700">Energy</span>
                                      <span className="ml-auto text-gray-500">13.14%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#3F51B5" }}></div>
                                      <span className="text-gray-700">Financial Services</span>
                                      <span className="ml-auto text-gray-500">7.67%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#4CAF50" }}></div>
                                      <span className="text-gray-700">Utilities</span>
                                      <span className="ml-auto text-gray-500">6.18%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#FFC107" }}></div>
                                      <span className="text-gray-700">Cash and Cash Equivalent</span>
                                      <span className="ml-auto text-gray-500">4.54%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#4CAF50" }}></div>
                                      <span className="text-gray-700">Mutual Fund</span>
                                      <span className="ml-auto text-gray-500">3.43%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#FF9800" }}></div>
                                      <span className="text-gray-700">Industrial Services</span>
                                      <span className="ml-auto text-gray-500">2.41%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#E91E63" }}></div>
                                      <span className="text-gray-700">Telecommunications</span>
                                      <span className="ml-auto text-gray-500">2.29%</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px]">
                                      <div className="w-3 h-3 rounded" style={{ backgroundColor: "#9E9E9E" }}></div>
                                      <span className="text-gray-700">All others</span>
                                      <span className="ml-auto text-gray-500">1.95%</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </TabsContent>
                            
                            <TabsContent value="table" className="mt-4">
                              <div className="space-y-4">
                                {/* Geographic Allocation */}
                                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                  <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-900 border-b-2 border-blue-600 pb-1 inline-block">Geographic Allocation</h4>
                                  </div>
                                  <Table>
                                    <TableBody>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">United States</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">53.38%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Canada</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">35.58%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">European Union</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">3.93%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Multi-National</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">3.38%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Asia/Pacific Rim</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">2.57%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Japan</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">0.47%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Other</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">-0.10%</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>

                                {/* Asset Allocation */}
                                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                  <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-900 border-b-2 border-blue-600 pb-1 inline-block">Asset Allocation</h4>
                                  </div>
                                  <Table>
                                    <TableBody>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">US Equity</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">27.34%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Foreign Bonds</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">25.86%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Canadian Equity</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">14.88%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Domestic Bonds</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">9.90%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Income Trust Units</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">9.41%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">International Equity</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">4.77%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Cash and Equivalents</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">4.54%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Other</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">3.30%</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>

                                {/* Sector Allocation */}
                                <div className="bg-white rounded border border-gray-200 overflow-hidden">
                                  <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
                                    <h4 className="text-xs font-semibold text-gray-900 border-b-2 border-blue-600 pb-1 inline-block">Sector Allocation</h4>
                                  </div>
                                  <Table>
                                    <TableBody>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Fixed Income</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">35.61%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Real Estate</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">22.78%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Energy</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">13.14%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Financial Services</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">7.67%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Utilities</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">6.18%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Cash and Cash Equivalent</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">4.54%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Mutual Fund</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">3.43%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Industrial Services</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">2.41%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-white">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Telecommunications</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">2.29%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3 text-gray-900">Other</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right text-gray-900">-0.05%</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="product-documents-delivery" className="mt-4">
                        <div className="bg-white rounded border border-gray-200 overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-100">
                                <TableHead className="text-xs font-semibold text-gray-900 py-2 px-3">
                                  <div className="flex items-center gap-1">
                                    <span className="text-blue-600">Delivery Date</span>
                                    <ChevronUp className="h-3 w-3 text-blue-600" />
                                  </div>
                                </TableHead>
                                <TableHead className="text-xs font-semibold text-gray-900 py-2 px-3">Delivery Type</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-900 py-2 px-3">Document Type</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell colSpan={3} className="text-center py-8">
                                  <p className="text-xs text-gray-500">No product document delivery history</p>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </div>
                      </TabsContent>
                      
                      <TabsContent value="price-history" className="mt-4">
                        <div className="space-y-4">
                          {/* Price History Chart */}
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <ResponsiveContainer width="100%" height={300}>
                              <LineChart
                                data={[
                                  { date: "1996-01-01", price: 8.00 },
                                  { date: "2001-01-01", price: 5.00 },
                                  { date: "2006-01-01", price: 2.00 },
                                  { date: "2011-01-01", price: 0.00 },
                                  { date: "2016-01-01", price: -2.00 },
                                  { date: "2021-01-01", price: -5.00 },
                                  { date: "2026-01-01", price: -8.00 },
                                ]}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis 
                                  dataKey="date" 
                                  tick={{ fontSize: 10 }}
                                  tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return `Jan 1 ${date.getFullYear().toString().slice(-2)}`;
                                  }}
                                />
                                <YAxis 
                                  tick={{ fontSize: 10 }}
                                  tickFormatter={(value) => `$${value.toFixed(2)}`}
                                />
                                <RechartsTooltip />
                                <Line 
                                  type="monotone" 
                                  dataKey="price" 
                                  stroke="#3B82F6" 
                                  strokeWidth={2}
                                  dot={false}
                                />
                              </LineChart>
                            </ResponsiveContainer>
                            <p className="text-[9px] text-gray-500 italic mt-2">
                              * This chart shows price history only, and does not include any gains due to dividend/interest distributions.
                            </p>
                          </div>

                          {/* Price List Section */}
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <h4 className="text-xs font-semibold text-gray-900 mb-4">Price List</h4>
                            <div className="space-y-3">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Start Date</Label>
                                  <div className="relative">
                                    <Input className="h-7 text-[11px] pr-8" value="12/19/2025" />
                                    <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">End Date</Label>
                                  <div className="relative">
                                    <Input className="h-7 text-[11px] pr-8" value="12/19/2025" />
                                    <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-500" />
                                  </div>
                                </div>
                              </div>
                              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7">
                                List Prices
                              </Button>
                              <div className="py-4">
                                <p className="text-xs text-gray-500 text-center">No prices found within the given date range.</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>
                ) : (
                  /* Plan Details */
                  <Tabs value={planDetailTab} onValueChange={setPlanDetailTab}>
                  <div className="w-full overflow-x-auto overflow-y-visible mb-4 min-w-0">
                    <TabsList className="inline-flex h-auto p-1 gap-8 min-w-full w-max">
                      <TabsTrigger value="summary" className="text-xs whitespace-nowrap flex-shrink-0">Summary</TabsTrigger>
                      <TabsTrigger value="details" className="text-xs whitespace-nowrap flex-shrink-0">Details</TabsTrigger>
                      <TabsTrigger value="kyc" className="text-xs whitespace-nowrap flex-shrink-0">KYC</TabsTrigger>
                      <TabsTrigger value="beneficiaries" className="text-xs whitespace-nowrap flex-shrink-0">Beneficiaries</TabsTrigger>
                      <TabsTrigger value="actions" className="text-xs whitespace-nowrap flex-shrink-0">Actions</TabsTrigger>
                      <TabsTrigger value="trust-account" className="text-xs whitespace-nowrap flex-shrink-0">Trust Account</TabsTrigger>
                      <TabsTrigger value="reviews" className="text-xs whitespace-nowrap flex-shrink-0">Reviews</TabsTrigger>
                    </TabsList>
                  </div>

                  <TabsContent value="summary" className="mt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
                      {/* Investment Summary Tile - Row 1, Col 1 */}
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

                      {/* Asset Allocation Tile - Row 1, Col 2 */}
                      <Card 
                        className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setPlanDetailTab("details");
                          setPlanDetailsSubTab("allocations");
                        }}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-gray-900">Asset Allocation</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-2">
                          <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "Equity", value: 45 },
                                  { name: "Bonds", value: 30 },
                                  { name: "Cash", value: 15 },
                                  { name: "Other", value: 10 },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                <Cell fill="#3b82f6" />
                                <Cell fill="#22c55e" />
                                <Cell fill="#eab308" />
                                <Cell fill="#6b7280" />
                              </Pie>
                              <RechartsTooltip formatter={(value: number) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Geographic Allocation Tile - Row 1, Col 3 */}
                      <Card 
                        className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setPlanDetailTab("details");
                          setPlanDetailsSubTab("allocations");
                        }}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-gray-900">Geographic Allocation</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-2">
                          <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "North America", value: 50 },
                                  { name: "Europe", value: 25 },
                                  { name: "Asia", value: 15 },
                                  { name: "Other", value: 10 },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                <Cell fill="#3b82f6" />
                                <Cell fill="#22c55e" />
                                <Cell fill="#eab308" />
                                <Cell fill="#6b7280" />
                              </Pie>
                              <RechartsTooltip formatter={(value: number) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>

                      {/* Sector Allocation Tile - Row 1, Col 4 */}
                      <Card 
                        className="border border-gray-200 shadow-sm bg-white cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => {
                          setPlanDetailTab("details");
                          setPlanDetailsSubTab("allocations");
                        }}
                      >
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm font-semibold text-gray-900">Sector Allocation</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-2">
                          <ResponsiveContainer width="100%" height={120}>
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "Technology", value: 30 },
                                  { name: "Financial", value: 25 },
                                  { name: "Healthcare", value: 20 },
                                  { name: "Other", value: 25 },
                                ]}
                                cx="50%"
                                cy="50%"
                                outerRadius={50}
                                fill="#8884d8"
                                dataKey="value"
                              >
                                <Cell fill="#3b82f6" />
                                <Cell fill="#22c55e" />
                                <Cell fill="#eab308" />
                                <Cell fill="#6b7280" />
                              </Pie>
                              <RechartsTooltip formatter={(value: number) => `${value}%`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Second Row - Trading Actions Tile */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch mt-4">
                      {/* Trading Actions Tile */}
                      <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                        <CardContent className="p-6 flex-1 flex items-center justify-center">
                          <div className="flex items-center justify-center gap-3">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0 hover:bg-gray-100"
                              title="Buy more units"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (selectedPlanData) {
                                  const planInvestments = getPlanInvestments(selectedPlanData.id);
                                  const planTotal = getPlanTotalValue(planInvestments);
                                  
                                  setDialogContext("plan");
                                  setSelectedProduct(null);
                                  setSelectedPlan({
                                    shortType: selectedPlanData.type || "RRSP",
                                    accountNumber: selectedPlanData.accountNumber || ""
                                  });
                                  setSelectedPlanBalance(planTotal);
                                  setInvestmentAmount("");
                                  setNumberOfUnits("");
                                  setPlanLevelSelectedFund(null);
                                  setPlanLevelFundCompany("");
                                  setPlanLevelCompanySearch("");
                                  setPlanLevelFundSearch("");
                                  setPlanBuyStep("select");
                                  setIsBuyUnitsDialogOpen(true);
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
                              onClick={(e) => {
                                e.stopPropagation();
                                if (selectedPlanData) {
                                  const planInvestments = getPlanInvestments(selectedPlanData.id);
                                  const planTotal = getPlanTotalValue(planInvestments);
                                  
                                  setDialogContext("plan");
                                  setSelectedProduct(null);
                                  setSelectedPlan({
                                    shortType: selectedPlanData.type || "RRSP",
                                    accountNumber: selectedPlanData.accountNumber || ""
                                  });
                                  setSelectedPlanBalance(planTotal);
                                  setSellUnits("");
                                  setSellDollarAmount("");
                                  setPlanLevelSelectedFund(null);
                                  setPlanLevelFundCompany("");
                                  setPlanLevelCompanySearch("");
                                  setPlanLevelFundSearch("");
                                  setIsSellUnitsDialogOpen(true);
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
                              onClick={(e) => {
                                e.stopPropagation();
                                if (selectedPlanData) {
                                  const planInvestments = getPlanInvestments(selectedPlanData.id);
                                  const planTotal = getPlanTotalValue(planInvestments);
                                  
                                  setDialogContext("plan");
                                  setSelectedProduct(null);
                                  setSelectedPlan({
                                    shortType: selectedPlanData.type || "RRSP",
                                    accountNumber: selectedPlanData.accountNumber || ""
                                  });
                                  setSelectedPlanBalance(planTotal);
                                  setSelectedFundCompany("");
                                  setSelectedFundToSwitch("");
                                  setUnitsToSwitch("");
                                  setCompanySearchTerm("");
                                  setFundSearchTerm("");
                                  setPlanLevelSelectedFund(null);
                                  setPlanLevelFundCompany("");
                                  setPlanLevelCompanySearch("");
                                  setPlanLevelFundSearch("");
                                  setPlanSwitchFromFund(null);
                                  setPlanSwitchToFund(null);
                                  setPlanSwitchStep("from");
                                  setIsSwitchDialogOpen(true);
                                }
                              }}
                            >
                              <ArrowLeftRight className="h-4 w-4" />
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Third Row - Additional Allocation Tiles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch mt-4">
                      {/* Empty Tile */}
                      <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3 flex-1">
                        </CardContent>
                      </Card>

                      {/* Empty Tile */}
                      <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3 flex-1">
                        </CardContent>
                      </Card>

                      {/* Empty Tile */}
                      <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3 flex-1">
                        </CardContent>
                      </Card>

                      {/* Notices Tile */}
                      <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-gray-900">Notices</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3 flex-1 flex items-center justify-center">
                          <p className="text-xs text-gray-400">No notices</p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Fourth Row - Additional Empty Tiles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch mt-4">
                      {/* Empty Tile */}
                      <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3 flex-1">
                        </CardContent>
                      </Card>

                      {/* Empty Tile */}
                      <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3 flex-1">
                        </CardContent>
                      </Card>

                      {/* Empty Tile */}
                      <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3 flex-1">
                        </CardContent>
                      </Card>

                      {/* Empty Tile */}
                      <Card className="border border-gray-200 shadow-sm bg-white flex flex-col">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-gray-900">Empty Tile</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-0 pb-3 flex-1">
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent value="details" className="mt-4">
                    {/* Details Sub-tabs */}
                    <Tabs value={planDetailsSubTab} onValueChange={setPlanDetailsSubTab}>
                      <div className="w-full overflow-x-auto overflow-y-visible mb-4 min-w-0">
                        <TabsList className="inline-flex h-auto p-1 gap-6 min-w-full w-max">
                          <TabsTrigger value="details" className="text-xs whitespace-nowrap flex-shrink-0">
                          Details
                          <HelpCircle className="h-3 w-3 ml-1" />
                        </TabsTrigger>
                          <TabsTrigger value="notes" className="text-xs whitespace-nowrap flex-shrink-0">Notes</TabsTrigger>
                          <TabsTrigger value="plan-attachments" className="text-xs whitespace-nowrap flex-shrink-0">Plan Attachments</TabsTrigger>
                          <TabsTrigger value="allocations" className="text-xs whitespace-nowrap flex-shrink-0">Allocations</TabsTrigger>
                          <TabsTrigger value="supplier-accounts" className="text-xs whitespace-nowrap flex-shrink-0">Supplier Accounts</TabsTrigger>
                          <TabsTrigger value="custom-compensation" className="text-xs whitespace-nowrap flex-shrink-0">Custom Compensation</TabsTrigger>
                      </TabsList>
                      </div>

                      <TabsContent value="details" className="mt-4">
                        <div className="grid grid-cols-2 gap-4">
                          {/* Left Column */}
                          <div className="space-y-3">
                            {/* Plan Information */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Plan Information</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">ID</Label>
                                  <Input className="h-7 text-[11px]" value={selectedPlanData.accountNumber} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Type</Label>
                                  <Select value={selectedPlanData?.type?.toLowerCase() || ""}>
                                    <SelectTrigger className="h-7 text-[11px]">
                                      <SelectValue>
                                        {selectedPlanData?.type || "Select type"}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="open">OPEN</SelectItem>
                                      <SelectItem value="rrsp">RRSP</SelectItem>
                                      <SelectItem value="tfsa">TFSA</SelectItem>
                                      <SelectItem value="resp">RESP</SelectItem>
                                      <SelectItem value="rrif">RRIF</SelectItem>
                                      <SelectItem value="lif">LIF</SelectItem>
                                      <SelectItem value="non-registered">Non-Registered</SelectItem>
                                      <SelectItem value="dcpp">DCPP</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Account Designation</Label>
                                  <Select value={planDetails.accountDesignation === "Joint" ? "joint" : planDetails.accountDesignation === "Individual" ? "individual" : "client-name"}>
                                    <SelectTrigger className="h-7 text-[11px]">
                                      <SelectValue>
                                        {planDetails.accountDesignation || "Client Name"}
                                      </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="client-name">Client Name</SelectItem>
                                      <SelectItem value="individual">Individual</SelectItem>
                                      <SelectItem value="joint">Joint</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Current Representative</Label>
                                  <p className="text-[11px] text-blue-600 underline cursor-pointer">{clientDetails.representative.id} {clientDetails.representative.name}</p>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Description</Label>
                                  <Input className="h-7 text-[11px]" value={planDetails.description || ""} placeholder="Enter description" />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Intent Of Use</Label>
                                  <Input className="h-7 text-[11px]" value={planDetails.intentOfUse || ""} placeholder="Enter intent of use" />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Checkbox id="frozen" defaultChecked={planDetails.frozen} className="h-3 w-3" />
                                  <Label htmlFor="frozen" className="text-[10px] text-gray-700 cursor-pointer">Frozen</Label>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Checkbox id="full-freeze" defaultChecked={planDetails.fullFreeze} className="h-3 w-3" />
                                  <Label htmlFor="full-freeze" className="text-[10px] text-gray-700 cursor-pointer">Full Freeze</Label>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Checkbox id="group-account" defaultChecked={planDetails.groupAccount} className="h-3 w-3" />
                                  <Label htmlFor="group-account" className="text-[10px] text-gray-700 cursor-pointer">Group Account</Label>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Group Account ID</Label>
                                  <Select defaultValue={planDetails.groupAccountId || "none"}>
                                    <SelectTrigger className="h-7 text-[11px]">
                                      <SelectValue placeholder="Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="none">None</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Checkbox id="leveraged" defaultChecked={planDetails.leveraged} className="h-3 w-3" />
                                  <Label htmlFor="leveraged" className="text-[10px] text-gray-700 cursor-pointer">Leveraged</Label>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Loan Number</Label>
                                  <Input className="h-7 text-[11px]" defaultValue={planDetails.loanNumber} />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Checkbox id="locked-in" defaultChecked={planDetails.lockedIn} className="h-3 w-3" />
                                  <Label htmlFor="locked-in" className="text-[10px] text-gray-700 cursor-pointer">Locked In</Label>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Recipient</Label>
                                  <Select defaultValue={planDetails.recipient.toLowerCase()}>
                                    <SelectTrigger className="h-7 text-[11px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="individual">Individual</SelectItem>
                                      <SelectItem value="spouse">Spouse</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Intermediary Code</Label>
                                  <Input className="h-7 text-[11px]" value={planDetails.intermediaryCode || ""} key={selectedPlanForDetails} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Intermediary Account Code</Label>
                                  <Input className="h-7 text-[11px]" value={planDetails.intermediaryAccountCode || ""} key={selectedPlanForDetails} readOnly />
                                </div>
                              </div>
                            </div>

                            {/* Plan Custom Questions */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Plan Custom Questions</h3>
                              <div className="space-y-2">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">test</Label>
                                </div>
                              </div>
                            </div>

                            {/* Ensemble Portfolio Details */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Ensemble Portfolio Details</h3>
                              <div className="space-y-1.5">
                                <p className="text-[11px] text-gray-700">This plan is not connected to Ensemble Portfolio</p>
                                <Button variant="outline" size="sm" disabled className="text-[10px] h-6">
                                  Migrate to Ensemble
                                  <HelpCircle className="h-2.5 w-2.5 ml-1" />
                                </Button>
                                <p className="text-[10px] text-gray-500">User does not have access to Ensemble</p>
                              </div>
                            </div>
                          </div>

                          {/* Right Column */}
                          <div className="space-y-3">
                            {/* Important Dates */}
                            <div className="bg-white p-3 rounded border border-gray-200" key={`important-dates-${id}-${selectedPlanForDetails}`}>
                              <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Important Dates</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Start Date</Label>
                                  <div className="flex items-center gap-1.5">
                                    <Input className="h-7 text-[11px]" value={planDetails.startDate || ""} readOnly />
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">End Date</Label>
                                  <div className="flex items-center gap-1.5">
                                    <Input className="h-7 text-[11px]" value={planDetails.endDate || ""} readOnly />
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">KYC On File Date</Label>
                                  <div className="flex items-center gap-1.5">
                                    <Input className="h-7 text-[11px]" value={planDetails.kycOnFileDate || ""} readOnly />
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">KYC Age</Label>
                                  <Input className="h-7 text-[11px]" value={planDetails.kycAge || ""} readOnly />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">KYC Original Received Date</Label>
                                  <div className="flex items-center gap-1.5">
                                    <Input className="h-7 text-[11px]" value={planDetails.kycOriginalReceivedDate || ""} readOnly />
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Revenue Model */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Revenue Model</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Revenue Model</Label>
                                  <Select defaultValue={planDetails.revenueModel.toLowerCase().replace(" ", "-")}>
                                    <SelectTrigger className="h-7 text-[11px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="commissions">Commissions</SelectItem>
                                      <SelectItem value="fee-for-service">Fee for Service</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Fee for Service Amount</Label>
                                  <Input className="h-7 text-[11px]" defaultValue={planDetails.feeForServiceAmount} />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Fee for Service Start Date</Label>
                                  <div className="flex items-center gap-1.5">
                                    <Input className="h-7 text-[11px]" defaultValue={planDetails.feeForServiceStartDate} />
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 pt-4">
                                  <Checkbox id="ffs-approved" defaultChecked={planDetails.feeForServiceApproved} className="h-3 w-3" />
                                  <Label htmlFor="ffs-approved" className="text-[10px] text-gray-700 cursor-pointer">Fee for Service Approved</Label>
                                </div>
                              </div>
                            </div>

                            {/* Plan Fee Settings */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Plan Fee Settings</h3>
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-50">
                                    <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2">Schedule Name</TableHead>
                                    <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2">Setting Option</TableHead>
                                    <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2">Start Date</TableHead>
                                    <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2">Bank Account</TableHead>
                                    <TableHead className="text-[10px] font-semibold text-gray-700 py-1 px-2">Override Fund</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  <TableRow>
                                    <TableCell colSpan={5} className="text-center py-2">
                                      <p className="text-[10px] text-gray-500 italic">No records found.</p>
                                    </TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>

                            {/* Plan FFS Override Fund */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Plan FFS Override Fund</h3>
                              <div>
                                <Label className="text-[10px] text-gray-500 mb-0.5 block">Plan FFS Override Fund</Label>
                                <Select defaultValue="none">
                                  <SelectTrigger className="h-7 text-[11px]">
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">None</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            {/* Additional Financial Interest */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Additional Financial Interest</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Does anyone else have trading authorization?</Label>
                                  <Select defaultValue="no">
                                    <SelectTrigger className="h-7 text-[11px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes</SelectItem>
                                      <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Name</Label>
                                  <Input className="h-7 text-[11px]" />
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Does anyone else have a Financial Interest?</Label>
                                  <Select defaultValue="no">
                                    <SelectTrigger className="h-7 text-[11px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="yes">Yes</SelectItem>
                                      <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Name</Label>
                                  <Input className="h-7 text-[11px]" />
                                </div>
                              </div>
                            </div>

                            {/* Average Value */}
                            <div className="bg-white p-3 rounded border border-gray-200">
                              <h3 className="text-xs font-semibold text-gray-900 mb-2 pb-1 border-b-2 border-blue-600">Average Value</h3>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1.5">
                                  <Checkbox id="by-month" defaultChecked className="h-3 w-3" />
                                  <Label htmlFor="by-month" className="text-[10px] text-gray-700 cursor-pointer">By Month</Label>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Month</Label>
                                  <Select defaultValue="december">
                                    <SelectTrigger className="h-7 text-[11px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="january">January</SelectItem>
                                      <SelectItem value="february">February</SelectItem>
                                      <SelectItem value="march">March</SelectItem>
                                      <SelectItem value="april">April</SelectItem>
                                      <SelectItem value="may">May</SelectItem>
                                      <SelectItem value="june">June</SelectItem>
                                      <SelectItem value="july">July</SelectItem>
                                      <SelectItem value="august">August</SelectItem>
                                      <SelectItem value="september">September</SelectItem>
                                      <SelectItem value="october">October</SelectItem>
                                      <SelectItem value="november">November</SelectItem>
                                      <SelectItem value="december">December</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Year</Label>
                                  <Select defaultValue="2025">
                                    <SelectTrigger className="h-7 text-[11px]">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="2025">2025</SelectItem>
                                      <SelectItem value="2024">2024</SelectItem>
                                      <SelectItem value="2023">2023</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">Start Date</Label>
                                  <div className="flex items-center gap-1.5">
                                    <Input className="h-7 text-[11px]" />
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-[10px] text-gray-500 mb-0.5 block">End Date</Label>
                                  <div className="flex items-center gap-1.5">
                                    <Input className="h-7 text-[11px]" />
                                    <Calendar className="h-3 w-3 text-gray-500" />
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 pt-4">
                                  <Checkbox id="ffs-only" className="h-3 w-3" />
                                  <Label htmlFor="ffs-only" className="text-[10px] text-gray-700 cursor-pointer">Fee For Service Only</Label>
                                </div>
                                <div className="pt-4">
                                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-[10px] h-6">
                                    Calculate
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="notes" className="mt-4">
                        <div className="space-y-4">
                          {/* Plan Notes Section */}
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4">Plan Notes</h3>
                            <div className="space-y-4">
                              {/* New Plan Note Button */}
                              <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                                New Plan Note
                              </Button>
                              
                              {/* Notes Display Area */}
                              <div className="bg-blue-50 border border-blue-200 rounded p-6 min-h-[400px]">
                                {/* Empty state - notes would be displayed here */}
                              </div>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="plan-attachments" className="mt-4">
                        <div className="space-y-6">
                          {/* Pinned Documents */}
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">Pinned Documents</h3>
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Document Type</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">On File</TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">On File Date</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="text-xs py-2 px-3">Auto Conversion of Units</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow className="bg-gray-50">
                                  <TableCell className="text-xs py-2 px-3">Auto Conversion of Units (Express Service / Self Serve)</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs py-2 px-3">Disclosure Document - Loan</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow className="bg-gray-50">
                                  <TableCell className="text-xs py-2 px-3">Fee for Service Agreement</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs py-2 px-3">Joint LAF</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow className="bg-gray-50">
                                  <TableCell className="text-xs py-2 px-3">LAF</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs py-2 px-3">Other for Processing (Express Service / Self Serve)</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow className="bg-gray-50">
                                  <TableCell className="text-xs py-2 px-3">PAC/SWP form (Express Service / Self Serve)</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs py-2 px-3">Power of Attorney</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow className="bg-gray-50">
                                  <TableCell className="text-xs py-2 px-3">Trading Authorization</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow>
                                  <TableCell className="text-xs py-2 px-3">Transfer Documents</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                                <TableRow className="bg-gray-50">
                                  <TableCell className="text-xs py-2 px-3">Void Cheque</TableCell>
                                  <TableCell className="text-xs py-2 px-3">No</TableCell>
                                  <TableCell className="text-xs py-2 px-3"></TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>

                          {/* Plan Attachments */}
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">Plan Attachments</h3>
                            <div className="space-y-4">
                              {/* Action Buttons */}
                              <div className="flex items-center gap-3">
                                <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                                  Add New Attachment
                                </Button>
                                <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-xs h-8">
                                  Link Existing Attachment
                                </Button>
                                <Button variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-xs h-8">
                                  Unlink Attachment
                                </Button>
                              </div>
                              {/* Checkboxes */}
                              <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                  <Checkbox id="include-inactive-attachments" />
                                  <Label htmlFor="include-inactive-attachments" className="text-xs text-gray-700 cursor-pointer">Include Inactive</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Checkbox id="include-funds-attachments" />
                                  <Label htmlFor="include-funds-attachments" className="text-xs text-gray-700 cursor-pointer">Include attachments from Funds, GICs, Transactions, and Trust Transactions</Label>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Attachments */}
                          <div className="bg-white p-4 rounded border border-gray-200">
                            <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">Attachments</h3>
                            <div className="py-8">
                              <p className="text-xs text-gray-500 text-center">No attachments found.</p>
                            </div>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="allocations" className="mt-4">
                        <div className="space-y-4">
                          {/* Allocations Sub-tabs */}
                          <Tabs value={allocationsView} onValueChange={(value) => setAllocationsView(value as "chart" | "table")}>
                            <TabsList className="grid w-full grid-cols-2 h-8 mb-4">
                              <TabsTrigger value="chart" className="text-xs">Allocations (Chart)</TabsTrigger>
                              <TabsTrigger value="table" className="text-xs">Allocations (Table)</TabsTrigger>
                            </TabsList>

                            <TabsContent value="chart" className="mt-4">
                              <div className="grid grid-cols-3 gap-4">
                                {/* Geographic Allocation */}
                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Geographic Allocation</h4>
                                  <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                      <Pie
                                        data={[
                                          { name: "Canada", value: 48.01 },
                                          { name: "Multi-National", value: 12.57 },
                                          { name: "European Union", value: 6.18 },
                                          { name: "United States", value: 20.16 },
                                          { name: "Asia/Pacific Rim", value: 4.02 },
                                          { name: "Japan", value: 4.42 },
                                          { name: "Latin America", value: 1.58 },
                                          { name: "All Others", value: 3.06 },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        <Cell fill="#22c55e" />
                                        <Cell fill="#eab308" />
                                        <Cell fill="#3b82f6" />
                                        <Cell fill="#ef4444" />
                                        <Cell fill="#f97316" />
                                        <Cell fill="#dc2626" />
                                        <Cell fill="#1e40af" />
                                        <Cell fill="#9333ea" />
                                      </Pie>
                                      <RechartsTooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                                      <Legend />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>

                                {/* Asset Allocation */}
                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Asset Allocation</h4>
                                  <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                      <Pie
                                        data={[
                                          { name: "International Equity", value: 25.10 },
                                          { name: "Cash and Equivalents", value: 6.92 },
                                          { name: "Foreign Bonds", value: 8.03 },
                                          { name: "Canadian Equity", value: 17.96 },
                                          { name: "Domestic Bonds", value: 23.33 },
                                          { name: "US Equity", value: 12.86 },
                                          { name: "Mutual Fund", value: 9.54 },
                                          { name: "Other", value: 5.18 },
                                          { name: "All Others", value: 0.62 },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        <Cell fill="#9333ea" />
                                        <Cell fill="#6b7280" />
                                        <Cell fill="#ec4899" />
                                        <Cell fill="#eab308" />
                                        <Cell fill="#22c55e" />
                                        <Cell fill="#3b82f6" />
                                        <Cell fill="#84cc16" />
                                        <Cell fill="#ef4444" />
                                        <Cell fill="#f87171" />
                                      </Pie>
                                      <RechartsTooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                                      <Legend />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>

                                {/* Sector Allocation */}
                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Sector Allocation</h4>
                                  <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                      <Pie
                                        data={[
                                          { name: "Fixed Income", value: 31.26 },
                                          { name: "All Others", value: 23.47 },
                                          { name: "Financial Services", value: 11.87 },
                                          { name: "Technology", value: 7.86 },
                                          { name: "Mutual Fund", value: 9.54 },
                                          { name: "Energy", value: 4.62 },
                                          { name: "Cash and Cash Equivalent", value: 6.94 },
                                          { name: "Consumer Services", value: 4.44 },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={100}
                                        fill="#8884d8"
                                        dataKey="value"
                                      >
                                        <Cell fill="#ec4899" />
                                        <Cell fill="#eab308" />
                                        <Cell fill="#3b82f6" />
                                        <Cell fill="#6b7280" />
                                        <Cell fill="#ef4444" />
                                        <Cell fill="#22c55e" />
                                        <Cell fill="#84cc16" />
                                        <Cell fill="#f97316" />
                                      </Pie>
                                      <RechartsTooltip formatter={(value: number) => `${value.toFixed(2)}%`} />
                                      <Legend />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            </TabsContent>

                            <TabsContent value="table" className="mt-4">
                              <div className="grid grid-cols-3 gap-4">
                                {/* Geographic Allocation Table */}
                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Geographic Allocation</h4>
                                  <Table>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">Canada</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">48.01%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">Multi-National</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">12.57%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">European Union</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">6.18%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">United States</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">20.16%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">Japan</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">4.42%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">Asia/Pacific Rim</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">4.02%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">Latin America</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">1.58%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">All Others</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">3.06%</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>

                                {/* Asset Allocation Table */}
                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Asset Allocation</h4>
                                  <Table>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">Foreign Bonds</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">8.03%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">International Equity</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">25.10%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">Domestic Bonds</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">23.33%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">US Equity</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">12.86%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">Cash and Equivalents</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">6.92%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">Canadian Equity</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">17.96%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">All Others</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">0.62%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">Other</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">5.18%</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>

                                {/* Sector Allocation Table */}
                                <div className="bg-white p-4 rounded border border-gray-200">
                                  <h4 className="text-sm font-semibold text-gray-900 mb-4 text-center">Sector Allocation</h4>
                                  <Table>
                                    <TableBody>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">Financial Services</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">11.87%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">Mutual Fund</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">9.54%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">Energy</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">4.62%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">Technology</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">7.86%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">Consumer Services</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">4.44%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">Cash and Cash Equivalent</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">6.94%</TableCell>
                                      </TableRow>
                                      <TableRow>
                                        <TableCell className="text-xs py-2 px-3">Fixed Income</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">31.26%</TableCell>
                                      </TableRow>
                                      <TableRow className="bg-gray-50">
                                        <TableCell className="text-xs py-2 px-3">All Others</TableCell>
                                        <TableCell className="text-xs py-2 px-3 text-right font-medium">23.47%</TableCell>
                                      </TableRow>
                                    </TableBody>
                                  </Table>
                                </div>
                              </div>
                            </TabsContent>
                          </Tabs>
                        </div>
                      </TabsContent>

                      <TabsContent value="supplier-accounts" className="mt-4">
                        <div className="space-y-4">
                          {/* Include Inactive Checkbox */}
                          <div className="flex items-center gap-2">
                            <Checkbox id="include-inactive-supplier-accounts" />
                            <Label htmlFor="include-inactive-supplier-accounts" className="text-xs text-gray-700 cursor-pointer">Include Inactive</Label>
                          </div>

                          {/* Supplier Accounts Table */}
                          <div className="bg-white rounded border border-gray-200">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                                    <div className="flex items-center gap-1">
                                      Supplier
                                      <ChevronUp className="h-3 w-3 text-gray-500" />
                                    </div>
                                  </TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                                    <div className="flex items-center gap-1">
                                      Account Number
                                      <ChevronUp className="h-3 w-3 text-gray-500" />
                                    </div>
                                  </TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                                    <div className="flex items-center gap-1">
                                      Start Date
                                      <ChevronUp className="h-3 w-3 text-gray-500" />
                                    </div>
                                  </TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                                    <div className="flex items-center gap-1">
                                      End Date
                                      <ChevronUp className="h-3 w-3 text-gray-500" />
                                    </div>
                                  </TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                                    <div className="flex items-center gap-1">
                                      Market Value
                                      <ChevronUp className="h-3 w-3 text-gray-500" />
                                    </div>
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell className="text-xs py-2 px-3">CIG</TableCell>
                                  <TableCell className="text-xs py-2 px-3">59108738</TableCell>
                                  <TableCell className="text-xs py-2 px-3">07/08/2005</TableCell>
                                  <TableCell className="text-xs py-2 px-3">-</TableCell>
                                  <TableCell className="text-xs py-2 px-3">$0.00</TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TabsContent>

                      <TabsContent value="custom-compensation" className="mt-4">
                        <div className="space-y-4">
                          {/* Custom Compensation Table */}
                          <div className="bg-white rounded border border-gray-200">
                            <Table>
                              <TableHeader>
                                <TableRow className="bg-gray-50">
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                                    <div className="flex items-center gap-1">
                                      Date
                                      <ChevronUp className="h-3 w-3 text-gray-500" />
                                    </div>
                                  </TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                                    <div className="flex items-center gap-1">
                                      Type
                                      <ChevronUp className="h-3 w-3 text-gray-500" />
                                    </div>
                                  </TableHead>
                                  <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                                    <div className="flex items-center gap-1">
                                      Amount
                                      <ChevronUp className="h-3 w-3 text-gray-500" />
                                    </div>
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                <TableRow>
                                  <TableCell colSpan={3} className="text-center py-8">
                                    <div className="flex flex-col items-center gap-3">
                                      <p className="text-xs text-gray-500">No custom compensation records found</p>
                                      <Button variant="outline" size="sm" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-xs h-8">
                                        <RefreshCw className="h-3 w-3 mr-2" />
                                        Refresh
                                      </Button>
                                    </div>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </div>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </TabsContent>

                  <TabsContent value="kyc" className="mt-4">
                    <div className="space-y-6">
                      {/* KYC Information Section */}
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">KYC Information</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">KYC On File Date</Label>
                              <Input className="h-8 text-sm" defaultValue="03/13/2007" readOnly />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">KYC Age</Label>
                              <Input className="h-8 text-sm text-red-600" defaultValue="6852 days old" readOnly />
                            </div>
                          </div>

                          {/* Risk and Investment Objective Tables */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Risk Table */}
                            <div>
                              <Label className="text-xs font-semibold text-gray-700 mb-2 block">Risk</Label>
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="text-xs py-1 px-3">Low</TableCell>
                                    <TableCell className="text-xs py-1 px-3 text-right">0 %</TableCell>
                                  </TableRow>
                                  <TableRow className="bg-gray-50">
                                    <TableCell className="text-xs py-1 px-3">Low Medium</TableCell>
                                    <TableCell className="text-xs py-1 px-3 text-right">0 %</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="text-xs py-1 px-3">Medium</TableCell>
                                    <TableCell className="text-xs py-1 px-3 text-right font-medium">100 %</TableCell>
                                  </TableRow>
                                  <TableRow className="bg-gray-50">
                                    <TableCell className="text-xs py-1 px-3">Medium High</TableCell>
                                    <TableCell className="text-xs py-1 px-3 text-right">0 %</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="text-xs py-1 px-3">High</TableCell>
                                    <TableCell className="text-xs py-1 px-3 text-right">0 %</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>

                            {/* Investment Objective Table */}
                            <div>
                              <Label className="text-xs font-semibold text-gray-700 mb-2 block">Investment Objective</Label>
                              <Table>
                                <TableBody>
                                  <TableRow>
                                    <TableCell className="text-xs py-1 px-3">Safety</TableCell>
                                    <TableCell className="text-xs py-1 px-3 text-right">0 %</TableCell>
                                  </TableRow>
                                  <TableRow className="bg-gray-50">
                                    <TableCell className="text-xs py-1 px-3">Income</TableCell>
                                    <TableCell className="text-xs py-1 px-3 text-right">0 %</TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell className="text-xs py-1 px-3">Growth</TableCell>
                                    <TableCell className="text-xs py-1 px-3 text-right font-medium">100 %</TableCell>
                                  </TableRow>
                                  <TableRow className="bg-gray-50">
                                    <TableCell className="text-xs py-1 px-3">Speculation</TableCell>
                                    <TableCell className="text-xs py-1 px-3 text-right">0 %</TableCell>
                                  </TableRow>
                                </TableBody>
                              </Table>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">Time Horizon</Label>
                              <Input className="h-8 text-sm" defaultValue="20+ years" readOnly />
                            </div>
                            <div>
                              <Label className="text-xs text-gray-500 mb-1 block">Objective Type Override</Label>
                              <Input className="h-8 text-sm" defaultValue="Not Set" readOnly />
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Checkbox id="kyc-exempt-products" />
                            <Label htmlFor="kyc-exempt-products" className="text-xs text-gray-700 cursor-pointer">Plan KYC applies to exempt products</Label>
                          </div>
                        </div>
                      </div>

                      {/* History Section */}
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">History</h3>
                        <div className="space-y-4">
                          <Table>
                            <TableHeader>
                              <TableRow className="bg-gray-50">
                                <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Date Created</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Status</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Date Submitted</TableHead>
                                <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="text-xs py-2 px-3">10/16/2025</TableCell>
                                <TableCell className="text-xs py-2 px-3">Draft</TableCell>
                                <TableCell className="text-xs py-2 px-3"></TableCell>
                                <TableCell className="text-xs py-2 px-3">
                                  <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white text-xs h-7">
                                    Edit Draft KYC Update
                                  </Button>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          <div className="flex justify-end">
                            <Button variant="ghost" size="sm" className="text-xs h-7">
                              <RefreshCw className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* KYC Graphs Section */}
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">KYC Graphs</h3>
                        <div className="grid grid-cols-3 gap-4">
                          {/* Risk Bar Chart */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-900 mb-1 text-center">Risk</h4>
                            <p className="text-[10px] text-gray-500 mb-2 text-center">Cash Account: $0.00</p>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={[
                                { category: "L", actual: 0, kyc: 0 },
                                { category: "LM", actual: 0, kyc: 100 },
                                { category: "M", actual: 100, kyc: 100 },
                                { category: "MH", actual: 0, kyc: 0 },
                                { category: "H", actual: 0, kyc: 0 },
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" tick={{ fontSize: 10 }} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} label={{ value: "Percent", angle: -90, position: "insideLeft", fontSize: 10 }} />
                                <RechartsTooltip />
                                <Bar dataKey="actual" fill="#22c55e" />
                                <Bar dataKey="kyc" fill="#3b82f6" />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-green-500"></div>
                                <span className="text-[10px] text-gray-700">Actual Risk Distribution</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-blue-500"></div>
                                <span className="text-[10px] text-gray-700">KYC Risk Tolerance</span>
                              </div>
                            </div>
                          </div>

                          {/* Current Risk Score Bar Chart */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-900 mb-2 text-center">Current Risk Score: 121.00</h4>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart 
                                data={[{ name: "", actual: 121, kyc: 256 }]} 
                                layout="vertical"
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                              >
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis type="number" domain={[0, 256]} tick={{ fontSize: 10 }} />
                                <YAxis type="category" dataKey="name" hide />
                                <RechartsTooltip />
                                <Bar dataKey="actual" fill="#22c55e" />
                                <Bar dataKey="kyc" fill="#3b82f6" />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-green-500"></div>
                                <span className="text-[10px] text-gray-700">Actual Risk Score</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-blue-500"></div>
                                <span className="text-[10px] text-gray-700">KYC Risk Score Tolerance</span>
                              </div>
                            </div>
                          </div>

                          {/* Investment Objectives Bar Chart */}
                          <div>
                            <h4 className="text-xs font-semibold text-gray-900 mb-2 text-center">Investment Objectives</h4>
                            <ResponsiveContainer width="100%" height={200}>
                              <BarChart data={[
                                { category: "Safety", actual: 0, kyc: 0 },
                                { category: "Income", actual: 50, kyc: 0 },
                                { category: "Growth", actual: 50, kyc: 100 },
                                { category: "Speculation", actual: 0, kyc: 0 },
                              ]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="category" tick={{ fontSize: 9 }} angle={-45} textAnchor="end" height={60} />
                                <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} label={{ value: "Percent", angle: -90, position: "insideLeft", fontSize: 10 }} />
                                <RechartsTooltip />
                                <Bar dataKey="actual" fill="#22c55e" />
                                <Bar dataKey="kyc" fill="#3b82f6" />
                              </BarChart>
                            </ResponsiveContainer>
                            <div className="flex justify-center gap-4 mt-2">
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-green-500"></div>
                                <span className="text-[10px] text-gray-700">Actual Objective Distribution</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <div className="w-3 h-3 bg-blue-500"></div>
                                <span className="text-[10px] text-gray-700">KYC Objective Tolerance</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="beneficiaries" className="mt-4">
                    <div className="space-y-4">
                      {/* Beneficiary Information Section */}
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h3 className="text-sm font-semibold text-blue-600 mb-4 pb-2 border-b-2 border-blue-600">Beneficiary Information</h3>
                        
                        {/* Red Warning Message */}
                        <div className="mb-4">
                          <p className="text-xs text-red-600 font-medium">CDIC Unique identifier must be assigned to the Beneficiaries by April 2022</p>
                        </div>

                        {/* Beneficiaries Sub-section */}
                        <div className="space-y-3">
                          <h4 className="text-sm font-semibold text-gray-900">Beneficiaries</h4>
                          
                          {/* Beneficiary Entry */}
                          <div className="flex items-center justify-between p-3 bg-gray-50 rounded border border-gray-200">
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                              <div className="flex items-center gap-4">
                                <span className="text-xs font-medium text-gray-900">Lynch, Martha</span>
                                <span className="text-xs text-gray-700">Child</span>
                                <span className="text-xs text-gray-700">100.0 %</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-xs h-7">
                                Select
                              </Button>
                              <Button size="sm" variant="outline" className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 text-xs h-7">
                                Assign CDIC Unique Identifier
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="actions" className="mt-4">
                    <div className="space-y-6">
                      {/* Forms Section */}
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">Forms</h3>
                        <div>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 w-full sm:w-auto">
                            Fast Forms
                          </Button>
                        </div>
                      </div>

                      {/* Compliance Section */}
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">Compliance</h3>
                        <div className="space-y-3">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 w-full sm:w-auto">
                            Portfolio Modeling
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 w-full sm:w-auto">
                            Plan Supervision
                          </Button>
                        </div>
                      </div>

                      {/* Other Section */}
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-300">Other</h3>
                        <div>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8 w-full sm:w-auto">
                            Start KYP Review
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="trust-account" className="mt-4">
                    <div className="space-y-4">
                      {/* Action Buttons */}
                      <div className="flex items-center gap-2">
                        <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                          New Deposit
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                          New Transfer
                        </Button>
                      </div>

                      {/* Search Filter Section */}
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h3 className="text-sm font-semibold text-blue-600 mb-4 pb-2 border-b-2 border-blue-600">Search Filter</h3>
                        <div className="flex items-end gap-3">
                          <div className="flex-1">
                            <Label className="text-xs text-gray-700 mb-1 block">Trust Account</Label>
                            <Select defaultValue="bm-tr">
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="bm-tr">BM TR</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                            Show
                          </Button>
                        </div>
                      </div>

                      {/* Results Section */}
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h3 className="text-sm font-semibold text-blue-600 mb-4 pb-2 border-b-2 border-blue-600">Results</h3>
                        <div className="py-8">
                          <p className="text-xs text-gray-500 italic text-center">No trust transactions found.</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reviews" className="mt-4">
                    <div className="space-y-4">
                      {/* Add New Response Button */}
                      <div>
                        <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                          Add New Response
                        </Button>
                      </div>

                      {/* Reviews Section */}
                      <div className="bg-white p-4 rounded border border-gray-200">
                        <h3 className="text-sm font-semibold text-gray-900 mb-4 pb-2 border-b-2 border-blue-600">Reviews</h3>
                        <div className="py-8">
                          <p className="text-xs text-gray-500 text-center">No reviews found</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
                )}
              </div>
            </div>
          </div>
          </div>
        )}

        {clientViewTab === "notes" && (
          <div className="space-y-6">
            {/* Notes Summary Section */}
            <div>
              <h2 className="text-base font-semibold text-blue-600 border-b border-blue-600 pb-2 mb-4">
                Notes Summary
              </h2>
              
              {/* Action Buttons Row */}
              <div className="flex items-center gap-4 mb-4 flex-wrap">
                <Button 
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => setIsAddClientNoteDialogOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Client Note
                </Button>
                
                <div className="flex items-center gap-2 flex-1 min-w-[300px]">
                  <div className="relative flex-1 min-h-[40px] border border-gray-300 rounded-md bg-white px-2 py-1.5 flex flex-wrap items-center gap-1.5">
                    {selectedNoteOptions.size > 0 ? (
                      Array.from(selectedNoteOptions).map((option) => (
                        <Badge
                          key={option}
                          variant="secondary"
                          className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-xs px-2 py-0.5 flex items-center gap-1"
                        >
                          <span>{option}</span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleNoteOption(option);
                            }}
                            className="ml-1 hover:bg-blue-300 rounded-full p-0.5 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))
                    ) : (
                      <span className="text-sm text-gray-400">View Additional Notes</span>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 text-blue-600 hover:text-blue-700 ml-auto"
                      onClick={() => setShowAdditionalNotesOptions(!showAdditionalNotesOptions)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    onClick={selectAllOptions}
                  >
                    All
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100"
                    onClick={deselectAllOptions}
                  >
                    None
                  </Button>
                </div>
              </div>
              
              {/* Additional Notes Options Panel */}
              {showAdditionalNotesOptions && (
                <Card className="border border-gray-200 shadow-sm mb-4 bg-gray-50">
                  <CardContent className="p-4">
                    <div className="grid grid-cols-3 gap-4">
                      {/* Column 1 */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="client-notes"
                            checked={selectedNoteOptions.has("Client Notes")}
                            onCheckedChange={() => toggleNoteOption("Client Notes")}
                          />
                          <Label htmlFor="client-notes" className="text-sm text-gray-900 cursor-pointer">
                            Client Notes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="fund-account-notes"
                            checked={selectedNoteOptions.has("Fund Account Notes")}
                            onCheckedChange={() => toggleNoteOption("Fund Account Notes")}
                          />
                          <Label htmlFor="fund-account-notes" className="text-sm text-gray-900 cursor-pointer">
                            Fund Account Notes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="plan-reviews"
                            checked={selectedNoteOptions.has("Plan Reviews")}
                            onCheckedChange={() => toggleNoteOption("Plan Reviews")}
                          />
                          <Label htmlFor="plan-reviews" className="text-sm text-gray-900 cursor-pointer">
                            Plan Reviews
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="gic-transaction-notes"
                            checked={selectedNoteOptions.has("GIC Transaction Notes")}
                            onCheckedChange={() => toggleNoteOption("GIC Transaction Notes")}
                          />
                          <Label htmlFor="gic-transaction-notes" className="text-sm text-gray-900 cursor-pointer">
                            GIC Transaction Notes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="etf-transaction-reviews"
                            checked={selectedNoteOptions.has("ETF Transaction Reviews")}
                            onCheckedChange={() => toggleNoteOption("ETF Transaction Reviews")}
                          />
                          <Label htmlFor="etf-transaction-reviews" className="text-sm text-gray-900 cursor-pointer">
                            ETF Transaction Reviews
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-account-opening-notes"
                            checked={selectedNoteOptions.has("Include Account Opening Notes")}
                            onCheckedChange={() => toggleNoteOption("Include Account Opening Notes")}
                          />
                          <Label htmlFor="include-account-opening-notes" className="text-sm text-gray-900 cursor-pointer">
                            Include Account Opening Notes
                          </Label>
                        </div>
                      </div>

                      {/* Column 2 */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="emails-sent-to-client"
                            checked={selectedNoteOptions.has("Emails Sent to Client")}
                            onCheckedChange={() => toggleNoteOption("Emails Sent to Client")}
                          />
                          <Label htmlFor="emails-sent-to-client" className="text-sm text-gray-900 cursor-pointer">
                            Emails Sent to Client
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="gic-notes"
                            checked={selectedNoteOptions.has("GIC Notes")}
                            onCheckedChange={() => toggleNoteOption("GIC Notes")}
                          />
                          <Label htmlFor="gic-notes" className="text-sm text-gray-900 cursor-pointer">
                            GIC Notes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="fund-transaction-notes"
                            checked={selectedNoteOptions.has("Fund Transaction Notes")}
                            onCheckedChange={() => toggleNoteOption("Fund Transaction Notes")}
                          />
                          <Label htmlFor="fund-transaction-notes" className="text-sm text-gray-900 cursor-pointer">
                            Fund Transaction Notes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="gic-transaction-reviews"
                            checked={selectedNoteOptions.has("GIC Transaction Reviews")}
                            onCheckedChange={() => toggleNoteOption("GIC Transaction Reviews")}
                          />
                          <Label htmlFor="gic-transaction-reviews" className="text-sm text-gray-900 cursor-pointer">
                            GIC Transaction Reviews
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-inactive-plans-accounts"
                            checked={selectedNoteOptions.has("Include Inactive Plans and Accounts")}
                            onCheckedChange={() => toggleNoteOption("Include Inactive Plans and Accounts")}
                          />
                          <Label htmlFor="include-inactive-plans-accounts" className="text-sm text-gray-900 cursor-pointer">
                            Include Inactive Plans and Accounts
                          </Label>
                        </div>
                      </div>

                      {/* Column 3 */}
                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="plan-notes"
                            checked={selectedNoteOptions.has("Plan Notes")}
                            onCheckedChange={() => toggleNoteOption("Plan Notes")}
                          />
                          <Label htmlFor="plan-notes" className="text-sm text-gray-900 cursor-pointer">
                            Plan Notes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="etf-account-notes"
                            checked={selectedNoteOptions.has("ETF Account Notes")}
                            onCheckedChange={() => toggleNoteOption("ETF Account Notes")}
                          />
                          <Label htmlFor="etf-account-notes" className="text-sm text-gray-900 cursor-pointer">
                            ETF Account Notes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="fund-transaction-reviews"
                            checked={selectedNoteOptions.has("Fund Transaction Reviews")}
                            onCheckedChange={() => toggleNoteOption("Fund Transaction Reviews")}
                          />
                          <Label htmlFor="fund-transaction-reviews" className="text-sm text-gray-900 cursor-pointer">
                            Fund Transaction Reviews
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="etf-transaction-notes"
                            checked={selectedNoteOptions.has("ETF Transaction Notes")}
                            onCheckedChange={() => toggleNoteOption("ETF Transaction Notes")}
                          />
                          <Label htmlFor="etf-transaction-notes" className="text-sm text-gray-900 cursor-pointer">
                            ETF Transaction Notes
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="include-kyc-update-notes"
                            checked={selectedNoteOptions.has("Include KYC Update Notes")}
                            onCheckedChange={() => toggleNoteOption("Include KYC Update Notes")}
                          />
                          <Label htmlFor="include-kyc-update-notes" className="text-sm text-gray-900 cursor-pointer">
                            Include KYC Update Notes
                          </Label>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              
              {/* Search and Filter Controls */}
              <div className="mb-6 flex items-center gap-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search notes..."
                    value={notesSearchTerm}
                    onChange={(e) => setNotesSearchTerm(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={notesFilterType} onValueChange={setNotesFilterType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Note Types</SelectItem>
                    <SelectItem value="Client">Client Notes</SelectItem>
                    <SelectItem value="Plan">Plan Notes</SelectItem>
                    <SelectItem value="Investment Product">Investment Product</SelectItem>
                    <SelectItem value="Transaction">Transaction Notes</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100">
                  <FileText className="h-4 w-4 mr-2" />
                  Print Notes
                </Button>
              </div>

              {/* Notes Table */}
              <Card className="border border-gray-200 shadow-sm">
                <CardContent className="p-0">
                  {filteredAndSortedNotes.length > 0 ? (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[140px]">
                              <button
                                onClick={() => setNotesDateSortOrder(notesDateSortOrder === "desc" ? "asc" : "desc")}
                                className="flex items-center gap-1 hover:text-blue-600 transition-colors cursor-pointer"
                              >
                                Date & Time
                                {notesDateSortOrder === "desc" ? (
                                  <ChevronDown className="h-4 w-4" />
                                ) : (
                                  <ChevronUp className="h-4 w-4" />
                                )}
                              </button>
                            </TableHead>
                            <TableHead className="w-[80px]">Type</TableHead>
                            <TableHead>Summary</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead className="w-[150px]">Origin</TableHead>
                            <TableHead className="w-[120px]">Created By</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {filteredAndSortedNotes.map((note) => (
                            <TableRow key={note.id} className="hover:bg-gray-50">
                              <TableCell className="text-sm">
                                <div className="space-y-0.5">
                                  <div className="font-medium text-gray-900">
                                    {new Date(note.date).toLocaleDateString("en-CA", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {new Date(note.date).toLocaleTimeString("en-CA", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    }).toLowerCase()}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <button
                                      onClick={() => navigateToOrigin(note)}
                                      className="flex items-center justify-center p-1.5 bg-blue-100 rounded text-blue-700 hover:bg-blue-200 transition-colors cursor-pointer"
                                    >
                                      {getNoteTypeIcon(note.type)}
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>{note.type}</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TableCell>
                              <TableCell className="font-semibold text-sm text-gray-900">
                                {note.summary}
                              </TableCell>
                              <TableCell className="text-sm text-gray-700">
                                {note.description}
                              </TableCell>
                              <TableCell className="text-sm font-medium text-gray-900">
                                {note.originName}
                              </TableCell>
                              <TableCell className="text-sm text-gray-600">
                                {note.createdBy || "N/A"}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <div className="p-6 text-center">
                      <p className="text-sm text-gray-500">
                        {notesSearchTerm || notesFilterType !== "all"
                          ? "No notes match your search criteria."
                          : "No notes available. Click 'Add Client Note' to create one."}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Add Client Note Dialog */}
        <Dialog open={isAddClientNoteDialogOpen} onOpenChange={setIsAddClientNoteDialogOpen}>
          <DialogContent className="bg-gray-50 max-w-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-semibold text-gray-900">Add Client Note</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Note Type */}
              <div className="flex items-start gap-4">
                <Label htmlFor="note-type" className="text-sm font-medium text-gray-900 mt-2 min-w-[120px]">
                  Type
                </Label>
                <Select value={noteType} onValueChange={(value) => {
                  setNoteType(value as NoteType);
                  setNoteOrigin(""); // Reset origin when type changes
                }}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select note type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Client">Client</SelectItem>
                    <SelectItem value="Plan">Plan</SelectItem>
                    <SelectItem value="Investment Product">Investment Product</SelectItem>
                    <SelectItem value="Transaction">Transaction</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Note Origin */}
              <div className="flex items-start gap-4">
                <Label htmlFor="note-origin" className="text-sm font-medium text-gray-900 mt-2 min-w-[120px]">
                  Origin
                </Label>
                <Select value={noteOrigin} onValueChange={setNoteOrigin}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder={`Select ${noteType === "Client" ? "client profile" : noteType === "Plan" ? "plan" : noteType === "Investment Product" ? "investment product" : "transaction"}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {noteType === "Client" && (
                      <SelectItem value="Client Profile">Client Profile</SelectItem>
                    )}
                    {noteType === "Plan" && plansList.map((plan) => (
                      <SelectItem key={plan.id} value={plan.id}>
                        {plan.accountNumber || plan.id} - {plan.type}
                      </SelectItem>
                    ))}
                    {noteType === "Investment Product" && fundAccounts.map((fund) => (
                      <SelectItem key={fund.id} value={fund.id}>
                        {fund.productName || fund.fullName || fund.id}
                      </SelectItem>
                    ))}
                    {noteType === "Transaction" && (
                      <>
                        <SelectItem value="trans-001">Deposit - $5,000</SelectItem>
                        <SelectItem value="trans-002">Withdrawal - $2,000</SelectItem>
                        <SelectItem value="trans-003">Purchase - $1,500</SelectItem>
                        <SelectItem value="trans-004">Sale - $3,000</SelectItem>
                      </>
                    )}
                  </SelectContent>
                </Select>
              </div>

              {/* Note Summary */}
              <div className="flex items-start gap-4">
                <Label htmlFor="note-summary" className="text-sm font-medium text-gray-900 mt-2 min-w-[120px]">
                  Summary
                </Label>
                <Input
                  id="note-summary"
                  value={noteSummary}
                  onChange={(e) => setNoteSummary(e.target.value)}
                  placeholder="Enter note summary"
                  className="flex-1"
                />
              </div>

              {/* Note Description */}
              <div className="flex items-start gap-4">
                <Label htmlFor="note-description" className="text-sm font-medium text-gray-900 mt-2 min-w-[120px]">
                  Description
                </Label>
                <div className="flex-1 relative">
                  <Textarea
                    id="note-description"
                    value={noteDescription}
                    onChange={(e) => setNoteDescription(e.target.value)}
                    placeholder="Enter note description"
                    className="min-h-[150px] pr-12"
                  />
                  <div className="absolute top-3 right-3 flex flex-col items-center gap-0.5 cursor-pointer hover:opacity-70 transition-opacity">
                    <Mic className="h-4 w-4 text-gray-600" />
                    <span className="text-[7px] font-medium text-gray-500 leading-tight tracking-tight">BETA</span>
                  </div>
                </div>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <div className="flex gap-3">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  onClick={() => {
                    if (!noteSummary.trim() || !noteDescription.trim() || !noteOrigin) {
                      // Basic validation - you could add toast notification here
                      return;
                    }

                    // Get origin name based on selected origin
                    let originName = "";
                    if (noteType === "Client") {
                      originName = "Client Profile";
                    } else if (noteType === "Plan") {
                      const plan = plansList.find(p => p.id === noteOrigin);
                      originName = plan ? `${plan.accountNumber || plan.id} - ${plan.type}` : noteOrigin;
                    } else if (noteType === "Investment Product") {
                      const fund = fundAccounts.find(f => f.id === noteOrigin);
                      originName = fund ? (fund.productName || fund.fullName || fund.id) : noteOrigin;
                    } else if (noteType === "Transaction") {
                      const transactionNames: Record<string, string> = {
                        "trans-001": "Deposit - $5,000",
                        "trans-002": "Withdrawal - $2,000",
                        "trans-003": "Purchase - $1,500",
                        "trans-004": "Sale - $3,000",
                      };
                      originName = transactionNames[noteOrigin] || noteOrigin;
                    }

                    // Create new note
                    const newNote: Note = {
                      id: `note-${Date.now()}-${id}`,
                      type: noteType,
                      summary: noteSummary,
                      description: noteDescription,
                      date: new Date().toISOString(),
                      originId: noteOrigin,
                      originName: originName,
                      createdBy: "Marsh, Antoine",
                    };

                    // Add note to the list
                    setAllNotes((prevNotes) => [newNote, ...prevNotes]);

                    // Reset form and close dialog
                    setIsAddClientNoteDialogOpen(false);
                    setNoteType("Client");
                    setNoteSummary("");
                    setNoteDescription("");
                    setNoteOrigin("");
                  }}
                >
                  Save
                </Button>
                <Button
                  variant="outline"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                  onClick={() => {
                    // Handle cancel - just close the dialog
                    setIsAddClientNoteDialogOpen(false);
                    setNoteType("Client");
                    setNoteSummary("");
                    setNoteDescription("");
                    setNoteOrigin("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Note Detail Dialog */}
        <Dialog open={isNoteDetailDialogOpen} onOpenChange={setIsNoteDetailDialogOpen}>
          <DialogContent className="bg-gray-50 max-w-2xl">
            <DialogHeader className="mb-4">
              <DialogTitle className="text-lg font-semibold text-gray-900">Note Details</DialogTitle>
            </DialogHeader>

            {selectedNoteForView && (
              <div className="space-y-6">
                {/* Note Type and Date */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded text-blue-700">
                      {getNoteTypeIcon(selectedNoteForView.type)}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900">{selectedNoteForView.type}</div>
                      <div className="text-xs text-gray-500 mt-0.5">
                        {new Date(selectedNoteForView.date).toLocaleDateString("en-CA", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })} at {new Date(selectedNoteForView.date).toLocaleTimeString("en-CA", {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }).toLowerCase()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Note Summary */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Summary</Label>
                  <div className="text-sm text-gray-900 bg-white p-3 rounded border border-gray-200">
                    {selectedNoteForView.summary}
                  </div>
                </div>

                {/* Note Description */}
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-900">Description</Label>
                  <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200 min-h-[100px] whitespace-pre-wrap">
                    {selectedNoteForView.description}
                  </div>
                </div>

                {/* Origin and Created By */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-900">Origin</Label>
                    <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                      {selectedNoteForView.originName}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-900">Created By</Label>
                    <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-200">
                      {selectedNoteForView.createdBy || "N/A"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                onClick={() => setIsNoteDetailDialogOpen(false)}
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {clientViewTab === "approvals" && (
          <div className="space-y-4">
            {/* Filters and Actions */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Checkbox id="include-completed" defaultChecked />
                <Label htmlFor="include-completed" className="text-xs text-gray-700 cursor-pointer">Include Completed</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox id="include-canceled" defaultChecked />
                <Label htmlFor="include-canceled" className="text-xs text-gray-700 cursor-pointer">Include Canceled</Label>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                <RefreshCw className="h-3 w-3 mr-2" />
                Refresh
              </Button>
            </div>

            {/* Pagination - Top */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                  |&lt;
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                  &lt;&lt;
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-7 w-7 p-0 text-xs">
                  1
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                  &gt;&gt;
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                  &gt;|
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-gray-700">Items per page:</Label>
                <Select defaultValue="25">
                  <SelectTrigger className="h-7 text-xs w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Approvals Table */}
            <div className="bg-white rounded border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                      <div className="flex items-center gap-1">
                        Description
                        <ChevronUp className="h-3 w-3 text-gray-500" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-blue-600 py-2 px-3">
                      <div className="flex items-center gap-1">
                        Date Created
                        <ChevronUp className="h-3 w-3 text-blue-600" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                      <div className="flex items-center gap-1">
                        Date Completed
                        <ChevronUp className="h-3 w-3 text-gray-500" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                      <div className="flex items-center gap-1">
                        Type
                        <ChevronUp className="h-3 w-3 text-gray-500" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                      <div className="flex items-center gap-1">
                        Status
                        <ChevronUp className="h-3 w-3 text-gray-500" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                      <div className="flex items-center gap-1">
                        Created From
                        <ChevronUp className="h-3 w-3 text-gray-500" />
                      </div>
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="text-xs py-2 px-3">Please review</TableCell>
                    <TableCell className="text-xs py-2 px-3">09/19/2022 11:12</TableCell>
                    <TableCell className="text-xs py-2 px-3"></TableCell>
                    <TableCell className="text-xs py-2 px-3">Docusign Envelope</TableCell>
                    <TableCell className="text-xs py-2 px-3">Cancelled</TableCell>
                    <TableCell className="text-xs py-2 px-3">Account Opening, Plan</TableCell>
                    <TableCell className="text-xs py-2 px-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow className="bg-gray-50">
                    <TableCell className="text-xs py-2 px-3">Please review</TableCell>
                    <TableCell className="text-xs py-2 px-3">09/19/2022 11:16</TableCell>
                    <TableCell className="text-xs py-2 px-3"></TableCell>
                    <TableCell className="text-xs py-2 px-3">Docusign Envelope</TableCell>
                    <TableCell className="text-xs py-2 px-3">Cancelled</TableCell>
                    <TableCell className="text-xs py-2 px-3">Account Opening, Plan</TableCell>
                    <TableCell className="text-xs py-2 px-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="text-xs py-2 px-3"></TableCell>
                    <TableCell className="text-xs py-2 px-3">08/12/2024 10:35</TableCell>
                    <TableCell className="text-xs py-2 px-3"></TableCell>
                    <TableCell className="text-xs py-2 px-3">Docusign Envelope</TableCell>
                    <TableCell className="text-xs py-2 px-3">Completed</TableCell>
                    <TableCell className="text-xs py-2 px-3">
                      <div className="flex items-center gap-1">
                        Fast Forms
                        <Bell className="h-3 w-3 text-red-600" />
                      </div>
                    </TableCell>
                    <TableCell className="text-xs py-2 px-3">
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>

            {/* Pagination - Bottom */}
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                  |&lt;
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                  &lt;&lt;
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white h-7 w-7 p-0 text-xs">
                  1
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                  &gt;&gt;
                </Button>
                <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                  &gt;|
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-gray-700">Items per page:</Label>
                <Select defaultValue="25">
                  <SelectTrigger className="h-7 text-xs w-16">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="25">25</SelectItem>
                    <SelectItem value="50">50</SelectItem>
                    <SelectItem value="100">100</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        {clientViewTab === "attachments" && (
          <div className="space-y-4">
            {/* Secondary Navigation Tabs */}
            <Tabs value={attachmentsSubTab} onValueChange={(value) => setAttachmentsSubTab(value as "rep-attachments" | "dealer-attachments" | "statement-history" | "trade-confirmations")}>
              <TabsList className="grid w-full grid-cols-4 h-8 mb-4">
                <TabsTrigger value="rep-attachments" className="text-xs">
                  Rep Attachments
                  <HelpCircle className="h-3 w-3 ml-1" />
                </TabsTrigger>
                <TabsTrigger value="dealer-attachments" className="text-xs">Dealer Attachments</TabsTrigger>
                <TabsTrigger value="statement-history" className="text-xs">Statement History</TabsTrigger>
                <TabsTrigger value="trade-confirmations" className="text-xs">Trade Confirmations</TabsTrigger>
              </TabsList>

              <TabsContent value="rep-attachments" className="mt-4">
                <div className="space-y-4">
                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <Button className="bg-green-600 hover:bg-green-700 text-white text-xs h-8">
                      Add New Attachment
                    </Button>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-8">
                      Download All Attachments
                    </Button>
                  </div>

                  {/* Filter Checkboxes */}
                  <div className="flex items-center gap-6 flex-wrap">
                    <div className="flex items-center gap-2">
                      <Checkbox id="include-inactive-attachments-filter" />
                      <Label htmlFor="include-inactive-attachments-filter" className="text-xs text-gray-700 cursor-pointer">Include Inactive Attachments</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="include-plans-attachments" defaultChecked />
                      <Label htmlFor="include-plans-attachments" className="text-xs text-gray-700 cursor-pointer">Include attachments from Plans, Funds, GICs, Transactions, and Trust Transactions</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="tree-view" />
                      <Label htmlFor="tree-view" className="text-xs text-gray-700 cursor-pointer">Tree View</Label>
                    </div>
                    <div className="flex items-center gap-2">
                      <Checkbox id="show-pinned-documents" />
                      <Label htmlFor="show-pinned-documents" className="text-xs text-gray-700 cursor-pointer">Show Pinned Documents</Label>
                    </div>
                  </div>

                  {/* Attachments Table */}
                  <div className="bg-white rounded border border-gray-200">
                    {/* Pagination - Top */}
                    <div className="flex items-center justify-between p-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">1-3 of 3 records</span>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                          &lt;&lt;
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                          &lt;
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white h-7 w-7 p-0 text-xs">
                          1
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                          &gt;
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                          &gt;&gt;
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="25">
                          <SelectTrigger className="h-7 text-xs w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-xs text-gray-700">Select * For All</span>
                      </div>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                Date Submitted
                                <ChevronUp className="h-3 w-3 text-gray-500" />
                              </div>
                              <Input className="h-6 text-xs" placeholder="" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                Document Type
                                <ChevronUp className="h-3 w-3 text-gray-500" />
                              </div>
                              <Input className="h-6 text-xs" placeholder="" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                Attachment Description
                                <ChevronUp className="h-3 w-3 text-gray-500" />
                              </div>
                              <Input className="h-6 text-xs" placeholder="" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex items-center gap-1">
                              Visible Status to Client
                              <Eye className="h-3 w-3 text-gray-500" />
                              <Star className="h-3 w-3 text-gray-500" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex items-center gap-1">
                              Compliance Reviews
                              <Bell className="h-3 w-3 text-gray-500" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell className="text-xs py-2 px-3">03/20/2020</TableCell>
                          <TableCell className="text-xs py-2 px-3">Void Cheque</TableCell>
                          <TableCell className="text-xs py-2 px-3">attachment</TableCell>
                          <TableCell className="text-xs py-2 px-3">
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <Eye className="h-4 w-4 text-blue-600" />
                            </div>
                          </TableCell>
                          <TableCell className="text-xs py-2 px-3">
                            <div className="flex items-center gap-1">
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-6">
                                Notify
                              </Button>
                              <Bell className="h-3 w-3 text-gray-500" />
                            </div>
                          </TableCell>
                          <TableCell className="text-xs py-2 px-3">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow className="bg-gray-50">
                          <TableCell className="text-xs py-2 px-3">03/19/2020</TableCell>
                          <TableCell className="text-xs py-2 px-3">Client Dual Occupation Disclosure</TableCell>
                          <TableCell className="text-xs py-2 px-3">attachment</TableCell>
                          <TableCell className="text-xs py-2 px-3">
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <Eye className="h-4 w-4 text-blue-600" />
                            </div>
                          </TableCell>
                          <TableCell className="text-xs py-2 px-3">
                            <div className="flex items-center gap-1">
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-6">
                                Notify
                              </Button>
                              <Bell className="h-3 w-3 text-gray-500" />
                            </div>
                          </TableCell>
                          <TableCell className="text-xs py-2 px-3">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell className="text-xs py-2 px-3">03/19/2020</TableCell>
                          <TableCell className="text-xs py-2 px-3">Estatement consent</TableCell>
                          <TableCell className="text-xs py-2 px-3">attachment</TableCell>
                          <TableCell className="text-xs py-2 px-3">
                            <div className="flex items-center gap-1">
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                              <Eye className="h-4 w-4 text-blue-600" />
                            </div>
                          </TableCell>
                          <TableCell className="text-xs py-2 px-3">
                            <div className="flex items-center gap-1">
                              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-6">
                                Notify
                              </Button>
                              <Bell className="h-3 w-3 text-gray-500" />
                            </div>
                          </TableCell>
                          <TableCell className="text-xs py-2 px-3">
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white text-xs h-7">
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    {/* Pagination - Bottom */}
                    <div className="flex items-center justify-between p-3 border-t border-gray-200">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-700">1-3 of 3 records</span>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                          &lt;&lt;
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                          &lt;
                        </Button>
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white h-7 w-7 p-0 text-xs">
                          1
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                          &gt;
                        </Button>
                        <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                          &gt;&gt;
                        </Button>
                      </div>
                      <div className="flex items-center gap-2">
                        <Select defaultValue="25">
                          <SelectTrigger className="h-7 text-xs w-16">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-xs text-gray-700">Select * For All</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="dealer-attachments" className="mt-4">
                <div className="space-y-4">
                  {/* Section Header */}
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-2 pb-2 border-b-2 border-gray-300">Attachments</h3>
                  </div>

                  {/* Include Rep Attachments Checkbox */}
                  <div className="flex items-center gap-2">
                    <Checkbox id="include-rep-attachments" />
                    <Label htmlFor="include-rep-attachments" className="text-xs text-gray-700 cursor-pointer">Include Rep Attachments</Label>
                  </div>

                  {/* Pagination - Top */}
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-700">0-0 of 0 records</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        |&lt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &lt;&lt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &gt;&gt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &gt;|
                      </Button>
                    </div>
                    <Select defaultValue="25">
                      <SelectTrigger className="h-7 text-xs w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-gray-700">Select * For All</span>
                  </div>

                  {/* Attachments Table */}
                  <div className="bg-white rounded border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                Document Type
                                <ChevronUp className="h-3 w-3 text-gray-500" />
                              </div>
                              <Input className="h-6 text-xs" placeholder="" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                Attachment Description
                                <ChevronUp className="h-3 w-3 text-gray-500" />
                              </div>
                              <Input className="h-6 text-xs" placeholder="" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex flex-col gap-1">
                              <div className="flex items-center gap-1">
                                Date Scanned
                                <ChevronUp className="h-3 w-3 text-gray-500" />
                              </div>
                              <Input className="h-6 text-xs" placeholder="" />
                            </div>
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={3} className="text-center py-8">
                            <p className="text-xs text-gray-500">No attachments found</p>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination - Bottom */}
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-gray-700">0-0 of 0 records</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        |&lt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &lt;&lt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &gt;&gt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &gt;|
                      </Button>
                    </div>
                    <Select defaultValue="25">
                      <SelectTrigger className="h-7 text-xs w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-gray-700">Select * For All</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="statement-history" className="mt-4">
                <div className="space-y-4">
                  {/* Section Header */}
                  <div>
                    <h3 className="text-sm font-semibold text-black mb-2 pb-2 border-b-2 border-gray-300">Statement History</h3>
                  </div>

                  {/* Pagination - Top */}
                  <div className="bg-blue-50 px-4 py-2 rounded border border-blue-200 flex items-center gap-4">
                    <span className="text-xs text-gray-700">0-0 of 0 records</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        |&lt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &lt;&lt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &gt;&gt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &gt;|
                      </Button>
                    </div>
                    <Select defaultValue="25">
                      <SelectTrigger className="h-7 text-xs w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-gray-700">Select * For All</span>
                  </div>

                  {/* Statement History Table */}
                  <div className="bg-white rounded border border-gray-200">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex items-center gap-1">
                              Period
                              <ChevronUp className="h-3 w-3 text-gray-500" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex items-center gap-1">
                              Dealership
                              <ChevronUp className="h-3 w-3 text-gray-500" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Representative</TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Viewed</TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex items-center gap-1">
                              Viewed Date
                              <ChevronUp className="h-3 w-3 text-gray-500" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Released</TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                            <div className="flex items-center gap-1">
                              Posted Date
                              <ChevronUp className="h-3 w-3 text-gray-500" />
                            </div>
                          </TableHead>
                          <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Open</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell colSpan={8} className="text-center py-8">
                            <p className="text-xs text-gray-500">No records found.</p>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>

                  {/* Pagination - Bottom */}
                  <div className="bg-blue-50 px-4 py-2 rounded border border-blue-200 flex items-center gap-4">
                    <span className="text-xs text-gray-700">0-0 of 0 records</span>
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        |&lt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &lt;&lt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &gt;&gt;
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                        &gt;|
                      </Button>
                    </div>
                    <Select defaultValue="25">
                      <SelectTrigger className="h-7 text-xs w-16">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="25">25</SelectItem>
                        <SelectItem value="50">50</SelectItem>
                        <SelectItem value="100">100</SelectItem>
                      </SelectContent>
                    </Select>
                    <span className="text-xs text-gray-700">Select * For All</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trade-confirmations" className="mt-4 space-y-4">
                {/* Trade Confirmations Heading */}
                <h3 className="text-sm font-semibold text-black mb-2 pb-2 border-b-2 border-gray-300">Trade Confirmations</h3>

                {/* Pagination - Top */}
                <div className="bg-blue-50 px-4 py-2 rounded border border-blue-200 flex items-center gap-4">
                  <span className="text-xs text-gray-700">0-0 of 0 records</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                      |&lt;
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                      &lt;&lt;
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                      &gt;&gt;
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                      &gt;|
                    </Button>
                  </div>
                  <Select defaultValue="25">
                    <SelectTrigger className="h-7 text-xs w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Trade Confirmations Table */}
                <div className="bg-white rounded border border-gray-200">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-blue-50">
                        <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                          <div className="flex items-center gap-1">
                            Plan
                            <ChevronUp className="h-3 w-3 text-gray-500" />
                          </div>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">
                          <div className="flex items-center gap-1">
                            Date
                            <ChevronUp className="h-3 w-3 text-gray-500" />
                          </div>
                        </TableHead>
                        <TableHead className="text-xs font-semibold text-gray-700 py-2 px-3">Open</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8">
                          <p className="text-xs text-gray-500">No records found.</p>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination - Bottom */}
                <div className="bg-blue-50 px-4 py-2 rounded border border-blue-200 flex items-center gap-4">
                  <span className="text-xs text-gray-700">0-0 of 0 records</span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                      |&lt;
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                      &lt;&lt;
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                      &gt;&gt;
                    </Button>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-xs">
                      &gt;|
                    </Button>
                  </div>
                  <Select defaultValue="25">
                    <SelectTrigger className="h-7 text-xs w-16">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                      <SelectItem value="100">100</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Deposit Dialog */}
      <Dialog open={isDepositDialogOpen} onOpenChange={setIsDepositDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <DollarSign className="h-5 w-5 text-gray-600" />
              Deposit to Trust Account
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Add funds to the client's trust account
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <label className="text-sm font-semibold text-gray-700 mb-2 block">
              Amount (CAD)
            </label>
            <Input
              type="text"
              value={depositAmount === "0.00" ? "" : depositAmount}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9.]/g, "");
                setDepositAmount(value || "0.00");
              }}
              placeholder="$0.00"
              className="text-lg font-semibold"
            />
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsDepositDialogOpen(false);
                setDepositAmount("0.00");
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                // Handle deposit logic here
                setIsDepositDialogOpen(false);
                setDepositAmount("0.00");
              }}
            >
              Deposit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Buy More Units Dialog */}
      <Dialog open={isBuyUnitsDialogOpen} onOpenChange={setIsBuyUnitsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {dialogContext === "plan" ? (() => {
            // Find plan by accountNumber
            const currentPlan = plansList.find(p => p.accountNumber === selectedPlan?.accountNumber);
            const planInvestments = currentPlan ? getPlanInvestments(currentPlan.id) : [];
            const existingFunds = planInvestments.map(fundId => getFundAccountById(fundId)).filter(Boolean);
            
            // Convert selected fund to product format
            const selectedFundProduct = planLevelSelectedFund ? (planLevelSelectedFund.isExisting ? {
              product: planLevelSelectedFund.productName || "",
              units: planLevelSelectedFund.currentPrice ? (() => {
                const price = parseFloat(planLevelSelectedFund.currentPrice.replace(/[^0-9.]/g, ''));
                const marketValue = parseFloat(planLevelSelectedFund.marketValue.replace(/[^0-9.]/g, ''));
                return price > 0 ? (marketValue / price).toFixed(4) : "0.0000";
              })() : "0.0000",
              price: planLevelSelectedFund.currentPrice || "$0.00",
              marketValue: planLevelSelectedFund.marketValue || "$0.00",
            } : {
              product: planLevelSelectedFund.name || "",
              units: "0.0000",
              price: "$0.00",
              marketValue: "$0.00",
            }) : null;
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg">
                    <Plus className="h-5 w-5 text-green-600" />
                    Buy More Units
                  </DialogTitle>
                  <DialogDescription className="text-[11px] text-gray-600 mt-2 leading-tight">
                    {planBuyStep === "select" 
                      ? "Select a fund to purchase. Choose an existing fund to reuse account number, or select a new fund to add."
                      : `Purchase additional units of ${selectedFundProduct?.product?.split(" Series")[0] || selectedFundProduct?.product || ""}`}
                  </DialogDescription>
                </DialogHeader>
                {planBuyStep === "select" ? (
                  <>
                    <div className="space-y-4 py-4">
                      {/* Select Fund Company */}
                      <div className="relative">
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Select Fund Company
                        </Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                          <Input
                            type="text"
                            value={planLevelFundCompany || planLevelCompanySearch}
                            onChange={(e) => {
                              const search = e.target.value;
                              setPlanLevelCompanySearch(search);
                              if (search !== planLevelFundCompany) {
                                setPlanLevelFundCompany("");
                                setPlanLevelSelectedFund(null);
                                setPlanLevelFundSearch("");
                              }
                            }}
                            onFocus={() => {
                              if (planLevelFundCompany) {
                                setPlanLevelCompanySearch(planLevelFundCompany);
                              }
                            }}
                            placeholder="Select fund company"
                            className="pl-10"
                          />
                        </div>
                        {planLevelCompanySearch && !planLevelFundCompany && (
                          <div className="absolute z-50 w-full mt-1 max-h-56 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg p-1.5">
                            <div className="space-y-0.5">
                              {FUND_COMPANIES
                                .filter((company) =>
                                  company.name.toLowerCase().includes(planLevelCompanySearch.toLowerCase())
                                )
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((company) => (
                                  <Card
                                    key={company.id}
                                    className="border cursor-pointer transition-colors border-gray-200 bg-gray-50 hover:bg-gray-100"
                                    onClick={() => {
                                      setPlanLevelFundCompany(company.name);
                                      setPlanLevelCompanySearch("");
                                      setPlanLevelSelectedFund(null);
                                      setPlanLevelFundSearch("");
                                    }}
                                  >
                                    <CardContent className="p-2 flex items-center justify-between">
                                      <div>
                                        <p className="text-xs font-semibold text-gray-900">{company.name}</p>
                                        <p className="text-[10px] text-gray-600">{company.fundsCount} funds available</p>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Select Fund */}
                      {planLevelFundCompany ? (
                        <div className="relative">
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Select Fund
                          </Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                            <Input
                              type="text"
                              value={planLevelSelectedFund?.name || ""}
                              onChange={(e) => {
                                const search = e.target.value;
                                setPlanLevelFundSearch(search);
                                if (search !== planLevelSelectedFund?.name) {
                                  setPlanLevelSelectedFund(null);
                                }
                              }}
                              placeholder={`Search ${planLevelFundCompany} funds by name, symbol, or category`}
                              className="pl-10"
                            />
                          </div>
                          {planLevelFundSearch && !planLevelSelectedFund && COMPANY_FUNDS[planLevelFundCompany] && (
                            <div className="absolute z-50 w-full mt-1 max-h-56 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg p-1.5">
                              <div className="space-y-0.5">
                                {COMPANY_FUNDS[planLevelFundCompany]
                                  .filter((fund) =>
                                    fund.name.toLowerCase().includes(planLevelFundSearch.toLowerCase()) ||
                                    fund.symbol.toLowerCase().includes(planLevelFundSearch.toLowerCase()) ||
                                    fund.category.toLowerCase().includes(planLevelFundSearch.toLowerCase())
                                  )
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((fund, index) => (
                                    <Card
                                      key={index}
                                      className="border cursor-pointer transition-colors border-gray-200 bg-gray-50 hover:bg-gray-100"
                                      onClick={() => {
                                        setPlanLevelSelectedFund(fund);
                                        setPlanLevelFundSearch("");
                                      }}
                                    >
                                      <CardContent className="p-2">
                                        <p className="text-xs font-semibold text-gray-900">{fund.name}</p>
                                        <p className="text-[10px] text-gray-600">{fund.symbol} • {fund.category}</p>
                                      </CardContent>
                                    </Card>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : existingFunds.length > 0 && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Or Select Existing Fund in Plan
                          </Label>
                          <ScrollArea className="h-32 border border-gray-200 rounded-md p-2">
                            <div className="space-y-1">
                              {existingFunds.map((fund) => (
                                <Card
                                  key={fund.id}
                                  className={`border cursor-pointer transition-colors ${
                                    planLevelSelectedFund?.id === fund.id
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                  }`}
                                  onClick={() => {
                                    setPlanLevelSelectedFund({ ...fund, isExisting: true });
                                    setPlanLevelFundCompany("");
                                    setPlanLevelCompanySearch("");
                                    setPlanLevelFundSearch("");
                                  }}
                                >
                                  <CardContent className="p-2">
                                    <p className="text-xs font-semibold text-gray-900">{fund.productName}</p>
                                    <p className="text-[10px] text-gray-600">Account: {fund.accountNumber || fund.id}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsBuyUnitsDialogOpen(false);
                          setInvestmentAmount("");
                          setNumberOfUnits("");
                          setPlanLevelSelectedFund(null);
                          setPlanLevelFundCompany("");
                          setPlanLevelCompanySearch("");
                          setPlanLevelFundSearch("");
                          setPlanBuyStep("select");
                        }}
                      >
                        Cancel
                      </Button>
                      {planLevelSelectedFund && (
                        <Button
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => {
                            setPlanBuyStep("details");
                            setInvestmentAmount("");
                            setNumberOfUnits("");
                          }}
                        >
                          Next
                        </Button>
                      )}
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <div className="space-y-4 py-4">
                      {/* Account Balance */}
                      <Card className="border border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-xs font-semibold text-gray-700">Account Balance</p>
                            <p className="text-xs font-semibold text-gray-700">{selectedPlan?.shortType || "RRSP"} CAD</p>
                          </div>
                          <p className="text-2xl font-bold text-gray-900 mb-2">${selectedPlanBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                          <div className="space-y-1">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Settled:</span>
                              <span className="text-gray-900 font-medium">${selectedPlanBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-600">Unsettled:</span>
                              <span className="text-gray-900 font-medium">$0.00</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Current Holdings */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-900">Current Holdings ({selectedPlan?.shortType || "RRSP"})</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Units</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedFundProduct?.units || "0.0000"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Price</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedFundProduct?.price || "$0.00"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Market Value</p>
                            <p className="text-sm font-medium text-gray-900">{selectedFundProduct?.marketValue || "$0.00"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Investment Input */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Investment Amount ($)
                          </label>
                          <Input
                            type="number"
                            value={investmentAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              setInvestmentAmount(value);
                              if (value && selectedFundProduct?.price) {
                                const price = parseFloat(selectedFundProduct.price.replace("$", "").replace(" Per Unit", ""));
                                if (price > 0) {
                                  const units = (parseFloat(value) / price).toFixed(4);
                                  setNumberOfUnits(units);
                                } else {
                                  setNumberOfUnits("");
                                }
                              } else {
                                setNumberOfUnits("");
                              }
                            }}
                            placeholder="Enter amount to invest"
                            className="text-lg font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Or Number of Units
                          </label>
                          <Input
                            type="number"
                            value={numberOfUnits}
                            onChange={(e) => {
                              const value = e.target.value;
                              setNumberOfUnits(value);
                              if (value && selectedFundProduct?.price) {
                                const price = parseFloat(selectedFundProduct.price.replace("$", "").replace(" Per Unit", ""));
                                if (price > 0) {
                                  const amount = (parseFloat(value) * price).toFixed(2);
                                  setInvestmentAmount(amount);
                                } else {
                                  setInvestmentAmount("");
                                }
                              } else {
                                setInvestmentAmount("");
                              }
                            }}
                            placeholder="Enter number of units"
                            className="text-lg font-semibold"
                          />
                        </div>
                      </div>

                      {/* Estimated Cost */}
                      <Card className="border border-blue-200 bg-blue-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold text-gray-900">Estimated Cost</p>
                            <p className="text-2xl font-bold text-gray-900">${investmentAmount ? parseFloat(investmentAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Units to purchase:</span>
                              <span className="text-gray-900 font-medium">
                                {numberOfUnits || (investmentAmount && selectedFundProduct?.price
                                  ? (() => {
                                      const price = parseFloat(selectedFundProduct.price.replace("$", "").replace(" Per Unit", ""));
                                      return price > 0 ? (parseFloat(investmentAmount) / price).toFixed(4) : "0.0000";
                                    })()
                                  : "0.0000")}
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Based on avg. cost</span>
                              <span className="text-gray-900 font-medium">
                                {selectedFundProduct?.price || "$0.00"}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPlanBuyStep("select");
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsBuyUnitsDialogOpen(false);
                          setInvestmentAmount("");
                          setNumberOfUnits("");
                          setPlanLevelSelectedFund(null);
                          setPlanLevelFundCompany("");
                          setPlanLevelCompanySearch("");
                          setPlanLevelFundSearch("");
                          setPlanBuyStep("select");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-green-600 hover:bg-green-700 text-white"
                        disabled={!investmentAmount || parseFloat(investmentAmount) <= 0}
                        onClick={() => {
                          const price = selectedFundProduct?.price ? parseFloat(selectedFundProduct.price.replace("$", "").replace(" Per Unit", "")) : 0;
                          const units = numberOfUnits || (investmentAmount && price > 0
                            ? (parseFloat(investmentAmount) / price).toFixed(4)
                            : "0.0000");
                          
                          setOrderDetails({
                            product: selectedFundProduct?.product?.split(" Series")[0] || selectedFundProduct?.product || "",
                            units: units,
                            price: `$${price.toFixed(2)}`,
                            totalCost: `$${investmentAmount ? parseFloat(investmentAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}`,
                          });
                          
                          setIsBuyUnitsDialogOpen(false);
                          setIsOrderConfirmedDialogOpen(true);
                          setInvestmentAmount("");
                          setNumberOfUnits("");
                          setPlanLevelSelectedFund(null);
                          setPlanLevelFundCompany("");
                          setPlanLevelCompanySearch("");
                          setPlanLevelFundSearch("");
                          setPlanBuyStep("select");
                        }}
                      >
                        Place Buy Order
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </>
            );
          })() : selectedProduct?.product ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Plus className="h-5 w-5 text-green-600" />
                  Buy More Units
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-2">
                  Purchase additional units of {selectedProduct.product.split(" Series")[0] || selectedProduct.product}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                {/* Account Balance */}
                <Card className="border border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-semibold text-gray-700">Account Balance</p>
                      <p className="text-xs font-semibold text-gray-700">{selectedPlan?.shortType || "RRSP"} CAD</p>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mb-2">${selectedPlanBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Settled:</span>
                        <span className="text-gray-900 font-medium">${selectedPlanBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Unsettled:</span>
                        <span className="text-gray-900 font-medium">$0.00</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Current Holdings */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-900">Current Holdings ({selectedPlan?.shortType || "RRSP"})</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Units</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedProduct?.units || "0.00"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Price</p>
                      <p className="text-sm font-medium text-gray-900">
                        {selectedProduct?.price || "$0.00"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Market Value</p>
                      <p className="text-sm font-medium text-gray-900">{selectedProduct?.marketValue || "$0.00"}</p>
                    </div>
                  </div>
                </div>

                {/* Investment Input */}
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Investment Amount ($)
                    </label>
                    <Input
                      type="number"
                      value={investmentAmount}
                      onChange={(e) => {
                        const value = e.target.value;
                        setInvestmentAmount(value);
                        if (value && selectedProduct?.price) {
                          const price = parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""));
                          if (price > 0) {
                            const units = (parseFloat(value) / price).toFixed(4);
                            setNumberOfUnits(units);
                          } else {
                            setNumberOfUnits("");
                          }
                        } else {
                          setNumberOfUnits("");
                        }
                      }}
                      placeholder="Enter amount to invest"
                      className="text-lg font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-700 mb-2 block">
                      Or Number of Units
                    </label>
                    <Input
                      type="number"
                      value={numberOfUnits}
                      onChange={(e) => {
                        const value = e.target.value;
                        setNumberOfUnits(value);
                        if (value && selectedProduct?.price) {
                          const price = parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""));
                          if (price > 0) {
                            const amount = (parseFloat(value) * price).toFixed(2);
                            setInvestmentAmount(amount);
                          } else {
                            setInvestmentAmount("");
                          }
                        } else {
                          setInvestmentAmount("");
                        }
                      }}
                      placeholder="Enter number of units"
                      className="text-lg font-semibold"
                    />
                  </div>
                </div>

                {/* Estimated Cost */}
                <Card className="border border-blue-200 bg-blue-50">
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-sm font-semibold text-gray-900">Estimated Cost</p>
                      <p className="text-2xl font-bold text-gray-900">${investmentAmount ? parseFloat(investmentAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Units to purchase:</span>
                        <span className="text-gray-900 font-medium">
                          {numberOfUnits || (investmentAmount && selectedProduct?.price
                            ? (() => {
                                const price = parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""));
                                return price > 0 ? (parseFloat(investmentAmount) / price).toFixed(4) : "0.0000";
                              })()
                            : "0.0000")}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Based on avg. cost</span>
                        <span className="text-gray-900 font-medium">
                          {selectedProduct?.price || "$0.00"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsBuyUnitsDialogOpen(false);
                    setInvestmentAmount("200");
                    setNumberOfUnits("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={!investmentAmount || parseFloat(investmentAmount) <= 0}
                  onClick={() => {
                    const price = selectedProduct?.price ? parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", "")) : 0;
                    const units = numberOfUnits || (investmentAmount && price > 0
                      ? (parseFloat(investmentAmount) / price).toFixed(4)
                      : "0.0000");
                    
                    setOrderDetails({
                      product: selectedProduct?.product?.split(" Series")[0] || selectedProduct?.product || "",
                      units: units,
                      price: `$${price.toFixed(2)}`,
                      totalCost: `$${investmentAmount ? parseFloat(investmentAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "0.00"}`,
                    });
                    
                    setIsBuyUnitsDialogOpen(false);
                    setIsOrderConfirmedDialogOpen(true);
                    setInvestmentAmount("");
                    setNumberOfUnits("");
                  }}
                >
                  Place Buy Order
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg">
                  <Plus className="h-5 w-5 text-green-600" />
                  Buy More Units
                </DialogTitle>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsBuyUnitsDialogOpen(false);
                    setInvestmentAmount("");
                    setNumberOfUnits("");
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Order Confirmed Dialog */}
      <Dialog open={isOrderConfirmedDialogOpen} onOpenChange={setIsOrderConfirmedDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-lg font-semibold text-center">Order Confirmation</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2 text-center">
              Your buy order has been placed successfully
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Order Details */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Product</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {orderDetails?.product || ""}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units</p>
                        <p className="text-sm font-medium text-gray-900">{orderDetails?.units || "5.6980"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Price per Unit</p>
                        <p className="text-sm font-medium text-gray-900">{orderDetails?.price || "$175.50"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-900">Total Cost</p>
                      <p className="text-sm font-bold text-gray-900">{orderDetails?.totalCost || "$1,000.00"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setIsOrderConfirmedDialogOpen(false);
                setOrderDetails(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sell Units Dialog */}
      <Dialog open={isSellUnitsDialogOpen} onOpenChange={setIsSellUnitsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {dialogContext === "plan" ? (() => {
            // Find plan by accountNumber
            const currentPlan = plansList.find(p => p.accountNumber === selectedPlan?.accountNumber);
            const planInvestments = currentPlan ? getPlanInvestments(currentPlan.id) : [];
            const existingFunds = planInvestments.map(fundId => getFundAccountById(fundId)).filter(Boolean);
            
            // Convert selected fund to product format for sell form
            const selectedFundForSell = planLevelSelectedFund?.isExisting ? planLevelSelectedFund : null;
            const selectedFundProduct = selectedFundForSell ? {
              product: selectedFundForSell.productName || "",
              units: selectedFundForSell.currentPrice ? (() => {
                const price = parseFloat(selectedFundForSell.currentPrice.replace(/[^0-9.]/g, ''));
                const marketValue = parseFloat(selectedFundForSell.marketValue.replace(/[^0-9.]/g, ''));
                return price > 0 ? (marketValue / price).toFixed(4) : "0.0000";
              })() : "0.0000",
              price: selectedFundForSell.currentPrice || "$0.00",
              marketValue: selectedFundForSell.marketValue || "$0.00",
            } : null;
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-lg text-red-600">
                    <Minus className="h-5 w-5 text-red-600" />
                    Sell Units
                  </DialogTitle>
                  <DialogDescription className="text-[11px] text-gray-600 mt-2 leading-tight">
                    {selectedFundForSell ? `Sell units of ${selectedFundForSell.productName || ""}` : "Select an existing fund to sell from"}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  {!selectedFundForSell ? (
                    // Fund selection
                    existingFunds.length > 0 ? (
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Select Fund to Sell From
                        </Label>
                        <ScrollArea className="h-64 border border-gray-200 rounded-md p-2">
                          <div className="space-y-1">
                            {existingFunds.map((fund) => (
                              <Card
                                key={fund.id}
                                className="border cursor-pointer transition-colors border-gray-200 bg-gray-50 hover:bg-gray-100"
                                onClick={() => {
                                  setPlanLevelSelectedFund({ ...fund, isExisting: true });
                                  setSellUnits("");
                                  setSellDollarAmount("");
                                }}
                              >
                                <CardContent className="p-2">
                                  <p className="text-xs font-semibold text-gray-900">{fund.productName}</p>
                                  <p className="text-[10px] text-gray-600">Account: {fund.accountNumber || fund.id}</p>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500 text-sm">
                        No funds available in this plan
                      </div>
                    )
                  ) : (
                    // Sell details form
                    <>
                      {/* Current Holdings */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-gray-900">Current Holdings ({selectedPlan?.shortType || "RRSP"})</p>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Units Available</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedFundProduct?.units || "0.0000"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Price</p>
                            <p className="text-sm font-medium text-gray-900">
                              {selectedFundProduct?.price || "$0.00"}
                            </p>
                          </div>
                          <div>
                            <p className="text-xs text-gray-600 mb-1">Market Value</p>
                            <p className="text-sm font-medium text-gray-900">{selectedFundProduct?.marketValue || "$0.00"}</p>
                          </div>
                        </div>
                      </div>

                      {/* Sell Input */}
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Number of Units to Sell
                          </label>
                          <Input
                            type="number"
                            step="any"
                            value={sellUnits}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSellUnits(value);
                              if (value && selectedFundProduct?.price) {
                                const price = parseFloat(selectedFundProduct.price.replace("$", "").replace(" Per Unit", ""));
                                const maxUnits = parseFloat(selectedFundProduct?.units || "0.0000");
                                const inputUnits = parseFloat(value);
                                if (!isNaN(inputUnits) && price > 0) {
                                  const unitsToUse = inputUnits > maxUnits ? maxUnits : inputUnits;
                                  const amount = (unitsToUse * price).toFixed(2);
                                  setSellDollarAmount(amount);
                                } else {
                                  setSellDollarAmount("");
                                }
                              } else {
                                setSellDollarAmount("");
                              }
                            }}
                            onBlur={(e) => {
                              const value = e.target.value;
                              if (value && selectedFundProduct?.price) {
                                const price = parseFloat(selectedFundProduct.price.replace("$", "").replace(" Per Unit", ""));
                                const maxUnits = parseFloat(selectedFundProduct?.units || "0.0000");
                                const inputUnits = parseFloat(value);
                                if (!isNaN(inputUnits) && price > 0) {
                                  const unitsToUse = inputUnits > maxUnits ? maxUnits : inputUnits;
                                  setSellUnits(unitsToUse.toFixed(4));
                                  const amount = (unitsToUse * price).toFixed(2);
                                  setSellDollarAmount(amount);
                                }
                              }
                            }}
                            placeholder={`Max: ${selectedFundProduct?.units || "0.0000"}`}
                            className="text-lg font-semibold"
                            max={parseFloat(selectedFundProduct?.units || "0.0000")}
                          />
                        </div>
                        <div>
                          <label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Or Dollar Amount ($)
                          </label>
                          <Input
                            type="number"
                            step="any"
                            value={sellDollarAmount}
                            onChange={(e) => {
                              const value = e.target.value;
                              setSellDollarAmount(value);
                              if (value && selectedFundProduct?.price) {
                                const price = parseFloat(selectedFundProduct.price.replace("$", "").replace(" Per Unit", ""));
                                const maxUnits = parseFloat(selectedFundProduct?.units || "0.0000");
                                const calculatedUnits = parseFloat(value) / price;
                                const unitsToUse = calculatedUnits > maxUnits ? maxUnits : calculatedUnits;
                                if (!isNaN(unitsToUse) && price > 0) {
                                  setSellUnits(unitsToUse.toFixed(4));
                                } else {
                                  setSellUnits("");
                                }
                              } else {
                                setSellUnits("");
                              }
                            }}
                            placeholder="Enter dollar amount"
                            className="text-lg font-semibold"
                          />
                        </div>
                      </div>

                      {/* Estimated Proceeds */}
                      <Card className="border border-yellow-200 bg-yellow-50">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <p className="text-sm font-semibold text-gray-900">Estimated Proceeds</p>
                            <p className="text-2xl font-bold text-gray-900">
                              ${sellDollarAmount 
                                ? parseFloat(sellDollarAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                : (sellUnits && selectedFundProduct?.price
                                  ? (parseFloat(sellUnits) * parseFloat(selectedFundProduct.price.replace("$", "").replace(" Per Unit", ""))).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                                  : "0.00")}
                            </p>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Units to sell:</span>
                              <span className="text-gray-900 font-medium">
                                {sellUnits || (sellDollarAmount && selectedFundProduct?.price
                                  ? (parseFloat(sellDollarAmount) / parseFloat(selectedFundProduct.price.replace("$", "").replace(" Per Unit", ""))).toFixed(4)
                                  : "0.0000")}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600">
                              Before fees and taxes • Based on avg. cost {selectedFundProduct?.price || "$0.00"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </>
                  )}
                </div>
                <DialogFooter className="gap-2">
                  {selectedFundForSell && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setPlanLevelSelectedFund(null);
                        setSellUnits("");
                        setSellDollarAmount("");
                      }}
                    >
                      Back
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsSellUnitsDialogOpen(false);
                      setSellUnits("");
                      setSellDollarAmount("");
                      setPlanLevelSelectedFund(null);
                      setPlanLevelFundCompany("");
                      setPlanLevelCompanySearch("");
                      setPlanLevelFundSearch("");
                    }}
                  >
                    Cancel
                  </Button>
                  {selectedFundForSell && (
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={!sellUnits || parseFloat(sellUnits) <= 0}
                      onClick={() => {
                        const price = selectedFundProduct?.price ? parseFloat(selectedFundProduct.price.replace("$", "").replace(" Per Unit", "")) : 0;
                        const units = sellUnits || (sellDollarAmount
                          ? (parseFloat(sellDollarAmount) / price).toFixed(4)
                          : "0.0000");
                        const proceeds = sellDollarAmount || (sellUnits
                          ? (parseFloat(sellUnits) * price).toFixed(2)
                          : "0.00");
                        
                        const productName = selectedFundForSell.productName || "";
                        const displayProductName = productName.split(" Series")[0] || productName;
                        
                        setSellOrderDetails({
                          product: displayProductName,
                          units: units,
                          price: `$${price.toFixed(2)}`,
                          totalProceeds: `$${parseFloat(proceeds).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                        });
                        
                        setIsSellUnitsDialogOpen(false);
                        setIsSellOrderConfirmedDialogOpen(true);
                        setSellUnits("");
                        setSellDollarAmount("");
                        setPlanLevelSelectedFund(null);
                      }}
                    >
                      Place Sell Order
                    </Button>
                  )}
                </DialogFooter>
              </>
            );
          })() : selectedProduct?.product ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-red-600">
                  <Minus className="h-5 w-5 text-red-600" />
                  Sell Units
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-2">
                  Sell units of {selectedProduct.product.split(" Series")[0] || selectedProduct.product}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
            {/* Current Holdings */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-gray-900">Current Holdings ({selectedPlan?.shortType || "RRSP"})</p>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-xs text-gray-600 mb-1">Units Available</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedProduct?.units || "150.00"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Price</p>
                  <p className="text-sm font-medium text-gray-900">
                    {selectedProduct?.price || "$175.50"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Market Value</p>
                  <p className="text-sm font-medium text-gray-900">{selectedProduct?.marketValue || "$26,325.00"}</p>
                </div>
              </div>
            </div>

            {/* Sell Input */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Number of Units to Sell
                </label>
                <Input
                  type="number"
                  step="any"
                  value={sellUnits}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSellUnits(value);
                    if (value && selectedProduct?.price) {
                      const price = parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""));
                      const maxUnits = parseFloat(selectedProduct?.units || "150.00");
                      const inputUnits = parseFloat(value);
                      if (!isNaN(inputUnits) && price > 0) {
                        const unitsToUse = inputUnits > maxUnits ? maxUnits : inputUnits;
                        const amount = (unitsToUse * price).toFixed(2);
                        setSellDollarAmount(amount);
                      } else {
                        setSellDollarAmount("");
                      }
                    } else {
                      setSellDollarAmount("");
                    }
                  }}
                  onBlur={(e) => {
                    const value = e.target.value;
                    if (value && selectedProduct?.price) {
                      const price = parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""));
                      const maxUnits = parseFloat(selectedProduct?.units || "150.00");
                      const inputUnits = parseFloat(value);
                      if (!isNaN(inputUnits) && price > 0) {
                        const unitsToUse = inputUnits > maxUnits ? maxUnits : inputUnits;
                        setSellUnits(unitsToUse.toFixed(4));
                        const amount = (unitsToUse * price).toFixed(2);
                        setSellDollarAmount(amount);
                      }
                    }
                  }}
                  placeholder={`Max: ${selectedProduct?.units || "150.00"}`}
                  className="text-lg font-semibold"
                  max={parseFloat(selectedProduct?.units || "150.00")}
                />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  Or Dollar Amount ($)
                </label>
                <Input
                  type="number"
                  step="any"
                  value={sellDollarAmount}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSellDollarAmount(value);
                    if (value && selectedProduct?.price) {
                      const price = parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""));
                      const maxUnits = parseFloat(selectedProduct?.units || "150.00");
                      const calculatedUnits = parseFloat(value) / price;
                      const unitsToUse = calculatedUnits > maxUnits ? maxUnits : calculatedUnits;
                      if (!isNaN(unitsToUse) && price > 0) {
                        setSellUnits(unitsToUse.toFixed(4));
                      } else {
                        setSellUnits("");
                      }
                    } else {
                      setSellUnits("");
                    }
                  }}
                  placeholder="Enter dollar amount"
                  className="text-lg font-semibold"
                />
              </div>
            </div>

            {/* Estimated Proceeds */}
            <Card className="border border-yellow-200 bg-yellow-50">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <p className="text-sm font-semibold text-gray-900">Estimated Proceeds</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${sellDollarAmount 
                      ? parseFloat(sellDollarAmount).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                      : (sellUnits && selectedProduct?.price
                        ? (parseFloat(sellUnits) * parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""))).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                        : "0.00")}
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Units to sell:</span>
                    <span className="text-gray-900 font-medium">
                      {sellUnits || (sellDollarAmount && selectedProduct?.price
                        ? (parseFloat(sellDollarAmount) / parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""))).toFixed(4)
                        : "0.0000")}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600">
                    Before fees and taxes • Based on avg. cost {selectedProduct?.price || "$175.50"}
                  </div>
                </div>
              </CardContent>
            </Card>
              </div>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSellUnitsDialogOpen(false);
                    setSellUnits("200");
                    setSellDollarAmount("");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  disabled={!sellUnits || parseFloat(sellUnits) <= 0}
                  onClick={() => {
                    const price = selectedProduct?.price ? parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", "")) : 175.50;
                    const units = sellUnits || (sellDollarAmount
                      ? (parseFloat(sellDollarAmount) / price).toFixed(4)
                      : "0.0000");
                    const proceeds = sellDollarAmount || (sellUnits
                      ? (parseFloat(sellUnits) * price).toFixed(2)
                      : "0.00");
                    
                    const productName = selectedProduct?.product || "Apple Inc.";
                    const displayProductName = productName.includes(" - ") 
                      ? productName 
                      : productName.includes("AAPL") || productName.toLowerCase().includes("apple")
                        ? `AAPL - ${productName.split(" Series")[0]}`
                        : productName.split(" Series")[0] || productName;
                    
                    setSellOrderDetails({
                      product: displayProductName,
                      units: units,
                      price: `$${price.toFixed(2)}`,
                      totalProceeds: `$${parseFloat(proceeds).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
                    });
                    
                    setIsSellUnitsDialogOpen(false);
                    setIsSellOrderConfirmedDialogOpen(true);
                    setSellUnits("");
                    setSellDollarAmount("");
                  }}
                >
                  Place Sell Order
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-red-600">
                  <Minus className="h-5 w-5 text-red-600" />
                  Sell Units
                </DialogTitle>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSellUnitsDialogOpen(false);
                    setSellUnits("");
                    setSellDollarAmount("");
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Sell Order Confirmed Dialog */}
      <Dialog open={isSellOrderConfirmedDialogOpen} onOpenChange={setIsSellOrderConfirmedDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <DialogTitle className="text-lg font-semibold text-center">Order Confirmation</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2 text-center">
              Your sell order has been placed successfully
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Order Details */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Product</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {sellOrderDetails?.product || "AAPL - Apple Inc."}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units</p>
                        <p className="text-sm font-medium text-gray-900">{sellOrderDetails?.units || "100.0000"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Price per Unit</p>
                        <p className="text-sm font-medium text-gray-900">{sellOrderDetails?.price || "$175.50"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-900">Total Proceeds</p>
                      <p className="text-sm font-bold text-gray-900">{sellOrderDetails?.totalProceeds || "$17,550.00"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setIsSellOrderConfirmedDialogOpen(false);
                setSellOrderDetails(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch/Convert Fund Dialog */}
      <Dialog open={isSwitchDialogOpen} onOpenChange={setIsSwitchDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          {dialogContext === "plan" ? (() => {
            // Find plan by accountNumber
            const currentPlan = plansList.find(p => p.accountNumber === selectedPlan?.accountNumber);
            const planInvestments = currentPlan ? getPlanInvestments(currentPlan.id) : [];
            const existingFunds = planInvestments.map(fundId => getFundAccountById(fundId)).filter(Boolean);
            
            // Filter out the "From" fund from the "To" fund selection
            const availableToFunds = planSwitchStep === "to" && planSwitchFromFund
              ? existingFunds.filter(fund => fund.id !== planSwitchFromFund.id)
              : existingFunds;
            
            // Determine if switch or conversion based on company matching
            const fromFundCompany = planSwitchFromFund ? getProductCompany(planSwitchFromFund) : "";
            const toFundCompany = planSwitchToFund?.isExisting 
              ? getProductCompany(planSwitchToFund)
              : (planSwitchToFund && planLevelFundCompany ? planLevelFundCompany : "");
            const isConvert = fromFundCompany && toFundCompany && fromFundCompany !== toFundCompany;
            const isSwitch = fromFundCompany && toFundCompany && fromFundCompany === toFundCompany;
            
            // Get From fund product data
            const fromFundProduct = planSwitchFromFund ? {
              product: planSwitchFromFund.productName || "",
              units: planSwitchFromFund.currentPrice ? (() => {
                const price = parseFloat(planSwitchFromFund.currentPrice.replace(/[^0-9.]/g, ''));
                const marketValue = parseFloat(planSwitchFromFund.marketValue.replace(/[^0-9.]/g, ''));
                return price > 0 ? (marketValue / price).toFixed(4) : "0.0000";
              })() : "0.0000",
              price: planSwitchFromFund.currentPrice || "$0.00",
              marketValue: planSwitchFromFund.marketValue || "$0.00",
            } : null;
            
            // Get To fund name
            const toFundName = planSwitchToFund?.isExisting 
              ? planSwitchToFund.productName 
              : (planSwitchToFund?.name || "");
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className={`flex items-center gap-2 text-lg ${isConvert ? "text-orange-600" : "text-blue-600"}`}>
                    <ArrowLeftRight className={`h-5 w-5 ${isConvert ? "text-orange-600" : "text-blue-600"}`} />
                    {planSwitchStep === "details" ? (isConvert ? "Convert Fund" : "Switch Fund") : "Switch Fund"}
                  </DialogTitle>
                  <DialogDescription className="text-[11px] text-gray-600 mt-2 leading-tight">
                    {planSwitchStep === "from" 
                      ? "Select the fund to switch from (existing funds only)"
                      : planSwitchStep === "to"
                      ? `Switch from ${planSwitchFromFund?.productName || ""} to another fund. Choose an existing fund or select a new fund to add.`
                      : isConvert
                      ? `Convert from ${planSwitchFromFund?.productName || ""} (${fromFundCompany}) to ${toFundName} (${toFundCompany})`
                      : `Switch from ${planSwitchFromFund?.productName || ""} to ${toFundName}`}
                  </DialogDescription>
                </DialogHeader>
                {planSwitchStep === "from" ? (
                  <>
                    <div className="space-y-4 py-4">
                      {existingFunds.length > 0 ? (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Select Fund to Switch From
                          </Label>
                          <ScrollArea className="h-64 border border-gray-200 rounded-md p-2">
                            <div className="space-y-1">
                              {existingFunds.map((fund) => (
                                <Card
                                  key={fund.id}
                                  className={`border cursor-pointer transition-colors ${
                                    planSwitchFromFund?.id === fund.id
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                  }`}
                                  onClick={() => {
                                    setPlanSwitchFromFund(fund);
                                  }}
                                >
                                  <CardContent className="p-2">
                                    <p className="text-xs font-semibold text-gray-900">{fund.productName}</p>
                                    <p className="text-[10px] text-gray-600">Account: {fund.accountNumber || fund.id}</p>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500 text-sm">
                          No funds available in this plan
                        </div>
                      )}
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsSwitchDialogOpen(false);
                          setPlanSwitchFromFund(null);
                          setPlanSwitchToFund(null);
                          setPlanLevelFundCompany("");
                          setPlanLevelCompanySearch("");
                          setPlanLevelFundSearch("");
                          setPlanSwitchUnits("");
                          setPlanSwitchStep("from");
                        }}
                      >
                        Cancel
                      </Button>
                      {planSwitchFromFund && (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            setPlanSwitchStep("to");
                            setPlanSwitchToFund(null);
                            setPlanLevelFundCompany("");
                            setPlanLevelCompanySearch("");
                            setPlanLevelFundSearch("");
                          }}
                        >
                          Next
                        </Button>
                      )}
                    </DialogFooter>
                  </>
                ) : planSwitchStep === "to" ? (
                  <>
                    <div className="space-y-4 py-4">
                      {/* Selected From Fund Display */}
                      {planSwitchFromFund && (
                        <Card className="border border-gray-200 bg-gray-50">
                          <CardContent className="p-3">
                            <p className="text-xs font-semibold text-gray-700 mb-1">From Fund:</p>
                            <p className="text-sm font-semibold text-gray-900">{planSwitchFromFund.productName}</p>
                            <p className="text-[10px] text-gray-600">Account: {planSwitchFromFund.accountNumber || planSwitchFromFund.id}</p>
                          </CardContent>
                        </Card>
                      )}

                      {/* Select Fund Company for To Fund */}
                      <div className="relative">
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Select Fund Company
                        </Label>
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                          <Input
                            type="text"
                            value={planLevelFundCompany || planLevelCompanySearch}
                            onChange={(e) => {
                              const search = e.target.value;
                              setPlanLevelCompanySearch(search);
                              if (search !== planLevelFundCompany) {
                                setPlanLevelFundCompany("");
                                setPlanSwitchToFund(null);
                                setPlanLevelFundSearch("");
                              }
                            }}
                            onFocus={() => {
                              if (planLevelFundCompany) {
                                setPlanLevelCompanySearch(planLevelFundCompany);
                              }
                            }}
                            placeholder="Select fund company"
                            className="pl-10"
                          />
                        </div>
                        {planLevelCompanySearch && !planLevelFundCompany && (
                          <div className="absolute z-50 w-full mt-1 max-h-56 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg p-1.5">
                            <div className="space-y-0.5">
                              {FUND_COMPANIES
                                .filter((company) =>
                                  company.name.toLowerCase().includes(planLevelCompanySearch.toLowerCase())
                                )
                                .sort((a, b) => a.name.localeCompare(b.name))
                                .map((company) => {
                                  const isSameCompany = company.name === fromFundCompany;
                                  return (
                                    <Card
                                      key={company.id}
                                      className={`border cursor-pointer transition-colors ${
                                        isSameCompany 
                                          ? "border-blue-500 bg-blue-50"
                                          : "border-orange-500 bg-orange-50"
                                      }`}
                                      onClick={() => {
                                        setPlanLevelFundCompany(company.name);
                                        setPlanLevelCompanySearch("");
                                        setPlanSwitchToFund(null);
                                        setPlanLevelFundSearch("");
                                      }}
                                    >
                                      <CardContent className="p-2 flex items-center justify-between">
                                        <div>
                                          <p className="text-xs font-semibold text-gray-900">{company.name}</p>
                                          <p className="text-[10px] text-gray-600">{company.fundsCount} funds available</p>
                                        </div>
                                        {isSameCompany ? (
                                          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-normal px-1.5 py-0.5 text-[10px]">
                                            Switch
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 font-normal px-1.5 py-0.5 text-[10px]">
                                            Convert
                                          </Badge>
                                        )}
                                      </CardContent>
                                    </Card>
                                  );
                                })}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Select To Fund */}
                      {planLevelFundCompany ? (
                        <div className="relative">
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Select Fund
                          </Label>
                          <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                            <Input
                              type="text"
                              value={planSwitchToFund?.name || ""}
                              onChange={(e) => {
                                const search = e.target.value;
                                setPlanLevelFundSearch(search);
                                if (search !== planSwitchToFund?.name) {
                                  setPlanSwitchToFund(null);
                                }
                              }}
                              placeholder={`Search ${planLevelFundCompany} funds by name, symbol, or category`}
                              className={`pl-10 ${planSwitchToFund ? (isConvert ? "bg-orange-50 border-orange-300" : "bg-blue-50 border-blue-300") : ""}`}
                            />
                          </div>
                          {planLevelFundSearch && !planSwitchToFund && COMPANY_FUNDS[planLevelFundCompany] && (
                            <div className="absolute z-50 w-full mt-1 max-h-56 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg p-1.5">
                              <div className="space-y-0.5">
                                {COMPANY_FUNDS[planLevelFundCompany]
                                  .filter((fund) =>
                                    fund.name.toLowerCase().includes(planLevelFundSearch.toLowerCase()) ||
                                    fund.symbol.toLowerCase().includes(planLevelFundSearch.toLowerCase()) ||
                                    fund.category.toLowerCase().includes(planLevelFundSearch.toLowerCase())
                                  )
                                  .sort((a, b) => a.name.localeCompare(b.name))
                                  .map((fund, index) => (
                                    <Card
                                      key={index}
                                      className={`border cursor-pointer transition-colors ${
                                        planSwitchToFund?.name === fund.name
                                          ? isConvert
                                            ? "border-orange-500 bg-orange-50"
                                            : "border-blue-500 bg-blue-50"
                                          : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                      }`}
                                      onClick={() => {
                                        setPlanSwitchToFund(fund);
                                        setPlanLevelFundSearch("");
                                      }}
                                    >
                                      <CardContent className="p-2">
                                        <p className="text-xs font-semibold text-gray-900">{fund.name}</p>
                                        <p className="text-[10px] text-gray-600">{fund.symbol} • {fund.category}</p>
                                      </CardContent>
                                    </Card>
                                  ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ) : availableToFunds.length > 0 && (
                        <div>
                          <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                            Or Select Existing Fund in Plan
                          </Label>
                          <ScrollArea className="h-32 border border-gray-200 rounded-md p-2">
                            <div className="space-y-1">
                              {availableToFunds.map((fund) => {
                                const fundCompany = getProductCompany(fund);
                                const isFundConvert = fromFundCompany && fundCompany !== fromFundCompany;
                                return (
                                  <Card
                                    key={fund.id}
                                    className={`border cursor-pointer transition-colors ${
                                      planSwitchToFund?.id === fund.id
                                        ? isFundConvert
                                          ? "border-orange-500 bg-orange-50"
                                          : "border-blue-500 bg-blue-50"
                                        : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                                    }`}
                                    onClick={() => {
                                      setPlanSwitchToFund({ ...fund, isExisting: true });
                                      setPlanLevelFundCompany("");
                                      setPlanLevelCompanySearch("");
                                      setPlanLevelFundSearch("");
                                    }}
                                  >
                                    <CardContent className="p-2">
                                      <p className="text-xs font-semibold text-gray-900">{fund.productName}</p>
                                      <p className="text-[10px] text-gray-600">Account: {fund.accountNumber || fund.id}</p>
                                    </CardContent>
                                  </Card>
                                );
                              })}
                            </div>
                          </ScrollArea>
                        </div>
                      )}
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPlanSwitchStep("from");
                          setPlanSwitchToFund(null);
                          setPlanLevelFundCompany("");
                          setPlanLevelCompanySearch("");
                          setPlanLevelFundSearch("");
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsSwitchDialogOpen(false);
                          setPlanSwitchFromFund(null);
                          setPlanSwitchToFund(null);
                          setPlanLevelFundCompany("");
                          setPlanLevelCompanySearch("");
                          setPlanLevelFundSearch("");
                          setPlanSwitchUnits("");
                          setPlanSwitchStep("from");
                        }}
                      >
                        Cancel
                      </Button>
                      {planSwitchToFund && (
                        <Button
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => {
                            setPlanSwitchStep("details");
                            setPlanSwitchUnits("");
                          }}
                        >
                          Next
                        </Button>
                      )}
                    </DialogFooter>
                  </>
                ) : (
                  <>
                    <div className="space-y-4 py-4">
                      {/* Current Fund (From) */}
                      <Card className="border border-gray-200 bg-gray-50">
                        <CardContent className="p-4">
                          <p className="text-sm font-semibold text-gray-900 mb-3">Current Fund ({selectedPlan?.shortType || "RESP"}):</p>
                          <p className="text-sm font-bold text-gray-900 mb-2">
                            {fromFundProduct?.product?.split(" Series")[0] || planSwitchFromFund?.productName || ""}
                          </p>
                          <div className="space-y-1 text-sm text-gray-600">
                            <div>Company: {fromFundCompany}</div>
                            <div>Units Available: {fromFundProduct?.units || "0.0000"}</div>
                            <div>Market Value: {fromFundProduct?.marketValue || "$0.00"}</div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Units to Switch/Convert */}
                      <div>
                        <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                          Units to {isConvert ? "Convert" : "Switch"}
                        </Label>
                        <Input
                          type="number"
                          step="any"
                          value={planSwitchUnits}
                          onChange={(e) => setPlanSwitchUnits(e.target.value)}
                          placeholder={`Max: ${fromFundProduct?.units || "0.0000"}`}
                          max={parseFloat(fromFundProduct?.units || "0.0000")}
                          className="text-lg font-semibold"
                        />
                      </div>

                      {/* Switch/Convert Preview */}
                      <Card className={`border ${isConvert ? "border-orange-200 bg-orange-50" : "border-blue-200 bg-blue-50"}`}>
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={`${isConvert ? "bg-orange-200 text-orange-900" : "bg-blue-200 text-blue-900"} font-semibold px-2 py-0.5 text-xs`}>
                              {isConvert ? "CONVERSION" : "SWITCH"}
                            </Badge>
                            <span className={`text-xs font-bold ${isConvert ? "text-orange-900" : "text-blue-900"}`}>
                              ({fromFundProduct?.product?.split(" Series")[0] || planSwitchFromFund?.productName || ""}) → ({toFundName || "Select fund"})
                            </span>
                          </div>
                          <div className={`space-y-1 text-sm ${isConvert ? "text-orange-700" : "text-blue-700"}`}>
                            <div className="flex justify-between">
                              <span>Units to {isConvert ? "convert" : "switch"}:</span>
                              <span className="font-medium">{planSwitchUnits || "0"}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Estimated value:</span>
                              <span className="font-medium">
                                $
                                {planSwitchUnits && fromFundProduct?.price
                                  ? (parseFloat(planSwitchUnits) * parseFloat(fromFundProduct.price.replace("$", "").replace(" Per Unit", ""))).toFixed(2)
                                  : "0.00"}
                              </span>
                            </div>
                          </div>
                          <p className={`text-sm mt-2 ${isConvert ? "text-orange-600" : "text-blue-600"}`}>
                            This will {isConvert ? "convert" : "switch"} {fromFundProduct?.product?.split(" Series")[0] || planSwitchFromFund?.productName || ""} to {toFundName || "selected fund"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                    <DialogFooter className="gap-2">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setPlanSwitchStep("to");
                        }}
                      >
                        Back
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setIsSwitchDialogOpen(false);
                          setPlanSwitchFromFund(null);
                          setPlanSwitchToFund(null);
                          setPlanLevelFundCompany("");
                          setPlanLevelCompanySearch("");
                          setPlanLevelFundSearch("");
                          setPlanSwitchUnits("");
                          setPlanSwitchStep("from");
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        className={`${isConvert ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
                        disabled={!planSwitchUnits || parseFloat(planSwitchUnits) <= 0}
                        onClick={() => {
                          const estimatedValue = planSwitchUnits && fromFundProduct?.price
                            ? (parseFloat(planSwitchUnits) * parseFloat(fromFundProduct.price.replace("$", "").replace(" Per Unit", ""))).toFixed(2)
                            : "0.00";
                          
                          if (isConvert) {
                            setConvertOrderDetails({
                              from: fromFundProduct?.product?.split(" Series")[0] || planSwitchFromFund?.productName || "",
                              to: toFundName || "",
                              units: planSwitchUnits || "0",
                              estimatedValue: `$${estimatedValue}`,
                            });
                            setIsSwitchDialogOpen(false);
                            setIsConvertOrderConfirmedDialogOpen(true);
                          } else {
                            setSwitchOrderDetails({
                              from: fromFundProduct?.product?.split(" Series")[0] || planSwitchFromFund?.productName || "",
                              to: toFundName || "",
                              units: planSwitchUnits || "0",
                              estimatedValue: `$${estimatedValue}`,
                            });
                            setIsSwitchDialogOpen(false);
                            setIsSwitchOrderConfirmedDialogOpen(true);
                          }
                          
                          setPlanSwitchFromFund(null);
                          setPlanSwitchToFund(null);
                          setPlanLevelFundCompany("");
                          setPlanLevelCompanySearch("");
                          setPlanLevelFundSearch("");
                          setPlanSwitchUnits("");
                          setPlanSwitchStep("from");
                        }}
                      >
                        Place {isConvert ? "Conversion" : "Switch"} Order
                      </Button>
                    </DialogFooter>
                  </>
                )}
              </>
            );
          })() : selectedProduct?.product ? (() => {
            const currentProductCompany = getProductCompany(selectedProduct);
            const isSwitch = selectedFundCompany ? selectedFundCompany === currentProductCompany : true;
            const isConvert = selectedFundCompany && selectedFundCompany !== currentProductCompany;
            const titleText = isConvert ? "Convert Fund" : "Switch Fund";
            const descriptionText = isConvert 
              ? `Convert from ${selectedProduct.product.split(" Series")[0] || "FIDELITY NORTHSTAR FUND"} (${currentProductCompany}) to a ${selectedFundCompany || ""} fund.`
              : `Switch from ${selectedProduct.product.split(" Series")[0] || "FIDELITY NORTHSTAR FUND"} to another ${currentProductCompany} fund.`;
            
            return (
              <>
                <DialogHeader>
                  <DialogTitle className={`flex items-center gap-2 text-lg ${isConvert ? "text-orange-600" : "text-blue-600"}`}>
                    <ArrowLeftRight className={`h-5 w-5 ${isConvert ? "text-orange-600" : "text-blue-600"}`} />
                    {titleText}
                  </DialogTitle>
                  <DialogDescription className="text-sm text-gray-600 mt-2">
                    {descriptionText}
                  </DialogDescription>
                </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Current Fund */}
            <Card className="border border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">Current Fund ({selectedPlan?.shortType || "RESP"}):</p>
                <p className="text-sm font-bold text-gray-900 mb-2">
                  {selectedProduct?.product?.split(" Series")[0] || "FIDELITY NORTHSTAR FUND"}
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Company: {getProductCompany(selectedProduct)}</div>
                  <div>Units Available: {selectedProduct?.units?.replace(" Units", "") || "1247.32"}</div>
                  <div>Market Value: {selectedProduct?.marketValue || "$11,734.85"}</div>
                </div>
              </CardContent>
            </Card>

            {/* Select Fund Company */}
            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Select Fund Company
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  type="text"
                  value={selectedFundCompany || companySearchTerm}
                  onChange={(e) => {
                    const search = e.target.value;
                    setCompanySearchTerm(search);
                    if (search !== selectedFundCompany) {
                      setSelectedFundCompany("");
                      setSelectedFundToSwitch("");
                      setFundSearchTerm("");
                    }
                  }}
                  onFocus={() => {
                    if (selectedFundCompany) {
                      setCompanySearchTerm(selectedFundCompany);
                    }
                  }}
                  placeholder="Select fund company"
                  className="pl-10"
                />
              </div>
              {companySearchTerm && !selectedFundCompany && (
                <div className="absolute z-50 w-full mt-1 max-h-56 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg p-1.5">
                  <div className="space-y-0.5">
                    {FUND_COMPANIES
                      .filter((company) =>
                        company.name.toLowerCase().includes(companySearchTerm.toLowerCase())
                      )
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((company) => {
                        const currentProductCompany = getProductCompany(selectedProduct);
                        const isSameCompany = company.name === currentProductCompany;
                        
                        return (
                        <Card
                          key={company.id}
                          className={`border cursor-pointer transition-colors ${
                            selectedFundCompany === company.name
                              ? isSameCompany 
                                ? "border-blue-500 bg-blue-50"
                                : "border-orange-500 bg-orange-50"
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setSelectedFundCompany(company.name);
                            setCompanySearchTerm(""); // Clear search to hide dropdown
                            setSelectedFundToSwitch(""); // Reset fund selection when company changes
                            setFundSearchTerm("");
                          }}
                        >
                          <CardContent className="p-2 flex items-center justify-between">
                            <div>
                              <p className="text-xs font-semibold text-gray-900">{company.name}</p>
                              <p className="text-[10px] text-gray-600">{company.fundsCount} funds available</p>
                            </div>
                            {isSameCompany ? (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-normal px-1.5 py-0.5 text-[10px]">
                                Switch
                              </Badge>
                            ) : (
                              <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 font-normal px-1.5 py-0.5 text-[10px]">
                                Convert
                              </Badge>
                            )}
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Select Fund to Switch/Convert to */}
            {selectedFundCompany && (
            <div className="relative">
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Select Fund to {isConvert ? "Convert to" : "Switch to"}
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
                <Input
                  type="text"
                  value={selectedFundToSwitch || fundSearchTerm}
                  onChange={(e) => {
                    const search = e.target.value;
                    setFundSearchTerm(search);
                    if (search !== selectedFundToSwitch) {
                      setSelectedFundToSwitch("");
                    }
                  }}
                  onFocus={() => {
                    if (selectedFundToSwitch) {
                      setFundSearchTerm(selectedFundToSwitch);
                    }
                  }}
                  placeholder={`Search ${selectedFundCompany || "Fidelity Investments"} funds by name, symbol, or category`}
                  className={`pl-10 ${selectedFundToSwitch ? (isConvert ? "bg-orange-50 border-orange-300" : "bg-blue-50 border-blue-300") : ""}`}
                />
              </div>
              {selectedFundCompany && fundSearchTerm && !selectedFundToSwitch && COMPANY_FUNDS[selectedFundCompany] && (
                <div className="absolute z-50 w-full mt-1 max-h-56 overflow-y-auto border border-gray-200 rounded-md bg-white shadow-lg p-1.5">
                  <div className="space-y-0.5">
                    {COMPANY_FUNDS[selectedFundCompany]
                      .filter((fund) =>
                        fund.name.toLowerCase().includes(fundSearchTerm.toLowerCase()) ||
                        fund.symbol.toLowerCase().includes(fundSearchTerm.toLowerCase()) ||
                        fund.category.toLowerCase().includes(fundSearchTerm.toLowerCase())
                      )
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((fund, index) => (
                        <Card
                          key={index}
                          className={`border cursor-pointer transition-colors ${
                            selectedFundToSwitch === fund.name
                              ? isConvert
                                ? "border-orange-500 bg-orange-50"
                                : "border-blue-500 bg-blue-50"
                              : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                          }`}
                          onClick={() => {
                            setSelectedFundToSwitch(fund.name);
                            setFundSearchTerm(""); // Clear search to hide dropdown
                          }}
                        >
                          <CardContent className="p-2">
                            <p className="text-xs font-semibold text-gray-900">{fund.name}</p>
                            <p className="text-[10px] text-gray-600">{fund.symbol} • {fund.category}</p>
                          </CardContent>
                        </Card>
                      ))}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Units to Switch/Convert */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Units to {isConvert ? "Convert" : "Switch"}
              </label>
              <Input
                type="number"
                step="any"
                value={unitsToSwitch}
                onChange={(e) => setUnitsToSwitch(e.target.value)}
                placeholder={`Max: ${selectedProduct?.units || "600.00"}`}
                max={parseFloat(selectedProduct?.units || "600.00")}
              />
            </div>

            {/* Switch/Convert Preview */}
            <Card className={`border ${isConvert ? "border-orange-200 bg-orange-50" : "border-blue-200 bg-blue-50"}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge className={`${isConvert ? "bg-orange-200 text-orange-900" : "bg-blue-200 text-blue-900"} font-semibold px-2 py-0.5 text-xs`}>
                    {isConvert ? "CONVERSION" : "SWITCH"}
                  </Badge>
                  <span className={`text-sm font-bold ${isConvert ? "text-orange-900" : "text-blue-900"}`}>
                    ({selectedProduct?.product?.split(" Series")[0] || "Vanguard FTSE Canada All Cap Index ETF"}) → ({selectedFundToSwitch || selectedFundCompany || "Select fund"})
                  </span>
                </div>
                <div className={`space-y-1 text-sm ${isConvert ? "text-orange-700" : "text-blue-700"}`}>
                  <div className="flex justify-between">
                    <span>Units to {isConvert ? "convert" : "switch"}:</span>
                    <span className="font-medium">{unitsToSwitch || "0"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Estimated value:</span>
                    <span className="font-medium">
                      $
                      {unitsToSwitch && selectedProduct?.price
                        ? (parseFloat(unitsToSwitch) * parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""))).toFixed(2)
                        : "0.00"}
                    </span>
                  </div>
                </div>
                <p className={`text-sm mt-2 ${isConvert ? "text-orange-600" : "text-blue-600"}`}>
                  This will {isConvert ? "convert" : "switch"} {selectedProduct?.product?.split(" Series")[0] || "Vanguard FTSE Canada All Cap Index ETF"} to {selectedFundToSwitch || selectedFundCompany || "selected fund"}
                </p>
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsSwitchDialogOpen(false);
                setSelectedFundCompany("");
                setSelectedFundToSwitch("");
                setUnitsToSwitch("");
                setCompanySearchTerm("");
                setFundSearchTerm("");
              }}
            >
              Cancel
            </Button>
            <Button
              className={`${isConvert ? "bg-orange-600 hover:bg-orange-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
              disabled={!selectedFundCompany || !selectedFundToSwitch || !unitsToSwitch || parseFloat(unitsToSwitch) <= 0}
              onClick={() => {
                const estimatedValue = unitsToSwitch && selectedProduct?.price
                  ? (parseFloat(unitsToSwitch) * parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""))).toFixed(2)
                  : "0.00";
                
                if (isConvert) {
                  setConvertOrderDetails({
                    from: selectedProduct?.product?.split(" Series")[0] || "FIDELITY NORTHSTAR FUND",
                    to: selectedFundToSwitch || selectedFundCompany || "",
                    units: unitsToSwitch || "0",
                    estimatedValue: `$${estimatedValue}`,
                  });
                  setIsSwitchDialogOpen(false);
                  setIsConvertOrderConfirmedDialogOpen(true);
                } else {
                  setSwitchOrderDetails({
                    from: selectedProduct?.product?.split(" Series")[0] || "FIDELITY NORTHSTAR FUND",
                    to: selectedFundToSwitch || selectedFundCompany || "",
                    units: unitsToSwitch || "0",
                    estimatedValue: `$${estimatedValue}`,
                  });
                  setIsSwitchDialogOpen(false);
                  setIsSwitchOrderConfirmedDialogOpen(true);
                }
                
                setSelectedFundCompany("");
                setSelectedFundToSwitch("");
                setUnitsToSwitch("");
                setCompanySearchTerm("");
                setFundSearchTerm("");
              }}
            >
              Execute {isConvert ? "Conversion" : "Switch"}
            </Button>
          </DialogFooter>
              </>
            );
          })() : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-lg text-blue-600">
                  <ArrowLeftRight className="h-5 w-5 text-blue-600" />
                  Switch Fund
                </DialogTitle>
              </DialogHeader>
              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsSwitchDialogOpen(false);
                    setSelectedFundCompany("");
                    setSelectedFundToSwitch("");
                    setUnitsToSwitch("");
                    setCompanySearchTerm("");
                    setFundSearchTerm("");
                  }}
                >
                  Cancel
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Convert Fund Dialog */}
      <Dialog open={isConvertDialogOpen} onOpenChange={setIsConvertDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-blue-600">
              <ArrowLeftRight className="h-5 w-5 text-blue-600" />
              Convert Fund
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Convert from {selectedProduct?.product?.split(" Series")[0] || "FIDELITY NORTHSTAR FUND"} ({getProductCompany(selectedProduct)}) to a {selectedFundCompany || "CIBC Asset Management"} fund.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Current Fund */}
            <Card className="border border-gray-200 bg-gray-50">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-gray-900 mb-3">Current Fund ({selectedPlan?.shortType || "RESP"}):</p>
                <p className="text-sm font-bold text-gray-900 mb-2">
                  {selectedProduct?.product?.split(" Series")[0] || "FIDELITY NORTHSTAR FUND"}
                </p>
                <div className="space-y-1 text-sm text-gray-600">
                  <div>Company: {getProductCompany(selectedProduct)}</div>
                  <div>Units Available: {selectedProduct?.units?.replace(" Units", "") || "1247.32"}</div>
                  <div>Market Value: {selectedProduct?.marketValue || "$11,734.85"}</div>
                </div>
              </CardContent>
            </Card>

            {/* Select Fund Company */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Select Fund Company
              </label>
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100 font-normal px-2 py-0.5 text-xs">
                  Conversion
                </Badge>
                <span className="text-xs text-gray-600">
                  ({selectedProduct?.product?.split(" Series")[0] || "FIDELITY NORTHSTAR FUND"}) → ({selectedFundCompany || "CIBC Asset Management"})
                </span>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={companySearchTerm}
                  onChange={(e) => {
                    const search = e.target.value;
                    setCompanySearchTerm(search);
                  }}
                  placeholder="Search fund companies (e.g., CIBC, TD, RBC)..."
                  className="pl-10"
                />
              </div>
              <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                {FUND_COMPANIES
                  .filter((company) =>
                    !companySearchTerm || company.name.toLowerCase().includes(companySearchTerm.toLowerCase())
                  )
                  .map((company) => {
                    const currentProductCompany = getProductCompany(selectedProduct);
                    const isSameCompany = company.name === currentProductCompany;
                    
                    return (
                      <Card
                        key={company.id}
                        className={`border cursor-pointer transition-colors ${
                          selectedFundCompany === company.name
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setSelectedFundCompany(company.name);
                          setCompanySearchTerm(company.name);
                          
                          // If user selects the same company, switch back to Switch dialog
                          if (isSameCompany) {
                            const currentFundToSwitch = selectedFundToSwitch;
                            const currentUnits = unitsToSwitch;
                            setIsConvertDialogOpen(false);
                            setSelectedFundToSwitch(currentFundToSwitch);
                            setUnitsToSwitch(currentUnits);
                            setIsSwitchDialogOpen(true);
                          }
                        }}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm font-semibold text-gray-900">{company.name}</p>
                              <p className="text-xs text-gray-600">{company.fundsCount} funds available</p>
                            </div>
                            {isSameCompany && (
                              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-normal px-2 py-0.5 text-xs">
                                Switch
                              </Badge>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </div>
            </div>

            {/* Select Fund to Convert to */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Select Fund to Convert to
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={fundSearchTerm}
                  onChange={(e) => {
                    const search = e.target.value;
                    setFundSearchTerm(search);
                    if (!search) {
                      setSelectedFundToSwitch("");
                    }
                  }}
                  placeholder={`Search ${selectedFundCompany || "CIBC Asset Management"} funds by name, symbol, or category`}
                  className="pl-10"
                />
              </div>
              {selectedFundCompany && fundSearchTerm && COMPANY_FUNDS[selectedFundCompany] && (
                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                  {COMPANY_FUNDS[selectedFundCompany]
                    .filter((fund) =>
                      fund.name.toLowerCase().includes(fundSearchTerm.toLowerCase()) ||
                      fund.symbol.toLowerCase().includes(fundSearchTerm.toLowerCase()) ||
                      fund.category.toLowerCase().includes(fundSearchTerm.toLowerCase())
                    )
                    .map((fund, index) => (
                      <Card
                        key={index}
                        className={`border cursor-pointer transition-colors ${
                          selectedFundToSwitch === fund.name
                            ? "border-orange-500 bg-orange-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setSelectedFundToSwitch(fund.name);
                          setFundSearchTerm(fund.name);
                        }}
                      >
                        <CardContent className="p-3">
                          <p className="text-sm font-semibold text-gray-900">{fund.name}</p>
                          <p className="text-xs text-gray-600">{fund.symbol} • {fund.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>

            {/* Units to Convert */}
            <div>
              <label className="text-sm font-semibold text-gray-700 mb-2 block">
                Units to Convert
              </label>
              <Input
                type="number"
                value={unitsToSwitch}
                onChange={(e) => setUnitsToSwitch(e.target.value)}
                placeholder={`Max: ${selectedProduct?.units?.replace(" Units", "") || "1247.32"}`}
                max={selectedProduct?.units?.replace(" Units", "") || "1247.32"}
              />
            </div>

            {/* Conversion Preview */}
            <Card className="border border-orange-200 bg-orange-50">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-orange-900 mb-3">Conversion Preview:</p>
                <p className="text-sm font-bold text-orange-900 mb-2">
                  CONVERSION - ({selectedProduct?.product?.split(" Series")[0] || "FIDELITY NORTHSTAR FUND"}) → ({selectedFundToSwitch || selectedFundCompany || "CIBC Asset Management"})
                </p>
                <div className="space-y-1 text-sm text-orange-700">
                  <div>Units to convert: {unitsToSwitch || "0"}</div>
                  <div>
                    Estimated value: $
                    {unitsToSwitch && selectedProduct?.price
                      ? (parseFloat(unitsToSwitch) * parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""))).toFixed(2)
                      : "0.00"}
                  </div>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  This will convert {selectedProduct?.product?.split(" Series")[0] || "FIDELITY NORTHSTAR FUND"} to {selectedFundToSwitch || selectedFundCompany || "CIBC Asset Management"}
                </p>
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setIsConvertDialogOpen(false);
                setSelectedFundCompany("");
                setSelectedFundToSwitch("");
                setUnitsToSwitch("");
              }}
            >
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                const orderId = `ORD-${Date.now()}`;
                const now = new Date();
                const orderDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${now.toLocaleTimeString()}`;
                
                const estimatedValue = unitsToSwitch && selectedProduct?.price
                  ? (parseFloat(unitsToSwitch) * parseFloat(selectedProduct.price.replace("$", "").replace(" Per Unit", ""))).toFixed(2)
                  : "0.00";
                
                setConvertOrderDetails({
                  orderId,
                  from: selectedProduct?.product?.split(" Series")[0] || "FIDELITY NORTHSTAR FUND",
                  to: selectedFundToSwitch || selectedFundCompany || "CIBC Asset Management",
                  plan: selectedPlan?.shortType || "RESP",
                  units: unitsToSwitch || "0",
                  estimatedValue: `$${estimatedValue}`,
                  time: orderDate,
                });
                
                setIsConvertDialogOpen(false);
                setIsConvertOrderConfirmedDialogOpen(true);
                setSelectedFundCompany("");
                setSelectedFundToSwitch("");
                setUnitsToSwitch("");
                setCompanySearchTerm("");
                setFundSearchTerm("");
              }}
            >
              Execute Conversion
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Switch Order Confirmed Dialog */}
      <Dialog open={isSwitchOrderConfirmedDialogOpen} onOpenChange={setIsSwitchOrderConfirmedDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-blue-600" />
              </div>
            </div>
            <DialogTitle className="text-lg font-semibold text-center">Switch Confirmation</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2 text-center">
              Your switch order has been executed successfully
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Switch Order Details */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">From Fund</p>
                    <p className="text-sm font-semibold text-gray-900">{switchOrderDetails?.from || "Vanguard FTSE Canada All Cap Index ETF"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">To Fund</p>
                    <p className="text-sm font-semibold text-gray-900">{switchOrderDetails?.to || "Vanguard FTSE Canada All Cap Index ETF"}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units Switched</p>
                        <p className="text-sm font-medium text-gray-900">{switchOrderDetails?.units ? parseFloat(switchOrderDetails.units).toFixed(4) : "122.0000"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Estimated Value</p>
                        <p className="text-sm font-medium text-gray-900">{switchOrderDetails?.estimatedValue || "$5,215.50"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setIsSwitchOrderConfirmedDialogOpen(false);
                setSwitchOrderDetails(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Convert Order Confirmed Dialog */}
      <Dialog open={isConvertOrderConfirmedDialogOpen} onOpenChange={setIsConvertOrderConfirmedDialogOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <DialogTitle className="text-lg font-semibold text-center">Conversion Confirmation</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2 text-center">
              Your conversion order has been executed successfully
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Conversion Order Details */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">From Fund</p>
                    <p className="text-sm font-semibold text-gray-900">{convertOrderDetails?.from || "Vanguard Canadian Aggregate Bond Index ETF"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">To Fund</p>
                    <p className="text-sm font-semibold text-gray-900">{convertOrderDetails?.to || "Fidelity Canadian Growth Fund"}</p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Units Converted</p>
                        <p className="text-sm font-medium text-gray-900">{convertOrderDetails?.units ? parseFloat(convertOrderDetails.units).toFixed(4) : "1111.0000"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Estimated Value</p>
                        <p className="text-sm font-medium text-gray-900">{convertOrderDetails?.estimatedValue || "$30,163.65"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setIsConvertOrderConfirmedDialogOpen(false);
                setConvertOrderDetails(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Select Plan Type Dialog */}
      <Dialog open={isSelectPlanTypeOpen && planSetupStep === 0} onOpenChange={setIsSelectPlanTypeOpen}>
        <DialogContent className="sm:max-w-[350px]">
          <DialogHeader className="pb-3">
            <DialogTitle className="text-base">Select Plan Type</DialogTitle>
          </DialogHeader>
          <div className="py-2">
            <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
              Plan Type
            </Label>
            <Select value={selectedPlanType} onValueChange={setSelectedPlanType}>
              <SelectTrigger className="h-9">
                <SelectValue placeholder="Select a plan type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="OPEN">OPEN</SelectItem>
                <SelectItem value="RRSP">RRSP</SelectItem>
                <SelectItem value="RESP">RESP</SelectItem>
                <SelectItem value="TFSA">TFSA</SelectItem>
                <SelectItem value="RRIF">RRIF</SelectItem>
                <SelectItem value="LRIF">LRIF</SelectItem>
                <SelectItem value="Non-Registered">Non-Registered</SelectItem>
                <SelectItem value="LIRA">LIRA</SelectItem>
                <SelectItem value="LIF">LIF</SelectItem>
                <SelectItem value="RDSP">RDSP</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <DialogFooter className="pt-3">
            <Button variant="outline" size="sm" onClick={() => {
              setIsSelectPlanTypeOpen(false);
              setSelectedPlanType("");
            }}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                if (selectedPlanType) {
                  setIsSelectPlanTypeOpen(false);
                  setPlanSetupStep(1);
                }
              }}
              disabled={!selectedPlanType}
            >
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Plan Setup Step 1 Dialog */}
      {planSetupStep === 1 && (
        <Dialog open={true} onOpenChange={(open) => {
          if (!open) {
            setPlanSetupStep(0);
            setIsSelectPlanTypeOpen(false);
            setSelectedPlanType("");
          }
        }}>
          <DialogContent className="sm:max-w-[350px]">
            <DialogHeader className="pb-3">
              <DialogTitle className="text-base">Plan Setup - {selectedPlanType}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Owner/Annuitant Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Enter owner/annuitant name"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Beneficiary Name <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={beneficiaryName}
                  onChange={(e) => setBeneficiaryName(e.target.value)}
                  placeholder="Enter beneficiary name"
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <DialogFooter className="pt-3">
              <Button variant="outline" size="sm" onClick={() => {
                setPlanSetupStep(0);
                setIsSelectPlanTypeOpen(false);
              }}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  if (ownerName && beneficiaryName) {
                    setPlanSetupStep(2);
                  }
                }}
                disabled={!ownerName || !beneficiaryName}
              >
                Next
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Plan Setup Step 2 Dialog */}
      {planSetupStep === 2 && (
        <Dialog open={true} onOpenChange={(open) => {
          if (!open) {
            setPlanSetupStep(0);
            setIsSelectPlanTypeOpen(false);
            setSelectedPlanType("");
          }
        }}>
          <DialogContent className="sm:max-w-[350px]">
            <DialogHeader className="pb-3">
              <DialogTitle className="text-base">Plan Setup - {selectedPlanType}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Intermediary Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={intermediaryCode}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 10);
                    setIntermediaryCode(value);
                  }}
                  placeholder="Enter intermediary code (max 10 characters)"
                  maxLength={10}
                  className="h-9 text-sm"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">{intermediaryCode.length}/10 characters</p>
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Intermediary Account Code <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={intermediaryAccountCode}
                  onChange={(e) => {
                    const value = e.target.value.slice(0, 10);
                    setIntermediaryAccountCode(value);
                  }}
                  placeholder="Enter intermediary account code (max 10 characters)"
                  maxLength={10}
                  className="h-9 text-sm"
                />
                <p className="text-[10px] text-gray-500 mt-0.5">{intermediaryAccountCode.length}/10 characters</p>
              </div>
            </div>
            <DialogFooter className="pt-3">
              <Button variant="outline" size="sm" onClick={() => setPlanSetupStep(1)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                setPlanSetupStep(0);
                setIsSelectPlanTypeOpen(false);
              }}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => {
                  if (intermediaryCode && intermediaryAccountCode) {
                    setPlanSetupStep(3);
                  }
                }}
                disabled={!intermediaryCode || !intermediaryAccountCode}
              >
                Next
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Plan Setup Step 3 Dialog */}
      {planSetupStep === 3 && (
        <Dialog open={true} onOpenChange={(open) => {
          if (!open) {
            setPlanSetupStep(0);
            setIsSelectPlanTypeOpen(false);
            setSelectedPlanType("");
          }
        }}>
          <DialogContent className="sm:max-w-[350px]">
            <DialogHeader className="pb-3">
              <DialogTitle className="text-base">Plan Setup - {selectedPlanType}</DialogTitle>
            </DialogHeader>
            <div className="space-y-3 py-2">
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Notes (Optional)
                </Label>
                <Textarea
                  value={planNotes}
                  onChange={(e) => setPlanNotes(e.target.value)}
                  placeholder="Enter any additional notes..."
                  className="min-h-[80px] text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Objectives <span className="text-red-500">*</span>
                </Label>
                <Input
                  value={planObjectives}
                  onChange={(e) => setPlanObjectives(e.target.value)}
                  placeholder="Enter plan objectives"
                  className="h-9 text-sm"
                />
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Risk Tolerance <span className="text-red-500">*</span>
                </Label>
                <Select value={riskTolerance} onValueChange={setRiskTolerance}>
                  <SelectTrigger className="h-9 text-sm">
                    <SelectValue placeholder="Select risk tolerance..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Conservative">Conservative</SelectItem>
                    <SelectItem value="Moderate">Moderate</SelectItem>
                    <SelectItem value="Aggressive">Aggressive</SelectItem>
                    <SelectItem value="Speculation">Speculation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs font-semibold text-gray-700 mb-1.5 block">
                  Time Horizon (Years) <span className="text-red-500">*</span>
                </Label>
                <Input
                  type="number"
                  value={timeHorizon}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (value === "" || (parseInt(value) >= 1 && parseInt(value) <= 50)) {
                      setTimeHorizon(value);
                    }
                  }}
                  placeholder="Enter time horizon (1-50 years)"
                  min={1}
                  max={50}
                  className="h-9 text-sm"
                />
              </div>
            </div>
            <DialogFooter className="pt-3">
              <Button variant="outline" size="sm" onClick={() => setPlanSetupStep(2)}>
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                Previous
              </Button>
              <Button variant="outline" size="sm" onClick={() => {
                setPlanSetupStep(0);
                setIsSelectPlanTypeOpen(false);
              }}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => {
                  if (planObjectives && riskTolerance && timeHorizon) {
                    // Generate plan details
                    const planId = `PLN-${Date.now()}-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
                    const accountNumber = Math.floor(1000000000 + Math.random() * 9000000000).toString();
                    
                    setCreatedPlanDetails({
                      planType: selectedPlanType,
                      planId,
                      accountNumber,
                      owner: ownerName,
                      beneficiary: beneficiaryName,
                      intermediaryCode,
                      intermediaryAccountCode,
                      notes: planNotes,
                      objectives: planObjectives,
                      riskTolerance,
                      timeHorizon,
                    });
                    
                    setPlanSetupStep(0);
                    setAddProductFundCompany("");
                    setAddProductFundSearch("");
                    setAddProductSelectedFund("");
                    setAddProductAmount("");
                    setIsAddProductOpen(true);
                  }
                }}
                disabled={!planObjectives || !riskTolerance || !timeHorizon}
              >
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Add Product Dialog */}
      <Dialog open={isAddProductOpen} onOpenChange={(open) => {
        setIsAddProductOpen(open);
        if (!open) {
          setAddProductFundCompany("");
          setAddProductFundSearch("");
          setAddProductSelectedFund("");
          setAddProductAmount("");
        }
      }}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader className="pb-1">
            <DialogTitle className="text-sm font-semibold">Add Product</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 py-1">
            {/* Plan Details and Trust Account - Side by Side */}
            <div className="grid grid-cols-2 gap-2">
              {/* Plan Details */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-2">
                  <p className="text-[10px] text-gray-500 mb-0.5">Plan</p>
                  <p className="text-xs font-semibold text-gray-900 mb-1.5">
                    {createdPlanDetails?.planType || "TFSA"} - {createdPlanDetails?.planId?.slice(-8) || "12345678"}
                  </p>
                  <div className="space-y-1 text-[10px]">
                    <div><span className="text-gray-500">Account:</span> <span className="font-medium">{createdPlanDetails?.accountNumber || "1234567890"}</span></div>
                    <div><span className="text-gray-500">Owner:</span> <span className="font-medium">{createdPlanDetails?.owner || "John Smith"}</span></div>
                  </div>
                </CardContent>
              </Card>

              {/* Trust Account Balance */}
              <Card className="border border-gray-200 bg-white">
                <CardContent className="p-2">
                  <p className="text-[10px] text-gray-500 mb-0.5">Trust Account CAD</p>
                  <p className="text-sm font-bold text-gray-900 mb-1.5">$1,250.00</p>
                  <div className="space-y-0.5 text-[10px]">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Settled:</span>
                      <span className="font-medium text-green-600">$1,250.00</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Unsettled:</span>
                      <span className="font-medium text-orange-600">$0.00</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Fund Selection - Side by Side */}
            <div className="grid grid-cols-2 gap-2">
              {/* Select Fund Company */}
              <div>
                <Label className="text-[10px] font-semibold text-gray-700 mb-1 block">
                  Select Fund Company
                </Label>
                <Select value={addProductFundCompany} onValueChange={setAddProductFundCompany}>
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue placeholder="Choose company" />
                  </SelectTrigger>
                  <SelectContent>
                    {FUND_COMPANIES.map((company) => (
                      <SelectItem key={company.id} value={company.name}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Investment Amount */}
              <div>
                <Label className="text-[10px] font-semibold text-gray-700 mb-1 block">
                  Investment Amount ($)
                </Label>
                <Input
                  type="number"
                  value={addProductAmount}
                  onChange={(e) => setAddProductAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="h-8 text-xs"
                />
              </div>
            </div>

            {/* Search for Specific Fund */}
            <div>
              <Label className="text-[10px] font-semibold text-gray-700 mb-1 block">
                Search for Specific Fund
              </Label>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-3 w-3 text-gray-400" />
                <Input
                  type="text"
                  value={addProductFundSearch}
                  onChange={(e) => {
                    const search = e.target.value;
                    setAddProductFundSearch(search);
                    if (!search) {
                      setAddProductSelectedFund("");
                    }
                  }}
                  placeholder="Search funds by name, symbol, or category"
                  className="pl-8 h-8 text-xs"
                />
              </div>
              {!addProductSelectedFund && addProductFundCompany && addProductFundSearch && COMPANY_FUNDS[addProductFundCompany] && (
                <div className="mt-1 space-y-0.5 max-h-32 overflow-y-auto">
                  {COMPANY_FUNDS[addProductFundCompany]
                    .filter((fund) =>
                      fund.name.toLowerCase().includes(addProductFundSearch.toLowerCase()) ||
                      fund.symbol.toLowerCase().includes(addProductFundSearch.toLowerCase()) ||
                      fund.category.toLowerCase().includes(addProductFundSearch.toLowerCase())
                    )
                    .map((fund, index) => (
                      <Card
                        key={index}
                        className={`border cursor-pointer transition-colors ${
                          addProductSelectedFund === fund.name
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setAddProductSelectedFund(fund.name);
                          setAddProductFundSearch(fund.name);
                        }}
                      >
                        <CardContent className="p-1.5">
                          <p className="text-[10px] font-semibold text-gray-900">{fund.name}</p>
                          <p className="text-[9px] text-gray-600">{fund.symbol} • {fund.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>

            {/* Order Preview */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-2">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] text-gray-500 mb-0.5">Fund</p>
                    <p className="text-xs font-medium text-gray-900">{addProductSelectedFund || "Not selected"}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-500 mb-0.5">Amount</p>
                    <p className="text-xs font-bold text-gray-900">${addProductAmount || "0.00"}</p>
                  </div>
                </div>
                {addProductAmount && parseFloat(addProductAmount) > 1250 && (
                  <div className="flex items-center gap-1 mt-1.5 text-orange-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span className="text-[9px]">Purchase amount exceeds settled balance ($1,250.00)</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <DialogFooter className="pt-1">
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setIsAddProductOpen(false)}>
              Cancel
            </Button>
            <Button
              size="sm"
              className="bg-green-600 hover:bg-green-700 text-white h-8 text-xs"
              onClick={() => {
                if (addProductSelectedFund && addProductAmount) {
                  const selectedFund = COMPANY_FUNDS[addProductFundCompany]?.find(
                    (f) => f.name === addProductSelectedFund
                  );
                  
                  const orderId = `ORD-${Date.now()}`;
                  const now = new Date();
                  const orderDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${now.toLocaleTimeString()}`;
                  
                  setInvestmentOrderDetails({
                    orderId,
                    company: addProductFundCompany,
                    fund: addProductSelectedFund,
                    symbol: selectedFund?.symbol || "",
                    amount: `$${addProductAmount}`,
                    time: orderDate,
                    planType: createdPlanDetails?.planType,
                    planId: createdPlanDetails?.planId,
                    accountNumber: createdPlanDetails?.accountNumber,
                    owner: createdPlanDetails?.owner,
                  });
                  
                  setIsAddProductOpen(false);
                  setIsInvestmentOrderConfirmedOpen(true);
                }
              }}
              disabled={!addProductSelectedFund || !addProductAmount}
            >
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Investment Order Confirmed Dialog */}
      <Dialog open={isInvestmentOrderConfirmedOpen} onOpenChange={setIsInvestmentOrderConfirmedOpen}>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader className="text-center">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <DialogTitle className="text-lg font-semibold text-center">Order Confirmation</DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2 text-center">
              Your investment order has been placed successfully
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Order Details */}
            <Card className="border border-gray-200 bg-white">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Plan</p>
                    <p className="text-sm font-semibold text-gray-900">
                      {investmentOrderDetails?.planType || "RRSP"} - {investmentOrderDetails?.planId || "PLN-1234567890"}
                    </p>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Fund</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {investmentOrderDetails?.fund || "RBC Global Equity Fund - Series A"}
                      </p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Company</p>
                        <p className="text-sm font-medium text-gray-900">{investmentOrderDetails?.company || "RBC Global Asset Management"}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Symbol</p>
                        <p className="text-sm font-medium text-gray-900">{investmentOrderDetails?.symbol || "RBC-GLO"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between items-center">
                      <p className="text-sm font-semibold text-gray-900">Amount</p>
                      <p className="text-sm font-bold text-gray-900">{investmentOrderDetails?.amount || "$2,000.00"}</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-200 pt-3">
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Time</p>
                      <p className="text-sm font-medium text-gray-900">{investmentOrderDetails?.time || "12/14/2025, 7:48:07 PM"}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                setIsInvestmentOrderConfirmedOpen(false);
                setInvestmentOrderDetails(null);
                setAddProductFundCompany("");
                setAddProductFundSearch("");
                setAddProductSelectedFund("");
                setAddProductAmount("");
              }}
            >
              Done
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Standalone Add Product Dialog */}
      <Dialog open={isStandaloneAddProductOpen} onOpenChange={setIsStandaloneAddProductOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg text-blue-600">
              <Plus className="h-5 w-5 text-blue-600" />
              Add Product
            </DialogTitle>
            <DialogDescription className="text-sm text-gray-600 mt-2">
              Add a new investment product to your portfolio
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Trust Account CAD */}
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <p className="text-xs text-gray-600 mb-2">$ Trust Account CAD</p>
                <p className="text-2xl font-bold text-gray-900 mb-2">$1,250.00</p>
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Settled:</span>
                    <span className="text-green-600 font-medium">$1,250.00</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-600">Unsettled:</span>
                    <span className="text-orange-600 font-medium">$0.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Select Fund Company */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Select Fund Company
              </Label>
              <Select value={standaloneFundCompany} onValueChange={setStandaloneFundCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a company that offers funds" />
                </SelectTrigger>
                <SelectContent>
                  {FUND_COMPANIES.map((company) => (
                    <SelectItem key={company.id} value={company.name}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search for Specific Fund */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Search for Specific Fund
              </Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  value={standaloneFundSearch}
                  onChange={(e) => {
                    const search = e.target.value;
                    setStandaloneFundSearch(search);
                    if (!search) {
                      setStandaloneSelectedFund("");
                    }
                  }}
                  placeholder="Search funds by name, symbol, or category"
                  className="pl-10"
                />
              </div>
              {standaloneFundCompany && standaloneFundSearch && COMPANY_FUNDS[standaloneFundCompany] && (
                <div className="mt-2 space-y-1 max-h-48 overflow-y-auto">
                  {COMPANY_FUNDS[standaloneFundCompany]
                    .filter((fund) =>
                      fund.name.toLowerCase().includes(standaloneFundSearch.toLowerCase()) ||
                      fund.symbol.toLowerCase().includes(standaloneFundSearch.toLowerCase()) ||
                      fund.category.toLowerCase().includes(standaloneFundSearch.toLowerCase())
                    )
                    .map((fund, index) => (
                      <Card
                        key={index}
                        className={`border cursor-pointer transition-colors ${
                          standaloneSelectedFund === fund.name
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                        }`}
                        onClick={() => {
                          setStandaloneSelectedFund(fund.name);
                          setStandaloneFundSearch(fund.name);
                        }}
                      >
                        <CardContent className="p-3">
                          <p className="text-sm font-semibold text-gray-900">{fund.name}</p>
                          <p className="text-xs text-gray-600">{fund.symbol} • {fund.category}</p>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>

            {/* Investment Amount */}
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                Investment Amount ($)
              </Label>
              <Input
                type="number"
                value={standaloneAmount}
                onChange={(e) => setStandaloneAmount(e.target.value)}
                placeholder="Enter amount to invest"
              />
            </div>

            {/* Order Preview */}
            <Card className="border border-blue-200 bg-blue-50">
              <CardContent className="p-4">
                <p className="text-sm font-semibold text-blue-900 mb-3">Order Preview:</p>
                <div className="space-y-1 text-sm text-blue-700">
                  <div><span className="font-semibold">Fund:</span> {standaloneSelectedFund || "Not selected"}</div>
                  <div><span className="font-semibold">Amount:</span> ${standaloneAmount || "0"}</div>
                </div>
                <p className="text-sm text-blue-600 mt-2">
                  This will purchase the selected fund with the specified amount.
                </p>
                {standaloneAmount && parseFloat(standaloneAmount) > 1250 && (
                  <div className="flex items-center gap-2 mt-3 text-orange-600">
                    <AlertTriangle className="h-4 w-4" />
                    <span className="text-xs">Purchase amount exceeds settled balance ($1,250.00)</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStandaloneAddProductOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => {
                if (standaloneSelectedFund && standaloneAmount) {
                  const selectedFund = COMPANY_FUNDS[standaloneFundCompany]?.find(
                    (f) => f.name === standaloneSelectedFund
                  );
                  
                  const orderId = `ORD-${Date.now()}`;
                  const now = new Date();
                  const orderDate = `${now.getMonth() + 1}/${now.getDate()}/${now.getFullYear()}, ${now.toLocaleTimeString()}`;
                  
                  setInvestmentOrderDetails({
                    orderId,
                    company: standaloneFundCompany,
                    fund: standaloneSelectedFund,
                    symbol: selectedFund?.symbol || "",
                    amount: `$${standaloneAmount}`,
                    time: orderDate,
                  });
                  
                  setIsStandaloneAddProductOpen(false);
                  setIsInvestmentOrderConfirmedOpen(true);
                }
              }}
              disabled={!standaloneSelectedFund || !standaloneAmount}
            >
              Place Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Address Dialog */}
      <Dialog open={isEditAddressDialogOpen} onOpenChange={setIsEditAddressDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Address Information</DialogTitle>
            <DialogDescription>
              Update residential address, mailing address, and contact information.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {/* Residential Address Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Residential Address</h3>
              <div className="space-y-2">
                <Label htmlFor="res-line1" className="text-sm font-medium text-gray-700">
                  Address Line 1 <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="res-line1"
                  value={editedResidentialAddress.line1}
                  onChange={(e) =>
                    setEditedResidentialAddress({ ...editedResidentialAddress, line1: e.target.value })
                  }
                  placeholder="Enter address line 1"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="res-line2" className="text-sm font-medium text-gray-700">
                  Address Line 2
                </Label>
                <Input
                  id="res-line2"
                  value={editedResidentialAddress.line2}
                  onChange={(e) =>
                    setEditedResidentialAddress({ ...editedResidentialAddress, line2: e.target.value })
                  }
                  placeholder="Enter address line 2 (optional)"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="res-line3" className="text-sm font-medium text-gray-700">
                  City, State, ZIP <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="res-line3"
                  value={editedResidentialAddress.line3}
                  onChange={(e) =>
                    setEditedResidentialAddress({ ...editedResidentialAddress, line3: e.target.value })
                  }
                  placeholder="Enter city, state, ZIP"
                  className="w-full"
                />
              </div>
            </div>

            {/* Mailing Address Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Mailing Address</h3>
              <div className="space-y-2">
                <Label htmlFor="mail-line1" className="text-sm font-medium text-gray-700">
                  Address Line 1
                </Label>
                <Input
                  id="mail-line1"
                  value={editedMailingAddress.line1}
                  onChange={(e) =>
                    setEditedMailingAddress({ ...editedMailingAddress, line1: e.target.value })
                  }
                  placeholder="Enter mailing address line 1 (optional)"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mail-line2" className="text-sm font-medium text-gray-700">
                  Address Line 2
                </Label>
                <Input
                  id="mail-line2"
                  value={editedMailingAddress.line2}
                  onChange={(e) =>
                    setEditedMailingAddress({ ...editedMailingAddress, line2: e.target.value })
                  }
                  placeholder="Enter mailing address line 2 (optional)"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mail-line3" className="text-sm font-medium text-gray-700">
                  City, State, ZIP
                </Label>
                <Input
                  id="mail-line3"
                  value={editedMailingAddress.line3}
                  onChange={(e) =>
                    setEditedMailingAddress({ ...editedMailingAddress, line3: e.target.value })
                  }
                  placeholder="Enter city, state, ZIP (optional)"
                  className="w-full"
                />
              </div>
            </div>

            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contact-home" className="text-sm font-medium text-gray-700">
                    Home Phone
                  </Label>
                  <Input
                    id="contact-home"
                    value={editedContact.home}
                    onChange={(e) =>
                      setEditedContact({ ...editedContact, home: e.target.value })
                    }
                    placeholder="Enter home phone"
                    className="w-full"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contact-cell" className="text-sm font-medium text-gray-700">
                    Cell Phone
                  </Label>
                  <Input
                    id="contact-cell"
                    value={editedContact.cell}
                    onChange={(e) =>
                      setEditedContact({ ...editedContact, cell: e.target.value })
                    }
                    placeholder="Enter cell phone"
                    className="w-full"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email" className="text-sm font-medium text-gray-700">
                  Email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  value={editedContact.email}
                  onChange={(e) =>
                    setEditedContact({ ...editedContact, email: e.target.value })
                  }
                  placeholder="Enter email address"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAddressDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => {
                // Update the state with edited values
                setCurrentResidentialAddress({ ...editedResidentialAddress });
                setCurrentMailingAddress({ ...editedMailingAddress });
                setCurrentContact({ ...editedContact });
                setIsEditAddressDialogOpen(false);
                // In a real application, you would also save this to your backend/database here
              }}
              disabled={!editedResidentialAddress.line1 || !editedResidentialAddress.line3 || !editedContact.email}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ClientDetails;

