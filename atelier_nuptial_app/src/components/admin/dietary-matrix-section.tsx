// src/components/admin/dietary-matrix-section.tsx
'use client';

import React, { useMemo } from 'react';
import { Guest, SeatingTable } from '@/lib/types';
import {
  UtensilsCrossed,
  AlertTriangle,
  Printer,
  Salad,
  Apple,
  Wheat,
  Milk,
  Fish,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface DietaryMatrixSectionProps {
  guests: Guest[];
  tables?: SeatingTable[];
  onFilterByDietary?: (dietaryType: string) => void;
  className?: string;
}

interface DietaryCategory {
  id: string;
  label: string;
  icon: React.ReactNode;
  isAllergyAlert?: boolean;
}

const CATEGORIES: DietaryCategory[] = [
  { id: 'vegetarian', label: 'Vegetarian', icon: <Salad className="w-4 h-4" /> },
  { id: 'vegan', label: 'Vegan', icon: <Apple className="w-4 h-4" /> },
  { id: 'gluten-free', label: 'Gluten-Free', icon: <Wheat className="w-4 h-4" /> },
  {
    id: 'nut-allergy',
    label: 'Nut Allergy',
    icon: <AlertTriangle className="w-4 h-4" />,
    isAllergyAlert: true,
  },
  { id: 'dairy-free', label: 'Dairy-Free', icon: <Milk className="w-4 h-4" /> },
  { id: 'pescatarian', label: 'Pescatarian / Seafood', icon: <Fish className="w-4 h-4" /> },
];

export function DietaryMatrixSection({
  guests,
  onFilterByDietary,
  className = '',
}: DietaryMatrixSectionProps) {
  // Compute guests by restriction
  const matrixData = useMemo(() => {
    const map: Record<string, Guest[]> = {
      vegetarian: [],
      vegan: [],
      'gluten-free': [],
      'nut-allergy': [],
      'dairy-free': [],
      pescatarian: [],
      other: [],
    };

    for (const g of guests) {
      const restrictions = (g.dietaryRestrictions || []).map((r) => r.toLowerCase().trim());
      let matchedAny = false;

      for (const cat of CATEGORIES) {
        const catKey = cat.id;
        const matches = restrictions.some(
          (r) =>
            r.includes(catKey) ||
            (catKey === 'nut-allergy' && (r.includes('nut') || r.includes('pine'))) ||
            (catKey === 'gluten-free' && (r.includes('gluten') || r.includes('celiac'))) ||
            (catKey === 'pescatarian' && (r.includes('seafood') || r.includes('fish') || r.includes('pesca')))
        );

        if (matches) {
          map[catKey].push(g);
          matchedAny = true;
        }
      }

      // Check if there is a custom note without matching categories
      if (!matchedAny && (restrictions.length > 0 || g.dietaryNotes)) {
        map.other.push(g);
      }
    }

    return map;
  }, [guests]);

  // Guests with any dietary needs
  const guestsWithDietary = useMemo(() => {
    return guests.filter(
      (g) => (g.dietaryRestrictions && g.dietaryRestrictions.length > 0) || g.dietaryNotes
    );
  }, [guests]);

  const handlePrintSummary = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <section
      aria-label="Dietary & Banquet Matrix"
      className={`w-full bg-surface-container-lowest rounded-2xl shadow-sm border border-surface-container-low p-6 md:p-8 flex flex-col gap-6 ${className}`}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-surface-container-low">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-headline-sm text-xl md:text-2xl text-on-surface font-serif">
              Dietary &amp; Banquet Matrix
            </h3>
            <span className="px-2.5 py-0.5 rounded-full bg-secondary-fixed text-on-secondary-fixed text-[11px] font-label-uppercase font-semibold">
              {guestsWithDietary.length} Flagged
            </span>
          </div>
          <p className="font-body-sm text-xs md:text-sm text-outline mt-0.5">
            Catering roster and allergen prep alerts for Executive Chef and Villa Bellissima banqueting staff.
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={handlePrintSummary}
          className="text-xs font-label-uppercase tracking-wider self-start sm:self-auto"
          iconLeft={<Printer className="w-3.5 h-3.5" />}
        >
          Print Catering Roster
        </Button>
      </div>

      {/* 6 Category Breakdown Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {CATEGORIES.map((cat) => {
          const list = matrixData[cat.id] || [];
          return (
            <div
              key={cat.id}
              data-testid={`dietary-card-${cat.id}`}
              className={`rounded-xl p-4 flex flex-col justify-between border transition-all ${
                cat.isAllergyAlert
                  ? 'bg-error-container/20 border-error/30'
                  : 'bg-surface-container-low border-surface-container-high/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`p-1.5 rounded-lg ${
                        cat.isAllergyAlert
                          ? 'bg-error text-on-error'
                          : 'bg-surface-container-highest text-secondary'
                      }`}
                    >
                      {cat.icon}
                    </div>
                    <span className="font-label-uppercase text-xs font-bold tracking-wider text-on-surface">
                      {cat.label}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-headline-sm font-semibold ${
                      cat.isAllergyAlert
                        ? 'bg-error text-on-error'
                        : 'bg-primary-fixed text-on-primary-fixed'
                    }`}
                  >
                    {list.length}
                  </span>
                </div>

                {/* Guest Chips */}
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {list.length > 0 ? (
                    list.map((g) => (
                      <span
                        key={g.id}
                        onClick={() => onFilterByDietary?.(cat.id)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-body-sm transition-colors cursor-pointer ${
                          cat.isAllergyAlert
                            ? 'bg-error-container text-on-error-container hover:bg-error/20 font-medium'
                            : 'bg-surface-container-highest text-on-surface hover:bg-surface-container'
                        }`}
                        title={`${g.name} (${g.tableName || 'Unassigned'})`}
                      >
                        <span className="font-medium">{g.name}</span>
                        <span className="text-[10px] opacity-75">
                          • {g.tableName?.split('—')[0].trim() || 'No Table'}
                        </span>
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-outline italic">No guests with this restriction</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Catering Notes Wall */}
      <div className="pt-2">
        <h4 className="font-label-uppercase text-xs text-secondary uppercase tracking-widest font-bold mb-3 flex items-center gap-2">
          <UtensilsCrossed className="w-4 h-4 text-secondary" />
          <span>Specific Banquet Preparation Advisories ({guestsWithDietary.length})</span>
        </h4>

        <div className="overflow-x-auto rounded-xl border border-surface-container-high/60">
          <table className="w-full min-w-[540px] text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low font-label-uppercase text-[10px] text-outline uppercase tracking-wider border-b border-surface-container-high">
                <th className="py-2.5 px-3">Guest Name</th>
                <th className="py-2.5 px-3">Table Placement</th>
                <th className="py-2.5 px-3">Flags</th>
                <th className="py-2.5 px-3">Kitchen Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low/60 bg-surface-container-lowest">
              {guestsWithDietary.slice(0, 10).map((g) => (
                <tr key={g.id} className="hover:bg-surface-container-low/40">
                  <td className="py-2.5 px-3 font-medium text-on-surface">{g.name}</td>
                  <td className="py-2.5 px-3 text-secondary">{g.tableName || 'Unassigned'}</td>
                  <td className="py-2.5 px-3">
                    <span className="inline-block px-1.5 py-0.5 rounded bg-surface-container-high text-[10px] font-label-uppercase">
                      {(g.dietaryRestrictions || []).join(', ') || 'Custom'}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-outline italic">
                    {g.dietaryNotes || 'Standard preparation'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
