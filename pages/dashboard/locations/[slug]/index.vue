<script setup lang="ts">
import {
    FolderOpen,
    Cloud,
    CirclePlus,
    EllipsisVertical
} from 'lucide-vue-next'
import { Button, buttonVariants } from '@/components/ui/button'
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/empty'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'

import { Icon } from '@iconify/vue'
import { ref } from 'vue'
import CustomAlertDialog from '~/components/ui/CustomAlertDialog.vue'
import type { FetchError } from 'ofetch'

definePageMeta({
    layout: 'dashboard-location'
})
const route = useRoute()
const { slug } = route.params
const mapStore = useMapStore()
const locationStore = useLocationsStore()
const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref('')

const loading = computed(() => status.value === 'pending' || isDeleting.value)

const {
    data: location,
    status,
    error
} = await useFetch(`/api/locations/${slug}`, {
    lazy: true
})

const handleDeleteLocation = () => {
    isDeleteDialogOpen.value = true
}

async function handleContinueDelete() {
    try {
        deleteError.value = ''
        isDeleting.value = true
        await $fetch(`/api/locations/${slug}`, {
            method: 'DELETE'
        })
        navigateTo('/dashboard/locations')
    } catch (e) {
        const error = e as FetchError
    } finally {
        isDeleting.value = false
        isDeleteDialogOpen.value = false // optionally close the dialog
    }
}

watch(location, (val) => {
    if (val && val.lat && val.long) {
        mapStore.flyToMarker(
            { lat: String(val.lat), long: String(val.long) },
            10
        )
    }
})

onMounted(() => {
    setTimeout(() => {
        locationStore.refreshCurrentLocation()
    }, 3000) // 3000ms = 3 seconds
})

onBeforeRouteUpdate((to) => {
    if (to.name == 'dashboard-locations-slug') {
        locationStore.refreshCurrentLocation()
    }
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
            <div class="relative flex items-center justify-between">
                <h1 class="text-xl font-bold">
                    Location Name : {{ location.name }}
                </h1>

                <ClientOnly>
                    <DropdownMenu>
                        <DropdownMenuTrigger class="cursor-pointer">
                            <EllipsisVertical class="h-5 w-5" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" class="z-[2000]">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem @click="handleDeleteLocation">
                                <Icon icon="lucide:trash" class="ml-2 inline" />
                                Delete
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <NuxtLink
                                    :to="`/dashboard/locations/${location.slug}/edit`"
                                >
                                    <Icon
                                        icon="lucide:edit"
                                        class="ml-2 inline"
                                    />
                                    Edit
                                </NuxtLink>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </ClientOnly>
            </div>
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
                        :to="{
                            name: 'dashboard-locations-slug-add',
                            params: { slug: location.slug }
                        }"
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

        <CustomAlertDialog
            title="Are you sure want to delete?"
            description="Deleting this location will delete all location logs as well"
            confirm-label="Yes, delete this location"
            v-model:open="isDeleteDialogOpen"
            @confirm="handleContinueDelete"
        />
    </div>
</template>

<style scoped lang="scss"></style>
