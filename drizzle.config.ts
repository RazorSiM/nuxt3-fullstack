/* eslint-disable n/prefer-global/process */

import type { Config } from 'drizzle-kit'
import 'dotenv/config'

export default {
  schema: './server/utils/database/**/schema.ts',
  out: './drizzle',
  driver: 'pg',
  dbCredentials: {
    host: process.env.NUXT_POSTGRES_HOST ?? '',
    port: Number(process.env.NUXT_POSTGRES_PORT ?? ''),
    user: process.env.NUXT_POSTGRES_USER ?? '',
    password: process.env.NUXT_POSTGRES_PASSWORD ?? '',
    database: process.env.NUXT_POSTGRES_DATABASE ?? '',
  },
} satisfies Config
