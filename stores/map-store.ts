import type { MapPoint, MyMap } from '~/lib/type'

export const useMapStore = defineStore('useMapStore', () => {
    const map = ref<MyMap | null>(null)
    const mapPoints = ref<MapPoint[]>([])
    const selectedPoint = ref<MapPoint | null>(null)
    const addedPoint = ref<MapPoint | null>(null)

    const setMap = (mapInstance: MyMap | null) => {
        map.value = mapInstance
        console.log('Map instance set:', map.value)
    }

    const flyToMarker = (marker: { lat: string; long: string }, zoom = 10) => {
        if (!map.value) return
        map.value.flyTo([Number(marker.lat), Number(marker.long)], zoom, {
            animate: true,
            duration: 2
        })
    }

    const navigateToMarker = (mapPoint: MapPoint) => {
        selectedPoint.value = mapPoint
        // map.value?.flyTo([Number(mapPoint.lat), Number(mapPoint.long)], 10, {
        //     animate: true,
        //     duration: 2
        // })
    }

    // Watch selectedPoint for changes
    watch(selectedPoint, (newPoint) => {
        if (newPoint && map.value) {
            map.value.flyTo([Number(newPoint.lat), Number(newPoint.long)], 10, {
                animate: true,
                duration: 2
            })
        }
    })

    watch(addedPoint, (newPoint) => {
        if (newPoint && map.value) {
            map.value.flyTo([Number(newPoint.lat), Number(newPoint.long)], 10, {
                animate: true,
                duration: 2
            })
        }
    })

    return {
        map,
        setMap,
        navigateToMarker,
        flyToMarker,
        mapPoints,
        selectedPoint,
        addedPoint
    }
})
