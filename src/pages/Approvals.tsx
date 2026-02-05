import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
  FileText,
  Clock,
  FileSignature,
  CheckCircle2,
  Search,
  Plus,
  Eye,
  X,
  Calendar,
  User,
} from "lucide-react";

type ApprovalStatus =
  | "pending"
  | "signed"
  | "approved"
  | "pending_signature"
  | "rejected"
  | "expired"
  | "under_review";

type ApprovalType = "approval" | "esignature";

type Approval = {
  startDate: string;
  endDate: string;
  status: ApprovalStatus;
  type: ApprovalType;
  clientName: string;
  clientSurname: string;
  module: string;
};

const APPROVALS: Approval[] = [
  {
    startDate: "2024-09-01",
    endDate: "2024-09-15",
    status: "pending",
    type: "approval",
    clientName: "Johnson",
    clientSurname: "Robert",
    module: "Account Opening",
  },
  {
    startDate: "2024-09-02",
    endDate: "2024-09-16",
    status: "signed",
    type: "esignature",
    clientName: "Wilson",
    clientSurname: "Emma",
    module: "Investment Agreement",
  },
  {
    startDate: "2024-08-30",
    endDate: "2024-09-13",
    status: "approved",
    type: "approval",
    clientName: "Smith",
    clientSurname: "Michael",
    module: "Fund Transfer",
  },
  {
    startDate: "2024-09-03",
    endDate: "2024-09-17",
    status: "pending_signature",
    type: "esignature",
    clientName: "Brown",
    clientSurname: "Sarah",
    module: "KYC Update",
  },
  {
    startDate: "2024-08-28",
    endDate: "2024-09-11",
    status: "rejected",
    type: "approval",
    clientName: "Davis",
    clientSurname: "James",
    module: "Withdrawal Request",
  },
  {
    startDate: "2024-09-04",
    endDate: "2024-09-18",
    status: "expired",
    type: "esignature",
    clientName: "Miller",
    clientSurname: "Lisa",
    module: "Fee Agreement",
  },
  {
    startDate: "2024-09-05",
    endDate: "2024-09-19",
    status: "under_review",
    type: "approval",
    clientName: "Taylor",
    clientSurname: "David",
    module: "Risk Assessment",
  },
  {
    startDate: "2024-09-01",
    endDate: "2024-09-15",
    status: "signed",
    type: "esignature",
    clientName: "Anderson",
    clientSurname: "Jennifer",
    module: "Plan Amendment",
  },
];

const Approvals = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [typeFilter, setTypeFilter] = useState("All Types");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const totalItems = APPROVALS.length;
  const pendingApprovals = APPROVALS.filter(
    (a) => a.status === "pending" && a.type === "approval"
  ).length;
  const pendingSignatures = APPROVALS.filter(
    (a) => a.status === "pending_signature" && a.type === "esignature"
  ).length;
  const completedItems = APPROVALS.filter(
    (a) => a.status === "approved" || a.status === "signed"
  ).length;

  const filteredApprovals = APPROVALS.filter((approval) => {
    const matchesSearch =
      approval.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.clientSurname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.module.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "All Status" ||
      statusFilter.toLowerCase().replace(" ", "_") === approval.status;

    const matchesType =
      typeFilter === "All Types" ||
      typeFilter.toLowerCase() === approval.type;

    const matchesStartDate = !startDate || approval.startDate >= startDate;
    const matchesEndDate = !endDate || approval.endDate <= endDate;

    return matchesSearch && matchesStatus && matchesType && matchesStartDate && matchesEndDate;
  });

  const getStatusBadge = (status: ApprovalStatus) => {
    const statusConfig = {
      pending: {
        className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
        icon: Clock,
        label: "pending",
      },
      signed: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle2,
        label: "signed",
      },
      approved: {
        className: "bg-green-100 text-green-800 hover:bg-green-100",
        icon: CheckCircle2,
        label: "approved",
      },
      pending_signature: {
        className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
        icon: FileSignature,
        label: "pending_signature",
      },
      rejected: {
        className: "bg-red-100 text-red-800 hover:bg-red-100",
        icon: X,
        label: "rejected",
      },
      expired: {
        className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
        icon: X,
        label: "expired",
      },
      under_review: {
        className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
        icon: Clock,
        label: "under_review",
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <Badge className={`${config.className} font-normal px-2 py-0.5 text-xs flex items-center gap-1`}>
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    );
  };

  const getTypeBadge = (type: ApprovalType) => {
    if (type === "approval") {
      return (
        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100 font-normal px-2 py-0.5 text-xs flex items-center gap-1">
          <CheckCircle2 className="h-3 w-3" />
          approval
        </Badge>
      );
    } else {
      return (
        <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100 font-normal px-2 py-0.5 text-xs flex items-center gap-1">
          <FileSignature className="h-3 w-3" />
          esignature
        </Badge>
      );
    }
  };

  const getActionButtons = (approval: Approval) => {
    const needsAction = approval.status === "pending" || approval.status === "pending_signature" || approval.status === "under_review";
    
    return (
      <div className="flex items-center gap-2">
        {needsAction && (
          <>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <CheckCircle2 className="h-3 w-3 text-green-600" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <X className="h-3 w-3 text-red-600" />
            </Button>
          </>
        )}
        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
          <Eye className="h-3 w-3 text-blue-600" />
        </Button>
      </div>
    );
  };

  return (
    <PageLayout title="">
      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {/* Total Items Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <FileText className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{totalItems}</p>
                  <p className="text-xs text-gray-600 mt-1">Items</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Approvals Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingApprovals}</p>
                  <p className="text-xs text-gray-600 mt-1">Approvals</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Pending Signatures Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileSignature className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Signatures</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingSignatures}</p>
                  <p className="text-xs text-gray-600 mt-1">Pending</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Completed Items Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">{completedItems}</p>
                  <p className="text-xs text-gray-600 mt-1">Items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Approval & eSignature Overview Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">
                  Approval & eSignature Overview
                </h2>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Request
              </Button>
            </div>

            {/* Search and Filter Bar */}
            <div className="flex items-center gap-4 mb-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search approvals..."
                  className="pl-10 bg-gray-50 border-gray-200 rounded-lg"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Status">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="signed">Signed</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="pending_signature">Pending Signature</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="under_review">Under Review</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px] h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Types">All Types</SelectItem>
                  <SelectItem value="approval">Approval</SelectItem>
                  <SelectItem value="esignature">eSignature</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="yyyy-mm-dd"
                  className="pl-10 w-[150px] bg-gray-50 border-gray-200 rounded-lg"
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="yyyy-mm-dd"
                  className="pl-10 w-[150px] bg-gray-50 border-gray-200 rounded-lg"
                />
              </div>
            </div>

            {/* Section Search Info */}
            <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <div className="h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
                <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
              </div>
              <p className="text-xs text-gray-700">
                Section Search: Filter approvals and eSignatures by status, type, or date range.
              </p>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-700">
                      START DATE
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">
                      END DATE
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">STATUS</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">TYPE</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">
                      CLIENT NAME
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">
                      CLIENT SURNAME
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">MODULE</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">ACTIONS</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredApprovals.map((approval, index) => (
                    <TableRow
                      key={`${approval.startDate}-${approval.clientName}`}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell className="text-xs text-gray-900">
                        {approval.startDate}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900">{approval.endDate}</TableCell>
                      <TableCell>{getStatusBadge(approval.status)}</TableCell>
                      <TableCell>{getTypeBadge(approval.type)}</TableCell>
                      <TableCell className="text-xs text-gray-900">
                        {approval.clientName}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900">
                        {approval.clientSurname}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900">{approval.module}</TableCell>
                      <TableCell>{getActionButtons(approval)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Approvals;

