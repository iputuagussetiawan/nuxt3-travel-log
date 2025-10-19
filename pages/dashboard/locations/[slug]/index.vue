<script setup lang="ts">
import { FolderOpen, Cloud, CirclePlus } from 'lucide-vue-next'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/empty'
definePageMeta({
    layout: 'dashboard-location'
})
const route = useRoute()
const { slug } = route.params
const mapStoreTwo = useMapStoreTwo()
const locationStore = useLocationsStore()

const {
    data: location,
    status,
    error
} = await useFetch(`/api/locations/${slug}`, {
    lazy: true
})

watch(location, (val) => {
    if (val && val.lat && val.long) {
        mapStoreTwo.flyToMarker(
            { lat: String(val.lat), long: String(val.long) },
            10
        )
    }
})

onMounted(() => {
    locationStore.refreshCurrentLocation()
})
</script>

<template>
    <div
        class="border-border bg-card/90 supports-[backdrop-filter]:bg-card/60 absolute top-0 left-4 z-[2000] mt-4 w-[400px] rounded-2xl border px-6 py-8 shadow-md backdrop-blur-md dark:shadow-lg"
    >
        <!-- Loading -->
        <div v-if="status === 'pending'">...Loading</div>
        <!-- Success -->
        <div v-if="location && status !== 'pending'">
            <h1 class="text-xl font-bold">
                Location Name : {{ location.name }}
            </h1>
            <h2>{{ location.description }}</h2>
            <p>{{ location.lat }}, {{ location.long }}</p>
        </div>

        <div v-if="location && !location.locationLogs.length" class="mt-4">
            <Empty class="border border-dashed">
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <Cloud />
                    </EmptyMedia>
                    <EmptyTitle class="mb-0">Location Log is empty</EmptyTitle>
                    <EmptyDescription>
                        Please create a location log
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <NuxtLink
                        to="/dashboard/locations"
                        :class="buttonVariants({ variant: 'outline' })"
                    >
                        Create Location Log <CirclePlus class="ml-2" />
                    </NuxtLink>
                </EmptyContent>
            </Empty>
        </div>

        <!-- Error -->
        <div v-if="error && status !== 'pending'">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia variant="icon">
                        <FolderOpen />
                    </EmptyMedia>
                    <EmptyTitle>
                        <h2 class="text-xl font-bold">
                            {{ error.statusMessage }}
                        </h2>
                    </EmptyTitle>
                    <EmptyDescription>No data found</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <NuxtLink
                        to="/dashboard/locations"
                        :class="buttonVariants({ variant: 'outline' })"
                    >
                        Back To Location
                    </NuxtLink>
                </EmptyContent>
            </Empty>
        </div>
    </div>
</template>

<style scoped lang="scss"></style>
