// src/app/admin/page.tsx
'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWeddingStore } from '@/context/wedding-store';
import { useProspectsStore } from '@/context/prospects-store';
import { Guest, SeatingTable } from '@/lib/types';
import { Prospect, CoupleSide } from '@/lib/prospects-types';
import { ProspectModal } from '@/components/prospects';
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
  AdminNavTabs,
} from '@/components/admin';
import {
  Clock,
  Heart,
  Bus,
  MessageSquareQuote,
  Sparkles,
  Users,
  ArrowRight,
} from 'lucide-react';

export default function AdminPage() {
  const { prospects, addProspect } = useProspectsStore();
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

  // Modal State Machine (Official Guests)
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

  // Modal State for Ingreso de Prospectos desde la Página de Invitados (Requisito 1)
  const [isAddProspectModalOpen, setIsAddProspectModalOpen] = useState(false);

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
        showToast(`Invitado actualizado: ${guestData.name}`);
      } else {
        addGuest(guestData);
        showToast(`Invitado registrado y credenciales emitidas: ${guestData.name}`);
      }
    },
    [modalState.mode, updateGuest, addGuest]
  );

  const handleSaveProspectFromAdmin = useCallback(
    (prospectData: Partial<Prospect> & { name: string; side: CoupleSide }) => {
      addProspect(prospectData);
      showToast(`Prospecto registrado desde la página de invitados: ${prospectData.name}`);
    },
    [addProspect]
  );

  const handleDeleteGuest = useCallback(
    (guestId: string) => {
      const guestToDelete = state.guests.find((g) => g.id === guestId);
      const guestName = guestToDelete?.name || 'Invitado';

      if (
        typeof window !== 'undefined' &&
        window.confirm(`¿Estás seguro de que deseas eliminar a ${guestName} del directorio de invitados?`)
      ) {
        deleteGuest(guestId);
        showToast(`Se eliminó al invitado: ${guestName}`);
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
      showToast('Directorio de invitados exportado exitosamente en CSV');
    } catch {
      showToast('Error en la exportación. Verifica los permisos de tu navegador.');
    }
  }, [state.guests]);

  const handleCopyLink = useCallback((guest: Guest) => {
    const inviteUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/portal?passcode=${
      guest.passcode || 'JP-8421'
    }`;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(inviteUrl).then(
        () => showToast(`Enlace de invitación copiado para ${guest.name}`),
        () => showToast(`Enlace de invitación: ${inviteUrl}`)
      );
    } else {
      showToast(`Enlace de invitación: ${inviteUrl}`);
    }
  }, []);

  const handleSendBatchReminders = useCallback(() => {
    showToast(`Recordatorios de RSVP enviados a los ${kpis.totalPending} invitados pendientes`);
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
        showToast(`Mesa creada: ${tableData.name}`);
      }
    },
    [addTable]
  );

  return (
    <div className="w-full min-h-screen bg-surface font-body-md text-on-surface pb-24">
      {/* Toast Feedback Layer */}
      <ToastContainer />

      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-8">
        {/* Pestañas de Navegación entre Módulos de Administración */}
        <AdminNavTabs
          activeTab="invitados"
          guestCount={state.guests.length}
          prospectCount={prospects.length}
        />

        {/* 1. Header Banner */}
        <AdminHeader
          onOpenAddGuestModal={handleOpenAddModal}
          onOpenAddProspectModal={() => setIsAddProspectModalOpen(true)}
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
                    Invitaciones Activas <span className="sr-only">Invitations Active</span>
                  </span>
                  <span className="font-body-sm text-xs text-outline">
                    • Oleada de Envío 2 de 3
                  </span>
                </div>
                <h3 className="font-headline-sm text-xl text-on-surface font-serif">
                  Suite de Caligrafía Digital &amp; Atelier
                </h3>
                <p className="font-body-sm text-xs md:text-sm text-on-surface-variant mt-1.5 line-clamp-2">
                  Todas las invitaciones incluyen tipografía artesanal en bajorrelieve, códigos de acceso personalizados y confirmación RSVP en vivo sincronizada con banquetes de Villa Bellissima.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 mt-4 pt-3 bg-surface-container-low px-4 py-2.5 rounded-xl border border-surface-container-high/60">
                <div className="flex items-center gap-2 text-secondary text-xs">
                  <Clock className="w-4 h-4 shrink-0" />
                  <span>Próximo resumen automatizado: Mañana, 09:00 CET</span>
                </div>
                <button
                  type="button"
                  onClick={handleSendBatchReminders}
                  className="font-label-uppercase text-xs text-primary hover:underline font-semibold"
                >
                  Enviar {kpis.totalPending} Recordatorios →
                </button>
              </div>
            </div>
          </div>

          {/* Honeymoon Fund Glance Card (1 col) */}
          <div className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col justify-between shadow-sm border border-surface-container-low">
            <div>
              <div className="flex items-center justify-between pb-2">
                <h3 className="font-headline-sm text-lg text-on-surface font-serif">
                  Fondo de Luna de Miel <span className="sr-only">Honeymoon Fund</span>
                </h3>
                <span className="font-label-uppercase text-xs text-secondary font-semibold">
                  {kpis.registryRate}%
                </span>
              </div>
              <p className="font-body-sm text-xs text-on-surface-variant mb-4">
                Contribuciones para la luna de miel de Julia &amp; Pedro en Kioto y la Costa Amalfitana.
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
              <span>Meta: €{(kpis.registryTarget / 1000).toFixed(0)},000</span>
              <span className="font-medium text-primary">
                Total: €{(kpis.registryCollected / 1000).toFixed(2)}k
              </span>
            </div>
          </div>
        </section>

        {/* Subpage Banner: Módulo de Prospectos a Invitados */}
        <section
          aria-label="Gestión de Prospectos a Invitados"
          className="w-full bg-gradient-to-r from-surface-container-low via-surface-container-lowest to-surface-container-low rounded-2xl p-5 md:p-6 border border-secondary/25 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed shrink-0 shadow-xs">
              <Users className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-label-uppercase text-[10px] text-secondary font-bold uppercase tracking-wider">
                  Módulo de la Pareja • Subpágina
                </span>
                <span className="px-2 py-0.5 rounded-full bg-primary-fixed text-on-primary-fixed text-[10px] font-label-uppercase font-semibold">
                  {prospects.length} Prospectos en Pipeline
                </span>
              </div>
              <h3 className="font-headline-sm text-lg text-on-surface font-serif mt-0.5">
                Gestión y Migración de Prospectos a Invitados
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant line-clamp-1">
                Clasifica por afinidad (Julia &amp; Pedro), monitorea el aforo esperado vs máximo y migra candidatos a la base de datos oficial.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddProspectModalOpen(true)}
              className="px-3.5 py-2.5 rounded-xl border border-secondary text-secondary hover:bg-secondary/10 font-label-uppercase text-xs tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>+ Ingresar Prospecto</span>
            </button>
            <Link
              href="/admin/prospects"
              className="px-4 py-2.5 rounded-xl bg-primary text-on-primary font-label-uppercase text-xs tracking-wider font-semibold hover:bg-primary-container hover:text-on-primary-container transition-all flex items-center gap-2 shadow-sm"
            >
              <span>Gestionar Prospectos →</span>
            </Link>
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
          onOpenAddProspectModal={() => setIsAddProspectModalOpen(true)}
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
              Logística &amp; Traslados
            </span>
            <h3 className="font-headline-sm text-xl text-on-surface font-serif">
              Traslados Villa Bellissima
            </h3>
            <p className="font-body-sm text-xs md:text-sm text-on-surface-variant">
              Traslados en autobús coordinados desde la estación Santa Maria Novella de Florencia (14:30) y el aeropuerto de Peretola (15:00) directo a los viñedos.
            </p>
            <div className="flex items-center gap-2 mt-2">
              <span className="px-3 py-1 bg-primary-fixed text-on-primary-fixed font-label-uppercase text-xs rounded-full font-semibold">
                {kpis.shuttleConfirmed} Asientos Confirmados <span className="sr-only">{kpis.shuttleConfirmed} Shuttle Seats Confirmed</span>
              </span>
              <span className="text-xs text-outline">Capacidad: 60 Asientos <span className="sr-only">Cap: 60 Seats</span></span>
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
              Greve in Chianti • Toscana
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
                Dedicatorias del Libro de Visitas <span className="sr-only">Nuptial Guestbook Notes</span>
              </h3>
            </div>
            <Link
              href="/pulse"
              className="font-label-uppercase text-xs text-primary hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Ver Wedding Pulse Completo → <span className="sr-only">View Full Wedding Pulse →</span></span>
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
                    {item.table || 'Salón de Recepción'}
                  </span>
                  <span className="text-primary font-medium">Publicado en el Álbum <span className="sr-only">Published to Album</span></span>
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
            <span>Atelier Nupcial Exclusivo &amp; Portal Privado de Administración <span className="sr-only">Bespoke Nuptial Atelier &amp; Private Administrative Portal</span></span>
          </div>
          <div className="flex items-center gap-4">
            <span className="font-label-uppercase tracking-wider">
              Sesión Cifrada y Segura <span className="sr-only">Encrypted Atelier Session</span>
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

      {/* Ingreso de Prospectos desde la Página de Invitados (Requisito 1) */}
      <ProspectModal
        isOpen={isAddProspectModalOpen}
        onClose={() => setIsAddProspectModalOpen(false)}
        mode="add"
        prospect={null}
        onSave={handleSaveProspectFromAdmin}
      />
    </div>
  );
}
