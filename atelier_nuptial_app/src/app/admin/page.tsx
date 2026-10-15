// src/app/admin/page.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWeddingStore } from '@/context/wedding-store';
import { Guest, SeatingTable } from '@/lib/types';
import { showToast, ToastContainer } from '@/components/ui/toast';
import {
  AdminHeader,
  AdminKpiGrid,
  GuestDirectorySection,
  GuestDirectoryFilter,
  GuestModal,
  SeatingChartSection,
  DietaryMatrixSection,
  RsvpPreviewModal,
  downloadGuestsCSV,
} from '@/components/admin';
import {
  Clock,
  Heart,
  Bus,
  MessageSquareQuote,
  Sparkles,
} from 'lucide-react';

export default function AdminPage() {
  const {
    state,
    kpis,
    addGuest,
    updateGuest,
    deleteGuest,
    addTable,
  } = useWeddingStore();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<GuestDirectoryFilter>('all');
  const [selectedTableId, setSelectedTableId] = useState<string | null>(null);

  // Modal State Machine
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    mode: 'add' | 'edit';
    guest: Guest | null;
  }>({
    isOpen: false,
    mode: 'add',
    guest: null,
  });

  const [previewGuest, setPreviewGuest] = useState<Guest | null>(null);

  // Filtered guests taking into account optional selected table from seating chart
  const displayedGuests = useMemo(() => {
    if (!selectedTableId) return state.guests;
    const table = state.tables.find((t) => t.id === selectedTableId);
    return state.guests.filter((g) => {
      if (g.tableId === selectedTableId) return true;
      if (table && g.tableName?.toLowerCase() === table.name.toLowerCase()) return true;
      return false;
    });
  }, [state.guests, selectedTableId, state.tables]);

  // Handlers
  const handleOpenAddModal = useCallback(() => {
    setModalState({
      isOpen: true,
      mode: 'add',
      guest: null,
    });
  }, []);

  const handleOpenEditModal = useCallback((guest: Guest) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      guest,
    });
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  }, []);

  const handleSaveGuest = useCallback(
    (guestData: Omit<Guest, 'id' | 'updatedAt'> & { id?: string }) => {
      if (modalState.mode === 'edit' && guestData.id) {
        updateGuest(guestData.id, guestData);
        showToast(`Guest record updated: ${guestData.name}`);
      } else {
        addGuest(guestData);
        showToast(`Guest registered & invitation issued: ${guestData.name}`);
      }
    },
    [modalState.mode, updateGuest, addGuest]
  );

  const handleDeleteGuest = useCallback(
    (guestId: string) => {
      const guestToDelete = state.guests.find((g) => g.id === guestId);
      const guestName = guestToDelete?.name || 'Guest';

      if (
        typeof window !== 'undefined' &&
        window.confirm(`Are you sure you want to remove ${guestName} from the guest directory?`)
      ) {
        deleteGuest(guestId);
        showToast(`Removed guest: ${guestName}`);
      } else if (typeof window === 'undefined') {
        // Fallback in SSR/non-browser
        deleteGuest(guestId);
      }
    },
    [state.guests, deleteGuest]
  );

  const handleExportCSV = useCallback(() => {
    try {
      downloadGuestsCSV(state.guests);
      showToast('Guest directory CSV exported successfully');
    } catch {
      showToast('Export failed. Please check browser permissions.');
    }
  }, [state.guests]);

  const handleCopyLink = useCallback((guest: Guest) => {
    const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/portal?passcode=${
      guest.passcode || 'JP-8421'
    }`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl).then(
        () => showToast(`Invitation link copied for ${guest.name}`),
        () => showToast(`Invite link: ${inviteUrl}`)
      );
    } else {
      showToast(`Invite link: ${inviteUrl}`);
    }
  }, []);

  const handleSendBatchReminders = useCallback(() => {
    showToast(`RSVP reminders dispatched to ${kpis.totalPending} pending guests`);
  }, [kpis.totalPending]);

  const handleKpiClick = useCallback(
    (filterType: 'all' | 'confirmed' | 'pending' | 'declined' | 'dietary') => {
      setActiveFilter(filterType);
      setSelectedTableId(null);
    },
    []
  );

  const handleAddTable = useCallback(
    (tableData: Omit<SeatingTable, 'id'>) => {
      if (addTable) {
        addTable(tableData);
        showToast(`Table created: ${tableData.name}`);
      }
    },
    [addTable]
  );

  return (
    <div className="w-full min-h-screen bg-surface font-body-md text-on-surface pb-24">
      {/* Toast Feedback Layer */}
      <ToastContainer />

      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-8">
        {/* 1. Header Banner */}
        <AdminHeader
          onOpenAddGuestModal={handleOpenAddModal}
          onExportCSV={handleExportCSV}
        />

        {/* 2. 6-Card KPI Summary Grid */}
        <AdminKpiGrid
          kpis={kpis}
          onKpiClick={handleKpiClick}
        />

        {/* 3. Secondary Glance: Atelier Dispatch & Registry Overview */}
        <section
          aria-label="Atelier Dispatch and Highlights"
          className="grid grid-cols-1 lg:grid-cols-3 gap-6"
        >
          {/* Atelier Suite Dispatch Card (2 cols) */}
          <div className="lg:col-span-2 bg-surface-container-lowest rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm border border-surface-container-low">
            <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden shrink-0 relative bg-surface-container-low">
              <Image
                src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80"
                alt="Luxury wedding invitation stationery suite"
                fill
                sizes="(max-width: 768px) 100vw, 192px"
                className="object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 backdrop-blur-md px-2.5 py-0.5 rounded text-[10px] font-label-uppercase text-secondary font-semibold uppercase">
                Atelier Suite 01
              </div>
            </div>

            <div className="flex flex-col justify-between flex-grow">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="px-2.5 py-0.5 bg-primary-fixed text-on-primary-fixed rounded-full font-label-uppercase text-[10px] uppercase font-semibold">
                    Invitations Active
                  </span>
                  <span className="font-body-sm text-xs text-outline">
                    • Dispatch Wave 2 of 3
                  </span>
                </div>
                <h3 className="font-headline-sm text-xl text-on-surface font-serif">
                  The Digital Calligraphy &amp; Atelier Suite
                </h3>
                <p className="font-body-sm text-xs md:text-sm text-on-surface-variant mt-1.5 line-clamp-2">
                  All invitations feature blind letterpress typography, personalized guest passcodes, and instant live RSVP confirmation directly synced with Villa Bellissima banqueting coordinators.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container-high/60">
                <div className="flex items-center gap-2 text-secondary text-xs">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Next automated digest: Tomorrow, 09:00 CET</span>
                </div>
                <button
                  type="button"
                  onClick={handleSendBatchReminders}
                  className="font-label-uppercase text-xs text-primary hover:underline font-semibold"
                >
                  Trigger {kpis.totalPending} Nudges →
                </button>
              </div>
            </div>
          </div>

          {/* Honeymoon Fund Glance Card (1 col) */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-surface-container-low">
            <div>
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-headline-sm text-lg text-on-surface font-serif">
                  Honeymoon Fund
                </h3>
                <span className="font-label-uppercase text-xs text-secondary font-semibold">
                  {kpis.registryRate}%
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mb-4">
                Contributions to Julia &amp; Pedro&apos;s Kyoto &amp; Amalfi Voyage.
              </p>

              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40">
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="font-medium text-on-surface">Matteo Rossi</span>
                  </div>
                  <span className="font-headline-sm text-sm text-secondary font-semibold">
                    €500.00
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs p-2.5 rounded-xl bg-surface-container-low border border-surface-container-high/40">
                  <div className="flex items-center gap-2">
                    <Heart className="w-3.5 h-3.5 text-primary fill-primary" />
                    <span className="font-medium text-on-surface">Sofia &amp; Liam</span>
                  </div>
                  <span className="font-headline-sm text-sm text-secondary font-semibold">
                    €350.00
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-surface-container-low flex items-center justify-between text-xs text-outline">
              <span>Goal: €{(kpis.registryTarget / 1000).toFixed(0)},000</span>
              <span className="font-medium text-primary">
                Total: €{(kpis.registryCollected / 1000).toFixed(2)}k
              </span>
            </div>
          </div>
        </section>

        {/* 4. Guest Atelier Directory Table Section */}
        <GuestDirectorySection
          guests={displayedGuests}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
          onOpenAddGuestModal={handleOpenAddModal}
          onOpenEditGuestModal={handleOpenEditModal}
          onOpenPreviewModal={setPreviewGuest}
          onDeleteGuest={handleDeleteGuest}
          onCopyLink={handleCopyLink}
          onExportCSV={handleExportCSV}
          onSendBatchReminders={handleSendBatchReminders}
        />

        {/* 5. Seating & Table Distribution */}
        <SeatingChartSection
          tables={state.tables}
          guests={state.guests}
          selectedTableId={selectedTableId}
          onSelectTable={setSelectedTableId}
          onAddTable={handleAddTable}
        />

        {/* 6. Dietary Catering Matrix */}
        <DietaryMatrixSection
          guests={state.guests}
          tables={state.tables}
          onFilterByDietary={() => {
            setActiveFilter('dietary');
            window.scrollTo({ top: 700, behavior: 'smooth' });
          }}
        />

        {/* 7. Logistics & Transport Glance */}
        <section
          aria-label="Logistics & Transport Preview"
          className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 md:p-8 flex flex-col lg:flex-row items-center gap-6"
        >
          <div className="w-full lg:w-1/3 flex flex-col gap-2">
            <span className="font-label-uppercase text-xs text-secondary font-bold uppercase tracking-wider">
              Logistics &amp; Transport
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface font-serif">
              Villa Bellissima Shuttles
            </h3>
            <p className="font-body-sm text-xs md:text-sm text-on-surface-variant">
              Coordinated bus pickups from Florence Santa Maria Novella station (14:30) and Peretola Airport (15:00) straight to the vineyard courtyards.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed font-label-uppercase text-xs rounded-full font-semibold">
                {kpis.shuttleConfirmed} Shuttle Seats Confirmed
              </span>
              <span className="text-xs text-outline">Cap: 60 Seats</span>
            </div>
          </div>

          <div className="w-full lg:w-2/3 h-52 rounded-xl overflow-hidden shadow-inner relative bg-surface-container-low">
            <Image
              src="https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=1200&q=80"
              alt="Tuscan landscape in Chianti with cypress trees and vineyards"
              fill
              sizes="(max-width: 1024px) 100vw, 66vw"
              className="object-cover"
            />
            <div className="absolute top-3 right-3 bg-surface-container-lowest/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-label-uppercase text-secondary font-medium">
              Greve in Chianti • Tuscany
            </div>
          </div>
        </section>

        {/* 8. Nuptial Guestbook Snippet */}
        <section
          aria-label="Recent Guestbook Submissions"
          className="w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 md:p-8 flex flex-col gap-4"
        >
          <div className="flex items-center justify-between pb-2 border-b border-surface-container-low">
            <div className="flex items-center gap-2">
              <MessageSquareQuote className="w-5 h-5 text-secondary" />
              <h3 className="font-headline-sm text-xl text-on-surface font-serif">
                Nuptial Guestbook Notes
              </h3>
            </div>
            <Link
              href="/pulse"
              className="font-label-uppercase text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>View Full Wedding Pulse →</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {state.guestbook.slice(0, 2).map((item) => (
              <div
                key={item.id}
                className="p-4 bg-surface-container-low rounded-xl flex flex-col justify-between gap-2 border border-surface-container-high/60"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-on-surface">{item.author}</span>
                    <span className="text-[10px] text-outline">{item.timestamp}</span>
                  </div>
                  <p className="font-quote-italic text-sm text-on-surface-variant italic">
                    &ldquo;{item.text}&rdquo;
                  </p>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-surface-container-high/40 text-[11px]">
                  <span className="text-secondary font-label-uppercase">
                    {item.table || 'Reception Lounge'}
                  </span>
                  <span className="text-primary font-medium">Published to Album</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-low py-8 border-t border-surface-container-high/60 mt-12">
        <div className="max-w-7xl mx-auto px-4 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-xs text-outline">
          <div>
            <span className="font-headline-sm text-base text-on-surface block font-serif">
              Julia Rossi &amp; Pedro Silva
            </span>
            <span>Bespoke Nuptial Atelier &amp; Private Administrative Portal</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-label-uppercase tracking-wider">
              Encrypted Atelier Session
            </span>
            <span className="font-label-uppercase text-secondary font-medium tracking-wider">
              © 2026 Julia &amp; Pedro Nuptials
            </span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Guest Modal */}
      <GuestModal
        isOpen={modalState.isOpen}
        onClose={handleCloseModal}
        mode={modalState.mode}
        guest={modalState.guest}
        tables={state.tables}
        onSave={handleSaveGuest}
      />

      {/* Quick RSVP Preview Modal */}
      <RsvpPreviewModal
        isOpen={Boolean(previewGuest)}
        onClose={() => setPreviewGuest(null)}
        guest={previewGuest}
        onEditGuest={handleOpenEditModal}
        onCopyLink={handleCopyLink}
      />
    </div>
  );
}
