<script setup lang="ts">
//1.modules import
import { buttonVariants } from '@/components/ui/button'
import { LucideCirclePlus, MapPin } from 'lucide-vue-next'
import { cn } from '~/lib/utils'
import CardLocation from '~/components/ui/CardLocation.vue'
import CardLocationSkelton from '~/components/ui/CardLocationSkelton.vue'
import EmptyState from '~/components/ui/EmptyState.vue'

const locationsStore = useLocationsStore()
const { locations, locationsStatus: status } = storeToRefs(locationsStore)

//2.modules init
definePageMeta({
    layout: 'dashboard-location'
})

onMounted(() => {
    locationsStore.refreshLocations()
})
</script>
<template>
    <section class="absolute top-0 right-0 left-0 z-[1000]">
        <div class="mt-4 px-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-lg font-bold">List Location</h1>
                    <p class="text-muted-foreground text-sm">
                        List of all locations here
                    </p>
                </div>
                <div class="flex gap-2">
                    <NuxtLink
                        to="/dashboard/locations/add"
                        :class="
                            cn(buttonVariants({ variant: 'default' }), 'gap-2')
                        "
                    >
                        Add Location
                        <LucideCirclePlus class="h-4 w-4" />
                    </NuxtLink>
                </div>
            </div>
            <div
                v-if="status === 'pending'"
                class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6"
            >
                <CardLocationSkelton v-for="i in 12" :key="i" />
            </div>
            <div
                v-else-if="locations && locations.length > 0"
                class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-6"
            >
                <CardLocation
                    v-for="location in locations"
                    :key="location.id"
                    :map-point="location"
                />
            </div>
            <div v-else class="w-full">
                <EmptyState
                    :icon="MapPin"
                    title="No Locations Found"
                    description="You haven't added any locations yet. Start by creating your first one to begin tracking and managing your data."
                    actionText="Create Location"
                    actionTo="/dashboard/locations/add"
                    learnMoreTo="/dashboard"
                />
            </div>
        </div>
    </section>
</template>
<style lang="scss" scoped></style>
