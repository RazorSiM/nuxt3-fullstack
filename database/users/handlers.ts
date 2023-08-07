import { asc, desc, eq } from 'drizzle-orm'
import { drizzleClient } from '../index'
import type { NewUser, User } from './schema'
import { users } from './schema'

export async function selectUser(id: number): Promise<User> {
  const result = await drizzleClient.select().from(users).where(eq(users.id, id))
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
export async function addUser(newUser: NewUser): Promise<User> {
  const result = await drizzleClient.insert(users).values(newUser).returning()
  return result[0]
}
export async function updateUser(id: number, newUser: NewUser): Promise<User> {
  const result = await drizzleClient.update(users).set(newUser).where(eq(users.id, id)).returning()
  return result[0]
}
