export default defineNuxtConfig({
  devtools: { enabled: false },

  runtimeConfig: {
    openskyClientId: process.env.OPENSKY_CLIENT_ID,
    openskyClientSecret: process.env.OPENSKY_CLIENT_SECRET,

    public: {
      maptilerKey: process.env.NUXT_PUBLIC_MAPTILER_KEY || '',
      stadiaKey: process.env.NUXT_PUBLIC_STADIA_KEY || '',
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
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon/favicon.ico?v=2' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon/favicon-32x32.png?v=2' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon/favicon-16x16.png?v=2' },
        { rel: 'apple-touch-icon', href: '/favicon/apple-touch-icon.png?v=2' },
        { rel: 'manifest', href: '/favicon/site.webmanifest?v=2' },
      ],
    },
  },

  ssr: true,

  modules: ['@pinia/nuxt', '@nuxt/ui'],

  css: ['~/assets/css/main.css', 'maplibre-gl/dist/maplibre-gl.css'],
});
