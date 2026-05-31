<script setup lang="ts">
import type { RegionPoint } from '~/server/api/admin/access-map.get'

const props = defineProps<{ points: RegionPoint[] }>()

const colorMode = useColorMode()
const lightMap = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const darkMap = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
const mapUrl = computed(() => (colorMode.value === 'dark' ? darkMap : lightMap))

const mapRef = ref(null)

onMounted(async () => {
    await nextTick()
    setTimeout(() => {
        const leafletMap = (mapRef.value as any)?.leafletObject
        if (!leafletMap) return

        // Fix pane z-indices so markers render above dashboard UI layers
        const panes = leafletMap.getPanes()
        if (panes.overlayPane) panes.overlayPane.style.zIndex = '1000'
        if (panes.markerPane) panes.markerPane.style.zIndex = '1100'
        if (panes.tooltipPane) panes.tooltipPane.style.zIndex = '1200'
        if (panes.popupPane) panes.popupPane.style.zIndex = '1300'

        // Fit to Indonesia bounds
        leafletMap.fitBounds(
            [
                [-11, 95],
                [6, 141]
            ],
            { padding: [20, 20] }
        )
    }, 400)
})

// Circle radius scales with session count
function radius(count: number) {
    return Math.min(8 + Math.sqrt(count) * 4, 40)
}

// Color based on user count
function color(userCount: number) {
    if (userCount >= 4) return '#6366f1' // indigo — many users
    if (userCount >= 2) return '#10b981' // emerald — some
    return '#f59e0b' // amber — single
}
</script>

<template>
    <LMap
        ref="mapRef"
        style="height: calc(100vh - 64px); width: 100%"
        :zoom="2"
        :center="[20, 10]"
        :options="{
            zoomControl: true,
            scrollWheelZoom: false,
            worldCopyJump: false,
            maxBoundsViscosity: 1.0
        }"
        :max-bounds="[
            [-90, -180],
            [90, 180]
        ]"
        :min-zoom="2"
        :max-zoom="18"
        :use-global-leaflet="false"
    >
        <LTileLayer :url="mapUrl" attribution="&copy; OpenStreetMap contributors" />

        <LCircleMarker
            v-for="p in points"
            :key="p.regionKey"
            :lat-lng="[p.lat, p.lng]"
            :radius="radius(p.sessionCount)"
            :color="color(p.userCount)"
            :fill-color="color(p.userCount)"
            :fill-opacity="0.65"
            :weight="2"
        >
            <LTooltip :options="{ permanent: false, direction: 'top' }">
                <div style="min-width: 160px; font-family: sans-serif">
                    <!-- Region header -->
                    <div style="font-weight: 700; font-size: 13px; margin-bottom: 4px">
                        {{ p.state }}
                    </div>
                    <div style="font-size: 11px; color: #6b7280; margin-bottom: 8px">
                        {{ p.country }}
                    </div>

                    <!-- Stats -->
                    <div style="display: flex; gap: 12px; margin-bottom: 8px">
                        <div style="text-align: center">
                            <div style="font-size: 16px; font-weight: 700; color: #6366f1">
                                {{ p.userCount }}
                            </div>
                            <div style="font-size: 10px; color: #9ca3af">users</div>
                        </div>
                        <div style="text-align: center">
                            <div style="font-size: 16px; font-weight: 700; color: #10b981">
                                {{ p.sessionCount }}
                            </div>
                            <div style="font-size: 10px; color: #9ca3af">sessions</div>
                        </div>
                    </div>

                    <!-- User list -->
                    <div style="border-top: 1px solid #e5e7eb; padding-top: 6px">
                        <div
                            v-for="u in p.users"
                            :key="u.name"
                            style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px"
                        >
                            <img
                                v-if="u.image"
                                :src="u.image"
                                :alt="u.name"
                                style="
                                    width: 18px;
                                    height: 18px;
                                    border-radius: 50%;
                                    object-fit: cover;
                                "
                            />
                            <div
                                v-else
                                style="
                                    width: 18px;
                                    height: 18px;
                                    border-radius: 50%;
                                    background: #e5e7eb;
                                    display: flex;
                                    align-items: center;
                                    justify-content: center;
                                    font-size: 9px;
                                    font-weight: 700;
                                    color: #6b7280;
                                    text-transform: uppercase;
                                "
                            >
                                {{ u.name.slice(0, 2) }}
                            </div>
                            <span style="font-size: 11px; color: #374151">{{ u.name }}</span>
                        </div>
                        <div
                            v-if="p.userCount > p.users.length"
                            style="font-size: 10px; color: #9ca3af; margin-top: 2px"
                        >
                            +{{ p.userCount - p.users.length }} more
                        </div>
                    </div>
                </div>
            </LTooltip>
        </LCircleMarker>
    </LMap>
</template>

<style>
/* Ensure Leaflet panes are not clipped by parent stacking contexts */
.leaflet-pane {
    z-index: auto !important;
}
.leaflet-overlay-pane {
    z-index: 1000 !important;
}
.leaflet-marker-pane {
    z-index: 1100 !important;
}
.leaflet-tooltip-pane {
    z-index: 1200 !important;
}
.leaflet-popup-pane {
    z-index: 1300 !important;
}
</style>
