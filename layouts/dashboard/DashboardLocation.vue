<script setup lang="ts">
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from '@/components/ui/sidebar'
import MapClientClient from '~/components/MapClient.client.vue'
// import MapClient from '~/components/MapClient.vue'
import { Separator } from '~/components/ui/separator'
import ThemeToggle from '~/components/ui/ThemeToggle.vue'

const locationsStore = useLocationsStore()
const authStore = useAuthStore()
await authStore.init()
onMounted(() => {
    locationsStore.refresh()
})
</script>
<template>
    <SidebarProvider>
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
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem class="hidden md:block">
                                    <BreadcrumbLink as-child>
                                        <NuxtLink to="/dashboard">
                                            Dashboard
                                        </NuxtLink>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator class="hidden md:block" />
                                <BreadcrumbItem class="hidden md:block">
                                    <BreadcrumbLink as-child>
                                        <NuxtLink to="/dashboard/locations">
                                            Locations
                                        </NuxtLink>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator class="hidden md:block" />
                                <BreadcrumbItem>
                                    <BreadcrumbPage>
                                        Data Fetching
                                    </BreadcrumbPage>
                                </BreadcrumbItem>
                            </BreadcrumbList>
                        </Breadcrumb>
                    </div>
                    <div>
                        <ThemeToggle />
                    </div>
                </div>
            </header>
            <main>
                <div class="relative">
                    <slot />
                    <div class="">
                        <MapClientClient />
                    </div>
                </div>
            </main>
        </SidebarInset>
    </SidebarProvider>
</template>

<style lang="scss"></style>
