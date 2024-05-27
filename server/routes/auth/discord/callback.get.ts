import { OAuth2RequestError } from 'arctic'

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
    const discordUser = await $fetch<DiscordUser>('https://discord.com/api/v10/users/@me', {
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

    await authenticateOauthUser({
      providerName: 'discord',
      providerUserEmail: discordUser.email,
      providerUsername: discordUser.username,
      providerUserId: discordUser.id,
    }, event)

    return sendRedirect(event, '/user')
  }
  catch (e) {
    if (e instanceof OAuth2RequestError && e.message === 'bad_verification_code') {
      // invalid code
      throw createError({
        status: 400,
        message: e.message,
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
