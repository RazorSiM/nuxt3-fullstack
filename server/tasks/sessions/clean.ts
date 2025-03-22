export default defineTask({
  meta: {
    name: 'sessions:clean',
    description: 'Clean expired sessions',
  },
  run() {
    console.log('Cleaning expired sessions...')
    cleanupExpiredSessions()
    return { result: 'Success' }
  },
})
