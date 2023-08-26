import { OAuthRequestError } from '@lucia-auth/oauth'

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()
  if (session)
    return sendRedirect(event, '/')

  const storedState = getCookie(event, 'github_oauth_state')
  const query = getQuery(event)
  const state = query.state?.toString()
  const code = query.code?.toString()
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid state',
    })
  }
  try {
    const { getExistingUser, githubUser, createUser, createKey } = await githubAuth.validateCallback(code)
    const existingUser = await getExistingUser()

    async function getUser() {
      if (existingUser)
        return existingUser
      if (!githubUser.email) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Github account is not verified',
        })
      }
      const dbUser = await selectUserByEmail(githubUser.email)
      if (dbUser) {
        const user = auth.transformDatabaseUser(dbUser)
        await createKey(user.userId)
        return user
      }

      const user = await createUser({
        attributes: {
          username: githubUser.login,
          email: githubUser.email,
        },
      })
      return user
    }

    const user = await getUser()
    if (!user) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Github account has no email or email is not verified',
      })
    }
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    })
    authRequest.setSession(session)
    return sendRedirect(event, '/')
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
      statusMessage: `Error: ${e}`,
    })
  }
})
