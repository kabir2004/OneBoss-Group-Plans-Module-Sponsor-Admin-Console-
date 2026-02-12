import { useState } from 'react';
import { PageLayout } from '@/components/layout/PageLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useTombstone } from '@/context/TombstoneContext';
import { useRolePermissions } from '@/context/RolePermissionsContext';
import type { TombstoneFieldChange } from '@/context/TombstoneContext';
import { FileEdit, CheckCircle, XCircle, Send, Clock } from 'lucide-react';

function getCurrentUser() {
  return typeof window !== 'undefined' ? (localStorage.getItem('userId') || 'Current User') : 'Current User';
}

const TombstoneWorkflow = () => {
  const { canApproveChanges, isAdminAssistant } = useRolePermissions();
  const {
    submissions,
    pendingSubmissions,
    submitTombstone,
    approveTombstone,
    rejectTombstone,
  } = useTombstone();

  const [clientName, setClientName] = useState('');
  const [planRef, setPlanRef] = useState('');
  const [entityType, setEntityType] = useState<'client' | 'plan'>('client');
  const [fieldName, setFieldName] = useState('');
  const [oldValue, setOldValue] = useState('');
  const [newValue, setNewValue] = useState('');
  const [fieldChanges, setFieldChanges] = useState<TombstoneFieldChange[]>([]);

  const currentUser = getCurrentUser();

  const addField = () => {
    if (!fieldName.trim()) return;
    setFieldChanges((prev) => [...prev, { fieldName: fieldName.trim(), oldValue: oldValue.trim(), newValue: newValue.trim() }]);
    setFieldName('');
    setOldValue('');
    setNewValue('');
  };

  const removeField = (index: number) => {
    setFieldChanges((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    if (!clientName.trim()) return;
    submitTombstone({
      clientName: clientName.trim(),
      planRef: planRef.trim() || undefined,
      entityType,
      fieldChanges,
      submittedBy: currentUser,
    });
    setClientName('');
    setPlanRef('');
    setFieldChanges([]);
  };

  return (
    <PageLayout title="Tombstone">
      <div className="space-y-6">
        {/* Admin/Super Admin: Review Queue */}
        {canApproveChanges && (
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Review Queue
              </CardTitle>
              <CardDescription>
                Pending tombstone edits submitted by Administrator Assistants. Approve or reject each request.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {pendingSubmissions.length === 0 ? (
                <p className="text-sm text-gray-500 py-6 text-center">No pending tombstone edits.</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="text-xs font-semibold text-gray-700">Client / Plan</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Type</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Changes</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Submitted by</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700">Submitted</TableHead>
                      <TableHead className="text-xs font-semibold text-gray-700 w-[180px]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingSubmissions.map((sub) => (
                      <TableRow key={sub.id}>
                        <TableCell className="font-medium">
                          {sub.clientName}
                          {sub.planRef && <span className="text-gray-500"> • {sub.planRef}</span>}
                        </TableCell>
                        <TableCell className="text-gray-600 capitalize">{sub.entityType}</TableCell>
                        <TableCell className="text-gray-600 text-xs">
                          {sub.fieldChanges.length > 0 ? (
                            <ul className="list-disc pl-4 space-y-0.5">
                              {sub.fieldChanges.map((f, i) => (
                                <li key={i}>{f.fieldName}: &quot;{f.oldValue}&quot; → &quot;{f.newValue}&quot;</li>
                              ))}
                            </ul>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                        <TableCell className="text-gray-600">{sub.submittedBy}</TableCell>
                        <TableCell className="text-gray-500 text-xs">{sub.submittedAt}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => approveTombstone(sub.id, currentUser)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => rejectTombstone(sub.id, currentUser)}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        )}

        {/* Administrator Assistant: Submit tombstone edit */}
        {isAdminAssistant && (
          <Card className="border border-gray-200 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileEdit className="h-5 w-5" />
                Submit Tombstone Edit
              </CardTitle>
              <CardDescription>
                Submit client or plan tombstone changes for review. An Administrator or Super Administrator will approve or reject.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="client-name">Client name</Label>
                  <Input
                    id="client-name"
                    placeholder="e.g. Smith, John"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="plan-ref">Plan (optional)</Label>
                  <Input
                    id="plan-ref"
                    placeholder="e.g. RRSP-12345"
                    value={planRef}
                    onChange={(e) => setPlanRef(e.target.value)}
                  />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Entity type</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="entityType"
                      checked={entityType === 'client'}
                      onChange={() => setEntityType('client')}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Client</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="entityType"
                      checked={entityType === 'plan'}
                      onChange={() => setEntityType('plan')}
                      className="rounded border-gray-300"
                    />
                    <span className="text-sm">Plan</span>
                  </label>
                </div>
              </div>
              <div className="border border-gray-200 rounded-lg p-4 space-y-3">
                <Label>Field changes</Label>
                {fieldChanges.length > 0 && (
                  <ul className="text-sm text-gray-700 space-y-1 mb-2">
                    {fieldChanges.map((f, i) => (
                      <li key={i} className="flex items-center justify-between bg-gray-50 px-2 py-1 rounded">
                        <span>{f.fieldName}: &quot;{f.oldValue}&quot; → &quot;{f.newValue}&quot;</span>
                        <Button type="button" variant="ghost" size="sm" className="h-7 text-red-600" onClick={() => removeField(i)}>
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="flex flex-wrap gap-2 items-end">
                  <Input
                    placeholder="Field name (e.g. Address)"
                    value={fieldName}
                    onChange={(e) => setFieldName(e.target.value)}
                    className="max-w-[140px]"
                  />
                  <Input
                    placeholder="Old value"
                    value={oldValue}
                    onChange={(e) => setOldValue(e.target.value)}
                    className="max-w-[140px]"
                  />
                  <Input
                    placeholder="New value"
                    value={newValue}
                    onChange={(e) => setNewValue(e.target.value)}
                    className="max-w-[140px]"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={addField}>
                    Add change
                  </Button>
                </div>
              </div>
              <Button onClick={handleSubmit} disabled={!clientName.trim()} className="gap-2">
                <Send className="h-4 w-4" />
                Submit for review
              </Button>
            </CardContent>
          </Card>
        )}

        {/* My submissions (for Assistant) or all submissions (for Admin/Super Admin) */}
        <Card className="border border-gray-200 shadow-sm bg-white">
          <CardHeader>
            <CardTitle>Submissions</CardTitle>
            <CardDescription>
              {isAdminAssistant ? 'Your tombstone edit submissions and their status.' : 'All tombstone submissions.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length === 0 ? (
              <p className="text-sm text-gray-500 py-6 text-center">No submissions yet.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-xs font-semibold text-gray-700">Client / Plan</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Type</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Changes</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Submitted by</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Submitted</TableHead>
                    <TableHead className="text-xs font-semibold text-gray-700">Status</TableHead>
                    {submissions.some((s) => s.reviewedBy) && (
                      <TableHead className="text-xs font-semibold text-gray-700">Reviewed by</TableHead>
                    )}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub) => (
                    <TableRow key={sub.id}>
                      <TableCell className="font-medium">
                        {sub.clientName}
                        {sub.planRef && <span className="text-gray-500"> • {sub.planRef}</span>}
                      </TableCell>
                      <TableCell className="text-gray-600 capitalize">{sub.entityType}</TableCell>
                      <TableCell className="text-gray-600 text-xs max-w-[200px]">
                        {sub.fieldChanges.length > 0 ? (
                          <ul className="list-disc pl-4 space-y-0.5 truncate">
                            {sub.fieldChanges.slice(0, 2).map((f, i) => (
                              <li key={i}>{f.fieldName}: {f.newValue}</li>
                            ))}
                            {sub.fieldChanges.length > 2 && <li>+{sub.fieldChanges.length - 2} more</li>}
                          </ul>
                        ) : (
                          '—'
                        )}
                      </TableCell>
                      <TableCell className="text-gray-600">{sub.submittedBy}</TableCell>
                      <TableCell className="text-gray-500 text-xs">{sub.submittedAt}</TableCell>
                      <TableCell>
                        <Badge
                          variant="secondary"
                          className={
                            sub.status === 'approved'
                              ? 'bg-green-100 text-green-800'
                              : sub.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-amber-100 text-amber-800'
                          }
                        >
                          {sub.status}
                        </Badge>
                      </TableCell>
                      {submissions.some((s) => s.reviewedBy) && (
                        <TableCell className="text-gray-500 text-xs">
                          {sub.reviewedBy ? `${sub.reviewedBy} • ${sub.reviewedAt}` : '—'}
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default TombstoneWorkflow;
