export default defineNuxtConfig({
  devtools: { enabled: false },

  runtimeConfig: {
    openskyClientId: process.env.OPENSKY_CLIENT_ID,
    openskyClientSecret: process.env.OPENSKY_CLIENT_SECRET,

    public: {
      maptilerKey: process.env.NUXT_PUBLIC_MAPTILER_KEY || '',
    },
  },

  app: {
    head: {
      htmlAttrs: {
        lang: 'de',
      },
      title: 'Flighttracker',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        {
          name: 'description',
          content: 'Visualisierung von Flugdaten mit Nuxt, Vue, MapLibre und WebGL.',
        },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },

  ssr: true,

  modules: ['@pinia/nuxt', '@nuxt/ui'],

  css: ['~/assets/css/main.css', 'maplibre-gl/dist/maplibre-gl.css'],
});
