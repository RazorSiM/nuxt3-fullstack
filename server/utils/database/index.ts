import 'dotenv/config'
import process from 'node:process'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { todos, users } from './schema'

const config = process.env

const postgresConnectionOptions = {
  host: config.NUXT_POSTGRES_HOST,
  port: Number(config.NUXT_POSTGRES_PORT),
  user: config.NUXT_POSTGRES_USER,
  password: config.NUXT_POSTGRES_PASSWORD,
  database: config.NUXT_POSTGRES_DATABASE,
}

const sql = postgres({
  ...postgresConnectionOptions,
})

const db = drizzle(sql, { schema: { ...users, ...todos } })

export * from './handlers'
export * from './schema'
export {
  sql,
  db,
}
