export const useLocationsStore = defineStore('useLocationsStore', () => {
    const {
        data: locations,
        status: locationsStatus,
        refresh: refreshLocations
    } = useFetch('/api/locations', {
        lazy: true
    })
    const sidebarStore = useSidebarStore()
    const mapStore = useMapStore()
    const mapStoreTwo = useMapStoreTwo()

    effect(() => {
        if (locations.value) {
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
        }
        sidebarStore.loading = locationsStatus.value === 'pending'
    })

    return {
        locations,
        locationsStatus,
        refreshLocations
    }
})
