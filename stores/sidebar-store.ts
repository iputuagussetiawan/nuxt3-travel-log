import type { RouteLocationRaw } from 'vue-router'
import type { MapPoint } from '~/lib/type'

export type SidebarItem = {
    id: string
    label: string
    icon: string
    href?: string
    to?: RouteLocationRaw
    location?: MapPoint | null
}

export type iSidebarTop = {
    items: {
        title: string
        url: string
        icon?: string
        isActive?: boolean
        items?: {
            id: string
            label: string
            icon: string
            href?: string
            to?: RouteLocationRaw
            mapPoint?: MapPoint | null
        }[]
    }[]
}

export const useSidebarStore = defineStore('useSidebarStore', () => {
    const sidebarItems = ref<SidebarItem[]>([])
    const sidebarTopItems = ref<iSidebarTop[]>([])
    const loading = ref(false)

    return {
        loading,
        sidebarTopItems,
        sidebarItems
    }
})
