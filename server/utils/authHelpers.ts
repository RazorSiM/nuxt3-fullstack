import type { H3Event } from 'h3'
import { createOauthAccount, createUser, getExistingOauthAccount, selectUserByEmail, createSession } from './database/handlers'

interface AuthenticateOauthUserOptions {
  providerName: 'github' | 'discord'
  providerUserEmail: string
  providerUsername: string
  providerUserId: string
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
    // Create session token and store in database
    const sessionToken = crypto.randomUUID()
    await createSession(existingUser.id, sessionToken)

    // Set user session with token
    await setUserSession(event, {
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
      },
      sessionToken,
    })
  }
  else {
    const user = await createUser(options.providerUsername, options.providerUserEmail)
    await createOauthAccount(options.providerName, options.providerUserId, user.id)
    // Create session token and store in database
    const sessionToken = crypto.randomUUID()
    await createSession(user.id, sessionToken)

    // Set user session with token
    await setUserSession(event, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      sessionToken,
    })
  }
}
