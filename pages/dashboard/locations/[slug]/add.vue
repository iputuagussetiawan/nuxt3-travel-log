<script setup lang="ts">
import LocationLogForm from '~/components/LocationLogForm.vue'
import { MAP_INPUT_CENTER } from '~/lib/constants'
import type { InsertLocationLogType } from '~/lib/db/schema'
import { fromDate, getLocalTimeZone, parseDate } from '@internationalized/date'

definePageMeta({ layout: 'dashboard-location' })
useSeoMeta({
    title: 'Add Location Log',
    description: 'Add a new log entry to this travel location.'
})
const { $csrfFetch } = useNuxtApp()
const route = useRoute()
const { currentLocation } = useLocationsStore()

//3.methods
async function onSubmit(values: InsertLocationLogType) {
    await $csrfFetch(`/api/locations/${route.params.slug}/add`, {
        method: 'POST',
        body: values
    })
}
function onSubmitComplete() {
    navigateTo({
        name: 'dashboard-locations-slug',
        params: {
            slug: route.params.slug
        }
    })
}
</script>
<template>
    <div
        class="border-border bg-card/90 supports-[backdrop-filter]:bg-card/60 absolute top-0 left-4 z-[2000] mt-4 w-[400px] rounded-2xl border px-6 py-8 shadow-md backdrop-blur-md dark:shadow-lg"
    >
        <div>
            <h1 class="text-lg font-bold">Add Location Log</h1>
            <p class="text-muted-foreground text-sm">
                Add a new location log here
            </p>
        </div>
        <LocationLogForm
            :on-submit="onSubmit"
            :on-submit-complete="onSubmitComplete"
            submit-label="Add Location Log"
            submit-icon="add-location-icon"
            :initial-values="{
                slug: '',
                name: '',
                description: '',
                startedAt: '',
                endedAt: '',
                lat:
                    currentLocation?.lat.toString() ||
                    MAP_INPUT_CENTER[0].toString(),
                long:
                    currentLocation?.long.toString() ||
                    MAP_INPUT_CENTER[1].toString()
            }"
        />
    </div>
</template>
<style lang="scss" scoped></style>
