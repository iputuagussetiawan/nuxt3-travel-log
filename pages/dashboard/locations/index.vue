<script setup lang="ts">
//1.modules import
import { buttonVariants } from '@/components/ui/button'
import { ArrowUpRightIcon, LucideCirclePlus, MapPin } from 'lucide-vue-next'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from '~/components/ui/card'

import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle
} from '@/components/ui/empty'

import { cn } from '~/lib/utils'
import { Skeleton } from '~/components/ui/skeleton'
import MapClientClient from '~/components/MapClient.client.vue'

const locationsStore = useLocationsStore()
const { locations, status } = storeToRefs(locationsStore)

//2.modules init
definePageMeta({
    layout: 'dashboard-location'
})

onMounted(() => {
    locationsStore.refresh()
})
</script>
<template>
    <section class="absolute top-0 right-0 left-10 z-[1000]">
        <div class="mt-4 px-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-lg font-bold">List Location</h1>
                    <p class="text-muted-foreground text-sm">
                        List of all locations here
                    </p>
                </div>
                <div class="flex gap-2">
                    <NuxtLink
                        to="/dashboard/locations/add"
                        :class="
                            cn(buttonVariants({ variant: 'default' }), 'gap-2')
                        "
                    >
                        Add Location
                        <LucideCirclePlus class="h-4 w-4" />
                    </NuxtLink>
                </div>
            </div>
            <div
                v-if="status === 'pending'"
                class="mt-6 grid grid-cols-6 gap-4"
            >
                <Card v-for="i in 12" :key="i">
                    <CardHeader>
                        <CardTitle>
                            <Skeleton class="h-2 w-1/2" />
                        </CardTitle>
                        <CardDescription class="space-y-1">
                            <Skeleton class="h-2 w-full" />
                            <Skeleton class="h-2 w-1/2" />
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
            <div
                v-else-if="locations && locations.length > 0"
                class="mt-6 grid grid-cols-6 gap-4"
            >
                <Card
                    v-for="location in locations"
                    :key="location.id"
                    class="border-border bg-card/90 supports-[backdrop-filter]:bg-card/60 cursor-pointer rounded-2xl border shadow-md backdrop-blur-md transition-all duration-400 ease-in-out hover:border-blue-500 dark:shadow-lg"
                >
                    <CardHeader>
                        <CardTitle class="text-muted-foreground">{{
                            location.name
                        }}</CardTitle>
                        <CardDescription class="text-muted-foreground">
                            {{ location.description }}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
            <div v-else class="w-full">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <MapPin class="text-muted-foreground h-10 w-10" />
                        </EmptyMedia>

                        <EmptyTitle>No Locations Found</EmptyTitle>
                        <EmptyDescription>
                            You haven't added any locations yet. Start by
                            creating your first one to begin tracking and
                            managing your data.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <div class="flex gap-2">
                            <NuxtLink
                                to="/dashboard/locations/add"
                                :class="
                                    cn(
                                        buttonVariants({ variant: 'default' }),
                                        'gap-2'
                                    )
                                "
                            >
                                Create Location
                            </NuxtLink>
                        </div>
                    </EmptyContent>
                    <NuxtLink to="/dashboard">
                        Learn more about managing locations
                        <ArrowUpRightIcon class="ml-1 inline h-4 w-4" />
                    </NuxtLink>
                </Empty>
            </div>
        </div>
    </section>
</template>
<style lang="scss" scoped></style>
