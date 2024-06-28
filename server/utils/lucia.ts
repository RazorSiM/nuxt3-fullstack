import { Lucia } from 'lucia'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'
import { Discord, GitHub } from 'arctic'

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: 'user',
    session: 'session',
  })
  return new Lucia(adapter, {
    sessionCookie: {
      name: process.env.NUXT_SESSION_COOKIE_NAME,
      attributes: {
        secure: !import.meta.dev,
      },
    },
    getUserAttributes: (attributes) => {
      return {
        username: attributes.username,
        email: attributes.email,
      }
    },
  })
}

export interface DatabaseUserAttributes {
  username: string
  email: string
}
declare module 'lucia' {
  interface Register {
    Lucia: ReturnType<typeof initializeLucia>
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

const githubRedirectUri = `${process.env.NUXT_ORIGIN}/auth/github/callback`
const githubClientId = process.env.NUXT_GITHUB_CLIENT_ID ?? ''
const githubClientSecret = process.env.NUXT_GITHUB_CLIENT_SECRET ?? ''
export const githubAuthProvider = new GitHub(githubClientId, githubClientSecret, {
  redirectURI: githubRedirectUri,
})

const discordRedirectUri = `${process.env.NUXT_ORIGIN}/auth/discord/callback`
const discordClientId = process.env.NUXT_DISCORD_CLIENT_ID ?? ''
const discordClientSecret = process.env.NUXT_DISCORD_CLIENT_SECRET ?? ''
export const discordAuthProvider = new Discord(discordClientId, discordClientSecret, discordRedirectUri)
