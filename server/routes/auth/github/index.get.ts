import { generateState } from 'arctic'

export default defineEventHandler(async (event) => {
  const lucia = initializeLucia(hubDatabase())

  // check if the user is already logged in
  const sessionId = getCookie(event, lucia.sessionCookieName) ?? null
  if (sessionId) {
    // if there's a session id, validate it
    const { session } = await lucia.validateSession(sessionId)
    if (session)
      return sendRedirect(event, '/user')
  }

  const state = generateState()
  const url = await githubAuthProvider.createAuthorizationURL(state, {
    scopes: ['user:email'],
  })

  console.log('url >>>>>>>', url.toString())

  setCookie(event, 'github_oauth_state', state, {
    path: '/',
    secure: !import.meta.dev,
    httpOnly: true,
    maxAge: 60 * 10,
    sameSite: 'lax',
  })
  return sendRedirect(event, url.toString())
})
