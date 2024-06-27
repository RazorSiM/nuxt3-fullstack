import { OAuth2RequestError } from 'arctic'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const code = query.code?.toString() ?? null
  const state = query.state?.toString() ?? null
  const storedState = getCookie(event, 'github_oauth_state') ?? null

  console.log('github code and state >>>>>>>>>>', {
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
    const tokens = await githubAuthProvider.validateAuthorizationCode(code)
    console.log('github tokens >>>>>>>>>>>>>>>>>>', tokens)
    // get the github user
    const githubUser = await $fetch<GitHubUser>('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    })
    console.log('githubUser >>>>>>>>>>>>>>>>>>', githubUser)
    interface Email {
      email: string
      verified: boolean
      primary: boolean
      visibility: string
    }
    // get user emails
    const emails = await $fetch<Email[]>('https://api.github.com/user/emails', {
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
    await authenticateOauthUser({
      providerName: 'github',
      providerUserEmail: primaryEmail.email,
      providerUsername: githubUser.login,
      providerUserId: githubUser.id,
    }, event)

    return sendRedirect(event, '/user')
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
