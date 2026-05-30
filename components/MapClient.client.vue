<script setup>
import { ref } from 'vue'
import { MAP_CENTER, MAP_BOUNDS, SHOW_MARKER_ON_PAGES } from '~/lib/constants'
import MapPinMarker from './MapPinMarker.vue'
const map = ref(null)
const route = useRoute()
// 🌗 Light & Dark Map
const colorMode = useColorMode()
const lightMap = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const darkMap = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'

const mapStore = useMapStore()
const mapStoreTwo = useMapStoreTwo()
const mapUrl = computed(() => (colorMode.value === 'dark' ? darkMap : lightMap))

// 🗺️ Fit map to all markers, or reset to global view when no markers
const fitToMarkers = async () => {
    const L = await import('leaflet')
    const leafletMap = map.value?.leafletObject
    if (!leafletMap) return
    const points = mapStore.mapPoints
    if (!points.length) {
        leafletMap.setView(MAP_CENTER, 2, { animate: true })
        return
    }
    const bounds = L.latLngBounds(
        points.map((p) => [Number(p.lat), Number(p.long)])
    )
    leafletMap.fitBounds([bounds._northEast, bounds._southWest], {
        padding: [50, 50]
    })
}
const setMapOnStore = async () => {
    const leafletMap = map.value?.leafletObject
    if (leafletMap) {
        // vue-leaflet exposes the map under .leafletObject
        mapStore.setMap(leafletMap)
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

// 🔁 Refit when markers settle (debounced to avoid flicker on route change)
let refitTimer = null
watch(
    () => mapStore.mapPoints,
    () => {
        clearTimeout(refitTimer)
        refitTimer = setTimeout(() => fitToMarkers(), 300)
    },
    { deep: true }
)

function updatePoint(location) {
    console.log('updatePoint function', location)

    if (mapStore.addedPoint) {
        mapStore.addedPoint.lat = location.lat
        mapStore.addedPoint.long = location.lng
    }
}

function onDoubleClick(location) {
    console.log('onDoubleClick function', location)

    if (mapStore.addedPoint) {
        mapStore.addedPoint.lat = location.latlng.lat
        mapStore.addedPoint.long = location.latlng.lng
    }
}
</script>

<template>
    <div style="height: 100vh; width: 100%">
        <LMap
            ref="map"
            style="height: 850px"
            :options="{ zoomControl: false }"
            :zoom="2"
            :min-zoom="3"
            :max-bounds="MAP_BOUNDS"
            :center="MAP_CENTER"
            :use-global-leaflet="false"
            @click="onDoubleClick($event)"
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
                        <MapPinMarker
                            :label="point.name"
                            :active="mapStore.selectedPoint?.id === point.id"
                        />
                    </div>
                </LIcon>
                <LPopup>
                    <div>
                        <h3 class="mb-1 text-2xl">{{ point.name }}</h3>
                        <div v-if="point.description" class="m-0 text-sm">
                            {{ point.description }}
                        </div>
                    </div>
                </LPopup>
            </LMarker>

            <LMarker
                v-if="SHOW_MARKER_ON_PAGES.has(route.name?.toString() || '')"
                :lat-lng="[mapStore.addedPoint.lat, mapStore.addedPoint.long]"
                draggable
                @update:lat-lng="updatePoint($event)"
            >
                <LIcon
                    :icon-size="[40, 40]"
                    :icon-anchor="[20, 40]"
                    :popup-anchor="[0, -40]"
                    class-name="my-custom-marker"
                >
                    <div>
                        <MapPinMarker
                            :label="testes"
                            :active="false"
                            :use-for-input="true"
                        />
                    </div>
                </LIcon>
            </LMarker>
        </LMap>
    </div>
</template>
