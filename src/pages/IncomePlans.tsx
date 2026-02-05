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
  TrendingUp,
  Users,
  DollarSign,
  AlertCircle,
  Filter,
  Search,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  User,
} from "lucide-react";

type InstructionStatus = "Payment Scheduled" | "Instructions Required";
type PaymentStatus = "Scheduled" | "Completed";

type IncomePlan = {
  client: {
    name: string;
    id: string;
    description: string;
  };
  plan: {
    number: string;
    description: string;
  };
  representative: {
    number: string;
    name: string;
  };
  minimum: string;
  balanceToMin: string;
  balanceToMinPositive: boolean;
  maximum: string;
  balanceToMax: string;
  balanceToMaxPositive: boolean;
  ytdPaid: string;
  ytdTax: string;
  instructionStatus: InstructionStatus;
  paymentStatus: PaymentStatus;
};

const INCOME_PLANS: IncomePlan[] = [
  {
    client: {
      name: "Carriere, Dora",
      id: "29720",
      description: "Locked in RLIF Broker/Nominee, Individual",
    },
    plan: {
      number: "S108113354",
      description: "RRIF Broker/Nominee, Individual, Fee for Service",
    },
    representative: {
      number: "9823-2232",
      name: "Marsh, Antoine",
    },
    minimum: "$2,992.35",
    balanceToMin: "$1,575.79",
    balanceToMinPositive: true,
    maximum: "$10,000.00",
    balanceToMax: "$7,162.91",
    balanceToMaxPositive: true,
    ytdPaid: "$15,000.00",
    ytdTax: "$3,500.00",
    instructionStatus: "Payment Scheduled",
    paymentStatus: "Scheduled",
  },
  {
    client: {
      name: "Sharma, Melanie",
      id: "29721",
      description: "Locked in RLIF Broker/Nominee, Individual",
    },
    plan: {
      number: "S108113355",
      description: "RRIF Broker/Nominee, Individual, Fee for Service",
    },
    representative: {
      number: "9823-2232",
      name: "Marsh, Antoine",
    },
    minimum: "$1,500.00",
    balanceToMin: "-$77,219.08",
    balanceToMinPositive: false,
    maximum: "$5,000.00",
    balanceToMax: "-$8,185.32",
    balanceToMaxPositive: false,
    ytdPaid: "$18,000.00",
    ytdTax: "$4,200.00",
    instructionStatus: "Instructions Required",
    paymentStatus: "Completed",
  },
  {
    client: {
      name: "Smith, John",
      id: "29722",
      description: "Locked in RLIF Broker/Nominee, Individual",
    },
    plan: {
      number: "S108113356",
      description: "RRIF Broker/Nominee, Individual, Fee for Service",
    },
    representative: {
      number: "9823-2232",
      name: "Marsh, Antoine",
    },
    minimum: "$3,500.00",
    balanceToMin: "$2,833.15",
    balanceToMinPositive: true,
    maximum: "$12,000.00",
    balanceToMax: "$0.00",
    balanceToMaxPositive: true,
    ytdPaid: "$20,157.72",
    ytdTax: "$4,800.00",
    instructionStatus: "Payment Scheduled",
    paymentStatus: "Completed",
  },
  {
    client: {
      name: "Johnson, Robert",
      id: "29723",
      description: "Locked in RLIF Broker/Nominee, Individual",
    },
    plan: {
      number: "S108113357",
      description: "RRIF Broker/Nominee, Individual, Fee for Service",
    },
    representative: {
      number: "9823-2232",
      name: "Marsh, Antoine",
    },
    minimum: "$2,000.00",
    balanceToMin: "$0.00",
    balanceToMinPositive: true,
    maximum: "$8,000.00",
    balanceToMax: "$5,500.00",
    balanceToMaxPositive: true,
    ytdPaid: "$8,000.00",
    ytdTax: "$1,900.00",
    instructionStatus: "Payment Scheduled",
    paymentStatus: "Scheduled",
  },
];

const IncomePlans = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [year, setYear] = useState("2025");
  const [instructionStatus, setInstructionStatus] = useState("All");
  const [paymentStatus, setPaymentStatus] = useState("All");

  const totalPlans = INCOME_PLANS.length;
  const clientsWithPlans = new Set(INCOME_PLANS.map((p) => p.client.id)).size;
  const ytdPaid = INCOME_PLANS.reduce((sum, p) => {
    return sum + parseFloat(p.ytdPaid.replace(/[$,]/g, ""));
  }, 0);
  const actionRequired = INCOME_PLANS.filter(
    (p) => p.instructionStatus === "Instructions Required"
  ).length;

  const filteredPlans = INCOME_PLANS.filter((plan) => {
    const matchesSearch =
      plan.client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.plan.number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      plan.representative.name.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesInstruction =
      instructionStatus === "All" ||
      (instructionStatus === "Payment Scheduled" &&
        plan.instructionStatus === "Payment Scheduled") ||
      (instructionStatus === "Instructions Required" &&
        plan.instructionStatus === "Instructions Required");

    const matchesPayment =
      paymentStatus === "All" ||
      (paymentStatus === "Scheduled" && plan.paymentStatus === "Scheduled") ||
      (paymentStatus === "Completed" && plan.paymentStatus === "Completed");

    return matchesSearch && matchesInstruction && matchesPayment;
  });

  return (
    <PageLayout title="">
      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-4 gap-4">
          {/* Total Income Plans Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-orange-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{totalPlans}</p>
                  <p className="text-xs text-gray-600 mt-1">Income Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Clients With Plans Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Clients</p>
                  <p className="text-2xl font-bold text-gray-900">{clientsWithPlans}</p>
                  <p className="text-xs text-gray-600 mt-1">With Plans</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* YTD Paid Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">YTD Paid</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${ytdPaid.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">To Clients</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Required Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Action</p>
                  <p className="text-2xl font-bold text-gray-900">{actionRequired}</p>
                  <p className="text-xs text-gray-600 mt-1">Instructions Required</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-5 w-5 text-gray-600" />
              <h2 className="text-xl font-bold text-gray-900">Filters & Search</h2>
            </div>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Year:</label>
                <Select value={year} onValueChange={setYear}>
                  <SelectTrigger className="w-[120px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="2025">2025</SelectItem>
                    <SelectItem value="2024">2024</SelectItem>
                    <SelectItem value="2023">2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Client Instruction Status:</label>
                <Select value={instructionStatus} onValueChange={setInstructionStatus}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Payment Scheduled">Payment Scheduled</SelectItem>
                    <SelectItem value="Instructions Required">Instructions Required</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-700">Payment Schedule Status:</label>
                <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                  <SelectTrigger className="w-[180px] h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All</SelectItem>
                    <SelectItem value="Scheduled">Scheduled</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1"></div>

              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Client, plan, or rep..."
                  className="pl-10 bg-gray-50 border-gray-200 rounded-lg"
                />
              </div>

              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Download className="h-4 w-4 mr-2" />
                Export to Excel
              </Button>
            </div>

            {/* Section Search Info */}
            <div className="p-2 bg-orange-50 border border-orange-200 rounded-lg flex items-center gap-2">
              <div className="h-4 w-4 bg-black rounded-full flex items-center justify-center">
                <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
              </div>
              <p className="text-xs text-gray-700">
                Section Search: Filter income plans by client, plan number, or representative. Use
                sidebar for global client search.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Systematic Income Plans Table */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-orange-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Systematic Income Plans ({filteredPlans.length})
              </h2>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-700">Client</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Plan</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">
                      Representative
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Minimum</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">
                      Balance to Min
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Maximum</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">
                      Balance to Max
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">YTD Paid</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">YTD Tax</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">
                      Instruction Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">
                      Payment Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPlans.map((plan, index) => (
                    <TableRow
                      key={plan.plan.number}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell>
                        <div className="text-xs">
                          <p className="font-medium text-gray-900">{plan.client.name}</p>
                          <p className="text-gray-600">ID: {plan.client.id}</p>
                          <p className="text-gray-500 mt-1">{plan.client.description}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-xs">
                          <p className="font-medium text-gray-900">{plan.plan.number}</p>
                          <p className="text-gray-500 mt-1">{plan.plan.description}</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700">
                        {plan.representative.number} {plan.representative.name}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900">{plan.minimum}</TableCell>
                      <TableCell
                        className={`text-xs font-medium ${
                          plan.balanceToMinPositive
                            ? "text-green-600"
                            : plan.balanceToMin.startsWith("-")
                              ? "text-red-600"
                              : "text-gray-900"
                        }`}
                      >
                        {plan.balanceToMin}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900">{plan.maximum}</TableCell>
                      <TableCell
                        className={`text-xs font-medium ${
                          plan.balanceToMaxPositive
                            ? "text-green-600"
                            : plan.balanceToMax.startsWith("-")
                              ? "text-red-600"
                              : "text-gray-900"
                        }`}
                      >
                        {plan.balanceToMax}
                      </TableCell>
                      <TableCell className="text-xs text-gray-900">{plan.ytdPaid}</TableCell>
                      <TableCell className="text-xs text-gray-900">{plan.ytdTax}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            plan.instructionStatus === "Payment Scheduled"
                              ? "bg-green-100 text-green-800 hover:bg-green-100 font-normal px-2 py-0.5 text-xs flex items-center gap-1"
                              : "bg-orange-100 text-orange-800 hover:bg-orange-100 font-normal px-2 py-0.5 text-xs flex items-center gap-1"
                          }
                        >
                          {plan.instructionStatus === "Payment Scheduled" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <AlertCircle className="h-3 w-3" />
                          )}
                          {plan.instructionStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            plan.paymentStatus === "Completed"
                              ? "bg-green-100 text-green-800 hover:bg-green-100 font-normal px-2 py-0.5 text-xs flex items-center gap-1"
                              : "bg-blue-100 text-blue-800 hover:bg-blue-100 font-normal px-2 py-0.5 text-xs flex items-center gap-1"
                          }
                        >
                          {plan.paymentStatus === "Completed" ? (
                            <CheckCircle2 className="h-3 w-3" />
                          ) : (
                            <Clock className="h-3 w-3" />
                          )}
                          {plan.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                          <Eye className="h-3 w-3 text-gray-700" />
                        </Button>
                      </TableCell>
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

export default IncomePlans;

