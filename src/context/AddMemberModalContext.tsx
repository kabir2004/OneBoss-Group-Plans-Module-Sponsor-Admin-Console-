import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

type AddMemberForm = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  sin: string;
  street: string;
  city: string;
  province: string;
  postalCode: string;
  country: string;
};

const initialForm: AddMemberForm = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  sin: '',
  street: '',
  city: '',
  province: '',
  postalCode: '',
  country: 'Canada',
};

interface AddMemberModalContextType {
  openAddMemberModal: () => void;
}

const AddMemberModalContext = createContext<AddMemberModalContextType | undefined>(undefined);

export function AddMemberModalProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<AddMemberForm>(initialForm);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submittedData, setSubmittedData] = useState<AddMemberForm | null>(null);

  const openAddMemberModal = () => setOpen(true);

  const update = (field: keyof AddMemberForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    setSubmittedData({ ...form });
    setForm(initialForm);
    setOpen(false);
    setConfirmOpen(true);
  };

  const handleClose = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setForm(initialForm);
  };

  const handleConfirmDone = () => {
    setConfirmOpen(false);
    setSubmittedData(null);
  };

  return (
    <AddMemberModalContext.Provider value={{ openAddMemberModal }}>
      {children}
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Member To Group Plan</DialogTitle>
            <DialogDescription>
              Enter The Member&apos;s Information. All Fields Are Required To Add Someone To The Group Plan.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="member-first-name">First Name</Label>
                <Input
                  id="member-first-name"
                  value={form.firstName}
                  onChange={(e) => update('firstName', e.target.value)}
                  placeholder="First Name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="member-last-name">Last Name</Label>
                <Input
                  id="member-last-name"
                  value={form.lastName}
                  onChange={(e) => update('lastName', e.target.value)}
                  placeholder="Last Name"
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-email">Email</Label>
              <Input
                id="member-email"
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="email@example.com"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-phone">Phone</Label>
              <Input
                id="member-phone"
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                placeholder="(555) 555-5555"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="member-sin">SIN (Social Insurance Number)</Label>
              <Input
                id="member-sin"
                value={form.sin}
                onChange={(e) => update('sin', e.target.value)}
                placeholder="XXX-XXX-XXX"
              />
            </div>
            <div className="border-t pt-4 mt-1">
              <p className="text-sm font-medium text-gray-700 mb-3">Address</p>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="member-street">Street Address</Label>
                  <Input
                    id="member-street"
                    value={form.street}
                    onChange={(e) => update('street', e.target.value)}
                    placeholder="Street Address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="member-city">City</Label>
                    <Input
                      id="member-city"
                      value={form.city}
                      onChange={(e) => update('city', e.target.value)}
                      placeholder="City"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="member-province">Province</Label>
                    <Input
                      id="member-province"
                      value={form.province}
                      onChange={(e) => update('province', e.target.value)}
                      placeholder="Province"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="member-postal">Postal Code</Label>
                    <Input
                      id="member-postal"
                      value={form.postalCode}
                      onChange={(e) => update('postalCode', e.target.value)}
                      placeholder="A1A 1A1"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="member-country">Country</Label>
                    <Input
                      id="member-country"
                      value={form.country}
                      onChange={(e) => update('country', e.target.value)}
                      placeholder="Country"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit}>Add To Group Plan</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={confirmOpen} onOpenChange={(isOpen) => { setConfirmOpen(isOpen); if (!isOpen) setSubmittedData(null); }}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Member Added To Group Plan</DialogTitle>
          </DialogHeader>
          {submittedData && (
            <div className="rounded-lg border border-gray-200 bg-gray-50/80 py-3 px-4 space-y-3">
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Name</span>
                  <span className="font-medium text-gray-900">{submittedData.firstName} {submittedData.lastName}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900">{submittedData.email}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">Phone</span>
                  <span className="font-medium text-gray-900">{submittedData.phone || '—'}</span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-gray-500">SIN</span>
                  <span className="font-medium text-gray-900">{submittedData.sin || '—'}</span>
                </div>
              </div>
              <div className="border-t border-gray-200 pt-3 mt-1">
                <p className="text-xs font-medium text-gray-500 mb-2">Address</p>
                <div className="text-sm text-gray-900">
                  <div>{submittedData.street || '—'}</div>
                  <div>{[submittedData.city, submittedData.province, submittedData.postalCode].filter(Boolean).join(', ') || '—'}</div>
                  <div>{submittedData.country || '—'}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={handleConfirmDone}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AddMemberModalContext.Provider>
  );
}

export function useAddMemberModal() {
  const context = useContext(AddMemberModalContext);
  if (context === undefined) {
    throw new Error('useAddMemberModal must be used within an AddMemberModalProvider');
  }
  return context;
}
