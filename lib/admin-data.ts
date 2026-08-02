import type { Family } from '@/lib/db/schema'
import type { DashboardStats } from '@/components/admin/dashboard'

export type FamilyRow = Omit<Family, 'createdAt'> & {
  createdAt: string
}

export function toFamilyRows(rows: Family[]): FamilyRow[] {
  return rows.map((r) => ({
    ...r,
    createdAt:
      r.createdAt instanceof Date ? r.createdAt.toISOString() : String(r.createdAt),
  }))
}

export function computeStats(rows: Family[]): DashboardStats {
  return {
    families: rows.length,
    pending: rows.filter((r) => r.status === 'pending').length,
    responded: rows.filter((r) => r.status === 'responded').length,
    invitedHeadcount: rows.reduce((sum, r) => sum + r.invitedCount, 0),
    attendingTotal: rows
      .filter((r) => r.attending === 'yes')
      .reduce((sum, r) => sum + (r.attendingCount ?? 0), 0),
  }
}
