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
import UiUserAvatar from './ui/UserAvatar.vue'

const { isMobile } = useSidebar()
const authStore = useAuthStore()
</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <SidebarMenuButton
                        size="lg"
                        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        :aria-label="`User menu for ${authStore.user?.name ?? 'user'}`"
                        aria-haspopup="menu"
                    >
                        <UiUserAvatar />
                        <ChevronsUpDown
                            class="ml-auto size-4"
                            aria-hidden="true"
                        />
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
