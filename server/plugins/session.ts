import { validateSession, deleteSession, cleanupExpiredSessions } from '../utils/database/handlers'

// Run session cleanup periodically (every 24 hours)
const CLEANUP_INTERVAL = 24 * 60 * 60 * 1000 // 24 hours

export default defineNitroPlugin(() => {
  // Run session cleanup on startup and periodically
  cleanupExpiredSessions()
  setInterval(cleanupExpiredSessions, CLEANUP_INTERVAL)

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
