import type { SelectLocationWithLogsType } from '~/lib/db/schema'

const listLocationInSidebar = new Set([
    'dashboard-locations',
    'dashboard-locations'
])

const listCurrentLocationInSidebar = new Set([
    'dashboard-locations-slug',
    'dashboard-locations-slug-add',
    'dashboard-locations-slug-edit'
])

export const useLocationsStore = defineStore('useLocationsStore', () => {
    const route = useRoute()
    const sidebarStore = useSidebarStore()
    const mapStore = useMapStore()
    const mapStoreTwo = useMapStoreTwo()

    const {
        data: locations,
        status: locationsStatus,
        refresh: refreshLocations
    } = useFetch('/api/locations', {
        lazy: true
    })

    // ✅ Reactive slug source: use route first, fallback to mapStoreTwo
    const activeSlug = computed(() => {
        // Try route slug first
        if (route.params.slug) return route.params.slug
        // Fallback to slug stored in mapStoreTwo (if available)
        if (mapStoreTwo.selectedPoint?.slug)
            return mapStoreTwo.selectedPoint.slug
        return null
    })

    // ✅ Build API URL dynamically
    const locationUrlWithSlug = computed(
        () => `/api/locations/${activeSlug.value}`
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

    effect(() => {
        if (
            locations.value &&
            listLocationInSidebar.has(route.name?.toString() || '')
        ) {
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
            mapStoreTwo.mapPoints = locations.value
        } else if (
            currentLocation.value &&
            listCurrentLocationInSidebar.has(route.name?.toString() || '')
        ) {
            sidebarStore.sidebarItems = []
            mapStoreTwo.mapPoints = [currentLocation.value]
        }
        sidebarStore.loading = locationsStatus.value === 'pending'
    })

    return {
        locations,
        locationsStatus,
        refreshLocations,
        currentLocation,
        currentLocationStatus,
        currentLocationError,
        refreshCurrentLocation
    }
})
