<script setup lang="ts">
import { Image } from 'lucide-vue-next'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    type SidebarProps
} from './ui/sidebar'
import NavMain from './NavMain.vue'
import NavUser from './NavUser.vue'
import NavLogo from './NavLogo.vue'
import {
    CURRENT_LOCATION_LOG_PAGES,
    CURRENT_LOCATION_PAGES,
    LOCATION_PAGES
} from '~/lib/constants'

const route = useRoute()
const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const locationStore = useLocationsStore()

const props = withDefaults(defineProps<SidebarProps>(), {
    collapsible: 'icon'
})

effect(() => {
    const name = route.name?.toString() || ''
    const { slug, id } = route.params as Record<string, string>

    if (LOCATION_PAGES.has(name)) {
        sidebarStore.sidebarTopItems = [
            {
                title: 'Locations',
                url: '#',
                icon: 'lucide:map-pin',
                isActive: true,
                items: [
                    {
                        id: 'all-locations',
                        label: 'All Locations',
                        to: '/dashboard/locations',
                        icon: 'lucide:list'
                    },
                    {
                        id: 'add-location',
                        label: 'Add Location',
                        to: '/dashboard/locations/add',
                        icon: 'lucide:plus'
                    }
                ]
            }
        ]
    } else if (
        CURRENT_LOCATION_PAGES.has(name) &&
        locationStore?.currentLocation?.id
    ) {
        sidebarStore.sidebarTopItems = [
            {
                title: 'Travel Log',
                url: '#',
                icon: 'lucide:map',
                isActive: true,
                items: [
                    {
                        id: 'back-locations',
                        label: 'All Locations',
                        to: '/dashboard/locations',
                        icon: 'lucide:arrow-left'
                    },
                    {
                        id: 'location-log',
                        label: 'View Logs',
                        to: `/dashboard/locations/${slug}`,
                        icon: 'lucide:notebook-pen'
                    },
                    {
                        id: 'edit-location',
                        label: 'Edit Location',
                        to: `/dashboard/locations/${slug}/edit`,
                        icon: 'lucide:pencil'
                    },
                    {
                        id: 'add-log',
                        label: 'Add Log',
                        to: `/dashboard/locations/${slug}/add`,
                        icon: 'lucide:plus'
                    }
                ]
            }
        ]
    } else if (
        CURRENT_LOCATION_LOG_PAGES.has(name) &&
        locationStore?.currentLocation?.id
    ) {
        sidebarStore.sidebarTopItems = [
            {
                title: 'Location Log',
                url: '#',
                icon: 'lucide:notebook-pen',
                isActive: true,
                items: [
                    {
                        id: 'back-location',
                        label: 'Back to Location',
                        to: `/dashboard/locations/${slug}`,
                        icon: 'lucide:arrow-left'
                    },
                    {
                        id: 'view-log',
                        label: 'View Log',
                        to: `/dashboard/locations/${slug}/${id}`,
                        icon: 'lucide:eye'
                    },
                    {
                        id: 'edit-log',
                        label: 'Edit Log',
                        to: `/dashboard/locations/${slug}/${id}/edit`,
                        icon: 'lucide:pencil'
                    },
                    {
                        id: 'manage-images',
                        label: 'Manage Images',
                        to: `/dashboard/locations/${slug}/${id}/images`,
                        icon: 'lucide:images'
                    },
                    {
                        id: 'add-log',
                        label: 'Add Log',
                        to: `/dashboard/locations/${slug}/add`,
                        icon: 'lucide:plus'
                    }
                ]
            }
        ]
    } else {
        sidebarStore.sidebarTopItems = [
            {
                title: 'Locations',
                url: '#',
                icon: 'lucide:map-pin',
                isActive: true,
                items: [
                    {
                        id: 'all-locations',
                        label: 'All Locations',
                        to: '/dashboard/locations',
                        icon: 'lucide:list'
                    },
                    {
                        id: 'add-location',
                        label: 'Add Location',
                        to: '/dashboard/locations/add',
                        icon: 'lucide:plus'
                    }
                ]
            }
        ]
    }
})

const teams = {
    name: 'Travel Log',
    logo: Image,
    plan: 'Personal'
}
</script>

<template>
    <Sidebar v-bind="props">
        <SidebarHeader>
            <NavLogo :teams="teams" />
        </SidebarHeader>
        <SidebarContent>
            <NavMain />
        </SidebarContent>
        <SidebarFooter class="z-[30001]">
            <NavUser />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
</template>
