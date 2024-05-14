// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  telemetry: false,
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  typescript: {
    shim: false,
  },
  modules: ['@pinia/nuxt', '@nuxt/ui', '@nuxt/eslint'],
  ui: {
    icons: 'all',
  },
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: false,
        quotes: 'single',
      },
    },
  },
  runtimeConfig: {
    public: {
      sessionCookieName: '',
    },
    postgresPassword: '',
    postgresUser: '',
    postgresDatabase: '',
    postgresHost: '',
    postgresPort: '',
    discordClientId: '',
    discordClientSecret: '',
    githubClientId: '',
    githubClientSecret: '',
    origin: '',
  },
})
