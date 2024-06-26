import { createRouter, defineEventHandler, useBase } from 'h3'
import { z } from 'zod'

const router = createRouter()

const usernameSchema = z.object({
  username: z.string().min(3).max(20),
})
router.put('/:userId', defineEventHandler(async (event) => {
  if (!event.context.user || !event.context.session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const userId = getRouterParam(event, 'userId')
  if (userId !== event.context.session.userId) {
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
      const newUser = await modifyUsername(event.context.session.userId, body.data.username)
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
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const userId = getRouterParam(event, 'userId')
  if (userId !== event.context.user?.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  else {
    const lucia = initializeLucia(hubDatabase())
    const sessions = await lucia.getUserSessions(event.context.user.id)
    return sessions
  }
}))

router.post('/:userId/sessions', defineEventHandler(async (event) => {
  if (!event.context.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  const userId = getRouterParam(event, 'userId')
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }
  if (userId !== event.context.user?.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  else {
    const lucia = initializeLucia(hubDatabase())
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
  if (!event.context.user || !event.context.session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }
  if (userId !== event.context.user.id) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  else {
    const lucia = initializeLucia(hubDatabase())
    await lucia.invalidateSession(sessionId)
    return {
      success: true,
    }
  }
}))

export default useBase('/api/users', router.handler)
