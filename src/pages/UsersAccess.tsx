import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { useRolePermissions } from '@/context/RolePermissionsContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { UserPlus, Pencil, UserX, Save, X, Check, XCircle } from 'lucide-react';
import { useRepresentativesSearch } from '@/context/RepresentativesSearchContext';
import { usePendingMemberChanges } from '@/context/PendingMemberChangesContext';
import type { ProposedMemberEdits, PendingChange, SubmitterRole, ReviewOutcome } from '@/context/PendingMemberChangesContext';
import { getRepresentativeDetails } from '@/data/representativeDetails';

/** List of 6 people shown under "+ Administrator" on Administrator page (sidebar). Has full fields for detail panel. */
type UsersAccessRep = { id: string; name: string; status: string; email: string; city: string; province: string; accountNumber: string };
const USERS_ACCESS_REPRESENTATIVES: UsersAccessRep[] = [
  { id: 'UA1', name: 'Morgan Reeves', email: 'morgan.reeves@example.com', city: 'Calgary', province: 'AB', accountNumber: 'UA1', status: 'Active' },
  { id: 'UA2', name: 'Jordan Blake', email: 'jordan.blake@example.com', city: 'Halifax', province: 'NS', accountNumber: 'UA2', status: 'Active' },
  { id: 'UA3', name: 'Riley Sutton', email: 'riley.sutton@example.com', city: 'Winnipeg', province: 'MB', accountNumber: 'UA3', status: 'Active' },
  { id: 'UA4', name: 'Casey Quinn', email: 'casey.quinn@example.com', city: 'Edmonton', province: 'AB', accountNumber: 'UA4', status: 'Active' },
  { id: 'UA5', name: 'Skyler Hayes', email: 'skyler.hayes@example.com', city: 'Ottawa', province: 'ON', accountNumber: 'UA5', status: 'Active' },
  { id: 'UA6', name: 'Avery Cross', email: 'avery.cross@example.com', city: 'Victoria', province: 'BC', accountNumber: 'UA6', status: 'Active' },
];
import type { RepDetails } from '@/data/representativeDetails';
import { Textarea } from '@/components/ui/textarea';

type UserStatus = 'Active' | 'Disabled';
type UserRole = 'Super Administrator' | 'Administrator' | 'Administrator Assistant';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
};

const ROLES: UserRole[] = ['Super Administrator', 'Administrator', 'Administrator Assistant'];

const initialUsers: User[] = [
  { id: '1', name: 'Sarah Chen', email: 'sarah.chen@example.com', role: 'Super Administrator', status: 'Active' },
  { id: '2', name: 'Antoine Marsh', email: 'antoine.marsh@example.com', role: 'Administrator', status: 'Active' },
  { id: '3', name: 'Maria Garcia', email: 'maria.garcia@example.com', role: 'Administrator', status: 'Active' },
  { id: '4', name: 'James Wilson', email: 'james.wilson@example.com', role: 'Administrator Assistant', status: 'Active' },
  { id: '5', name: 'Emily Davis', email: 'emily.davis@example.com', role: 'Administrator Assistant', status: 'Active' },
  { id: '6', name: 'David Brown', email: 'david.brown@example.com', role: 'Administrator Assistant', status: 'Active' },
];

const ASSISTANT_ROLE: UserRole = 'Administrator Assistant';

/** Proper display labels for edit form fields (grammar and capitalization). */
const FIELD_LABELS: Record<string, string> = {
  surname: 'Surname',
  name: 'Name',
  dateOfBirth: 'Date of Birth',
  businessName: 'Business Name',
  startDate: 'Start Date',
  endDate: 'End Date',
  serviceLevel: 'Service Level',
  note: 'Note',
  dealerMaximums: 'Dealer Maximums',
  managerMaximums: 'Manager Maximums',
  officeAddress: 'Office Address',
  residentialAddress: 'Residential Address',
  officeMailingAddress: 'Office Mailing Address',
  residentialMailingAddress: 'Residential Mailing Address',
  address: 'Address',
  city: 'City',
  province: 'Province',
  postal: 'Postal Code',
  country: 'Country',
  phone: 'Phone',
  fax: 'Fax',
  cell: 'Cell',
  email: 'E-mail',
};

const getFieldLabel = (key: string) => FIELD_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').replace(/^\w/, (s) => s.toUpperCase());

const UsersAccess = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { canManageUsers, canViewUsersAccess, canManageAdmins, isAdmin, isAdminAssistant, isSuperAdmin, role } = useRolePermissions();
  const {
    getEffectiveDetails,
    getPendingForRep,
    getReviewOutcomeForRep,
    submitPending,
    approvePending,
    approvePendingPartial,
    rejectPending,
    applyDirectEdits,
  } = usePendingMemberChanges();
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editRoleOpen, setEditRoleOpen] = useState(false);
  const [disableOpen, setDisableOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>(ASSISTANT_ROLE);
  const [editRoleUserId, setEditRoleUserId] = useState<string>('');
  const [editRoleValue, setEditRoleValue] = useState<UserRole>(ASSISTANT_ROLE);
  type TileId = 'details' | 'addresses' | 'officeContact' | 'homeContact' | 'maximums';
  const [editingTile, setEditingTile] = useState<TileId | null>(null);
  const [editForm, setEditForm] = useState<ProposedMemberEdits | null>(null);
  const [rejectOpen, setRejectOpen] = useState(false);
  const [rejectComment, setRejectComment] = useState('');
  /** Per-field approve/reject for proposed changes (key = fieldKey e.g. "name", "officeContact.phone"). */
  const [fieldDecisions, setFieldDecisions] = useState<Record<string, 'approved' | 'rejected'>>({});
  const [fieldRejectReasons, setFieldRejectReasons] = useState<Record<string, string>>({});
  /** Which field's reject-reason dialog is open. */
  const [rejectFieldDialog, setRejectFieldDialog] = useState<{ fieldKey: string; label: string } | null>(null);
  const [rejectFieldReason, setRejectFieldReason] = useState('');
  /** Rows in the current diff (fieldKey + label) set by DiffView for partial approve and review outcome. */
  const [fieldRowsInDiff, setFieldRowsInDiff] = useState<{ fieldKey: string; label: string }[]>([]);
  const [inviteSentOpen, setInviteSentOpen] = useState(false);
  const [inviteSentInfo, setInviteSentInfo] = useState<{ name: string; email: string; role: UserRole } | null>(null);
  /** Rep IDs for which the user has dismissed the review outcome notice. */
  const [dismissedReviewOutcomeRepIds, setDismissedReviewOutcomeRepIds] = useState<string[]>([]);

  const { setRepresentativesCount, setRepresentativesList, selectedRepresentativeId } = useRepresentativesSearch();

  useEffect(() => {
    if (!canViewUsersAccess) navigate('/', { replace: true });
  }, [canViewUsersAccess, navigate]);

  useEffect(() => {
    setRepresentativesCount(USERS_ACCESS_REPRESENTATIVES.length);
    setRepresentativesList(USERS_ACCESS_REPRESENTATIVES.map((c) => ({ id: c.id, name: c.name, status: c.status })));
  }, [setRepresentativesCount, setRepresentativesList]);

  // Open invite modal with role when navigating from sidebar "+ Administrator" / "+ Administrator Assistant"
  useEffect(() => {
    const inviteRoleParam = searchParams.get('invite');
    if (!inviteRoleParam) return;
    const roleMap: Record<string, UserRole> = {
      'Administrator': 'Administrator',
      'Administrator+Assistant': 'Administrator Assistant',
      'Administrator Assistant': 'Administrator Assistant',
    };
    const mappedRole = roleMap[inviteRoleParam];
    // Super Admin can invite Administrator or Administrator Assistant; Administrator can only invite Administrator Assistant
    if (mappedRole && (canManageAdmins || mappedRole === 'Administrator Assistant')) {
      setInviteRole(mappedRole);
      setInviteOpen(true);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, canManageAdmins, setSearchParams]);

  if (!canViewUsersAccess) return null;

  // Administrator Assistant can only manage Administrator Assistants; Super Admin can manage everyone
  // Super Admin can only invite Administrator or Administrator Assistant (not another Super Administrator)
  const rolesForInvite = canManageAdmins ? (ROLES.filter((r) => r !== 'Super Administrator')) : [ASSISTANT_ROLE];
  const canEditUser = (user: User) => canManageAdmins || user.role === ASSISTANT_ROLE;
  const rolesForEdit = canManageAdmins ? ROLES : [ASSISTANT_ROLE];

  const handleInviteSubmit = () => {
    if (!inviteName.trim() || !inviteEmail.trim()) return;
    const name = inviteName.trim();
    const email = inviteEmail.trim();
    setUsers((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        name,
        email,
        role: inviteRole,
        status: 'Active',
      },
    ]);
    setInviteName('');
    setInviteEmail('');
    setInviteRole(ASSISTANT_ROLE);
    setInviteOpen(false);
    setInviteSentInfo({ name, email, role: inviteRole });
    setInviteSentOpen(true);
  };

  const openEditRole = (user: User) => {
    if (!canEditUser(user)) return;
    setSelectedUser(user);
    setEditRoleUserId(user.id);
    setEditRoleValue(user.role);
    setEditRoleOpen(true);
  };

  const handleEditRoleSubmit = () => {
    if (!editRoleUserId) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === editRoleUserId ? { ...u, role: editRoleValue } : u))
    );
    setEditRoleOpen(false);
    setSelectedUser(null);
  };

  const openDisable = (user: User) => {
    setSelectedUser(user);
    setDisableOpen(true);
  };

  const handleDisableSubmit = () => {
    if (!selectedUser) return;
    setUsers((prev) =>
      prev.map((u) => (u.id === selectedUser.id ? { ...u, status: 'Disabled' as UserStatus } : u))
    );
    setDisableOpen(false);
    setSelectedUser(null);
  };

  const selectedClient = selectedRepresentativeId ? USERS_ACCESS_REPRESENTATIVES.find((c) => c.id === selectedRepresentativeId) : null;
  const baseDetails: RepDetails | null = selectedClient ? getRepresentativeDetails(selectedClient.id, selectedClient) : null;
  const details: RepDetails | null = baseDetails ? getEffectiveDetails(baseDetails) : null;
  const pending = selectedRepresentativeId ? getPendingForRep(selectedRepresentativeId) : null;
  /** Only Administrator and Super Admin see Approve/Reject; both can act on Admin Assistant submissions (whoever does it first). Admin Assistant never sees Approve/Reject (they are the submitter). */
  const canSeeApproveReject =
    pending &&
    !isAdminAssistant &&
    (isSuperAdmin || (isAdmin && (pending.submittedByRole === 'admin-assistant' || pending.submittedByRole == null)));
  const showDiffView = canSeeApproveReject && pending;
  const canEditTiles = (isAdmin || isAdminAssistant || isSuperAdmin) && !showDiffView;

  // Reset per-field decisions when switching rep or pending changes
  useEffect(() => {
    setFieldDecisions({});
    setFieldRejectReasons({});
    setFieldRowsInDiff([]);
    setRejectFieldDialog(null);
    setRejectFieldReason('');
  }, [selectedRepresentativeId, pending?.submittedAt]);
  /** Administrator Assistant can only edit Addresses, Office Contact, Home Contact; not Details or Maximums. */
  const canEditTile = (tileId: TileId) => canEditTiles && (!isAdminAssistant || (tileId !== 'details' && tileId !== 'maximums'));
  /** Submitter sees "Changes pending approval": Administrator or Administrator Assistant when they have pending changes. */
  const showPendingBanner = pending && (isAdmin || isAdminAssistant);

  const handleStartEditTile = (tileId: TileId) => {
    if (!details) return;
    if (tileId === 'details') {
      setEditForm({
        surname: details.surname,
        name: details.name,
        dateOfBirth: details.dateOfBirth,
        businessName: details.businessName,
        startDate: details.startDate,
        endDate: details.endDate,
        serviceLevel: details.serviceLevel,
        note: details.note,
      });
    } else if (tileId === 'officeContact') {
      setEditForm({ officeContact: { ...details.officeContact } });
    } else if (tileId === 'homeContact') {
      setEditForm({ homeContact: { ...details.homeContact } });
    } else if (tileId === 'maximums') {
      setEditForm({ dealerMaximums: details.dealerMaximums, managerMaximums: details.managerMaximums });
    } else if (tileId === 'addresses') {
      setEditForm({
        officeAddress: { ...details.officeAddress },
        residentialAddress: { ...details.residentialAddress },
        officeMailingAddress: { ...details.officeMailingAddress },
        residentialMailingAddress: { ...details.residentialMailingAddress },
      });
    }
    setEditingTile(tileId);
  };

  const handleCancelTile = () => {
    setEditingTile(null);
    setEditForm(null);
  };

  const handleSaveTile = () => {
    if (!selectedRepresentativeId || !editForm || !editingTile) return;
    if (isSuperAdmin) {
      applyDirectEdits(selectedRepresentativeId, editForm);
    } else {
      // Merge this tile's edits with existing pending or current details so full proposed state is saved
      const base = pending?.proposed ?? {};
      const merged: ProposedMemberEdits = {
        ...base,
        ...editForm,
        officeContact: editForm.officeContact ? { ...(base.officeContact ?? details.officeContact), ...editForm.officeContact } : base.officeContact,
        homeContact: editForm.homeContact ? { ...(base.homeContact ?? details.homeContact), ...editForm.homeContact } : base.homeContact,
        officeAddress: editForm.officeAddress ? { ...(base.officeAddress ?? details.officeAddress), ...editForm.officeAddress } : base.officeAddress,
        residentialAddress: editForm.residentialAddress ? { ...(base.residentialAddress ?? details.residentialAddress), ...editForm.residentialAddress } : base.residentialAddress,
        officeMailingAddress: editForm.officeMailingAddress ? { ...(base.officeMailingAddress ?? details.officeMailingAddress), ...editForm.officeMailingAddress } : base.officeMailingAddress,
        residentialMailingAddress: editForm.residentialMailingAddress ? { ...(base.residentialMailingAddress ?? details.residentialMailingAddress), ...editForm.residentialMailingAddress } : base.residentialMailingAddress,
      };
      submitPending(selectedRepresentativeId, merged, role);
    }
    setEditingTile(null);
    setEditForm(null);
  };

  /** Build ProposedMemberEdits containing only approved fields (by fieldKey). */
  const buildPartialFromApproved = (proposed: ProposedMemberEdits, approvedKeys: string[]): ProposedMemberEdits => {
    const partial: ProposedMemberEdits = {};
    const raw = proposed as Record<string, unknown>;
    for (const key of approvedKeys) {
      if (key.includes('.')) {
        const [parent, child] = key.split('.');
        const val = raw[parent];
        if (val != null && typeof val === 'object' && !Array.isArray(val) && child in (val as object)) {
          (partial as Record<string, unknown>)[parent] = {
            ...((partial as Record<string, unknown>)[parent] as object),
            [child]: (val as Record<string, unknown>)[child],
          };
        }
      } else if (key in raw) {
        (partial as Record<string, unknown>)[key] = raw[key];
      }
    }
    return partial;
  };

  const handleApprove = () => {
    if (!selectedRepresentativeId) return;
    const pendingData = getPendingForRep(selectedRepresentativeId);
    if (!pendingData) return;
    const hasPerFieldDecisions = fieldRowsInDiff.some((r) => fieldDecisions[r.fieldKey] !== undefined);
    if (hasPerFieldDecisions && fieldRowsInDiff.length > 0) {
      const approvedKeys = fieldRowsInDiff.filter((r) => fieldDecisions[r.fieldKey] === 'approved').map((r) => r.fieldKey);
      const partial = buildPartialFromApproved(pendingData.proposed, approvedKeys);
      const outcome: ReviewOutcome = {
        submittedAt: pendingData.submittedAt,
        submittedByRole: pendingData.submittedByRole,
        accepted: fieldRowsInDiff.filter((r) => fieldDecisions[r.fieldKey] === 'approved').map((r) => ({ fieldKey: r.fieldKey, label: r.label })),
        rejected: fieldRowsInDiff.filter((r) => fieldDecisions[r.fieldKey] === 'rejected').map((r) => ({ fieldKey: r.fieldKey, label: r.label, reason: fieldRejectReasons[r.fieldKey] ?? '' })),
      };
      approvePendingPartial(selectedRepresentativeId, partial, outcome);
    } else {
      const outcome: ReviewOutcome = {
        submittedAt: pendingData.submittedAt,
        submittedByRole: pendingData.submittedByRole,
        accepted: fieldRowsInDiff.map((r) => ({ fieldKey: r.fieldKey, label: r.label })),
        rejected: [],
      };
      approvePending(selectedRepresentativeId, outcome);
    }
    setFieldDecisions({});
    setFieldRejectReasons({});
    setFieldRowsInDiff([]);
  };

  const handleRejectOpen = () => setRejectOpen(true);
  const handleRejectConfirm = () => {
    if (!selectedRepresentativeId || !rejectComment.trim()) return;
    rejectPending(selectedRepresentativeId, rejectComment.trim());
    setRejectOpen(false);
    setRejectComment('');
    setFieldDecisions({});
    setFieldRejectReasons({});
    setFieldRowsInDiff([]);
  };

  const handleRejectFieldConfirm = () => {
    if (!rejectFieldDialog || !rejectFieldReason.trim()) return;
    setFieldDecisions((prev) => ({ ...prev, [rejectFieldDialog.fieldKey]: 'rejected' }));
    setFieldRejectReasons((prev) => ({ ...prev, [rejectFieldDialog.fieldKey]: rejectFieldReason.trim() }));
    setRejectFieldDialog(null);
    setRejectFieldReason('');
  };

  const submitterLabel = (role?: SubmitterRole | null): string => {
    if (!role) return 'Unknown';
    const map: Record<SubmitterRole, string> = {
      'admin': 'Administrator',
      'admin-assistant': 'Administrator Assistant',
      'super-admin': 'Super Administrator',
    };
    return map[role] ?? role;
  };

  const formatSubmittedAt = (iso?: string): string => {
    if (!iso) return '—';
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, { dateStyle: 'medium' }) + ' at ' + d.toLocaleTimeString(undefined, { timeStyle: 'short' });
    } catch {
      return iso;
    }
  };

  function DiffView({
    current,
    proposed,
    pending,
    fieldDecisions,
    fieldRejectReasons,
    onFieldApprove,
    onFieldReject,
    onFieldKeysChange,
    onSave,
  }: {
    current: RepDetails;
    proposed: ProposedMemberEdits;
    pending: PendingChange | null;
    fieldDecisions: Record<string, 'approved' | 'rejected'>;
    fieldRejectReasons: Record<string, string>;
    onFieldApprove: (fieldKey: string) => void;
    onFieldReject: (fieldKey: string, label: string) => void;
    onFieldKeysChange: (rows: { fieldKey: string; label: string }[]) => void;
    onSave: () => void;
  }) {
    const allRows: { label: string; current: string; proposed: string; group: string; fieldKey: string }[] = [];
    const push = (group: string, label: string, fieldKey: string, curr: string | undefined, prop: string | undefined) => {
      if (prop === undefined) return;
      allRows.push({ label, current: curr ?? '—', proposed: prop ?? '—', group, fieldKey });
    };
    push('Personal', 'Surname', 'surname', current.surname, proposed.surname);
    push('Personal', 'Name', 'name', current.name, proposed.name);
    push('Personal', 'Date of birth', 'dateOfBirth', current.dateOfBirth, proposed.dateOfBirth);
    push('Personal', 'Business Name', 'businessName', current.businessName, proposed.businessName);
    push('Dates', 'Start Date', 'startDate', current.startDate, proposed.startDate);
    push('Dates', 'End Date', 'endDate', current.endDate, proposed.endDate);
    push('Service', 'Service Level', 'serviceLevel', current.serviceLevel, proposed.serviceLevel);
    push('Service', 'Note', 'note', current.note, proposed.note);
    push('Maximums', 'Dealer Maximums', 'dealerMaximums', current.dealerMaximums, proposed.dealerMaximums);
    push('Maximums', 'Manager Maximums', 'managerMaximums', current.managerMaximums, proposed.managerMaximums);
    if (proposed.officeContact) {
      push('Office contact', 'Phone', 'officeContact.phone', current.officeContact?.phone, proposed.officeContact.phone);
      push('Office contact', 'Fax', 'officeContact.fax', current.officeContact?.fax, proposed.officeContact.fax);
      push('Office contact', 'Cell', 'officeContact.cell', current.officeContact?.cell, proposed.officeContact.cell);
      push('Office contact', 'E-mail', 'officeContact.email', current.officeContact?.email, proposed.officeContact.email);
      push('Office contact', 'Residential Address', 'officeContact.residentialAddress', current.officeContact?.residentialAddress, proposed.officeContact.residentialAddress);
    }
    if (proposed.homeContact) {
      push('Home contact', 'Phone', 'homeContact.phone', current.homeContact?.phone, proposed.homeContact.phone);
      push('Home contact', 'Fax', 'homeContact.fax', current.homeContact?.fax, proposed.homeContact.fax);
      push('Home contact', 'Cell', 'homeContact.cell', current.homeContact?.cell, proposed.homeContact.cell);
      push('Home contact', 'E-mail', 'homeContact.email', current.homeContact?.email, proposed.homeContact.email);
      push('Home contact', 'Residential Address', 'homeContact.residentialAddress', current.homeContact?.residentialAddress, proposed.homeContact.residentialAddress);
    }
    const addrFields = ['address', 'city', 'province', 'postal', 'country'] as const;
    if (proposed.officeAddress) {
      for (const f of addrFields) {
        push('Office address', f.charAt(0).toUpperCase() + f.slice(1), `officeAddress.${f}`, current.officeAddress?.[f], proposed.officeAddress[f]);
      }
    }
    if (proposed.residentialAddress) {
      for (const f of addrFields) {
        push('Residential address', f.charAt(0).toUpperCase() + f.slice(1), `residentialAddress.${f}`, current.residentialAddress?.[f], proposed.residentialAddress[f]);
      }
    }
    if (proposed.officeMailingAddress) {
      for (const f of addrFields) {
        push('Office mailing address', f.charAt(0).toUpperCase() + f.slice(1), `officeMailingAddress.${f}`, current.officeMailingAddress?.[f], proposed.officeMailingAddress[f]);
      }
    }
    if (proposed.residentialMailingAddress) {
      for (const f of addrFields) {
        push('Residential mailing address', f.charAt(0).toUpperCase() + f.slice(1), `residentialMailingAddress.${f}`, current.residentialMailingAddress?.[f], proposed.residentialMailingAddress[f]);
      }
    }
    const changedRows = allRows.filter((r) => r.current !== r.proposed);
    const fieldKeysStable = changedRows.map((r) => r.fieldKey).sort().join(',');
    useEffect(() => {
      onFieldKeysChange(changedRows.map((r) => ({ fieldKey: r.fieldKey, label: r.label })));
    }, [fieldKeysStable, onFieldKeysChange]);
    const byGroup = changedRows.reduce<Record<string, typeof changedRows>>((acc, r) => {
      if (!acc[r.group]) acc[r.group] = [];
      acc[r.group].push(r);
      return acc;
    }, {});
    const groupOrder = ['Personal', 'Dates', 'Service', 'Maximums', 'Office contact', 'Home contact', 'Office address', 'Residential address', 'Office mailing address', 'Residential mailing address'];
    const groupLabels: Record<string, string> = {
      Personal: 'Personal details',
      Dates: 'Dates',
      Service: 'Service',
      Maximums: 'Maximums',
      'Office contact': 'Office contact',
      'Home contact': 'Home contact',
      'Office address': 'Office address',
      'Residential address': 'Residential address',
      'Office mailing address': 'Office mailing address',
      'Residential mailing address': 'Residential mailing address',
    };

    return (
      <Card className="border border-amber-200/80 bg-amber-50/30 mb-2">
        <CardHeader className="py-3 px-3 border-b border-amber-200/60">
          <CardTitle className="text-sm font-semibold text-gray-900">Proposed Changes — Review Before Approving</CardTitle>
          {pending && (
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
              <span><strong>Submitted by:</strong> {submitterLabel(pending.submittedByRole)}</span>
              <span><strong>Submitted at:</strong> {formatSubmittedAt(pending.submittedAt)}</span>
              <span><strong>Changes:</strong> {changedRows.length} field{changedRows.length !== 1 ? 's' : ''} modified</span>
            </div>
          )}
          <p className="text-xs text-gray-500 font-normal mt-1.5">Only modified fields are listed. <span className="text-red-600">Current value</span> → <span className="text-green-700 font-medium">Proposed value</span>. Use ✓ to approve or ✗ to reject each change; rejected fields need a reason and won’t be applied when you click Approve above.</p>
        </CardHeader>
        <CardContent className="px-3 pb-3 pt-3">
          {changedRows.length === 0 ? (
            <p className="text-xs text-gray-500 py-2">No field changes in this submission.</p>
          ) : (
            <div className="space-y-4">
              {groupOrder.map((group) => {
                const rows = byGroup[group];
                if (!rows?.length) return null;
                return (
                  <div key={group} className="rounded-lg border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 border-b border-gray-200">
                      <span className="h-1 w-1 rounded-full bg-gray-500" aria-hidden />
                      <span className="text-sm font-semibold text-gray-800">{groupLabels[group] ?? group}</span>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm border-collapse" style={{ tableLayout: 'fixed' }}>
                        <colgroup>
                          <col style={{ width: '11rem' }} />
                          <col style={{ width: '36%' }} />
                          <col style={{ width: '36%' }} />
                          <col style={{ width: '6rem' }} />
                        </colgroup>
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-2 px-4 text-xs font-semibold uppercase tracking-wider text-gray-500">Field</th>
                            <th className="text-left py-2 px-4 text-xs font-semibold uppercase tracking-wider text-red-600">Current value</th>
                            <th className="text-left py-2 px-4 text-xs font-semibold uppercase tracking-wider text-green-700">Proposed value</th>
                            <th className="text-center py-2 px-2 text-xs font-semibold uppercase tracking-wider text-gray-500 w-24">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {rows.map((r, i) => {
                            const status = fieldDecisions[r.fieldKey];
                            const rejectReason = fieldRejectReasons[r.fieldKey];
                            return (
                              <tr key={i} className="border-t border-gray-100">
                                <td className="py-2.5 px-4 text-gray-700 font-medium align-top">{r.label}</td>
                                <td className="py-2.5 px-4 text-red-600 line-through align-top break-words">{r.current || '—'}</td>
                                <td className="py-2.5 px-4 align-top break-words">
                                  <div className={`font-semibold break-words ${status === 'rejected' ? 'text-red-700 line-through' : 'text-green-700 bg-green-50/50'}`}>
                                    {r.proposed || '—'}
                                  </div>
                                  {status === 'rejected' && rejectReason && (
                                    <div className="mt-1.5 rounded bg-red-50 border border-red-100 px-2 py-1.5 text-xs text-red-800">
                                      <span className="font-semibold">{r.label} — Rejection note:</span>{' '}
                                      {rejectReason}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2 px-2 align-middle">
                                  <div className="flex items-center justify-center gap-1">
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant={status === 'approved' ? 'default' : 'ghost'}
                                      className={`h-8 w-8 shrink-0 ${status === 'approved' ? 'bg-green-600 hover:bg-green-700 text-white' : 'text-green-600 hover:bg-green-50'}`}
                                      onClick={() => onFieldApprove(r.fieldKey)}
                                      title="Approve this change"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      size="icon"
                                      variant={status === 'rejected' ? 'destructive' : 'ghost'}
                                      className={`h-8 w-8 shrink-0 ${status === 'rejected' ? '' : 'text-red-600 hover:bg-red-50'}`}
                                      onClick={() => onFieldReject(r.fieldKey, r.label)}
                                      title="Reject this change"
                                    >
                                      <XCircle className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          {changedRows.length > 0 && Object.keys(fieldDecisions).length > 0 && (
            <div className="mt-4 pt-4 border-t border-amber-200/60 flex flex-wrap items-center gap-2">
              <p className="text-xs text-gray-600 w-full mb-1">Confirm your decisions above, then save to apply approved changes.</p>
              <Button size="sm" className="bg-green-600 hover:bg-green-700 gap-1.5" onClick={onSave}>
                <Save className="h-4 w-4" />
                Save and apply approved changes
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  function EditForm({ form, onChange }: { form: ProposedMemberEdits; onChange: (f: ProposedMemberEdits) => void }) {
    const update = (key: keyof ProposedMemberEdits, value: string | undefined) => onChange({ ...form, [key]: value });
    const updateNested = (key: 'officeContact' | 'homeContact', nestedKey: string, value: string) =>
      onChange({
        ...form,
        [key]: { ...(form[key] ?? {}), [nestedKey]: value },
      });
    return (
      <Card className="border border-gray-200 mb-2">
        <CardHeader className="py-2 px-3">
          <CardTitle className="text-sm font-semibold">Edit details</CardTitle>
        </CardHeader>
        <CardContent className="px-3 pb-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {(['surname', 'name', 'dateOfBirth', 'businessName', 'startDate', 'endDate', 'serviceLevel', 'note'] as const).map((key) => (
            <div key={key} className="grid gap-1.5">
              <Label className="text-sm font-medium text-gray-700">{getFieldLabel(key)}</Label>
              <Input value={form[key] ?? ''} onChange={(e) => update(key, e.target.value)} className="h-8 text-sm" />
            </div>
          ))}
          {(['dealerMaximums', 'managerMaximums'] as const).map((key) => (
            <div key={key} className="grid gap-1.5 sm:col-span-2">
              <Label className="text-sm font-medium text-gray-700">{getFieldLabel(key)}</Label>
              <Input value={form[key] ?? ''} onChange={(e) => update(key, e.target.value)} className="h-8 text-sm" />
            </div>
          ))}
          {form.officeContact && (
            <>
              <div className="grid gap-1.5">
                <Label className="text-sm font-medium text-gray-700">Office Phone</Label>
                <Input value={form.officeContact.phone ?? ''} onChange={(e) => updateNested('officeContact', 'phone', e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-sm font-medium text-gray-700">Office E-mail</Label>
                <Input value={form.officeContact.email ?? ''} onChange={(e) => updateNested('officeContact', 'email', e.target.value)} className="h-8 text-sm" />
              </div>
            </>
          )}
          {form.homeContact && (
            <>
              <div className="grid gap-1.5">
                <Label className="text-sm font-medium text-gray-700">Home Phone</Label>
                <Input value={form.homeContact.phone ?? ''} onChange={(e) => updateNested('homeContact', 'phone', e.target.value)} className="h-8 text-sm" />
              </div>
              <div className="grid gap-1.5">
                <Label className="text-sm font-medium text-gray-700">Home E-mail</Label>
                <Input value={form.homeContact.email ?? ''} onChange={(e) => updateNested('homeContact', 'email', e.target.value)} className="h-8 text-sm" />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    );
  }

  function TileHeader({ tileId, title }: { tileId: TileId; title: string }) {
    return (
      <CardHeader className="py-1.5 px-3 shrink-0 flex flex-row items-center justify-between gap-2 border-b border-gray-100">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {canEditTile(tileId) ? (
          editingTile === tileId ? (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="h-7 text-xs px-2.5 gap-1.5 rounded-md" onClick={handleCancelTile}>
                <X className="h-3 w-3" />
                Cancel
              </Button>
              <Button size="sm" className="h-7 text-xs px-2.5 gap-1.5 rounded-md" onClick={handleSaveTile}>
                <Save className="h-3 w-3" />
                Save
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs px-2.5 gap-1.5 rounded-md border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
              onClick={() => handleStartEditTile(tileId)}
            >
              <Pencil className="h-3 w-3" />
              Edit
            </Button>
          )
        ) : (
          <span className="text-xs text-gray-500 italic">Contact administrator</span>
        )}
      </CardHeader>
    );
  }

  function ReadOnlyTileHeader({ title }: { title: string }) {
    return (
      <CardHeader className="py-1.5 px-3 shrink-0 flex flex-row items-center justify-between gap-2 border-b border-gray-100">
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
        {!canEditTiles && <span className="text-xs text-gray-500 italic">Contact administrator</span>}
      </CardHeader>
    );
  }

  const DetailRow = ({
    label,
    value,
    large,
  }: {
    label: string;
    value: string;
    large?: boolean;
  }) => (
    <div
      className={
        large
          ? 'flex justify-between gap-1.5 py-0.5 text-sm leading-tight'
          : 'flex justify-between gap-1 py-0 text-[11px] leading-tight'
      }
    >
      <span className="text-gray-500 shrink-0">{label}:</span>
      <span className="text-gray-900 text-right truncate min-w-0">{value || '—'}</span>
    </div>
  );

  return (
    <PageLayout title="">
      <div className="min-h-0 overflow-auto">
        {!selectedRepresentativeId ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">User must select a person from the list to see more info.</p>
          </div>
        ) : details ? (
          <>
            <div className="flex items-center justify-between gap-2 border-b border-gray-200 pb-0.5 mb-1">
              <h2 className="text-sm font-semibold text-gray-900">
                Details {details.surname}, {details.name}
              </h2>
              <div className="flex items-center gap-2">
                {showDiffView && (
                  <>
                    <span className="text-xs text-amber-700 bg-amber-50 px-2 py-1 rounded">Submitted for Review</span>
                    <Button size="sm" variant="default" className="h-7 text-xs" onClick={handleApprove}>
                      Approve
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs text-red-600 border-red-200" onClick={handleRejectOpen}>
                      Reject
                    </Button>
                  </>
                )}
              </div>
            </div>
            {showPendingBanner && (
              <div className="mb-2 text-xs text-amber-800 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
                Changes pending approval
              </div>
            )}
            {showDiffView && pending ? (
              <DiffView
                current={details}
                proposed={pending.proposed}
                pending={pending}
                fieldDecisions={fieldDecisions}
                fieldRejectReasons={fieldRejectReasons}
                onFieldApprove={(fieldKey) => setFieldDecisions((prev) => ({ ...prev, [fieldKey]: 'approved' }))}
                onFieldReject={(fieldKey, label) => setRejectFieldDialog({ fieldKey, label })}
                onFieldKeysChange={(rows) => setFieldRowsInDiff((prev) => (prev.length === rows.length && rows.every((r, i) => prev[i]?.fieldKey === r.fieldKey) ? prev : rows))}
                onSave={handleApprove}
              />
            ) : (
            <>
            {/* Top row: Details | Addresses | 4 quads (Office Contact, Home Contact, Codes Rep, Codes T4A) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 items-stretch mb-2">
              <Card className="border border-gray-200 shadow-sm w-full p-0 h-full flex flex-col min-h-0 transition-[min-height] duration-150 ease-out">
                <TileHeader tileId="details" title="Details" />
                <CardContent className="px-2 py-1.5 flex-1 overflow-auto min-h-0">
                  <div className="transition-opacity duration-150 ease-out space-y-0.5">
                  {editingTile === 'details' && editForm ? (
                    <div className="grid grid-cols-1 gap-1 text-sm">
                      {(['surname', 'name', 'dateOfBirth', 'businessName', 'startDate', 'endDate', 'serviceLevel', 'note'] as const).map((key) => (
                        <div key={key} className="flex items-center gap-2">
                          <Label className="text-sm font-medium text-gray-700 w-24 shrink-0">{getFieldLabel(key)}</Label>
                          <Input value={editForm[key] ?? ''} onChange={(e) => setEditForm({ ...editForm, [key]: e.target.value })} className="h-6 text-sm flex-1 min-w-0" />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <>
                      <DetailRow large label="ID" value={details.id} />
                      <DetailRow large label="NRD Number" value={details.nrdNumber} />
                      <DetailRow large label="Surname" value={details.surname} />
                      <DetailRow large label="Name" value={details.name} />
                      <DetailRow large label="Date of birth" value={details.dateOfBirth} />
                      <DetailRow large label="MR-72 On File" value={details.mr72OnFile} />
                      <DetailRow large label="MR-72 On File Date" value={details.mr72OnFileDate} />
                      <DetailRow large label="Business Name" value={details.businessName} />
                      <DetailRow large label="Federal BN" value={details.federalBN} />
                      <DetailRow large label="Provincial BN" value={details.provincialBN} />
                      <DetailRow large label="Start Date" value={details.startDate} />
                      <DetailRow large label="End Date" value={details.endDate} />
                      <DetailRow large label="Service Level" value={details.serviceLevel} />
                      <DetailRow large label="Note" value={details.note} />
                    </>
                  )}
                  </div>
                </CardContent>
              </Card>
              {/* 4 address quads: Office | Residential | Office Mailing | Res. Mailing */}
              <Card className="border border-gray-200 shadow-sm w-full p-0 h-full flex flex-col min-h-0 transition-[min-height] duration-150 ease-out">
                <TileHeader tileId="addresses" title="Addresses" />
                <CardContent className="p-2 grid grid-cols-2 grid-rows-2 gap-2 flex-1 min-h-0 overflow-auto min-h-[300px]">
                  {editingTile === 'addresses' && editForm ? (
                    <>
                      {(['officeAddress', 'residentialAddress', 'officeMailingAddress', 'residentialMailingAddress'] as const).map((key) => (
                        <Card key={key} className="border border-gray-200 p-2">
                          <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">{getFieldLabel(key)}</p>
                          {editForm[key] && (['address', 'city', 'province', 'postal', 'country'] as const).map((f) => (
                            <div key={f} className="flex items-center gap-2 mb-1">
                              <Label className="text-xs font-medium text-gray-700 w-16 shrink-0">{getFieldLabel(f)}</Label>
                              <Input
                                value={editForm[key]![f] ?? ''}
                                onChange={(e) => setEditForm({ ...editForm, [key]: { ...editForm[key], [f]: e.target.value } })}
                                className="h-6 text-xs flex-1"
                              />
                            </div>
                          ))}
                        </Card>
                      ))}
                    </>
                  ) : (
                    <>
                      <Card className="border border-gray-200 shadow-sm p-2 min-h-0">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Office</p>
                        <DetailRow large label="Address" value={details.officeAddress.address} />
                        <DetailRow large label="City" value={details.officeAddress.city} />
                        <DetailRow large label="Province" value={details.officeAddress.province} />
                        <DetailRow large label="Postal" value={details.officeAddress.postal} />
                        <DetailRow large label="Country" value={details.officeAddress.country} />
                      </Card>
                      <Card className="border border-gray-200 shadow-sm p-2 min-h-0">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Residential</p>
                        <DetailRow large label="Address" value={details.residentialAddress.address} />
                        <DetailRow large label="City" value={details.residentialAddress.city} />
                        <DetailRow large label="Province" value={details.residentialAddress.province} />
                        <DetailRow large label="Postal" value={details.residentialAddress.postal} />
                        <DetailRow large label="Country" value={details.residentialAddress.country} />
                      </Card>
                      <Card className="border border-gray-200 shadow-sm p-2 min-h-0">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Office Mailing</p>
                        <DetailRow large label="Address" value={details.officeMailingAddress.address} />
                        <DetailRow large label="City" value={details.officeMailingAddress.city} />
                        <DetailRow large label="Province" value={details.officeMailingAddress.province} />
                        <DetailRow large label="Postal" value={details.officeMailingAddress.postal} />
                        <DetailRow large label="Country" value={details.officeMailingAddress.country} />
                      </Card>
                      <Card className="border border-gray-200 shadow-sm p-2 min-h-0">
                        <p className="text-xs font-semibold text-gray-700 uppercase tracking-wide mb-1.5">Res. Mailing</p>
                        <DetailRow large label="Address" value={details.residentialMailingAddress.address} />
                        <DetailRow large label="City" value={details.residentialMailingAddress.city} />
                        <DetailRow large label="Province" value={details.residentialMailingAddress.province} />
                        <DetailRow large label="Postal" value={details.residentialMailingAddress.postal} />
                        <DetailRow large label="Country" value={details.residentialMailingAddress.country} />
                      </Card>
                    </>
                  )}
                </CardContent>
              </Card>
              <div className="grid grid-cols-2 grid-rows-2 gap-2 h-full min-h-0">
                <Card className="border border-gray-200 shadow-sm w-full p-0 h-full flex flex-col min-h-0 transition-[min-height] duration-150 ease-out">
                  <TileHeader tileId="officeContact" title="Office Contact" />
                  <CardContent className="px-2 pb-2 flex-1 min-h-0 overflow-auto text-sm min-h-[140px]">
                    <div className="min-h-[120px] transition-opacity duration-150 ease-out">
                    {editingTile === 'officeContact' && editForm?.officeContact ? (
                      <div className="space-y-1.5 text-sm">
                        {(['phone', 'fax', 'cell', 'email', 'residentialAddress'] as const).map((f) => (
                          <div key={f} className="flex items-center gap-2">
                            <Label className="text-sm font-medium text-gray-700 w-28 shrink-0">{getFieldLabel(f)}</Label>
                            <Input
                              value={editForm.officeContact[f] ?? ''}
                              onChange={(e) => setEditForm({ ...editForm, officeContact: { ...editForm.officeContact, [f]: e.target.value } })}
                              className="h-7 text-sm flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <DetailRow large label="Phone" value={details.officeContact.phone} />
                        <DetailRow large label="Fax" value={details.officeContact.fax} />
                        <DetailRow large label="Cell" value={details.officeContact.cell} />
                        <DetailRow large label="E-mail" value={details.officeContact.email} />
                        <DetailRow large label="Residential Address" value={details.officeContact.residentialAddress} />
                      </>
                    )}
                    </div>
                  </CardContent>
                </Card>
                <Card className="border border-gray-200 shadow-sm w-full p-0 h-full flex flex-col min-h-0 transition-[min-height] duration-150 ease-out">
                  <TileHeader tileId="homeContact" title="Home Contact" />
                  <CardContent className="px-2 pb-2 flex-1 min-h-0 overflow-auto text-sm min-h-[140px]">
                    <div className="min-h-[120px] transition-opacity duration-150 ease-out">
                    {editingTile === 'homeContact' && editForm?.homeContact ? (
                      <div className="space-y-1.5 text-sm">
                        {(['phone', 'fax', 'cell', 'email', 'residentialAddress'] as const).map((f) => (
                          <div key={f} className="flex items-center gap-2">
                            <Label className="text-sm font-medium text-gray-700 w-28 shrink-0">{getFieldLabel(f)}</Label>
                            <Input
                              value={editForm.homeContact[f] ?? ''}
                              onChange={(e) => setEditForm({ ...editForm, homeContact: { ...editForm.homeContact, [f]: e.target.value } })}
                              className="h-7 text-sm flex-1"
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <>
                        <DetailRow large label="Phone" value={details.homeContact.phone} />
                        <DetailRow large label="Fax" value={details.homeContact.fax} />
                        <DetailRow large label="Cell" value={details.homeContact.cell} />
                        <DetailRow large label="E-mail" value={details.homeContact.email} />
                        <DetailRow large label="Residential Address" value={details.homeContact.residentialAddress} />
                      </>
                    )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            {/* Review outcome — only shown to the submitter: Admin Assistant when they submitted, Admin when they submitted. Both Super Admin and Admin can approve/decline (whoever does it first). */}
            {selectedRepresentativeId && (() => {
              const reviewOutcome = getReviewOutcomeForRep(selectedRepresentativeId);
              if (!reviewOutcome || (reviewOutcome.accepted.length === 0 && reviewOutcome.rejected.length === 0)) return null;
              if (reviewOutcome.submittedByRole == null || reviewOutcome.submittedByRole !== role) return null;
              if (dismissedReviewOutcomeRepIds.includes(selectedRepresentativeId)) return null;
              const submittedText = reviewOutcome.submittedAt
                ? new Date(reviewOutcome.submittedAt).toLocaleDateString(undefined, { dateStyle: 'medium' }) + ' at ' + new Date(reviewOutcome.submittedAt).toLocaleTimeString(undefined, { timeStyle: 'short' })
                : '';
              return (
                <div className="mt-2 w-full">
                  <Card className="border border-blue-200/80 bg-blue-50/30 w-full relative">
                    <CardHeader className="py-3 px-4 pr-10 border-b border-blue-200/60">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-7 w-7 text-gray-500 hover:text-gray-700 hover:bg-blue-100/50 rounded-full"
                        onClick={() => setDismissedReviewOutcomeRepIds((prev) => (prev.includes(selectedRepresentativeId!) ? prev : [...prev, selectedRepresentativeId!]))}
                        aria-label="Close notice"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <CardTitle className="text-sm font-semibold text-gray-900">Review outcome — your submission</CardTitle>
                      {submittedText && (
                        <p className="text-xs text-gray-600 font-normal mt-0.5">Submitted {submittedText}</p>
                      )}
                      <p className="text-xs text-gray-500 font-normal mt-1">Summary of what was accepted and rejected by the reviewer.</p>
                    </CardHeader>
                    <CardContent className="px-4 py-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="rounded-lg border border-green-200 bg-green-50/50 p-3">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-green-800 mb-2 flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5" />
                            Accepted ({reviewOutcome.accepted.length})
                          </h4>
                          {reviewOutcome.accepted.length === 0 ? (
                            <p className="text-xs text-green-700/80">No fields were accepted.</p>
                          ) : (
                            <ul className="text-xs text-green-800 space-y-1">
                              {reviewOutcome.accepted.map((a, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <span className="h-1.5 w-1.5 rounded-full bg-green-600 shrink-0" />
                                  {a.label}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        <div className="rounded-lg border border-red-200 bg-red-50/50 p-3 flex flex-col">
                          <h4 className="text-xs font-semibold uppercase tracking-wider text-red-800 mb-2 flex items-center gap-1.5">
                            <XCircle className="h-3.5 w-3.5" />
                            Rejected ({reviewOutcome.rejected.length})
                          </h4>
                          {reviewOutcome.rejected.length === 0 ? (
                            <p className="text-xs text-red-700/80">No fields were rejected.</p>
                          ) : (
                            <ul className="text-xs text-red-800 space-y-2 flex-1">
                              {reviewOutcome.rejected.map((r, i) => (
                                <li key={i} className="flex flex-col gap-0.5">
                                  <span className="font-medium">{r.label}</span>
                                  {r.reason && <span className="text-red-700/90 pl-3 border-l-2 border-red-200">{r.reason}</span>}
                                </li>
                              ))}
                            </ul>
                          )}
                          {reviewOutcome.rejected.length > 0 && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              className="mt-3 w-full sm:w-auto border-red-200 text-red-700 hover:bg-red-50 hover:border-red-300"
                            >
                              Contact administrator
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })()}
            {/* Tiles underneath: 3-column grid aligned with top (Details | Addresses | quads) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 items-start">
              <div className="flex flex-col gap-2 lg:col-span-2">
                <Card className="border border-gray-200 shadow-sm w-full p-0">
                  <ReadOnlyTileHeader title="My Documents" />
                  <CardContent className="px-3 pb-3">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50">
                          <TableHead className="text-xs h-8 py-1.5">By</TableHead>
                          <TableHead className="text-xs h-8 py-1.5">Date</TableHead>
                          <TableHead className="text-xs h-8 py-1.5">Description</TableHead>
                          <TableHead className="text-xs h-8 py-1.5 w-14">View</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {details.documents.slice(0, 3).map((doc, i) => (
                          <TableRow key={i} className="border-b border-gray-100">
                            <TableCell className="text-xs py-1.5">{doc.uploadedBy || '—'}</TableCell>
                            <TableCell className="text-xs py-1.5">{doc.dateCreated}</TableCell>
                            <TableCell className="text-xs py-1.5 min-w-[120px]">{doc.description}</TableCell>
                            <TableCell className="py-1.5"><Button variant="ghost" size="sm" className="h-6 text-xs px-1">View</Button></TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
                <div className="flex flex-row gap-2">
                  <Card className="border border-gray-200 shadow-sm flex-1 min-w-0 p-0 transition-[min-height] duration-150 ease-out">
                    <TileHeader tileId="maximums" title="Maximums" />
                    <CardContent className="px-3 pb-3 min-h-[88px]">
                      <div className="min-h-[72px] transition-opacity duration-150 ease-out">
                      {editingTile === 'maximums' && editForm ? (
                        <div className="space-y-1.5 text-sm">
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium text-gray-700 w-36 shrink-0">Dealer Maximums</Label>
                            <Input value={editForm.dealerMaximums ?? ''} onChange={(e) => setEditForm({ ...editForm, dealerMaximums: e.target.value })} className="h-7 text-sm flex-1" />
                          </div>
                          <div className="flex items-center gap-2">
                            <Label className="text-sm font-medium text-gray-700 w-36 shrink-0">Manager Maximums</Label>
                            <Input value={editForm.managerMaximums ?? ''} onChange={(e) => setEditForm({ ...editForm, managerMaximums: e.target.value })} className="h-7 text-sm flex-1" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <DetailRow large label="Dealer Maximums" value={details.dealerMaximums} />
                          <DetailRow large label="Manager Maximums" value={details.managerMaximums} />
                        </>
                      )}
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="border border-gray-200 shadow-sm flex-1 min-w-0 p-0">
                    <ReadOnlyTileHeader title="Photo" />
                    <CardContent className="w-full min-h-[88px] px-3 pb-3 flex flex-col justify-center items-center">
                      <div className="flex flex-row items-center justify-center gap-2 flex-wrap w-full">
                        <Button variant="outline" size="sm" className="h-8 text-sm px-3 shrink-0">+ Choose</Button>
                        <Button variant="outline" size="sm" className="h-8 text-sm px-3 shrink-0">Upload</Button>
                        <Button size="sm" className="h-8 text-sm px-3 shrink-0">Update Photo</Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            </>
            )}
          </>
        ) : null}
      </div>

      {/* Reject pending changes modal */}
      <Dialog open={rejectOpen} onOpenChange={setRejectOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reject changes</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting these changes. This comment may be shared with the submitter.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reject-comment">Comment (required)</Label>
              <Textarea
                id="reject-comment"
                placeholder="Reason for rejection..."
                value={rejectComment}
                onChange={(e) => setRejectComment(e.target.value)}
                rows={3}
                className="resize-none"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectConfirm} disabled={!rejectComment.trim()}>
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Per-field reject reason dialog */}
      <Dialog
        open={!!rejectFieldDialog}
        onOpenChange={(open) => {
          if (!open) {
            setRejectFieldDialog(null);
            setRejectFieldReason('');
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              Reject change
            </DialogTitle>
            <DialogDescription>
              {rejectFieldDialog && (
                <>
                  Provide a reason for rejecting the proposed value for <strong>{rejectFieldDialog.label}</strong>. You can still approve other fields and submit.
                </>
              )}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-3 py-2">
            <Label htmlFor="reject-field-reason">Reason (required)</Label>
            <Textarea
              id="reject-field-reason"
              placeholder="e.g. Invalid format, incorrect information..."
              value={rejectFieldReason}
              onChange={(e) => setRejectFieldReason(e.target.value)}
              rows={3}
              className="resize-none"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setRejectFieldDialog(null); setRejectFieldReason(''); }}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRejectFieldConfirm} disabled={!rejectFieldReason.trim()}>
              Reject this field
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite User modal */}
      <Dialog open={inviteOpen} onOpenChange={setInviteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite User</DialogTitle>
            <DialogDescription>
              Send an invitation to a new user. They will receive an email to set their password and access the console.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="invite-name">Name</Label>
              <Input
                id="invite-name"
                placeholder="Full name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                placeholder="email@example.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              {canManageAdmins ? (
                <Select value={inviteRole} onValueChange={(v) => setInviteRole(v as UserRole)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {rolesForInvite.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <>
                  <div className="flex h-9 w-full items-center rounded-md border border-input bg-muted/50 px-3 text-sm font-medium text-gray-800">
                    {ASSISTANT_ROLE}
                  </div>
                  <p className="text-xs text-gray-500">You can only invite users as Administrator Assistant.</p>
                </>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setInviteOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteSubmit}>Send Invite</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Invite sent confirmation */}
      <Dialog open={inviteSentOpen} onOpenChange={(open) => { setInviteSentOpen(open); if (!open) setInviteSentInfo(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Invite sent</DialogTitle>
            <DialogDescription>
              An invitation has been sent. The following user will receive an email to set their password and access the console.
            </DialogDescription>
          </DialogHeader>
          {inviteSentInfo && (
            <div className="rounded-lg border border-gray-200 bg-gray-50/80 py-3 px-4 space-y-2">
              <div className="flex justify-between gap-2 text-sm">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-900">{inviteSentInfo.name}</span>
              </div>
              <div className="flex justify-between gap-2 text-sm">
                <span className="text-gray-500">Email</span>
                <span className="font-medium text-gray-900">{inviteSentInfo.email}</span>
              </div>
              <div className="flex justify-between gap-2 text-sm">
                <span className="text-gray-500">Role</span>
                <span className="font-medium text-gray-900">{inviteSentInfo.role}</span>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => { setInviteSentOpen(false); setInviteSentInfo(null); }}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Role modal */}
      <Dialog open={editRoleOpen} onOpenChange={setEditRoleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Role</DialogTitle>
            <DialogDescription>
              Change the role for {selectedUser?.name}. This will update their permissions.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>User</Label>
              <Input value={selectedUser?.name ?? ''} disabled className="bg-gray-50" />
            </div>
            <div className="grid gap-2">
              <Label>Role</Label>
              <Select value={editRoleValue} onValueChange={(v) => setEditRoleValue(v as UserRole)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {rolesForEdit.map((role) => (
                    <SelectItem key={role} value={role}>
                      {role}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditRoleOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRoleSubmit}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Disable User modal */}
      <Dialog open={disableOpen} onOpenChange={setDisableOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Disable User</DialogTitle>
            <DialogDescription>
              Disable access for {selectedUser?.name}. They will no longer be able to sign in. You can re-enable them later.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600">
              User: <span className="font-medium text-gray-900">{selectedUser?.name}</span>
              <br />
              Email: <span className="text-gray-600">{selectedUser?.email}</span>
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisableOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDisableSubmit}>
              Disable User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default UsersAccess;
