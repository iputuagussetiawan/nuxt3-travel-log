// ~/stores/map.js or ~/stores/map.ts
import { defineStore } from 'pinia'
import type { MapPoint, MyMap } from '~/lib/type'

export const useMapStoreTwo = defineStore('map', {
    state: () => ({
        map: ref<MyMap | null>(null),
        mapPoints: ref<MapPoint[]>([]),
        selectedPoint: ref<MapPoint | null>(null)
    }),

    actions: {
        setMap(mapInstance: MyMap | null) {
            this.map = mapInstance
            console.log('Map instance set:', this.map)
        },

        // ✈️ Fly to one marker
        flyToMarker(marker: { lat: string; long: string }) {
            if (!this.map) return
            this.map.flyTo([Number(marker.lat), Number(marker.long)], 10, {
                animate: true,
                duration: 2
            })
        },

        navigateToMarker(mapPoint: MapPoint) {
            this.selectedPoint = mapPoint
            this.flyToMarker(mapPoint)
        }
    }
})
