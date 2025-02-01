export default defineOAuthGitHubEventHandler({
  config: {
    emailRequired: true,
  },
  async onSuccess(event, { user }) {
    await authenticateOauthUser({
      providerName: 'github',
      providerUserEmail: user.email,
      providerUsername: user.login,
      providerUserId: user.id.toString(),
    }, event)
    return sendRedirect(event, '/user')
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error('GitHub OAuth error:', error)
    return sendRedirect(event, '/')
  },
})
