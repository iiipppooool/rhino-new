import { NextResponse } from 'next/server';
import { getStaff } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';

const COLUMNS = [
  'created_at', 'type', 'status', 'name', 'email', 'phone', 'organisation',
  'service', 'preferred_date', 'backup_date', 'start_time', 'group_size',
  'age_range', 'venue_postcode', 'source', 'marketing_opt_in', 'message',
  'internal_notes',
] as const;

/**
 * Escapes a CSV cell.
 *
 * The leading apostrophe on =, +, - and @ stops spreadsheet software treating a
 * visitor-supplied value as a formula. Without it, a message starting with "="
 * becomes executable when the export is opened in Excel.
 */
function cell(value: unknown): string {
  if (value == null) return '';
  let s = String(value);
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET() {
  // This route is outside the dashboard layout, so it does its own check.
  const staff = await getStaff();
  if (!staff) {
    return new NextResponse('Not found', { status: 404 });
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('enquiries')
    .select(COLUMNS.join(','))
    .order('created_at', { ascending: false });

  if (error) return new NextResponse('Export failed', { status: 500 });

  const rows = (data ?? []) as unknown as Record<string, unknown>[];
  const csv = [
    COLUMNS.join(','),
    ...rows.map((r) => COLUMNS.map((c) => cell(r[c])).join(',')),
  ].join('\r\n');

  const stamp = new Date().toISOString().slice(0, 10);
  return new NextResponse(`﻿${csv}`, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="vrhino-enquiries-${stamp}.csv"`,
      'cache-control': 'no-store',
    },
  });
}
