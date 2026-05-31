<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'User Management' })

const ROLES = ['user', 'member', 'admin'] as const
type Role = (typeof ROLES)[number]

const { data: users, refresh } =
    await useFetch<
        {
            id: string
            name: string
            email: string
            image: string | null
            role: Role
            createdAt: string
        }[]
    >('/api/admin/users')

const updating = ref<string | null>(null)

async function changeRole(userId: string, role: Role) {
    updating.value = userId
    try {
        await $fetch(`/api/admin/users/${userId}/role`, {
            method: 'PUT',
            body: { role }
        })
        await refresh()
    } catch {
        // silently ignore — UI reverts on refresh
    } finally {
        updating.value = null
    }
}

const roleColor: Record<Role, string> = {
    user: 'bg-zinc-500/15 text-zinc-400',
    member: 'bg-emerald-500/15 text-emerald-400',
    admin: 'bg-violet-500/15 text-violet-400'
}
</script>

<template>
    <div class="p-6">
        <div class="mb-6">
            <h1 class="text-xl font-bold">User Management</h1>
            <p class="text-muted-foreground mt-1 text-sm">
                Manage roles for all users. Members can log locations; admins
                have full access.
            </p>
        </div>

        <div class="rounded-xl border">
            <table class="w-full text-sm">
                <thead>
                    <tr class="border-b">
                        <th
                            class="text-muted-foreground px-4 py-3 text-left font-medium"
                        >
                            User
                        </th>
                        <th
                            class="text-muted-foreground px-4 py-3 text-left font-medium"
                        >
                            Email
                        </th>
                        <th
                            class="text-muted-foreground px-4 py-3 text-left font-medium"
                        >
                            Joined
                        </th>
                        <th
                            class="text-muted-foreground px-4 py-3 text-left font-medium"
                        >
                            Role
                        </th>
                        <th
                            class="text-muted-foreground px-4 py-3 text-left font-medium"
                        >
                            Change Role
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="user in users"
                        :key="user.id"
                        class="hover:bg-muted/30 border-b transition-colors last:border-0"
                    >
                        <td class="px-4 py-3">
                            <div class="flex items-center gap-3">
                                <img
                                    v-if="user.image"
                                    :src="user.image"
                                    :alt="user.name"
                                    class="h-8 w-8 rounded-full object-cover"
                                />
                                <div
                                    v-else
                                    class="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold uppercase"
                                >
                                    {{ user.name.charAt(0) }}
                                </div>
                                <span class="font-medium">{{ user.name }}</span>
                            </div>
                        </td>
                        <td class="text-muted-foreground px-4 py-3">
                            {{ user.email }}
                        </td>
                        <td class="text-muted-foreground px-4 py-3">
                            {{ new Date(user.createdAt).toLocaleDateString() }}
                        </td>
                        <td class="px-4 py-3">
                            <span
                                :class="[
                                    roleColor[user.role],
                                    'rounded-full px-2.5 py-0.5 text-xs font-medium'
                                ]"
                            >
                                {{ user.role }}
                            </span>
                        </td>
                        <td class="px-4 py-3">
                            <div class="flex gap-1.5">
                                <button
                                    v-for="r in ROLES"
                                    :key="r"
                                    :disabled="
                                        user.role === r || updating === user.id
                                    "
                                    :class="[
                                        'rounded-lg px-2.5 py-1 text-xs font-medium transition-colors',
                                        user.role === r
                                            ? 'bg-muted text-muted-foreground cursor-default opacity-40'
                                            : 'bg-muted hover:bg-muted/80 cursor-pointer'
                                    ]"
                                    @click="changeRole(user.id, r)"
                                >
                                    <Icon
                                        v-if="updating === user.id"
                                        icon="lucide:loader-2"
                                        class="inline h-3 w-3 animate-spin"
                                    />
                                    <span v-else>{{ r }}</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
