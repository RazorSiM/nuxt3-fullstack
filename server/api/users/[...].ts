import { createRouter, defineEventHandler, useBase } from 'h3'
import { z } from 'zod'

const router = createRouter()

const usernameSchema = z.object({
  username: z.string().min(3).max(20),
})
router.put('/:userId', defineEventHandler(async (event) => {
  const { session } = await requireUserSession(event)

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
      const newUser = await modifyUsername(session.userId, body.data.username)
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

router.get('/:userId/sessions', defineEventHandler(async (event) => {
  const { user, lucia } = await requireUserSession(event)

  const userId = getRouterParam(event, 'userId')
  if (userId !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  else {
    const sessions = await lucia.getUserSessions(user.id)
    return sessions
  }
}))

router.post('/:userId/sessions', defineEventHandler(async (event) => {
  const { user, lucia } = await requireUserSession(event)

  const userId = getRouterParam(event, 'userId')
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }
  if (userId !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  else {
    const session = await lucia.createSession(userId, {})
    return session
  }
}))

router.delete('/:userId/sessions/:sessionId', defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  const sessionId = getRouterParam(event, 'sessionId')
  if (!userId || !sessionId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }
  const { user, lucia } = await requireUserSession(event)

  if (userId !== user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  else {
    await lucia.invalidateSession(sessionId)
    return {
      success: true,
    }
  }
}))

export default useBase('/api/users', router.handler)
