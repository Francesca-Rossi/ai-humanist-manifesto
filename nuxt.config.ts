// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxtjs/supabase',
  ],

  supabase: {
    redirectOptions: {
      login: '/auth/login',
      callback: '/auth/callback',
      exclude: ['/', '/auth/*'],
    },
  },

  runtimeConfig: {
    resendApiKey: '',
    resendFromEmail: '',
    adminEmail: '',
    webhookSecret: '',
    supabaseServiceRoleKey: '',
    public: {
      appUrl: 'http://localhost:3000',
    },
  },

  css: ['~/assets/css/main.css'],
})
