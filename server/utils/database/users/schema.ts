import type { InferModel } from 'drizzle-orm'
import { bigint, pgTable, text } from 'drizzle-orm/pg-core'

/**
 * This schema is taken from https://v2.lucia-auth.com/database-adapters/pg
 */

export const user = pgTable('auth_user', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
})

export const key = pgTable('auth_key', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  hashedPassword: text('hashed_password'),
})

export const session = pgTable('auth_session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => user.id),
  activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
  idleExpires: bigint('idle_expires', { mode: 'number' }).notNull(),
})

export type User = InferModel<typeof user>
