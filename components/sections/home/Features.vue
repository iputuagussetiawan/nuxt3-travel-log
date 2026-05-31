<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const features = [
    {
        icon: 'lucide:map-pin',
        title: 'Pin Your Places',
        description:
            'Drop pins anywhere on the globe. Every place you have visited, mapped and saved forever.',
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10'
    },
    {
        icon: 'lucide:notebook-pen',
        title: 'Log Your Stories',
        description:
            'Write journal entries, attach photos, and capture the feelings behind every destination.',
        color: 'text-sky-400',
        bg: 'bg-sky-500/10'
    },
    {
        icon: 'lucide:globe',
        title: 'Interactive Map',
        description:
            'See your entire travel history on a beautiful interactive world map at a glance.',
        color: 'text-violet-400',
        bg: 'bg-violet-500/10'
    },
    {
        icon: 'lucide:share-2',
        title: 'Share Your Journey',
        description:
            'Invite friends and family to follow your adventures and inspire others to explore.',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10'
    }
]
</script>
<template>
    <section id="features" class="relative z-10 px-4 py-24">
        <!-- Glass backdrop -->
        <div class="absolute inset-0 bg-black/50 backdrop-blur-sm" />

        <div class="relative container mx-auto max-w-5xl">
            <div class="mb-16 text-center">
                <p class="mb-3 text-sm font-medium tracking-widest text-emerald-400 uppercase">
                    Features
                </p>
                <h2 class="text-3xl font-bold text-white sm:text-4xl">
                    Everything you need to<br class="hidden sm:block" />
                    track your travels
                </h2>
            </div>

            <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <div
                    v-for="feature in features"
                    :key="feature.title"
                    class="group rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                >
                    <div :class="[feature.bg, 'mb-4 inline-flex rounded-xl p-3']">
                        <Icon :icon="feature.icon" :class="[feature.color, 'h-5 w-5']" />
                    </div>
                    <h3 class="mb-2 text-base font-semibold text-white">
                        {{ feature.title }}
                    </h3>
                    <p class="text-sm leading-relaxed text-white/60">
                        {{ feature.description }}
                    </p>
                </div>
            </div>

            <!-- Stats row -->
            <div class="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-12">
                <div class="text-center">
                    <p class="text-3xl font-bold text-white">195+</p>
                    <p class="mt-1 text-sm text-white/50">Countries to explore</p>
                </div>
                <div class="text-center">
                    <p class="text-3xl font-bold text-white">∞</p>
                    <p class="mt-1 text-sm text-white/50">Memories to log</p>
                </div>
                <div class="text-center">
                    <p class="text-3xl font-bold text-white">1</p>
                    <p class="mt-1 text-sm text-white/50">Map for your life</p>
                </div>
            </div>
        </div>
    </section>
</template>
<style lang="scss" scoped></style>
