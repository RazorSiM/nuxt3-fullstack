// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  typescript: {
    shim: false,
  },
  modules: ['@pinia/nuxt', '@unocss/nuxt', '@sidebase/nuxt-auth'],
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  runtimeConfig: {
    public: {},
    postgresPassword: '',
    postgresUser: '',
    postgresDatabase: '',
    postgresHost: '',
    postgresPort: '',
    authSecret: '',
    discordClientId: '',
    discordClientSecret: '',
    githubClientId: '',
    githubClientSecret: '',

  },
  auth: {
    baseURL: 'http://localhost:3000',
    provider: {
      type: 'authjs',
    },
    globalAppMiddleware: true,
  },
})
