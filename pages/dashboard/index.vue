<script setup lang="ts">
import { Icon } from '@iconify/vue'
import BarChart from '~/components/ui/chart-bar/BarChart.vue'
import DonutChart from '~/components/ui/chart-donut/DonutChart.vue'

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
    title: 'Dashboard',
    description: 'Overview of your travel logs, locations and analytics.'
})

const authStore = useAuthStore()
const locationsStore = useLocationsStore()
const { locations, locationsStatus } = storeToRefs(locationsStore)

const loading = computed(() => locationsStatus.value === 'pending')

// ── Stats ────────────────────────────────────────────────────
const totalLocations = computed(() => locations.value?.length ?? 0)
const totalLogs = computed(
    () => locations.value?.reduce((s, l) => s + (l.locationLogs?.length ?? 0), 0) ?? 0
)

const stats = computed(() => [
    {
        label: 'Total Locations',
        value: totalLocations.value,
        icon: 'lucide:map-pin',
        color: 'text-emerald-500',
        bg: 'bg-emerald-500/10',
        to: '/dashboard/locations'
    },
    {
        label: 'Total Logs',
        value: totalLogs.value,
        icon: 'lucide:notebook-pen',
        color: 'text-violet-500',
        bg: 'bg-violet-500/10',
        to: '/dashboard/locations'
    },
    {
        label: 'Avg Logs / Loc',
        value: totalLocations.value ? (totalLogs.value / totalLocations.value).toFixed(1) : '—',
        icon: 'lucide:bar-chart-2',
        color: 'text-sky-500',
        bg: 'bg-sky-500/10',
        to: '/dashboard/locations'
    }
])

// ── Chart data ───────────────────────────────────────────────
// Bar: logs per location (top 8)
const barData = computed(() =>
    [...(locations.value ?? [])]
        .sort((a, b) => (b.locationLogs?.length ?? 0) - (a.locationLogs?.length ?? 0))
        .slice(0, 8)
        .map((l) => ({
            name: l.name.length > 12 ? l.name.slice(0, 12) + '…' : l.name,
            Logs: l.locationLogs?.length ?? 0
        }))
)

// Donut: distribution buckets
const donutData = computed(() => {
    const none = locations.value?.filter((l) => (l.locationLogs?.length ?? 0) === 0).length ?? 0
    const few =
        locations.value?.filter((l) => {
            const n = l.locationLogs?.length ?? 0
            return n >= 1 && n <= 3
        }).length ?? 0
    const many = locations.value?.filter((l) => (l.locationLogs?.length ?? 0) > 3).length ?? 0
    return [
        { name: 'No logs', value: none },
        { name: '1–3 logs', value: few },
        { name: '4+ logs', value: many }
    ].filter((d) => d.value > 0)
})

// ── Recent locations ─────────────────────────────────────────
const recentLocations = computed(() => [...(locations.value ?? [])].slice(0, 5))

// ── Greeting ─────────────────────────────────────────────────
const greeting = computed(() => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 18) return 'Good afternoon'
    return 'Good evening'
})

// ── Access map (admin only) ───────────────────────────────────
import type { RegionPoint } from '~/server/api/admin/access-map.get'
const { data: accessPoints, status: mapStatus } = authStore.isAdmin
    ? await useFetch<RegionPoint[]>('/api/admin/access-map')
    : { data: ref(null), status: ref('idle') }

onMounted(() => {
    if (!locations.value?.length) locationsStore.refreshLocations()
})
</script>

<template>
    <section class="space-y-8 p-6">
        <!-- Greeting -->
        <div>
            <p class="text-muted-foreground text-sm">{{ greeting }},</p>
            <h1 class="text-2xl font-bold">{{ authStore.user?.name ?? 'Traveller' }} 👋</h1>
            <p class="text-muted-foreground mt-1 text-sm">
                Here's an overview of your travel journey.
            </p>
        </div>

        <!-- Stat cards -->
        <div class="grid gap-4 sm:grid-cols-3">
            <NuxtLink
                v-for="stat in stats"
                :key="stat.label"
                :to="stat.to"
                class="border-border bg-card hover:bg-accent/40 flex items-center gap-4 rounded-2xl border p-5 transition-all"
            >
                <div
                    :class="[
                        stat.bg,
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl'
                    ]"
                >
                    <Icon :icon="stat.icon" :class="[stat.color, 'h-5 w-5']" />
                </div>
                <div>
                    <p class="text-muted-foreground text-xs">
                        {{ stat.label }}
                    </p>
                    <p class="mt-0.5 text-2xl leading-none font-bold">
                        <span
                            v-if="loading"
                            class="bg-muted inline-block h-6 w-10 animate-pulse rounded"
                        />
                        <span v-else>{{ stat.value }}</span>
                    </p>
                </div>
            </NuxtLink>
        </div>

        <!-- Charts row -->
        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Bar chart: logs per location -->
            <div class="border-border bg-card rounded-2xl border p-5 lg:col-span-2">
                <h2 class="mb-1 text-sm font-semibold">Logs per Location</h2>
                <p class="text-muted-foreground mb-4 text-xs">Top 8 locations by log count</p>
                <div v-if="loading" class="bg-muted h-[220px] animate-pulse rounded-xl" />
                <div v-else-if="!barData.length" class="flex h-[220px] items-center justify-center">
                    <p class="text-muted-foreground text-sm">No data yet</p>
                </div>
                <ClientOnly v-else>
                    <BarChart
                        :data="barData"
                        index="name"
                        :categories="['Logs']"
                        :rounded-corners="4"
                        :show-legend="false"
                        :colors="['#8b5cf6']"
                        class="h-[220px]"
                    />
                </ClientOnly>
            </div>

            <!-- Donut chart: log distribution -->
            <div class="border-border bg-card rounded-2xl border p-5">
                <h2 class="mb-1 text-sm font-semibold">Log Distribution</h2>
                <p class="text-muted-foreground mb-4 text-xs">Locations by log count</p>
                <div v-if="loading" class="bg-muted h-[220px] animate-pulse rounded-xl" />
                <div
                    v-else-if="!donutData.length"
                    class="flex h-[220px] items-center justify-center"
                >
                    <p class="text-muted-foreground text-sm">No data yet</p>
                </div>
                <ClientOnly v-else>
                    <DonutChart
                        :data="donutData"
                        index="name"
                        category="value"
                        :colors="['#e5e7eb', '#6366f1', '#10b981']"
                        class="h-[220px]"
                    />
                </ClientOnly>
            </div>
        </div>

        <!-- Quick actions + Recent locations -->
        <div class="grid gap-6 lg:grid-cols-3">
            <!-- Quick actions -->
            <div class="border-border bg-card rounded-2xl border p-5">
                <h2 class="mb-4 text-sm font-semibold">Quick Actions</h2>
                <div class="space-y-2">
                    <NuxtLink
                        to="/dashboard/locations/add"
                        class="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors"
                    >
                        <Icon icon="lucide:plus" class="h-4 w-4" />
                        Add Location
                    </NuxtLink>
                    <NuxtLink
                        to="/dashboard/locations"
                        class="border-border hover:bg-accent flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
                    >
                        <Icon icon="lucide:map" class="h-4 w-4" />
                        View Map
                    </NuxtLink>
                    <NuxtLink
                        to="/dashboard/profile"
                        class="border-border hover:bg-accent flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors"
                    >
                        <Icon icon="lucide:user" class="h-4 w-4" />
                        Profile
                    </NuxtLink>
                </div>
            </div>

            <!-- Recent locations -->
            <div class="border-border bg-card rounded-2xl border p-5 lg:col-span-2">
                <div class="mb-4 flex items-center justify-between">
                    <h2 class="text-sm font-semibold">Recent Locations</h2>
                    <NuxtLink
                        to="/dashboard/locations"
                        class="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs transition-colors"
                    >
                        View all
                        <Icon icon="lucide:arrow-right" class="h-3 w-3" />
                    </NuxtLink>
                </div>

                <div v-if="loading" class="space-y-2">
                    <div v-for="i in 4" :key="i" class="bg-muted h-14 animate-pulse rounded-xl" />
                </div>

                <div
                    v-else-if="!recentLocations.length"
                    class="border-border rounded-xl border border-dashed p-6 text-center"
                >
                    <Icon
                        icon="lucide:map-pin"
                        class="text-muted-foreground/40 mx-auto mb-2 h-7 w-7"
                    />
                    <p class="text-muted-foreground text-sm">No locations yet.</p>
                    <NuxtLink
                        to="/dashboard/locations/add"
                        class="text-primary mt-1 inline-block text-xs underline-offset-4 hover:underline"
                    >
                        Add your first location
                    </NuxtLink>
                </div>

                <ul v-else class="space-y-2">
                    <li v-for="loc in recentLocations" :key="loc.id">
                        <NuxtLink
                            :to="`/dashboard/locations/${loc.slug}`"
                            class="border-border hover:bg-accent flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors"
                        >
                            <div
                                class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10"
                            >
                                <Icon icon="lucide:map-pin" class="h-4 w-4 text-emerald-500" />
                            </div>
                            <div class="min-w-0 flex-1">
                                <p class="truncate text-sm font-medium">
                                    {{ loc.name }}
                                </p>
                                <p class="text-muted-foreground truncate text-xs">
                                    {{ loc.description ?? `${loc.lat}, ${loc.long}` }}
                                </p>
                            </div>
                            <span class="text-muted-foreground shrink-0 text-xs tabular-nums">
                                {{ loc.locationLogs?.length ?? 0 }} log{{
                                    (loc.locationLogs?.length ?? 0) !== 1 ? 's' : ''
                                }}
                            </span>
                            <Icon
                                icon="lucide:chevron-right"
                                class="text-muted-foreground/50 h-4 w-4 shrink-0"
                            />
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>

        <!-- Access Map (admin only) -->
        <div
            v-if="authStore.isAdmin"
            class="border-border bg-card overflow-hidden rounded-2xl border"
        >
            <div class="border-border flex items-center justify-between border-b px-5 py-4">
                <div>
                    <h2 class="text-sm font-semibold">Session Access Map</h2>
                    <p class="text-muted-foreground mt-0.5 text-xs">
                        Geographic distribution of active sessions
                    </p>
                </div>
                <div class="flex items-center gap-2">
                    <span class="h-2 w-2 rounded-full bg-indigo-500" />
                    <span class="text-muted-foreground text-xs">
                        {{ accessPoints?.length ?? 0 }} region{{
                            (accessPoints?.length ?? 0) !== 1 ? 's' : ''
                        }}
                    </span>
                </div>
            </div>
            <div
                v-if="mapStatus === 'pending'"
                class="flex h-[calc(100vh-64px)] items-center justify-center"
            >
                <Icon icon="lucide:loader-2" class="text-muted-foreground h-5 w-5 animate-spin" />
            </div>
            <div
                v-else-if="!accessPoints?.length"
                class="flex h-[calc(100vh-64px)] flex-col items-center justify-center gap-2"
            >
                <Icon icon="lucide:map-off" class="text-muted-foreground/40 h-10 w-10" />
                <p class="text-muted-foreground text-sm">No session location data</p>
                <p class="text-muted-foreground/50 text-xs">Sessions from localhost are excluded</p>
            </div>
            <div v-else class="h-[calc(100vh-64px)]">
                <ClientOnly>
                    <AdminAccessMap :points="accessPoints" />
                </ClientOnly>
            </div>
        </div>
    </section>
</template>
