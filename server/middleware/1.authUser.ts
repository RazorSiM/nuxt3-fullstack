import type { Session } from 'lucia'

function checkPath(path: string, paths: string[]): boolean {
  return paths.some(p => path.startsWith(p))
}
const protectedPaths = [
  '/api/todos',
  '/api/users',
]

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event)
  if (checkPath(event.path, protectedPaths)) {
    const authorizationHeader = getHeader(event, 'Authorization')
    let session: Session | null = null

    if (authorizationHeader)
      session = await authRequest.validateBearerToken()
    else
      session = await authRequest.validate()

    if (!session) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }
    else {
      event.context.session = session
    }
  }
})
