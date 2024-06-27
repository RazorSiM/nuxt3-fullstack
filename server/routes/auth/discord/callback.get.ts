import { OAuth2RequestError } from 'arctic'

export default defineEventHandler(async (event) => {
  console.log('auth/discord/callback >>>>>>>>>>>>>>>>>>')
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'discord_oauth_state') ?? null

  console.log({
    code,
    state,
    storedState,
  })
  if (!code || !state || !storedState || state !== storedState) {
    throw createError({
      status: 400,
      message: 'Invalid state or code.',
    })
  }

  try {
    const tokens = await discordAuthProvider.validateAuthorizationCode(code)
    console.log('tokens >>>>>>>>>>>>>>>>>>', tokens)
    // get the discord user
    const discordUser = await $fetch<DiscordUser>('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    console.log('discordUser >>>>>>>>>>>>>>>>>>', discordUser)
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
    console.log(' after authenticateOauthUser >>>>>>>>>>>>>>>>>>')

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
