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
  modules: ['@pinia/nuxt', '@nuxt/ui'],
  ui: {
    icons: 'all',
  },
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
    googleClientId: '',
    googleClientSecret: '',
  },
})
