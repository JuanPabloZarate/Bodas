'use client';

import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { useWeddingStore } from '@/context/wedding-store';
import { Modal } from '@/components/ui/modal';
import { Guest } from '@/lib/types';
import { showToast } from '@/components/ui/toast';
import { Utensils, AlertTriangle, Bus, Check, UserCheck } from 'lucide-react';

export interface DietaryUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  guest?: Guest;
  onSuccess?: () => void;
  onSave?: (updates: {
    dietaryRestrictions: string[];
    dietaryNotes: string;
    shuttleTime: string;
    shuttleReserved: boolean;
  }) => void;
}

const DIETARY_PRESETS = [
  'Pescatarian (Seafood & Vegetables)',
  'Standard Gourmet (All Tuscan courses)',
  'Strict Vegetarian',
  'Vegan',
  'Gluten-Free',
];

const DIETARY_TAGS: { id: string; label: string }[] = [
  { id: 'pescatarian', label: 'Pescatarian' },
  { id: 'vegetarian', label: 'Vegetarian' },
  { id: 'vegan', label: 'Vegan' },
  { id: 'gluten-free', label: 'Gluten-Free' },
  { id: 'nut-allergy', label: 'Nut Allergy' },
  { id: 'dairy-free', label: 'Dairy-Free' },
];

const SHUTTLE_OPTIONS = [
  'Confirmed 14:00 CET Shuttle (Florence SMN → Villa)',
  'Arriving via Private Rental Car (Gate access required)',
  'Request Alternative Transfer Time',
  'No Shuttle Needed',
];

export function DietaryUpdateModal({
  isOpen,
  onClose,
  guest: propGuest,
  onSuccess,
  onSave,
}: DietaryUpdateModalProps) {
  const { currentGuest, updateGuest } = useWeddingStore();
  const guest = propGuest || currentGuest;

  const hasCompanion = (guest?.partySize ?? 1) > 1;
  const companionFallback = (guest?.passcode === 'JP-8421' || !guest) ? 'Sofia Rossi' : '';
  const initialCompanionName = hasCompanion ? (guest?.companionName || companionFallback) : '';

  // Controlled form state
  const [partySize, setPartySize] = useState<number>(guest?.partySize ?? (hasCompanion ? 2 : 1));
  const [companionName, setCompanionName] = useState<string>(initialCompanionName);
  const [selectedPreset, setSelectedPreset] = useState<string>(DIETARY_PRESETS[0]);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    guest?.dietaryRestrictions || ['pescatarian', 'nut-allergy']
  );
  const [allergiesNotes, setAllergiesNotes] = useState<string>(
    guest?.dietaryNotes || (hasCompanion ? 'Tree nut allergy • Sofia: None' : 'Tree nut allergy')
  );
  const [shuttleOption, setShuttleOption] = useState<string>(
    guest?.shuttleTime ? SHUTTLE_OPTIONS[0] : SHUTTLE_OPTIONS[0]
  );
  const [isSaved, setIsSaved] = useState(false);

  // Sync state if guest changes
  useEffect(() => {
    if (guest && isOpen) {
      const guestHasCompanion = (guest.partySize ?? 1) > 1;
      const guestCompanionFallback = (guest.passcode === 'JP-8421' || !guest) ? 'Sofia Rossi' : '';
      setPartySize(guest.partySize ?? (guestHasCompanion ? 2 : 1));
      setCompanionName(guestHasCompanion ? (guest.companionName || guestCompanionFallback) : '');
      setSelectedTags(guest.dietaryRestrictions || ['pescatarian', 'nut-allergy']);
      setAllergiesNotes(guest.dietaryNotes || (guestHasCompanion ? 'Tree nut allergy • Sofia: None' : 'Tree nut allergy'));
    }
  }, [guest, isOpen]);

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((t) => t !== tagId) : [...prev, tagId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guest) return;

    const isShuttleConfirmed = !shuttleOption.includes('No Shuttle') && !shuttleOption.includes('Private Rental Car');
    const shuttleTime = isShuttleConfirmed ? '14:00 CET' : 'Self-Transfer';

    // Map selection to restrictions array
    const restrictions = [...selectedTags];
    if (selectedPreset.toLowerCase().includes('pescatarian') && !restrictions.includes('pescatarian')) {
      restrictions.push('pescatarian');
    }
    if (selectedPreset.toLowerCase().includes('vegetarian') && !restrictions.includes('vegetarian')) {
      restrictions.push('vegetarian');
    }
    if (selectedPreset.toLowerCase().includes('vegan') && !restrictions.includes('vegan')) {
      restrictions.push('vegan');
    }
    if (selectedPreset.toLowerCase().includes('gluten-free') && !restrictions.includes('gluten-free')) {
      restrictions.push('gluten-free');
    }
    if (allergiesNotes.toLowerCase().includes('nut') && !restrictions.includes('nut-allergy')) {
      restrictions.push('nut-allergy');
    }

    const updates = {
      partySize,
      companionName: partySize === 2 ? companionName : undefined,
      dietaryRestrictions: restrictions,
      dietaryNotes: allergiesNotes,
      shuttleReserved: isShuttleConfirmed,
      shuttleTime,
    };

    updateGuest(guest.id, updates);

    if (onSave) {
      onSave(updates);
    }

    setIsSaved(true);
    showToast('Guest and dietary details updated in the Villa Bellissima Concierge system.');

    setTimeout(() => {
      setIsSaved(false);
      onSuccess?.();
      onClose();
    }, 400);
  };

  const primaryName = guest?.name || 'Juan Pablo';
  const effectiveCompanion =
    (partySize > 1 || hasCompanion) &&
    (companionName || guest?.companionName || (guest?.passcode === 'JP-8421' || !guest ? 'Sofia' : ''));
  const modalTitleNames = effectiveCompanion
    ? `${primaryName} & ${effectiveCompanion.replace(' Rossi', '')}`
    : primaryName;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      kicker="Guest Concierge Form"
      title={`Update Notes for ${modalTitleNames}`}
      description="Update your catering preferences and shuttle logistics with the estate kitchen and transport captains."
      maxWidth="lg"
    >
      <form
        id="form-dietary"
        data-testid="form-dietary-notes"
        onSubmit={handleSubmit}
        className="flex flex-col gap-space-md"
      >
        {/* Success Alert */}
        {isSaved && (
          <div
            role="alert"
            className="p-3 bg-primary-fixed text-on-primary-fixed rounded-xl text-center font-body-sm text-body-sm flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4 text-primary" />
            <span>Preferences saved successfully to concierge!</span>
          </div>
        )}

        {/* 1. Companion / Attendance Toggle */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant font-semibold text-xs">
            Party Size &amp; Companion Attendance
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setPartySize(1)}
              className={cn(
                'py-2 px-3 rounded-lg text-xs font-label-uppercase uppercase tracking-wider border transition-all text-center cursor-pointer',
                partySize === 1
                  ? 'border-primary bg-primary text-on-primary font-semibold'
                  : 'border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container'
              )}
            >
              Just Myself (1 Guest)
            </button>
            <button
              type="button"
              onClick={() => setPartySize(2)}
              className={cn(
                'py-2 px-3 rounded-lg text-xs font-label-uppercase uppercase tracking-wider border transition-all text-center cursor-pointer',
                partySize === 2
                  ? 'border-primary bg-primary text-on-primary font-semibold'
                  : 'border-outline-variant/40 bg-surface-container-low text-on-surface hover:bg-surface-container'
              )}
            >
              2 Guests (With Companion)
            </button>
          </div>

          {partySize === 2 && (
            <div className="mt-2 flex flex-col gap-1">
              <label className="font-label-uppercase text-[11px] uppercase text-outline">
                Companion Full Name
              </label>
              <input
                type="text"
                value={companionName}
                onChange={(e) => setCompanionName(e.target.value)}
                placeholder="e.g. Sofia Rossi"
                className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-md outline-none focus:border-primary"
              />
            </div>
          )}
        </div>

        {/* 2. Dietary Preference Preset */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant font-semibold text-xs flex items-center gap-1">
            <Utensils className="w-3.5 h-3.5 text-secondary" />
            <span>Primary Dietary Category</span>
          </label>
          <select
            data-testid="dietary-pref-select"
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-md outline-none focus:border-primary"
          >
            {DIETARY_PRESETS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>

        {/* 3. Dietary Specific Tags / Chips */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-uppercase text-[11px] uppercase text-on-surface-variant">
            Specific Restrictions &amp; Intolerances
          </label>
          <div className="flex flex-wrap gap-1.5">
            {DIETARY_TAGS.map((tag) => {
              const isSelected = selectedTags.includes(tag.id);
              return (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={cn(
                    'px-3 py-1 rounded-full text-xs font-label-uppercase uppercase tracking-wider transition-all select-none cursor-pointer',
                    isSelected
                      ? 'bg-secondary text-on-secondary font-semibold shadow-sm'
                      : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                  )}
                >
                  {tag.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Allergies & Medical Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant font-semibold text-xs flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5 text-secondary" />
            <span>Allergies &amp; Medical Notes</span>
          </label>
          <input
            data-testid="dietary-notes-input"
            type="text"
            value={allergiesNotes}
            onChange={(e) => setAllergiesNotes(e.target.value)}
            placeholder="Tree nut allergy • Sofia: None"
            className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-md outline-none focus:border-primary"
          />
        </div>

        {/* 5. Shuttle Pick-Up Confirmation */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-uppercase text-label-uppercase uppercase text-on-surface-variant font-semibold text-xs flex items-center gap-1">
            <Bus className="w-3.5 h-3.5 text-primary" />
            <span>Shuttle Pick-Up Confirmation</span>
          </label>
          <select
            data-testid="shuttle-select"
            value={shuttleOption}
            onChange={(e) => setShuttleOption(e.target.value)}
            className="w-full p-2.5 rounded-lg bg-surface-container-low border border-outline-variant/40 text-on-surface text-body-md outline-none focus:border-primary"
          >
            {SHUTTLE_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-space-sm pt-space-xs mt-space-xs border-t border-outline-variant/20">
          <button
            type="button"
            id="btn-cancel-dietary"
            onClick={onClose}
            className="px-4 py-2 rounded-full font-label-uppercase text-label-uppercase uppercase text-on-surface-variant hover:bg-surface-container transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            data-testid="btn-save-dietary"
            className="px-6 py-2.5 rounded-full bg-primary hover:bg-primary-container text-on-primary font-label-uppercase text-label-uppercase uppercase font-medium shadow-sm transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <UserCheck className="w-4 h-4 text-on-primary" />
            <span>Save to Concierge</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
