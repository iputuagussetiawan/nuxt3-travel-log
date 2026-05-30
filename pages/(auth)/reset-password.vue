<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })
useSeoMeta({
    title: 'Reset Password',
    description: 'Set a new password for your account.'
})

const authStore = useAuthStore()
const route = useRoute()
const token = computed(() => route.query.token as string | undefined)

const schema = toTypedSchema(
    z
        .object({
            password: z
                .string()
                .min(8, 'Password must be at least 8 characters'),
            confirmPassword: z.string()
        })
        .refine((d) => d.password === d.confirmPassword, {
            message: 'Passwords do not match',
            path: ['confirmPassword']
        })
)

const { handleSubmit, isFieldDirty } = useForm({ validationSchema: schema })

const loading = ref(false)
const error = ref('')
const success = ref(false)
const showPassword = ref(false)

const onSubmit = handleSubmit(async (values) => {
    if (!token.value) {
        error.value = 'Invalid or expired reset link.'
        return
    }
    loading.value = true
    error.value = ''
    try {
        const res = await authStore.resetPassword(values.password, token.value)
        if ((res as any)?.error) {
            error.value =
                (res as any).error.message ??
                'Reset failed. The link may have expired.'
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
        <div v-if="!token" class="text-center">
            <Icon
                icon="lucide:link-2-off"
                class="text-muted-foreground/50 mx-auto mb-3 h-12 w-12"
            />
            <h1 class="text-xl font-bold">Invalid link</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                This reset link is invalid or has expired.
            </p>
            <NuxtLink
                to="/forgot-password"
                class="text-primary mt-6 inline-block text-sm underline-offset-4 hover:underline"
                >Request a new link</NuxtLink
            >
        </div>

        <div v-else-if="success" class="text-center">
            <div
                class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15"
            >
                <Icon
                    icon="lucide:check-circle"
                    class="h-8 w-8 text-emerald-500"
                />
            </div>
            <h1 class="text-xl font-bold">Password updated</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                Your password has been reset successfully.
            </p>
            <NuxtLink to="/sign-in"
                ><Button class="mt-6">Sign In</Button></NuxtLink
            >
        </div>

        <div v-else>
            <div class="mb-6 text-center">
                <h1 class="text-2xl font-bold">Reset password</h1>
                <p class="text-muted-foreground mt-1 text-sm">
                    Enter your new password below
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
                    name="password"
                    :validate-on-blur="!isFieldDirty"
                >
                    <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                            <div class="relative">
                                <Input
                                    :type="showPassword ? 'text' : 'password'"
                                    placeholder="Min. 8 characters"
                                    v-bind="componentField"
                                    class="pr-10"
                                />
                                <button
                                    type="button"
                                    class="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
                                    @click="showPassword = !showPassword"
                                >
                                    <Icon
                                        :icon="
                                            showPassword
                                                ? 'lucide:eye-off'
                                                : 'lucide:eye'
                                        "
                                        class="h-4 w-4"
                                    />
                                </button>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField
                    v-slot="{ componentField }"
                    name="confirmPassword"
                    :validate-on-blur="!isFieldDirty"
                >
                    <FormItem>
                        <FormLabel>Confirm Password</FormLabel>
                        <FormControl
                            ><Input
                                type="password"
                                placeholder="Repeat new password"
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
                    Update Password
                </Button>
            </form>
        </div>
    </div>
</template>
