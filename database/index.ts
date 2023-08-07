import process from 'node:process'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import 'dotenv/config'
import postgres from 'postgres'

const postgresConnectionOptions = {
  host: process.env.NUXT_POSTGRES_HOST,
  port: Number(process.env.NUXT_POSTGRES_PORT),
  user: process.env.NUXT_POSTGRES_USER,
  password: process.env.NUXT_POSTGRES_PASSWORD,
  database: process.env.NUXT_POSTGRES_DATABASE,
}

const queryClient = postgres(
  postgresConnectionOptions,
)

const drizzleClient: PostgresJsDatabase = drizzle(queryClient)

export {
  drizzleClient,
}
