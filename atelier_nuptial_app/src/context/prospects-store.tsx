// src/context/prospects-store.tsx
// Atelier Nuptial: Reactive Prospects Store with LocalStorage, Multi-Tab Sync & Guest Migration Integration
'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  Prospect,
  CoupleSide,
  AffinityCategory,
  PriorityTier,
  ProspectStatus,
  CapacityConfig,
  MigrationSummary,
  CapacityAnalysis,
  CoupleBalanceMetrics,
  BulkImportItem,
} from '@/lib/prospects-types';
import {
  INITIAL_PROSPECTS,
  DEFAULT_CAPACITY_CONFIG,
  PROSPECTS_STORAGE_KEY,
  PROSPECTS_SYNC_EVENT,
  CAPACITY_STORAGE_KEY,
  loadProspectsFromStorage,
  saveProspectsToStorage,
  loadCapacityFromStorage,
  saveCapacityToStorage,
  createProspectRecord,
  bulkImportProspects,
  exportProspectsToCSV,
  exportProspectsToJSON,
  triggerFileDownload,
  processMigrationToGuests,
  computeCapacityAnalysis,
  computeCoupleBalance,
  COUPLE_QUICK_PRESETS,
} from '@/lib/prospects-service';
import { useWeddingStore } from '@/context/wedding-store';

export interface ProspectsContextType {
  prospects: Prospect[];
  capacity: CapacityConfig;
  selectedIds: string[];
  isHydrated: boolean;
  capacityAnalysis: CapacityAnalysis;
  coupleBalance: CoupleBalanceMetrics;
  // Selection
  toggleSelectProspect: (id: string) => void;
  selectAllProspects: (ids: string[]) => void;
  clearSelection: () => void;
  isSelected: (id: string) => boolean;
  // CRUD
  addProspect: (data: Partial<Prospect> & { name: string; side: CoupleSide }) => Prospect;
  updateProspect: (id: string, updates: Partial<Prospect>) => void;
  deleteProspect: (id: string) => void;
  updateProspectStatus: (id: string, status: ProspectStatus) => void;
  updateProspectAffinity: (id: string, affinity: AffinityCategory) => void;
  batchUpdateStatus: (status: ProspectStatus) => void;
  batchUpdateAffinity: (affinity: AffinityCategory) => void;
  batchUpdateTier: (tier: PriorityTier) => void;
  updateCapacity: (updates: Partial<CapacityConfig>) => void;
  // In / Out Services
  bulkImport: (items: BulkImportItem[]) => number;
  importPresets: (presetIndex: number) => number;
  exportCSV: () => void;
  exportJSON: () => void;
  // Migration to Official Guests Database
  migrateSelectedToGuests: () => MigrationSummary;
  resetProspectsToDefault: () => void;
}

const ProspectsContext = createContext<ProspectsContextType | null>(null);

export function ProspectsProvider({ children }: { children: React.ReactNode }) {
  const { kpis, addGuest, addMultipleGuests } = useWeddingStore();

  const [prospects, setProspects] = useState<Prospect[]>(INITIAL_PROSPECTS);
  const [capacity, setCapacity] = useState<CapacityConfig>(DEFAULT_CAPACITY_CONFIG);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Initial client-side hydration
  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        const loadedProspects = loadProspectsFromStorage();
        const loadedCapacity = loadCapacityFromStorage();
        setProspects(loadedProspects);
        setCapacity(loadedCapacity);
      }
    } catch (err) {
      console.warn('Could not read prospects from storage, using defaults:', err);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // 2. Cross-Tab & Same-Window Sync
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleStorage = (event: StorageEvent) => {
      if (event.key === PROSPECTS_STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          setProspects(parsed);
        } catch (err) {
          console.error('Failed to parse cross-tab prospects:', err);
        }
      }
      if (event.key === CAPACITY_STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          setCapacity(parsed);
        } catch (err) {
          console.error('Failed to parse cross-tab capacity:', err);
        }
      }
    };

    const handleCustomSync = (event: Event) => {
      const customEvent = event as CustomEvent<Prospect[]>;
      if (customEvent.detail) {
        setProspects(customEvent.detail);
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(PROSPECTS_SYNC_EVENT, handleCustomSync as EventListener);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(PROSPECTS_SYNC_EVENT, handleCustomSync as EventListener);
    };
  }, []);

  // 3. Selection Handlers
  const toggleSelectProspect = useCallback((id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  }, []);

  const selectAllProspects = useCallback((ids: string[]) => {
    setSelectedIds(ids);
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds([]);
  }, []);

  const isSelected = useCallback(
    (id: string) => selectedIds.includes(id),
    [selectedIds]
  );

  // 4. CRUD Operations
  const addProspect = useCallback(
    (data: Partial<Prospect> & { name: string; side: CoupleSide }): Prospect => {
      const newRecord = createProspectRecord(data);
      setProspects((prev) => {
        const next = [newRecord, ...prev];
        saveProspectsToStorage(next);
        return next;
      });
      return newRecord;
    },
    []
  );

  const updateProspect = useCallback((id: string, updates: Partial<Prospect>) => {
    setProspects((prev) => {
      const next = prev.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
      );
      saveProspectsToStorage(next);
      return next;
    });
  }, []);

  const deleteProspect = useCallback((id: string) => {
    setProspects((prev) => {
      const next = prev.filter((p) => p.id !== id);
      saveProspectsToStorage(next);
      return next;
    });
    setSelectedIds((prev) => prev.filter((item) => item !== id));
  }, []);

  const updateProspectStatus = useCallback(
    (id: string, status: ProspectStatus) => {
      updateProspect(id, { status });
    },
    [updateProspect]
  );

  const batchUpdateStatus = useCallback(
    (status: ProspectStatus) => {
      if (selectedIds.length === 0) return;
      setProspects((prev) => {
        const next = prev.map((p) =>
          selectedIds.includes(p.id) ? { ...p, status, updatedAt: new Date().toISOString() } : p
        );
        saveProspectsToStorage(next);
        return next;
      });
    },
    [selectedIds]
  );

  const updateProspectAffinity = useCallback(
    (id: string, affinity: AffinityCategory) => {
      updateProspect(id, { affinity });
    },
    [updateProspect]
  );

  const batchUpdateAffinity = useCallback(
    (affinity: AffinityCategory) => {
      if (selectedIds.length === 0) return;
      setProspects((prev) => {
        const next = prev.map((p) =>
          selectedIds.includes(p.id) ? { ...p, affinity, updatedAt: new Date().toISOString() } : p
        );
        saveProspectsToStorage(next);
        return next;
      });
    },
    [selectedIds]
  );

  const batchUpdateTier = useCallback(
    (tier: PriorityTier) => {
      if (selectedIds.length === 0) return;
      setProspects((prev) => {
        const next = prev.map((p) =>
          selectedIds.includes(p.id) ? { ...p, tier, updatedAt: new Date().toISOString() } : p
        );
        saveProspectsToStorage(next);
        return next;
      });
    },
    [selectedIds]
  );

  const updateCapacity = useCallback((updates: Partial<CapacityConfig>) => {
    setCapacity((prev) => {
      const next: CapacityConfig = {
        capacidadEsperada:
          updates.capacidadEsperada !== undefined
            ? Math.max(1, Number(updates.capacidadEsperada))
            : prev.capacidadEsperada,
        capacidadMaxima:
          updates.capacidadMaxima !== undefined
            ? Math.max(1, Number(updates.capacidadMaxima))
            : prev.capacidadMaxima,
      };
      saveCapacityToStorage(next);
      return next;
    });
  }, []);

  // 5. In / Out Services
  const bulkImport = useCallback((items: BulkImportItem[]): number => {
    let count = 0;
    setProspects((prev) => {
      const res = bulkImportProspects(items, prev);
      count = res.addedCount;
      return res.updatedProspects;
    });
    return count;
  }, []);

  const importPresets = useCallback(
    (presetIndex: number): number => {
      const preset = COUPLE_QUICK_PRESETS[presetIndex];
      if (!preset) return 0;
      return bulkImport(preset.templates);
    },
    [bulkImport]
  );

  const exportCSV = useCallback(() => {
    const csv = exportProspectsToCSV(prospects);
    triggerFileDownload(csv, `atelier_nuptial_prospectos_${Date.now()}.csv`, 'text/csv');
  }, [prospects]);

  const exportJSON = useCallback(() => {
    const json = exportProspectsToJSON(prospects);
    triggerFileDownload(
      json,
      `atelier_nuptial_prospectos_${Date.now()}.json`,
      'application/json'
    );
  }, [prospects]);

  // 6. Migration Process: Selected Prospects -> Official Guests Database
  const migrateSelectedToGuests = useCallback((): MigrationSummary => {
    if (selectedIds.length === 0) {
      return {
        success: false,
        migratedCount: 0,
        totalSeats: 0,
        migratedGuests: [],
        errors: ['No hay prospectos seleccionados para migrar.'],
        exceededExpected: false,
        exceededMax: false,
      };
    }

    const { updatedProspects, summary } = processMigrationToGuests({
      selectedIds,
      prospects,
      addGuestFn: addGuest,
      addMultipleGuestsFn: addMultipleGuests,
      currentOfficialGuestsCount: kpis.totalInvited,
      capacity,
    });

    setProspects(updatedProspects);
    // Unselect migrated items
    setSelectedIds((prev) =>
      prev.filter((id) => !summary.migratedGuests.some((m) => m.prospectId === id))
    );

    return summary;
  }, [selectedIds, prospects, addGuest, addMultipleGuests, kpis.totalInvited, capacity]);

  const resetProspectsToDefault = useCallback(() => {
    setProspects(INITIAL_PROSPECTS);
    saveProspectsToStorage(INITIAL_PROSPECTS);
    setCapacity(DEFAULT_CAPACITY_CONFIG);
    saveCapacityToStorage(DEFAULT_CAPACITY_CONFIG);
    setSelectedIds([]);
  }, []);

  // 7. Computed Metrics
  const selectedProspects = useMemo(
    () => prospects.filter((p) => selectedIds.includes(p.id)),
    [prospects, selectedIds]
  );

  const capacityAnalysis = useMemo(
    () => computeCapacityAnalysis(kpis.totalInvited, selectedProspects, capacity),
    [kpis.totalInvited, selectedProspects, capacity]
  );

  const coupleBalance = useMemo(
    () => computeCoupleBalance(prospects),
    [prospects]
  );

  const value: ProspectsContextType = {
    prospects,
    capacity,
    selectedIds,
    isHydrated,
    capacityAnalysis,
    coupleBalance,
    toggleSelectProspect,
    selectAllProspects,
    clearSelection,
    isSelected,
    addProspect,
    updateProspect,
    deleteProspect,
    updateProspectStatus,
    updateProspectAffinity,
    batchUpdateStatus,
    batchUpdateAffinity,
    batchUpdateTier,
    updateCapacity,
    bulkImport,
    importPresets,
    exportCSV,
    exportJSON,
    migrateSelectedToGuests,
    resetProspectsToDefault,
  };

  return (
    <ProspectsContext.Provider value={value}>
      {children}
    </ProspectsContext.Provider>
  );
}

export function useProspectsStore(): ProspectsContextType {
  const context = useContext(ProspectsContext);
  if (!context) {
    // Graceful fallback for isolated component testing or unnested trees
    return {
      prospects: INITIAL_PROSPECTS,
      capacity: DEFAULT_CAPACITY_CONFIG,
      selectedIds: [],
      isHydrated: true,
      capacityAnalysis: computeCapacityAnalysis(142, [], DEFAULT_CAPACITY_CONFIG),
      coupleBalance: computeCoupleBalance(INITIAL_PROSPECTS),
      toggleSelectProspect: () => {},
      selectAllProspects: () => {},
      clearSelection: () => {},
      isSelected: () => false,
      addProspect: (data) => createProspectRecord(data),
      updateProspect: () => {},
      deleteProspect: () => {},
      updateProspectStatus: () => {},
      updateProspectAffinity: () => {},
      batchUpdateStatus: () => {},
      batchUpdateAffinity: () => {},
      batchUpdateTier: () => {},
      updateCapacity: () => {},
      bulkImport: () => 0,
      importPresets: () => 0,
      exportCSV: () => {},
      exportJSON: () => {},
      migrateSelectedToGuests: () => ({
        success: false,
        migratedCount: 0,
        totalSeats: 0,
        migratedGuests: [],
        errors: [],
        exceededExpected: false,
        exceededMax: false,
      }),
      resetProspectsToDefault: () => {},
    };
  }
  return context;
}
