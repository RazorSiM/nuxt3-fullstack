import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import { drizzle } from 'drizzle-orm/postgres-js'

import * as postgres from 'postgres'

const runtimeConfig = useRuntimeConfig()

const postgresConnectionOptions = {
  host: runtimeConfig.app.postgresHost,
  port: Number(runtimeConfig.app.postgresPort),
  user: runtimeConfig.app.postgresUser,
  password: runtimeConfig.app.postgresPassword,
  database: runtimeConfig.app.postgresDatabase,
}

const queryClient = postgres(
  postgresConnectionOptions,
)

const drizzleClient: PostgresJsDatabase = drizzle(queryClient)

export {
  drizzleClient,
}
