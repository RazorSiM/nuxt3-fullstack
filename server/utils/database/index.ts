import { drizzle } from 'drizzle-orm/d1'
import { sessionTable, todoTable, userTable } from './schema'

export function useDrizzle() {
  return drizzle(hubDatabase(), { schema: { ...userTable, ...todoTable, ...sessionTable } })
}

export * as handlers from './handlers'
export * as schemas from './schema'

export interface DatabaseUser {
  id: string
  username: string
  email: string
}
