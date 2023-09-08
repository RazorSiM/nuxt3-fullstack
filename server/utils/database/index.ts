import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { todos } from './todos'
import { users } from './users'

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

const db = drizzle(sql, { schema: { ...users, ...todos } })

export * from './users'
export * from './todos'
export {
  sql,
  db,
}
