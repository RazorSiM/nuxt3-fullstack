// import { verifyRequestOrigin } from 'lucia'
import type { Session } from 'lucia'

export default defineEventHandler(async (event) => {
  // if (event.method !== 'GET') {
  //   const originHeader = getHeader(event, 'Origin') ?? null
  //   const hostHeader = getHeader(event, 'Host') ?? null
  //   if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader]))
  //     return event.node.res.writeHead(403).end()
  // }

  const lucia = initializeLucia(hubDatabase())
  // check if the request has an Authorization header
  const authorizationHeader = getHeader(event, 'Authorization')
  let sessionId: string | null = null
  if (authorizationHeader) {
    // get the session id from the Authorization header
    sessionId = lucia.readBearerToken(authorizationHeader)
  }
  else {
    // if there is no Authorization header, get the session id from the session cookie
    sessionId = getCookie(event, lucia.sessionCookieName) ?? null
  }
  // if there is no session id, set the session and user to null in the context
  if (!sessionId) {
    event.context.session = null
    event.context.user = null
  }
  else {
    // validate the session id
    const { session, user } = await lucia.validateSession(sessionId)
    // if the session is there and it's fresh, create a new session cookie from the session id and set it in the response headers
    if (session && session.fresh) {
      appendResponseHeader(
        event,
        'Set-Cookie',
        lucia.createSessionCookie(session.id).serialize(),
      )
    }

    // if there is no session, create a new blank session cookie and set it in the response headers
    // this basically delete the existing session cookie
    if (!session)
      appendResponseHeader(event, 'Set-Cookie', lucia.createBlankSessionCookie().serialize())

    // set the session and the user in the context
    event.context.session = session
    event.context.user = user as User
  }
})

declare module 'h3' {
  interface H3EventContext {
    user: User | null
    session: Session | null
  }
}
