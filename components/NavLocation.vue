<script setup lang="ts">
import { ChevronRight, ChevronLeft, LucideMapPin } from 'lucide-vue-next'
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from './ui/collapsible'
import { Skeleton } from './ui/skeleton'
import type { MapPoint } from '~/lib/type'

const route = useRoute()
const sidebarStore = useSidebarStore()
const mapStore = useMapStore()

const PAGE_SIZE = 8
const page = ref(1)

const totalPages = computed(() =>
    Math.max(1, Math.ceil(sidebarStore.sidebarItems.length / PAGE_SIZE))
)

const pagedItems = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return sidebarStore.sidebarItems.slice(start, start + PAGE_SIZE)
})

// Reset to page 1 when items change (route navigation)
watch(
    () => sidebarStore.sidebarItems,
    () => {
        page.value = 1
    }
)

function prev() {
    if (page.value > 1) page.value--
}
function next() {
    if (page.value < totalPages.value) page.value++
}

function handleNavigateToLocation(location: MapPoint) {
    mapStore.navigateToMarker(location)
}

function isSelected(subItem: any) {
    return mapStore.selectedPoint?.id === subItem.location?.id
}

function isCurrentPage(subItem: any) {
    return route.path === subItem.to || route.path.startsWith(String(subItem.to) + '/')
}
</script>

<template>
    <SidebarGroup v-if="sidebarStore.loading || sidebarStore.sidebarItems.length">
        <SidebarGroupLabel>My Map</SidebarGroupLabel>
        <SidebarMenu>
            <Collapsible as-child default-open class="group/collapsible">
                <SidebarMenuItem>
                    <CollapsibleTrigger as-child>
                        <SidebarMenuButton tooltip="Map Listing" aria-label="Map Listing">
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

                            <!-- Paged items -->
                            <SidebarMenuSubItem
                                v-for="subItem in pagedItems"
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
                                        isCurrentPage(subItem) && !isSelected(subItem)
                                            ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                            : ''
                                    ]"
                                >
                                    <NuxtLink
                                        :to="subItem.to"
                                        :aria-current="isCurrentPage(subItem) ? 'page' : undefined"
                                        :aria-pressed="isSelected(subItem) || undefined"
                                        @click="
                                            subItem.location &&
                                            handleNavigateToLocation(subItem.location as MapPoint)
                                        "
                                    >
                                        <span>{{ subItem.label }}</span>
                                    </NuxtLink>
                                </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                        </SidebarMenuSub>

                        <!-- Pagination -->
                        <div
                            v-if="!sidebarStore.loading && totalPages > 1"
                            class="mt-1 flex items-center justify-between px-2 py-1"
                        >
                            <button
                                :disabled="page === 1"
                                class="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Previous page"
                                @click="prev"
                            >
                                <ChevronLeft class="h-3.5 w-3.5" />
                            </button>

                            <span class="text-muted-foreground text-xs tabular-nums">
                                {{ page }} / {{ totalPages }}
                            </span>

                            <button
                                :disabled="page === totalPages"
                                class="text-muted-foreground hover:text-foreground hover:bg-sidebar-accent rounded p-1 transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                                aria-label="Next page"
                                @click="next"
                            >
                                <ChevronRight class="h-3.5 w-3.5" />
                            </button>
                        </div>
                    </CollapsibleContent>
                </SidebarMenuItem>
            </Collapsible>
        </SidebarMenu>
    </SidebarGroup>
</template>
