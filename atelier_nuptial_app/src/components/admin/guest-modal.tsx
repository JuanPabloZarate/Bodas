// src/components/admin/guest-modal.tsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  Bus,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Guest, SeatingTable, AttendanceStatus } from '@/lib/types';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

export interface GuestModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'add' | 'edit';
  guest?: Guest | null;
  tables: SeatingTable[];
  onSave: (guestData: Omit<Guest, 'id' | 'updatedAt'> & { id?: string }) => void;
}

export function generatePasscode(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts
    .map((p) => p[0]?.toUpperCase())
    .filter(Boolean)
    .join('')
    .slice(0, 2) || 'GP';
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${initials}-${rand}`;
}

const COMMON_DIETARY_OPTIONS = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Nut Allergy',
  'Dairy-Free',
  'Pescatarian',
];

export function GuestModal({
  isOpen,
  onClose,
  mode,
  guest,
  tables,
  onSave,
}: GuestModalProps) {
  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState<string>('General');
  const [partySize, setPartySize] = useState<number>(1);
  const [hasCompanion, setHasCompanion] = useState<boolean>(false);
  const [companionName, setCompanionName] = useState('');
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [tableId, setTableId] = useState<string>('unassigned');
  const [suite, setSuite] = useState('');
  const [status, setStatus] = useState<AttendanceStatus>('pending');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [shuttleReserved, setShuttleReserved] = useState(false);
  const [isVip, setIsVip] = useState(false);
  const [validationError, setValidationError] = useState('');

  // Prepopulate form on mount or guest change
  useEffect(() => {
    if (mode === 'edit' && guest) {
      setName(guest.name || '');
      setCategory(guest.category || 'General');
      setPartySize(guest.partySize ?? 1);
      setHasCompanion(Boolean(guest.companionName || (guest.partySize && guest.partySize > 1)));
      setCompanionName(guest.companionName || '');
      setEmail(guest.email || '');
      setPasscode(guest.passcode || generatePasscode(guest.name || ''));
      setTableId(guest.tableId || 'unassigned');
      setSuite(guest.suite || '');
      setStatus(guest.status || 'pending');
      setSelectedDiets(guest.dietaryRestrictions || []);
      setDietaryNotes(guest.dietaryNotes || '');
      setShuttleReserved(Boolean(guest.shuttleReserved));
      setIsVip(Boolean(guest.isVip));
      setValidationError('');
    } else {
      // Add mode defaults
      setName('');
      setCategory('General');
      setPartySize(1);
      setHasCompanion(false);
      setCompanionName('');
      setEmail('');
      setPasscode(generatePasscode('Guest Pass'));
      setTableId('unassigned');
      setSuite('');
      setStatus('pending');
      setSelectedDiets([]);
      setDietaryNotes('');
      setShuttleReserved(false);
      setIsVip(false);
      setValidationError('');
    }
  }, [mode, guest, isOpen]);

  // Handle Passcode regeneration
  const handleRegeneratePasscode = useCallback(() => {
    setPasscode(generatePasscode(name || 'Guest Pass'));
  }, [name]);

  // Handle dietary checkbox toggle
  const toggleDiet = (diet: string) => {
    setSelectedDiets((prev) =>
      prev.includes(diet) ? prev.filter((d) => d !== diet) : [...prev, diet]
    );
  };

  // Submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setValidationError('Please provide the full name of the guest.');
      return;
    }

    const matchedTable = tables.find((t) => t.id === tableId);
    const resolvedTableName =
      tableId && tableId !== 'unassigned'
        ? matchedTable
          ? matchedTable.name
          : tableId
        : 'Unassigned';

    const finalPartySize = hasCompanion && partySize < 2 ? 2 : partySize;

    onSave({
      ...(guest?.id ? { id: guest.id } : {}),
      name: name.trim(),
      household: guest?.household || name.trim(),
      category,
      partySize: finalPartySize,
      companionName: hasCompanion ? companionName.trim() || undefined : undefined,
      email: email.trim() || undefined,
      passcode: passcode.trim() || generatePasscode(name.trim()),
      tableId: tableId === 'unassigned' ? undefined : tableId,
      tableName: resolvedTableName,
      suite: suite.trim() || undefined,
      status,
      dietaryRestrictions: selectedDiets,
      dietaryNotes: dietaryNotes.trim() || undefined,
      shuttleReserved,
      isVip,
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      kicker="Atelier Concierge"
      title={mode === 'add' ? 'Register & Invite New Guest' : 'Edit Guest Record'}
      description="Issue personalized digital stationery and assign reception arrangements."
      maxWidth="2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {validationError && (
          <div className="p-3 rounded-xl bg-error-container text-on-error-container text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-error" />
            <span>{validationError}</span>
          </div>
        )}

        {/* 1. Full Name & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="guest-name"
              className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1 font-semibold"
            >
              Full Name &amp; Title *
            </label>
            <input
              id="guest-name"
              type="text"
              required
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (validationError) setValidationError('');
              }}
              placeholder="e.g. Donna Isabella De Luca"
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="guest-category"
              className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1 font-semibold"
            >
              Guest Category / Group
            </label>
            <select
              id="guest-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none transition-colors"
            >
              <option value="VIP Family">VIP Family</option>
              <option value="Close Friends">Close Friends &amp; Bridal Party</option>
              <option value="International">International Guests</option>
              <option value="Colleagues">Colleagues &amp; Professional</option>
              <option value="General">General Honored Guest</option>
            </select>
          </div>
        </div>

        {/* 2. Reserved Seats, Plus-One Toggle & VIP Toggle */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
          <div>
            <label
              htmlFor="guest-seats"
              className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1 font-semibold"
            >
              Number of Reserved Seats
            </label>
            <select
              id="guest-seats"
              value={partySize}
              onChange={(e) => {
                const val = Number(e.target.value);
                setPartySize(val);
                if (val > 1) setHasCompanion(true);
              }}
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none transition-colors"
            >
              <option value={1}>1 Seat (Individual)</option>
              <option value={2}>2 Seats (Guest + Companion)</option>
              <option value={3}>3 Seats (Family with Child)</option>
              <option value={4}>4 Seats (Family Unit)</option>
            </select>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-on-surface">
              <input
                id="plus-one-toggle"
                type="checkbox"
                checked={hasCompanion}
                onChange={(e) => {
                  setHasCompanion(e.target.checked);
                  if (e.target.checked && partySize < 2) setPartySize(2);
                }}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
              <span className="font-medium">Allow Companion / Plus-One</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-on-surface">
              <input
                id="vip-toggle"
                type="checkbox"
                checked={isVip}
                onChange={(e) => setIsVip(e.target.checked)}
                className="w-4 h-4 accent-primary rounded cursor-pointer"
              />
              <span className="font-medium">Designate as VIP Guest</span>
            </label>
          </div>
        </div>

        {/* Companion Name (if enabled) */}
        {hasCompanion && (
          <div>
            <label
              htmlFor="companion-name"
              className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1"
            >
              Companion / Plus-One Name
            </label>
            <input
              id="companion-name"
              type="text"
              value={companionName}
              onChange={(e) => setCompanionName(e.target.value)}
              placeholder="e.g. Camilla Rossi"
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none transition-colors"
            />
          </div>
        )}

        {/* 3. Contact Email & Passcode Generator */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="guest-contact"
              className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1 font-semibold"
            >
              Contact Email or Phone
            </label>
            <input
              id="guest-contact"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="isabella@atelierdeluca.it"
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none transition-colors"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="guest-passcode"
                className="font-label-uppercase text-[11px] text-outline uppercase tracking-wider font-semibold"
              >
                Passcode Code
              </label>
              <button
                type="button"
                onClick={handleRegeneratePasscode}
                className="font-label-uppercase text-[10px] text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Regenerate</span>
              </button>
            </div>
            <input
              id="guest-passcode"
              type="text"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="JP-8421"
              className="w-full px-3 py-2 bg-surface-container-high rounded-lg text-sm text-secondary font-mono tracking-wider border border-transparent focus:border-primary focus:outline-none transition-colors"
            />
          </div>
        </div>

        {/* 4. Table Assignment & RSVP Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="guest-table"
              className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1 font-semibold"
            >
              Assigned Table
            </label>
            <select
              id="guest-table"
              value={tableId}
              onChange={(e) => setTableId(e.target.value)}
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none transition-colors"
            >
              <option value="unassigned">Unassigned (Assign Later)</option>
              {tables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.zone})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="guest-status"
              className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1 font-semibold"
            >
              RSVP Status
            </label>
            <select
              id="guest-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as AttendanceStatus)}
              className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none transition-colors"
            >
              <option value="confirmed">Confirmed (Attending)</option>
              <option value="pending">Pending RSVP (Awaiting)</option>
              <option value="declined">Declined (Sent Regrets)</option>
            </select>
          </div>
        </div>

        {/* 5. Suite & Accommodations */}
        <div>
          <label
            htmlFor="guest-suite"
            className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1 font-semibold"
          >
            Suite / Villa Accommodations
          </label>
          <input
            id="guest-suite"
            type="text"
            value={suite}
            onChange={(e) => setSuite(e.target.value)}
            placeholder="e.g. Suite Loggia N. 12 • Villa Bellissima West"
            className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none transition-colors"
          />
        </div>

        {/* 6. Dietary Restrictions Checkboxes & Notes */}
        <div>
          <label className="block font-label-uppercase text-[11px] text-outline uppercase tracking-wider mb-1.5 font-semibold">
            Dietary Advisories &amp; Allergies
          </label>
          <div className="flex flex-wrap gap-2 mb-2">
            {COMMON_DIETARY_OPTIONS.map((diet) => {
              const isChecked = selectedDiets.includes(diet);
              return (
                <button
                  key={diet}
                  type="button"
                  onClick={() => toggleDiet(diet)}
                  className={`px-3 py-1 rounded-full text-xs font-label-uppercase transition-all flex items-center gap-1.5 ${
                    isChecked
                      ? 'bg-primary text-on-primary shadow-xs font-medium'
                      : 'bg-surface-container-low text-secondary hover:bg-surface-container border border-surface-container-high'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3" />}
                  <span>{diet}</span>
                </button>
              );
            })}
          </div>
          <input
            id="guest-dietary"
            type="text"
            value={dietaryNotes}
            onChange={(e) => setDietaryNotes(e.target.value)}
            placeholder="Custom culinary notes (e.g. Severe pine nut allergy, prefers wine pairing)"
            className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-sm text-on-surface border border-transparent focus:border-primary focus:bg-surface-container focus:outline-none transition-colors"
          />
        </div>

        {/* 7. Shuttle Transport Toggle */}
        <div className="p-3.5 bg-surface-container-low rounded-xl flex items-center justify-between border border-surface-container-high/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary-fixed text-primary shrink-0">
              <Bus className="w-5 h-5" />
            </div>
            <div>
              <label
                htmlFor="shuttle-toggle"
                className="font-medium text-xs md:text-sm text-on-surface block cursor-pointer select-none"
              >
                Reserve Florence ↔ Villa Shuttle
              </label>
              <div className="text-[11px] text-outline">
                Complimentary round-trip transport pickup from Florence SMN (14:30)
              </div>
            </div>
          </div>
          <input
            id="shuttle-toggle"
            type="checkbox"
            checked={shuttleReserved}
            onChange={(e) => setShuttleReserved(e.target.checked)}
            className="w-5 h-5 accent-primary rounded cursor-pointer"
          />
        </div>

        {/* 8. Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-end gap-2 pt-4 border-t border-surface-container-low">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="w-full sm:w-auto text-xs font-label-uppercase tracking-wider"
          >
            Cancel / Save as Draft
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="w-full sm:w-auto text-xs font-label-uppercase tracking-wider shadow-sm"
          >
            {mode === 'add' ? 'Save & Send Digital Invitation' : 'Update Guest Record'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
