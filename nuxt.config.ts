// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: [
    '@nuxt/eslint',
    '@nuxt/image',
    'shadcn-nuxt',
    '@nuxtjs/color-mode',
    '@pinia/nuxt',
    'nuxt-lucide-icons',
    'nuxt-csurf',
    '@nuxt/icon',
    '@nuxtjs/leaflet',
  ],
  csurf: {
        // optional
        https: false, // default true if in production
        cookieKey: '', // "__Host-csrf" if https is true otherwise just "csrf"
        cookie: {
            // CookieSerializeOptions from unjs/cookie-es
            path: '/',
            httpOnly: true,
            sameSite: 'strict'
        },
        methodsToProtect: ['POST', 'PUT', 'PATCH'], // the request methods we want CSRF protection for
        encryptSecret: '',
        addCsrfTokenToEventCtx: true, // default false, to run useCsrfFetch on server set it to true
        headerName: 'csrf-token' // the header where the csrf token is stored
    },
  icon: {
    serverBundle: {
      collections: ['uil', 'mdi'] // <!--- this
    }
  },
  colorMode: {
    classSuffix: ''
  },
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },
  css: ['~/assets/css/tailwind.css'],
  

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
})