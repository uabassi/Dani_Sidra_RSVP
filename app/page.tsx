import { asc } from 'drizzle-orm'
import { isAdminAuthenticated } from '@/lib/auth'
import { computeStats, toFamilyRows } from '@/lib/admin-data'
import { db } from '@/lib/db'
import { families } from '@/lib/db/schema'
import { AdminDashboard } from '@/components/admin/dashboard'
import { AdminLogin } from '@/components/admin/login-form'

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const authenticated = await isAdminAuthenticated()

  if (!authenticated) {
    return <AdminLogin />
  }

  try {
    const rows = await db.select().from(families).orderBy(asc(families.name))
    return (
      <AdminDashboard initialFamilies={toFamilyRows(rows)} initialStats={computeStats(rows)} />
    )
  } catch {
    // Stale session + schema/DB hiccup should not hard-crash the page
    return <AdminLogin />
  }
}
