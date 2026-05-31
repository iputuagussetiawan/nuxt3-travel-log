<script setup lang="ts">
import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'
import { ArrowUpRightIcon } from 'lucide-vue-next'

defineProps<{
    icon?: any
    title?: string
    description?: string
    actionText?: string
    actionTo?: string
    learnMoreTo?: string
}>()
</script>

<template>
    <Empty>
        <EmptyHeader>
            <EmptyMedia variant="icon">
                <!-- default slot for icon -->
                <component :is="icon || 'div'" class="text-muted-foreground h-10 w-10" />
            </EmptyMedia>

            <EmptyTitle>{{ title }}</EmptyTitle>
            <EmptyDescription>{{ description }}</EmptyDescription>
        </EmptyHeader>

        <EmptyContent v-if="actionText && actionTo">
            <div class="flex gap-2">
                <NuxtLink
                    :to="actionTo"
                    :class="cn(buttonVariants({ variant: 'default' }), 'gap-2')"
                >
                    {{ actionText }}
                </NuxtLink>
            </div>
        </EmptyContent>

        <NuxtLink
            v-if="learnMoreTo"
            :to="learnMoreTo"
            class="text-muted-foreground mt-2 inline-block text-sm hover:underline"
        >
            Learn more about managing locations
            <ArrowUpRightIcon class="ml-1 inline h-4 w-4" />
        </NuxtLink>
    </Empty>
</template>
