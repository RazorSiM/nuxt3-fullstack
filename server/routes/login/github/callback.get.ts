import { OAuth2RequestError } from 'arctic'
import { createOauthAccount } from '~~/server/utils/database/handlers'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'github_oauth_state') ?? null

  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    })
  }

  try {
    const tokens = await githubAuthProvider.validateAuthorizationCode(code)
    // get the github user
    const githubUser: GitHubUser = await $fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })

    interface Email {
      email: string
      verified: boolean
      primary: boolean
      visibility: string
    }
    // get user emails
    const emails: Email[] = await $fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })

    const primaryEmail = emails.find(email => email.primary) ?? null
    if (!primaryEmail) {
      throw createError({
        status: 400,
        message: 'No primary email address found.',
      })
    }
    if (!primaryEmail.verified) {
      throw createError({
        status: 400,
        message: 'Primary email address is not verified.',
      })
    }
    // check if user exists in the database
    const existingUser = await selectUserByEmail(primaryEmail.email)

    if (existingUser) {
      // check if the user has an existing oauth account
      const existingOauthAccount = await getExistingOauthAccount('github', existingUser.id)
      if (!existingOauthAccount) {
        // if the user already exists, create an oauth account with the user id and github provider info
        await createOauthAccount('github', githubUser.id, existingUser.id)
      }
      // create a session for the user
      const session = await lucia.createSession(existingUser.id, {})
      // create the session cookie
      const sessionCookie = lucia.createSessionCookie(session.id)
      // set the session cookie
      setCookie(event, sessionCookie.name, sessionCookie.value)
      return sendRedirect(event, '/user')
    }
    else {
      const user = await createUser(githubUser.login, primaryEmail.email)
      await createOauthAccount('github', githubUser.id, user.id)
      const session = await lucia.createSession(user.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      setCookie(event, sessionCookie.name, sessionCookie.value)
      return sendRedirect(event, '/user')
    }
  }
  catch (e) {
    if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
      // invalid code
      throw createError({
        status: 400,
      })
    }
    if (e instanceof Error) {
      throw createError({
        status: 500,
        message: e.message,
      })
    }
  }
})

interface GitHubUser {
  id: string
  login: string
}
