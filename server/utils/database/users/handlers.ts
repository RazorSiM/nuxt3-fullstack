import { eq } from 'drizzle-orm'
import { db } from '../index'
import type { User } from './schema'
import { user } from './schema'

export async function selectUserByEmail(email: string): Promise<User> {
  const result = await db.select().from(user).where(eq(user.email, email))
  return result[0]
}

export async function modifyUsername(userId: string, username: string): Promise<User> {
  const result = await db.update(user).set({ username }).where(eq(user.id, userId)).returning()
  return result[0]
}
