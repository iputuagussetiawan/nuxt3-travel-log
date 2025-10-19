<script setup lang="ts">
import { GalleryVerticalEnd, MapIcon } from 'lucide-vue-next'
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
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const sidebarStore = useSidebarStore()
const props = withDefaults(defineProps<SidebarProps>(), {
    collapsible: 'icon'
})

// Reactive route watcher
watch(
    () => route.name,
    (newRoute) => {
        if (
            newRoute === 'dashboard' ||
            newRoute === 'dashboard-locations' ||
            newRoute === 'dashboard-locations-add'
        ) {
            sidebarStore.sidebarTopItems = [
                {
                    title: 'Travel Location',
                    url: '#',
                    icon: 'Teses',
                    isActive: false,
                    items: [
                        { title: 'All Location', url: '/dashboard/locations' },
                        {
                            title: 'Add Location',
                            url: '/dashboard/locations/add'
                        }
                    ]
                }
            ]
        } else if (newRoute === 'dashboard-locations-slug') {
            sidebarStore.sidebarTopItems = [
                {
                    title: 'Travel Log',
                    url: '#',
                    icon: 'Teses',
                    isActive: false,
                    items: [
                        { title: 'View Log', url: '/dashboard/locations' },
                        {
                            title: 'Add Location Log',
                            url: '/dashboard/locations/add'
                        }
                    ]
                }
            ]
        } else {
            sidebarStore.sidebarTopItems = [] // default or reset
        }
    },
    { immediate: true } // run once on component mount too
)

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
