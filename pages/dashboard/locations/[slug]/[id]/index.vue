<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'
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
import { EllipsisVertical } from 'lucide-vue-next'
import CustomAlertDialog from '~/components/CustomAlertDialog.vue'
import type { FetchError } from 'ofetch'

definePageMeta({ layout: 'dashboard-location' })

const route = useRoute()
const { slug } = route.params
const locationStore = useLocationsStore()
const {
    currentLocationLog: locationLog,
    currentLocationLogStatus: status,
    currentLocationLogError: error
} = storeToRefs(locationStore)

useSeoMeta({
    title: computed(() => locationLog.value?.name ?? 'Location Log'),
    description: computed(() => locationLog.value?.description ?? 'View this travel log entry.'),
    ogTitle: computed(() => `${locationLog.value?.name ?? 'Log'} · Travel Log`)
})

const isDeleteDialogOpen = ref(false)
const isDeleting = ref(false)
const deleteError = ref('')

const loading = computed(() => isDeleting.value || status.value === 'pending')
const errorMessage = computed(() => deleteError.value || error.value?.statusMessage)

onMounted(() => {
    setTimeout(() => {
        locationStore.refreshCurrentLocationLog()
    }, 3000) // 3000ms = 3 seconds
})

onBeforeRouteUpdate((to) => {
    if (to.name == 'dashboard-locations-slug-id') {
        locationStore.refreshCurrentLocationLog()
    }
})

async function handleContinueDelete() {
    try {
        deleteError.value = ''
        isDeleting.value = true
        await $fetch(`/api/locations/${route.params.slug}/${route.params.id}`, {
            method: 'DELETE'
        })
        navigateTo({
            name: 'dashboard-locations-slug',
            params: {
                slug: route.params.slug
            }
        })
    } catch (e) {
        const error = e as FetchError
    } finally {
        isDeleting.value = false
        isDeleteDialogOpen.value = false // optionally close the dialog
    }
}

const handleDeleteLocation = () => {
    isDeleteDialogOpen.value = true
}
</script>

<template>
    <section class="absolute top-0 right-0 left-0 z-[1000]">
        <div class="mt-4 px-4">
            <div v-if="locationLog && status !== 'pending'">
                <div class="relative flex items-center justify-between">
                    <h1 class="text-xl font-bold">Location Name : {{ locationLog.name }}</h1>

                    <ClientOnly>
                        <DropdownMenu>
                            <DropdownMenuTrigger class="cursor-pointer">
                                <EllipsisVertical class="h-5 w-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" class="z-[2000]">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <NuxtLink :to="`/dashboard/locations/${route.params.slug}/add`">
                                        <Icon icon="lucide:plus" class="ml-2 inline" />
                                        Add
                                    </NuxtLink>
                                </DropdownMenuItem>
                                <DropdownMenuItem @click="handleDeleteLocation">
                                    <Icon icon="lucide:trash" class="ml-2 inline" />
                                    Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <NuxtLink
                                        :to="`/dashboard/locations/${route.params.slug}/${locationLog.id}/edit`"
                                    >
                                        <Icon icon="lucide:edit" class="ml-2 inline" />
                                        Edit
                                    </NuxtLink>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </ClientOnly>
                </div>
                <h2>{{ locationLog.description }}</h2>
                <p>{{ locationLog.lat }}, {{ locationLog.long }}</p>
                <p>Start At : {{ locationLog.startedAt }}</p>
                <p>Ended At : {{ locationLog.endedAt }}</p>
            </div>
        </div>

        <CustomAlertDialog
            title="Are you sure want to delete?"
            description="Deleting this location will remove your data permanently"
            confirm-label="Yes, delete this location"
            v-model:open="isDeleteDialogOpen"
            @confirm="handleContinueDelete"
        />
    </section>
</template>
