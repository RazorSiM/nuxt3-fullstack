import process from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { sessionTable, todoTable, userTable } from './schema'

const config = process.env
const connectionString = `postgresql://${config.NUXT_POSTGRES_USER}:${config.NUXT_POSTGRES_PASSWORD}@${config.NUXT_POSTGRES_HOST}:${config.NUXT_POSTGRES_PORT}/${config.NUXT_POSTGRES_DATABASE}`

const sql = postgres(connectionString)

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
