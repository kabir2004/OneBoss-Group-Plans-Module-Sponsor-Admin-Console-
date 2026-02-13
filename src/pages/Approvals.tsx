import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { useRolePermissions } from "@/context/RolePermissionsContext";
import { usePendingMemberChanges } from "@/context/PendingMemberChangesContext";
import { useRepresentativesSearch } from "@/context/RepresentativesSearchContext";
import type { PendingChange, ProposedMemberEdits } from "@/context/PendingMemberChangesContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  Clock,
  X,
  Eye,
  User,
  FileEdit,
  ArrowRight,
  Users,
  AlertCircle,
  ExternalLink,
} from "lucide-react";
import { CLIENTS } from "@/pages/Clients";
import { getRepresentativeDetails } from "@/data/representativeDetails";
import type { RepDetails } from "@/data/representativeDetails";

/** Human-readable label for submitter role. */
function getSubmitterLabel(role: PendingChange["submittedByRole"]): string {
  switch (role) {
    case "admin":
      return "Administrator";
    case "admin-assistant":
      return "Administrator Assistant";
    case "super-admin":
      return "Super Administrator";
    default:
      return "Unknown";
  }
}

/** Build diff rows (label, current, proposed) for display. */
function buildDiffRows(
  current: RepDetails,
  proposed: ProposedMemberEdits
): { label: string; current: string; proposed: string }[] {
  const rows: { label: string; current: string; proposed: string }[] = [];
  const push = (label: string, curr: string | undefined, prop: string | undefined) => {
    if (prop === undefined) return;
    rows.push({ label, current: curr ?? "—", proposed: prop ?? "—" });
  };
  push("Surname", current.surname, proposed.surname);
  push("Name", current.name, proposed.name);
  push("Date of birth", current.dateOfBirth, proposed.dateOfBirth);
  push("Business Name", current.businessName, proposed.businessName);
  push("Start Date", current.startDate, proposed.startDate);
  push("End Date", current.endDate, proposed.endDate);
  push("Service Level", current.serviceLevel, proposed.serviceLevel);
  push("Note", current.note, proposed.note);
  push("Dealer Maximums", current.dealerMaximums, proposed.dealerMaximums);
  push("Manager Maximums", current.managerMaximums, proposed.managerMaximums);
  if (proposed.officeContact) {
    push("Office Phone", current.officeContact.phone, proposed.officeContact.phone);
    push("Office E-mail", current.officeContact.email, proposed.officeContact.email);
  }
  if (proposed.homeContact) {
    push("Home Phone", current.homeContact.phone, proposed.homeContact.phone);
    push("Home E-mail", current.homeContact.email, proposed.homeContact.email);
  }
  if (proposed.officeAddress) {
    push("Office Address", current.officeAddress.address, proposed.officeAddress.address);
    push("Office City", current.officeAddress.city, proposed.officeAddress.city);
    push("Office Province", current.officeAddress.province, proposed.officeAddress.province);
    push("Office Postal", current.officeAddress.postal, proposed.officeAddress.postal);
  }
  if (proposed.residentialAddress) {
    push("Residential Address", current.residentialAddress.address, proposed.residentialAddress.address);
  }
  return rows.filter((r) => r.current !== r.proposed);
}

function formatSubmittedAt(iso: string | undefined): string {
  if (!iso) return "—";
  try {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return iso;
  }
}

const Approvals = () => {
  const navigate = useNavigate();
  const { canApproveChanges, isAdmin, isSuperAdmin } = useRolePermissions();
  const {
    pendingByRep,
    approvePending,
    rejectPending,
    getEffectiveDetails,
  } = usePendingMemberChanges();
  const { setSelectedRepresentativeId } = useRepresentativesSearch();

  const [detailRepId, setDetailRepId] = useState<string | null>(null);
  const [rejectRepId, setRejectRepId] = useState<string | null>(null);
  const [rejectComment, setRejectComment] = useState("");

  useEffect(() => {
    if (!canApproveChanges) navigate("/", { replace: true });
  }, [canApproveChanges, navigate]);

  if (!canApproveChanges) return null;

  // Build list of pending changes with rep name and diff summary.
  const pendingList = useMemo(() => {
    return Object.entries(pendingByRep).map(([repId, pending]) => {
      const client = CLIENTS.find((c) => c.id === repId);
      const repName = client?.name ?? `Representative ${repId}`;
      const base = client ? getRepresentativeDetails(repId, client) : null;
      const current = base ? getEffectiveDetails(base) : ({} as RepDetails);
      const diffRows = buildDiffRows(current, pending.proposed);
      const canApproveThis =
        isSuperAdmin || (isAdmin && pending.submittedByRole === "admin-assistant");
      return {
        repId,
        repName,
        client,
        pending,
        diffRows,
        canApproveThis,
      };
    });
  }, [pendingByRep, getEffectiveDetails, isAdmin, isSuperAdmin]);

  // Sort by submittedAt descending (newest first).
  const sortedPendingList = useMemo(() => {
    return [...pendingList].sort((a, b) => {
      const ta = a.pending.submittedAt ?? "";
      const tb = b.pending.submittedAt ?? "";
      return tb.localeCompare(ta);
    });
  }, [pendingList]);

  const handleApprove = (repId: string) => {
    approvePending(repId);
    setDetailRepId(null);
  };

  const handleRejectOpen = (repId: string) => {
    setRejectRepId(repId);
    setRejectComment("");
  };

  const handleRejectConfirm = () => {
    if (!rejectRepId || !rejectComment.trim()) return;
    rejectPending(rejectRepId, rejectComment.trim());
    setRejectRepId(null);
    setRejectComment("");
    setDetailRepId(null);
  };

  const openInUsersAccess = (repId: string) => {
    setSelectedRepresentativeId(repId);
    navigate("/users-access");
  };

  const detailItem = detailRepId ? pendingList.find((p) => p.repId === detailRepId) : null;

  return (
    <PageLayout title="Changes pending approval">
      <div className="space-y-6">
        {/* Intro */}
        <p className="text-sm text-gray-600">
          Review member profile changes submitted by Administrators or Administrator Assistants.
          Approve to apply changes; reject to send back (submitter can edit and resubmit).
        </p>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Clock className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Pending review</p>
                  <p className="text-2xl font-bold text-gray-900">{pendingList.length}</p>
                  <p className="text-xs text-gray-500">member change(s)</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Representatives</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {new Set(pendingList.map((p) => p.repId)).size}
                  </p>
                  <p className="text-xs text-gray-500">with pending changes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-gray-600">Your action</p>
                  <p className="text-lg font-semibold text-gray-900">
                    {isSuperAdmin ? "Can approve all" : isAdmin ? "Admin Assistant submissions" : "—"}
                  </p>
                  <p className="text-xs text-gray-500">based on your role</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pending by representative */}
        <Card className="border border-gray-200 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <FileEdit className="h-5 w-5 text-gray-600" />
              Member changes by representative
            </CardTitle>
            <p className="text-sm text-gray-500 font-normal">
              Each card is one representative (client) with changes waiting for approval. Open details to see full before/after and Approve or Reject.
            </p>
          </CardHeader>
          <CardContent>
            {sortedPendingList.length === 0 ? (
              <div className="rounded-lg border border-dashed border-gray-300 bg-gray-50/50 py-12 text-center">
                <CheckCircle2 className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-600">No pending changes</p>
                <p className="text-xs text-gray-500 mt-1">
                  When an Administrator or Administrator Assistant submits member profile edits, they will appear here for approval.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={() => navigate("/users-access")}
                >
                  Go to Users & Access
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedPendingList.map((item) => (
                  <Card
                    key={item.repId}
                    className="border border-gray-200 bg-white overflow-hidden"
                  >
                    <CardContent className="p-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <User className="h-4 w-4 text-gray-500 shrink-0" />
                            <span className="font-semibold text-gray-900">{item.repName}</span>
                            <Badge variant="secondary" className="text-xs font-normal">
                              {getSubmitterLabel(item.pending.submittedByRole)} submitted
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-500 mt-1">
                            Submitted {formatSubmittedAt(item.pending.submittedAt)}
                          </p>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {item.diffRows.slice(0, 6).map((r, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-xs text-gray-700"
                              >
                                {r.label}
                              </span>
                            ))}
                            {item.diffRows.length > 6 && (
                              <span className="text-xs text-gray-500">
                                +{item.diffRows.length - 6} more
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDetailRepId(item.repId)}
                            className="gap-1.5"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View details
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openInUsersAccess(item.repId)}
                            className="gap-1.5 text-gray-600"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            Open in Users & Access
                          </Button>
                          {!item.canApproveThis && (
                            <span className="text-xs text-gray-500 italic">Awaiting approval</span>
                          )}
                          {item.canApproveThis && (
                            <>
                              <Button
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 gap-1.5"
                                onClick={() => handleApprove(item.repId)}
                              >
                                <CheckCircle2 className="h-3.5 w-3.5" />
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-200 hover:bg-red-50 gap-1.5"
                                onClick={() => handleRejectOpen(item.repId)}
                              >
                                <X className="h-3.5 w-3.5" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detail sheet: full diff and actions */}
      <Sheet open={!!detailRepId} onOpenChange={(open) => !open && setDetailRepId(null)}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          <SheetHeader>
            <SheetTitle>
              {detailItem ? detailItem.repName : "Pending change"}
            </SheetTitle>
            <SheetDescription>
              {detailItem && (
                <>
                  Submitted by {getSubmitterLabel(detailItem.pending.submittedByRole)} on{" "}
                  {formatSubmittedAt(detailItem.pending.submittedAt)}. Review the changes below and approve or reject.
                </>
              )}
            </SheetDescription>
          </SheetHeader>
          {detailItem && (
            <ScrollArea className="flex-1 -mx-6 px-6">
              <div className="space-y-3 pb-6">
                <p className="text-sm font-medium text-gray-700">Changes (current → proposed)</p>
                <div className="rounded-lg border border-gray-200 bg-gray-50/50 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-gray-100 border-b border-gray-200">
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Field</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Current</th>
                        <th className="text-left py-2 px-3 font-medium text-gray-700">Proposed</th>
                      </tr>
                    </thead>
                    <tbody>
                      {detailItem.diffRows.map((r, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 px-3 text-gray-600 font-medium">{r.label}</td>
                          <td className="py-2 px-3">
                            <span className="text-red-600 line-through">{r.current || "—"}</span>
                          </td>
                          <td className="py-2 px-3">
                            <span className="text-green-700 font-medium">{r.proposed || "—"}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScrollArea>
          )}
          {detailItem && (
            <SheetFooter className="border-t pt-4 flex flex-wrap gap-2 sm:gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => openInUsersAccess(detailItem.repId)}
                className="gap-1.5 text-gray-600 mr-auto"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Open in Users & Access
              </Button>
              <Button variant="outline" onClick={() => setDetailRepId(null)}>
                Close
              </Button>
              <Button
                variant="outline"
                className="text-red-600 border-red-200 hover:bg-red-50"
                onClick={() => handleRejectOpen(detailItem.repId)}
              >
                Reject
              </Button>
              {detailItem.canApproveThis && (
                <Button
                  className="bg-green-600 hover:bg-green-700"
                  onClick={() => handleApprove(detailItem.repId)}
                >
                  Approve
                </Button>
              )}
            </SheetFooter>
          )}
        </SheetContent>
      </Sheet>

      {/* Reject comment dialog */}
      <Dialog open={!!rejectRepId} onOpenChange={(open) => !open && setRejectRepId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-amber-500" />
              Reject change
            </DialogTitle>
            <DialogDescription>
              Add a reason for rejection. The person who submitted the change will see this and can edit and resubmit.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Reason for rejection (required)"
            value={rejectComment}
            onChange={(e) => setRejectComment(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectRepId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={!rejectComment.trim()}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default Approvals;
