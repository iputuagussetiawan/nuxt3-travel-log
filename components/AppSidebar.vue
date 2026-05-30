<script setup lang="ts">
import { ArrowRight, GalleryVerticalEnd, Image, MapIcon } from 'lucide-vue-next'
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
import NavLocation from './NavLocation.vue'
import {
    CURRENT_LOCATION_LOG_PAGES,
    CURRENT_LOCATION_PAGES
} from '~/lib/constants'
import { LOCATION_PAGES } from '../lib/constants'
const route = useRoute()
const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const locationStore = useLocationsStore()
const props = withDefaults(defineProps<SidebarProps>(), {
    collapsible: 'icon'
})
// Reactive route watcher
effect(() => {
    if (LOCATION_PAGES.has(route.name?.toString() || '')) {
        sidebarStore.sidebarTopItems = [
            {
                title: 'Travel Location',
                url: '#',
                icon: 'tabler:map-pin-filled',
                isActive: true,
                items: [
                    {
                        id: 'dashboard-locations',
                        label: 'All Location',
                        to: '/dashboard/locations',
                        icon: 'Teses'
                    },
                    {
                        id: 'view-log',
                        label: 'Add Location',
                        to: '/dashboard/locations/add',
                        icon: 'Teses'
                    }
                ]
            }
        ]
    } else if (CURRENT_LOCATION_PAGES.has(route.name?.toString() || '')) {
        if (locationStore?.currentLocation?.id) {
            sidebarStore.sidebarTopItems = [
                {
                    title: 'Travel Log',
                    url: '#',
                    icon: 'tabler:map-pin-filled',
                    isActive: true,
                    items: [
                        {
                            id: 'back-locations',
                            label: 'Back To Location',
                            to: '/dashboard/locations',
                            icon: 'sds'
                        },

                        {
                            id: 'location-log',
                            label: 'All Location Log',
                            to: `/dashboard/locations/${route.params.slug}`,
                            icon: 'sds'
                        },

                        {
                            id: 'edit-location',
                            label: 'Edit Location Log',
                            to: `/dashboard/locations/${route.params.slug}/edit`,
                            icon: 'sds'
                        },
                        {
                            id: 'add-log',
                            label: 'Add Location Log',
                            to: `/dashboard/locations/${route.params.slug}/add`,
                            icon: 'sds'
                        }
                    ]
                }
            ]
        }
    } else if (CURRENT_LOCATION_LOG_PAGES.has(route.name?.toString() || '')) {
        if (locationStore?.currentLocation?.id) {
            sidebarStore.sidebarTopItems = [
                {
                    title: 'Current Location Log',
                    url: '#',
                    icon: 'tabler:map-pin-filled',
                    isActive: true,
                    items: [
                        {
                            id: 'back-locations',
                            label:
                                'Back To ' +
                                locationStore?.currentLocation?.name,
                            to: `/dashboard/locations/${route.params.slug}`,
                            icon: 'sds'
                        },

                        {
                            id: 'all-location-log',
                            label:
                                'Back To ' +
                                locationStore?.currentLocationLog?.name,
                            to: `/dashboard/locations/${route.params.slug}/${route.params.id}`,
                            icon: 'sds'
                        },

                        {
                            id: 'edit-location-log',
                            label: 'Edit Location Log',
                            to: `/dashboard/locations/${route.params.slug}/${route.params.id}/edit`,
                            icon: 'sds'
                        },
                        {
                            id: 'location-log-images',
                            label: 'Manage Images',
                            to: `/dashboard/locations/${route.params.slug}/${route.params.id}/images`,
                            icon: 'sds'
                        },

                        {
                            id: 'add-log',
                            label: 'Add Location Log',
                            to: `/dashboard/locations/${route.params.slug}/add`,
                            icon: 'sds'
                        }
                    ]
                }
            ]
        }
    } else {
        // fallback: always show base Locations nav for unrecognized routes (profile, etc.)
        sidebarStore.sidebarTopItems = [
            {
                title: 'Travel Location',
                url: '#',
                icon: 'tabler:map-pin-filled',
                isActive: true,
                items: [
                    {
                        id: 'dashboard-locations',
                        label: 'All Location',
                        to: '/dashboard/locations',
                        icon: 'lucide:map-pin'
                    },
                    {
                        id: 'view-log',
                        label: 'Add Location',
                        to: '/dashboard/locations/add',
                        icon: 'lucide:plus'
                    }
                ]
            }
        ]
    }
})

const userData = computed(() => ({
    name: authStore?.user?.name,
    email: authStore?.user?.email,
    avatar: authStore?.user?.image
}))

const data = {
    userData,
    teams: {
        name: 'Travel Log',
        logo: Image,
        plan: 'Enterprise'
    },
    navMain: [
        {
            title: 'Travel Location',
            url: '#',
            icon: MapIcon,
            isActive: false,
            subitems: [
                { title: 'All Location', url: '/dashboard/locations' },
                { title: 'Add Location', url: '/dashboard/locations/add' }
            ]
        }
    ]
}
</script>

<template>
    <Sidebar v-bind="props">
        <SidebarHeader>
            <NavLogo :teams="data.teams" />
        </SidebarHeader>
        <SidebarContent>
            <NavMain />
            <NavLocation />
        </SidebarContent>
        <SidebarFooter class="z-[30001]">
            <NavUser :user="data.userData" />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
</template>
