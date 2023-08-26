import { OAuthRequestError } from '@lucia-auth/oauth'

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()
  if (session)
    return sendRedirect(event, '/user')

  const storedState = getCookie(event, 'google_oauth_state')
  const query = getQuery(event)
  const state = query.state?.toString()
  const code = query.code?.toString()
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    throw createError({
      statusCode: 400,
    })
  }
  try {
    const { getExistingUser, googleUser, createUser, createKey } = await googleAuth.validateCallback(code)
    const existingUser = await getExistingUser()

    async function getUser() {
      if (existingUser)
        return existingUser
      if (!googleUser.email_verified) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Google account is not verified',
        })
      }
      if (!googleUser.email) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Google account does not have an email',
        })
      }
      const dbUser = await selectUserByEmail(googleUser.email)
      if (dbUser) {
        const user = auth.transformDatabaseUser(dbUser)
        await createKey(user.userId)
        return user
      }

      const user = await createUser({
        attributes: {
          username: googleUser.name,
          email: googleUser.email,
        },
      })
      return user
    }

    const user = await getUser()
    if (!user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Google account has no email or email is not verified',
      })
    }
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    })
    authRequest.setSession(session)
    return sendRedirect(event, '/user')
  }
  catch (e) {
    if (e instanceof OAuthRequestError) {
      // invalid code
      throw createError({
        statusCode: 400,
        statusMessage: e.message,
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Internal Server Error: ${e}`,
    })
  }
})
