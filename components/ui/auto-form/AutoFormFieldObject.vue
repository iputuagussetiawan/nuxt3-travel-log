<script setup lang="ts" generic="T extends ZodRawShape">
import type { ZodAny, ZodObject, ZodRawShape } from 'zod'
import type { Config, ConfigItem, Shape } from './interface'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger
} from '@/components/ui/accordion'
import { FormItem } from '@/components/ui/form'
import { FieldContextKey, useField } from 'vee-validate'
import { computed, provide } from 'vue'
import AutoFormField from './AutoFormField.vue'
import AutoFormLabel from './AutoFormLabel.vue'
import {
    beautifyObjectName,
    getBaseSchema,
    getBaseType,
    getDefaultValueInZodStack
} from './utils'

const props = defineProps<{
    fieldName: string
    required?: boolean
    config?: Config<T>
    schema?: ZodObject<T>
    disabled?: boolean
}>()

const shapes = computed(() => {
    // @ts-expect-error ignore {} not assignable to object
    const val: { [key in keyof T]: Shape } = {}

    if (!props.schema) return
    const base = getBaseSchema(props.schema) as ZodObject<T> | null
    const shape = base?._def?.shape ?? base?.shape
    if (!shape) return
    Object.keys(shape).forEach((name) => {
        const item = shape[name] as ZodAny
        const baseItem = getBaseSchema(item) as ZodAny
        let options =
            baseItem && 'entries' in (baseItem._def as any)
                ? Object.values(
                      (baseItem._def as any).entries as Record<string, string>
                  )
                : undefined
        if (!Array.isArray(options) && typeof options === 'object')
            options = Object.values(options as object)

        val[name as keyof T] = {
            type: getBaseType(item),
            default: getDefaultValueInZodStack(item),
            options,
            required: !['optional', 'nullable'].includes(
                (item._def as any).type
            ),
            schema: item
        }
    })
    return val
})

const fieldContext = useField(props.fieldName)
// @ts-expect-error ignore missing `id`
provide(FieldContextKey, fieldContext)
</script>

<template>
    <section>
        <slot v-bind="props">
            <Accordion
                type="single"
                as-child
                class="w-full"
                collapsible
                :disabled="disabled"
            >
                <FormItem>
                    <AccordionItem :value="fieldName" class="border-none">
                        <AccordionTrigger>
                            <AutoFormLabel
                                class="text-base"
                                :required="required"
                            >
                                {{
                                    schema?.description ||
                                    beautifyObjectName(fieldName)
                                }}
                            </AutoFormLabel>
                        </AccordionTrigger>
                        <AccordionContent class="space-y-5 p-1">
                            <template v-for="(shape, key) in shapes" :key="key">
                                <AutoFormField
                                    :config="
                                        config?.[
                                            key as keyof typeof config
                                        ] as ConfigItem
                                    "
                                    :field-name="`${fieldName}.${key.toString()}`"
                                    :label="key.toString()"
                                    :shape="shape"
                                />
                            </template>
                        </AccordionContent>
                    </AccordionItem>
                </FormItem>
            </Accordion>
        </slot>
    </section>
</template>
