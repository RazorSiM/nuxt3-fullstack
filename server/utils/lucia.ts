import { Lucia } from 'lucia'
import { DrizzlePostgreSQLAdapter } from '@lucia-auth/adapter-drizzle'
import { Discord, GitHub } from 'arctic'
import { db, schemas } from './database'

const adapter = new DrizzlePostgreSQLAdapter(db, schemas.sessionTable, schemas.userTable)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
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

declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia
    DatabaseUserAttributes: Omit<DatabaseUser, 'id'>
  }
}

const config = useRuntimeConfig()

export const githubAuthProvider = new GitHub(config.githubClientId, config.githubClientSecret)
export const discordAuthProvider = new Discord(config.discordClientId, config.discordClientSecret, config.discordRedirectUri)
