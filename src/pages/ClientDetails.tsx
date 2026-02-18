import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { CLIENTS } from "./Clients";
import { ArrowLeft, Phone } from "lucide-react";

function PlanPill({ plan }: { plan: GroupPlanType }) {
  const styles: Record<GroupPlanType, string> = {
    RRSP: "bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-100",
    TFSA: "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-100",
    DPSP: "bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100",
  };
  return (
    <Badge variant="outline" className={cn("font-semibold border", styles[plan])}>
      {plan}
    </Badge>
  );
}

// Mock: extend client with DOB and salary (in a real app these would come from API)
const getClientTombstone = (clientId: string) => {
  const defaults: Record<string, { dateOfBirth: string; companySalary: string }> = {
    CL001: { dateOfBirth: "1985-03-12", companySalary: "$72,500" },
    CL002: { dateOfBirth: "1990-07-22", companySalary: "$68,000" },
    CL005: { dateOfBirth: "1978-11-05", companySalary: "$95,000" },
    CL006: { dateOfBirth: "1982-01-18", companySalary: "$61,200" },
    CL007: { dateOfBirth: "1992-09-30", companySalary: "$54,000" },
    CL008: { dateOfBirth: "1988-04-25", companySalary: "$78,400" },
    CL009: { dateOfBirth: "1975-12-08", companySalary: "$112,000" },
    CL011: { dateOfBirth: "1980-06-14", companySalary: "$88,000" },
    CL012: { dateOfBirth: "1991-02-28", companySalary: "$65,000" },
    CL013: { dateOfBirth: "1987-10-11", companySalary: "$71,000" },
    CL014: { dateOfBirth: "1984-08-03", companySalary: "$125,000" },
    CL015: { dateOfBirth: "1993-05-19", companySalary: "$52,000" },
    CL016: { dateOfBirth: "1979-07-07", companySalary: "$82,000" },
    CL017: { dateOfBirth: "1986-03-21", companySalary: "$58,500" },
    CL018: { dateOfBirth: "1981-11-16", companySalary: "$98,000" },
    CL019: { dateOfBirth: "1994-01-09", companySalary: "$48,000" },
    CL020: { dateOfBirth: "1989-12-02", companySalary: "$76,000" },
  };
  return defaults[clientId] ?? { dateOfBirth: "—", companySalary: "—" };
};

type GroupPlanType = "RRSP" | "TFSA" | "DPSP";

interface GroupPlanRow {
  plan: GroupPlanType;
  currentValue: string;
  nextContributionDate: string;
  employeeContribution: string;
  companyMatching: string;
}

// Mock: group plans per member (in a real app from API)
const getMemberGroupPlans = (clientId: string): GroupPlanRow[] => {
  const seed = clientId.replace(/\D/g, "") || "1";
  const n = parseInt(seed, 10) % 5;
  const base = (n + 1) * 10000;
  return [
    { plan: "RRSP", currentValue: `$${(base * 2.5).toLocaleString("en-CA", { minimumFractionDigits: 2 })}`, nextContributionDate: "2025-03-15", employeeContribution: "$400", companyMatching: "$200" },
    { plan: "TFSA", currentValue: `$${(base * 1.2).toLocaleString("en-CA", { minimumFractionDigits: 2 })}`, nextContributionDate: "2025-03-01", employeeContribution: "$200", companyMatching: "—" },
    { plan: "DPSP", currentValue: `$${(base * 0.8).toLocaleString("en-CA", { minimumFractionDigits: 2 })}`, nextContributionDate: "2025-03-15", employeeContribution: "—", companyMatching: "$150" },
  ];
};

const MATCHING_FORMULAS = [
  "50% of employee contribution, up to 4% of salary",
  "100% of employee contribution, up to 3% of salary",
  "Dollar-for-dollar up to $2,000",
  "50% match on first 6% deferred",
  "25% of employee contribution, up to 5% of salary",
];

const ClientDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [matchingFormula, setMatchingFormula] = useState(MATCHING_FORMULAS[0]);
  const [contactAdvisorOpen, setContactAdvisorOpen] = useState(false);

  const client = CLIENTS.find((c) => c.id === id);
  if (!client) {
    return (
      <PageLayout title="">
        <div className="text-center py-12">
          <p className="text-gray-500">Plan member not found</p>
          <Button onClick={() => navigate("/plan-members")} className="mt-4">
            Back to Plan Members
          </Button>
        </div>
      </PageLayout>
    );
  }

  const { dateOfBirth, companySalary } = getClientTombstone(client.id);
  const groupPlans = getMemberGroupPlans(client.id);
  const formattedDob = dateOfBirth !== "—" ? new Date(dateOfBirth).toLocaleDateString("en-CA", { year: "numeric", month: "long", day: "numeric" }) : "—";

  return (
    <PageLayout title="">
      <div className="w-full min-w-0 flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" className="shrink-0" onClick={() => navigate("/plan-members")} aria-label="Back to Plan Members">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold text-gray-900 truncate">Plan Member Details</h1>
          </div>
          <Button onClick={() => setContactAdvisorOpen(true)} className="gap-2 shrink-0">
            <Phone className="h-4 w-4" />
            Contact Advisor
          </Button>
        </div>

        {/* Top row: Member info + Matching formula side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full min-w-0">
          <Card className="border border-gray-200 shadow-sm min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Member information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Name</p>
                  <p className="font-medium text-gray-900 truncate" title={client.name}>{client.name}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Date of birth</p>
                  <p className="font-medium text-gray-900">{formattedDob}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Employee ID</p>
                  <p className="font-medium text-gray-900">{client.accountNumber}</p>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Company salary</p>
                  <p className="font-medium text-gray-900">{companySalary}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Matching formula</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={matchingFormula} onValueChange={setMatchingFormula}>
                <SelectTrigger className="w-full min-w-0">
                  <SelectValue placeholder="Select formula" />
                </SelectTrigger>
                <SelectContent>
                  {MATCHING_FORMULAS.map((formula) => (
                    <SelectItem key={formula} value={formula}>
                      {formula}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>
        </div>

        {/* Group plans: full width */}
        <Card className="border border-gray-200 shadow-sm w-full min-w-0 flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Group plans</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Current value</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Next contribution date</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Employee contribution</th>
                    <th className="text-right py-3 px-4 font-medium text-gray-700">Company matching</th>
                  </tr>
                </thead>
                <tbody>
                  {groupPlans.map((row) => (
                    <tr key={row.plan} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <td className="py-3 px-4"><PlanPill plan={row.plan} /></td>
                      <td className="py-3 px-4 text-right text-gray-700">{row.currentValue}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{row.nextContributionDate}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{row.employeeContribution}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{row.companyMatching}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={contactAdvisorOpen} onOpenChange={setContactAdvisorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Contact Advisor</DialogTitle>
          </DialogHeader>
          <p className="text-gray-600">Notifying advisor to contact this Plan Member.</p>
          <DialogFooter>
            <Button onClick={() => setContactAdvisorOpen(false)}>OK</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default ClientDetails;
