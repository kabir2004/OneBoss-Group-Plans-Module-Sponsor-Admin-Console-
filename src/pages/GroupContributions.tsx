import { useState, useMemo } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
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
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CLIENTS } from "@/pages/Clients";
import { Search, Landmark, Eye, EyeOff } from "lucide-react";

const PLAN_TYPES = ["Group RRSP", "TFSA", "DPSP"] as const;
type PlanType = (typeof PLAN_TYPES)[number];

// Mock EFT details per plan type (one bank account per plan)
const EFT_BY_PLAN: Record<PlanType, { accountNumber: string; institution: string; transitNumber: string }> = {
  "Group RRSP": { accountNumber: "1002-451-9876543", institution: "RBC Royal Bank", transitNumber: "00102" },
  "TFSA": { accountNumber: "1002-451-9876544", institution: "RBC Royal Bank", transitNumber: "00102" },
  "DPSP": { accountNumber: "1002-451-9876545", institution: "RBC Royal Bank", transitNumber: "00102" },
};

function parseName(fullName: string): { surname: string; name: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length <= 1) return { surname: parts[0] ?? "", name: "" };
  const surname = parts[parts.length - 1] ?? "";
  const name = parts.slice(0, -1).join(" ");
  return { surname, name };
}

// Default formula-derived contribution (mock). Ad hoc override stored in state.
function defaultContribution(clientId: string): number {
  const n = parseInt(clientId.replace(/\D/g, ""), 10) || 1;
  return [200, 350, 400, 275, 500, 150, 325, 450, 380, 220][n % 10] ?? 300;
}

function defaultCompanyContribution(clientId: string): number {
  const n = parseInt(clientId.replace(/\D/g, ""), 10) || 1;
  return [100, 175, 200, 140, 250, 75, 165, 225, 190, 110][n % 10] ?? 150;
}

const GroupContributions = () => {
  const [planType, setPlanType] = useState<PlanType>("Group RRSP");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "Active" | "Inactive" | "Prospect">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  // Ad hoc overrides: member id -> contribution amount (number or null = use formula)
  const [contributionOverrides, setContributionOverrides] = useState<Record<string, string>>({});
  const [processingDate, setProcessingDate] = useState(() =>
    new Date().toISOString().slice(0, 10)
  );
  const [eftDetailsVisible, setEftDetailsVisible] = useState(false);

  const eft = EFT_BY_PLAN[planType];

  const maskAccountNumber = (s: string) => {
    const digits = s.replace(/\D/g, "");
    if (digits.length <= 4) return "****";
    return "****-***-" + digits.slice(-4);
  };
  const maskTransitNumber = (s: string) => s.replace(/\d/g, "*");

  const onProcessingDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v) setProcessingDate(v);
  };

  const rows = useMemo(() => {
    return CLIENTS.filter((c) => {
      if (statusFilter !== "all" && c.status !== statusFilter) return false;
      if (!searchTerm.trim()) return true;
      const { surname, name } = parseName(c.name);
      const term = searchTerm.toLowerCase();
      return (
        c.name.toLowerCase().includes(term) ||
        surname.toLowerCase().includes(term) ||
        name.toLowerCase().includes(term) ||
        c.accountNumber.toLowerCase().includes(term)
      );
    }).map((c) => {
      const { surname, name } = parseName(c.name);
      const contributionAmount = contributionOverrides[c.id] !== undefined && contributionOverrides[c.id] !== ""
        ? parseFloat(contributionOverrides[c.id]) || 0
        : defaultContribution(c.id);
      const companyContribution = defaultCompanyContribution(c.id);
      const totalContribution = contributionAmount + companyContribution;
      return {
        id: c.id,
        groupPlan: planType,
        surname,
        name,
        contributionAmount,
        companyContribution,
        totalContribution,
        processingDate,
      };
    });
  }, [planType, searchTerm, statusFilter, contributionOverrides, processingDate]);

  const totalGroupContribution = useMemo(
    () => rows.reduce((sum, r) => sum + r.totalContribution, 0),
    [rows]
  );

  const allRowIds = useMemo(() => rows.map((r) => r.id), [rows]);
  const allSelected = allRowIds.length > 0 && allRowIds.every((id) => selectedIds.has(id));

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(allRowIds));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const setOverride = (memberId: string, value: string) => {
    setContributionOverrides((prev) => {
      const next = { ...prev };
      if (value === "" || value === undefined) delete next[memberId];
      else next[memberId] = value;
      return next;
    });
  };

  const formatCurrency = (n: number) =>
    new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD", minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

  return (
    <PageLayout title="Group Contributions">
      <div className="w-full min-w-0 flex flex-col gap-4">
        {/* Plan type + EFT side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 w-full min-w-0">
          <Card className="border border-gray-200 shadow-sm min-w-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Select plan type</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap items-end gap-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Plan type</label>
                <Select value={planType} onValueChange={(v) => setPlanType(v as PlanType)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Plan type" />
                  </SelectTrigger>
                  <SelectContent>
                    {PLAN_TYPES.map((p) => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Processing date</label>
                <Input
                  type="date"
                  value={processingDate}
                  onChange={onProcessingDateChange}
                  className="w-[160px]"
                />
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm min-w-0">
            <CardHeader className="pb-2 flex flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <Landmark className="h-4 w-4 text-gray-600 shrink-0" />
                <CardTitle className="text-base">EFT details for {planType}</CardTitle>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-gray-600 hover:text-gray-900"
                onClick={() => setEftDetailsVisible((v) => !v)}
                aria-label={eftDetailsVisible ? "Hide account and transit numbers" : "Show account and transit numbers"}
              >
                {eftDetailsVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Account number</p>
                  <p className="font-medium text-gray-900 tabular-nums">
                    {eftDetailsVisible ? eft.accountNumber : maskAccountNumber(eft.accountNumber)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Institution</p>
                  <p className="font-medium text-gray-900">{eft.institution}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Transit number</p>
                  <p className="font-medium text-gray-900 tabular-nums">
                    {eftDetailsVisible ? eft.transitNumber : maskTransitNumber(eft.transitNumber)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and filter */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search by name or employee ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All members</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Prospect">Prospect</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Members table */}
        <Card className="border border-gray-200 shadow-sm w-full min-w-0">
          <CardContent className="p-0">
            <div className="overflow-x-auto border border-gray-200 rounded-md">
              <Table className="w-full min-w-[800px]" style={{ tableLayout: "fixed" }}>
                <colgroup>
                  <col style={{ width: "40px" }} />
                  <col style={{ width: "100px" }} />
                  <col style={{ width: "100px" }} />
                  <col style={{ width: "120px" }} />
                  <col style={{ width: "140px" }} />
                  <col style={{ width: "150px" }} />
                  <col style={{ width: "150px" }} />
                  <col style={{ width: "120px" }} />
                </colgroup>
                <TableHeader>
                  <TableRow className="bg-gray-50 border-b border-gray-200">
                    <TableHead className="px-2 text-left font-semibold text-gray-700 h-10">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={toggleSelectAll}
                        aria-label="Select all"
                      />
                    </TableHead>
                    <TableHead className="px-3 text-left font-semibold text-gray-700 whitespace-nowrap">Group Plan</TableHead>
                    <TableHead className="px-3 text-left font-semibold text-gray-700 whitespace-nowrap">Surname</TableHead>
                    <TableHead className="px-3 text-left font-semibold text-gray-700 whitespace-nowrap">Name</TableHead>
                    <TableHead className="px-3 text-center font-semibold text-gray-700 whitespace-nowrap" title="Editable (ad hoc)">Contribution Amount</TableHead>
                    <TableHead className="px-3 text-center font-semibold text-gray-700 whitespace-nowrap">Company Contribution</TableHead>
                    <TableHead className="px-3 text-center font-semibold text-gray-700 whitespace-nowrap">Total Contribution</TableHead>
                    <TableHead className="px-3 text-center font-semibold text-gray-700 whitespace-nowrap">Processing Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                      <TableCell className="px-2 py-2 align-middle">
                        <Checkbox
                          checked={selectedIds.has(row.id)}
                          onCheckedChange={() => toggleSelect(row.id)}
                          aria-label={`Select ${row.name} ${row.surname}`}
                        />
                      </TableCell>
                      <TableCell className="px-3 py-2 text-gray-900 align-middle whitespace-nowrap">{row.groupPlan}</TableCell>
                      <TableCell className="px-3 py-2 text-gray-900 align-middle whitespace-nowrap">{row.surname}</TableCell>
                      <TableCell className="px-3 py-2 text-gray-900 align-middle whitespace-nowrap">{row.name}</TableCell>
                      <TableCell className="px-3 py-2 align-middle">
                        <div className="flex justify-center">
                          <Input
                            type="number"
                            min={0}
                            step={1}
                            className="h-8 w-[72px] text-center text-sm tabular-nums"
                            value={
                              contributionOverrides[row.id] !== undefined
                                ? contributionOverrides[row.id]
                                : String(row.contributionAmount)
                            }
                            onChange={(e) => setOverride(row.id, e.target.value)}
                            placeholder="0"
                          />
                        </div>
                      </TableCell>
                      <TableCell className="px-3 py-2 text-center text-gray-700 align-middle whitespace-nowrap tabular-nums font-mono text-sm">{formatCurrency(row.companyContribution)}</TableCell>
                      <TableCell className="px-3 py-2 text-center font-medium text-gray-900 align-middle whitespace-nowrap tabular-nums font-mono text-sm">{formatCurrency(row.totalContribution)}</TableCell>
                      <TableCell className="px-3 py-2 text-center text-gray-700 align-middle whitespace-nowrap tabular-nums">{row.processingDate}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <TableFooter>
                  <TableRow className="bg-gray-100 border-t-2 border-gray-200 font-semibold">
                    <TableCell colSpan={6} className="px-3 py-3 text-right text-gray-700 align-middle whitespace-nowrap">
                      Total Group Contribution
                    </TableCell>
                    <TableCell className="px-3 py-3 text-center text-gray-900 align-middle whitespace-nowrap tabular-nums font-mono text-sm">
                      {formatCurrency(totalGroupContribution)}
                    </TableCell>
                    <TableCell className="px-3 py-3" />
                  </TableRow>
                </TableFooter>
              </Table>
            </div>
            {rows.length === 0 && (
              <div className="py-8 text-center text-gray-500 text-sm">
                No members match the current search or filter.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default GroupContributions;
