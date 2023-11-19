import process from 'node:process'
import type { Config } from 'drizzle-kit'
import 'dotenv/config'

const config = process.env
const connectionString = `postgresql://${config.NUXT_POSTGRES_USER}:${config.NUXT_POSTGRES_PASSWORD}@${config.NUXT_POSTGRES_HOST}:${config.NUXT_POSTGRES_PORT}/${config.NUXT_POSTGRES_DATABASE}`
export default {
  schema: './server/utils/database/**/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    connectionString,
  },
} satisfies Config
