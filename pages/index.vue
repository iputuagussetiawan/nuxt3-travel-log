<script lang="ts" setup>
import Banner from '../components/sections/home/Banner.vue'
import Features from '../components/sections/home/Features.vue'

useSeoMeta({
    title: 'Discover The World, One Journey At a Time',
    description:
        'Pin your memories on the map, log your adventures, and revisit every place that took your breath away.',
    ogTitle: 'Travel Log — Discover The World',
    ogDescription:
        'Pin your memories on the map, log your adventures, and revisit every place that took your breath away.'
})
</script>
<template>
    <Banner />
    <Features />
</template>
