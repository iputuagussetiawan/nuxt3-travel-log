<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import {
    LucideMapPin,
    ChevronLeft,
    ChevronRight,
    List,
    X,
    Search,
    ArrowUpAZ,
    ArrowDownAZ,
    Clock
} from 'lucide-vue-next'
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerClose
} from '@/components/ui/drawer'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import type { MapPoint } from '~/lib/type'

const route = useRoute()
const sidebarStore = useSidebarStore()
const mapStore = useMapStore()

const open = ref(false)

// Search + sort
const search = ref('')
const sort = ref<'newest' | 'az' | 'za'>('newest')

const sortOptions = [
    { value: 'newest', label: 'Newest', icon: Clock },
    { value: 'az', label: 'A→Z', icon: ArrowUpAZ },
    { value: 'za', label: 'Z→A', icon: ArrowDownAZ }
] as const

const filteredItems = computed(() => {
    let list = [...sidebarStore.sidebarItems]
    const q = search.value.trim().toLowerCase()
    if (q) list = list.filter((i) => i.label.toLowerCase().includes(q))
    if (sort.value === 'az') list.sort((a, b) => a.label.localeCompare(b.label))
    else if (sort.value === 'za')
        list.sort((a, b) => b.label.localeCompare(a.label))
    return list
})

// Pagination over filtered list
const PAGE_SIZE = 8
const page = ref(1)

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredItems.value.length / PAGE_SIZE))
)

const pagedItems = computed(() => {
    const start = (page.value - 1) * PAGE_SIZE
    return filteredItems.value.slice(start, start + PAGE_SIZE)
})

// Reset page on filter/sort/items change
watch([search, sort, () => sidebarStore.sidebarItems], () => {
    page.value = 1
})

// Reset search+sort when drawer closes
watch(open, (val) => {
    if (!val) {
        search.value = ''
        sort.value = 'newest'
    }
})

function prev() {
    if (page.value > 1) page.value--
}
function next() {
    if (page.value < totalPages.value) page.value++
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

function handleClick(subItem: any) {
    if (subItem.location)
        mapStore.navigateToMarker(subItem.location as MapPoint)
    open.value = false
    navigateTo(subItem.to)
}
</script>

<template>
    <div v-if="sidebarStore.sidebarItems.length || sidebarStore.loading">
        <!-- Floating trigger -->
        <button
            class="bg-primary text-primary-foreground hover:bg-primary/90 fixed top-20 right-4 z-[2000] flex items-center gap-2 rounded-full px-4 py-3 text-sm font-medium shadow-lg transition-all hover:shadow-xl active:scale-95"
            aria-label="Open map listing"
            @click="open = true"
        >
            <List class="h-4 w-4" />
            <span class="hidden sm:inline">Map List</span>
            <span
                v-if="sidebarStore.sidebarItems.length"
                class="bg-primary-foreground text-primary flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold"
            >
                {{ sidebarStore.sidebarItems.length }}
            </span>
        </button>

        <!-- Drawer -->
        <Drawer v-model:open="open" direction="right">
            <DrawerContent
                class="bg-background/80 supports-[backdrop-filter]:bg-background/60 z-[4000] flex h-full flex-col border-l border-white/10 backdrop-blur-md"
            >
                <!-- Header -->
                <DrawerHeader
                    class="relative shrink-0 overflow-hidden border-b p-0"
                >
                    <div
                        class="from-primary/15 dark:from-primary/20 absolute inset-0 bg-gradient-to-b to-transparent backdrop-blur-sm"
                    />
                    <div
                        class="relative flex items-start justify-between p-5 pb-4"
                    >
                        <div class="flex flex-col gap-1">
                            <div class="flex items-center gap-2.5">
                                <div
                                    class="bg-primary/10 ring-primary/20 flex h-8 w-8 items-center justify-center rounded-lg ring-1"
                                >
                                    <LucideMapPin
                                        class="text-primary h-4 w-4"
                                    />
                                </div>
                                <DrawerTitle
                                    class="text-base font-semibold tracking-tight"
                                >
                                    Map Listing
                                </DrawerTitle>
                            </div>
                            <p class="text-muted-foreground pl-[42px] text-xs">
                                {{ filteredItems.length }} of
                                {{ sidebarStore.sidebarItems.length }}
                                {{
                                    sidebarStore.sidebarItems.length === 1
                                        ? 'location'
                                        : 'locations'
                                }}
                            </p>
                        </div>
                        <DrawerClose as-child>
                            <button
                                class="text-muted-foreground hover:text-foreground hover:bg-muted mt-0.5 rounded-md p-1.5 transition-colors"
                                aria-label="Close drawer"
                            >
                                <X class="h-4 w-4" />
                            </button>
                        </DrawerClose>
                    </div>
                </DrawerHeader>

                <!-- Search + Sort -->
                <div
                    class="bg-background/40 shrink-0 space-y-2 border-b px-4 py-3 backdrop-blur-sm"
                >
                    <!-- Search -->
                    <div class="relative">
                        <Search
                            class="text-muted-foreground absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2"
                        />
                        <Input
                            v-model="search"
                            placeholder="Search..."
                            class="bg-background/60 dark:bg-card/60 h-8 pr-7 pl-8 text-sm"
                        />
                        <button
                            v-if="search"
                            class="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 transition-colors"
                            aria-label="Clear"
                            @click="search = ''"
                        >
                            <X class="h-3.5 w-3.5" />
                        </button>
                    </div>

                    <!-- Sort pills -->
                    <div
                        class="bg-muted/50 dark:bg-muted/20 flex gap-1 rounded-lg p-1"
                    >
                        <button
                            v-for="opt in sortOptions"
                            :key="opt.value"
                            :aria-pressed="sort === opt.value"
                            class="flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors"
                            :class="
                                sort === opt.value
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-background/60'
                            "
                            @click="sort = opt.value"
                        >
                            <component
                                :is="opt.icon"
                                class="h-3 w-3"
                                aria-hidden="true"
                            />
                            {{ opt.label }}
                        </button>
                    </div>
                </div>

                <!-- Loading -->
                <div
                    v-if="sidebarStore.loading"
                    class="flex-1 space-y-2 overflow-y-auto p-4"
                >
                    <Skeleton
                        v-for="i in 8"
                        :key="i"
                        class="h-10 w-full rounded-lg"
                    />
                </div>

                <!-- No results -->
                <div
                    v-else-if="!filteredItems.length"
                    class="flex flex-1 flex-col items-center justify-center gap-2 p-6 text-center"
                >
                    <LucideMapPin class="text-muted-foreground/40 h-8 w-8" />
                    <p class="text-muted-foreground text-sm">
                        No locations match
                        <span class="font-medium">"{{ search }}"</span>
                    </p>
                    <button
                        class="text-primary text-xs underline-offset-4 hover:underline"
                        @click="search = ''"
                    >
                        Clear search
                    </button>
                </div>

                <!-- List -->
                <ul
                    v-else
                    class="flex-1 space-y-0.5 overflow-y-auto p-3"
                    role="list"
                >
                    <li
                        v-for="subItem in pagedItems"
                        :key="subItem.id"
                        role="listitem"
                    >
                        <button
                            class="w-full rounded-lg px-3 py-2.5 text-left text-sm transition-colors"
                            :class="[
                                isSelected(subItem)
                                    ? 'bg-primary text-primary-foreground'
                                    : isCurrentPage(subItem)
                                      ? 'bg-sidebar-accent text-sidebar-accent-foreground font-medium'
                                      : 'text-foreground hover:bg-muted/60'
                            ]"
                            :aria-current="
                                isCurrentPage(subItem) ? 'page' : undefined
                            "
                            @click="handleClick(subItem)"
                        >
                            <div class="flex items-center gap-2">
                                <LucideMapPin
                                    class="h-3.5 w-3.5 shrink-0"
                                    :class="
                                        isSelected(subItem)
                                            ? 'text-primary-foreground'
                                            : 'text-primary'
                                    "
                                    aria-hidden="true"
                                />
                                <span class="truncate">{{
                                    subItem.label
                                }}</span>
                            </div>
                        </button>
                    </li>
                </ul>

                <!-- Pagination -->
                <div
                    v-if="
                        !sidebarStore.loading &&
                        filteredItems.length &&
                        totalPages > 1
                    "
                    class="bg-background/40 flex shrink-0 items-center justify-between border-t px-4 py-3 backdrop-blur-sm"
                >
                    <button
                        :disabled="page === 1"
                        class="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                        @click="prev"
                    >
                        <ChevronLeft class="h-3.5 w-3.5" /> Prev
                    </button>
                    <span class="text-muted-foreground text-xs tabular-nums">
                        {{ page }} / {{ totalPages }}
                        <span class="text-muted-foreground/60 ml-1"
                            >({{ filteredItems.length }})</span
                        >
                    </span>
                    <button
                        :disabled="page === totalPages"
                        class="text-muted-foreground hover:text-foreground hover:bg-muted flex items-center gap-1 rounded-md px-2 py-1 text-xs transition-colors disabled:cursor-not-allowed disabled:opacity-30"
                        @click="next"
                    >
                        Next <ChevronRight class="h-3.5 w-3.5" />
                    </button>
                </div>
            </DrawerContent>
        </Drawer>
    </div>
</template>
