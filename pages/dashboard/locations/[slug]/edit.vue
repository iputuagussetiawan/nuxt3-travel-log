<script setup lang="ts">
import { AlertCircle, ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import LocationForm from '~/components/LocationForm.vue'
import getFetchErrorMessage from '~/lib/get-fetch-error-message'
import { type InsertLocationType } from '~/lib/db/schema'
import type { FetchError } from 'ofetch'
const { $csrfFetch } = useNuxtApp()
const route = useRoute()
const router = useRouter()
const loading = ref(false)

const locationStore = useLocationsStore()
definePageMeta({ layout: 'dashboard-location' })
useSeoMeta({
    title: 'Edit Location',
    description: 'Edit your travel location details.'
})

async function onSubmit(values: InsertLocationType) {
    console.log('Update Location', values)
    await $csrfFetch(`/api/locations/${route.params.slug}`, {
        method: 'PUT',
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
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-lg font-bold">Edit Location</h1>
                <p class="text-muted-foreground text-sm">Edit location here</p>
            </div>
            <div>
                <Button :disabled="loading" type="button" variant="outline" @click="router.back()">
                    <ArrowLeft class="h-4 w-4" /> Back
                </Button>
            </div>
        </div>
        <div class="mt-6">
            <LocationForm
                v-if="locationStore.currentLocationStatus !== 'pending'"
                :on-submit="onSubmit"
                :on-submit-complete="onSubmitComplete"
                :initial-values="locationStore.currentLocation"
                submit-label="Edit Location"
                submit-icon="edit-location-icon"
            />
        </div>
    </div>
</template>
<style lang="scss" scoped></style>
