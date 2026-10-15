// src/components/admin/csv-export.ts
// Client-side RFC 4180 compliant CSV export generator for Guest Directory

import { Guest } from '@/lib/types';

/**
 * Escapes a single CSV cell value according to RFC 4180 rules:
 * - If value contains commas, double quotes, carriage returns or newlines,
 *   enclose the entire value in double quotes.
 * - Replace every internal double quote `"` with two double quotes `""`.
 */
export function escapeCSVValue(val: unknown): string {
  if (val === null || val === undefined) {
    return '';
  }
  const str = String(val);
  if (str.includes('"') || str.includes(',') || str.includes('\n') || str.includes('\r')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Generates an RFC 4180 compliant CSV string representing the guests list.
 */
export function exportGuestsToCSV(guests: Guest[]): string {
  const headers = [
    'Passcode',
    'Guest Name',
    'Household',
    'Category',
    'Seats',
    'Status',
    'Table',
    'Suite',
    'Shuttle',
    'Dietary Restrictions',
    'Dietary Notes',
  ];

  const rows: string[] = [headers.join(',')];

  for (const g of guests) {
    const dietaryList = Array.isArray(g.dietaryRestrictions)
      ? g.dietaryRestrictions.join('; ')
      : '';
    const row = [
      escapeCSVValue(g.passcode || ''),
      escapeCSVValue(g.name || ''),
      escapeCSVValue(g.household || g.name || ''),
      escapeCSVValue(g.category || 'General'),
      escapeCSVValue(g.partySize ?? 1),
      escapeCSVValue(g.status || 'pending'),
      escapeCSVValue(g.tableName || (g.tableId ? g.tableId : 'Unassigned')),
      escapeCSVValue(g.suite || ''),
      escapeCSVValue(g.shuttleReserved ? 'Yes' : 'No'),
      escapeCSVValue(dietaryList),
      escapeCSVValue(g.dietaryNotes || ''),
    ];
    rows.push(row.join(','));
  }

  return rows.join('\r\n');
}

/**
 * Triggers a client-side browser file download for the exported CSV.
 * Prepends UTF-8 Byte Order Mark (\uFEFF) for Microsoft Excel compatibility.
 */
export function downloadGuestsCSV(
  guests: Guest[],
  filename: string = 'julia_pedro_guest_directory_2026.csv'
): void {
  const csvContent = exportGuestsToCSV(guests);
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });

  // Browser download trigger
  if (typeof window !== 'undefined') {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
