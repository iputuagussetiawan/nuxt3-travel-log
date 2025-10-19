import type { UserWithId } from './auth'
import type { Map as LMap } from 'leaflet'
import type { RouteLocationRaw } from 'vue-router'

declare module 'h3' {
    interface H3EventContext {
        user?: UserWithId
    }
}

export type LatLongItem = {
    lat: string
    long: string
}

export type MapPoint = {
    id: string
    name: string
    description: string | null
    to?: RouteLocationRaw
    toLabel?: string
} & LatLongItem

export type MyMap = LMap
