import { relations, sql } from 'drizzle-orm'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { integer, sqliteTable, primaryKey, text } from 'drizzle-orm/sqlite-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const userTable = sqliteTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
})

export const sessionTable = sqliteTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: integer('expires_at').notNull(),
})

export const oauthAccountTable = sqliteTable('oauth_account', {
  providerId: text('provider_id').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  userId: text('user_id').notNull().references(() => userTable.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
  }
})

export const todoTable = sqliteTable('todo', {
  id: integer('id').primaryKey(),
  position: integer('position'),
  userId: text('user_id').references(() => userTable.id).notNull(),
  title: text('title').notNull().unique(),
  description: text('description'),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull().default(sql`(unixepoch())`),
  deleted: integer('deleted', { mode: 'boolean' }).notNull().default(false),
  deletedAt: integer('deleted_at', { mode: 'timestamp' }),
})

export const todoRelations = relations(todoTable, ({ one }) => ({
  user: one(userTable, {
    fields: [todoTable.userId],
    references: [userTable.id],
  }),
}))

export type Todo = InferSelectModel<typeof todoTable>
export type TodoInsert = InferInsertModel<typeof todoTable>

export const insertTodoSchema = createInsertSchema(todoTable)
export const selectTodoSchema = createSelectSchema(todoTable)

export const usersRelations = relations(userTable, ({ many }) => ({
  todo: many(todoTable),
}))

export type User = InferSelectModel<typeof userTable>
export type UserInsert = InferInsertModel<typeof userTable>
