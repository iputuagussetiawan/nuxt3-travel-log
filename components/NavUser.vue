<script setup lang="ts">
import { BadgeCheck, Bell, ChevronsUpDown, LogOut } from 'lucide-vue-next'
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from './ui/sidebar'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from './ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import UiUserAvatar from './ui/UserAvatar.vue'

const { isMobile, state } = useSidebar()
const authStore = useAuthStore()
const isCollapsed = computed(() => state.value === 'collapsed')
</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <SidebarMenuButton
                        size="lg"
                        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        :class="isCollapsed ? 'justify-center px-0' : ''"
                        :aria-label="`User menu for ${authStore.user?.name ?? 'user'}`"
                        aria-haspopup="menu"
                    >
                        <!-- Collapsed: bare avatar centered -->
                        <Avatar v-if="isCollapsed" class="h-7 w-7">
                            <AvatarImage
                                v-if="authStore.user?.image"
                                :src="authStore.user.image"
                                :alt="authStore.user?.name || 'User'"
                            />
                            <AvatarFallback class="text-xs font-semibold">
                                {{
                                    authStore.user?.name
                                        ?.slice(0, 2)
                                        .toUpperCase() || 'U'
                                }}
                            </AvatarFallback>
                        </Avatar>
                        <!-- Expanded: full avatar with name/email -->
                        <template v-else>
                            <UiUserAvatar />
                            <ChevronsUpDown
                                class="ml-auto size-4"
                                aria-hidden="true"
                            />
                        </template>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    class="z-[30001] w-[--reka-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                    :side="isMobile ? 'bottom' : 'right'"
                    align="end"
                    :side-offset="4"
                    role="menu"
                    :aria-label="`${authStore.user?.name ?? 'User'} account menu`"
                >
                    <DropdownMenuLabel class="p-0 font-normal">
                        <UiUserAvatar />
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator />

                    <DropdownMenuGroup>
                        <DropdownMenuItem as-child>
                            <NuxtLink
                                to="/dashboard/profile"
                                class="flex items-center gap-2"
                                role="menuitem"
                            >
                                <BadgeCheck
                                    class="h-4 w-4"
                                    aria-hidden="true"
                                />
                                <span>Profile</span>
                            </NuxtLink>
                        </DropdownMenuItem>
                        <DropdownMenuItem as-child>
                            <NuxtLink
                                to="/dashboard/notifications"
                                class="flex items-center gap-2"
                                role="menuitem"
                            >
                                <Bell class="h-4 w-4" aria-hidden="true" />
                                <span>Notifications</span>
                            </NuxtLink>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>

                    <DropdownMenuSeparator />

                    <DropdownMenuItem as-child>
                        <NuxtLink
                            to="/sign-out"
                            class="text-destructive focus:text-destructive flex items-center gap-2"
                            role="menuitem"
                        >
                            <LogOut class="h-4 w-4" aria-hidden="true" />
                            <span>Sign out</span>
                        </NuxtLink>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
