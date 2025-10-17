import type { UserWithId } from './auth'
import { Map as LMap } from 'leaflet'

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
} & LatLongItem

export type MyMap = LMap
