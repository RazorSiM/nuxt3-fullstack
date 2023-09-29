import { z } from 'zod'

const usernameSchema = z.object({
  username: z.string().min(3).max(20),
})

export default defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  if (userId !== event.context.session.user.userId) {
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
      const newUser = await modifyUsername(event.context.session.user.userId, body.data.username)
      return newUser
    }
    catch (e) {
      throw createError({
        statusCode: 500,
        statusMessage: `Internal Server Error: ${e}`,
      })
    }
  }
})
