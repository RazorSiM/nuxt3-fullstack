import 'dotenv/config'
import { lucia } from 'lucia'
import { h3 } from 'lucia/middleware'
import { postgres } from '@lucia-auth/adapter-postgresql'
import { github } from '@lucia-auth/oauth/providers'
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
      githubUsername: data.github_username,
    }
  },
})

export const githubAuth = github(auth, {
  clientId: config.githubClientId,
  clientSecret: config.githubClientSecret,
})

export type Auth = typeof auth
