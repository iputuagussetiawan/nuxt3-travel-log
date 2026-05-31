import type { Ref, ComputedRef } from 'vue'

export interface UsePaginationOptions {
    pageSize?: number
    ellipsisThreshold?: number
}

export interface UsePaginationReturn<T> {
    page: Ref<number>
    pageSize: number
    totalPages: ComputedRef<number>
    paged: ComputedRef<T[]>
    pageNumbers: ComputedRef<(number | '...')[]>
    total: ComputedRef<number>
    from: ComputedRef<number>
    to: ComputedRef<number>
    reset: () => void
}

export function usePagination<T>(
    list: ComputedRef<T[]> | Ref<T[]>,
    options: UsePaginationOptions = {}
): UsePaginationReturn<T> {
    const { pageSize = 8, ellipsisThreshold = 5 } = options

    const page = ref(1)

    const total = computed(() => unref(list).length)

    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize)))

    const paged = computed(() => {
        const start = (page.value - 1) * pageSize
        return unref(list).slice(start, start + pageSize)
    })

    const from = computed(() => (total.value === 0 ? 0 : (page.value - 1) * pageSize + 1))
    const to = computed(() => Math.min(page.value * pageSize, total.value))

    const pageNumbers = computed((): (number | '...')[] => {
        const t = totalPages.value
        const c = page.value

        if (t <= ellipsisThreshold) {
            return Array.from({ length: t }, (_, i) => i + 1)
        }

        const pages: (number | '...')[] = []
        pages.push(1)
        if (c > 3) pages.push('...')
        for (let i = Math.max(2, c - 1); i <= Math.min(t - 1, c + 1); i++) {
            pages.push(i)
        }
        if (c < t - 2) pages.push('...')
        pages.push(t)

        return pages
    })

    function reset() {
        page.value = 1
    }

    return { page, pageSize, totalPages, paged, pageNumbers, total, from, to, reset }
}
