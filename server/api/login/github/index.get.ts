export default defineEventHandler(async (event) => {
  const authRequest = auth.handleRequest(event)
  const session = await authRequest.validate()
  if (session)
    return sendRedirect(event, '/user')

  const [url, state] = await githubAuth.getAuthorizationUrl()
  setCookie(event, 'github_oauth_state', state, {
    httpOnly: true,
    secure: false,
    path: '/',
    maxAge: 60 * 60,
  })
  return sendRedirect(event, url.toString())
})
