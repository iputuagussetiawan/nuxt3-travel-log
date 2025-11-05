<script setup lang="ts">
import LocationLogForm from '~/components/LocationLogForm.vue'

definePageMeta({
    layout: 'dashboard-location'
})
</script>
<template>
    <div
        class="border-border bg-card/90 supports-[backdrop-filter]:bg-card/60 absolute top-0 left-4 z-[2000] mt-4 w-[400px] rounded-2xl border px-6 py-8 shadow-md backdrop-blur-md dark:shadow-lg"
    >
        <div>
            <h1 class="text-lg font-bold">Add Location Log</h1>
            <p class="text-muted-foreground text-sm">
                Add a new location log here
            </p>
        </div>
        <LocationLogForm
            submit-label="Add Location Log"
            submit-icon="add-location-icon"
        />
    </div>
</template>
<style lang="scss" scoped></style>
