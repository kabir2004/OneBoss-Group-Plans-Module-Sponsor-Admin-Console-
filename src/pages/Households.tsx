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
  Users,
  DollarSign,
  Home,
  Plus,
  Search,
  Pencil,
  Trash2,
  User,
} from "lucide-react";

type HouseholdStatus = "ACTIVE" | "PENDING REVIEW";

type Household = {
  id: string;
  name: string;
  primaryClient: string;
  members: number;
  totalAssets: string;
  accounts: number;
  status: HouseholdStatus;
};

const HOUSEHOLDS: Household[] = [
  {
    id: "HH001",
    name: "Johnson Family",
    primaryClient: "Robert Johnson",
    members: 3,
    totalAssets: "$750,000",
    accounts: 4,
    status: "ACTIVE",
  },
  {
    id: "HH002",
    name: "Smith Household",
    primaryClient: "Michael Smith",
    members: 2,
    totalAssets: "$425,000",
    accounts: 2,
    status: "ACTIVE",
  },
  {
    id: "HH003",
    name: "Williams Trust",
    primaryClient: "David Williams",
    members: 4,
    totalAssets: "$1,250,000",
    accounts: 6,
    status: "ACTIVE",
  },
  {
    id: "HH004",
    name: "Brown Estate",
    primaryClient: "Patricia Brown",
    members: 1,
    totalAssets: "$180,000",
    accounts: 1,
    status: "PENDING REVIEW",
  },
];

const Households = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const totalHouseholds = HOUSEHOLDS.length;
  const activeHouseholds = HOUSEHOLDS.filter((h) => h.status === "ACTIVE").length;
  const totalAssets = HOUSEHOLDS.reduce((sum, h) => {
    const value = parseFloat(h.totalAssets.replace(/[$,]/g, ""));
    return sum + value;
  }, 0);

  const filteredHouseholds = HOUSEHOLDS.filter(
    (household) =>
      household.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      household.primaryClient.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout title="">
      <div className="space-y-6">

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {/* Total Households Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-200 rounded-lg">
                  <Users className="h-5 w-5 text-gray-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{totalHouseholds}</p>
                  <p className="text-xs text-gray-600 mt-1">Households</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Active Households Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-full">
                  <div className="h-3 w-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Active</p>
                  <p className="text-2xl font-bold text-gray-900">{activeHouseholds}</p>
                  <p className="text-xs text-gray-600 mt-1">Households</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Total Assets Card */}
          <Card className="border border-gray-200 shadow-sm bg-gray-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <DollarSign className="h-5 w-5 text-purple-600" />
                </div>
                <div className="flex-1">
                  <p className="text-xs text-gray-600 mb-1">Assets</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${totalAssets.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">Total Value</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Households Overview Section */}
        <Card className="border border-gray-200 shadow-sm">
          <CardContent className="p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Home className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-bold text-gray-900">Households Overview</h2>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                <Plus className="h-4 w-4 mr-2" />
                New Household
              </Button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search households by name, ID, or primary client..."
                className="pl-10 bg-gray-50 border-gray-200 rounded-lg"
              />
            </div>

            {/* Section Search Info */}
            <div className="mb-4 p-2 bg-gray-100 border border-gray-200 rounded-lg flex items-center gap-2">
              <div className="h-4 w-4 bg-black rounded-full flex items-center justify-center">
                <div className="h-1.5 w-1.5 bg-white rounded-full"></div>
              </div>
              <p className="text-xs text-gray-700">
                Section Search: Find households by name, ID, or primary client. Use sidebar for
                global client search.
              </p>
            </div>

            {/* Table */}
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-700">
                      Household ID
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Name</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">
                      Primary Client
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Members</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">
                      Total Assets
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Accounts</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Status</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredHouseholds.map((household, index) => (
                    <TableRow
                      key={household.id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <TableCell className="text-xs text-gray-900">{household.id}</TableCell>
                      <TableCell className="text-xs text-gray-900 font-medium">
                        {household.name}
                      </TableCell>
                      <TableCell className="text-xs text-gray-700">
                        {household.primaryClient}
                      </TableCell>
                      <TableCell className="text-xs text-gray-700">
                        {household.members} {household.members === 1 ? "member" : "members"}
                      </TableCell>
                      <TableCell className="text-xs font-bold text-gray-900">
                        {household.totalAssets}
                      </TableCell>
                      <TableCell className="text-xs text-gray-700">
                        {household.accounts} {household.accounts === 1 ? "account" : "accounts"}
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={
                            household.status === "ACTIVE"
                              ? "bg-green-100 text-green-800 hover:bg-green-100 font-normal px-2 py-0.5 text-xs"
                              : "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 font-normal px-2 py-0.5 text-xs"
                          }
                        >
                          {household.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Pencil className="h-3 w-3 text-gray-700" />
                          </Button>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                            <Trash2 className="h-3 w-3 text-red-600" />
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

export default Households;

