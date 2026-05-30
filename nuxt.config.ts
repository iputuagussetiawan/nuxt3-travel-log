// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from '@tailwindcss/vite'
export default defineNuxtConfig({
    compatibilityDate: '2025-07-15',
    experimental: {
        appManifest: true
    },
    runtimeConfig: {
        // Server-only (not exposed to client)
        databaseUrl: process.env.DATABASE_URL,
        betterAuthSecret: process.env.BETTER_AUTH_SECRET,
        githubClientId: process.env.GITHUB_CLIENT_ID,
        githubClientSecret: process.env.GITHUB_CLIENT_SECRET,
        googleClientId: process.env.GOOGLE_CLIENT_ID,
        googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
        smtpHost: process.env.SMTP_HOST,
        smtpPort: process.env.SMTP_PORT,
        smtpSecure: process.env.SMTP_SECURE,
        smtpUser: process.env.SMTP_USER,
        smtpPass: process.env.SMTP_PASS,
        smtpFrom: process.env.SMTP_FROM,
        // Public (exposed to client)
        public: {
            appUrl: process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
        }
    },
    app: {
        head: {
            titleTemplate: '%s · Travel Log',
            meta: [
                { charset: 'utf-8' },
                {
                    name: 'viewport',
                    content: 'width=device-width, initial-scale=1'
                },
                {
                    name: 'description',
                    content:
                        'Pin your memories on the map, log your adventures, and revisit every place that took your breath away.'
                },
                { property: 'og:site_name', content: 'Travel Log' },
                { property: 'og:type', content: 'website' },
                { name: 'twitter:card', content: 'summary_large_image' }
            ]
        }
    },
    devtools: { enabled: true },
    modules: [
        '@nuxt/eslint',
        '@nuxt/image',
        'shadcn-nuxt',
        '@nuxtjs/color-mode',
        '@pinia/nuxt',
        'nuxt-lucide-icons',
        'nuxt-csurf',
        '@nuxtjs/leaflet',
        'nuxt-icon',
        '@nuxtjs/google-fonts'
    ],
    googleFonts: {
        families: {
            Inter: [100, 200, 300, 400, 500, 600, 700, 800, 900]
        },
        display: 'swap',
        download: true, // optional: downloads font locally for better performance
        inject: true // automatically injects <link> in <head>
    },

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
        encryptSecret: process.env.BETTER_AUTH_SECRET ?? '',
        addCsrfTokenToEventCtx: true, // default false, to run useCsrfFetch on server set it to true
        headerName: 'csrf-token' // the header where the csrf token is stored
    },
    // icon: {
    //     serverBundle: {
    //         collections: ['uil', 'mdi'] // <!--- this
    //     }
    // },
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
        plugins: [tailwindcss()]
    }
})
