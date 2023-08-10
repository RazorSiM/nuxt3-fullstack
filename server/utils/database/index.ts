import 'dotenv/config'
import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

const runtimeConfig = useRuntimeConfig()

const postgresConnectionOptions = {
  host: runtimeConfig.postgresHost,
  port: Number(runtimeConfig.postgresPort),
  user: runtimeConfig.postgresUser,
  password: runtimeConfig.postgresPassword,
  database: runtimeConfig.postgresDatabase,
}

const sql = postgres({
  ...postgresConnectionOptions,
})

const db: PostgresJsDatabase = drizzle(sql)

export {
  sql,
  db,
}
