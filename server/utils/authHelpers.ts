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
  return sessionCookie
}

export async function authenticateOauthUser(options: AuthenticateOauthUserOptions, event: H3Event) {
  // check if user exists in the database
  const existingUser = await selectUserByEmail(options.providerUserEmail)
  if (existingUser) {
    // check if the user has an existing oauth account
    const existingOauthAccount = await getExistingOauthAccount(options.providerName, existingUser.id)
    if (!existingOauthAccount) {
      // if the user already exists, create an oauth account with the user id and github provider info
      await createOauthAccount(options.providerName, options.providerUserId, existingUser.id)
    }
    // create a session cookie for the user
    const sessionCookie = await createSessionCookie(existingUser.id)
    // set the session cookie
    setCookie(event, sessionCookie.name, sessionCookie.value)
  }
  else {
    const user = await createUser(options.providerUsername, options.providerUserEmail)
    await createOauthAccount(options.providerName, options.providerUserId, user.id)
    const sessionCookie = await createSessionCookie(user.id)
    setCookie(event, sessionCookie.name, sessionCookie.value)
  }
}
