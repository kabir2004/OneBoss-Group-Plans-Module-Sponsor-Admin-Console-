import { PageLayout } from '@/components/layout/PageLayout';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronsLeft, ChevronsRight, CheckCircle2 as CheckCircle2Icon, User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { 
  Search, 
  Calendar as CalendarIcon, 
  HelpCircle, 
  X, 
  ChevronRight, 
  ChevronDown,
  FileText,
  CheckCircle2,
  Clock,
  AlertCircle,
  Printer,
  Save,
  RotateCcw,
  Square,
  Check,
  Pause,
  MessageSquare,
  Search as SearchIcon,
  StickyNote,
  HelpCircle as HelpCircleIcon,
  Type,
  Sparkles,
  Brain,
  Zap,
  Flag
} from 'lucide-react';

// Mock data for trade supervision
const mockClients = [
  {
    id: '3180574806',
    name: 'Beaupre, Janell',
    location: 'Huntsville, ON',
    income: '$25,000 - $49,999',
    netWorth: 480000.00,
    knowledge: 'Good',
    age: 65,
    proAccount: false,
    plan: {
      id: '3180574806',
      name: 'Individual Broker/Nominee SMI 1013588874 RRSP',
      representative: '9823-3129 Gonzalez, Elton',
      marketValue: 49585.26,
      kycOnFileDate: 'Sep 11, 2024',
      kycLastModifiedDate: 'Sep 29, 2025',
      timeHorizon: '10 to <20 years',
      lta: null,
    },
    trades: [
      {
        id: 'trade-1',
        status: 'Pending to be Sent',
        tradeDate: '2025-10-30',
        productName: 'DYN-046 DYNAMIC PRECIOUS METALS FUND',
        accountNumber: '4101341360',
        fundRisk: 'H',
        objective: '100% Sp',
        loadType: 'FEL (5.0)',
        wireOrder: '',
        productIndicator: '',
        leveragedExempt: '',
    transactionType: 'Buy Gross',
        amount: 100.00,
        currency: 'CAD',
        projectedAmount: null,
        tradeReviews: [],
        tradeNotes: [],
        selectedForReview: false,
      }
    ]
  },
  {
    id: '3705174052',
    name: 'Belisle, Amy',
    location: 'Amherstburg, ON',
    income: '$200,000 - $999,999',
    netWorth: 614000.00,
    knowledge: 'Novice',
    age: 38,
    proAccount: false,
    plan: {
      id: '3705174052',
      name: 'Individual Client Name 4614113554 RRSP',
      representative: '9823-2232 Marsh, Antoine',
      marketValue: 62131.26,
      kycOnFileDate: 'Jun 15, 2024',
      kycLastModifiedDate: 'Jun 18, 2024',
      timeHorizon: '20+ years',
      lta: null,
    },
    trades: [
      {
        id: 'trade-2',
        status: 'Responded',
        tradeDate: '2025-10-27',
        productName: 'MMF-4415 MANULIFE U.S. ALL CAP EQUITY FUND',
        accountNumber: '3720204203',
        fundRisk: 'MH',
        objective: '100% Gr',
        loadType: 'DSC (5.0)',
        wireOrder: 'A13NF9E',
        productIndicator: '',
        leveragedExempt: '',
    transactionType: 'Buy Gross',
        amount: 20000.00,
        currency: 'CAD',
        projectedAmount: null,
        tradeReviews: [],
        tradeNotes: [],
        selectedForReview: false,
      },
      {
        id: 'trade-3',
        status: 'Responded',
        tradeDate: '2025-10-27',
        productName: 'MMF-4515 MANULIFE U.S. ALL CAP EQUITY FUND',
        accountNumber: '8252677686',
        fundRisk: 'MH',
        objective: '100% Gr',
        loadType: 'FEL (5.0)',
        wireOrder: 'A13NF9F',
        productIndicator: '',
        leveragedExempt: '',
    transactionType: 'Buy Gross',
        amount: 1000.00,
        currency: 'CAD',
        projectedAmount: null,
        tradeReviews: [],
        tradeNotes: [],
        selectedForReview: false,
      }
    ]
  },
  {
    id: '4829105371',
    name: 'Thompson, Robert',
    location: 'Toronto, ON',
    income: '$100,000 - $199,999',
    netWorth: 850000.00,
    knowledge: 'Expert',
    age: 52,
    proAccount: true,
    plan: {
      id: '4829105371',
      name: 'Individual Broker/Nominee SMI 2045678912 TFSA',
      representative: '9823-3129 Gonzalez, Elton',
      marketValue: 125000.50,
      kycOnFileDate: 'Jan 15, 2024',
      kycLastModifiedDate: 'Oct 15, 2025',
      timeHorizon: '10 to <20 years',
      lta: null,
    },
    trades: [
      {
        id: 'trade-4',
        status: 'Pending to be Sent',
        tradeDate: '2025-10-31',
        productName: 'BMO CANADIAN EQUITY FUND',
        accountNumber: '4829105371',
        fundRisk: 'M',
        objective: '100% Gr',
        loadType: 'FEL (5.0)',
        wireOrder: '',
        productIndicator: '',
        leveragedExempt: '',
        transactionType: 'Buy Gross',
        amount: 50000.00,
        currency: 'CAD',
        projectedAmount: null,
        tradeReviews: [],
        tradeNotes: [],
        selectedForReview: false,
      },
      {
        id: 'trade-5',
        status: 'Pending to be Sent',
        tradeDate: '2025-11-01',
        productName: 'RBC CANADIAN BOND FUND',
        accountNumber: '4829105371',
        fundRisk: 'L',
        objective: '100% In',
        loadType: 'DSC (5.0)',
        wireOrder: '',
        productIndicator: '',
        leveragedExempt: '',
        transactionType: 'Buy Gross',
        amount: 25000.00,
        currency: 'CAD',
        projectedAmount: null,
        tradeReviews: [],
        tradeNotes: [],
        selectedForReview: false,
      }
    ]
  },
  {
    id: '3918274560',
    name: 'Martinez, Sarah',
    location: 'Vancouver, BC',
    income: '$50,000 - $99,999',
    netWorth: 320000.00,
    knowledge: 'Fair',
    age: 45,
    proAccount: false,
    plan: {
      id: '3918274560',
      name: 'Individual Client Name 3918274560 RRSP',
      representative: '9823-2232 Marsh, Antoine',
      marketValue: 45230.75,
      kycOnFileDate: 'Mar 22, 2024',
      kycLastModifiedDate: 'Aug 10, 2025',
      timeHorizon: '5 to <10 years',
      lta: null,
    },
    trades: [
      {
        id: 'trade-6',
        status: 'Responded',
        tradeDate: '2025-10-28',
        productName: 'TD CANADIAN EQUITY FUND',
        accountNumber: '3918274560',
        fundRisk: 'MH',
        objective: '100% Gr',
        loadType: 'FEL (5.0)',
        wireOrder: 'B24GH7K',
        productIndicator: '',
        leveragedExempt: '',
        transactionType: 'Buy Gross',
        amount: 15000.00,
        currency: 'CAD',
        projectedAmount: null,
        tradeReviews: [],
        tradeNotes: [],
        selectedForReview: false,
      },
      {
        id: 'trade-7',
        status: 'Responded',
        tradeDate: '2025-10-29',
        productName: 'SCOTIA CANADIAN BALANCED FUND',
        accountNumber: '3918274560',
        fundRisk: 'M',
        objective: '50% Gr / 50% In',
        loadType: 'DSC (5.0)',
        wireOrder: 'B24GH8L',
        productIndicator: '',
        leveragedExempt: '',
        transactionType: 'Buy Gross',
        amount: 8000.00,
        currency: 'CAD',
        projectedAmount: null,
        tradeReviews: [],
        tradeNotes: [],
        selectedForReview: false,
      }
    ]
  },
  {
    id: '5678901234',
    name: 'Chen, David',
    location: 'Calgary, AB',
    income: '$150,000 - $199,999',
    netWorth: 720000.00,
    knowledge: 'Good',
    age: 58,
    proAccount: false,
    plan: {
      id: '5678901234',
      name: 'Individual Broker/Nominee SMI 5678901234 RRSP',
      representative: '9823-3129 Gonzalez, Elton',
      marketValue: 89000.25,
      kycOnFileDate: 'Feb 10, 2024',
      kycLastModifiedDate: 'Sep 5, 2025',
      timeHorizon: '10 to <20 years',
      lta: null,
    },
    trades: [
      {
        id: 'trade-8',
        status: 'Pending to be Sent',
        tradeDate: '2025-11-02',
        productName: 'FIDELITY CANADIAN GROWTH FUND',
        accountNumber: '5678901234',
        fundRisk: 'MH',
        objective: '100% Gr',
        loadType: 'FEL (5.0)',
        wireOrder: '',
        productIndicator: '',
        leveragedExempt: '',
        transactionType: 'Buy Gross',
        amount: 35000.00,
        currency: 'CAD',
        projectedAmount: null,
        tradeReviews: [],
        tradeNotes: [],
        selectedForReview: false,
      },
      {
        id: 'trade-9',
        status: 'Pending to be Sent',
        tradeDate: '2025-11-02',
        productName: 'CIBC CANADIAN DIVIDEND FUND',
        accountNumber: '5678901234',
        fundRisk: 'LM',
        objective: '100% In',
        loadType: 'DSC (5.0)',
        wireOrder: '',
        productIndicator: '',
        leveragedExempt: '',
        transactionType: 'Buy Gross',
        amount: 12000.00,
        currency: 'CAD',
        projectedAmount: null,
        tradeReviews: [],
        tradeNotes: [],
        selectedForReview: false,
      },
      {
        id: 'trade-10',
        status: 'Responded',
        tradeDate: '2025-10-26',
        productName: 'MACKENZIE CANADIAN EQUITY FUND',
        accountNumber: '5678901234',
        fundRisk: 'M',
        objective: '100% Gr',
        loadType: 'FEL (5.0)',
        wireOrder: 'C35IJ9M',
        productIndicator: '',
        leveragedExempt: '',
        transactionType: 'Buy Gross',
        amount: 18000.00,
        currency: 'CAD',
        projectedAmount: null,
        tradeReviews: [],
        tradeNotes: [],
        selectedForReview: false,
      }
    ]
  }
];

// Mock data for attachments
const mockPinnedDocuments = [
  {
    id: '1',
    pinnedTo: '5683160337 (TFSA Broker/Nominee, Individual (Fee for Service))',
    documentType: 'Fee For Service Agreement',
    dateOnFile: '10/21/2020',
  },
  {
    id: '2',
    pinnedTo: '2460087336 (OPEN Broker/Nominee, Individual (Fee for Service))',
    documentType: 'Fee For Service Agreement',
    dateOnFile: '10/21/2020',
  },
];

const mockAttachments = [
  { id: '1', dateSubmitted: '09/29/2025', documentType: 'KYC', description: 'attachment', status: 'approved' },
  { id: '2', dateSubmitted: '09/26/2025', documentType: 'Client Request (Trades)', description: 'attachment', status: 'approved' },
  { id: '3', dateSubmitted: '03/05/2025', documentType: 'Fee For Service Receipt', description: 'attachment', status: 'approved' },
  { id: '4', dateSubmitted: '01/15/2025', documentType: 'Miscellaneous', description: 'attachment', status: 'approved' },
  { id: '5', dateSubmitted: '12/09/2024', documentType: 'Tax Receipt', description: 'attachment', status: 'approved' },
  { id: '6', dateSubmitted: '09/11/2024', documentType: 'KYC', description: 'attachment', status: 'approved', hasPersonIcon: true },
  { id: '7', dateSubmitted: '06/17/2024', documentType: 'Client Request (Trades)', description: 'attachment', status: 'approved' },
  { id: '8', dateSubmitted: '06/03/2024', documentType: 'Miscellaneous', description: 'attachment', status: 'approved' },
  { id: '9', dateSubmitted: '05/09/2024', documentType: 'KYC', description: 'attachment', status: 'approved' },
];

const mockDealerPinnedDocuments = [
  {
    id: 'd1',
    pinnedTo: '9823 (Dealer Main Office)',
    documentType: 'Dealer Agreement',
    dateOnFile: '01/15/2023',
  },
  {
    id: 'd2',
    pinnedTo: '9823 (Dealer Main Office)',
    documentType: 'Compliance Certificate',
    dateOnFile: '03/22/2024',
  },
];

const mockDealerAttachments = [
  { id: 'd1', dateScanned: '09/29/2025', documentType: 'KYC', description: 'attachment', status: 'approved' },
  { id: 'd2', dateScanned: '09/26/2025', documentType: 'Client Request (Trades)', description: 'attachment', status: 'approved' },
  { id: 'd3', dateScanned: '03/05/2025', documentType: 'Dealer Compliance Report', description: 'attachment', status: 'approved' },
  { id: 'd4', dateScanned: '01/15/2025', documentType: 'Audit Report', description: 'attachment', status: 'approved' },
];

// Mock data for Trust Transactions
const mockTrustTransactions = [
  { id: 'tt1', date: '10/30/2025', status: 'Not settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -100.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt2', date: '10/29/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 100.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt3', date: '10/28/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 20.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt4', date: '10/27/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -141.25, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt5', date: '10/26/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -141.25, salesTax: 16.25, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt6', date: '10/25/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt7', date: '10/24/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -25245.37, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt8', date: '10/23/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 25245.37, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt9', date: '10/22/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -125.00, salesTax: 14.30, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt10', date: '10/21/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt11', date: '09/15/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 5000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt12', date: '09/14/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -5000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt13', date: '08/20/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -10000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt14', date: '08/19/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 10000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt15', date: '07/10/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -100.00, salesTax: 11.50, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt16', date: '06/15/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt17', date: '05/20/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 15000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt18', date: '05/19/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -15000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt19', date: '04/12/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -5000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt20', date: '04/11/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 5000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt21', date: '03/08/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -75.00, salesTax: 8.63, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt22', date: '02/14/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt23', date: '01/20/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 8000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt24', date: '01/19/2025', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -8000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt25', date: '12/15/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -3000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt26', date: '12/14/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 3000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt27', date: '11/10/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -50.00, salesTax: 5.75, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt28', date: '10/05/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt29', date: '09/12/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 12000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt30', date: '09/11/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -12000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt31', date: '08/08/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -7500.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt32', date: '08/07/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 7500.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt33', date: '07/15/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -90.00, salesTax: 10.35, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt34', date: '06/20/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt35', date: '05/25/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 6000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt36', date: '05/24/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -6000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt37', date: '04/18/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -4000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt38', date: '04/17/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 4000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt39', date: '03/22/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -60.00, salesTax: 6.90, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt40', date: '02/28/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt41', date: '01/15/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 9000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt42', date: '01/14/2024', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -9000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt43', date: '12/10/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -2000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt44', date: '12/09/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 2000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt45', date: '11/05/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -40.00, salesTax: 4.60, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt46', date: '10/12/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt47', date: '09/18/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 11000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt48', date: '09/17/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -11000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt49', date: '08/14/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -1500.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt50', date: '08/13/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 1500.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt51', date: '07/20/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -30.00, salesTax: 3.45, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt52', date: '06/25/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt53', date: '05/30/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 7000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt54', date: '05/29/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -7000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt55', date: '04/22/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -1800.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt56', date: '04/21/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 1800.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt57', date: '03/28/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -25.00, salesTax: 2.88, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt58', date: '02/15/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt59', date: '01/20/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 13000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt60', date: '01/19/2023', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -13000.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt61', date: '12/18/2022', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -2200.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt62', date: '12/17/2022', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 2200.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt63', date: '11/22/2022', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -35.00, salesTax: 4.03, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt64', date: '10/28/2022', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
  { id: 'tt65', date: '09/30/2022', status: 'Settled', trustAccount: 'BMRSP', type: 'Sell Of Shares', amount: 9500.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt66', date: '09/29/2022', status: 'Settled', trustAccount: 'BMRSP', type: 'Paid To Client', amount: -9500.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt67', date: '08/25/2022', status: 'Settled', trustAccount: 'BMRSP', type: 'Buy Shares', amount: -1600.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt68', date: '08/24/2022', status: 'Settled', trustAccount: 'BMRSP', type: 'Deposit', amount: 1600.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt69', date: '07/30/2022', status: 'Settled', trustAccount: 'BMRSP', type: 'Trustee Fee', amount: -20.00, salesTax: 2.30, platformFee: 0.00, paymentMethod: 'EFT' },
  { id: 'tt70', date: '06/09/2022', status: 'Settled', trustAccount: 'BMRSP', type: 'Commission Payout', amount: 0.00, salesTax: 0.00, platformFee: 0.00, paymentMethod: 'Unknown' },
];

// Helper function to parse date string (MM/DD/YYYY) to Date object
const parseDateString = (dateString: string): Date | undefined => {
  if (!dateString) return undefined;
  const parts = dateString.split('/');
  if (parts.length === 3) {
    const month = parseInt(parts[0], 10) - 1; // Month is 0-indexed
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }
  return undefined;
};

// Helper function to format Date object to string (MM/DD/YYYY)
const formatDateString = (date: Date | undefined): string => {
  if (!date) return '';
  return format(date, 'MM/dd/yyyy');
};

// AI Analysis Types
type AIRecommendation = 'approve' | 'review' | 'flag' | 'pending';
type AIRiskLevel = 'low' | 'medium' | 'high';

interface AIAnalysisResult {
  recommendation: AIRecommendation;
  riskLevel: AIRiskLevel;
  confidence: number;
  reasons: string[];
  autoApproved?: boolean;
  flaggedForReview?: boolean;
  analyzedAt?: string;
}

// AI Analysis Function - Simulates AI evaluation of trades
const analyzeTradeWithAI = (trade: any, client: any): AIAnalysisResult => {
  const reasons: string[] = [];
  let riskScore = 0;
  
  // Risk assessment based on various factors
  // High risk fund with conservative client
  if (trade.fundRisk === 'H' && client.knowledge === 'Novice') {
    riskScore += 30;
    reasons.push('High-risk fund for novice investor');
  }
  
  // Large transaction amount
  if (trade.amount > 50000) {
    riskScore += 20;
    reasons.push('Large transaction amount');
  }
  
  // Age and risk mismatch
  if (client.age > 60 && trade.fundRisk === 'H') {
    riskScore += 25;
    reasons.push('High-risk investment for age group');
  }
  
  // Leveraged or exempt trades
  if (trade.leveragedExempt && trade.leveragedExempt.toLowerCase().includes('leveraged')) {
    riskScore += 35;
    reasons.push('Leveraged product requires review');
  }
  
  // KYC date check
  if (client.plan?.kycLastModifiedDate) {
    const kycDate = new Date(client.plan.kycLastModifiedDate);
    const daysSinceKYC = (new Date().getTime() - kycDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceKYC > 365) {
      riskScore += 15;
      reasons.push('KYC information may be outdated');
    }
  }
  
  // Determine risk level
  let riskLevel: AIRiskLevel = 'low';
  if (riskScore >= 50) {
    riskLevel = 'high';
  } else if (riskScore >= 25) {
    riskLevel = 'medium';
  }
  
  // Generate recommendation
  let recommendation: AIRecommendation = 'approve';
  if (riskScore >= 50) {
    recommendation = 'flag';
  } else if (riskScore >= 25) {
    recommendation = 'review';
  } else if (riskScore < 10) {
    recommendation = 'approve';
  } else {
    recommendation = 'pending';
  }
  
  // Calculate confidence (inverse of risk, with some variance)
  const confidence = Math.max(60, 100 - riskScore);
  
  return {
    recommendation,
    riskLevel,
    confidence: Math.round(confidence),
    reasons: reasons.length > 0 ? reasons : ['No significant risk factors identified'],
    analyzedAt: new Date().toISOString()
  };
};

export default function TradeCompliance() {
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  
  const [searchFilters, setSearchFilters] = useState({
    startDate: '',
    endDate: '',
    representative: '',
    includeInactiveReps: false,
    manager: '',
    searchFilter: '',
    hideDeletedCancelled: true,
    securityType: 'all',
    showProcessingReviews: true,
    dealers: '',
    clientId: '',
    valueFilter: 'none',
    invertValueFilter: false,
    reportMode: '',
    showOldestFirst: false,
    organizeBy: 'client',
  });

  const [clients, setClients] = useState(mockClients);
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
  const [selectedTrades, setSelectedTrades] = useState<string[]>([]);
  const [managerApproval, setManagerApproval] = useState({
    category: 'Compliance',
    comment: '',
    sendNotification: false,
    approvalStatus: 'none',
  });
  const [kycGraphsOpen, setKycGraphsOpen] = useState(false);
  const [kycGraphsType, setKycGraphsType] = useState<'current' | 'projected'>('current');
  const [kycGraphsViewMode, setKycGraphsViewMode] = useState<'detailed' | 'simplified'>('detailed');
  const [hasSearched, setHasSearched] = useState(false);
  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [attachmentsTab, setAttachmentsTab] = useState<'rep' | 'dealer'>('rep');
  const [includeInactive, setIncludeInactive] = useState(false);
  const [pinnedPage, setPinnedPage] = useState(1);
  const [attachmentsPage, setAttachmentsPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(25);
  const [planReviewsOpen, setPlanReviewsOpen] = useState(false);
  const [planReviewStatus, setPlanReviewStatus] = useState('none');
  const [planReviewNote, setPlanReviewNote] = useState('');
  const [sendNotification, setSendNotification] = useState(false);

  // AI-related state
  const [aiAnalysisResults, setAiAnalysisResults] = useState<Record<string, AIAnalysisResult>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAutoApproveEnabled, setAiAutoApproveEnabled] = useState(false);
  const [aiAutoFlagEnabled, setAiAutoFlagEnabled] = useState(true);
  const [aiAnalysisOpen, setAiAnalysisOpen] = useState(false);
  const [trustTransactionsOpen, setTrustTransactionsOpen] = useState(false);
  const [planDetailsOpen, setPlanDetailsOpen] = useState(false);

  const selectedClient = clients.find(c => c.id === selectedClientId);

  const handleSearch = () => {
    // Handle search logic
    console.log('Searching with filters:', searchFilters);
    setHasSearched(true);
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setHasSearched(false);
    setSelectedClientId(null);
    setSelectedTrades([]);
    setSearchFilters({
      startDate: '',
      endDate: '',
      representative: '',
      includeInactiveReps: false,
      manager: '',
      searchFilter: '',
      hideDeletedCancelled: true,
      securityType: 'all',
      showProcessingReviews: true,
      dealers: '',
      clientId: '',
      valueFilter: 'none',
      invertValueFilter: false,
      reportMode: '',
      showOldestFirst: false,
      organizeBy: 'client',
    });
  };

  const toggleTradeSelection = (tradeId: string) => {
    setSelectedTrades(prev => 
      prev.includes(tradeId) 
        ? prev.filter(id => id !== tradeId)
        : [...prev, tradeId]
    );
  };

  const handleClientSelection = (clientId: string) => {
    setSelectedClientId(clientId);
    // Clear selected trades when switching clients
    setSelectedTrades([]);
  };

  const handleSubmitManagerApproval = () => {
    if (selectedTrades.length === 0) {
      return;
    }

    // Update each selected trade with the note
    setClients(prevClients => 
      prevClients.map(client => ({
        ...client,
        trades: client.trades.map(trade => {
          if (selectedTrades.includes(trade.id)) {
            const noteText = managerApproval.comment.trim();
            if (noteText) {
              const timestamp = new Date().toLocaleString();
              const noteWithMetadata = `[${managerApproval.category}] ${noteText} (${timestamp})`;
              return {
                ...trade,
                tradeNotes: [...trade.tradeNotes, noteWithMetadata],
                tradeReviews: managerApproval.approvalStatus !== 'none' 
                  ? [...trade.tradeReviews, `${managerApproval.approvalStatus}: ${noteText}`]
                  : trade.tradeReviews
              };
            }
          }
          return trade;
        })
      }))
    );

    // Reset manager approval form
    setManagerApproval({
      category: 'Compliance',
      comment: '',
      sendNotification: false,
      approvalStatus: 'none',
    });
  };

  // Get selected trades details for display
  const getSelectedTradesDetails = () => {
    if (!selectedClient || selectedTrades.length === 0) return [];
    return selectedClient.trades.filter(trade => selectedTrades.includes(trade.id));
  };

  // AI Analysis Functions
  const handleAutoApprove = (tradeId: string, analysis: AIAnalysisResult) => {
    setClients(prevClients =>
      prevClients.map(client => ({
        ...client,
        trades: client.trades.map(trade => {
          if (trade.id === tradeId) {
            const timestamp = new Date().toLocaleString();
            return {
              ...trade,
              status: 'Responded',
              tradeNotes: [
                ...trade.tradeNotes,
                `[AI Auto-Approved] Approved automatically by AI (${analysis.confidence}% confidence) - ${timestamp}`
              ],
              tradeReviews: [
                ...trade.tradeReviews,
                `AI Auto-Approval: ${analysis.reasons.join('; ')}`
              ]
            };
          }
          return trade;
        })
      }))
    );
    
    setAiAnalysisResults(prev => ({
      ...prev,
      [tradeId]: { ...analysis, autoApproved: true }
    }));
  };

  const handleAutoFlag = (tradeId: string, analysis: AIAnalysisResult) => {
    setClients(prevClients =>
      prevClients.map(client => ({
        ...client,
        trades: client.trades.map(trade => {
          if (trade.id === tradeId) {
            const timestamp = new Date().toLocaleString();
            return {
              ...trade,
              selectedForReview: true,
              status: 'Pending to be Sent',
              tradeNotes: [
                ...trade.tradeNotes,
                `[AI Flagged] Flagged for review by AI (${analysis.confidence}% confidence) - ${timestamp}`
              ],
              tradeReviews: [
                ...trade.tradeReviews,
                `AI Flag: ${analysis.reasons.join('; ')}`
              ]
            };
          }
          return trade;
        })
      }))
    );
    
    setAiAnalysisResults(prev => ({
      ...prev,
      [tradeId]: { ...analysis, flaggedForReview: true }
    }));
  };

  const runAIAnalysis = async (tradeIds?: string[]) => {
    setIsAnalyzing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const results: Record<string, AIAnalysisResult> = {};
    const tradesToAnalyze = tradeIds 
      ? selectedClient?.trades.filter(t => tradeIds.includes(t.id)) || []
      : selectedClient?.trades || [];
    
    tradesToAnalyze.forEach(trade => {
      if (selectedClient) {
        const analysis = analyzeTradeWithAI(trade, selectedClient);
        results[trade.id] = analysis;
        
        // Auto-approve if enabled and recommendation is approve
        if (aiAutoApproveEnabled && analysis.recommendation === 'approve' && analysis.confidence >= 85) {
          handleAutoApprove(trade.id, analysis);
        }
        
        // Auto-flag if enabled and recommendation is flag
        if (aiAutoFlagEnabled && analysis.recommendation === 'flag') {
          handleAutoFlag(trade.id, analysis);
        }
      }
    });
    
    setAiAnalysisResults(prev => ({ ...prev, ...results }));
    setIsAnalyzing(false);
  };

  const handleBulkAIAnalysis = async () => {
    if (!selectedClient) return;
    await runAIAnalysis();
  };

  const handleSelectedTradesAIAnalysis = async () => {
    if (selectedTrades.length === 0) return;
    await runAIAnalysis(selectedTrades);
  };

  const getAIRecommendationBadge = (tradeId: string) => {
    const analysis = aiAnalysisResults[tradeId];
    if (!analysis) return null;
    
    const badgeColors = {
      approve: 'bg-green-100 text-green-800 border-green-300',
      review: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      flag: 'bg-red-100 text-red-800 border-red-300',
      pending: 'bg-gray-100 text-gray-800 border-gray-300'
    };
    
    const icons = {
      approve: CheckCircle2,
      review: AlertCircle,
      flag: Flag,
      pending: Clock
    };
    
    const Icon = icons[analysis.recommendation];
    
    return (
      <Badge 
        variant="outline" 
        className={`${badgeColors[analysis.recommendation]} text-xs flex items-center gap-1`}
      >
        <Icon className="h-3 w-3" />
        {analysis.recommendation.toUpperCase()}
      </Badge>
    );
  };

  const totalTrades = clients.reduce((sum, client) => sum + client.trades.length, 0);

  // Mock data for KYC Graphs
  const getKycGraphsData = (type: 'current' | 'projected') => {
    if (type === 'current') {
      return {
        riskData: [
          { category: 'L', actual: 52, projected: 52, kyc: 0 },
          { category: 'LM', actual: 6, projected: 6, kyc: 0 },
          { category: 'M', actual: 19, projected: 19, kyc: 0 },
          { category: 'MH', actual: 15, projected: 15, kyc: 0 },
          { category: 'H', actual: 8, projected: 8, kyc: 0 },
        ],
        objectiveData: [
          { objective: 'Safety', actual: 52, projected: 52, kyc: 0 },
          { objective: 'Income', actual: 3, projected: 3, kyc: 0 },
          { objective: 'Growth', actual: 35, projected: 35, kyc: 0 },
          { objective: 'Speculation', actual: 10, projected: 10, kyc: 0 },
        ],
        riskScore: { current: 149.33, projected: 149.33 },
        cashAccount: 9.00,
        riskDistribution: [
          { category: 'L', actual: 52, projected: 52, kyc: 0, value: 0 },
          { category: 'LM', actual: 6, projected: 6, kyc: 0, value: 0 },
          { category: 'M', actual: 19, projected: 19, kyc: 0, value: 0 },
          { category: 'MH', actual: 15, projected: 15, kyc: 0, value: 0 },
        ],
      };
    } else {
      return {
        riskData: [
          { category: 'L', actual: 55, projected: 55, kyc: 0 },
          { category: 'LM', actual: 22, projected: 22, kyc: 50 },
          { category: 'M', actual: 13, projected: 13, kyc: 25 },
          { category: 'MH', actual: 9, projected: 9, kyc: 25 },
          { category: 'H', actual: 0, projected: 0, kyc: 25 },
        ],
        objectiveData: [
          { objective: 'Safety', actual: 55, projected: 55, kyc: 0 },
          { objective: 'Income', actual: 2, projected: 2, kyc: 0 },
          { objective: 'Growth', actual: 24, projected: 24, kyc: 80 },
          { objective: 'Speculation', actual: 19, projected: 20, kyc: 20 },
        ],
        riskScore: { current: 154.26, projected: 154.26 },
        cashAccount: 9.00,
        riskDistribution: [
          { category: 'L', actual: 52, projected: 52, kyc: 0, value: 0 },
          { category: 'LM', actual: 6, projected: 6, kyc: 50, value: 420.25 },
          { category: 'M', actual: 19, projected: 19, kyc: 25, value: 0 },
          { category: 'MH', actual: 15, projected: 15, kyc: 25, value: 0 },
        ],
      };
    }
  };

  const handleOpenKycGraphs = (type: 'current' | 'projected', viewMode: 'detailed' | 'simplified' = 'detailed') => {
    setKycGraphsType(type);
    setKycGraphsViewMode(viewMode);
    setKycGraphsOpen(true);
  };

  const kycData = getKycGraphsData(kycGraphsType);
  const planInfo = selectedClient ? `Plan ${selectedClient.plan.id}` : '';
  const clientName = selectedClient ? selectedClient.name : '';

  return (
    <PageLayout title="">
      <div className="space-y-6">
        {/* Search and Filter Section */}
          <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold">Trade Supervision Search</CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
              </div>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save As Default
              </Button>
              </div>
            </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Start Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                      id="start-date" 
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate ? formatDateString(startDate) : <span className="text-muted-foreground">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => {
                          setStartDate(date);
                          if (date) {
                            setSearchFilters({...searchFilters, startDate: formatDateString(date)});
                            // If selected start date is after end date, update end date
                            if (endDate && date && date > endDate) {
                              setEndDate(date);
                              setSearchFilters({...searchFilters, startDate: formatDateString(date), endDate: formatDateString(date)});
                            }
                          }
                        }}
                        disabled={(date) => endDate ? date > endDate : false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Representative</Label>
                  <Select value={searchFilters.representative || undefined} onValueChange={(value) => setSearchFilters({...searchFilters, representative: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select representative" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="9823-3129">9823-3129 Gonzalez, Elton</SelectItem>
                      <SelectItem value="9823-2232">9823-2232 Marsh, Antoine</SelectItem>
                    </SelectContent>
                  </Select>
        </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="include-inactive"
                    checked={searchFilters.includeInactiveReps}
                    onCheckedChange={(checked) => setSearchFilters({...searchFilters, includeInactiveReps: checked as boolean})}
                  />
                  <Label htmlFor="include-inactive" className="text-sm font-normal cursor-pointer">
                    Include In active Representatives
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Manager</Label>
                  <Select value={searchFilters.manager || undefined} onValueChange={(value) => setSearchFilters({...searchFilters, manager: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select manager" />
                  </SelectTrigger>
                  <SelectContent>
                      <SelectItem value="27 - Krueger, Johanne">27 - Krueger, Johanne</SelectItem>
                  </SelectContent>
                </Select>
              </div>

                <div className="space-y-2">
                  <Label>Search Filter</Label>
                  <Select value={searchFilters.searchFilter || undefined} onValueChange={(value) => setSearchFilters({...searchFilters, searchFilter: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Manager Unreviewed">Manager Unreviewed</SelectItem>
                      <SelectItem value="All Trades">All Trades</SelectItem>
                    </SelectContent>
                  </Select>
            </div>

                <div className="flex items-center space-x-2">
                      <Checkbox
                    id="hide-deleted"
                    checked={searchFilters.hideDeletedCancelled}
                    onCheckedChange={(checked) => setSearchFilters({...searchFilters, hideDeletedCancelled: checked as boolean})}
                  />
                  <Label htmlFor="hide-deleted" className="text-sm font-normal cursor-pointer">
                    Hide Deleted/Cancelled Trades
                  </Label>
                </div>

                <div className="space-y-2">
                  <Label>Security Type</Label>
                  <Select value={searchFilters.securityType} onValueChange={(value) => setSearchFilters({...searchFilters, securityType: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                        <Checkbox
                    id="show-processing"
                    checked={searchFilters.showProcessingReviews}
                    onCheckedChange={(checked) => setSearchFilters({...searchFilters, showProcessingReviews: checked as boolean})}
                  />
                  <Label htmlFor="show-processing" className="text-sm font-normal cursor-pointer">
                    Show Processing Reviews
                  </Label>
                        </div>
              </div>

              {/* Right Column */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="end-date">End Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                      id="end-date" 
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? formatDateString(endDate) : <span className="text-muted-foreground">Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => {
                          setEndDate(date);
                          if (date) {
                            setSearchFilters({...searchFilters, endDate: formatDateString(date)});
                          }
                        }}
                        disabled={(date) => startDate ? date < startDate : false}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label>Dealers</Label>
                  <div className="flex gap-2">
                    <Input 
                      value={searchFilters.dealers}
                      onChange={(e) => setSearchFilters({...searchFilters, dealers: e.target.value})}
                    />
                    {searchFilters.dealers && (
                          <Button
                            variant="ghost"
                        size="icon"
                        onClick={() => setSearchFilters({...searchFilters, dealers: ''})}
                          >
                        <X className="h-4 w-4" />
                          </Button>
                    )}
                        </div>
            </div>

                <div className="space-y-2">
                  <Label htmlFor="client-id">Client ID</Label>
                  <Input 
                    id="client-id"
                    value={searchFilters.clientId}
                    onChange={(e) => setSearchFilters({...searchFilters, clientId: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Value Filter</Label>
                  <Select value={searchFilters.valueFilter} onValueChange={(value) => setSearchFilters({...searchFilters, valueFilter: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                    </SelectContent>
                  </Select>
                    </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="invert-value"
                    checked={searchFilters.invertValueFilter}
                    onCheckedChange={(checked) => setSearchFilters({...searchFilters, invertValueFilter: checked as boolean})}
                  />
                  <Label htmlFor="invert-value" className="text-sm font-normal cursor-pointer">
                    Invert value filter
                  </Label>
                    </div>

                <div className="space-y-2">
                  <Label htmlFor="report-mode">Report Mode</Label>
                  <Input 
                    id="report-mode"
                    value={searchFilters.reportMode}
                    onChange={(e) => setSearchFilters({...searchFilters, reportMode: e.target.value})}
                  />
                    </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="show-oldest"
                    checked={searchFilters.showOldestFirst}
                    onCheckedChange={(checked) => setSearchFilters({...searchFilters, showOldestFirst: checked as boolean})}
                  />
                  <Label htmlFor="show-oldest" className="text-sm font-normal cursor-pointer">
                    Show Oldest Trades First
                  </Label>
                        </div>
                        </div>
                        </div>

            {/* Organize Results by */}
            <div className="space-y-2 pt-2 border-t">
              <Label>Organize Results by</Label>
              <RadioGroup 
                value={searchFilters.organizeBy} 
                onValueChange={(value) => setSearchFilters({...searchFilters, organizeBy: value})}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="client" id="organize-client" />
                  <Label htmlFor="organize-client" className="text-sm font-normal cursor-pointer">Client</Label>
                        </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="representative" id="organize-rep" />
                  <Label htmlFor="organize-rep" className="text-sm font-normal cursor-pointer">Representative</Label>
                        </div>
              </RadioGroup>
                    </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 pt-4 border-t">
              <Button onClick={handleSearch} className="bg-green-600 hover:bg-green-700">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button 
                variant="outline" 
                onClick={handleBulkAIAnalysis}
                disabled={!selectedClient || isAnalyzing}
                className="border-purple-300 text-purple-700 hover:bg-purple-50"
              >
                {isAnalyzing ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="h-4 w-4 mr-2" />
                    AI Analyze All Trades
                  </>
                )}
              </Button>
              {selectedTrades.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={handleSelectedTradesAIAnalysis}
                  disabled={isAnalyzing}
                  className="border-purple-300 text-purple-700 hover:bg-purple-50"
                >
                  {isAnalyzing ? (
                    <>
                      <Clock className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      AI Analyze Selected ({selectedTrades.length})
                    </>
                  )}
                </Button>
              )}
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Summary Report
              </Button>
              <Button variant="outline">
                <Printer className="h-4 w-4 mr-2" />
                Print Summary Report (Supervisory Totals)
              </Button>
                    </div>
          </CardContent>
        </Card>

        {/* Trade Results Section */}
        {!hasSearched && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              Please fill out the search fields above and click "Search" to see trade results.
            </CardContent>
          </Card>
        )}

        {hasSearched && totalTrades > 0 && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg font-semibold">
                  Trade Results - Found {totalTrades} Trades
                </CardTitle>
                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Sidebar - Client List */}
                <div className="lg:col-span-2 space-y-2">
                  {clients.map((client) => (
                    <button
                      key={client.id}
                      onClick={() => handleClientSelection(client.id)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedClientId === client.id
                          ? 'bg-primary/10 border-primary text-primary font-medium'
                          : 'bg-background border-border hover:bg-muted'
                      }`}
                    >
                      <div className="text-sm">{client.name}</div>
                      <div className="text-xs text-muted-foreground">{client.id}</div>
                    </button>
                  ))}
                    </div>

                {/* Main Content Area */}
                {selectedClient && (
                  <>
                    <div className="lg:col-span-7 space-y-6">
                      {/* Client and Plan Details */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Client Information */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">
                              {selectedClient.name} {selectedClient.id}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm">
                    <div>
                              <span className="text-muted-foreground">Location:</span>{' '}
                              <span className="font-medium">{selectedClient.location}</span>
                        </div>
                        <div>
                              <span className="text-muted-foreground">Income:</span>{' '}
                              <span className="font-medium">{selectedClient.income}</span>
                        </div>
                        <div>
                              <span className="text-muted-foreground">Net Worth:</span>{' '}
                              <span className="font-medium">${selectedClient.netWorth.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div>
                              <span className="text-muted-foreground">Knowledge:</span>{' '}
                              <span className="font-medium">{selectedClient.knowledge}</span>
                        </div>
                        <div>
                              <span className="text-muted-foreground">Age:</span>{' '}
                              <span className="font-medium">{selectedClient.age}</span>
                        </div>
                        <div>
                              <span className="text-muted-foreground">Pro Account:</span>{' '}
                              <span className="font-medium">{selectedClient.proAccount ? 'Yes' : 'No'}</span>
                        </div>
                          </CardContent>
                        </Card>

                        {/* Plan Information */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-base font-semibold">
                              Plan {selectedClient.plan.id} {selectedClient.plan.name}
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-3 text-sm">
                    <div>
                              <span className="text-muted-foreground">Representative:</span>{' '}
                              <span className="font-medium">{selectedClient.plan.representative}</span>
                            </div>
                        <div>
                              <span className="text-muted-foreground">Market Value:</span>{' '}
                              <span className="font-medium">${selectedClient.plan.marketValue.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                        <div>
                              <span className="text-muted-foreground">KYC On File Date:</span>{' '}
                              <span className="font-medium">{selectedClient.plan.kycOnFileDate}</span>
                        </div>
                        <div>
                              <span className="text-muted-foreground">KYC Last Modified Date:</span>{' '}
                              <span className="font-medium">{selectedClient.plan.kycLastModifiedDate}</span>
                        </div>
                        <div>
                              <span className="text-muted-foreground">Time Horizon:</span>{' '}
                              <span className="font-medium">{selectedClient.plan.timeHorizon}</span>
                        </div>
                    <div>
                              <span className="text-muted-foreground">LTA:</span>{' '}
                              <span className="font-medium">{selectedClient.plan.lta || '-'}</span>
                      </div>
                          </CardContent>
                        </Card>
                    </div>

                      {/* Trades Table */}
                      <Card>
                        <CardContent className="pt-6">
                          <div className="w-full">
                        <Table className="w-full">
                          <TableHeader>
                            <TableRow>
                              <TableHead className="w-12"></TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>AI Recommendation</TableHead>
                                  <TableHead>Trade Date</TableHead>
                                  <TableHead>Product Name - Account Number</TableHead>
                                  <TableHead>Fund Risk - Objective - Load Type - Wire Order - Product Indicator</TableHead>
                                  <TableHead>Leveraged / Exempt</TableHead>
                                  <TableHead>Transaction Type - Amount - Projected Amount</TableHead>
                                  <TableHead>Trade Reviews / Trade Notes</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                                {selectedClient.trades.map((trade) => (
                                  <TableRow key={trade.id}>
                                <TableCell>
                                      <Checkbox
                                        checked={selectedTrades.includes(trade.id)}
                                        onCheckedChange={() => toggleTradeSelection(trade.id)}
                                      />
                                </TableCell>
                                <TableCell>
                                      <Badge variant="outline">{trade.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                      {getAIRecommendationBadge(trade.id) || (
                                        <span className="text-xs text-muted-foreground">Not analyzed</span>
                                      )}
                                      {aiAnalysisResults[trade.id] && (
                                        <div className="text-xs text-muted-foreground mt-1">
                                          {aiAnalysisResults[trade.id].confidence}% confidence
                                        </div>
                                      )}
                                    </TableCell>
                                    <TableCell className="font-medium">{trade.tradeDate}</TableCell>
                                    <TableCell>
                                      <div className="text-sm">
                                        <div className="font-medium">{trade.productName}</div>
                                        <div className="text-muted-foreground">{trade.accountNumber}</div>
                                  </div>
                                </TableCell>
                                    <TableCell>
                                      <div className="text-sm">
                                        {trade.fundRisk} - {trade.objective} - {trade.loadType}
                                        {trade.wireOrder && ` - ${trade.wireOrder}`}
                                        {trade.productIndicator && ` - ${trade.productIndicator}`}
                                      </div>
                                    </TableCell>
                                    <TableCell className="text-sm">{trade.leveragedExempt || '-'}</TableCell>
                                    <TableCell className="text-sm font-medium">
                                      {trade.transactionType} ${trade.amount.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {trade.currency}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex flex-col gap-2">
                                        <div className="space-y-2">
                                          <div className="text-sm font-medium text-gray-700">
                                            Trade Reviews ({trade.tradeReviews.length})
                                          </div>
                                          {trade.tradeReviews.length > 0 ? (
                                            trade.tradeReviews.map((review, idx) => (
                                              <div key={idx} className="text-xs text-muted-foreground p-2 bg-muted rounded border-l-2 border-primary">
                                                {review}
                                              </div>
                                            ))
                                          ) : (
                                            <div className="text-xs text-muted-foreground italic">No reviews</div>
                                          )}
                                        </div>
                                        <div className="space-y-2">
                                          <div className="text-sm font-medium text-gray-700">
                                            Trade Notes ({trade.tradeNotes.length})
                                          </div>
                                          {trade.tradeNotes.length > 0 ? (
                                            trade.tradeNotes.map((note, idx) => (
                                              <div key={idx} className="text-xs text-muted-foreground p-2 bg-muted rounded border-l-2 border-yellow-500">
                                                {note}
                                              </div>
                                            ))
                                          ) : (
                                            <div className="text-xs text-muted-foreground italic">No notes</div>
                                          )}
                                        </div>
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

                    {/* Right Sidebar - Suitability and Actions */}
                    <div className="lg:col-span-3 space-y-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base font-semibold">Suitability & Documents</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div>
                            <div className="text-sm text-muted-foreground mb-2">Pinned Documents</div>
                            <div className="text-sm text-muted-foreground italic">No Pinned Documents found</div>
                    </div>

                          <div className="space-y-3 pt-3 border-t">
                            <div>
                              <div className="text-sm text-muted-foreground mb-2">Current Suitability</div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenKycGraphs('current', 'detailed')}
                                  className="cursor-pointer hover:opacity-70 transition-opacity"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                </button>
                                <button
                                  onClick={() => handleOpenKycGraphs('current', 'simplified')}
                                  className="cursor-pointer hover:opacity-70 transition-opacity"
                                >
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </div>
                            </div>

                            <div>
                              <div className="text-sm text-muted-foreground mb-2">Projected Suitability</div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => handleOpenKycGraphs('projected', 'detailed')}
                                  className="cursor-pointer hover:opacity-70 transition-opacity"
                                >
                                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                                </button>
                                <button
                                  onClick={() => handleOpenKycGraphs('projected', 'simplified')}
                                  className="cursor-pointer hover:opacity-70 transition-opacity"
                                >
                                  <FileText className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col gap-2 pt-3 border-t">
                            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setAttachmentsOpen(true)}>
                              View Attachments
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start" onClick={() => setPlanReviewsOpen(true)}>
                              Plan Reviews
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => setPlanDetailsOpen(true)}
                            >
                              Plan Details
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="w-full justify-start"
                              onClick={() => setTrustTransactionsOpen(true)}
                            >
                              Trust Transactions
                            </Button>
                              </div>
                        </CardContent>
                      </Card>

                      {/* AI Settings Section */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base font-semibold flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            AI Auto-Approval & Flagging
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="ai-auto-approve" className="text-sm font-medium">
                                  Auto-Approve Trades
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Automatically approve low-risk trades with high confidence (≥85%)
                                </p>
                              </div>
                              <Checkbox
                                id="ai-auto-approve"
                                checked={aiAutoApproveEnabled}
                                onCheckedChange={(checked) => setAiAutoApproveEnabled(checked as boolean)}
                              />
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <div className="space-y-0.5">
                                <Label htmlFor="ai-auto-flag" className="text-sm font-medium">
                                  Auto-Flag for Review
                                </Label>
                                <p className="text-xs text-muted-foreground">
                                  Automatically flag high-risk trades for manual review
                                </p>
                              </div>
                              <Checkbox
                                id="ai-auto-flag"
                                checked={aiAutoFlagEnabled}
                                onCheckedChange={(checked) => setAiAutoFlagEnabled(checked as boolean)}
                              />
                            </div>
                          </div>
                          
                          {selectedTrades.length > 0 && (
                            <Button
                              variant="outline"
                              onClick={() => setAiAnalysisOpen(true)}
                              className="w-full border-purple-300 text-purple-700 hover:bg-purple-50"
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              View AI Analysis Details
                            </Button>
                          )}
                        </CardContent>
                      </Card>

                      {/* Manager Approval Section */}
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base font-semibold">Manager Approval</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                          {/* Selected Trades Display */}
                          {selectedTrades.length > 0 && selectedClient && (
                            <div className="p-3 bg-muted rounded-md space-y-2">
                              <div className="text-sm font-medium">Selected Trades ({selectedTrades.length}):</div>
                              <div className="space-y-1">
                                {getSelectedTradesDetails().map((trade) => (
                                  <div key={trade.id} className="text-xs text-muted-foreground">
                                    • {trade.productName} - {trade.accountNumber}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedTrades.length === 0 && (
                            <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
                              Please select a trade from the table above to add notes.
                            </div>
                          )}
                          {/* Approval Status Icons Selector */}
                          <div className="space-y-3">
                            <RadioGroup 
                              value={managerApproval.approvalStatus} 
                              onValueChange={(value) => setManagerApproval({...managerApproval, approvalStatus: value})}
                              className="w-full"
                            >
                              {/* Icons Row */}
                              <div className="flex items-start justify-between gap-2 mb-3">
                                {/* No Action - Empty Box */}
                                <label className="flex flex-col items-center cursor-pointer flex-1 min-w-0 group">
                                  <div className="h-7 w-7 flex items-center justify-center mb-2 transition-opacity group-hover:opacity-70">
                                    <Square className="h-5 w-5 text-muted-foreground stroke-1" />
                                  </div>
                                  <RadioGroupItem value="none" id="approval-none" />
                                </label>
                                {/* Approve - Blue Box with Check */}
                                <label className="flex flex-col items-center cursor-pointer flex-1 min-w-0 group">
                                  <div className="h-7 w-7 flex items-center justify-center mb-2 relative transition-opacity group-hover:opacity-70">
                                    <div className="h-5 w-5 bg-primary rounded-sm flex items-center justify-center">
                                      <Check className="h-3 w-3 text-white" strokeWidth={2.5} />
                                    </div>
                                  </div>
                                  <RadioGroupItem value="approved" id="approval-approved" />
                                </label>
                                {/* Deny - Box with X */}
                                <label className="flex flex-col items-center cursor-pointer flex-1 min-w-0 group">
                                  <div className="h-7 w-7 flex items-center justify-center mb-2 relative transition-opacity group-hover:opacity-70">
                                    <Square className="h-5 w-5 text-destructive stroke-1" />
                                    <X className="h-3 w-3 text-destructive absolute" strokeWidth={2.5} />
                                  </div>
                                  <RadioGroupItem value="denied" id="approval-denied" />
                                </label>
                                {/* Delay - Box with Pause */}
                                <label className="flex flex-col items-center cursor-pointer flex-1 min-w-0 group">
                                  <div className="h-7 w-7 flex items-center justify-center mb-2 relative transition-opacity group-hover:opacity-70">
                                    <Square className="h-5 w-5 text-orange-500 stroke-1" />
                                    <Pause className="h-3 w-3 text-orange-500 absolute" strokeWidth={2.5} fill="currentColor" />
                                  </div>
                                  <RadioGroupItem value="delay" id="approval-delay" />
                                </label>
                                {/* Request Preapproval - Text Bubble */}
                                <label className="flex flex-col items-center cursor-pointer flex-1 min-w-0 group">
                                  <div className="h-7 w-7 flex items-center justify-center mb-2 transition-opacity group-hover:opacity-70">
                                    <MessageSquare className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                                  </div>
                                  <RadioGroupItem value="request-preapproval" id="approval-request-preapproval" />
                                </label>
                                {/* Pre Approve - Magnifying Glass */}
                                <label className="flex flex-col items-center cursor-pointer flex-1 min-w-0 group">
                                  <div className="h-7 w-7 flex items-center justify-center mb-2 transition-opacity group-hover:opacity-70">
                                    <SearchIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                                  </div>
                                  <RadioGroupItem value="pre-approve" id="approval-pre-approve" />
                                </label>
                                {/* Note - Yellow Note Icon */}
                                <label className="flex flex-col items-center cursor-pointer flex-1 min-w-0 group">
                                  <div className="h-7 w-7 flex items-center justify-center mb-2 transition-opacity group-hover:opacity-70">
                                    <StickyNote className="h-5 w-5 text-yellow-600" strokeWidth={1.5} />
                                  </div>
                                  <RadioGroupItem value="note" id="approval-note" />
                                </label>
                                {/* Inquiry - Question Mark */}
                                <label className="flex flex-col items-center cursor-pointer flex-1 min-w-0 group">
                                  <div className="h-7 w-7 flex items-center justify-center mb-2 transition-opacity group-hover:opacity-70">
                                    <HelpCircleIcon className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                                  </div>
                                  <RadioGroupItem value="inquiry" id="approval-inquiry" />
                                </label>
                                {/* Inquiry Answer - Letter A */}
                                <label className="flex flex-col items-center cursor-pointer flex-1 min-w-0 group">
                                  <div className="h-7 w-7 flex items-center justify-center mb-2 relative transition-opacity group-hover:opacity-70">
                                    <Square className="h-5 w-5 text-foreground stroke-1" />
                                    <Type className="h-3 w-3 text-foreground absolute" strokeWidth={2} />
                                  </div>
                                  <RadioGroupItem value="inquiry-answer" id="approval-inquiry-answer" />
                                </label>
                              </div>
                            </RadioGroup>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="category">Category</Label>
                            <Select value={managerApproval.category} onValueChange={(value) => setManagerApproval({...managerApproval, category: value})}>
                              <SelectTrigger id="category">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Compliance">Compliance</SelectItem>
                                <SelectItem value="Suitability">Suitability</SelectItem>
                                <SelectItem value="Other">Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                            <div className="space-y-2">
                            <Label htmlFor="comments">Comments</Label>
                            <Textarea
                              id="comments"
                              value={managerApproval.comment}
                              onChange={(e) => setManagerApproval({...managerApproval, comment: e.target.value})}
                              rows={4}
                              placeholder="Enter comments..."
                            />
                                  </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id="send-notification"
                              checked={managerApproval.sendNotification}
                              onCheckedChange={(checked) => setManagerApproval({...managerApproval, sendNotification: checked as boolean})}
                            />
                            <Label htmlFor="send-notification" className="text-sm font-normal cursor-pointer">
                              Send Notification to Advisor
                            </Label>
                                  </div>

                          <Button 
                            className="w-full bg-green-600 hover:bg-green-700"
                            onClick={handleSubmitManagerApproval}
                            disabled={selectedTrades.length === 0 || !managerApproval.comment.trim()}
                          >
                            Submit Reviews
                          </Button>
                        </CardContent>
                      </Card>
                        </div>
                  </>
                      )}
                    </div>
            </CardContent>
          </Card>
        )}

        {hasSearched && totalTrades === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No trades found. Adjust your search filters and try again.
            </CardContent>
          </Card>
        )}

        {/* KYC Graphs Dialog */}
        <Dialog open={kycGraphsOpen} onOpenChange={setKycGraphsOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {kycGraphsViewMode === 'simplified' 
                  ? `KYC Graphs - Portfolio ${clientName} - ${kycGraphsType === 'current' ? 'Current' : 'Projected'}`
                  : `KYC Graphs - ${kycGraphsType === 'current' ? planInfo : `Portfolio ${clientName}`} - ${kycGraphsType === 'current' ? 'Current' : 'Projected'}`
                }
              </DialogTitle>
            </DialogHeader>

            {kycGraphsViewMode === 'simplified' ? (
              // Simplified View (Document Icon)
              <div className="space-y-6 mt-4">
                {/* Risk and Investment Objectives Charts */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Risk Chart */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">Risk</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={kycData.riskData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis label={{ value: 'Percent', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                            <Tooltip 
                              formatter={(value: number) => [`${value}%`, 'Actual Risk Distribution']} 
                              labelFormatter={(label) => `Risk: ${label}`}
                            />
                            <Legend />
                            <Bar dataKey="actual" name="Actual Risk Distribution" fill="#22c55e" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Investment Objectives Chart */}
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base font-semibold">Investment Objectives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={kycData.objectiveData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="objective" angle={-45} textAnchor="end" height={80} />
                            <YAxis label={{ value: 'Percent', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                            <Tooltip 
                              formatter={(value: number) => [`${value}%`, 'Actual Objective Distribution']} 
                              labelFormatter={(label) => `Objective: ${label}`}
                            />
                            <Legend />
                            <Bar dataKey="actual" name="Actual Objective Distribution" fill="#22c55e" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Current Risk Score with Horizontal Bar */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">
                      Current Risk Score: {kycData.riskScore.current.toFixed(2)}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="relative w-full h-16 bg-gray-100 rounded-md overflow-visible">
                        {/* Risk level labels positioned along the bar */}
                        <div className="absolute inset-0 flex items-center">
                          <span className="absolute left-2 text-xs text-muted-foreground">0</span>
                          <span className="absolute left-[20%] text-xs text-muted-foreground">L</span>
                          <span className="absolute left-[40%] text-xs text-muted-foreground">LM</span>
                          <span className="absolute left-[60%] text-xs text-muted-foreground">M</span>
                          <span className="absolute left-[80%] text-xs text-muted-foreground">MH</span>
                          <span className="absolute right-2 text-xs text-muted-foreground">H</span>
                        </div>
                        {/* Green bar showing actual risk score - assuming max score of 300 */}
                        <div 
                          className="absolute left-0 top-0 h-full bg-green-500 rounded-l-md"
                          style={{ 
                            width: `${Math.min((kycData.riskScore.current / 300) * 100, 100)}%` 
                          }}
                        >
                          {/* Score value marker at the end of the green bar */}
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-xs font-medium text-gray-900 bg-white border border-gray-300 px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                            {kycData.riskScore.current.toFixed(3)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <div className="w-3 h-3 bg-green-500 rounded"></div>
                        <span className="text-muted-foreground">Actual Risk Score</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              // Detailed View (Check Button)
              <div className="space-y-6 mt-4">
              {/* Risk and Investment Objectives Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Risk Chart */}
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base font-semibold">Risk</CardTitle>
                      <span className="text-sm text-muted-foreground">Cash Account: ${kycData.cashAccount.toFixed(2)}</span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kycData.riskData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="category" />
                          <YAxis label={{ value: 'Percent', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                          <Tooltip 
                            formatter={(value: number, name: string) => [`${value}%`, name]} 
                            labelFormatter={(label) => `Risk: ${label}`}
                          />
                          <Legend />
                          <Bar dataKey="actual" name="Actual" fill="#22c55e" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="projected" name="Projected" fill="#eab308" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="kyc" name="KYC" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>

                {/* Investment Objectives Chart */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base font-semibold">Investment Objectives</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={kycData.objectiveData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="objective" angle={-45} textAnchor="end" height={80} />
                          <YAxis label={{ value: 'Percent', angle: -90, position: 'insideLeft' }} domain={[0, 100]} />
                          <Tooltip 
                            formatter={(value: number, name: string) => [`${value}%`, name]} 
                            labelFormatter={(label) => `Objective: ${label}`}
                          />
                          <Legend />
                          <Bar dataKey="actual" name="Actual" fill="#22c55e" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="projected" name="Projected" fill="#eab308" radius={[4, 4, 0, 0]} />
                          <Bar dataKey="kyc" name="KYC" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Scores */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Current Risk Score</div>
                    <div className="text-2xl font-bold">{kycData.riskScore.current}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground mb-1">Projected Risk Score</div>
                    <div className="text-2xl font-bold">{kycData.riskScore.projected}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Risk Distribution Horizontal Bar Chart */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base font-semibold">Risk Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart 
                        data={kycData.riskDistribution} 
                        layout="vertical"
                        margin={{ top: 10, right: 10, left: 0, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="category" type="category" width={60} />
                        <Tooltip 
                          formatter={(value: number, name: string) => [`${value}%`, name]} 
                          labelFormatter={(label) => `Risk: ${label}`}
                        />
                        <Legend />
                        <Bar dataKey="actual" name="Actual" fill="#22c55e" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="projected" name="Projected" fill="#eab308" radius={[0, 4, 4, 0]} />
                        <Bar dataKey="kyc" name="KYC" fill="#3b82f6" radius={[0, 4, 4, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  {kycData.riskDistribution.some(item => item.value > 0) && (
                    <div className="mt-2 text-right text-sm text-muted-foreground">
                      {kycData.riskDistribution.find(item => item.value > 0)?.value}
                    </div>
                  )}
                </CardContent>
                </Card>
              </div>
            )}

            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
              <Button variant="outline" onClick={() => setKycGraphsOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* AI Analysis Details Dialog */}
        <Dialog open={aiAnalysisOpen} onOpenChange={setAiAnalysisOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple-600" />
                AI Analysis Details
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {selectedTrades.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No trades selected. Please select trades to view AI analysis.
                </div>
              ) : (
                getSelectedTradesDetails().map((trade) => {
                  const analysis = aiAnalysisResults[trade.id];
                  return (
                    <Card key={trade.id}>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-sm font-semibold">
                          {trade.productName} - {trade.accountNumber}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {analysis ? (
                          <>
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Recommendation</div>
                                <div>{getAIRecommendationBadge(trade.id)}</div>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Risk Level</div>
                                <Badge 
                                  variant="outline"
                                  className={
                                    analysis.riskLevel === 'high' 
                                      ? 'bg-red-100 text-red-800 border-red-300'
                                      : analysis.riskLevel === 'medium'
                                      ? 'bg-yellow-100 text-yellow-800 border-yellow-300'
                                      : 'bg-green-100 text-green-800 border-green-300'
                                  }
                                >
                                  {analysis.riskLevel.toUpperCase()}
                                </Badge>
                              </div>
                              <div>
                                <div className="text-xs text-muted-foreground mb-1">Confidence</div>
                                <div className="text-sm font-medium">{analysis.confidence}%</div>
                              </div>
                            </div>
                            
                            <div>
                              <div className="text-xs text-muted-foreground mb-2">Analysis Reasons</div>
                              <ul className="space-y-1">
                                {analysis.reasons.map((reason, idx) => (
                                  <li key={idx} className="text-sm flex items-start gap-2">
                                    <span className="text-muted-foreground">•</span>
                                    <span>{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            {analysis.autoApproved && (
                              <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                                <div className="text-sm font-medium text-green-800 flex items-center gap-2">
                                  <CheckCircle2 className="h-4 w-4" />
                                  Auto-Approved by AI
                                </div>
                              </div>
                            )}
                            
                            {analysis.flaggedForReview && (
                              <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                                <div className="text-sm font-medium text-red-800 flex items-center gap-2">
                                  <Flag className="h-4 w-4" />
                                  Flagged for Review by AI
                                </div>
                              </div>
                            )}
                            
                            {analysis.analyzedAt && (
                              <div className="text-xs text-muted-foreground">
                                Analyzed at: {new Date(analysis.analyzedAt).toLocaleString()}
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="text-center py-4 text-muted-foreground text-sm">
                            No AI analysis available. Click "AI Analyze Selected" to analyze this trade.
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Plan Details Dialog */}
        <Dialog open={planDetailsOpen} onOpenChange={setPlanDetailsOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className="text-lg font-semibold">Plan Details</DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {selectedClient && (
                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Plan Information Section */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Plan Information</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="plan-id">ID</Label>
                            <Input id="plan-id" value={selectedClient.plan.id} readOnly />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="plan-type">Type</Label>
                            <Select defaultValue="RRSP">
                              <SelectTrigger id="plan-type">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="RRSP">RRSP</SelectItem>
                                <SelectItem value="TFSA">TFSA</SelectItem>
                                <SelectItem value="RESP">RESP</SelectItem>
                                <SelectItem value="RRIF">RRIF</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="account-designation">Account Designation</Label>
                          <Select defaultValue="Broker/Nominee">
                            <SelectTrigger id="account-designation">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Broker/Nominee">Broker/Nominee</SelectItem>
                              <SelectItem value="Individual">Individual</SelectItem>
                              <SelectItem value="Joint">Joint</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="current-representative">Current Representative</Label>
                          <Input id="current-representative" value={selectedClient.plan.representative} readOnly />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="description">Description</Label>
                          <Textarea id="description" rows={3} placeholder="Enter description..." />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="intent-of-use">Intent Of Use</Label>
                          <Input id="intent-of-use" defaultValue="Retirement" />
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="frozen" />
                            <Label htmlFor="frozen" className="text-sm font-normal cursor-pointer">Frozen</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="full-freeze" />
                            <Label htmlFor="full-freeze" className="text-sm font-normal cursor-pointer">Full Freeze</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="group-account" />
                            <Label htmlFor="group-account" className="text-sm font-normal cursor-pointer">Group Account</Label>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="group-account-id">Group Account ID</Label>
                          <div className="flex gap-2">
                            <Input id="group-account-id" defaultValue="test" />
                            <Select>
                              <SelectTrigger className="w-12">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-6">
                          <div className="flex items-center space-x-2">
                            <Checkbox id="leveraged" />
                            <Label htmlFor="leveraged" className="text-sm font-normal cursor-pointer">Leveraged</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="locked-in" />
                            <Label htmlFor="locked-in" className="text-sm font-normal cursor-pointer">Locked In</Label>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="loan-number">Loan Number</Label>
                          <Input id="loan-number" placeholder="Enter loan number..." />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="recipient">Recipient</Label>
                          <Select defaultValue="Individual">
                            <SelectTrigger id="recipient">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Individual">Individual</SelectItem>
                              <SelectItem value="Joint">Joint</SelectItem>
                              <SelectItem value="Corporate">Corporate</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="intermediary-code">Intermediary Code</Label>
                            <Input id="intermediary-code" defaultValue="SMI" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="intermediary-account-code">Intermediary Account Code</Label>
                            <Input id="intermediary-account-code" defaultValue="1013588874" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="signature">Signature</Label>
                          <Select defaultValue="Unknown">
                            <SelectTrigger id="signature">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Unknown">Unknown</SelectItem>
                              <SelectItem value="On File">On File</SelectItem>
                              <SelectItem value="Required">Required</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Plan Custom Questions Section */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Plan Custom Questions</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label>test</Label>
                          <Textarea rows={3} placeholder="Enter value..." />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Important Dates Section */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Important Dates</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="start-date">Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="start-date"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>09/12/2013</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="end-date">End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="end-date"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span className="text-muted-foreground">Pick a date</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="kyc-on-file-date">KYC On File Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="kyc-on-file-date"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span>{selectedClient.plan.kycOnFileDate}</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="kyc-age">KYC Age</Label>
                          <Input id="kyc-age" value="420 days Old" readOnly />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="kyc-original-received-date">KYC Original Received Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="kyc-original-received-date"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span className="text-muted-foreground">Pick a date</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Revenue Model Section */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Revenue Model</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="revenue-model">Revenue Model</Label>
                          <Select defaultValue="Commissions">
                            <SelectTrigger id="revenue-model">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Commissions">Commissions</SelectItem>
                              <SelectItem value="Fee for Service">Fee for Service</SelectItem>
                              <SelectItem value="Hybrid">Hybrid</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fee-for-service-amount">Fee for Service Amount</Label>
                          <Input id="fee-for-service-amount" placeholder="Enter amount..." />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="fee-for-service-start-date">Fee for Service Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="fee-for-service-start-date"
                                variant="outline"
                                className="w-full justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                <span className="text-muted-foreground">Pick a date</span>
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar mode="single" initialFocus />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Checkbox id="fee-for-service-approved" />
                          <Label htmlFor="fee-for-service-approved" className="text-sm font-normal cursor-pointer">
                            Fee for Service Approved
                          </Label>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Plan Fee Settings Section */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Plan Fee Settings</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Schedule Name</TableHead>
                              <TableHead>Setting Option</TableHead>
                              <TableHead>Start Date</TableHead>
                              <TableHead>Bank Account</TableHead>
                              <TableHead>Override Fund</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            <TableRow>
                              <TableCell>SMI Trustee Fee (9823)</TableCell>
                              <TableCell>Charge the Plan</TableCell>
                              <TableCell></TableCell>
                              <TableCell>18202-004-0233305</TableCell>
                              <TableCell>None</TableCell>
                            </TableRow>
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                    
                    {/* Plan FFS Override Fund Section */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Plan FFS Override Fund</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Select defaultValue="None">
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Fund 1">Fund 1</SelectItem>
                            <SelectItem value="Fund 2">Fund 2</SelectItem>
                          </SelectContent>
                        </Select>
                      </CardContent>
                    </Card>
                    
                    {/* Additional Financial Interest Section */}
                    <Card>
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base font-semibold">Additional Financial Interest</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="trading-authorization">Does anyone else have trading authorization?</Label>
                          <Select defaultValue="No">
                            <SelectTrigger id="trading-authorization">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="No">No</SelectItem>
                              <SelectItem value="Yes">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="trading-auth-name">Name</Label>
                          <Input id="trading-auth-name" placeholder="Enter name..." />
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="financial-interest">Does anyone else have a Financial Interest?</Label>
                          <Select defaultValue="No">
                            <SelectTrigger id="financial-interest">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="No">No</SelectItem>
                              <SelectItem value="Yes">Yes</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="financial-interest-name">Name</Label>
                          <Input id="financial-interest-name" placeholder="Enter name..." />
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setPlanDetailsOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Trust Transactions Dialog */}
        <Dialog open={trustTransactionsOpen} onOpenChange={setTrustTransactionsOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className="text-lg font-semibold">
                {selectedClient && `Plan ${selectedClient.plan.id} (${selectedClient.plan.name}) Trust Transactions`}
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Trust Account</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-right">Sales Tax</TableHead>
                    <TableHead className="text-right">Platform Fee</TableHead>
                    <TableHead>Payment Method</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {mockTrustTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.date}</TableCell>
                      <TableCell>
                        <Badge 
                          variant="outline"
                          className={
                            transaction.status === 'Settled' 
                              ? 'bg-green-50 text-green-700 border-green-200'
                              : transaction.status === 'Not settled'
                              ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }
                        >
                          {transaction.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{transaction.trustAccount}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell className={`text-right font-medium ${transaction.amount < 0 ? 'text-red-600' : transaction.amount > 0 ? 'text-green-600' : ''}`}>
                        {transaction.amount < 0 
                          ? `($${Math.abs(transaction.amount).toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})`
                          : `$${transaction.amount.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        }
                      </TableCell>
                      <TableCell className="text-right">
                        ${transaction.salesTax.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell className="text-right">
                        ${transaction.platformFee.toLocaleString('en-CA', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </TableCell>
                      <TableCell>{transaction.paymentMethod}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="px-6 py-4 border-t flex justify-end">
              <Button variant="outline" onClick={() => setTrustTransactionsOpen(false)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* View Attachments Dialog */}
        <Dialog open={attachmentsOpen} onOpenChange={setAttachmentsOpen}>
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className="text-lg font-semibold">View Attachments</DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              <Tabs value={attachmentsTab} onValueChange={(value) => setAttachmentsTab(value as 'rep' | 'dealer')} className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="rep">Rep Attachments</TabsTrigger>
                  <TabsTrigger value="dealer">Dealer Attachments</TabsTrigger>
                </TabsList>

                <TabsContent value="rep" className="space-y-6 mt-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-inactive"
                      checked={includeInactive}
                      onCheckedChange={(checked) => setIncludeInactive(checked as boolean)}
                    />
                    <Label htmlFor="include-inactive" className="text-sm font-normal cursor-pointer">
                      Include Inactive Attachments
                    </Label>
                  </div>

                  {/* Pinned Documents Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">Pinned Documents</h3>
                    
                    {/* Pagination Top */}
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {((pinnedPage - 1) * recordsPerPage) + 1}-{Math.min(pinnedPage * recordsPerPage, mockPinnedDocuments.length)} of {mockPinnedDocuments.length} records
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === 1}>
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant={pinnedPage === 1 ? "default" : "ghost"} size="sm" className="h-8">
                          1
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === Math.ceil(mockPinnedDocuments.length / recordsPerPage)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === Math.ceil(mockPinnedDocuments.length / recordsPerPage)}>
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                        <Select value={recordsPerPage.toString()} onValueChange={(value) => setRecordsPerPage(parseInt(value))}>
                          <SelectTrigger className="h-8 w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">Select * For All</span>
                      </div>
                    </div>

                    {/* Pinned Documents Table */}
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Pinned to <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Document Type <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Date On File <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockPinnedDocuments.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell className="text-sm">{doc.pinnedTo}</TableCell>
                              <TableCell className="text-sm">{doc.documentType}</TableCell>
                              <TableCell className="text-sm">{doc.dateOnFile}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">View</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination Bottom */}
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {((pinnedPage - 1) * recordsPerPage) + 1}-{Math.min(pinnedPage * recordsPerPage, mockPinnedDocuments.length)} of {mockPinnedDocuments.length} records
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === 1}>
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant={pinnedPage === 1 ? "default" : "ghost"} size="sm" className="h-8">
                          1
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === Math.ceil(mockPinnedDocuments.length / recordsPerPage)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === Math.ceil(mockPinnedDocuments.length / recordsPerPage)}>
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                        <Select value={recordsPerPage.toString()} onValueChange={(value) => setRecordsPerPage(parseInt(value))}>
                          <SelectTrigger className="h-8 w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">Select * For All</span>
                      </div>
                    </div>
                  </div>

                  {/* Attachments Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">Attachments</h3>
                    
                    {/* Pagination Top */}
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {((attachmentsPage - 1) * recordsPerPage) + 1}-{Math.min(attachmentsPage * recordsPerPage, mockAttachments.length)} of {mockAttachments.length} records
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === 1}>
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {[1, 2, 3, 4, 5].map((page) => (
                          <Button
                            key={page}
                            variant={attachmentsPage === page ? "default" : "ghost"}
                            size="sm"
                            className="h-8"
                            onClick={() => setAttachmentsPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === Math.ceil(mockAttachments.length / recordsPerPage)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === Math.ceil(mockAttachments.length / recordsPerPage)}>
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                        <Select value={recordsPerPage.toString()} onValueChange={(value) => setRecordsPerPage(parseInt(value))}>
                          <SelectTrigger className="h-8 w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">Select * For All</span>
                      </div>
                    </div>

                    {/* Attachments Table */}
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Date Submitted <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Document Type <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Attachment Description <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Status
                            </TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockAttachments.map((attachment) => (
                            <TableRow key={attachment.id}>
                              <TableCell className="text-sm">{attachment.dateSubmitted}</TableCell>
                              <TableCell className="text-sm">
                                <div className="flex items-center gap-2">
                                  {attachment.documentType}
                                  {attachment.hasPersonIcon && (
                                    <User className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell className="text-sm">
                                <div className="flex items-center gap-2">
                                  {attachment.description}
                                  {attachment.hasPersonIcon && (
                                    <User className="h-3 w-3 text-muted-foreground" />
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                {attachment.status === 'approved' && (
                                  <CheckCircle2Icon className="h-4 w-4 text-green-600" />
                                )}
                              </TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">View</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination Bottom */}
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {((attachmentsPage - 1) * recordsPerPage) + 1}-{Math.min(attachmentsPage * recordsPerPage, mockAttachments.length)} of {mockAttachments.length} records
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === 1}>
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {[1, 2, 3, 4, 5].map((page) => (
                          <Button
                            key={page}
                            variant={attachmentsPage === page ? "default" : "ghost"}
                            size="sm"
                            className="h-8"
                            onClick={() => setAttachmentsPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === Math.ceil(mockAttachments.length / recordsPerPage)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === Math.ceil(mockAttachments.length / recordsPerPage)}>
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                        <Select value={recordsPerPage.toString()} onValueChange={(value) => setRecordsPerPage(parseInt(value))}>
                          <SelectTrigger className="h-8 w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">Select * For All</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="dealer" className="space-y-6 mt-0">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="include-inactive-dealer"
                      checked={includeInactive}
                      onCheckedChange={(checked) => setIncludeInactive(checked as boolean)}
                    />
                    <Label htmlFor="include-inactive-dealer" className="text-sm font-normal cursor-pointer">
                      Include Inactive Attachments
                    </Label>
                  </div>

                  {/* Dealer Pinned Documents Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">Pinned Documents</h3>
                    
                    {/* Pagination Top */}
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {((pinnedPage - 1) * recordsPerPage) + 1}-{Math.min(pinnedPage * recordsPerPage, mockDealerPinnedDocuments.length)} of {mockDealerPinnedDocuments.length} records
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === 1}>
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant={pinnedPage === 1 ? "default" : "ghost"} size="sm" className="h-8">
                          1
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === Math.ceil(mockDealerPinnedDocuments.length / recordsPerPage)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === Math.ceil(mockDealerPinnedDocuments.length / recordsPerPage)}>
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                        <Select value={recordsPerPage.toString()} onValueChange={(value) => setRecordsPerPage(parseInt(value))}>
                          <SelectTrigger className="h-8 w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">Select * For All</span>
                      </div>
                    </div>

                    {/* Dealer Pinned Documents Table */}
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Pinned to <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Document Type <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Date On File <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockDealerPinnedDocuments.map((doc) => (
                            <TableRow key={doc.id}>
                              <TableCell className="text-sm">{doc.pinnedTo}</TableCell>
                              <TableCell className="text-sm">{doc.documentType}</TableCell>
                              <TableCell className="text-sm">{doc.dateOnFile}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">View</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination Bottom */}
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {((pinnedPage - 1) * recordsPerPage) + 1}-{Math.min(pinnedPage * recordsPerPage, mockDealerPinnedDocuments.length)} of {mockDealerPinnedDocuments.length} records
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === 1}>
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant={pinnedPage === 1 ? "default" : "ghost"} size="sm" className="h-8">
                          1
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === Math.ceil(mockDealerPinnedDocuments.length / recordsPerPage)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={pinnedPage === Math.ceil(mockDealerPinnedDocuments.length / recordsPerPage)}>
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                        <Select value={recordsPerPage.toString()} onValueChange={(value) => setRecordsPerPage(parseInt(value))}>
                          <SelectTrigger className="h-8 w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">Select * For All</span>
                      </div>
                    </div>
                  </div>

                  {/* Dealer Attachments Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-semibold">Attachments</h3>
                    
                    {/* Pagination Top */}
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {((attachmentsPage - 1) * recordsPerPage) + 1}-{Math.min(attachmentsPage * recordsPerPage, mockDealerAttachments.length)} of {mockDealerAttachments.length} records
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === 1}>
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {[1, 2].map((page) => (
                          <Button
                            key={page}
                            variant={attachmentsPage === page ? "default" : "ghost"}
                            size="sm"
                            className="h-8"
                            onClick={() => setAttachmentsPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === Math.ceil(mockDealerAttachments.length / recordsPerPage)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === Math.ceil(mockDealerAttachments.length / recordsPerPage)}>
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                        <Select value={recordsPerPage.toString()} onValueChange={(value) => setRecordsPerPage(parseInt(value))}>
                          <SelectTrigger className="h-8 w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">Select * For All</span>
                      </div>
                    </div>

                    {/* Dealer Attachments Table */}
                    <div className="border rounded-md">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Date Scanned <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Document Type <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead className="cursor-pointer hover:bg-muted/50">
                              Attachment Description <span className="ml-1">^</span>
                            </TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {mockDealerAttachments.map((attachment) => (
                            <TableRow key={attachment.id}>
                              <TableCell className="text-sm">{attachment.dateScanned}</TableCell>
                              <TableCell className="text-sm">{attachment.documentType}</TableCell>
                              <TableCell className="text-sm">{attachment.description}</TableCell>
                              <TableCell>
                                <Button variant="outline" size="sm">View</Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>

                    {/* Pagination Bottom */}
                    <div className="flex items-center justify-between bg-muted/50 px-4 py-2 rounded-md">
                      <div className="text-sm text-muted-foreground">
                        {((attachmentsPage - 1) * recordsPerPage) + 1}-{Math.min(attachmentsPage * recordsPerPage, mockDealerAttachments.length)} of {mockDealerAttachments.length} records
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === 1}>
                          <ChevronsLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === 1}>
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {[1, 2].map((page) => (
                          <Button
                            key={page}
                            variant={attachmentsPage === page ? "default" : "ghost"}
                            size="sm"
                            className="h-8"
                            onClick={() => setAttachmentsPage(page)}
                          >
                            {page}
                          </Button>
                        ))}
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === Math.ceil(mockDealerAttachments.length / recordsPerPage)}>
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" disabled={attachmentsPage === Math.ceil(mockDealerAttachments.length / recordsPerPage)}>
                          <ChevronsRight className="h-4 w-4" />
                        </Button>
                        <Select value={recordsPerPage.toString()} onValueChange={(value) => setRecordsPerPage(parseInt(value))}>
                          <SelectTrigger className="h-8 w-20">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="25">25</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                          </SelectContent>
                        </Select>
                        <span className="text-sm text-muted-foreground">Select * For All</span>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div className="px-6 pb-6 pt-4 border-t">
              <Button onClick={() => setAttachmentsOpen(false)} className="bg-primary hover:bg-primary/90">
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Plan Reviews Dialog */}
        <Dialog open={planReviewsOpen} onOpenChange={setPlanReviewsOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <DialogTitle className="text-lg font-semibold">
                Plan Reviews - {selectedClient ? `${selectedClient.plan.name} Plan ${selectedClient.plan.id}` : 'Plan Reviews'}
              </DialogTitle>
            </DialogHeader>

            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {/* Plan Reviews (History) Section */}
              <div className="space-y-4 mb-6">
                <h3 className="text-base font-semibold">Plan Reviews (History)</h3>
                
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Note From</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Note By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Note</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                          No records found.
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* New Plan Review Section */}
              <div className="space-y-4 border-t pt-6">
                <h3 className="text-base font-semibold">New Plan Review</h3>
                
                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label>Status</Label>
                    <RadioGroup 
                      value={planReviewStatus} 
                      onValueChange={setPlanReviewStatus}
                      className="flex gap-4"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="none" id="status-none" />
                        <Label htmlFor="status-none" className="text-sm font-normal cursor-pointer">No Action</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="approve" id="status-approve" />
                        <Label htmlFor="status-approve" className="text-sm font-normal cursor-pointer">Approve</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="deficient" id="status-deficient" />
                        <Label htmlFor="status-deficient" className="text-sm font-normal cursor-pointer">Deficient</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="note" id="status-note" />
                        <Label htmlFor="status-note" className="text-sm font-normal cursor-pointer">Note</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inquiry" id="status-inquiry" />
                        <Label htmlFor="status-inquiry" className="text-sm font-normal cursor-pointer">Inquiry</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="inquiry-answer" id="status-inquiry-answer" />
                        <Label htmlFor="status-inquiry-answer" className="text-sm font-normal cursor-pointer">Inquiry Answer</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plan-review-notes">Notes</Label>
                    <Textarea
                      id="plan-review-notes"
                      value={planReviewNote}
                      onChange={(e) => setPlanReviewNote(e.target.value)}
                      rows={6}
                      placeholder="Enter notes..."
                      className="resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="send-notification-plan"
                      checked={sendNotification}
                      onCheckedChange={(checked) => setSendNotification(checked as boolean)}
                    />
                    <Label htmlFor="send-notification-plan" className="text-sm font-normal cursor-pointer">
                      Send Notification to Advisor
                    </Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 pb-6 pt-4 border-t flex justify-between">
              <Button 
                onClick={() => setPlanReviewsOpen(false)} 
                variant="outline"
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  // Handle submit logic
                  console.log('Submitting plan review:', { planReviewStatus, planReviewNote, sendNotification });
                  setPlanReviewsOpen(false);
                }} 
                className="bg-green-600 hover:bg-green-700"
              >
                Submit New Plan Review
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </PageLayout>
  );
}
