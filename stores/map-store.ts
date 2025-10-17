import type { MapPoint } from '~/lib/type'

export const useMapStore = defineStore('useMapStore', () => {
    const mapPoints = ref<MapPoint[]>([])
    return {
        mapPoints
    }
})
