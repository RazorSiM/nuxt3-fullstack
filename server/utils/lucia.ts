import 'dotenv/config'
import { lucia } from 'lucia'
import { h3 } from 'lucia/middleware'
import { postgres } from '@lucia-auth/adapter-postgresql'
import { discord, github, google } from '@lucia-auth/oauth/providers'
import { sql } from './database'

const config = useRuntimeConfig()
// expect error
export const auth = lucia({
  adapter: postgres(
    sql,
    {
      user: 'auth_user',
      session: 'auth_session',
      key: 'auth_key',
    },
  ),
  middleware: h3(),
  env: 'DEV',
  getUserAttributes: (data) => {
    return {
      username: data.username,
      email: data.email,
    }
  },
})

export const githubAuth = github(auth, {
  clientId: config.githubClientId,
  clientSecret: config.githubClientSecret,
})
export const discordAuth = discord(auth, {
  clientId: config.discordClientId,
  clientSecret: config.discordClientSecret,
  redirectUri: 'http://localhost:3000/api/login/discord/callback',
})
export const googleAuth = google(auth, {
  clientId: config.googleClientId,
  clientSecret: config.googleClientSecret,
  redirectUri: 'http://localhost:3000/api/login/google/callback',
  scope: ['email', 'profile', 'openid'],
})

export type Auth = typeof auth
