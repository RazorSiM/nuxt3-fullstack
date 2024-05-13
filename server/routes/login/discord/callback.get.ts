import { OAuth2RequestError } from 'arctic'
import { createOauthAccount } from '~~/server/utils/database/handlers'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'discord_oauth_state') ?? null
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
    })
  }

  try {
    const tokens = await discordAuthProvider.validateAuthorizationCode(code)
    // get the discord user
    const discordUser: DiscordUser = await $fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })

    if (!discordUser.verified) {
      throw createError({
        status: 400,
        message: 'Primary email address is not verified.',
      })
    }
    // check if user exists in the database
    const existingUser = await selectUserByEmail(discordUser.email)

    if (existingUser) {
      // if the user already exists, create an oauth account with the user id and discord provider info
      await createOauthAccount('discord', discordUser.id, existingUser.id)
      // create a session for the user
      const session = await lucia.createSession(existingUser.id, {})
      // create the session cookie
      const sessionCookie = lucia.createSessionCookie(session.id)
      // set the session cookie
      setCookie(event, sessionCookie.name, sessionCookie.value)
      return sendRedirect(event, '/user')
    }
    else {
      const user = await createUser(discordUser.username, discordUser.email)
      await createOauthAccount('discord', discordUser.id, user.id)
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
    throw createError({
      status: 500,
    })
  }
})

interface DiscordUser {
  id: string
  username: string
  discriminator: string
  avatar: string
  verified: boolean
  email: string
  flags: number
  banner: string
  accent_color: number
  premium_type: number
  public_flags: number
}
