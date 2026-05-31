<!-- components/DatePickerField.vue -->
<script setup lang="ts">
import { CalendarDate, DateFormatter, parseDate } from '@internationalized/date'
import { toDate } from 'reka-ui/date'
import { ref, computed } from 'vue'
import { useField } from 'vee-validate'
import { CalendarIcon } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '~/lib/utils'

const props = defineProps<{
    name: string
    label: string
    minDate?: CalendarDate
    maxDate?: CalendarDate
    placeholder?: string
}>()

// Connect to VeeValidate field
const { value: modelValue } = useField<string | undefined>(props.name)

// Date formatting
const df = new DateFormatter('en-US', {
    dateStyle: 'long'
})

// Popover and placeholder
const isOpen = ref(false)
const placeholder = props.placeholder ?? 'Pick a date'

const parsedDate = computed({
    get: () => (modelValue.value ? parseDate(modelValue.value) : undefined),
    set: (val: CalendarDate | undefined) => {
        modelValue.value = val?.toString()
    }
})

const onSelect = (v: CalendarDate | undefined) => {
    parsedDate.value = v
    isOpen.value = false
}
</script>

<template>
    <FormField :name="name">
        <FormItem>
            <FormLabel>{{ label }}</FormLabel>
            <Popover v-model:open="isOpen">
                <PopoverTrigger as-child>
                    <FormControl>
                        <Button
                            variant="outline"
                            :class="
                                cn(
                                    'w-[240px] ps-3 text-start font-normal',
                                    !parsedDate && 'text-muted-foreground'
                                )
                            "
                        >
                            <span>
                                {{ parsedDate ? df.format(toDate(parsedDate)) : placeholder }}
                            </span>
                            <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                        </Button>
                    </FormControl>
                </PopoverTrigger>
                <PopoverContent class="z-[7000] w-auto p-0">
                    <Calendar
                        :model-value="parsedDate"
                        :min-value="minDate"
                        :max-value="maxDate"
                        @update:model-value="onSelect as any"
                    />
                </PopoverContent>
            </Popover>
            <FormMessage />
        </FormItem>
    </FormField>
</template>
