<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
const authStore = useAuthStore()
</script>

<template>
    <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
        <Avatar class="h-7 w-7">
            <AvatarImage
                v-if="authStore?.user?.image"
                :src="authStore.user.image || 'https://github.com/unovue.png'"
                :alt="authStore.user.name || 'User avatar'"
            />
            <AvatarFallback>
                {{ authStore?.user?.name?.charAt(0)?.toUpperCase() || 'U' }}
            </AvatarFallback>
        </Avatar>
        <div class="grid flex-1 text-left text-sm leading-tight">
            <span class="truncate font-semibold">
                {{ authStore?.user?.name }}
            </span>
            <span class="truncate text-xs">{{ authStore?.user?.email }}</span>
        </div>
    </div>
</template>