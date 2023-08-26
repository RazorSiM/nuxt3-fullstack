import { OAuthRequestError } from '@lucia-auth/oauth'

export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()
  if (session)
    return sendRedirect(event, '/')

  const storedState = getCookie(event, 'discord_oauth_state')
  const query = getQuery(event)
  const state = query.state?.toString()
  const code = query.code?.toString()
  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    })
  }
  try {
    const { existingUser, discordUser, createUser, createKey } = await discordAuth.validateCallback(code)

    async function getUser() {
      if (existingUser)
        return existingUser
      if (!discordUser.verified) {
        throw createError({
          statusCode: 400,
          message: 'Discord account is not verified',
        })
      }
      if (!discordUser.email) {
        throw createError({
          statusCode: 400,
          message: 'Discord account does not have an email',
        })
      }
      const dbUser = await selectUserByEmail(discordUser.email)
      if (dbUser) {
        const user = auth.transformDatabaseUser(dbUser)
        await createKey(user.userId)
        return user
      }

      const user = await createUser({
        attributes: {
          username: discordUser.username,
          email: discordUser.email,
        },
      })
      return user
    }

    const user = await getUser()
    if (!user) {
      throw createError({
        statusCode: 500,
        message: 'Discord account has no email or email is not verified',
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
        statusMessage: 'Bad Request',
      })
    }
    throw createError({
      statusCode: 500,
      statusMessage: `Internal Server Error: ${e}`,
    })
  }
})
