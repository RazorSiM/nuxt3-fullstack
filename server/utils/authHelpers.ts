import type { H3Event } from 'h3'

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
    // create and set a session cookie for the user
    await setUserSession(event, {
      user: {
        id: existingUser.id,
        username: existingUser.username,
        email: existingUser.email,
      },
    })
  }
  else {
    const user = await createUser(options.providerUsername, options.providerUserEmail)
    await createOauthAccount(options.providerName, options.providerUserId, user.id)
    await setUserSession(event, {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    })
  }
}
