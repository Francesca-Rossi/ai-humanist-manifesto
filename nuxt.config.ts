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

  app: {
    head: {
      title: 'AI Humanist Manifesto — 97 Tesi',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: "97 tesi per un'intelligenza artificiale al servizio dell'uomo." },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;0,900;1,400;1,700&family=DM+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap'
        },
      ],
    },
  },
})
