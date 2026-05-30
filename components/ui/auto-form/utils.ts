import type { z } from 'zod'

// Zod v4: ZodEffects is gone — use ZodPipe (z.ZodPipe) for transform/pipe.
// We support ZodObject directly or wrapped in a ZodPipe.
export type ZodObjectOrWrapped =
    | z.ZodObject<any>
    | z.ZodPipe<any, z.ZodObject<any>>

/**
 * Beautify a camelCase string.
 * e.g. "myString" -> "My String"
 */
export function beautifyObjectName(string: string) {
    let output = string.replace(/\[\d+\]/g, '').replace(/([A-Z])/g, ' $1')
    output = output.charAt(0).toUpperCase() + output.slice(1)
    return output
}

/**
 * Parse string and extract the index
 */
export function getIndexIfArray(string: string) {
    const indexRegex = /\[(\d+)\]/
    const match = string.match(indexRegex)
    return match ? Number.parseInt(match[1]) : undefined
}

/**
 * Get the lowest-level Zod schema, unwrapping optional/nullable/default/pipe.
 * Zod v4 uses _def.type (string) instead of _def.typeName.
 */
export function getBaseSchema<ChildType extends z.ZodTypeAny = z.ZodTypeAny>(
    schema: ChildType
): ChildType | null {
    if (!schema) return null
    const defType = (schema._def as any)?.type

    // unwrap optional / nullable / default
    if (['optional', 'nullable', 'default'].includes(defType)) {
        return getBaseSchema((schema._def as any).innerType as ChildType)
    }
    // unwrap pipe (replaces ZodEffects/transform in v4): recurse into the output schema
    if (defType === 'pipe') {
        return getBaseSchema((schema._def as any).out as ChildType)
    }

    return schema
}

/**
 * Get the _def.type string of the lowest-level Zod schema.
 */
export function getBaseType(schema: z.ZodTypeAny): string {
    const base = getBaseSchema(schema)
    if (!base) return ''
    // Map zod v4 _def.type → display type names consistent with DEFAULT_ZOD_HANDLERS
    const raw = (base._def as any)?.type ?? ''
    const map: Record<string, string> = {
        string: 'ZodString',
        number: 'ZodNumber',
        boolean: 'ZodBoolean',
        date: 'ZodDate',
        enum: 'ZodEnum',
        array: 'ZodArray',
        object: 'ZodObject'
    }
    return map[raw] ?? `Zod${raw.charAt(0).toUpperCase()}${raw.slice(1)}`
}

/**
 * Search for a "default" wrapper in the Zod stack and return its value.
 * Zod v4: _def.type === 'default', value at _def.defaultValue (not a fn).
 */
export function getDefaultValueInZodStack(schema: z.ZodTypeAny): any {
    const def = schema._def as any
    if (!def) return undefined

    if (def.type === 'default') {
        // Zod v4 stores the raw default value directly (not a function)
        return def.defaultValue
    }

    if (def.innerType) {
        return getDefaultValueInZodStack(def.innerType)
    }
    if (def.schema) {
        return getDefaultValueInZodStack(def.schema)
    }
    // pipe: check the input side for a default
    if (def.in) {
        return getDefaultValueInZodStack(def.in)
    }

    return undefined
}

/**
 * Unwrap a ZodObjectOrWrapped to the underlying ZodObject.
 * Zod v4: pipe replaces ZodEffects; pipe._def.out holds the output schema.
 */
export function getObjectFormSchema(
    schema: ZodObjectOrWrapped
): z.ZodObject<any> {
    const defType = (schema._def as any)?.type
    if (defType === 'pipe') {
        return getObjectFormSchema(
            (schema._def as any).out as ZodObjectOrWrapped
        )
    }
    return schema as z.ZodObject<any>
}

function isIndex(value: unknown): value is number {
    return Number(value) >= 0
}

/**
 * Constructs a path with dot paths for arrays to use brackets (vee-validate compatible)
 */
export function normalizeFormPath(path: string): string {
    const pathArr = path.split('.')
    if (!pathArr.length) return ''

    let fullPath = String(pathArr[0])
    for (let i = 1; i < pathArr.length; i++) {
        if (isIndex(pathArr[i])) {
            fullPath += `[${pathArr[i]}]`
            continue
        }
        fullPath += `.${pathArr[i]}`
    }

    return fullPath
}

type NestedRecord = Record<string, unknown> | { [k: string]: NestedRecord }

export function isNotNestedPath(path: string) {
    return /^\[.+\]$/.test(path)
}

function isObject(obj: unknown): obj is Record<string, unknown> {
    return (
        obj !== null && !!obj && typeof obj === 'object' && !Array.isArray(obj)
    )
}
function isContainerValue(value: unknown): value is Record<string, unknown> {
    return isObject(value) || Array.isArray(value)
}
function cleanupNonNestedPath(path: string) {
    if (isNotNestedPath(path)) return path.replace(/\[|\]/g, '')
    return path
}

export function getFromPath<TValue = unknown>(
    object: NestedRecord | undefined,
    path: string
): TValue | undefined
export function getFromPath<TValue = unknown, TFallback = TValue>(
    object: NestedRecord | undefined,
    path: string,
    fallback?: TFallback
): TValue | TFallback
export function getFromPath<TValue = unknown, TFallback = TValue>(
    object: NestedRecord | undefined,
    path: string,
    fallback?: TFallback
): TValue | TFallback | undefined {
    if (!object) return fallback

    if (isNotNestedPath(path))
        return object[cleanupNonNestedPath(path)] as TValue | undefined

    const resolvedValue = (path || '')
        .split(/\.|\[(\d+)\]/)
        .filter(Boolean)
        .reduce((acc, propKey) => {
            if (isContainerValue(acc) && propKey in acc) return acc[propKey]
            return fallback
        }, object as unknown)

    return resolvedValue as TValue | undefined
}

type Booleanish = boolean | 'true' | 'false'

export function booleanishToBoolean(value: Booleanish) {
    switch (value) {
        case 'true':
        case true:
            return true
        case 'false':
        case false:
            return false
    }
}

export function maybeBooleanishToBoolean(value?: Booleanish) {
    return value ? booleanishToBoolean(value) : undefined
}
