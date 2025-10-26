<script setup lang="ts">
import { ArrowRight, GalleryVerticalEnd, MapIcon } from 'lucide-vue-next'
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
import { CURRENT_LOCATION_PAGES } from '~/lib/constants'
import { LOCATION_PAGES } from '../lib/constants'
const route = useRoute()
const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
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
                icon: 'Teses',
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
        sidebarStore.sidebarTopItems = [
            {
                title: 'Travel Log',
                url: '#',
                icon: 'sds',
                isActive: true,
                items: [
                    {
                        id: 'back-locations',
                        label: 'Back To Location',
                        to: '/dashboard/locations',
                        icon: 'sds'
                    },
                    {
                        id: 'edit-location',
                        label: 'Edit Location',
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
    } else {
        sidebarStore.sidebarTopItems = [] // default or reset
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
        name: 'Acme Inc',
        logo: GalleryVerticalEnd,
        plan: 'Enterprise'
    },
    navMain: [
        {
            title: 'Travel Location',
            url: '#',
            icon: MapIcon,
            isActive: false,
            items: [
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
