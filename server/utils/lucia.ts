import { Lucia } from 'lucia'
import { D1Adapter } from '@lucia-auth/adapter-sqlite'
import { Discord, GitHub } from 'arctic'

const config = useRuntimeConfig()

export function initializeLucia(D1: D1Database) {
  const adapter = new D1Adapter(D1, {
    user: 'user',
    session: 'session',
  })
  return new Lucia(adapter, {
    sessionCookie: {
      name: config.public.sessionCookieName,
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

const discordRedirectUri = `${config.origin}/auth/discord/callback`
console.log('discordRedirectUri >>>>>>>>>>>>>>>>>>', discordRedirectUri)

export const githubAuthProvider = new GitHub(config.githubClientId, config.githubClientSecret)
export const discordAuthProvider = new Discord(config.discordClientId, config.discordClientSecret, discordRedirectUri)
