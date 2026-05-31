<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Manage Plans' })

const { $csrfFetch } = useNuxtApp()

type Plan = { id: string; name: string; price: number; interval: string; isActive: boolean }

const { data: plans, refresh } = await useFetch<Plan[]>('/api/payment/plans')

const editing = ref<string | null>(null)
const editValues = ref<{ name: string; price: string }>({ name: '', price: '' })
const saving = ref(false)

function startEdit(plan: Plan) {
    editing.value = plan.id
    editValues.value = { name: plan.name, price: String(plan.price) }
}

function cancelEdit() {
    editing.value = null
}

async function saveEdit(id: string) {
    saving.value = true
    try {
        await $csrfFetch(`/api/admin/plans/${id}`, {
            method: 'PUT',
            body: {
                name: editValues.value.name,
                price: parseInt(editValues.value.price)
            }
        })
        await refresh()
        editing.value = null
    } finally {
        saving.value = false
    }
}

async function toggleActive(plan: Plan) {
    await $csrfFetch(`/api/admin/plans/${plan.id}`, {
        method: 'PUT',
        body: { isActive: !plan.isActive }
    })
    await refresh()
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(price)
}
</script>

<template>
    <section class="p-6">
        <div class="mb-6">
            <h1 class="text-xl font-bold">Subscription Plans</h1>
            <p class="text-muted-foreground mt-1 text-sm">
                Manage pricing for member subscriptions.
            </p>
        </div>

        <div class="grid max-w-2xl gap-4 sm:grid-cols-2">
            <div v-for="plan in plans" :key="plan.id" class="rounded-2xl border p-5">
                <!-- View mode -->
                <div v-if="editing !== plan.id">
                    <div class="mb-3 flex items-center justify-between">
                        <span
                            class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                        >
                            {{ plan.interval === 'month' ? 'Monthly' : 'Yearly' }}
                        </span>
                        <span
                            :class="
                                plan.isActive
                                    ? 'bg-emerald-500/10 text-emerald-500'
                                    : 'bg-zinc-500/10 text-zinc-500'
                            "
                            class="rounded-full px-2.5 py-0.5 text-xs font-semibold"
                        >
                            {{ plan.isActive ? 'Active' : 'Inactive' }}
                        </span>
                    </div>
                    <p class="mb-1 font-semibold">{{ plan.name }}</p>
                    <p class="text-2xl font-bold">{{ formatPrice(plan.price) }}</p>
                    <p class="text-muted-foreground mt-0.5 text-xs">per {{ plan.interval }}</p>

                    <div class="mt-4 flex gap-2">
                        <Button
                            size="sm"
                            variant="outline"
                            class="gap-1.5"
                            @click="startEdit(plan)"
                        >
                            <Icon icon="lucide:pencil" class="h-3.5 w-3.5" />
                            Edit
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            :class="plan.isActive ? 'text-destructive hover:text-destructive' : ''"
                            @click="toggleActive(plan)"
                        >
                            {{ plan.isActive ? 'Deactivate' : 'Activate' }}
                        </Button>
                    </div>
                </div>

                <!-- Edit mode -->
                <div v-else class="space-y-3">
                    <div>
                        <label class="mb-1 block text-xs font-medium">Plan Name</label>
                        <Input v-model="editValues.name" placeholder="e.g. Monthly Member" />
                    </div>
                    <div>
                        <label class="mb-1 block text-xs font-medium">Price (IDR)</label>
                        <Input v-model="editValues.price" type="number" placeholder="e.g. 29000" />
                    </div>
                    <div class="flex gap-2">
                        <Button
                            size="sm"
                            :disabled="saving"
                            @click="saveEdit(plan.id)"
                            class="gap-1.5"
                        >
                            <Icon
                                v-if="saving"
                                icon="lucide:loader-2"
                                class="h-3.5 w-3.5 animate-spin"
                            />
                            <Icon v-else icon="lucide:check" class="h-3.5 w-3.5" />
                            Save
                        </Button>
                        <Button size="sm" variant="outline" @click="cancelEdit()">Cancel</Button>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>
