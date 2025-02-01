// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
    'shadcn-nuxt',
    '@vueuse/nuxt',
    '@nuxthub/core',
    'nuxt-auth-utils',
    'unplugin-turbo-console/nuxt',
  ],
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  colorMode: {
    classSuffix: '',
  },
  runtimeConfig: {
    discordClientId: '',
    discordClientSecret: '',
    githubClientId: '',
    githubClientSecret: '',
    origin: '',
  },

  compatibilityDate: '2024-08-19',
  hub: {
    database: true,
  },
  typescript: {
    shim: false,
  },
  telemetry: false,
  eslint: {
    config: {
      stylistic: {
        indent: 2,
        semi: false,
        quotes: 'single',
      },
    },
  },
  icon: {
    serverBundle: 'remote',
  },
  shadcn: {
    prefix: 'Ui',
    componentDir: './components/ui',
  },
})
