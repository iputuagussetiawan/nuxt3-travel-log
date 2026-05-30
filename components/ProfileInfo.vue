<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const authStore = useAuthStore()
</script>
<template>
    <Card class="w-full max-w-sm shrink-0 rounded-2xl shadow-sm">
        <CardHeader class="flex flex-col items-center gap-3 pb-4 text-center">
            <Avatar class="h-20 w-20">
                <AvatarImage
                    v-if="authStore.user?.image"
                    :src="authStore.user.image"
                    :alt="authStore.user.name"
                />
                <AvatarFallback class="text-2xl font-semibold">
                    {{ authStore.user?.name?.slice(0, 2).toUpperCase() }}
                </AvatarFallback>
            </Avatar>
            <div>
                <CardTitle class="text-lg font-semibold">
                    {{ authStore.user?.name }}
                </CardTitle>
                <p class="text-muted-foreground mt-0.5 text-sm">
                    {{ authStore.user?.email }}
                </p>
            </div>
        </CardHeader>
        <CardContent class="space-y-2 border-t pt-4">
            <div class="flex items-center gap-2 text-sm">
                <Icon
                    icon="lucide:mail"
                    class="text-muted-foreground h-4 w-4 shrink-0"
                />
                <span class="text-muted-foreground truncate">{{
                    authStore.user?.email
                }}</span>
            </div>
            <div class="flex items-center gap-2 text-sm">
                <Icon
                    icon="lucide:shield-check"
                    class="text-muted-foreground h-4 w-4 shrink-0"
                />
                <span class="text-muted-foreground">
                    {{
                        authStore.user?.emailVerified
                            ? 'Email verified'
                            : 'Email not verified'
                    }}
                </span>
            </div>
        </CardContent>
    </Card>
</template>
<style lang="scss" scoped></style>
