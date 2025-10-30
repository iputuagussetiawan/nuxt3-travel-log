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
const sidebarStore = useSidebarStore()
const mapStore = useMapStore()

const navigateToMarker = (location: MapPoint | null) => {
    if (location) {
        mapStore.navigateToMarker(location)
    }
}
</script>

<template>
    <SidebarGroup>
        <SidebarGroupLabel v-if="sidebarStore.sidebarItems.length"
            >My Map</SidebarGroupLabel
        >

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
                                    class="mb-2 h-5 w-full rounded-full last:mb-0"
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
                                    @click="
                                        navigateToMarker(
                                            subItem.location ?? null
                                        )
                                    "
                                    class="cursor-pointer"
                                >
                                    <SidebarMenuSubButton as-child>
                                        <NuxtLink
                                            :to="subItem.to"
                                            :class="
                                                mapStore.selectedPoint?.id ===
                                                subItem.location?.id
                                                    ? 'bg-blue-600'
                                                    : ''
                                            "
                                        >
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
