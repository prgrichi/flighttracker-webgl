export default defineNuxtConfig({
  devtools: { enabled: false },

  runtimeConfig: {
    openskyClientId: process.env.NUXT_OPENSKY_CLIENT_ID,
    openskyClientSecret: process.env.NUXT_OPENSKY_CLIENT_SECRET,

    public: {
      maptilerKey: process.env.NUXT_PUBLIC_MAPTILER_KEY || '',
      stadiaKey: process.env.NUXT_PUBLIC_STADIA_KEY || '',
    },
  },

  pwa: {
    registerType: 'autoUpdate',

    manifest: {
      name: 'Flighttracker',
      short_name: 'Flights',
      description: 'Live Flugtracking',
      theme_color: '#0f172a',
      background_color: '#0f172a',
      display: 'standalone',

      icons: [
        {
          src: '/pwa/icon-192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/pwa/icon-512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
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

        {
          rel: 'preload',
          href: '/fonts/open-sans/open-sans-v44-latin-300.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
        {
          rel: 'preload',
          href: '/fonts/open-sans/open-sans-v44-latin-600.woff2',
          as: 'font',
          type: 'font/woff2',
          crossorigin: '',
        },
      ],
    },
  },

  ssr: true,

  modules: ['@pinia/nuxt', '@nuxt/ui', '@vite-pwa/nuxt'],

  css: ['~/assets/css/main.css', 'maplibre-gl/dist/maplibre-gl.css'],
});
