<script setup lang="ts">
import { AlertCircle, ArrowLeft } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import LocationForm from '~/components/LocationForm.vue'
import getFetchErrorMessage from '~/lib/get-fetch-error-message'
import { type InsertLocationType } from '~/lib/db/schema'
import type { FetchError } from 'ofetch'
const { $csrfFetch } = useNuxtApp()
const router = useRouter()
const submitError = ref('')
const loading = ref(false)
const submitted = ref(false)
const submitErrors = ref<Record<string, string>>({})

const locationStore = useLocationsStore()
definePageMeta({
    layout: 'dashboard-location'
})

async function onSubmit(values: InsertLocationType) {
    console.log('Update Location', values)
    // await $csrfFetch('/api/locations', {
    //     method: 'POST',
    //     body: values
    // })
    // navigateTo(`/dashboard/locations`)
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
            <LocationForm
                :on-submit="onSubmit"
                :initial-values="locationStore.currentLocation"
            />
        </div>
    </div>
</template>
<style lang="scss" scoped></style>
