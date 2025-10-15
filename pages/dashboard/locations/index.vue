<script setup lang='ts' >
//1.modules import
import { buttonVariants } from '@/components/ui/button'
import {
    ArrowUpRightIcon,
    LucideCirclePlus,
    MapPin
} from 'lucide-vue-next'
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
    <section>
        <div class="mt-4 px-4">
            <div
                
                class="flex justify-between items-center"
            >
                <div>
                    <h1 class="text-lg font-bold">List Location</h1>
                    <p class="text-sm text-muted-foreground">
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
                        <LucideCirclePlus class="w-4 h-4" />
                    </NuxtLink>
                </div>
            </div>
            <div
                v-if="status === 'pending'"
                class="grid grid-cols-6 gap-4 mt-6"
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
                class="grid grid-cols-6 gap-4 mt-6"
            >
                <Card
                    v-for="location in locations"
                    :key="location.id"
                    class="bg-primary/10 hover:bg-primary/20 cursor-pointer transition-all duration-400 ease-in-out"
                    
                >
                    <CardHeader>
                        <CardTitle>{{ location.name }}</CardTitle>
                        <CardDescription>
                            {{ location.description }}
                        </CardDescription>
                    </CardHeader>
                </Card>
            </div>
            <div  v-else  class="w-full">
                <Empty>
                    <EmptyHeader>
                        <EmptyMedia variant="icon">
                            <MapPin class="w-10 h-10 text-muted-foreground" />
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
                                :class="cn(buttonVariants({ variant: 'default' }), 'gap-2')"
                            >
                                Create Location
                            </NuxtLink>
                        </div>
                    </EmptyContent>
                    <NuxtLink to="/dashboard">
                        Learn more about managing locations
                        <ArrowUpRightIcon class="w-4 h-4 ml-1 inline" />
                    </NuxtLink>
                </Empty>
            </div>
        </div>
    </section>
</template>
<style lang='scss' scoped>
</style>