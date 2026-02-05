import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DollarSign,
  Users,
  BarChart3,
  Clock,
  Plus,
  Download,
  CheckCircle2,
  AlertCircle,
  Eye,
  Pencil,
} from 'lucide-react';

interface Deposit {
  id: string;
  date: string;
  clientId: string;
  clientName: string;
  amount: number;
  currency: 'CAD' | 'USD';
  status: 'Settled' | 'Pending' | 'Unsettled';
  bank: string;
}

const deposits: Deposit[] = [
  {
    id: 'D001',
    date: '2025-01-15',
    clientId: 'CL001',
    clientName: 'John Smith',
    amount: 4000.00,
    currency: 'CAD',
    status: 'Settled',
    bank: 'CIBC',
  },
  {
    id: 'D002',
    date: '2025-01-14',
    clientId: 'CL002',
    clientName: 'Sarah Johnson',
    amount: 2500.00,
    currency: 'USD',
    status: 'Pending',
    bank: 'RBC',
  },
  {
    id: 'D003',
    date: '2025-01-13',
    clientId: 'CL003',
    clientName: 'Michael Brown',
    amount: 5500.00,
    currency: 'CAD',
    status: 'Settled',
    bank: 'TD',
  },
  {
    id: 'D004',
    date: '2025-01-12',
    clientId: 'CL004',
    clientName: 'Emily Davis',
    amount: 3200.00,
    currency: 'CAD',
    status: 'Unsettled',
    bank: 'BMO',
  },
  {
    id: 'D005',
    date: '2025-01-11',
    clientId: 'CL005',
    clientName: 'David Wilson',
    amount: 1800.00,
    currency: 'USD',
    status: 'Settled',
    bank: 'Scotia',
  },
];

const formatCurrency = (amount: number, currency: 'CAD' | 'USD') => {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Settled':
      return (
        <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Settled
        </Badge>
      );
    case 'Pending':
      return (
        <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>
      );
    case 'Unsettled':
      return (
        <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
          <AlertCircle className="h-3 w-3 mr-1" />
          Unsettled
        </Badge>
      );
    default:
      return null;
  }
};

export default function TrustDeposits() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currencyFilter, setCurrencyFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [timeFilter, setTimeFilter] = useState<string>('all');

  const filteredDeposits = deposits.filter((deposit) => {
    // Search filter
    const matchesSearch = 
      deposit.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.date.includes(searchTerm) ||
      deposit.bank.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.amount.toString().includes(searchTerm);

    // Currency filter
    const matchesCurrency = currencyFilter === 'all' || deposit.currency === currencyFilter;

    // Status filter
    const matchesStatus = statusFilter === 'all' || deposit.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesCurrency && matchesStatus;
  });

  const totalDeposits = 1250000.00;
  const activeTrusts = 57;
  const avgDepositSize = 10500.00;
  const recentDeposits = 24;

  const cadBalance = 1250.00;
  const cadSettled = 1250.00;
  const cadUnsettled = 0.00;

  const usdBalance = 0.00;
  const usdSettled = 0.00;
  const usdUnsettled = 0.00;

  return (
    <PageLayout title="">
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search deposits by client name, ID, date, amount, or status..."
            className="w-full lg:flex-1 lg:max-w-2xl"
          />
          <div className="flex items-center gap-3">
            <Select value={currencyFilter} onValueChange={setCurrencyFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Currency</SelectItem>
                <SelectItem value="CAD">CAD</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="settled">Settled</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="unsettled">Unsettled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={timeFilter} onValueChange={setTimeFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Time</SelectItem>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <CardDescription className="text-gray-500 text-xs uppercase tracking-wide">
                  Total Trust Deposits
                </CardDescription>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {formatCurrency(totalDeposits, 'CAD')}
                </CardTitle>
              </div>
              <div className="bg-blue-100 text-blue-600 p-3 rounded-lg">
                <DollarSign className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <CardDescription className="text-gray-500 text-xs uppercase tracking-wide">
                  Active Trusts
                </CardDescription>
                <CardTitle className="text-xl font-semibold text-gray-900">{activeTrusts}</CardTitle>
              </div>
              <div className="bg-green-100 text-green-600 p-3 rounded-lg">
                <Users className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <CardDescription className="text-gray-500 text-xs uppercase tracking-wide">
                  Avg Deposit Size
                </CardDescription>
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {formatCurrency(avgDepositSize, 'CAD')}
                </CardTitle>
              </div>
              <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                <BarChart3 className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="flex items-center justify-between py-4">
              <div className="space-y-1">
                <CardDescription className="text-gray-500 text-xs uppercase tracking-wide">
                  Recent Deposits
                </CardDescription>
                <CardTitle className="text-xl font-semibold text-gray-900">{recentDeposits}</CardTitle>
              </div>
              <div className="bg-orange-100 text-orange-600 p-3 rounded-lg">
                <Clock className="h-5 w-5" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Trust Account Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* CAD Trust Account */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900">
                $ Trust Account CAD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              <div>
                <CardDescription className="text-xs text-gray-500 mb-0.5">Current Balance</CardDescription>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {formatCurrency(cadBalance, 'CAD')}
                </CardTitle>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-green-50 border border-green-200">
                  <CardDescription className="text-xs text-gray-600 mb-0.5">Settled</CardDescription>
                  <CardTitle className="text-sm font-semibold text-green-700">
                    {formatCurrency(cadSettled, 'CAD')}
                  </CardTitle>
                </div>
                <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                  <CardDescription className="text-xs text-gray-600 mb-0.5">Unsettled</CardDescription>
                  <CardTitle className="text-sm font-semibold text-red-700">
                    {formatCurrency(cadUnsettled, 'CAD')}
                  </CardTitle>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5">
                <Plus className="h-3 w-3 mr-1.5" />
                Deposit
              </Button>
            </CardContent>
          </Card>

          {/* USD Trust Account */}
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-semibold text-gray-900">
                $ Trust Account USD
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pt-2">
              <div>
                <CardDescription className="text-xs text-gray-500 mb-0.5">Current Balance</CardDescription>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {formatCurrency(usdBalance, 'USD')}
                </CardTitle>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2 rounded-lg bg-green-50 border border-green-200">
                  <CardDescription className="text-xs text-gray-600 mb-0.5">Settled</CardDescription>
                  <CardTitle className="text-sm font-semibold text-green-700">
                    {formatCurrency(usdSettled, 'USD')}
                  </CardTitle>
                </div>
                <div className="p-2 rounded-lg bg-red-50 border border-red-200">
                  <CardDescription className="text-xs text-gray-600 mb-0.5">Unsettled</CardDescription>
                  <CardTitle className="text-sm font-semibold text-red-700">
                    {formatCurrency(usdUnsettled, 'USD')}
                  </CardTitle>
                </div>
              </div>
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm py-1.5">
                <Plus className="h-3 w-3 mr-1.5" />
                Deposit
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Deposits History */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold text-gray-900">
                Deposits History
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1.5" />
                  Export CSV
                </Button>
                <Button variant="outline" size="sm" className="text-xs">
                  <Download className="h-3 w-3 mr-1.5" />
                  Export PDF
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs font-semibold text-gray-700">Date</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700">Client</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700">Amount</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700">Currency</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700">Status</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700">Bank</TableHead>
                  <TableHead className="text-xs font-semibold text-gray-700">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDeposits.map((deposit) => (
                  <TableRow key={deposit.id}>
                    <TableCell className="text-sm text-gray-900">{deposit.date}</TableCell>
                    <TableCell className="text-sm text-gray-900">
                      {deposit.clientId}, {deposit.clientName}
                    </TableCell>
                    <TableCell className="text-sm font-medium text-gray-900">
                      {formatCurrency(deposit.amount, deposit.currency)}
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{deposit.currency}</TableCell>
                    <TableCell>{getStatusBadge(deposit.status)}</TableCell>
                    <TableCell className="text-sm text-gray-600">{deposit.bank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          View
                        </button>
                        <button className="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                          <Pencil className="h-3 w-3" />
                          Edit
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}

