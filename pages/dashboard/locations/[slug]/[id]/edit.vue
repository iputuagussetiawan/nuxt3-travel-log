<script setup lang="ts">
import LocationLogForm from '~/components/LocationLogForm.vue'
import { MAP_INPUT_CENTER } from '~/lib/constants'
import type { InsertLocationLogType } from '~/lib/db/schema'

definePageMeta({ layout: 'dashboard-location' })
useSeoMeta({ title: 'Edit Log', description: 'Edit this travel log entry.' })

const { $csrfFetch } = useNuxtApp()
const route = useRoute()
const { currentLocationLog } = useLocationsStore()

//3.methods
async function onSubmit(values: InsertLocationLogType) {
    await $csrfFetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
        method: 'PUT',
        body: values
    })
}
function onSubmitComplete() {
    navigateTo({
        name: 'dashboard-locations-slug-id',
        params: {
            slug: route.params.slug,
            id: route.params.id
        }
    })
}
</script>
<template>
    <div
        class="border-border bg-card/90 supports-[backdrop-filter]:bg-card/60 absolute top-0 left-4 z-[2000] mt-4 w-[400px] rounded-2xl border px-6 py-8 shadow-md backdrop-blur-md dark:shadow-lg"
    >
        <div>
            <h1 class="text-lg font-bold">Edit Location Log</h1>
            <p class="text-muted-foreground text-sm">Edit location log here</p>
        </div>
        <LocationLogForm
            :on-submit="onSubmit"
            :on-submit-complete="onSubmitComplete"
            submit-label="Edit Location Log"
            submit-icon="edit-location-icon"
            :initial-values="{
                slug: currentLocationLog?.slug || '',
                name: currentLocationLog?.name || '',
                description: currentLocationLog?.description || '',
                startedAt: currentLocationLog?.startedAt || '',
                endedAt: currentLocationLog?.endedAt || '',
                lat:
                    currentLocationLog?.lat.toString() ||
                    MAP_INPUT_CENTER[0].toString(),
                long:
                    currentLocationLog?.long.toString() ||
                    MAP_INPUT_CENTER[1].toString()
            }"
        />
    </div>
</template>
<style lang="scss" scoped></style>
