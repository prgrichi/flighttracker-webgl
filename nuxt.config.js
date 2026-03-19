// nuxt.config.ts
export default defineNuxtConfig({
  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        lang: 'de',
      },
      title: 'Flighttracker',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'Finde deinen Traumjob auf unserem Jobportal!' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  ssr: true,
  routeRules: {
    '/jobs/**': { ssr: false },
  },

  modules: ['@pinia/nuxt', '@nuxt/ui'],

  css: ['~/assets/css/main.css'],
});
