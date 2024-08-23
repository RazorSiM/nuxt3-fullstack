import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  dialect: 'sqlite',
  schema: './server/utils/database/**/schema.ts',
  out: './drizzle',
})
