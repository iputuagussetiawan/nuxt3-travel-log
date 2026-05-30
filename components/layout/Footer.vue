<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const links = [
    {
        heading: 'Product',
        items: [
            { label: 'My Travels', to: '/dashboard/locations' },
            { label: 'Map View', to: '/dashboard/locations' }
        ]
    },
    {
        heading: 'Account',
        items: [
            { label: 'Profile', to: '/dashboard/profile' },
            { label: 'Sign Out', to: '/sign-out' }
        ]
    }
]

const socials = [
    { icon: 'mdi:github', href: 'https://github.com', label: 'GitHub' },
    { icon: 'mdi:twitter', href: 'https://twitter.com', label: 'Twitter' }
]

const year = new Date().getFullYear()
</script>
<template>
    <footer
        class="relative z-10 border-t border-white/10 bg-black/50 backdrop-blur-sm"
    >
        <div class="container mx-auto max-w-5xl px-4 py-12">
            <div class="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                <!-- Brand -->
                <div class="lg:col-span-2">
                    <a href="/" class="inline-flex items-center gap-2">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256"
                            class="h-6 w-6 text-emerald-400"
                        >
                            <rect width="256" height="256" fill="none" />
                            <line
                                x1="208"
                                y1="128"
                                x2="128"
                                y2="208"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="32"
                            />
                            <line
                                x1="192"
                                y1="40"
                                x2="40"
                                y2="192"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="32"
                            />
                        </svg>
                        <span class="text-base font-bold text-white"
                            >Travel Log</span
                        >
                    </a>
                    <p
                        class="mt-3 max-w-xs text-sm leading-relaxed text-white/50"
                    >
                        Pin your memories on the map, log your adventures, and
                        relive every journey.
                    </p>
                    <div class="mt-5 flex gap-3">
                        <a
                            v-for="social in socials"
                            :key="social.label"
                            :href="social.href"
                            :aria-label="social.label"
                            target="_blank"
                            rel="noopener noreferrer"
                            class="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-white/50 transition-colors hover:border-white/20 hover:text-white"
                        >
                            <Icon :icon="social.icon" class="h-4 w-4" />
                        </a>
                    </div>
                </div>

                <!-- Link columns -->
                <div v-for="col in links" :key="col.heading">
                    <p
                        class="mb-4 text-xs font-semibold tracking-widest text-white/40 uppercase"
                    >
                        {{ col.heading }}
                    </p>
                    <ul class="space-y-2.5">
                        <li v-for="item in col.items" :key="item.label">
                            <NuxtLink
                                :to="item.to"
                                class="text-sm text-white/60 transition-colors hover:text-white"
                            >
                                {{ item.label }}
                            </NuxtLink>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Bottom bar -->
            <div
                class="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-8 sm:flex-row"
            >
                <p class="text-xs text-white/30">
                    &copy; {{ year }} Travel Log. All rights reserved.
                </p>
                <p class="flex items-center gap-1 text-xs text-white/30">
                    Made with
                    <Icon icon="lucide:heart" class="h-3 w-3 text-rose-400" />
                    for adventurers
                </p>
            </div>
        </div>
    </footer>
</template>
<style lang="scss" scoped></style>
