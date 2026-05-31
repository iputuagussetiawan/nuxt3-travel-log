<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'auth' })
useSeoMeta({
    title: 'Verify Email',
    description: 'Verify your Travel Log email address.'
})

const route = useRoute()
const token = route.query.token as string | undefined
const errorParam = route.query.error as string | undefined

const status = ref<'loading' | 'success' | 'error'>('loading')
const errorMessage = ref('')

onMounted(async () => {
    if (errorParam) {
        status.value = 'error'
        errorMessage.value =
            errorParam === 'expired'
                ? 'This verification link has expired. Please request a new one.'
                : 'This link is invalid or already used.'
        return
    }

    // No error = better-auth already verified server-side and redirected here
    status.value = 'success'
    await navigateTo('/dashboard')
})
</script>

<template>
    <div class="text-center">
        <!-- Loading -->
        <div v-if="status === 'loading'">
            <div
                class="bg-primary/10 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            >
                <Icon
                    icon="lucide:loader-2"
                    class="text-primary h-8 w-8 animate-spin"
                />
            </div>
            <h1 class="text-xl font-bold">Verifying your email…</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                Please wait a moment.
            </p>
        </div>

        <!-- Success -->
        <div v-else-if="status === 'success'">
            <div
                class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15"
            >
                <Icon
                    icon="lucide:circle-check"
                    class="h-8 w-8 text-emerald-500"
                />
            </div>
            <h1 class="text-xl font-bold">Email verified!</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                Your account is active. Redirecting to dashboard…
            </p>
            <NuxtLink to="/dashboard">
                <Button class="mt-6">Go to Dashboard</Button>
            </NuxtLink>
        </div>

        <!-- Error -->
        <div v-else>
            <div
                class="bg-destructive/15 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            >
                <Icon icon="lucide:mail-x" class="text-destructive h-8 w-8" />
            </div>
            <h1 class="text-xl font-bold">Verification failed</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                {{ errorMessage }}
            </p>
            <div class="mt-6 flex flex-col items-center gap-3">
                <NuxtLink to="/sign-in">
                    <Button>Sign In</Button>
                </NuxtLink>
                <NuxtLink
                    to="/sign-up"
                    class="text-muted-foreground hover:text-foreground text-sm underline-offset-4 hover:underline"
                >
                    Create a new account
                </NuxtLink>
            </div>
        </div>
    </div>
</template>
