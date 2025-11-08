<script lang="ts" setup>
import type { MapPoint } from '~/lib/type'
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from '~/components/ui/card'

defineProps<{
    mapPoint: MapPoint
}>()
const mapStore = useMapStore()
const handleNavigateToLocation = (mapPoint: MapPoint) => {
    mapStore.navigateToMarker(mapPoint)
}
</script>
<template>
    <Card
        class="border-border bg-card/90 supports-[backdrop-filter]:bg-card/60 cursor-pointer rounded-2xl border shadow-md backdrop-blur-md transition-all duration-400 ease-in-out hover:border-blue-500 dark:shadow-lg"
        :class="
            mapStore.selectedPoint?.id === mapPoint.id ? 'border-blue-500' : ''
        "
        @click="handleNavigateToLocation(mapPoint)"
    >
        <CardHeader>
            <CardTitle class="text-muted-foreground">{{
                mapPoint.name
            }}</CardTitle>
            <CardDescription class="text-muted-foreground">
                {{ mapPoint.description }}
            </CardDescription>
        </CardHeader>
    </Card>
</template>
<style lang="scss" scoped></style>
