<script setup lang="ts">
import { MapPin } from 'lucide-vue-next'
import EmptyState from '~/components/EmptyState.vue'

definePageMeta({ layout: 'dashboard-location' })

useSeoMeta({
    title: 'My Locations',
    description: 'View and manage all your logged travel locations on the map.'
})

const locationsStore = useLocationsStore()
const { locations, locationsStatus: status } = storeToRefs(locationsStore)
</script>

<template>
    <section class="absolute top-0 right-0 left-0 z-[1000]">
        <div class="mt-4 px-4">
            <!-- Header -->
            <div>
                <h1 class="text-lg font-bold">Locations</h1>
                <p class="text-muted-foreground text-sm">
                    {{ locations?.length ?? 0 }}
                    location{{ (locations?.length ?? 0) !== 1 ? 's' : '' }} on
                    map
                </p>
            </div>

            <!-- Empty state -->
            <div v-if="status !== 'pending' && !locations?.length" class="mt-6">
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
