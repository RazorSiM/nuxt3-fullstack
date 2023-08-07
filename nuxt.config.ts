// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  typescript: {
    shim: false,
  },
  modules: ['@pinia/nuxt', '@unocss/nuxt'],
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  runtimeConfig: {
    public: {},
    app: {
      postgresPassword: '',
      postgresUser: '',
      postgresDatabase: '',
      postgresHost: '',
      postgresPort: '',
    },
  },
})
