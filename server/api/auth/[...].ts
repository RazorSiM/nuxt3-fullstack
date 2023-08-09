import DiscordProvider from 'next-auth/providers/discord'
import { NuxtAuthHandler } from '#auth'

const config = useRuntimeConfig()
export default NuxtAuthHandler({
  // A secret string you define, to ensure correct encryption
  secret: config.authSecret,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    DiscordProvider.default({
      clientId: config.discordClientId,
      clientSecret: config.discordClientSecret,
    }),
  ],
})
