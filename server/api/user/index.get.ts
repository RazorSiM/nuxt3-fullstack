import { getServerSession } from '#auth'
import { selectUser } from '@/database/users/handlers'

export default defineEventHandler(async (event) => {
  const session = await getServerSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
  else if (session.user?.email) {
    const user = await selectUser(session.user.email)
    return user
  }
})
