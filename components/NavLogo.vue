<script setup lang="ts">
import type { Component } from 'vue'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'
import { DropdownMenu, DropdownMenuTrigger } from './ui/dropdown-menu'

const props = defineProps<{
    teams: {
        name: string
        logo: Component
        plan: string
    }
}>()
</script>

<template>
    <SidebarMenu>
        <SidebarMenuItem>
            <DropdownMenu>
                <DropdownMenuTrigger as-child>
                    <SidebarMenuButton
                        size="lg"
                        class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                    >
                        <div
                            class="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground"
                        >
                            <component :is="props.teams.logo" class="size-4" />
                        </div>
                        <div
                            class="grid flex-1 text-left text-sm leading-tight"
                        >
                            <span class="truncate font-semibold">
                                {{ props.teams.name }}
                            </span>
                            <span class="truncate text-xs">{{
                                props.teams.plan
                            }}</span>
                        </div>
                    </SidebarMenuButton>
                </DropdownMenuTrigger>
            </DropdownMenu>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
