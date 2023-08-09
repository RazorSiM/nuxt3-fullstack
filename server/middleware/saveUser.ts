import { getServerSession } from '#auth'
import { createUser } from '@/database/users/handlers'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (session && session.user && session.user.name && session.user.email)
    await createUser({ name: session.user.name, email: session.user.email })
})
