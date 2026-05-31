<script setup lang="ts">
import type { Component } from 'vue'
import { SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar'

defineProps<{
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
            <SidebarMenuButton size="lg" as-child class="hover:bg-sidebar-accent">
                <NuxtLink to="/dashboard/locations" aria-label="Go to dashboard">
                    <div
                        class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
                        aria-hidden="true"
                    >
                        <component :is="teams.logo" class="size-4" />
                    </div>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                        <span class="truncate font-semibold">{{ teams.name }}</span>
                        <span class="text-sidebar-foreground/60 truncate text-xs">{{
                            teams.plan
                        }}</span>
                    </div>
                </NuxtLink>
            </SidebarMenuButton>
        </SidebarMenuItem>
    </SidebarMenu>
</template>
