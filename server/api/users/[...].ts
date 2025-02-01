import { createRouter, defineEventHandler, useBase } from 'h3'
import { z } from 'zod'

const router = createRouter()

const usernameSchema = z.object({
  username: z.string().min(3).max(20),
})
router.put('/:userId', defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const userId = getRouterParam(event, 'userId')
  if (userId !== session.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  const body = await readValidatedBody(event, usernameSchema.safeParse)
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }
  else {
    try {
      const newUser = await modifyUsername(session.user.id, body.data.username)
      return newUser
    }
    catch (e) {
      throw createError({
        statusCode: 500,
        statusMessage: `Internal Server Error: ${e}`,
      })
    }
  }
}))

export default useBase('/api/users', router.handler)
