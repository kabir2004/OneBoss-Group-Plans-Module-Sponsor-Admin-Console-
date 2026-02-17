import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '@/components/layout/PageLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useRoles } from '@/context/RoleContext';
import { useRolePermissions } from '@/context/RolePermissionsContext';
import { ChevronUp, ChevronDown, Plus, Trash2, GripVertical } from 'lucide-react';

export default function RoleManagement() {
  const navigate = useNavigate();
  const { isSuperAdmin } = useRolePermissions();
  const {
    rolesOrdered,
    addRole,
    updateRole,
    removeRole,
    moveRole,
    getRoleById,
  } = useRoles();

  const [addOpen, setAddOpen] = useState(false);
  const [newRoleName, setNewRoleName] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  useEffect(() => {
    if (!isSuperAdmin) navigate('/', { replace: true });
  }, [isSuperAdmin, navigate]);

  if (!isSuperAdmin) return null;

  const handleAdd = () => {
    const name = newRoleName.trim();
    if (!name) return;
    try {
      addRole(name);
      setNewRoleName('');
      setAddOpen(false);
    } catch {
      // validation error
    }
  };

  const handleStartEdit = (id: string) => {
    const role = getRoleById(id);
    if (role && id !== 'super-admin') {
      setEditId(id);
      setEditName(role.name);
    }
  };

  const handleSaveEdit = () => {
    if (editId && editName.trim()) {
      updateRole(editId, editName.trim());
      setEditId(null);
      setEditName('');
    }
  };

  const handleMoveUp = (id: string) => {
    const idx = rolesOrdered.findIndex((r) => r.id === id);
    if (idx > 1) moveRole(id, idx - 1);
  };

  const handleMoveDown = (id: string) => {
    const idx = rolesOrdered.findIndex((r) => r.id === id);
    if (idx >= 1 && idx < rolesOrdered.length - 1) moveRole(id, idx + 1);
  };

  return (
    <PageLayout title="Role Management">
      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>Role hierarchy</CardTitle>
          <CardDescription>
            Create custom roles and drag them into position. The top role is Super Administrator; all other roles sit below it. Order determines who can see and manage whom in the Administrator section.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-end">
            <Button onClick={() => setAddOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Add role
            </Button>
          </div>

          <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
            {rolesOrdered.map((role, index) => (
              <div
                key={role.id}
                className="flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50/50 transition-colors"
              >
                <div className="flex flex-col text-gray-400">
                  <button
                    type="button"
                    onClick={() => handleMoveUp(role.id)}
                    disabled={index <= 1}
                    className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="Move up"
                  >
                    <ChevronUp className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMoveDown(role.id)}
                    disabled={index === 0 || index >= rolesOrdered.length - 1}
                    className="p-0.5 rounded hover:bg-gray-200 disabled:opacity-30 disabled:hover:bg-transparent"
                    aria-label="Move down"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
                <GripVertical className="h-4 w-4 text-gray-400 shrink-0" aria-hidden />
                <div className="flex-1 min-w-0">
                  {editId === role.id ? (
                    <Input
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={handleSaveEdit}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit();
                        if (e.key === 'Escape') {
                          setEditId(null);
                          setEditName('');
                        }
                      }}
                      className="h-8"
                      autoFocus
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStartEdit(role.id)}
                      className="text-left font-medium text-gray-900 hover:underline truncate block w-full"
                    >
                      {role.name}
                    </button>
                  )}
                </div>
                <span className="text-xs text-gray-500 shrink-0">Position {index + 1}</span>
                {role.id !== 'super-admin' && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                    onClick={() => removeRole(role.id)}
                    aria-label={`Delete ${role.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add role</DialogTitle>
            <DialogDescription>
              Create a new role. It will be added at the bottom of the hierarchy; you can move it up or down afterward.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="new-role-name">Role name</Label>
              <Input
                id="new-role-name"
                placeholder="e.g. Payroll Coordinator"
                value={newRoleName}
                onChange={(e) => setNewRoleName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAdd} disabled={!newRoleName.trim()}>
              Add role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
}
