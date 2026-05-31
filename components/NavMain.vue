<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { ChevronRight } from 'lucide-vue-next'
import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    useSidebar
} from './ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Icon } from '@iconify/vue'

const route = useRoute()
const sidebarStore = useSidebarStore()
const { sidebarTopItems } = storeToRefs(sidebarStore)
const { state } = useSidebar()

const isCollapsed = computed(() => state.value === 'collapsed')

function isActive(to: string | object | undefined) {
    if (!to) return false
    const path = typeof to === 'string' ? to : ((to as any).path ?? '')
    if (path === '/dashboard') return route.path === path
    return route.path === path || route.path.startsWith(path + '/')
}

function isParentActive(items: { to?: any }[] | undefined) {
    return items?.some((sub) => isActive(sub.to)) ?? false
}
</script>

<template>
    <SidebarGroup v-if="sidebarTopItems.length">
        <SidebarGroupLabel v-if="!isCollapsed" class="sr-only">Navigation</SidebarGroupLabel>
        <SidebarMenu>
            <SidebarMenuItem v-for="item in sidebarTopItems" :key="item.title">
                <!-- ── Collapsed: icon + popover ── -->
                <Popover v-if="isCollapsed">
                    <PopoverTrigger>
                        <button
                            :aria-label="item.title"
                            :class="[
                                'flex h-8 w-8 items-center justify-center rounded-md transition-colors',
                                isParentActive(item.items)
                                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                                    : 'hover:bg-sidebar-accent text-sidebar-foreground'
                            ]"
                        >
                            <Icon
                                v-if="item.icon"
                                :icon="item.icon"
                                class="h-4 w-4"
                                aria-hidden="true"
                            />
                        </button>
                    </PopoverTrigger>
                    <PopoverContent
                        side="right"
                        align="start"
                        :side-offset="12"
                        :avoid-collisions="true"
                        class="w-52 p-1.5"
                    >
                        <p
                            class="text-muted-foreground mb-1.5 px-2 text-xs font-semibold tracking-wide uppercase"
                        >
                            {{ item.title }}
                        </p>
                        <ul role="list" class="space-y-0.5">
                            <li v-for="subItem in item.items" :key="subItem.id" role="listitem">
                                <NuxtLink
                                    :to="subItem.to"
                                    :aria-current="isActive(subItem.to) ? 'page' : undefined"
                                    class="flex items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors"
                                    :class="
                                        isActive(subItem.to)
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                            : 'text-foreground hover:bg-muted'
                                    "
                                >
                                    <Icon
                                        v-if="subItem.icon"
                                        :icon="subItem.icon"
                                        class="h-3.5 w-3.5 shrink-0"
                                        aria-hidden="true"
                                    />
                                    <span>{{ subItem.label }}</span>
                                </NuxtLink>
                            </li>
                        </ul>
                    </PopoverContent>
                </Popover>

                <!-- ── Expanded: normal collapsible ── -->
                <Collapsible
                    v-else
                    as-child
                    :default-open="item.isActive || isParentActive(item.items)"
                    class="group/collapsible"
                >
                    <SidebarMenuItem>
                        <CollapsibleTrigger as-child>
                            <SidebarMenuButton
                                :tooltip="item.title"
                                :aria-label="item.title"
                                :is-active="isParentActive(item.items)"
                            >
                                <Icon v-if="item.icon" :icon="item.icon" aria-hidden="true" />
                                <span>{{ item.title }}</span>
                                <ChevronRight
                                    class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                    aria-hidden="true"
                                />
                            </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <SidebarMenuSub role="list">
                                <SidebarMenuSubItem
                                    v-for="subItem in item.items"
                                    :key="subItem.id"
                                    role="listitem"
                                >
                                    <SidebarMenuSubButton
                                        as-child
                                        :is-active="isActive(subItem.to)"
                                    >
                                        <NuxtLink
                                            :to="subItem.to"
                                            :aria-current="
                                                isActive(subItem.to) ? 'page' : undefined
                                            "
                                        >
                                            <Icon
                                                v-if="subItem.icon"
                                                :icon="subItem.icon"
                                                class="h-4 w-4 shrink-0"
                                                aria-hidden="true"
                                            />
                                            <span>{{ subItem.label }}</span>
                                        </NuxtLink>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </SidebarMenuSub>
                        </CollapsibleContent>
                    </SidebarMenuItem>
                </Collapsible>
            </SidebarMenuItem>
        </SidebarMenu>
    </SidebarGroup>
</template>
