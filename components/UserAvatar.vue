<script setup lang="ts">
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

const authStore = useAuthStore()

withDefaults(defineProps<{ showInfo?: boolean }>(), { showInfo: true })
</script>

<template>
    <div
        :class="
            showInfo
                ? 'flex items-center gap-2 px-1 py-1.5 text-left text-sm'
                : 'flex items-center justify-center'
        "
    >
        <Avatar class="h-8 w-8 shrink-0">
            <AvatarImage
                v-if="authStore?.user?.image"
                :src="authStore.user.image"
                :alt="authStore.user.name || 'User avatar'"
            />
            <AvatarFallback
                class="flex items-center justify-center text-xs font-semibold"
            >
                {{ authStore?.user?.name?.slice(0, 2).toUpperCase() || 'U' }}
            </AvatarFallback>
        </Avatar>
        <template v-if="showInfo">
            <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{
                    authStore?.user?.name
                }}</span>
                <span class="truncate text-xs">{{
                    authStore?.user?.email
                }}</span>
            </div>
        </template>
    </div>
</template>
