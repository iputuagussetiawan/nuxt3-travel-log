<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const scrollToFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
}
</script>
<template>
    <section
        class="relative z-10 flex h-screen flex-col items-center justify-center px-4"
    >
        <!-- Overlay gradient -->
        <div
            class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60"
        />

        <!-- Hero content -->
        <div class="relative z-10 max-w-3xl text-center">
            <div
                class="mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 backdrop-blur-sm"
            >
                <Icon
                    icon="lucide:map-pin"
                    class="h-3.5 w-3.5 text-emerald-400"
                />
                <span
                    class="text-xs font-medium tracking-wide text-white/80 uppercase"
                    >Your personal travel journal</span
                >
            </div>

            <h1
                class="mb-6 text-5xl leading-[1.1] font-bold tracking-tight text-white drop-shadow-lg sm:text-6xl lg:text-7xl"
            >
                Discover The World,<br />
                <span class="text-emerald-400">One Journey</span> At a Time
            </h1>

            <p
                class="mx-auto mb-10 max-w-xl text-base leading-relaxed text-white/70 sm:text-lg lg:text-xl"
            >
                Pin your memories on the map, log your adventures, and revisit
                every place that took your breath away.
            </p>

            <div class="flex flex-wrap items-center justify-center gap-4">
                <NuxtLink
                    to="/dashboard/locations"
                    class="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/30 transition-all hover:-translate-y-0.5 hover:bg-emerald-400 hover:shadow-emerald-400/40"
                >
                    <Icon icon="lucide:map" class="h-4 w-4" />
                    Start Logging
                </NuxtLink>
                <button
                    class="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:bg-white/20"
                    @click="scrollToFeatures"
                >
                    Learn More
                    <Icon icon="lucide:chevron-down" class="h-4 w-4" />
                </button>
            </div>
        </div>

        <!-- Scroll indicator -->
        <button
            class="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-1 text-white/50 transition-colors hover:text-white/80"
            @click="scrollToFeatures"
        >
            <span class="text-[11px] tracking-widest uppercase">Scroll</span>
            <Icon icon="lucide:chevrons-down" class="h-4 w-4 animate-bounce" />
        </button>
    </section>
</template>
<style lang="scss" scoped></style>
