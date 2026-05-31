<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { refDebounced } from '@vueuse/core'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'User Management' })

const ROLES = ['user', 'member', 'admin'] as const
type Role = (typeof ROLES)[number]

type User = {
    id: string
    name: string
    email: string
    image: string | null
    role: Role
    createdAt: string
}

const { data: users, refresh, status } = await useFetch<User[]>('/api/admin/users')

// ── Search / filter / sort ────────────────────────────────────────────────────
const search = ref('')
const debouncedSearch = refDebounced(search, 300)
const filterRole = ref<Role | 'all'>('all')
const sortKey = ref<'name' | 'createdAt'>('createdAt')
const sortDir = ref<'asc' | 'desc'>('desc')

const filtered = computed(() => {
    let list = users.value ?? []
    const q = debouncedSearch.value.trim().toLowerCase()
    if (q)
        list = list.filter(
            (u) => u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
        )
    if (filterRole.value !== 'all') list = list.filter((u) => u.role === filterRole.value)
    list = [...list].sort((a, b) => {
        const va = sortKey.value === 'name' ? a.name.toLowerCase() : a.createdAt
        const vb = sortKey.value === 'name' ? b.name.toLowerCase() : b.createdAt
        return sortDir.value === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
    })
    return list
})

// ── Pagination ────────────────────────────────────────────────────────────────
const {
    page,
    totalPages,
    paged,
    pageNumbers,
    from,
    to,
    total: totalFiltered,
    reset: resetPage
} = usePagination(filtered, { pageSize: 8, ellipsisThreshold: 5 })

watch([debouncedSearch, filterRole, sortKey, sortDir], resetPage)

// ── Role change ───────────────────────────────────────────────────────────────
const updating = ref<string | null>(null)
const { $csrfFetch } = useNuxtApp()

async function changeRole(userId: string, role: Role) {
    updating.value = userId
    try {
        await $csrfFetch(`/api/admin/users/${userId}/role`, {
            method: 'PUT',
            body: { role }
        })
        await refresh()
    } finally {
        updating.value = null
    }
}

function clearFilters() {
    search.value = ''
    filterRole.value = 'all'
}

function toggleSort(key: typeof sortKey.value) {
    if (sortKey.value === key) {
        sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
    } else {
        sortKey.value = key
        sortDir.value = 'asc'
    }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
const roleColor: Record<Role, string> = {
    user: 'bg-zinc-500/10 text-zinc-500 dark:text-zinc-400',
    member: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    admin: 'bg-violet-500/10 text-violet-600 dark:text-violet-400'
}

const roleCounts = computed(() => {
    const all = users.value ?? []
    return {
        all: all.length,
        user: all.filter((u) => u.role === 'user').length,
        member: all.filter((u) => u.role === 'member').length,
        admin: all.filter((u) => u.role === 'admin').length
    }
})

const widgets = computed(() => [
    {
        key: 'all' as const,
        label: 'Total Users',
        count: roleCounts.value.all,
        icon: 'lucide:users',
        iconBg: 'bg-blue-500/10',
        iconColor: 'text-blue-500',
        activeBorder: 'border-blue-500',
        activeBg: 'bg-blue-500/5'
    },
    {
        key: 'user' as const,
        label: 'Users',
        count: roleCounts.value.user,
        icon: 'lucide:user',
        iconBg: 'bg-zinc-500/10',
        iconColor: 'text-zinc-500',
        activeBorder: 'border-zinc-500',
        activeBg: 'bg-zinc-500/5'
    },
    {
        key: 'member' as const,
        label: 'Members',
        count: roleCounts.value.member,
        icon: 'lucide:badge-check',
        iconBg: 'bg-emerald-500/10',
        iconColor: 'text-emerald-500',
        activeBorder: 'border-emerald-500',
        activeBg: 'bg-emerald-500/5'
    },
    {
        key: 'admin' as const,
        label: 'Admins',
        count: roleCounts.value.admin,
        icon: 'lucide:shield-check',
        iconBg: 'bg-violet-500/10',
        iconColor: 'text-violet-500',
        activeBorder: 'border-violet-500',
        activeBg: 'bg-violet-500/5'
    }
])
</script>

<template>
    <div class="space-y-6 p-6">
        <!-- Header -->
        <div class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 class="text-xl font-bold">User Management</h1>
                <p class="text-muted-foreground mt-0.5 text-sm">
                    Manage roles · {{ roleCounts.all }} total users
                </p>
            </div>
            <button
                class="text-muted-foreground hover:text-foreground flex items-center gap-1.5 self-start rounded-lg border px-3 py-1.5 text-xs transition-colors sm:self-auto"
                @click="refresh()"
            >
                <Icon icon="lucide:refresh-cw" class="h-3.5 w-3.5" />
                Refresh
            </button>
        </div>

        <!-- Stats widgets -->
        <div class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <button
                v-for="w in widgets"
                :key="w.key"
                :class="[
                    'rounded-xl border p-4 text-left transition-all hover:shadow-sm',
                    filterRole === w.key ? `${w.activeBorder} ${w.activeBg}` : 'hover:bg-muted/40'
                ]"
                @click="filterRole = w.key"
            >
                <div class="mb-3 flex items-center justify-between">
                    <p class="text-muted-foreground text-xs font-medium">
                        {{ w.label }}
                    </p>
                    <div :class="[w.iconBg, 'rounded-xl p-3']">
                        <Icon :icon="w.icon" :class="[w.iconColor, 'h-6 w-6']" />
                    </div>
                </div>
                <p class="text-2xl font-bold">{{ w.count }}</p>
                <p :class="[w.iconColor, 'mt-1 text-xs font-medium']">
                    {{ filterRole === w.key ? 'Active filter' : 'Click to filter' }}
                </p>
            </button>
        </div>

        <!-- Search + Sort toolbar -->
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <!-- Search -->
            <div class="relative flex-1">
                <Icon
                    icon="lucide:search"
                    class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                />
                <input
                    v-model="search"
                    type="text"
                    placeholder="Search by name or email…"
                    class="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-lg border py-2 pr-9 pl-9 text-sm outline-none focus-visible:ring-2"
                />
                <button
                    v-if="search"
                    class="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                    @click="search = ''"
                >
                    <Icon icon="lucide:x" class="h-3.5 w-3.5" />
                </button>
            </div>
        </div>

        <!-- Table -->
        <div class="overflow-hidden rounded-xl border">
            <!-- Loading -->
            <div v-if="status === 'pending'" class="p-8 text-center">
                <Icon
                    icon="lucide:loader-2"
                    class="text-muted-foreground mx-auto h-6 w-6 animate-spin"
                />
            </div>

            <!-- Empty -->
            <div v-else-if="!paged.length" class="p-12 text-center">
                <Icon icon="lucide:users" class="text-muted-foreground/40 mx-auto mb-3 h-10 w-10" />
                <p class="text-muted-foreground text-sm">No users match your search.</p>
                <button
                    class="text-primary mt-2 text-xs underline-offset-4 hover:underline"
                    @click="clearFilters()"
                >
                    Clear filters
                </button>
            </div>

            <table v-else class="w-full text-sm">
                <thead>
                    <tr class="bg-muted/30 border-b">
                        <!-- User col — sortable by name -->
                        <th class="px-4 py-3 text-left">
                            <button
                                class="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-medium tracking-wide uppercase transition-colors"
                                @click="toggleSort('name')"
                            >
                                User
                                <Icon
                                    :icon="
                                        sortKey === 'name'
                                            ? sortDir === 'asc'
                                                ? 'lucide:arrow-up'
                                                : 'lucide:arrow-down'
                                            : 'lucide:arrow-up-down'
                                    "
                                    :class="sortKey === 'name' ? 'text-primary' : 'opacity-40'"
                                    class="h-3 w-3"
                                />
                            </button>
                        </th>

                        <!-- Email -->
                        <th
                            class="text-muted-foreground hidden px-4 py-3 text-left text-xs font-medium tracking-wide uppercase md:table-cell"
                        >
                            Email
                        </th>

                        <!-- Joined col — sortable -->
                        <th class="hidden px-4 py-3 text-left lg:table-cell">
                            <button
                                class="text-muted-foreground hover:text-foreground flex items-center gap-1 text-xs font-medium tracking-wide uppercase transition-colors"
                                @click="toggleSort('createdAt')"
                            >
                                Joined
                                <Icon
                                    :icon="
                                        sortKey === 'createdAt'
                                            ? sortDir === 'asc'
                                                ? 'lucide:arrow-up'
                                                : 'lucide:arrow-down'
                                            : 'lucide:arrow-up-down'
                                    "
                                    :class="sortKey === 'createdAt' ? 'text-primary' : 'opacity-40'"
                                    class="h-3 w-3"
                                />
                            </button>
                        </th>

                        <!-- Role col — inline filter dropdown -->
                        <th class="px-4 py-3 text-left">
                            <div class="flex items-center gap-1">
                                <span
                                    class="text-muted-foreground text-xs font-medium tracking-wide uppercase"
                                    >Role</span
                                >
                                <select
                                    v-model="filterRole"
                                    class="text-muted-foreground bg-muted hover:text-foreground ml-1 cursor-pointer rounded border-0 bg-transparent py-0 pr-5 pl-1 text-xs outline-none focus:ring-0"
                                >
                                    <option value="all">All</option>
                                    <option
                                        v-for="r in ROLES"
                                        :key="r"
                                        :value="r"
                                        class="capitalize"
                                    >
                                        {{ r }}
                                    </option>
                                </select>
                            </div>
                        </th>

                        <th
                            class="text-muted-foreground px-4 py-3 text-left text-xs font-medium tracking-wide uppercase"
                        >
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody class="divide-y">
                    <tr
                        v-for="user in paged"
                        :key="user.id"
                        class="hover:bg-muted/20 transition-colors"
                    >
                        <!-- User -->
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-3">
                                <div class="relative shrink-0">
                                    <img
                                        v-if="user.image"
                                        :src="user.image"
                                        :alt="user.name"
                                        class="h-9 w-9 rounded-full object-cover"
                                    />
                                    <div
                                        v-else
                                        class="bg-muted flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold uppercase"
                                    >
                                        {{ user.name.slice(0, 2) }}
                                    </div>
                                </div>
                                <div class="min-w-0">
                                    <p class="truncate font-medium">
                                        {{ user.name }}
                                    </p>
                                    <p class="text-muted-foreground truncate text-xs md:hidden">
                                        {{ user.email }}
                                    </p>
                                </div>
                            </div>
                        </td>

                        <!-- Email (hidden on mobile) -->
                        <td class="text-muted-foreground hidden px-4 py-3 md:table-cell">
                            <span class="block max-w-[200px] truncate">{{ user.email }}</span>
                        </td>

                        <!-- Joined (hidden on tablet) -->
                        <td class="text-muted-foreground hidden px-4 py-3 text-xs lg:table-cell">
                            {{
                                new Date(user.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric'
                                })
                            }}
                        </td>

                        <!-- Role badge -->
                        <td class="px-4 py-3">
                            <span
                                :class="[
                                    roleColor[user.role],
                                    'rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize'
                                ]"
                            >
                                {{ user.role }}
                            </span>
                        </td>

                        <!-- Role buttons -->
                        <td class="px-4 py-3">
                            <div class="flex flex-wrap gap-1.5">
                                <button
                                    v-for="r in ROLES"
                                    :key="r"
                                    :disabled="user.role === r || updating === user.id"
                                    :class="[
                                        'rounded-md px-2 py-0.5 text-xs font-medium transition-colors',
                                        user.role === r
                                            ? 'bg-muted text-muted-foreground cursor-default opacity-40'
                                            : 'bg-muted hover:bg-accent cursor-pointer'
                                    ]"
                                    @click="changeRole(user.id, r)"
                                >
                                    <Icon
                                        v-if="updating === user.id"
                                        icon="lucide:loader-2"
                                        class="inline h-3 w-3 animate-spin"
                                    />
                                    <span v-else class="capitalize">{{ r }}</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <AppPagination
            :page="page"
            :total-pages="totalPages"
            :page-numbers="pageNumbers"
            :from="from"
            :to="to"
            :total="totalFiltered"
            @update:page="page = $event"
        />
    </div>
</template>
