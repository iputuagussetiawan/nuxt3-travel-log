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
    SidebarMenuSubItem
} from './ui/sidebar'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger
} from './ui/collapsible'
import { Icon } from '@iconify/vue'

const route = useRoute()
const sidebarStore = useSidebarStore()
const { sidebarTopItems } = storeToRefs(sidebarStore)

function isActive(to: string | object | undefined) {
    if (!to) return false
    const path = typeof to === 'string' ? to : ((to as any).path ?? '')
    return route.path === path
}
</script>

<template>
    <SidebarGroup v-if="sidebarTopItems.length">
        <SidebarGroupLabel>Navigation</SidebarGroupLabel>
        <SidebarMenu>
            <Collapsible
                v-for="item in sidebarTopItems"
                :key="item.title"
                as-child
                :default-open="item.isActive"
                class="group/collapsible"
            >
                <SidebarMenuItem>
                    <CollapsibleTrigger as-child>
                        <SidebarMenuButton
                            :tooltip="item.title"
                            :aria-label="item.title"
                        >
                            <Icon
                                v-if="item.icon"
                                :icon="item.icon"
                                aria-hidden="true"
                            />
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
                                    :class="
                                        isActive(subItem.to)
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                            : ''
                                    "
                                >
                                    <NuxtLink
                                        :to="subItem.to"
                                        :aria-current="
                                            isActive(subItem.to)
                                                ? 'page'
                                                : undefined
                                        "
                                    >
                                        <Icon
                                            v-if="
                                                subItem.icon &&
                                                !subItem.icon.includes('sds') &&
                                                !subItem.icon.includes('Teses')
                                            "
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
        </SidebarMenu>
    </SidebarGroup>
</template>
