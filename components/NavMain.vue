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

const sidebarStore = useSidebarStore()
const { sidebarTopItems } = storeToRefs(sidebarStore)
</script>

<template>
    <SidebarGroup>
        <SidebarGroupLabel>Platform</SidebarGroupLabel>
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
                        <SidebarMenuButton :tooltip="item.title">
                            <component :is="item.icon" v-if="item.icon" />
                            <span>{{ item.title }}</span>
                            <ChevronRight
                                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                            />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            <SidebarMenuSubItem
                                v-for="subItem in item.items"
                                :key="subItem.id"
                            >
                                <SidebarMenuSubButton as-child>
                                    <NuxtLink :to="subItem.to">
                                        <component
                                            :is="item.icon"
                                            v-if="item.icon"
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
