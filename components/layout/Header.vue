<script lang="ts" setup>
import UiThemeToggle from '~/components/ui/ThemeToggle.vue'
import UiAuthButton from '../ui/auth-button.vue'

const authStore = useAuthStore()
</script>
<template>
    <header
        class="fixed top-0 z-50 w-full border-b border-white/10 bg-black/30 backdrop-blur-md transition-colors"
    >
        <div class="container mx-auto flex h-14 max-w-5xl items-center px-4">
            <!-- Logo -->
            <NuxtLink to="/" class="mr-6 flex items-center gap-2">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 256 256"
                    class="h-5 w-5 text-emerald-400"
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
                <span class="text-sm font-bold text-white">Travel Log</span>
            </NuxtLink>

            <!-- Nav link (only when logged in) -->
            <nav
                v-if="authStore.user"
                class="hidden items-center gap-1 md:flex"
            >
                <NuxtLink
                    to="/dashboard/locations"
                    class="rounded-md px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    active-class="bg-white/10 text-white"
                >
                    My Travels
                </NuxtLink>
            </nav>

            <!-- Right side -->
            <div class="ml-auto flex items-center gap-2">
                <UiAuthButton />
                <div class="h-4 w-px bg-white/15" />
                <UiThemeToggle />
            </div>
        </div>
    </header>
</template>
<style lang="scss" scoped></style>
