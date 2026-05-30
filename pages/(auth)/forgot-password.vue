<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })
useSeoMeta({
    title: 'Forgot Password',
    description: 'Reset your Travel Log password.'
})

const authStore = useAuthStore()

const schema = toTypedSchema(
    z.object({
        email: z.string().email('Enter a valid email')
    })
)

const { handleSubmit, isFieldDirty } = useForm({ validationSchema: schema })

const loading = ref(false)
const error = ref('')
const success = ref(false)

const onSubmit = handleSubmit(async (values) => {
    loading.value = true
    error.value = ''
    try {
        const res = await authStore.forgotPassword(values.email)
        if ((res as any)?.error) {
            error.value =
                (res as any).error.message ?? 'Failed to send reset email.'
        } else {
            success.value = true
        }
    } catch {
        error.value = 'Something went wrong. Please try again.'
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div>
        <div v-if="success" class="text-center">
            <div
                class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-violet-500/15"
            >
                <Icon icon="lucide:mail" class="h-8 w-8 text-violet-500" />
            </div>
            <h1 class="text-xl font-bold">Check your email</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                We sent a password reset link. It expires in 1 hour.
            </p>
            <NuxtLink
                to="/sign-in"
                class="text-primary mt-6 inline-block text-sm underline-offset-4 hover:underline"
                >Back to sign in</NuxtLink
            >
        </div>

        <div v-else>
            <div class="mb-6 text-center">
                <div
                    class="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-violet-500/15"
                >
                    <Icon
                        icon="lucide:lock-keyhole"
                        class="h-6 w-6 text-violet-500"
                    />
                </div>
                <h1 class="text-2xl font-bold">Forgot password?</h1>
                <p class="text-muted-foreground mt-1 text-sm">
                    Enter your email and we'll send you a reset link
                </p>
            </div>

            <div
                v-if="error"
                class="border-destructive/30 bg-destructive/10 text-destructive mb-4 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm"
            >
                <Icon icon="lucide:circle-alert" class="h-4 w-4 shrink-0" />
                {{ error }}
            </div>

            <form class="space-y-4" @submit.prevent="onSubmit">
                <FormField
                    v-slot="{ componentField }"
                    name="email"
                    :validate-on-blur="!isFieldDirty"
                >
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl
                            ><Input
                                type="email"
                                placeholder="you@example.com"
                                v-bind="componentField"
                        /></FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <Button type="submit" class="w-full" :disabled="loading">
                    <Icon
                        v-if="loading"
                        icon="lucide:loader-2"
                        class="h-4 w-4 animate-spin"
                    />
                    Send Reset Link
                </Button>
            </form>

            <p class="text-muted-foreground mt-6 text-center text-sm">
                Remember your password?
                <NuxtLink
                    to="/sign-in"
                    class="text-primary font-medium underline-offset-4 hover:underline"
                    >Sign in</NuxtLink
                >
            </p>
        </div>
    </div>
</template>
