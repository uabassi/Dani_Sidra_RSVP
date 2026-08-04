import { asc } from 'drizzle-orm'
import { isAdminAuthenticated } from '@/lib/auth'
import { computeStats, toFamilyRows } from '@/lib/admin-data'
import { db } from '@/lib/db'
import { families } from '@/lib/db/schema'
import { AdminDashboard } from '@/components/admin/dashboard'
import { AdminDbError } from '@/components/admin/db-error'
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
  } catch (error) {
    console.error('Admin dashboard DB error:', error)
    return (
      <AdminDbError message="You are signed in, but the guest list could not be loaded from the database." />
    )
  }
}
