<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { watch } from 'vue'
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
const { isFieldDirty, handleSubmit, setErrors, setValues } = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: props.initialValues?.name ?? '',
        email: props.initialValues?.email ?? '',
        image: props.initialValues?.image || undefined
    }
})

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
    <div class="w-full flex-1">
        <!-- Error -->
        <Alert v-if="submitError" variant="destructive" class="mb-4">
            <Icon icon="lucide:circle-alert" class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{{ submitError }}</AlertDescription>
        </Alert>

        <!-- Success -->
        <Alert
            v-if="success"
            class="mb-4 border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
        >
            <Icon icon="lucide:check-circle" class="h-4 w-4" />
            <AlertTitle>Saved</AlertTitle>
            <AlertDescription>Your profile has been updated.</AlertDescription>
        </Alert>

        <Card class="rounded-2xl shadow-sm">
            <CardHeader class="pb-4">
                <CardTitle class="text-base font-semibold">Personal Information</CardTitle>
                <CardDescription>Update your name and email address</CardDescription>
            </CardHeader>
            <CardContent>
                <form class="space-y-5" @submit.prevent="onSubmit">
                    <fieldset :disabled="loading" class="space-y-5">
                        <!-- Name -->
                        <FormField
                            v-slot="{ componentField }"
                            name="name"
                            :validate-on-blur="!isFieldDirty"
                        >
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <div class="relative">
                                        <Icon
                                            icon="lucide:user"
                                            class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                                        />
                                        <Input
                                            type="text"
                                            placeholder="Your name"
                                            class="pl-9"
                                            v-bind="componentField"
                                        />
                                    </div>
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
                                <FormLabel>Email Address</FormLabel>
                                <FormControl>
                                    <div class="relative">
                                        <Icon
                                            icon="lucide:mail"
                                            class="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2"
                                        />
                                        <Input
                                            type="email"
                                            placeholder="you@example.com"
                                            class="pl-9"
                                            v-bind="componentField"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <!-- Actions -->
                        <div class="flex items-center justify-between gap-3 pt-2">
                            <Button
                                type="button"
                                variant="outline"
                                class="gap-2"
                                @click="router.back()"
                            >
                                <Icon icon="lucide:arrow-left" class="h-4 w-4" />
                                Cancel
                            </Button>
                            <Button type="submit" :disabled="loading" class="gap-2">
                                <Icon
                                    v-if="loading"
                                    icon="lucide:loader-2"
                                    class="h-4 w-4 animate-spin"
                                />
                                <Icon v-else icon="lucide:check" class="h-4 w-4" />
                                {{ submitLabel }}
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
