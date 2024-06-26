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
  modules: ['@pinia/nuxt', '@nuxt/eslint', '@nuxtjs/tailwindcss', '@nuxtjs/color-mode', 'nuxt-icon', 'shadcn-nuxt', '@vueuse/nuxt'],
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: false,
        quotes: 'single',
      },
    },
  },
  routeRules: {
    '/': {
      prerender: true,
    },
  },
  shadcn: {
    prefix: 'Ui',
    componentDir: './components/ui',
  },
  colorMode: {
    classSuffix: '',
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
