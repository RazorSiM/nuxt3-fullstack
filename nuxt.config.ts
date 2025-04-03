// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@pinia/nuxt',
    '@nuxt/eslint',
    '@nuxt/ui',
    '@nuxtjs/color-mode',
    '@nuxt/icon',
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
  css: ['~/assets/css/main.css'],
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
  nitro: {
    experimental: {
      tasks: true,
    },
    scheduledTasks: {
      // Run the `sessions:clean` task every day at 3 AM
      '0 3 * * *': 'sessions:clean',
    },
  },
  hub: {
    database: true,
    databaseMigrationsDirs: [
      './drizzle',
    ],
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
})
