import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  BarChart3,
  Layers,
  Circle,
  DollarSign,
  Users,
  UserCheck,
  Settings,
  FileText,
  Clock,
  Search,
  Plus,
  Eye,
  Download,
  User,
} from "lucide-react";

type ReportStatus = "COMPLETED" | "PROCESSING";

type RecentReport = {
  id: string;
  name: string;
  type: string;
  generated: string;
  status: ReportStatus;
  size: string;
};

const RECENT_REPORTS: RecentReport[] = [
  {
    id: "RPT-001",
    name: "Client Portfolio Summary",
    type: "Assets",
    generated: "2024-09-15 10:30 AM",
    status: "COMPLETED",
    size: "2.5 MB",
  },
  {
    id: "RPT-002",
    name: "Monthly Client Activity",
    type: "Client Management",
    generated: "2024-09-14 03:45 PM",
    status: "PROCESSING",
    size: "1.8 MB",
  },
  {
    id: "RPT-003",
    name: "Quarterly Performance Report",
    type: "Client Reporting",
    generated: "2024-09-13 09:15 AM",
    status: "COMPLETED",
    size: "4.2 MB",
  },
];

const REPORT_CATEGORIES = [
  {
    name: "Assets",
    icon: DollarSign,
    iconColor: "text-green-600",
    iconBg: "bg-green-100",
    count: 12,
    examples: ["Portfolio Summary", "Asset Allocation", "Holdings Report"],
    more: 9,
  },
  {
    name: "Client Management",
    icon: Users,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-100",
    count: 8,
    examples: ["Client List", "Contact Information", "Account Details"],
    more: 5,
  },
  {
    name: "Client Reporting",
    icon: UserCheck,
    iconColor: "text-blue-600",
    iconBg: "bg-blue-100",
    count: 10,
    examples: ["Performance Report", "Transaction History", "Statement"],
    more: 7,
  },
  {
    name: "System & Management",
    icon: BarChart3,
    iconColor: "text-orange-600",
    iconBg: "bg-orange-100",
    count: 6,
    examples: ["System Logs", "User Activity", "Audit Trail"],
    more: 3,
  },
  {
    name: "Client Lists",
    icon: FileText,
    iconColor: "text-indigo-600",
    iconBg: "bg-indigo-100",
    count: 3,
    examples: ["Active Clients", "Inactive Clients"],
    more: 1,
  },
];

const Reports = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const totalReportTypes = 39;
  const totalCategories = REPORT_CATEGORIES.length;
  const recentCompleted = RECENT_REPORTS.filter((r) => r.status === "COMPLETED").length;

  const filteredCategories = REPORT_CATEGORIES.filter(
    (category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      category.examples.some((ex) =>
        ex.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  return (
    <PageLayout title="">
      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Total Report Types Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{totalReportTypes}</p>
                  <p className="text-xs text-gray-600 mt-1">Report Types</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Available Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Layers className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Categories</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCategories}</p>
                  <p className="text-xs text-gray-600 mt-1">Available</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Completed Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-pink-100 rounded-lg">
                  <Circle className="h-5 w-5 text-pink-600 fill-pink-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Recent</p>
                  <p className="text-2xl font-bold text-gray-900">{recentCompleted}</p>
                  <p className="text-xs text-gray-600 mt-1">Completed</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Categories Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-green-600" />
                <h2 className="text-xl font-bold text-gray-900">Report Categories</h2>
              </div>
              <Button className="bg-green-600 hover:bg-green-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Schedule Report
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search reports by name or description..."
                className="pl-10 bg-gray-50 border-gray-200 rounded-lg"
              />
            </div>

            {/* Section Search Info */}
            <div className="mb-4 p-2 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
              <div className="h-4 w-4 bg-green-600 rounded-full flex items-center justify-center">
                <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
              </div>
              <p className="text-xs text-gray-700">
                Section Search: Find reports by name or description. Use sidebar for global client
                search.
              </p>
            </div>

            {/* Category Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <Card
                    key={category.name}
                    className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3 mb-3">
                        <div className={`p-2 ${category.iconBg} rounded-lg`}>
                          <Icon className={`h-5 w-5 ${category.iconColor}`} />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-gray-900 mb-1">
                            {category.name}
                          </h3>
                          <p className="text-xs text-gray-600">
                            {category.count} reports available
                          </p>
                        </div>
                      </div>
                      <div className="space-y-1">
                        {category.examples.map((example, idx) => (
                          <p key={idx} className="text-xs text-gray-600">
                            • {example}
                          </p>
                        ))}
                        {category.more > 0 && (
                          <p className="text-xs text-gray-500 font-medium">
                            +{category.more} more...
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">Recent Reports</h2>
            </div>

            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-700">
                      Report ID
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Name</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Type</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Generated</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Size</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {RECENT_REPORTS.map((report, index) => (
                    <TableRow
                      key={report.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell className="text-xs text-gray-900">{report.id}</TableCell>
                      <TableCell className="text-xs text-gray-900 font-medium">
                        {report.name}
                      </TableCell>
                      <TableCell className="text-xs text-gray-700">{report.type}</TableCell>
                      <TableCell className="text-xs text-gray-700">{report.generated}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            report.status === "COMPLETED"
                              ? "bg-green-600 text-white hover:bg-green-600 font-normal px-2 py-0.5 text-xs"
                              : "bg-yellow-500 text-white hover:bg-yellow-500 font-normal px-2 py-0.5 text-xs"
                          }
                        >
                          {report.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-xs text-gray-700">{report.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Eye className="h-3 w-3 text-gray-700" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Download className="h-3 w-3 text-gray-700" />
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
    </PageLayout>
  );
};

export default Reports;

