import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const families = sqliteTable('families', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  nameNormalized: text('name_normalized').notNull().unique(),
  invitedCount: integer('invited_count').notNull(),
  /** Manual admin tracking: whether this family has been invited */
  inviteSent: integer('invite_sent', { mode: 'boolean' }).notNull().default(false),
  token: text('token').notNull().unique(),
  status: text('status', { enum: ['pending', 'responded'] })
    .notNull()
    .default('pending'),
  attending: text('attending', { enum: ['yes', 'no'] }),
  attendingCount: integer('attending_count'),
  createdAt: integer('created_at', { mode: 'timestamp_ms' })
    .notNull()
    .$defaultFn(() => new Date()),
})

export type Family = typeof families.$inferSelect
export type NewFamily = typeof families.$inferInsert
