import { createRouter, defineEventHandler, useBase } from 'h3'
import { z } from 'zod'

const router = createRouter()

const usernameSchema = z.object({
  username: z.string().min(3).max(20),
})
router.patch('/:userId', defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const userId = getRouterParam(event, 'userId')
  console.log('userId', userId)
  console.log('session.user.id', session.user.id)
  if (userId !== session.user.id) {
    console.log('here')
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
      await replaceUserSession(event, {
        user: {
          id: newUser.id,
          username: newUser.username,
          email: newUser.email,
        },
      })
      return { message: 'Username updated successfully' }
    }
    catch (e) {
      throw createError({
        statusCode: 500,
        statusMessage: `Internal Server Error: ${e}`,
      })
    }
  }
}))
router.get('/:userId/sessions', defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const userId = getRouterParam(event, 'userId')

  if (userId !== session.user.id) {
    console.log('here')
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  try {
    return await getUserSessions(session.user.id)
  }
  catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: `Internal Server Error: ${e}`,
    })
  }
}))
router.delete('/:userId/sessions/:sessionId', defineEventHandler(async (event) => {
  const session = await requireUserSession(event)

  const userId = getRouterParam(event, 'userId')
  const sessionId = getRouterParam(event, 'sessionId')

  if (userId !== session.user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  if (!sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }
  try {
    await deleteSession(sessionId)
    return {}
  }
  catch (e) {
    throw createError({
      statusCode: 500,
      statusMessage: `Internal Server Error: ${e}`,
    })
  }
}))

export default useBase('/api/users', router.handler)
