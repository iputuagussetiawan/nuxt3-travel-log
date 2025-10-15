<script setup lang="ts">
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
import { Skeleton } from './ui/skeleton'

const sidebarStore = useSidebarStore()
const mapStore = useMapStore()
</script>

<template>
    <SidebarGroup>
        <SidebarGroupLabel>My Map</SidebarGroupLabel>
        <SidebarMenu v-if="sidebarStore.sidebarItems.length">
            <Collapsible as-child default-open class="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger as-child>
                        <SidebarMenuButton tooltip="My Map Listing">
                            <LucideMapPin />
                            <span>Map Listing</span>
                            <ChevronRight
                                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                            />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub>
                            <template v-if="sidebarStore.loading">
                                <Skeleton
                                    v-for="i in 5"
                                    :key="i"
                                    class="w-full h-5 rounded-full mb-2 last:mb-0"
                                />
                            </template>

                            <template
                                v-if="
                                    !sidebarStore.loading &&
                                    sidebarStore.sidebarItems.length
                                "
                            >
                                <SidebarMenuSubItem
                                    v-for="subItem in sidebarStore.sidebarItems"
                                    :key="subItem.id"
                                    :class="
                                        mapStore.selectedPoint?.id ===
                                        subItem.location?.id
                                            ? 'text-green-600'
                                            : ''
                                    "
                                    @mouseenter="
                                        mapStore.selectedPoint =
                                            subItem.location ?? null
                                    "
                                    @mouseleave="mapStore.selectedPoint = null"
                                >
                                    <SidebarMenuSubButton as-child>
                                        <NuxtLink :to="subItem.href">
                                            <span>{{ subItem.label }}</span>
                                        </NuxtLink>
                                    </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                            </template>
                        </SidebarMenuSub>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        </SidebarMenu>
    </SidebarGroup>
</template>
