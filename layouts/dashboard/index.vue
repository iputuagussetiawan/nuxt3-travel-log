<script setup lang="ts">
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '~/components/ui/separator'
import ThemeToggle from '~/components/ThemeToggle.vue'
import DashboardBreadcrumb from '~/components/DashboardBreadcrumb.vue'

const authStore = useAuthStore()
await authStore.init()
</script>
<template>
    <SidebarProvider :default-open="false">
        <AppSidebar />
        <SidebarInset>
            <header
                class="bg-background/60 sticky top-0 z-[3400] flex h-16 shrink-0 items-center gap-2 border-b border-white/10 backdrop-blur-md transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 dark:border-white/5"
            >
                <div class="flex w-full items-center justify-between gap-2 px-4">
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
                <slot />
            </main>
        </SidebarInset>
    </SidebarProvider>
</template>

<style lang="scss"></style>
