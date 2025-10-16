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

const authStore = useAuthStore()
await authStore.init()
</script>
<template>
    <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
            <header
                class="sticky top-0 z-[3000] flex border-b h-16 shrink-0 items-center gap-2 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
            >
                <div
                    class="flex items-center gap-2 px-4 justify-between w-full"
                >
                    <div class="flex items-center gap-2">
                        <SidebarTrigger class="-ml-1" />
                        <Separator orientation="vertical" class="mr-2 h-4" />
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
