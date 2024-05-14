function checkPath(path: string, paths: string[]): boolean {
  return paths.some(p => path.startsWith(p))
}
const protectedPaths = [
  '/api/todos',
  '/api/users',
]

export default defineEventHandler(async (event) => {
  // check if the server route is protected
  if (checkPath(event.path, protectedPaths)) {
    // if the route is protected, check if the request has a session or a user in the context
    if (!event.context.session || !event.context.user) {
      // if there is no session or user in the context, throw an unauthorized error
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }
  }
})
