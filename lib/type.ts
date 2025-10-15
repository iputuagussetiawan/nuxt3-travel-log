import type { UserWithId } from './auth'

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
