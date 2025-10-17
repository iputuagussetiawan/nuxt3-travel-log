<script setup>
import { ref } from 'vue'
import { MAP_CENTER, MAP_BOUNDS } from '~/lib/constants'
import MapPinMarker from './MapPinMarker.vue'
const map = ref(null)

// 🌗 Light & Dark Map
const colorMode = useColorMode()
const lightMap = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const darkMap = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

const mapStore = useMapStore()
const mapStoreTwo = useMapStoreTwo()
const mapUrl = computed(() =>
    colorMode.preference === 'dark' ? darkMap : lightMap
)

// 🗺️ Fit map to all markers
const fitToMarkers = async () => {
    const L = await import('leaflet')
    const leafletMap = map.value?.leafletObject
    const points = mapStore.mapPoints
    if (!leafletMap || !points.length) return
    const bounds = L.latLngBounds(
        mapStore.mapPoints.map((p) => [Number(p.lat), Number(p.long)])
    )
    leafletMap.fitBounds([bounds._northEast, bounds._southWest], {
        padding: [50, 50]
    })
}
const setMapOnStore = async () => {
    const leafletMap = map.value?.leafletObject
    if (leafletMap) {
        // vue-leaflet exposes the map under .leafletObject
        mapStoreTwo.setMap(leafletMap)
    }
}
// 🚀 When map is ready
onMounted(async () => {
    await nextTick()
    setTimeout(() => {
        setMapOnStore()
        fitToMarkers()
    }, 500)
})

// 🔁 Automatically refit when markers change
watch(
    () => mapStore.mapPoints,
    (newPoints) => {
        if (newPoints.length) {
            nextTick(() => fitToMarkers())
        }
    },
    { deep: true }
)
</script>

<template>
    <div style="height: 100vh; width: 100%">
        <LMap
            ref="map"
            style="height: 850px"
            :options="{ zoomControl: false }"
            :zoom="5"
            :min-zoom="3"
            :max-bounds="MAP_BOUNDS"
            :center="MAP_CENTER"
            :use-global-leaflet="false"
        >
            <LTileLayer
                :url="mapUrl"
                attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
            />

            <!-- Render all markers -->
            <LMarker
                v-for="point in mapStore.mapPoints"
                :key="point.id"
                :lat-lng="[point.lat, point.long]"
            >
                <LIcon
                    :icon-size="[30, 30]"
                    :icon-anchor="[15, 30]"
                    :popup-anchor="[0, -30]"
                    class-name="my-custom-marker"
                >
                    <div>
                        <MapPinMarker :label="point.name" />
                    </div>
                </LIcon>
                <LPopup>
                    <div>
                        <h3 class="mb-1 text-2xl">{{ point.name }}</h3>
                        <div class="m-0 text-sm" v-if="point.description">
                            {{ point.description }}
                        </div>
                    </div>
                </LPopup>
            </LMarker>
        </LMap>
    </div>
</template>
