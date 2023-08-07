/* eslint-disable @typescript-eslint/no-require-imports */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable n/prefer-global/process */

require('dotenv').config()
const { drizzle } = require('drizzle-orm/postgres-js')
const { migrate } = require('drizzle-orm/postgres-js/migrator')
const postgres = require('postgres')

const postgresConnectionOptions = {
  host: process.env.NUXT_POSTGRES_HOST,
  port: Number(process.env.NUXT_POSTGRES_PORT),
  user: process.env.NUXT_POSTGRES_USER,
  password: process.env.NUXT_POSTGRES_PASSWORD,
  database: process.env.NUXT_POSTGRES_DATABASE,
  max: 1,
}

const client = postgres(
  postgresConnectionOptions,
)

const drizzleClient = drizzle(client)

function main() {
  migrate(drizzleClient, { migrationsFolder: './drizzle' })
    .then(() => {
      console.log('Migrations complete')
      process.exit(0)
    })
    .catch((error: Error) => {
      console.error('Migration Failed', error)
      process.exit(0)
    })
}

main()
