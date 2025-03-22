import { validateSession, deleteSession } from '../utils/database/handlers'

export default defineNitroPlugin(() => {
  // Validate session when fetched
  sessionHooks.hook('fetch', async (session) => {
    if (session?.sessionToken) {
      const isValid = await validateSession(session.sessionToken)
      if (!isValid) {
        throw createError({
          statusCode: 401,
          message: 'Session expired',
        })
      }
    }
  })

  // Cleanup on session clear
  sessionHooks.hook('clear', async (session) => {
    if (session?.sessionToken) {
      await deleteSession(session.sessionToken)
    }
  })
})
