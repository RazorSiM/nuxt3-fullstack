import 'dotenv/config'
import process from 'node:process'
import { lucia } from 'lucia'
import { h3 } from 'lucia/middleware'
import { postgres } from '@lucia-auth/adapter-postgresql'
import { discord, github, google } from '@lucia-auth/oauth/providers'
import { sql } from './database'

const config = process.env
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
  env: config.NODE_ENV === 'production' ? 'PROD' : 'DEV',
  getUserAttributes: (data) => {
    return {
      username: data.username,
      email: data.email,
    }
  },
})

export const githubAuth = github(auth, {
  clientId: config.NUXT_GITHUB_CLIENT_ID ?? '',
  clientSecret: config.NUXT_GITHUB_CLIENT_SECRET ?? '',
})
export const discordAuth = discord(auth, {
  clientId: config.NUXT_DISCORD_CLIENT_ID ?? '',
  clientSecret: config.NUXT_DISCORD_CLIENT_SECRET ?? '',
  redirectUri: 'http://localhost:3000/api/login/discord/callback',
})
export const googleAuth = google(auth, {
  clientId: config.NUXT_GOOGLE_CLIENT_ID ?? '',
  clientSecret: config.NUXT_GOOGLE_CLIENT_SECRET ?? '',
  redirectUri: 'http://localhost:3000/api/login/google/callback',
  scope: ['email', 'profile', 'openid'],
})

export type Auth = typeof auth
