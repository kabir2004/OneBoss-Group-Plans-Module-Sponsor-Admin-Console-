import { useState, useEffect, useMemo } from 'react';
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
import { useInterface } from '@/context/InterfaceContext';
import { useRoles } from '@/context/RoleContext';
import { usePendingMemberChanges } from '@/context/PendingMemberChangesContext';
import type { ProposedMemberEdits, PendingChange, SubmitterRole, ReviewOutcome } from '@/context/PendingMemberChangesContext';
import { getRepresentativeDetails } from '@/data/representativeDetails';

/** List of 6 people shown under "+ Administrator" on Administrator page (sidebar). role = role id from RoleContext. */
type UsersAccessRep = { id: string; name: string; status: string; role: string; email: string; city: string; province: string; accountNumber: string };
const USERS_ACCESS_REPRESENTATIVES: UsersAccessRep[] = [
  { id: 'UA1', name: 'Morgan Reeves', role: 'super-admin', email: 'morgan.reeves@example.com', city: 'Calgary', province: 'AB', accountNumber: 'UA1', status: 'Active' },
  { id: 'UA2', name: 'Jordan Blake', role: 'admin', email: 'jordan.blake@example.com', city: 'Halifax', province: 'NS', accountNumber: 'UA2', status: 'Active' },
  { id: 'UA3', name: 'Riley Sutton', role: 'admin', email: 'riley.sutton@example.com', city: 'Winnipeg', province: 'MB', accountNumber: 'UA3', status: 'Active' },
  { id: 'UA4', name: 'Casey Quinn', role: 'admin-assistant', email: 'casey.quinn@example.com', city: 'Edmonton', province: 'AB', accountNumber: 'UA4', status: 'Active' },
  { id: 'UA5', name: 'Skyler Hayes', role: 'admin-assistant', email: 'skyler.hayes@example.com', city: 'Ottawa', province: 'ON', accountNumber: 'UA5', status: 'Active' },
  { id: 'UA6', name: 'Avery Cross', role: 'admin-assistant', email: 'avery.cross@example.com', city: 'Victoria', province: 'BC', accountNumber: 'UA6', status: 'Active' },
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
  const { currentInterface } = useInterface();
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
  const [roleOverrides, setRoleOverrides] = useState<Record<string, string>>({});
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
  const { getRoleOrder, getRolesBelow, getRoleById } = useRoles();

  useEffect(() => {
    if (!canViewUsersAccess) navigate('/', { replace: true });
  }, [canViewUsersAccess, navigate]);

  const currentUserOrder = getRoleOrder(currentInterface);
  const filteredAdminReps = useMemo(() => {
    return USERS_ACCESS_REPRESENTATIVES.filter((r) => {
      const repRoleId = roleOverrides[r.id] ?? r.role;
      return getRoleOrder(repRoleId) > currentUserOrder;
    });
  }, [currentInterface, currentUserOrder, roleOverrides, getRoleOrder]);

  useEffect(() => {
    const list = filteredAdminReps.map((c) => ({
      id: c.id,
      name: c.name,
      status: c.status,
      role: roleOverrides[c.id] ?? c.role,
    }));
    setRepresentativesCount(list.length);
    setRepresentativesList(list);
  }, [filteredAdminReps, roleOverrides, setRepresentativesCount, setRepresentativesList]);

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
  const effectiveRoleId: string | null = selectedClient ? (roleOverrides[selectedClient.id] ?? selectedClient.role) : null;
  const assignableRoles = getRolesBelow(currentInterface);
  const canChangeRole = assignableRoles.length > 0 && selectedClient && effectiveRoleId != null;
  const effectiveRoleDisplayName = effectiveRoleId ? getRoleById(effectiveRoleId)?.name ?? effectiveRoleId : '—';

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
          {(['surname', 'name', 'dateOfBirth', 'startDate', 'endDate', 'note'] as const).map((key) => (
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
        ) : baseDetails && selectedClient ? (
          <>
            <div className="border-b border-gray-200 pb-2 mb-3">
              <h2 className="text-sm font-semibold text-gray-900">
                {baseDetails.surname}, {baseDetails.name}
              </h2>
            </div>
            <Card className="border border-gray-200 shadow-sm max-w-md">
              <CardContent className="pt-4 pb-4 px-4 space-y-4">
                <DetailRow large label="First name" value={baseDetails.name} />
                <DetailRow large label="Last name" value={baseDetails.surname} />
                <DetailRow large label="Role" value={effectiveRoleDisplayName} />
                {canChangeRole && (
                  <div className="space-y-2 pt-1">
                    <Label className="text-sm font-medium text-gray-700">Change role</Label>
                    <Select
                      value={effectiveRoleId!}
                      onValueChange={(value) => selectedRepresentativeId && setRoleOverrides((prev) => ({ ...prev, [selectedRepresentativeId]: value }))}
                    >
                      <SelectTrigger className="w-full max-w-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {assignableRoles.map((r) => (
                          <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </CardContent>
            </Card>
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
