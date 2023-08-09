import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'
import 'dotenv/config'
import postgres from 'postgres'

const runtimeConfig = useRuntimeConfig()

const postgresConnectionOptions = {
  host: runtimeConfig.postgresHost,
  port: Number(runtimeConfig.postgresPort),
  user: runtimeConfig.postgresUser,
  password: runtimeConfig.postgresPassword,
  database: runtimeConfig.postgresDatabase,
}

const queryClient = postgres(
  postgresConnectionOptions,
)

const drizzleClient: PostgresJsDatabase = drizzle(queryClient)

export {
  drizzleClient,
}
