<script setup lang="ts">
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from '~/components/ui/breadcrumb'
import { Icon } from '@iconify/vue'

const route = useRoute()
const locationStore = useLocationsStore()

interface Crumb {
    label: string
    to?: string
    icon?: string
}

const crumbs = computed<Crumb[]>(() => {
    const name = route.name?.toString() ?? ''
    const { slug, id } = route.params as Record<string, string>

    const locationName = locationStore.currentLocation?.name ?? slug
    const logName = locationStore.currentLocationLog?.name ?? id

    const dashboard: Crumb = {
        label: 'Dashboard',
        to: '/dashboard',
        icon: 'lucide:layout-dashboard'
    }
    const locations: Crumb = {
        label: 'Locations',
        to: '/dashboard/locations',
        icon: 'lucide:map-pin'
    }
    const locationCrumb: Crumb = {
        label: locationName,
        to: `/dashboard/locations/${slug}`,
        icon: 'lucide:map'
    }
    const logCrumb: Crumb = {
        label: logName,
        to: `/dashboard/locations/${slug}/${id}`,
        icon: 'lucide:notebook-pen'
    }

    const map: Record<string, Crumb[]> = {
        dashboard: [{ ...dashboard }],
        'dashboard-locations': [dashboard, { label: 'Locations', icon: 'lucide:map-pin' }],
        'dashboard-locations-add': [
            dashboard,
            locations,
            { label: 'Add Location', icon: 'lucide:plus' }
        ],
        'dashboard-locations-slug': [
            dashboard,
            locations,
            { label: locationName, icon: 'lucide:map' }
        ],
        'dashboard-locations-slug-edit': [
            dashboard,
            locations,
            locationCrumb,
            { label: 'Edit', icon: 'lucide:pencil' }
        ],
        'dashboard-locations-slug-add': [
            dashboard,
            locations,
            locationCrumb,
            { label: 'Add Log', icon: 'lucide:plus' }
        ],
        'dashboard-locations-slug-id': [
            dashboard,
            locations,
            locationCrumb,
            { label: logName, icon: 'lucide:notebook-pen' }
        ],
        'dashboard-locations-slug-id-edit': [
            dashboard,
            locations,
            locationCrumb,
            logCrumb,
            { label: 'Edit', icon: 'lucide:pencil' }
        ],
        'dashboard-locations-slug-id-images': [
            dashboard,
            locations,
            locationCrumb,
            logCrumb,
            { label: 'Images', icon: 'lucide:images' }
        ],
        'dashboard-profile': [dashboard, { label: 'Profile', icon: 'lucide:user' }]
    }

    return map[name] ?? [dashboard]
})
</script>

<template>
    <Breadcrumb aria-label="Breadcrumb navigation">
        <BreadcrumbList>
            <template v-for="(crumb, i) in crumbs" :key="i">
                <BreadcrumbSeparator v-if="i > 0" aria-hidden="true" />
                <BreadcrumbItem>
                    <!-- Last item = current page, not a link -->
                    <BreadcrumbPage
                        v-if="i === crumbs.length - 1"
                        class="flex items-center gap-1.5"
                        aria-current="page"
                    >
                        <Icon
                            v-if="crumb.icon"
                            :icon="crumb.icon"
                            class="h-3.5 w-3.5"
                            aria-hidden="true"
                        />
                        <span class="max-w-[140px] truncate">{{ crumb.label }}</span>
                    </BreadcrumbPage>
                    <!-- All other items = links -->
                    <BreadcrumbLink v-else as-child class="flex items-center gap-1.5">
                        <NuxtLink :to="crumb.to">
                            <Icon
                                v-if="crumb.icon"
                                :icon="crumb.icon"
                                class="h-3.5 w-3.5"
                                aria-hidden="true"
                            />
                            <span class="max-w-[120px] truncate">{{ crumb.label }}</span>
                        </NuxtLink>
                    </BreadcrumbLink>
                </BreadcrumbItem>
            </template>
        </BreadcrumbList>
    </Breadcrumb>
</template>
