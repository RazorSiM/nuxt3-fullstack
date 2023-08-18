import { eq } from 'drizzle-orm'
import { db } from '../index'
import type { User } from './schema'
import { user } from './schema'

export async function selectUserByEmail(email: string): Promise<User> {
  const result = await db.select().from(user).where(eq(user.email, email))
  return result[0]
}
