import { pgTable, serial, text, varchar } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name'),
  address: varchar('address', { length: 42 }),
})
