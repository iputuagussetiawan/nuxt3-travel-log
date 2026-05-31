<script lang="ts" setup>
import UiThemeToggle from '~/components/ThemeToggle.vue'
import { Icon } from '@iconify/vue'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '~/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

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

            <!-- Nav links -->
            <nav class="hidden items-center gap-1 md:flex">
                <NuxtLink
                    to="/about"
                    class="rounded-md px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    active-class="bg-white/10 text-white"
                >
                    About
                </NuxtLink>
                <NuxtLink
                    v-if="authStore.user"
                    to="/dashboard/locations"
                    class="rounded-md px-3 py-1.5 text-xs font-medium text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                    active-class="bg-white/10 text-white"
                >
                    My Travels
                </NuxtLink>
            </nav>

            <!-- Right side -->
            <div class="ml-auto flex items-center gap-2">
                <!-- Loading -->
                <div
                    v-if="authStore.loading"
                    class="h-7 w-20 animate-pulse rounded-lg bg-white/10"
                />

                <!-- Logged out -->
                <template v-else-if="!authStore.user">
                    <NuxtLink
                        to="/sign-in"
                        class="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:border-white/35 hover:bg-white/20"
                    >
                        Sign In
                    </NuxtLink>
                    <NuxtLink
                        to="/sign-up"
                        class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-medium text-white transition-all hover:bg-emerald-400"
                    >
                        Get Started
                    </NuxtLink>
                </template>

                <!-- Logged in: avatar dropdown -->
                <DropdownMenu v-else>
                    <DropdownMenuTrigger
                        class="flex items-center gap-1.5 rounded-lg px-1.5 py-1 transition-colors hover:bg-white/10 focus:outline-none"
                    >
                        <Avatar class="h-7 w-7">
                            <AvatarImage
                                v-if="authStore.user.image"
                                :src="authStore.user.image"
                                :alt="authStore.user.name"
                            />
                            <AvatarFallback class="text-xs font-semibold">
                                {{ authStore.user.name?.slice(0, 2).toUpperCase() }}
                            </AvatarFallback>
                        </Avatar>
                        <span class="hidden text-xs font-medium text-white sm:block">{{
                            authStore.user.name
                        }}</span>
                        <Icon icon="lucide:chevron-down" class="h-3.5 w-3.5 text-white/60" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" class="min-w-[160px]">
                        <DropdownMenuItem as-child>
                            <NuxtLink to="/dashboard" class="flex items-center gap-2">
                                <Icon icon="lucide:layout-dashboard" class="h-4 w-4" />
                                Dashboard
                            </NuxtLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem as-child>
                            <NuxtLink to="/dashboard/locations" class="flex items-center gap-2">
                                <Icon icon="lucide:map" class="h-4 w-4" />
                                My Travels
                            </NuxtLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem as-child>
                            <NuxtLink to="/dashboard/profile" class="flex items-center gap-2">
                                <Icon icon="lucide:user" class="h-4 w-4" />
                                Profile
                            </NuxtLink>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem as-child>
                            <NuxtLink
                                to="/sign-out"
                                class="text-destructive flex items-center gap-2"
                            >
                                <Icon icon="lucide:log-out" class="h-4 w-4" />
                                Sign out
                            </NuxtLink>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div class="h-4 w-px bg-white/15" />
                <UiThemeToggle />
            </div>
        </div>
    </header>
</template>
<style lang="scss" scoped></style>
