<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useRoute } from 'vue-router'

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
</script>

<template>
    <section class="">
        <div class="mt-4 px-4">
            <div>
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
                                        :to="`/dashboard/locations/${locationLog.slug}/edit`"
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
            </div>

            <!-- Error -->
            <div>
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

            <!-- <CustomAlertDialog
                title="Are you sure want to delete?"
                description="Deleting this location will delete all location logs as well"
                confirm-label="Yes, delete this location"
                v-model:open="isDeleteDialogOpen"
                @confirm="handleContinueDelete"
            /> -->
        </div>
    </section>
</template>
