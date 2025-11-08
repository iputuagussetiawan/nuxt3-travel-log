<script lang="ts" setup>
import {
    Card,
    CardDescription,
    CardHeader,
    CardTitle
} from '~/components/ui/card'
import { Skeleton } from '~/components/ui/skeleton'
</script>
<template>
    <Card>
        <CardHeader>
            <CardTitle>
                <Skeleton class="h-2 w-1/2" />
            </CardTitle>
            <CardDescription class="space-y-1">
                <Skeleton class="h-2 w-full" />
                <Skeleton class="h-2 w-1/2" />
            </CardDescription>
        </CardHeader>
    </Card>
</template>
