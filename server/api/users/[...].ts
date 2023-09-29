import { createRouter, defineEventHandler, useBase } from 'h3'

const router = createRouter()

router.get('/:userId/sessions', defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  if (userId !== event.context.session?.user?.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  else {
    const sessions = await auth.getAllUserSessions(event.context.session.user.userId)
    return sessions
  }
}))

router.post('/:userId/sessions', defineEventHandler(async (event) => {
  const userId = getRouterParam(event, 'userId')
  if (!userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }
  if (userId !== event.context.session?.user?.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  else {
    const session = await auth.createSession({ userId, attributes: {} })
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
  if (userId !== event.context.session?.user?.userId) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
    })
  }
  else {
    await auth.invalidateSession(sessionId)
    return {
      success: true,
    }
  }
}))

export default useBase('/api/users', router.handler)
