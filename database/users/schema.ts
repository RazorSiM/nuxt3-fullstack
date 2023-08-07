import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'
import type { InferModel } from 'drizzle-orm'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  address: varchar('address', { length: 42 }),
})

export type User = InferModel<typeof users, 'select'>
export type NewUser = InferModel<typeof users, 'insert'>

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(users)

// Schema for selecting a user - can be used to validate API responses
export const selectUserSchema = createSelectSchema(users)
