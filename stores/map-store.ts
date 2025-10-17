import type { MapPoint } from '~/lib/type'

export const useMapStore = defineStore('useMapStore', () => {
    const mapPoints = ref<MapPoint[]>([])
    const selectedPoint = ref<MapPoint | null>(null)

    return {
        mapPoints,
        selectedPoint
    }
})
