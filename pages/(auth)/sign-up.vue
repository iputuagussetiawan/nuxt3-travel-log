<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { z } from 'zod'

definePageMeta({ layout: 'auth' })
useSeoMeta({
    title: 'Create Account',
    description: 'Create your Travel Log account.'
})

const authStore = useAuthStore()

const schema = toTypedSchema(
    z
        .object({
            name: z.string().min(2, 'Name must be at least 2 characters'),
            email: z.string().email('Enter a valid email'),
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
    loading.value = true
    error.value = ''
    try {
        const res = await authStore.signUpEmail(
            values.name,
            values.email,
            values.password
        )
        if (res?.error) {
            error.value =
                res.error.message ?? 'Registration failed. Please try again.'
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
                class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/15"
            >
                <Icon
                    icon="lucide:mail-check"
                    class="h-8 w-8 text-emerald-500"
                />
            </div>
            <h1 class="text-xl font-bold">Check your email</h1>
            <p class="text-muted-foreground mt-2 text-sm">
                We sent a verification link to your email. Click it to activate
                your account.
            </p>
            <NuxtLink
                to="/sign-in"
                class="text-primary mt-6 inline-block text-sm underline-offset-4 hover:underline"
                >Back to sign in</NuxtLink
            >
        </div>

        <div v-else>
            <div class="mb-6 text-center">
                <h1 class="text-2xl font-bold">Create account</h1>
                <p class="text-muted-foreground mt-1 text-sm">
                    Start logging your adventures today
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
                    name="name"
                    :validate-on-blur="!isFieldDirty"
                >
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl
                            ><Input
                                type="text"
                                placeholder="Your Name"
                                v-bind="componentField"
                        /></FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

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

                <FormField
                    v-slot="{ componentField }"
                    name="password"
                    :validate-on-blur="!isFieldDirty"
                >
                    <FormItem>
                        <FormLabel>Password</FormLabel>
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
                                placeholder="Repeat password"
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
                    Create Account
                </Button>
            </form>

            <div class="my-5 flex items-center gap-3">
                <div class="bg-border h-px flex-1" />
                <span class="text-muted-foreground text-xs"
                    >or continue with</span
                >
                <div class="bg-border h-px flex-1" />
            </div>

            <div class="flex gap-3">
                <Button
                    variant="outline"
                    class="flex-1 gap-2"
                    :disabled="loading"
                    @click="authStore.signIn('github')"
                >
                    <Icon icon="mdi:github" class="h-4 w-4" /> GitHub
                </Button>
                <Button
                    variant="outline"
                    class="flex-1 gap-2"
                    :disabled="loading"
                    @click="authStore.signIn('google')"
                >
                    <Icon icon="mdi:google" class="h-4 w-4" /> Google
                </Button>
            </div>

            <p class="text-muted-foreground mt-6 text-center text-sm">
                Already have an account?
                <NuxtLink
                    to="/sign-in"
                    class="text-primary font-medium underline-offset-4 hover:underline"
                    >Sign in</NuxtLink
                >
            </p>
        </div>
    </div>
</template>
