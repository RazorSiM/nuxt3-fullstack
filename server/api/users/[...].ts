import { createRouter, defineEventHandler, useBase } from 'h3'

const router = createRouter()

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
    await lucia.invalidateSession(sessionId)
    return {
      success: true,
    }
  }
}))

export default useBase('/api/users', router.handler)
