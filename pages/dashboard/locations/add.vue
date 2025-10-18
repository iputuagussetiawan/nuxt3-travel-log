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
import {
    AlertCircle,
    ArrowLeft,
    LucideCirclePlus,
    LucideLoader2
} from 'lucide-vue-next'
import { InsertLocationSchema } from '~/lib/db/schema'
import { MAP_INPUT_CENTER } from '~/lib/constants'

//2.modules init
const mapStoreTwo = useMapStoreTwo()
const { $csrfFetch } = useNuxtApp()
definePageMeta({
    layout: 'dashboard-location'
})

const router = useRouter()
const submitError = ref('')
const loading = ref(false)
const submitted = ref(false)
const formSchema = toTypedSchema(InsertLocationSchema)
const { isFieldDirty, handleSubmit, meta, setFieldValue, controlledValues } =
    useForm({
        validationSchema: formSchema,
        initialValues: {
            name: '',
            description: '',
            lat: MAP_INPUT_CENTER[0].toString(),
            long: MAP_INPUT_CENTER[1].toString()
        }
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

    mapStoreTwo.addedPoint = null
    return true
})

effect(() => {
    if (mapStoreTwo.addedPoint) {
        setFieldValue('lat', String(mapStoreTwo.addedPoint.lat))
        setFieldValue('long', String(mapStoreTwo.addedPoint.long))
    }
})

onMounted(() => {
    mapStoreTwo.addedPoint = {
        id: 'input-only',
        name: 'Added Point',
        description: '',
        lat: MAP_INPUT_CENTER[0].toString(),
        long: MAP_INPUT_CENTER[1].toString()
    }
    mapStoreTwo.flyToMarker(mapStoreTwo.addedPoint, 5)
})
</script>

<template>
    <div
        class="border-border bg-card/90 supports-[backdrop-filter]:bg-card/60 absolute top-0 left-4 z-[2000] mt-4 w-[400px] rounded-2xl border px-6 py-8 shadow-md backdrop-blur-md dark:shadow-lg"
    >
        <div class="flex items-center justify-between">
            <div>
                <h1 class="text-lg font-bold">Add Location</h1>
                <p class="text-muted-foreground text-sm">
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
                    <ArrowLeft class="h-4 w-4" /> Back
                </Button>
            </div>
        </div>

        <div class="mt-6">
            <Alert v-if="submitError" variant="destructive" class="mb-4">
                <AlertCircle class="h-4 w-4" />
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

                    <p class="text-muted-foreground text-sm">
                        Drug the
                        <svg
                            class="inline h-[20px] w-[20px]"
                            width="30"
                            height="30"
                            viewBox="0 0 30 30"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <g clip-path="url(#clip0_2001_8)">
                                <path
                                    fill-rule="evenodd"
                                    clip-rule="evenodd"
                                    d="M23.75 12.25C23.75 17.1981 17.0785 23.2262 15.3865 24.6756C15.1624 24.8675 14.8376 24.8675 14.6135 24.6756C12.9215 23.2262 6.25 17.1981 6.25 12.25C6.25 7.55558 10.1675 3.75 15 3.75C19.8325 3.75 23.75 7.55558 23.75 12.25Z"
                                    stroke="#0982CD"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                                <path
                                    d="M15 15C16.3807 15 17.5 13.8807 17.5 12.5C17.5 11.1193 16.3807 10 15 10C13.6193 10 12.5 11.1193 12.5 12.5C12.5 13.8807 13.6193 15 15 15Z"
                                    stroke="#0982CD"
                                    stroke-width="2"
                                    stroke-linecap="round"
                                />
                            </g>
                            <defs>
                                <clipPath id="clip0_2001_8">
                                    <rect width="30" height="30" fill="white" />
                                </clipPath>
                            </defs>
                        </svg>
                        marker to your location
                    </p>

                    <p class="text-muted-foreground text-xs">
                        Lat: {{ controlledValues.lat }} , Long:
                        {{ controlledValues.long }}
                    </p>

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
</template>
