<script setup lang="ts">
//1.modules import
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import type { FetchError } from 'ofetch'
import { Button } from '@/components/ui/button'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { AlertCircle, ArrowLeft, LucideCirclePlus, LucideLoader2 } from 'lucide-vue-next'
import { InsertLocationSchema } from '~/lib/db/schema'

//2.modules init
const { $csrfFetch } = useNuxtApp()
definePageMeta({
    layout: 'dashboard-location'
})

const router = useRouter()
const submitError = ref('')
const loading = ref(false)
const submitted = ref(false)
const formSchema = toTypedSchema(InsertLocationSchema)
const { isFieldDirty, handleSubmit, meta } = useForm({
    validationSchema: formSchema
})


//3.methods
const onSubmit = handleSubmit(async (values) => {
    try {
        submitError.value = ''
        loading.value = true
        await $csrfFetch('/api/locations', {
            method: 'POST',
            body: values
        })
        submitted.value = true
        navigateTo(`/dashboard/locations`)
    } catch (e) {
        const error = e as FetchError
        console.log(error.data.data)
        console.error(error.statusMessage)
        submitError.value =
            error.data?.statusMessage ||
            error.statusMessage ||
            'An unknown error occurred'
    } finally {
        loading.value = false
    }
})

//4.events
onBeforeRouteLeave(() => {
    if (!submitted.value && meta.value.dirty) {
        const confirm = window.confirm('Are you sure you want to leave?')
        if (!confirm) {
            return false
        }
    }

    // mapStore.addedPoint = null
    return true
})

// onMounted(() => {
//     mapStore.addedPoint = {
//         id: '0',
//         name: '',
//         description: '',
//         lat: '0',
//         long: '1'
//     }
// })
</script>

<template>
    <section>
        <div class="mt-4 px-4">
            <div class="flex items-center justify-between">
                <div>
                    <h1 class="text-lg font-bold">Add Location</h1>
                    <p class="text-sm text-muted-foreground">
                        Add a new location here
                    </p>
                </div>
                <div>
                    <Button
                        :disabled="loading"
                        type="button"
                        variant="outline"
                        @click="router.back()"
                    >
                        <ArrowLeft class="w-4 h-4" /> Back
                    </Button>
                </div>
            </div>

            <div class="max-w-xl mx-auto">
                <Alert v-if="submitError" variant="destructive" class="mb-4">
                    <AlertCircle class="w-4 h-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>
                        {{ submitError }}
                    </AlertDescription>
                </Alert>
                <form class="space-y-6" @submit.prevent="onSubmit">
                    <fieldset :disabled="loading" class="space-y-6">
                        <FormField
                            v-slot="{ componentField }"
                            name="name"
                            :validate-on-blur="!isFieldDirty"
                            :disabled="loading"
                        >
                            <FormItem>
                                <FormLabel>Title</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Your Location Name"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField
                            v-slot="{ componentField }"
                            name="description"
                            :validate-on-blur="!isFieldDirty"
                        >
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Textarea
                                        placeholder="Type your description here."
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                        <FormField
                            v-slot="{ componentField }"
                            name="lat"
                            :validate-on-blur="!isFieldDirty"
                        >
                            <FormItem>
                                <FormLabel>Latitude</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Latitude"
                                        v-bind="componentField"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField
                            v-slot="{ componentField }"
                            name="long"
                            :validate-on-blur="!isFieldDirty"
                        >
                            <FormItem>
                                <FormLabel>Longitude</FormLabel>
                                <FormControl>
                                    <Input
                                        type="text"
                                        placeholder="Longitude"
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
                                Submit
                                <LucideLoader2
                                    v-if="loading"
                                    class="animate-spin"
                                />
                                <LucideCirclePlus v-else />
                            </Button>
                        </div>
                    </fieldset>
                </form>
            </div>
        </div>
    </section>
</template>
