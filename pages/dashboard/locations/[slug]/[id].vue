<script setup lang="ts">
import { useRoute } from 'vue-router'

definePageMeta({
    layout: 'dashboard-location'
})

const route = useRoute()

const slug = route.params.slug as string
const id = route.params.id as string

console.log('Slug:', slug)
console.log('ID:', id)
</script>

<template>
    <div class="p-6">
        <h1 class="text-xl font-bold">Location Detail Page</h1>
        <p><strong>Slug:</strong> {{ slug }}</p>
        <p><strong>ID:</strong> {{ id }}</p>
    </div>
</template>
