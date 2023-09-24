import { relations } from 'drizzle-orm'
import type { InferInsertModel, InferSelectModel } from 'drizzle-orm'
import { bigint, boolean, integer, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

/**
 * This schema is taken from https://v2.lucia-auth.com/database-adapters/pg
 */

export const users = pgTable('auth_user', {
  id: text('id').primaryKey(),
  username: text('username').unique().notNull(),
  email: text('email').unique().notNull(),
})
export const todos = pgTable('todos', {
  id: serial('id').primaryKey(),
  position: integer('position'),
  userId: text('user_id').references(() => users.id).notNull(),
  title: text('title').notNull().unique(),
  description: text('description'),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  deleted: boolean('deleted').notNull().default(false),
  deletedAt: timestamp('deleted_at'),
})

export const todoRelations = relations(todos, ({ one }) => ({
  user: one(users, {
    fields: [todos.userId],
    references: [users.id],
  }),
}))

export type Todo = InferSelectModel<typeof todos>
export type TodoInsert = InferInsertModel<typeof todos>

export const insertTodoSchema = createInsertSchema(todos)
export const selectTodoSchema = createSelectSchema(todos)

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
