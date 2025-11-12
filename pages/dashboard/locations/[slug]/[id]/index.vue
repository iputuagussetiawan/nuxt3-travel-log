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

definePageMeta({
    layout: 'dashboard-location'
})

const route = useRoute()
const locationStore = useLocationsStore()
const {
    currentLocationLog: locationLog,
    currentLocationLogStatus: status,
    currentLocationLogError: error
} = storeToRefs(locationStore)

const loading = computed(() => status.value === 'pending')
const errorMessage = computed(() => error.value?.statusMessage)

const slug = route.params.slug as string
const id = route.params.id as string

console.log('Slug:', slug)
console.log('ID:', id)

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
</script>

<template>
    <section class="absolute top-0 right-0 left-0 z-[1000]">
        <div class="mt-4 px-4">
            <div v-if="locationLog && status !== 'pending'">
                <div class="relative flex items-center justify-between">
                    <h1 class="text-xl font-bold">
                        Location Name : {{ locationLog.name }}
                    </h1>

                    <ClientOnly>
                        <DropdownMenu>
                            <DropdownMenuTrigger class="cursor-pointer">
                                <EllipsisVertical class="h-5 w-5" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" class="z-[2000]">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem asChild>
                                    <NuxtLink
                                        :to="`/dashboard/locations/${route.params.slug}/add`"
                                    >
                                        <Icon
                                            icon="lucide:plus"
                                            class="ml-2 inline"
                                        />
                                        Add
                                    </NuxtLink>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Icon
                                        icon="lucide:trash"
                                        class="ml-2 inline"
                                    />
                                    Delete
                                </DropdownMenuItem>
                                <DropdownMenuItem asChild>
                                    <NuxtLink
                                        :to="`/dashboard/locations/${locationLog.slug}/${locationLog.id}/edit`"
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
                <h2>{{ locationLog.description }}</h2>
                <p>{{ locationLog.lat }}, {{ locationLog.long }}</p>
                <p>Start At : {{ locationLog.startedAt }}</p>
                <p>Ended At : {{ locationLog.endedAt }}</p>
            </div>
        </div>
    </section>
</template>
