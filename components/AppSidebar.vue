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

const props = withDefaults(defineProps<SidebarProps>(), {
    collapsible: 'icon'
})

const authStore = useAuthStore()

const userData = {
    name: authStore?.user?.name,
    email: authStore?.user?.email,
    avatar: authStore?.user?.image
}

// This is sample data.
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
            isActive: true,
            items: [
                {
                    title: 'All Location',
                    url: '/dashboard/locations'
                },
                {
                    title: 'Add Location',
                    url: '/dashboard/locations/add'
                }
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
            <NavMain :items="data.navMain" />
            <!-- <NavLocation /> -->
        </SidebarContent>
        <SidebarFooter>
            <NavUser :user="data.userData" />
        </SidebarFooter>
        <SidebarRail />
    </Sidebar>
</template>
