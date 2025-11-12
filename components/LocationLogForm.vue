<script setup lang="ts">
//1.modules import
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '~/components/ui/alert'
import { AlertCircle, ArrowRight } from 'lucide-vue-next'
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { LucideCirclePlus, LucideLoader2 } from 'lucide-vue-next'
import {
    InsertLocationLogSchema,
    type InsertLocationLogType
} from '~/lib/db/schema'
import { MAP_INPUT_CENTER } from '~/lib/constants'
import type { FetchError } from 'ofetch'
import getFetchErrorMessage from '~/lib/get-fetch-error-message'
import {
    CalendarDate,
    today,
    getLocalTimeZone,
    parseDate,
    fromDate
} from '@internationalized/date'
import DatePickerField from '@/components/DatePickerField.vue'

const props = defineProps<{
    initialValues?: InsertLocationLogType | null
    onSubmit: (location: InsertLocationLogType) => Promise<any>
    onSubmitComplete: () => void
    submitLabel: string
    submitIcon: string
}>()

//2.modules init
const mapStore = useMapStore()
definePageMeta({
    layout: 'dashboard-location'
})

const router = useRouter()
const submitError = ref('')
const loading = ref(false)
const submitted = ref(false)

//3.methods
const formSchema = toTypedSchema(InsertLocationLogSchema)
const {
    isFieldDirty,
    handleSubmit,
    setErrors,
    meta,
    setFieldValue,
    controlledValues
} = useForm({
    validationSchema: formSchema,
    initialValues: {
        slug: props.initialValues?.slug || '',
        name: props.initialValues?.name || '',
        description: props.initialValues?.description || '',
        startedAt: props.initialValues?.startedAt || '2020-01-07',
        endedAt: props.initialValues?.endedAt || '2020-01-08',
        lat: props.initialValues?.lat || MAP_INPUT_CENTER[0].toString(),
        long: props.initialValues?.long || MAP_INPUT_CENTER[1].toString()
    }
})

//3.methods
const onSubmit = handleSubmit(async (values: InsertLocationLogType) => {
    try {
        submitError.value = ''
        loading.value = true
        await props.onSubmit(values)
        submitted.value = true
        props.onSubmitComplete()
        // navigateTo('/dashboard/locations')
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

effect(() => {
    if (mapStore.addedPoint) {
        setFieldValue('lat', String(mapStore.addedPoint.lat))
        setFieldValue('long', String(mapStore.addedPoint.long))
    }
})

onMounted(() => {
    mapStore.addedPoint = {
        id: 'input-only',
        slug: 'input-only',
        name: 'Added Point',
        description: '',
        lat: props.initialValues?.lat
            ? props.initialValues.lat.toString()
            : MAP_INPUT_CENTER[0].toString(),
        long: props.initialValues?.long
            ? props.initialValues.long.toString()
            : MAP_INPUT_CENTER[1].toString()
    }
    // mapStore.flyToMarker(mapStore.addedPoint, props.initialValues?.lat ? 5 : 5)
})

const SubmitIcon = computed(() => {
    return props.submitIcon === 'add-location-icon'
        ? LucideCirclePlus
        : ArrowRight
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

                <DatePickerField name="startedAt" label="Start At" />

                <DatePickerField name="endedAt" label="End At" />

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
                        {{ submitLabel }}
                        <LucideLoader2 v-if="loading" class="animate-spin" />
                        <component v-else :is="SubmitIcon" class="h-4 w-4" />
                    </Button>
                </div>
            </fieldset>
        </form>
    </div>
</template>
<style lang="scss" scoped></style>
