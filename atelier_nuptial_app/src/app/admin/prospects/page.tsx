// src/app/admin/prospects/page.tsx
'use client';

import React, { useState, useCallback } from 'react';
import Link from 'next/link';
import { useProspectsStore } from '@/context/prospects-store';
import { Prospect, CoupleSide, ProspectStatus } from '@/lib/prospects-types';
import { showToast, ToastContainer } from '@/components/ui/toast';
import {
  ProspectsHeader,
  CapacityGaugeCard,
  CoupleBalanceMeter,
  ProspectsTable,
  ProspectModal,
  ProspectBulkModal,
  CapacitySettingsModal,
  MigrationConfirmModal,
} from '@/components/prospects';

export default function AdminProspectsPage() {
  const {
    prospects,
    capacity,
    selectedIds,
    capacityAnalysis,
    coupleBalance,
    toggleSelectProspect,
    selectAllProspects,
    clearSelection,
    addProspect,
    updateProspect,
    deleteProspect,
    batchUpdateStatus,
    updateProspectAffinity,
    batchUpdateAffinity,
    updateCapacity,
    bulkImport,
    importPresets,
    exportCSV,
    exportJSON,
    migrateSelectedToGuests,
  } = useProspectsStore();

  // Filter state for couple side
  const [sideFilter, setSideFilter] = useState<CoupleSide | 'all'>('all');

  // Modals state
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [currentProspect, setCurrentProspect] = useState<Prospect | null>(null);

  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isMigrationModalOpen, setIsMigrationModalOpen] = useState(false);

  // Handlers
  const handleOpenAdd = useCallback(() => {
    setCurrentProspect(null);
    setModalMode('add');
    setIsAddEditModalOpen(true);
  }, []);

  const handleOpenEdit = useCallback((prospect: Prospect) => {
    setCurrentProspect(prospect);
    setModalMode('edit');
    setIsAddEditModalOpen(true);
  }, []);

  const handleSaveProspect = useCallback(
    (data: Partial<Prospect> & { name: string; side: CoupleSide }) => {
      if (modalMode === 'edit' && data.id) {
        updateProspect(data.id, data);
        showToast(`Prospecto actualizado: ${data.name}`);
      } else {
        addProspect(data);
        showToast(`Nuevo prospecto registrado: ${data.name}`);
      }
    },
    [modalMode, updateProspect, addProspect]
  );

  const handleDelete = useCallback(
    (id: string) => {
      const p = prospects.find((item) => item.id === id);
      const name = p?.name || 'Prospecto';
      if (typeof window !== 'undefined' && window.confirm(`¿Deseas eliminar a ${name} de los prospectos?`)) {
        deleteProspect(id);
        showToast(`Prospecto eliminado: ${name}`);
      } else if (typeof window === 'undefined') {
        deleteProspect(id);
      }
    },
    [prospects, deleteProspect]
  );

  const handleBatchStatus = useCallback(
    (status: ProspectStatus) => {
      batchUpdateStatus(status);
      showToast(`Se actualizó el estado de los prospectos seleccionados.`);
    },
    [batchUpdateStatus]
  );

  const handleQuickMigrateSingle = useCallback(
    (prospect: Prospect) => {
      selectAllProspects([prospect.id]);
      setIsMigrationModalOpen(true);
    },
    [selectAllProspects]
  );

  const handleExecuteMigration = useCallback(() => {
    const summary = migrateSelectedToGuests();
    if (summary.success) {
      showToast(
        `¡Éxito! Se migraron ${summary.migratedCount} prospectos (${summary.totalSeats} cupos) a la base de datos de Invitados Oficiales.`
      );
    } else if (summary.errors.length > 0) {
      showToast(summary.errors[0]);
    }
  }, [migrateSelectedToGuests]);

  const selectedProspects = prospects.filter((p) => selectedIds.includes(p.id));

  return (
    <div className="w-full min-h-screen bg-surface font-body-md text-on-surface pb-24">
      {/* Toast Feedback */}
      <ToastContainer />

      <main className="w-full max-w-7xl mx-auto px-4 md:px-8 py-6 flex flex-col gap-8">
        {/* 1. Header Banner */}
        <ProspectsHeader
          onOpenAddModal={handleOpenAdd}
          onOpenBulkModal={() => setIsBulkModalOpen(true)}
          onExportCSV={exportCSV}
          onExportJSON={exportJSON}
        />

        {/* 2. Capacity Gauge and Aforo Monitor (Requirement 7) */}
        <CapacityGaugeCard
          analysis={capacityAnalysis}
          onOpenSettings={() => setIsSettingsModalOpen(true)}
        />

        {/* 3. Couple Balance & Origin Meter (Requirement 6) */}
        <CoupleBalanceMeter
          metrics={coupleBalance}
          selectedSideFilter={sideFilter}
          onSelectSideFilter={setSideFilter}
        />

        {/* 4. Interactive Prospects Table & Pipeline (Requirements 1, 2, 3, 5) */}
        <ProspectsTable
          prospects={prospects}
          selectedIds={selectedIds}
          onToggleSelect={toggleSelectProspect}
          onSelectAll={selectAllProspects}
          onClearSelection={clearSelection}
          onOpenEditModal={handleOpenEdit}
          onDeleteProspect={handleDelete}
          onBatchUpdateStatus={handleBatchStatus}
          onRequestMigrate={() => setIsMigrationModalOpen(true)}
          onQuickMigrateSingle={handleQuickMigrateSingle}
          sideFilter={sideFilter}
          onSideFilterChange={setSideFilter}
          onUpdateAffinity={updateProspectAffinity}
          onBatchUpdateAffinity={batchUpdateAffinity}
          capacityAnalysis={capacityAnalysis}
        />
      </main>

      {/* Add / Edit Prospect Modal */}
      <ProspectModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        mode={modalMode}
        prospect={currentProspect}
        onSave={handleSaveProspect}
      />

      {/* Bulk Import & Quick Presets Modal (In-Out Service IN) */}
      <ProspectBulkModal
        isOpen={isBulkModalOpen}
        onClose={() => setIsBulkModalOpen(false)}
        onBulkImport={bulkImport}
        onImportPreset={importPresets}
      />

      {/* Capacity Settings Modal */}
      <CapacitySettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
        config={capacity}
        onSave={updateCapacity}
      />

      {/* Migration Confirmation Modal (In-Out Service OUT / Process) */}
      <MigrationConfirmModal
        isOpen={isMigrationModalOpen}
        onClose={() => setIsMigrationModalOpen(false)}
        selectedProspects={selectedProspects}
        capacityAnalysis={capacityAnalysis}
        onConfirmMigration={handleExecuteMigration}
      />
    </div>
  );
}
