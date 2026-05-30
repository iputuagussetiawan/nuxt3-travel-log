<script setup lang="ts">
import { ChevronRight, LucideMapPin } from 'lucide-vue-next'
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
import type { MapPoint } from '~/lib/type'

const route = useRoute()
const sidebarStore = useSidebarStore()
const mapStore = useMapStore()

function handleNavigateToLocation(location: MapPoint) {
    mapStore.navigateToMarker(location)
}

function isSelected(subItem: any) {
    return mapStore.selectedPoint?.id === subItem.location?.id
}

function isCurrentPage(subItem: any) {
    return (
        route.path === subItem.to ||
        route.path.startsWith(String(subItem.to) + '/')
    )
}
</script>

<template>
    <SidebarGroup
        v-if="sidebarStore.loading || sidebarStore.sidebarItems.length"
    >
        <SidebarGroupLabel>My Map</SidebarGroupLabel>
        <SidebarMenu>
            <Collapsible as-child default-open class="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger as-child>
                        <SidebarMenuButton
                            tooltip="Map Listing"
                            aria-label="Map Listing"
                        >
                            <LucideMapPin aria-hidden="true" />
                            <span>Map Listing</span>
                            <ChevronRight
                                class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
                                aria-hidden="true"
                            />
                        </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <SidebarMenuSub role="list">
                            <!-- Loading skeletons -->
                            <template v-if="sidebarStore.loading">
                                <li
                                    v-for="i in 5"
                                    :key="i"
                                    role="listitem"
                                    aria-hidden="true"
                                    class="px-2 py-1"
                                >
                                    <Skeleton class="h-5 w-full rounded-full" />
                                </li>
                            </template>

                            <!-- Items -->
                            <SidebarMenuSubItem
                                v-for="subItem in sidebarStore.sidebarItems"
                                v-else
                                :key="subItem.id"
                                role="listitem"
                            >
                                <SidebarMenuSubButton
                                    as-child
                                    :class="[
                                        isSelected(subItem)
                                            ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                                            : '',
                                        isCurrentPage(subItem) &&
                                        !isSelected(subItem)
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                            : ''
                                    ]"
                                >
                                    <NuxtLink
                                        :to="subItem.to"
                                        :aria-current="
                                            isCurrentPage(subItem)
                                                ? 'page'
                                                : undefined
                                        "
                                        :aria-pressed="
                                            isSelected(subItem) || undefined
                                        "
                                        @click="
                                            subItem.location &&
                                            handleNavigateToLocation(
                                                subItem.location as MapPoint
                                            )
                                        "
                                    >
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
