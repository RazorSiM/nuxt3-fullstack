import process from 'node:process'
import { defineConfig } from 'drizzle-kit'

const config = process.env
const connectionString = `postgresql://${config.NUXT_POSTGRES_USER}:${config.NUXT_POSTGRES_PASSWORD}@${config.NUXT_POSTGRES_HOST}:${config.NUXT_POSTGRES_PORT}/${config.NUXT_POSTGRES_DATABASE}`

export default defineConfig({
  dialect: 'postgresql',
  schema: './server/utils/database/**/schema.ts',
  out: './drizzle',
  breakpoints: true,
  dbCredentials: {
    url: connectionString,
  },
})
