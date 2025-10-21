<script setup lang="ts">
//1.modules import

import type { FetchError } from 'ofetch'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { AlertCircle, ArrowLeft } from 'lucide-vue-next'
import { type InsertLocationType } from '~/lib/db/schema'
import { MAP_INPUT_CENTER } from '~/lib/constants'
import LocationForm from '~/components/LocationForm.vue'
import getFetchErrorMessage from '~/lib/get-fetch-error-message'

//2.modules init
definePageMeta({
    layout: 'dashboard-location'
})
const mapStoreTwo = useMapStoreTwo()
const { $csrfFetch } = useNuxtApp()
const router = useRouter()
const submitError = ref('')
const loading = ref(false)
const submitted = ref(false)
const submitErrors = ref<Record<string, string>>({})

//3.methods
async function onSubmit(values: InsertLocationType) {
    try {
        submitError.value = ''
        submitErrors.value = {}
        loading.value = true
        await $csrfFetch('/api/locations', {
            method: 'POST',
            body: values
        })
        submitted.value = true
        navigateTo(`/dashboard/locations`)
    } catch (e) {
        const error = e as FetchError
        if (error.data?.data) {
            submitErrors.value = error.data?.data
        }
        submitError.value = getFetchErrorMessage(error)
    } finally {
        loading.value = false
    }
}

//4.events
onMounted(() => {
    mapStoreTwo.addedPoint = {
        id: 'input-only',
        slug: 'input-only',
        name: 'Added Point',
        description: '',
        lat: MAP_INPUT_CENTER[0].toString(),
        long: MAP_INPUT_CENTER[1].toString()
    }
    mapStoreTwo.flyToMarker(mapStoreTwo.addedPoint, 5)
})
</script>

<template>
    <div
        class="border-border bg-card/90 supports-[backdrop-filter]:bg-card/60 absolute top-0 left-4 z-[2000] mt-4 w-[400px] rounded-2xl border px-6 py-8 shadow-md backdrop-blur-md dark:shadow-lg"
    >
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-lg font-bold">Add Location</h1>
                <p class="text-muted-foreground text-sm">
                    Add a new location here
                </p>
            </div>
            <div>
                <Button
                    :disabled="loading"
                    type="button"
                    variant="outline"
                    @click="router.back()"
                >
                    <ArrowLeft class="h-4 w-4" /> Back
                </Button>
            </div>
        </div>

        <div class="mt-6">
            <Alert v-if="submitError" variant="destructive" class="mb-4">
                <AlertCircle class="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>
                    {{ submitError }}
                </AlertDescription>
            </Alert>
            <LocationForm
                :loading="loading"
                :submitted="submitted"
                :on-submit="onSubmit"
                :submit-errors="submitErrors"
            />
        </div>
    </div>
</template>
