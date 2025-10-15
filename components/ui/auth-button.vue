<script lang="ts" setup>
import UiUserAvatar from './UserAvatar.vue'
import Button from './button/Button.vue'
import DropdownMenu from './dropdown-menu/DropdownMenu.vue'
import DropdownMenuContent from './dropdown-menu/DropdownMenuContent.vue'
import DropdownMenuItem from './dropdown-menu/DropdownMenuItem.vue'
import DropdownMenuTrigger from './dropdown-menu/DropdownMenuTrigger.vue'
import { Icon } from '@iconify/vue'
const authStore = useAuthStore()
</script>
<template>
    <div>
        <DropdownMenu v-if="!authStore.loading && authStore.user">
            <DropdownMenuTrigger>
                <UiUserAvatar />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <NuxtLink to="/sign-out">
                        <Icon icon="lucide:log-out" width="24" height="24" />
                        Sign out
                    </NuxtLink>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
        <Button v-else :disabled="authStore.loading" @click="authStore.signIn">
            Continue with GitHub 
            <Icon v-if="authStore.loading" icon="line-md:loading-twotone-loop"
            class="w-8 h-8 animate-spin"
            />
            <Icon v-else icon="mdi:github" width="24" height="24" />
        </Button>
    </div>
</template>
<style lang="scss" scoped></style>
