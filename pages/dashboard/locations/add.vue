<script setup lang="ts">
//1.modules import
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-vue-next'
import { type InsertLocationType } from '~/lib/db/schema'
import LocationForm from '~/components/LocationForm.vue'

//2.modules init
definePageMeta({
    layout: 'dashboard-location'
})
const { $csrfFetch } = useNuxtApp()
const router = useRouter()

//3.methods
async function onSubmit(values: InsertLocationType) {
    await $csrfFetch('/api/locations', {
        method: 'POST',
        body: values
    })
    navigateTo(`/dashboard/locations`)
}
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
                <Button type="button" variant="outline" @click="router.back()">
                    <ArrowLeft class="h-4 w-4" /> Back
                </Button>
            </div>
        </div>
        <div class="mt-6">
            <LocationForm :on-submit="onSubmit" />
        </div>
    </div>
</template>
