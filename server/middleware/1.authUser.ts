export default defineEventHandler(async (event) => {
  function checkPath(path: string, paths: string[]): boolean {
    return paths.some(p => path.startsWith(p))
  }
  const protectedPaths = [
    '/api/todos',
    '/api/user',
  ]
  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()

  if (checkPath(event.path, protectedPaths)) {
    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }
    else {
      event.context.userId = session.user.userId
    }
  }
})
