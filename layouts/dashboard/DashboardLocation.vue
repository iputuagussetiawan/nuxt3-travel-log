<script setup lang="ts">
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from '@/components/ui/sidebar'
import MapClientClient from '~/components/MapClient.client.vue'
import MapListDrawer from '~/components/MapListDrawer.vue'
import DashboardBreadcrumb from '~/components/DashboardBreadcrumb.vue'
import { Separator } from '~/components/ui/separator'
import ThemeToggle from '~/components/ThemeToggle.vue'
import { Plus } from 'lucide-vue-next'
import {
    CURRENT_LOCATION_LOG_PAGES,
    CURRENT_LOCATION_PAGES,
    LOCATION_PAGES
} from '~/lib/constants'

const locationsStore = useLocationsStore()
const authStore = useAuthStore()
await authStore.init()
const route = useRoute()

if (LOCATION_PAGES.has(route.name?.toString() || '')) {
    await locationsStore.refreshLocations()
}

if (
    CURRENT_LOCATION_PAGES.has(route.name?.toString() || '') ||
    CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || '')
) {
    await locationsStore.refreshCurrentLocation()
}

if (CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || '')) {
    await locationsStore.refreshCurrentLocationLog()
}
</script>

<template>
    <SidebarProvider :default-open="false">
        <AppSidebar />
        <SidebarInset>
            <header
                class="bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-[3000] flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
            >
                <div
                    class="flex w-full items-center justify-between gap-2 px-4"
                >
                    <div class="flex items-center gap-2">
                        <SidebarTrigger class="-ml-1" />
                        <Separator orientation="vertical" class="mr-2 h-4" />
                        <DashboardBreadcrumb />
                    </div>
                    <div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>
            <main>
                <div class="relative">
                    <NuxtPage />
                    <MapClientClient />
                    <MapListDrawer />

                    <!-- Floating add location button -->
                    <div
                        class="add-location-btn fixed bottom-6 left-1/2 z-[2000] -translate-x-1/2"
                    >
                        <NuxtLink
                            to="/dashboard/locations/add"
                            class="relative flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white"
                            aria-label="Add new location"
                        >
                            <Plus class="h-4 w-4" aria-hidden="true" />
                            Add Location
                        </NuxtLink>
                    </div>
                </div>
            </main>
        </SidebarInset>
    </SidebarProvider>
</template>

<style lang="scss">
.add-location-btn a {
    background: linear-gradient(135deg, #6366f1, #8b5cf6, #06b6d4, #6366f1);
    background-size: 300% 300%;
    animation: gradientShift 4s ease infinite;
    box-shadow: 0 0 18px rgba(139, 92, 246, 0.45);
    transition:
        box-shadow 0.4s ease,
        transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1),
        filter 0.35s ease;

    &:hover {
        box-shadow:
            0 0 36px rgba(139, 92, 246, 0.75),
            0 0 64px rgba(6, 182, 212, 0.35);
        filter: brightness(1.18) saturate(1.2);
        animation-duration: 1.5s;
    }

    &:active {
        transform: scale(0.95) !important;
        box-shadow: 0 0 10px rgba(139, 92, 246, 0.35);
        filter: brightness(0.92);
        transition-duration: 0.1s;
    }
}

@keyframes gradientShift {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>
