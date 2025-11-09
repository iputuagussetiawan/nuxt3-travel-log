import type { SelectLocationLogType, SelectLocationType } from './db/schema'
import type { MapPoint } from './type'

export function createMapPointFromLocation(
    location: SelectLocationType
): MapPoint {
    return {
        ...location,
        to: {
            name: 'dashboard-location-slug',
            params: { slug: location.slug }
        },
        toLabel: 'View'
    }
}

export function createMapPointFromLocationLog(
    locationLog: SelectLocationLogType
): MapPoint {
    return {
        ...locationLog,
        to: {
            name: 'dashboard-locations-slug-id',
            params: { id: locationLog.id }
        },
        toLabel: 'View'
    }
}

export function isPointSelected(
    item: Pick<MapPoint, 'id' | 'lat' | 'long'> | null | undefined,
    selectedPoint: MapPoint | null | undefined
) {
    if (!item || !selectedPoint) return false
    return (
        item.id === selectedPoint.id &&
        item.lat === selectedPoint.lat &&
        item.long === selectedPoint.long
    )
}
