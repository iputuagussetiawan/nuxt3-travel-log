<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref, computed, watch } from 'vue'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Icon } from '@iconify/vue'
import { InsertUserSchema, type InsertUserType } from '~/lib/db/schema'
import type { FetchError } from 'ofetch'
import getFetchErrorMessage from '~/lib/get-fetch-error-message'

const router = useRouter()

const props = defineProps<{
    initialValues?: InsertUserType | null
    onSubmit: (user: InsertUserType) => Promise<any>
    onSubmitComplete: () => void
    submitLabel: string
    submitIcon: string
}>()

const submitError = ref('')
const loading = ref(false)
const success = ref(false)

const formSchema = toTypedSchema(InsertUserSchema)
const { isFieldDirty, handleSubmit, setErrors, setValues, values } = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: props.initialValues?.name ?? '',
        email: props.initialValues?.email ?? '',
        image: props.initialValues?.image || undefined
    }
})

// Re-populate when initialValues arrive (async session load)
watch(
    () => props.initialValues,
    (val) => {
        if (val) {
            setValues({
                name: val.name ?? '',
                email: val.email ?? '',
                image: val.image || undefined
            })
        }
    },
    { immediate: true }
)

const avatarPreview = computed(
    () => values.image || props.initialValues?.image || ''
)
const initials = computed(() => {
    const name = values.name || props.initialValues?.name || ''
    return name.slice(0, 2).toUpperCase()
})

const onSubmit = handleSubmit(async (vals: InsertUserType) => {
    try {
        submitError.value = ''
        success.value = false
        loading.value = true
        await props.onSubmit(vals)
        success.value = true
        props.onSubmitComplete()
    } catch (e) {
        const error = e as FetchError
        if (error.data?.data) setErrors(error.data.data)
        submitError.value = getFetchErrorMessage(error)
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="w-full max-w-lg">
        <Alert v-if="submitError" variant="destructive" class="mb-4">
            <Icon icon="lucide:circle-alert" class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{{ submitError }}</AlertDescription>
        </Alert>

        <Alert
            v-if="success"
            class="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
            <Icon icon="lucide:check-circle" class="h-4 w-4" />
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>Your profile has been updated.</AlertDescription>
        </Alert>

        <Card class="rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription
                    >Manage your personal information</CardDescription
                >
            </CardHeader>
            <CardContent>
                <form class="space-y-5" @submit.prevent="onSubmit">
                    <fieldset :disabled="loading" class="space-y-5">
                        <!-- Avatar preview -->
                        <div class="flex items-center gap-4">
                            <Avatar class="h-16 w-16">
                                <AvatarImage
                                    v-if="avatarPreview"
                                    :src="avatarPreview"
                                    alt="Avatar preview"
                                />
                                <AvatarFallback class="text-lg">{{
                                    initials
                                }}</AvatarFallback>
                            </Avatar>
                            <div class="min-w-0 flex-1">
                                <p class="text-sm font-medium">
                                    Profile picture
                                </p>
                                <p class="text-muted-foreground text-xs">
                                    Paste an image URL below
                                </p>
                            </div>
                        </div>

                        <!-- Image URL -->
                        <FormField
                            v-slot="{ componentField }"
                            name="image"
                            :validate-on-blur="!isFieldDirty"
                        >
                            <FormItem>
                                <FormLabel>Image URL</FormLabel>
                                <FormControl>
                                    <Input
                                        type="url"
                                        placeholder="https://example.com/avatar.jpg"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <!-- Name -->
                        <FormField
                            v-slot="{ componentField }"
                            name="name"
                            :validate-on-blur="!isFieldDirty"
                        >
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Your Name"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <!-- Email -->
                        <FormField
                            v-slot="{ componentField }"
                            name="email"
                            :validate-on-blur="!isFieldDirty"
                        >
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type="email"
                                        placeholder="you@example.com"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <div class="flex justify-between pt-1">
                            <Button
                                type="button"
                                variant="outline"
                                @click="router.back()"
                            >
                                Cancel
                            </Button>
                            <Button type="submit" :disabled="loading">
                                <Icon
                                    v-if="loading"
                                    icon="lucide:loader-2"
                                    class="h-4 w-4 animate-spin"
                                />
                                <Icon
                                    v-else
                                    icon="lucide:check"
                                    class="h-4 w-4"
                                />
                                {{ submitLabel }}
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
