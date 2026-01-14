<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { InsertUserSchema, type InsertUserType } from '~/lib/db/schema'
import type { FetchError } from 'ofetch'
import getFetchErrorMessage from '~/lib/get-fetch-error-message'
import { ArrowRight, LucideCirclePlus } from 'lucide-vue-next'

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
const submitted = ref(false)

const formSchema = toTypedSchema(InsertUserSchema)
const { isFieldDirty, handleSubmit, setErrors } = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: props.initialValues?.name || '',
        email: props.initialValues?.email || '',
        image: props.initialValues?.image || ''
    }
})

const onSubmit = handleSubmit(async (values: InsertUserType) => {
    try {
        submitError.value = ''
        loading.value = true
        await props.onSubmit(values)
        submitted.value = true
        props.onSubmitComplete()
    } catch (e) {
        const error = e as FetchError
        if (error.data?.data) {
            setErrors(error.data.data)
        }
        submitError.value = getFetchErrorMessage(error)
    } finally {
        loading.value = false
    }
})

const SubmitIcon = computed(() => {
    return props.submitIcon === 'add-user-icon' ? LucideCirclePlus : ArrowRight
})
</script>

<template>
    <div>
        <Alert v-if="submitError" variant="destructive" class="mb-4">
            <AlertCircle class="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {{ submitError }}
            </AlertDescription>
        </Alert>
        <Card class="w-full max-w-lg rounded-2xl shadow-sm">
            <CardHeader>
                <CardTitle>Update Profile</CardTitle>
                <CardDescription
                    >Manage your personal information</CardDescription
                >
            </CardHeader>
            <CardContent>
                <form class="space-y-6" @submit.prevent="onSubmit">
                    <fieldset :disabled="loading" class="space-y-6">
                        <FormField
                            v-slot="{ componentField }"
                            name="name"
                            :validate-on-blur="!isFieldDirty"
                            :disabled="loading"
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
                                        placeholder="Email"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <div class="flex justify-between">
                            <Button
                                :disabled="loading"
                                type="button"
                                variant="outline"
                                @click="router.back()"
                            >
                                Cancel
                            </Button>
                            <Button :disabled="loading" type="submit">
                                {{ submitLabel }}
                                <LucideLoader2
                                    v-if="loading"
                                    class="animate-spin"
                                />
                                <component
                                    v-else
                                    :is="SubmitIcon"
                                    class="h-4 w-4"
                                />
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </CardContent>
        </Card>
    </div>
</template>
