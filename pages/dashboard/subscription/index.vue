<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Subscription', description: 'Upgrade to Travel Log Member' })

const authStore = useAuthStore()
const route = useRoute()
const { $csrfFetch } = useNuxtApp()

type Plan = { id: string; name: string; price: number; interval: string; isActive: boolean }
type ActiveSub = {
    subscription: { id: string; status: string; expiresAt: string; planId: string }
    plan: Plan
} | null

const { data: plans } = await useFetch<Plan[]>('/api/payment/plans')
const { data: activeSub, refresh: refreshStatus } = await useFetch<ActiveSub>('/api/payment/status')

const loading = ref<string | null>(null)
const error = ref('')

// Handle redirect back from Xendit
const paymentStatus = computed(() => route.query.status as string | undefined)

async function subscribe(planId: string) {
    loading.value = planId
    error.value = ''
    try {
        const res = await $csrfFetch<{ invoiceUrl: string }>('/api/payment/invoice', {
            method: 'POST',
            body: { planId }
        })
        window.location.href = res.invoiceUrl
    } catch (e: any) {
        error.value = e?.data?.statusMessage ?? 'Failed to create invoice. Please try again.'
        loading.value = null
    }
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0
    }).format(price)
}

function formatDate(date: string) {
    return new Date(date).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const monthlyPlan = computed(() => plans.value?.find((p) => p.id === 'monthly'))
const yearlyPlan = computed(() => plans.value?.find((p) => p.id === 'yearly'))

const yearlySavings = computed(() => {
    if (!monthlyPlan.value || !yearlyPlan.value) return 0
    const monthlyAnnual = monthlyPlan.value.price * 12
    return Math.round(((monthlyAnnual - yearlyPlan.value.price) / monthlyAnnual) * 100)
})
</script>

<template>
    <section class="p-6">
        <!-- Header -->
        <div class="mb-8 text-center">
            <h1 class="text-2xl font-bold">Upgrade to Member</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                Unlock location logging, travel journals, and full map access.
            </p>
        </div>

        <!-- Already member -->
        <div v-if="authStore.isMember && activeSub" class="mx-auto max-w-md">
            <div class="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 text-center">
                <div
                    class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15"
                >
                    <Icon icon="lucide:badge-check" class="h-8 w-8 text-emerald-500" />
                </div>
                <h2 class="text-lg font-bold">You're a Member!</h2>
                <p class="text-muted-foreground mt-1 text-sm">
                    {{ activeSub.plan.name }} — active until
                    <strong>{{ formatDate(activeSub.subscription.expiresAt) }}</strong>
                </p>
                <NuxtLink
                    to="/dashboard/locations"
                    class="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-400"
                >
                    <Icon icon="lucide:map-pin" class="h-4 w-4" />
                    Start Logging
                </NuxtLink>
            </div>
        </div>

        <!-- Payment success/failed banner -->
        <div
            v-else-if="paymentStatus === 'success'"
            class="mx-auto mb-6 max-w-md rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-center text-sm text-emerald-600 dark:text-emerald-400"
        >
            <Icon icon="lucide:check-circle" class="mr-1.5 inline h-4 w-4" />
            Payment received! Your membership will activate shortly.
        </div>
        <div
            v-else-if="paymentStatus === 'failed'"
            class="border-destructive/30 bg-destructive/10 text-destructive mx-auto mb-6 max-w-md rounded-xl border px-4 py-3 text-center text-sm"
        >
            <Icon icon="lucide:circle-alert" class="mr-1.5 inline h-4 w-4" />
            Payment failed or cancelled. Please try again.
        </div>

        <!-- Pricing cards -->
        <div v-else class="mx-auto max-w-2xl">
            <div
                v-if="error"
                class="border-destructive/30 bg-destructive/10 text-destructive mb-4 rounded-xl border px-4 py-3 text-sm"
            >
                {{ error }}
            </div>

            <div class="grid gap-4 sm:grid-cols-2">
                <!-- Monthly -->
                <div v-if="monthlyPlan" class="rounded-2xl border p-6">
                    <div class="mb-4">
                        <p
                            class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                        >
                            Monthly
                        </p>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span class="text-3xl font-bold">{{
                                formatPrice(monthlyPlan.price)
                            }}</span>
                            <span class="text-muted-foreground text-sm">/month</span>
                        </div>
                    </div>
                    <ul class="mb-6 space-y-2 text-sm">
                        <li class="flex items-center gap-2">
                            <Icon icon="lucide:check" class="h-4 w-4 shrink-0 text-emerald-500" />
                            Unlimited locations
                        </li>
                        <li class="flex items-center gap-2">
                            <Icon icon="lucide:check" class="h-4 w-4 shrink-0 text-emerald-500" />
                            Travel journal logs
                        </li>
                        <li class="flex items-center gap-2">
                            <Icon icon="lucide:check" class="h-4 w-4 shrink-0 text-emerald-500" />
                            Photo uploads
                        </li>
                        <li class="flex items-center gap-2">
                            <Icon icon="lucide:check" class="h-4 w-4 shrink-0 text-emerald-500" />
                            Interactive map
                        </li>
                    </ul>
                    <Button
                        class="w-full"
                        :disabled="loading !== null"
                        @click="subscribe('monthly')"
                    >
                        <Icon
                            v-if="loading === 'monthly'"
                            icon="lucide:loader-2"
                            class="h-4 w-4 animate-spin"
                        />
                        <span v-else>Subscribe Monthly</span>
                    </Button>
                </div>

                <!-- Yearly -->
                <div
                    v-if="yearlyPlan"
                    class="relative rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6"
                >
                    <div class="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span
                            class="rounded-full bg-emerald-500 px-3 py-0.5 text-xs font-semibold text-white"
                        >
                            Save {{ yearlySavings }}%
                        </span>
                    </div>
                    <div class="mb-4">
                        <p
                            class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
                        >
                            Yearly
                        </p>
                        <div class="mt-2 flex items-baseline gap-1">
                            <span class="text-3xl font-bold">{{
                                formatPrice(yearlyPlan.price)
                            }}</span>
                            <span class="text-muted-foreground text-sm">/year</span>
                        </div>
                        <p class="text-muted-foreground mt-0.5 text-xs">
                            {{ formatPrice(Math.round(yearlyPlan.price / 12)) }}/month billed yearly
                        </p>
                    </div>
                    <ul class="mb-6 space-y-2 text-sm">
                        <li class="flex items-center gap-2">
                            <Icon icon="lucide:check" class="h-4 w-4 shrink-0 text-emerald-500" />
                            Everything in Monthly
                        </li>
                        <li class="flex items-center gap-2">
                            <Icon icon="lucide:check" class="h-4 w-4 shrink-0 text-emerald-500" />
                            2 months free
                        </li>
                        <li class="flex items-center gap-2">
                            <Icon icon="lucide:check" class="h-4 w-4 shrink-0 text-emerald-500" />
                            Priority support
                        </li>
                    </ul>
                    <Button
                        class="w-full bg-emerald-500 hover:bg-emerald-400"
                        :disabled="loading !== null"
                        @click="subscribe('yearly')"
                    >
                        <Icon
                            v-if="loading === 'yearly'"
                            icon="lucide:loader-2"
                            class="h-4 w-4 animate-spin"
                        />
                        <span v-else>Subscribe Yearly</span>
                    </Button>
                </div>
            </div>

            <p class="text-muted-foreground mt-6 text-center text-xs">
                Payments powered by Xendit · Secure checkout · Cancel anytime
            </p>
        </div>
    </section>
</template>
