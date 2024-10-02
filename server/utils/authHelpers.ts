import type { H3Event } from 'h3'

interface AuthenticateOauthUserOptions {
  providerName: 'github' | 'discord'
  providerUserEmail: string
  providerUsername: string
  providerUserId: string
}

export async function createSessionCookie(userId: string) {
  const lucia = initializeLucia(hubDatabase())
  const session = await lucia.createSession(userId, {})
  const sessionCookie = lucia.createSessionCookie(session.id)
  return { sessionCookie, lucia }
}

export async function createNewPasswordUser(email: string, plainPassword: string, event: H3Event) {
  const user = await selectUserByEmail(email)
  if (user) {
    throw createError({
      statusCode: 409,
      message: 'Conflict',
    })
  }
  const passwordHash = await hashPassword(plainPassword)
  const newUser = await createUser(email, email, passwordHash)
  const { sessionCookie } = await createSessionCookie(newUser.id)
  setCookie(event, sessionCookie.name, sessionCookie.value)
}

export async function authenticatePasswordUser(email: string, plainPassword: string, event: H3Event) {
  const user = await selectUserByEmail(email)
  if (!user || !user.passwordHash) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
  const isValid = await verifyPassword(user.passwordHash, plainPassword)
  if (!isValid) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }
  const { sessionCookie } = await createSessionCookie(user.id)
  setCookie(event, sessionCookie.name, sessionCookie.value)
}

export async function authenticateOauthUser(options: AuthenticateOauthUserOptions, event: H3Event) {
  // check if user exists in the database
  const existingUser = await selectUserByEmail(options.providerUserEmail)
  if (existingUser) {
    // check if the user has an existing oauth account
    const existingOauthAccount = await getExistingOauthAccount(options.providerName, existingUser.id)
    if (!existingOauthAccount) {
      // if the user does not have an existing oauth account, create one
      await createOauthAccount(options.providerName, options.providerUserId, existingUser.id)
    }
    // create a session cookie for the user
    const { sessionCookie } = await createSessionCookie(existingUser.id)
    // set the session cookie
    setCookie(event, sessionCookie.name, sessionCookie.value)
  }
  else {
    const user = await createUser(options.providerUsername, options.providerUserEmail)
    await createOauthAccount(options.providerName, options.providerUserId, user.id)
    const { sessionCookie } = await createSessionCookie(user.id)
    setCookie(event, sessionCookie.name, sessionCookie.value)
  }
}

export async function getUserAndSession(event: H3Event) {
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
  // if there is no session id, return early
  if (!sessionId) {
    return { user: null, sessionId: null }
  }
  // validate the session id and get the user and session
  const { user, session } = await lucia.validateSession(sessionId)

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

  return { user, session, lucia }
}

export async function requireUserSession(event: H3Event) {
  const { user, session, lucia } = await getUserAndSession(event)
  // if there is no session, throw an error
  if (!session || !user) {
    throw createError({
      statusCode: 401,
      message: 'Unauthorized',
    })
  }

  return {
    session,
    user,
    lucia,
  }
}
