<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import { CalendarDate, today, getLocalTimeZone } from '@internationalized/date'
import DatePickerField from '@/components/DatePickerField.vue'
import { Button } from '@/components/ui/button'

const formSchema = toTypedSchema(
    z.object({
        startAt: z.string().min(1, 'Start At is required'),
        endedAt: z.string().min(1, 'End At is required')
    })
)

const { handleSubmit } = useForm({
    validationSchema: formSchema
})

const onSubmit = handleSubmit((values) => {
    console.log('Form values:', values)
})
</script>

<template>
    <form class="space-y-8" @submit="onSubmit">
        <DatePickerField
            name="startAt"
            label="Start At"
            :minDate="new CalendarDate(1900, 1, 1)"
            :maxDate="today(getLocalTimeZone())"
        />

        <DatePickerField
            name="endedAt"
            label="End At"
            :minDate="new CalendarDate(1900, 1, 1)"
            :maxDate="today(getLocalTimeZone())"
        />
        <Button type="submit">Submit</Button>
    </form>
</template>
