import type { SelectLocationLogType, SelectLocationWithLogsType } from '~/lib/db/schema'
import { CURRENT_LOCATION_LOG_PAGES, CURRENT_LOCATION_PAGES, LOCATION_PAGES } from '~/lib/constants'
import { createMapPointFromLocationLog } from '~/lib/map-points'
import type { MapPoint } from '~/lib/type'

export const useLocationsStore = defineStore('useLocationsStore', () => {
    const route = useRoute()
    const sidebarStore = useSidebarStore()
    const mapStore = useMapStore()

    const {
        data: locations,
        status: locationsStatus,
        refresh: refreshLocations
    } = useFetch('/api/locations', {
        lazy: true
    })

    // ✅ Reactive slug source: use route first, fallback to mapStore
    const activeSlug = computed(() => {
        // Try route slug first
        if (route.params.slug) return route.params.slug
        // Fallback to slug stored in mapStore (if available)
        if (mapStore.selectedPoint?.slug) return mapStore.selectedPoint.slug
        return null
    })

    // ✅ Build API URL dynamically
    const locationUrlWithSlug = computed(() => `/api/locations/${activeSlug.value}`)

    const locationLogUrlWithSlugAndId = computed(
        () => `/api/locations/${activeSlug.value}/${route.params.id}`
    )

    const {
        data: currentLocation,
        status: currentLocationStatus,
        error: currentLocationError,
        refresh: refreshCurrentLocation
    } = useFetch<SelectLocationWithLogsType>(locationUrlWithSlug, {
        lazy: true,
        immediate: false,
        watch: false
    })

    const {
        data: currentLocationLog,
        status: currentLocationLogStatus,
        error: currentLocationLogError,
        refresh: refreshCurrentLocationLog
    } = useFetch<SelectLocationLogType>(locationLogUrlWithSlugAndId, {
        lazy: true,
        immediate: false,
        watch: false
    })

    effect(() => {
        if (locations.value && LOCATION_PAGES.has(route.name?.toString() || '')) {
            sidebarStore.sidebarItems = locations.value.map((location) => ({
                id: `location-${location.id}`,
                label: location.name,
                icon: 'tabler:map-pin-filled',
                to: {
                    name: 'dashboard-locations-slug',
                    params: { slug: location.slug }
                },
                toLabel: 'View',
                location
            }))
            mapStore.mapPoints = locations.value
            // mapStoreTwo.mapPoints = locations.value
        } else if (
            currentLocation.value &&
            CURRENT_LOCATION_PAGES.has(route.name?.toString() || '')
        ) {
            const mapPoints: MapPoint[] = []

            currentLocation.value.locationLogs.forEach((log) => {
                const mapPoint = createMapPointFromLocationLog(log)
                mapPoints.push(mapPoint)
            })
            if (mapPoints.length) {
                mapStore.mapPoints = mapPoints
            } else {
                mapStore.mapPoints = [currentLocation.value]
            }

            sidebarStore.sidebarItems = currentLocation.value.locationLogs.map((log) => ({
                id: `location-log-${log.id}`,
                label: log.name,
                icon: 'tabler:map-pin-filled',
                to: {
                    name: 'dashboard-locations-slug-id',
                    params: { slug: route.params.slug, id: log.id }
                },
                location: createMapPointFromLocationLog(log)
            }))
        } else if (
            currentLocationLog.value &&
            CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || '')
        ) {
            sidebarStore.sidebarItems = []
            mapStore.mapPoints = [currentLocationLog.value]
        }
        sidebarStore.loading =
            locationsStatus.value === 'pending' || currentLocationStatus.value === 'pending'
    })

    return {
        locations,
        locationsStatus,
        refreshLocations,
        currentLocation,
        currentLocationStatus,
        currentLocationError,
        refreshCurrentLocation,

        currentLocationLog,
        currentLocationLogStatus,
        currentLocationLogError,
        refreshCurrentLocationLog
    }
})
