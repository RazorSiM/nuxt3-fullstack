import { relations } from 'drizzle-orm'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { boolean, integer, pgTable, primaryKey, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const userTable = pgTable('user', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  email: text('email').notNull().unique(),
})

export const sessionTable = pgTable('session', {
  id: text('id').primaryKey(),
  userId: text('user_id')
    .notNull()
    .references(() => userTable.id),
  expiresAt: timestamp('expires_at', {
    withTimezone: true,
    mode: 'date',
  }).notNull(),
})

export const oauthAccountTable = pgTable('oauth_account', {
  providerId: text('provider_id').notNull(),
  providerUserId: text('provider_user_id').notNull(),
  userId: text('user_id').notNull().references(() => userTable.id),
}, (table) => {
  return {
    pk: primaryKey({ columns: [table.providerId, table.providerUserId] }),
  }
})

export const todoTable = pgTable('todo', {
  id: serial('id').primaryKey(),
  position: integer('position'),
  userId: text('user_id').references(() => userTable.id).notNull(),
  title: text('title').notNull().unique(),
  description: text('description'),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deleted: boolean('deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at'),
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
