import { relations } from 'drizzle-orm'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { bigint, pgTable, text } from 'drizzle-orm/pg-core'
import { todos } from '../todos'

/**
 * This schema is taken from https://v2.lucia-auth.com/database-adapters/pg
 */

export const users = pgTable('auth_user', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
})

export const usersRelations = relations(users, ({ many }) => ({
  todo: many(todos),
}))

export const key = pgTable('auth_key', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  hashedPassword: text('hashed_password'),
})

export const session = pgTable('auth_session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => users.id),
  activeExpires: bigint('active_expires', { mode: 'number' }).notNull(),
  idleExpires: bigint('idle_expires', { mode: 'number' }).notNull(),
})

export type User = InferSelectModel<typeof users>
export type UserInsert = InferInsertModel<typeof users>
