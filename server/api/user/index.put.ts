import { z } from 'zod'

const usernameSchema = z.object({
  username: z.string().min(3).max(20),
})
export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()
  const body = await readValidatedBody(event, usernameSchema.safeParse)
  if (!body.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  else {
    try {
      const newUser = await modifyUsername(session.user.userId, body.data.username)
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
