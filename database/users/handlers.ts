import { asc, desc, eq } from 'drizzle-orm'
import { drizzleClient } from '../index'
import type { User } from './schema'
import { users } from './schema'

export async function selectUser(email: string): Promise<User> {
  const result = await drizzleClient.select().from(users).where(eq(users.email, email))
  return result[0]
}
export async function selectUsers(): Promise<User[]> {
  return await drizzleClient.select().from(users)
}
export async function selectUsersPaginated(
  page: 1,
  perPage: 10,
  orderBy?: keyof User,
  orderDirection?: 'asc' | 'desc',
): Promise<User[]> {
  const sq = drizzleClient.select().from(users).limit(perPage).offset(page * perPage).as('sq')
  if (orderBy)
    return await drizzleClient.select().from(sq).orderBy(orderDirection === 'asc' ? asc(users[orderBy]) : desc(users[orderBy]))
  else
    return await drizzleClient.select().from(sq)
}

export async function updateUser(id: string, address: string): Promise<User> {
  const result = await drizzleClient.update(users).set({ address }).where(eq(users.id, id)).returning()
  return result[0]
}
