<script lang="ts" setup>
import UiUserAvatar from './UserAvatar.vue'
import DropdownMenu from './dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from './dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from './dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuSeparator from './dropdown-menu/DropdownMenuSeparator.vue'
import DropdownMenuTrigger from './dropdown-menu/DropdownMenuTrigger.vue'
import { Icon } from '@iconify/vue'

const authStore = useAuthStore()

const providers: { key: 'github' | 'google'; icon: string; label: string }[] = [
    { key: 'github', icon: 'mdi:github', label: 'GitHub' },
    { key: 'google', icon: 'mdi:google', label: 'Google' }
]
</script>
<template>
    <!-- Logged in: avatar dropdown -->
    <DropdownMenu v-if="!authStore.loading && authStore.user">
        <DropdownMenuTrigger
            class="flex items-center gap-1.5 rounded-lg px-2 py-1 transition-colors hover:cursor-pointer hover:bg-white/10"
        >
            <UiUserAvatar :show-info="false" />
            <Icon
                icon="lucide:chevron-down"
                class="h-3.5 w-3.5 text-white/60 transition-transform duration-200"
            />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="min-w-[160px]">
            <DropdownMenuItem>
                <NuxtLink
                    to="/dashboard/locations"
                    class="flex items-center gap-2"
                >
                    <Icon icon="lucide:map" class="h-4 w-4" />
                    My Travels
                </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuItem>
                <NuxtLink
                    to="/dashboard/profile"
                    class="flex items-center gap-2"
                >
                    <Icon icon="lucide:user" class="h-4 w-4" />
                    Profile
                </NuxtLink>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
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

    <!-- Loading skeleton -->
    <div v-else-if="authStore.loading" class="flex items-center gap-2">
        <div class="h-8 w-28 animate-pulse rounded-lg bg-white/10" />
        <div class="h-8 w-28 animate-pulse rounded-lg bg-white/10" />
    </div>

    <!-- Logged out: compact sign-in buttons -->
    <div v-else class="flex items-center gap-2">
        <button
            v-for="p in providers"
            :key="p.key"
            class="inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium text-white backdrop-blur-sm transition-all hover:border-white/35 hover:bg-white/20 active:scale-95"
            @click="authStore.signIn(p.key)"
        >
            <Icon :icon="p.icon" class="h-3.5 w-3.5" />
            {{ p.label }}
        </button>
    </div>
</template>
<style lang="scss" scoped></style>
