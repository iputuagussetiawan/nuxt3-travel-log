<script setup lang="ts">
import { Icon } from '@iconify/vue'

definePageMeta({ layout: 'auth' })
useSeoMeta({
    title: 'Verify Email',
    description: 'Verify your Travel Log email address.'
})

const route = useRoute()
const error = route.query.error as string | undefined
const verified = !error
</script>

<template>
    <div class="text-center">
        <div v-if="verified">
            <div
                class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15"
            >
                <Icon
                    icon="lucide:mail-check"
                    class="h-8 w-8 text-emerald-500"
                />
            </div>
            <h1 class="text-xl font-bold">Email verified!</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                Your account is now active. You can sign in.
            </p>
            <NuxtLink to="/sign-in"
                ><Button class="mt-6">Sign In</Button></NuxtLink
            >
        </div>

        <div v-else>
            <div
                class="bg-destructive/15 mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            >
                <Icon icon="lucide:mail-x" class="text-destructive h-8 w-8" />
            </div>
            <h1 class="text-xl font-bold">Verification failed</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                {{
                    error === 'expired'
                        ? 'This verification link has expired.'
                        : 'This link is invalid or already used.'
                }}
            </p>
            <NuxtLink
                to="/sign-up"
                class="text-primary mt-4 inline-block text-sm underline-offset-4 hover:underline"
                >Create a new account</NuxtLink
            >
        </div>
    </div>
</template>
