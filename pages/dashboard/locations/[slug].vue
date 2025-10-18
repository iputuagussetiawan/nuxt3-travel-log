<script setup lang="ts">
import { FolderOpen } from 'lucide-vue-next'
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
    layout: 'dashboard'
})
const route = useRoute()
const { slug } = route.params
const {
    data: location,
    status,
    error
} = await useFetch(`/api/locations/${slug}`, {
    lazy: true
})
</script>

<template>
    <div class="p-4">
        <!-- Loading -->
        <div v-if="status === 'pending'">...Loading</div>
        <!-- Success -->
        <div v-if="location && status !== 'pending'">
            <h1 class="text-xl font-bold">
                Location Name : {{ location.name }}
            </h1>
            <h2>{{ location.description }}</h2>
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
