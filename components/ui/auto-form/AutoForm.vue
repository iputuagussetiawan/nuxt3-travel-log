<script setup lang="ts" generic="T extends ZodObjectOrWrapped">
import type { FormContext, GenericObject } from 'vee-validate'
import type { z, ZodAny } from 'zod'
import type { Config, ConfigItem, Dependency, Shape } from './interface'
import { Form } from '@/components/ui/form'
import { toTypedSchema } from '@vee-validate/zod'
import { computed, toRefs } from 'vue'
import AutoFormField from './AutoFormField.vue'
import { provideDependencies } from './dependencies'
import {
    getBaseSchema,
    getBaseType,
    getDefaultValueInZodStack,
    getObjectFormSchema,
    type ZodObjectOrWrapped
} from './utils'

const props = defineProps<{
    schema: T
    form?: FormContext<GenericObject>
    fieldConfig?: Config<z.infer<T>>
    dependencies?: Dependency<z.infer<T>>[]
}>()

const emits = defineEmits<{
    submit: [event: z.infer<T>]
}>()

const { dependencies } = toRefs(props)
// @ts-expect-error generic Dependency type mismatch between vee-validate and zod inferred types
provideDependencies(dependencies)

const shapes = computed(() => {
    // @ts-expect-error ignore {} not assignable to object
    const val: { [key in keyof T]: Shape } = {}
    const baseSchema = getObjectFormSchema(props.schema)
    const shape = baseSchema.shape
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
            schema: baseItem
        }
    })
    return val
})

const fields = computed(() => {
    // @ts-expect-error ignore {} not assignable to object
    const val: {
        [key in keyof z.infer<T>]: {
            shape: Shape
            fieldName: string
            config: ConfigItem
        }
    } = {}
    for (const key in shapes.value) {
        const shape = shapes.value[key]
        val[key as keyof z.infer<T>] = {
            shape,
            config: props.fieldConfig?.[key] as ConfigItem,
            fieldName: key
        }
    }
    return val
})

const formComponent = computed(() => (props.form ? 'form' : Form))
const formComponentProps = computed(() => {
    if (props.form) {
        return {
            // @ts-expect-error GenericObject vs z.infer<T> mismatch — safe at runtime
            onSubmit: props.form.handleSubmit((val) => emits('submit', val))
        }
    } else {
        const formSchema = toTypedSchema(props.schema)
        return {
            keepValues: true,
            validationSchema: formSchema,
            // @ts-expect-error GenericObject vs z.infer<T> mismatch — safe at runtime
            onSubmit: (val: GenericObject) => emits('submit', val)
        }
    }
})
</script>

<template>
    <component :is="formComponent" v-bind="formComponentProps">
        <slot name="customAutoForm" :fields="fields">
            <template v-for="(shape, key) of shapes" :key="key">
                <slot
                    :shape="shape"
                    :name="key.toString() as keyof z.infer<T>"
                    :field-name="key.toString()"
                    :config="
                        fieldConfig?.[
                            key as keyof typeof fieldConfig
                        ] as ConfigItem
                    "
                >
                    <AutoFormField
                        :config="
                            fieldConfig?.[
                                key as keyof typeof fieldConfig
                            ] as ConfigItem
                        "
                        :field-name="key.toString()"
                        :shape="shape"
                    />
                </slot>
            </template>
        </slot>

        <slot :shapes="shapes" />
    </component>
</template>
