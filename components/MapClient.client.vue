<script setup>
import { ref } from 'vue'
const map = ref(null)
const colorMode = useColorMode()
const lightMap = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const darkMap = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
// Example markers
const markers = [
    { id: 1, name: 'Marker A', position: [47.41323, -1.219482] },
    { id: 2, name: 'Marker B', position: [47.61322, -0.519482] },
    { id: 3, name: 'Marker C', position: [50, 50] }
]

const mapUrl = computed(() =>
    colorMode.preference === 'dark' ? darkMap : lightMap
)
// Function to fly to marker
const flyToMarker = (marker) => {
    const leafletMap = map.value?.leafletObject
    console.log(leafletMap)
    if (!leafletMap) return
    leafletMap.flyTo(marker.position, 10, {
        animate: true,
        duration: 2 // seconds
    })
}
</script>

<template>
    <div style="height: 100vh; width: 100%">
        <LMap
            ref="map"
            style="height: 850px"
            :zoom="6"
            :center="[47.21322, -1.559482]"
            :use-global-leaflet="false"
        >
            <LTileLayer
                :url="mapUrl"
                attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
            />

            <!-- Render all markers -->
            <LMarker v-for="m in markers" :key="m.id" :lat-lng="m.position">
                <LPopup>{{ m.name }}</LPopup>
            </LMarker>
        </LMap>

        <!-- Buttons to fly to each marker -->
        <div class="flex gap-2 p-4">
            <button
                v-for="m in markers"
                :key="m.id"
                class="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                @click="flyToMarker(m)"
            >
                Fly to {{ m.name }}
            </button>
        </div>
    </div>
</template>
