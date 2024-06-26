import process from 'node:process'
import { drizzle } from 'drizzle-orm/d1'
import { sessionTable, todoTable, userTable } from './schema'

const config = process.env

const sql = hubDatabase()

const db = drizzle(sql, { schema: { ...userTable, ...todoTable, ...sessionTable }, logger: config.NODE_ENV === 'development' })

export * as handlers from './handlers'
export * as schemas from './schema'
export {
  sql,
  db,
}

export interface DatabaseUser {
  id: string
  username: string
  email: string
}
