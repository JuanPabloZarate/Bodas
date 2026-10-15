'use client';

import React, { useState, useEffect } from 'react';
import { useWeddingStore } from '@/context/wedding-store';
import { showToast } from '@/components/ui/toast';
import { AttendanceStatus } from '@/lib/types';
import { Check, Send, Music, CheckCircle2, RotateCcw, Bus, UserCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface RSVPSectionProps {
  className?: string;
  onSuccess?: () => void;
}

export function RSVPSection({ className, onSuccess }: RSVPSectionProps) {
  const { currentGuest, submitRSVP } = useWeddingStore();

  const [attendance, setAttendance] = useState<AttendanceStatus>('confirmed');
  const [partySize, setPartySize] = useState<number>(2);
  const [companionName, setCompanionName] = useState<string>('Sofia Rossi');
  const [selectedDiets, setSelectedDiets] = useState<string[]>([]);
  const [dietaryNotes, setDietaryNotes] = useState<string>('');
  const [songRequest, setSongRequest] = useState<string>('');
  const [shuttleReserved, setShuttleReserved] = useState<boolean>(true);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  // Sync with currentGuest on mount / changes
  useEffect(() => {
    if (currentGuest) {
      if (currentGuest.status === 'declined') {
        setAttendance('declined');
      } else {
        setAttendance('confirmed');
      }
      setPartySize(currentGuest.partySize || 2);
      if (currentGuest.companionName) {
        setCompanionName(currentGuest.companionName);
      }
      if (currentGuest.dietaryRestrictions && currentGuest.dietaryRestrictions.length > 0) {
        setSelectedDiets(currentGuest.dietaryRestrictions);
      }
      if (currentGuest.dietaryNotes) {
        setDietaryNotes(currentGuest.dietaryNotes);
      }
      if (currentGuest.songRequest) {
        setSongRequest(currentGuest.songRequest);
      }
      if (currentGuest.shuttleReserved !== undefined) {
        setShuttleReserved(currentGuest.shuttleReserved);
      }
    }
  }, [currentGuest]);

  const dietaryOptions = [
    { id: 'vegetarian', label: 'Vegetarian' },
    { id: 'vegan', label: 'Vegan' },
    { id: 'gluten-free', label: 'Gluten-Free' },
    { id: 'pescatarian', label: 'Pescatarian' },
    { id: 'nut-allergy', label: 'Nut Allergy' },
    { id: 'dairy-free', label: 'Dairy-Free' },
  ];

  const toggleDiet = (id: string) => {
    setSelectedDiets((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const isAttending = attendance === 'confirmed';

    submitRSVP({
      passcode: currentGuest.passcode,
      name: currentGuest.name,
      status: attendance,
      partySize: isAttending ? partySize : 1,
      companionName: isAttending ? (partySize === 2 ? companionName.trim() : undefined) : undefined,
      dietaryRestrictions: isAttending ? selectedDiets : [],
      dietaryNotes: isAttending ? dietaryNotes.trim() || undefined : undefined,
      shuttleReserved: isAttending ? shuttleReserved : false,
      songRequest: isAttending && songRequest.trim() ? songRequest.trim() : undefined,
    });

    setIsSubmitted(true);
    showToast(
      attendance === 'confirmed'
        ? 'RSVP received with immense gratitude!'
        : 'We will miss you deeply in Tuscany.'
    );
    if (onSuccess) onSuccess();
  };

  return (
    <section
      className={cn('w-full bg-surface-container-low py-space-xl transition-all', className)}
      id="rsvp"
      aria-label="RSVP and Attendance Confirmation"
    >
      <div className="max-w-[760px] mx-auto px-margin md:px-margin-tablet">
        {/* Section Header */}
        <div className="text-center mb-space-lg">
          <span className="font-label-uppercase text-label-uppercase text-secondary uppercase tracking-widest block mb-space-xs">
            Répondez S’il Vous Plaît
          </span>
          <h2 className="font-headline-lg text-headline-lg text-on-surface mb-space-xs">
            Confirm Your Attendance
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg mx-auto">
            Dear <span className="font-semibold text-on-surface">{currentGuest.name || 'Juan Pablo'}</span>, kindly confirm your presence before October 15, 2026 for our celebration in Tuscany.
          </p>
        </div>

        {/* Formal Stationery Card Frame */}
        <Card
          surface="ivory"
          shadow="ambient"
          border
          className="p-space-lg md:p-space-xl relative overflow-hidden"
        >
          {/* Guest Allocation Header Strip */}
          <div className="flex flex-wrap items-center justify-between gap-space-sm p-space-md mb-space-lg bg-surface-container rounded-xl border border-outline-variant/30">
            <div className="flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                <UserCheck className="w-5 h-5 text-primary" />
              </div>
              <div className="flex flex-col">
                <span className="font-label-uppercase text-[11px] text-tertiary uppercase tracking-wider block">
                  Assigned Invitation
                </span>
                <p className="font-headline-sm text-headline-sm text-on-surface">
                  {currentGuest.name || 'Juan Pablo'}{' '}
                  <span className="text-sm font-sans font-normal text-on-surface-variant">
                    (+1 Guest Reserved)
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="sage" size="sm" dot>
                {currentGuest.tableName || 'Table Bellini Reserved'}
              </Badge>
              <Badge variant="neutral" size="sm">
                Passcode #{currentGuest.passcode || 'JP-8421'}
              </Badge>
            </div>
          </div>

          {!isSubmitted ? (
            /* RSVP Interactive Form */
            <form onSubmit={handleSubmit} className="space-y-space-md" data-testid="rsvp-form">
              {/* 1. Attendance Radio Cards */}
              <div>
                <label className="font-label-uppercase text-label-uppercase text-on-surface uppercase block mb-space-xs tracking-wider">
                  Will You Be Attending?
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm" role="radiogroup">
                  {/* Joyfully Accept Card */}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={attendance === 'confirmed'}
                    onClick={() => setAttendance('confirmed')}
                    className={cn(
                      'text-left p-space-md rounded-xl transition-all border flex items-center gap-space-sm cursor-pointer select-none',
                      attendance === 'confirmed'
                        ? 'bg-primary-container text-on-primary-container border-primary shadow-sm font-semibold'
                        : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors',
                        attendance === 'confirmed'
                          ? 'border-primary bg-primary text-on-primary'
                          : 'border-outline-variant text-transparent'
                      )}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <span className="font-headline-sm text-[16px] block font-medium leading-tight">
                        Attending Joyfully
                      </span>
                      <span className="font-body-sm text-[12px] opacity-80 block mt-0.5">
                        I will celebrate in Tuscany
                      </span>
                    </div>
                  </button>

                  {/* Regretfully Decline Card */}
                  <button
                    type="button"
                    role="radio"
                    aria-checked={attendance === 'declined'}
                    onClick={() => setAttendance('declined')}
                    className={cn(
                      'text-left p-space-md rounded-xl transition-all border flex items-center gap-space-sm cursor-pointer select-none',
                      attendance === 'declined'
                        ? 'bg-secondary-container text-on-secondary-container border-secondary shadow-sm font-semibold'
                        : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface'
                    )}
                  >
                    <div
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors',
                        attendance === 'declined'
                          ? 'border-secondary bg-secondary text-on-secondary'
                          : 'border-outline-variant text-transparent'
                      )}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <span className="font-headline-sm text-[16px] block font-medium leading-tight">
                        Declining with Regret
                      </span>
                      <span className="font-body-sm text-[12px] opacity-80 block mt-0.5">
                        Wishing you well from afar
                      </span>
                    </div>
                  </button>
                </div>
              </div>

              {attendance === 'confirmed' ? (
                /* Dynamic Fields when Attending */
                <div className="space-y-space-md pt-space-xs">
                  {/* 2. Total Guests Joining */}
                  <div>
                    <label className="font-label-uppercase text-label-uppercase text-on-surface uppercase block mb-space-xs tracking-wider">
                      Total Guests Joining
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                      <button
                        type="button"
                        onClick={() => setPartySize(1)}
                        className={cn(
                          'p-3 rounded-xl border text-center transition-all cursor-pointer select-none font-body-md text-sm',
                          partySize === 1
                            ? 'bg-primary-container text-on-primary-container border-primary font-semibold shadow-sm'
                            : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface'
                        )}
                      >
                        Just Myself (1 Guest)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPartySize(2)}
                        className={cn(
                          'p-3 rounded-xl border text-center transition-all cursor-pointer select-none font-body-md text-sm',
                          partySize === 2
                            ? 'bg-primary-container text-on-primary-container border-primary font-semibold shadow-sm'
                            : 'bg-surface-container-low hover:bg-surface-container border-outline-variant/30 text-on-surface'
                        )}
                      >
                        {currentGuest.name || 'Juan Pablo'} + Plus-One (2 Guests)
                      </button>
                    </div>
                  </div>

                  {/* 3. Plus-One Companion Name */}
                  {partySize === 2 && (
                    <div>
                      <label
                        htmlFor="plus-one-name"
                        className="font-label-uppercase text-label-uppercase text-on-surface uppercase block mb-space-xs tracking-wider"
                      >
                        Plus-One Full Name
                      </label>
                      <input
                        id="plus-one-name"
                        type="text"
                        value={companionName}
                        onChange={(e) => setCompanionName(e.target.value)}
                        placeholder="e.g., Sofia Rossi"
                        className="w-full bg-surface-container px-space-md py-3 rounded-xl text-on-surface font-body-md text-body-md placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                      />
                    </div>
                  )}

                  {/* 4. Dietary Preferences Chips */}
                  <div>
                    <label className="font-label-uppercase text-label-uppercase text-on-surface uppercase block mb-space-xs tracking-wider">
                      Dietary &amp; Culinary Preferences
                    </label>
                    <div className="flex flex-wrap gap-2 mb-space-xs" role="group">
                      {dietaryOptions.map((opt) => {
                        const isSelected = selectedDiets.includes(opt.id);
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => toggleDiet(opt.id)}
                            className={cn(
                              'inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-body-sm text-xs transition-all border cursor-pointer select-none',
                              isSelected
                                ? 'bg-secondary text-on-secondary border-secondary shadow-sm font-semibold'
                                : 'bg-surface-container text-on-surface hover:bg-surface-container-high border-outline-variant/30'
                            )}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5 stroke-[2.5]" />}
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                    <input
                      type="text"
                      value={dietaryNotes}
                      onChange={(e) => setDietaryNotes(e.target.value)}
                      placeholder="Specific allergies or culinary notes (e.g., tree nut allergy)..."
                      className="w-full bg-surface-container px-space-md py-2.5 rounded-xl text-on-surface font-body-sm text-body-sm placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                    />
                  </div>

                  {/* 5. Florence Shuttle Accommodation */}
                  <div className="bg-surface-container-low p-space-md rounded-xl border border-outline-variant/30 flex items-start gap-space-sm">
                    <input
                      type="checkbox"
                      id="shuttle-reservation-check"
                      checked={shuttleReserved}
                      onChange={(e) => setShuttleReserved(e.target.checked)}
                      className="mt-1 w-4 h-4 accent-primary cursor-pointer"
                    />
                    <label htmlFor="shuttle-reservation-check" className="cursor-pointer select-none flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <Bus className="w-4 h-4 text-primary" />
                        <span className="font-label-uppercase text-[11px] text-tertiary uppercase tracking-wider font-semibold">
                          Florence Shuttle Accommodation
                        </span>
                      </div>
                      <p className="font-body-sm text-body-sm text-on-surface leading-snug">
                        Please reserve complimentary roundtrip seats on the Florence Piazza Santa Maria Novella shuttle bus (Florence SMN &rarr; Villa Bellissima).
                      </p>
                    </label>
                  </div>

                  {/* 6. Song Request */}
                  <div>
                    <label
                      htmlFor="song-request"
                      className="font-label-uppercase text-label-uppercase text-on-surface uppercase block mb-space-xs tracking-wider"
                    >
                      Song to Guarantee You on the Dance Floor
                    </label>
                    <div className="relative">
                      <input
                        id="song-request"
                        type="text"
                        value={songRequest}
                        onChange={(e) => setSongRequest(e.target.value)}
                        placeholder="Artist - Track Name (e.g. Paolo Conte - Via Con Me)"
                        className="w-full bg-surface-container pl-10 pr-space-md py-3 rounded-xl text-on-surface font-body-md text-body-md placeholder-on-surface-variant/50 focus:outline-none focus:ring-1 focus:ring-primary border border-outline-variant/30"
                      />
                      <Music className="w-4 h-4 text-on-surface-variant/70 absolute left-3.5 top-3.5 pointer-events-none" />
                    </div>
                  </div>
                </div>
              ) : (
                /* Note when Declining */
                <div className="p-space-md bg-surface-container-low rounded-xl border border-outline-variant/30 text-center">
                  <p className="font-body-md text-on-surface-variant italic">
                    &ldquo;While we will truly miss having you at Villa Bellissima, we cherish your love and well wishes from across the miles.&rdquo;
                  </p>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-space-sm">
                <Button
                  type="submit"
                  size="lg"
                  variant={attendance === 'confirmed' ? 'primary' : 'terracotta'}
                  className="w-full tracking-widest text-xs uppercase shadow-md flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {attendance === 'confirmed'
                    ? `Confirm ${currentGuest.name || 'Juan Pablo'}'s RSVP`
                    : 'Send Regrets'}
                </Button>
              </div>
            </form>
          ) : (
            /* Confirmation Feedback State */
            <div className="text-center py-space-xl flex flex-col items-center animate-fadeIn" data-testid="rsvp-success">
              <div className="w-16 h-16 bg-primary-container text-on-primary-container rounded-full mx-auto flex items-center justify-center mb-space-md shadow-md">
                <CheckCircle2 className="w-8 h-8 text-on-primary-container stroke-[2.5]" />
              </div>
              <h3 className="font-headline-md text-headline-md text-on-surface mb-2">
                Thank You, {currentGuest.name || 'Juan Pablo'}!
              </h3>
              <p className="font-body-md text-body-md text-on-surface-variant max-w-[460px] mx-auto mb-space-lg leading-relaxed">
                {attendance === 'confirmed' ? (
                  <>
                    Your attendance has been graciously recorded. We have notified our banquet team and reserved your table for November 26, 2026 at Villa Bellissima.
                  </>
                ) : (
                  <>
                    Your regrets have been received with love. You will be held dearly in our hearts during this celebration.
                  </>
                )}
              </p>

              {/* Summary pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 mb-space-lg">
                <Badge variant={attendance === 'confirmed' ? 'sage' : 'terracotta'} size="md">
                  Status: {attendance === 'confirmed' ? `Attending (${partySize} Guests)` : 'Declined'}
                </Badge>
                {attendance === 'confirmed' && shuttleReserved && (
                  <Badge variant="bronze" size="md">
                    Shuttle: Florence SMN Reserved
                  </Badge>
                )}
                {attendance === 'confirmed' && (
                  <Badge variant="neutral" size="md">
                    Table: {currentGuest.tableName || 'Table Bellini'}
                  </Badge>
                )}
              </div>

              {/* Modify Button */}
              <Button
                type="button"
                variant="secondary"
                size="md"
                onClick={() => setIsSubmitted(false)}
                iconLeft={<RotateCcw className="w-4 h-4 mr-1 text-on-surface-variant" />}
              >
                Modify Preferences
              </Button>
            </div>
          )}
        </Card>
      </div>
    </section>
  );
}
