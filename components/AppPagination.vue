<script setup lang="ts">
import { Icon } from '@iconify/vue'

const props = defineProps<{
    page: number
    totalPages: number
    pageNumbers: (number | '...')[]
    from: number
    to: number
    total: number
}>()

const emit = defineEmits<{
    'update:page': [page: number]
}>()
</script>

<template>
    <div v-if="totalPages > 1" class="flex items-center justify-between">
        <p class="text-muted-foreground text-xs">Showing {{ from }}–{{ to }} of {{ total }}</p>

        <div class="flex items-center gap-1">
            <button
                :disabled="page === 1"
                class="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-30"
                @click="emit('update:page', 1)"
            >
                <Icon icon="lucide:chevrons-left" class="h-4 w-4" />
            </button>
            <button
                :disabled="page === 1"
                class="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-30"
                @click="emit('update:page', page - 1)"
            >
                <Icon icon="lucide:chevron-left" class="h-4 w-4" />
            </button>

            <div class="flex items-center gap-1 px-1">
                <template v-for="(p, i) in pageNumbers" :key="i">
                    <span v-if="p === '...'" class="text-muted-foreground px-1 text-xs select-none">
                        …
                    </span>
                    <button
                        v-else
                        :class="[
                            'flex h-8 w-8 items-center justify-center rounded-md border text-xs font-medium transition-colors',
                            p === page
                                ? 'border-primary bg-primary text-primary-foreground'
                                : 'text-muted-foreground hover:bg-muted'
                        ]"
                        @click="emit('update:page', p)"
                    >
                        {{ p }}
                    </button>
                </template>
            </div>

            <button
                :disabled="page === totalPages"
                class="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-30"
                @click="emit('update:page', page + 1)"
            >
                <Icon icon="lucide:chevron-right" class="h-4 w-4" />
            </button>
            <button
                :disabled="page === totalPages"
                class="text-muted-foreground hover:bg-muted hover:text-foreground flex h-8 w-8 items-center justify-center rounded-md border transition-colors disabled:opacity-30"
                @click="emit('update:page', totalPages)"
            >
                <Icon icon="lucide:chevrons-right" class="h-4 w-4" />
            </button>
        </div>
    </div>
</template>
