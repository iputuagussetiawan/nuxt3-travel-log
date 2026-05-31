import { z } from 'zod'
import { defineRoleEventHandler } from '~/lib/define-authenticated-event-handler'
import { updatePlanPrice } from '~/lib/db/queries/subscription-query'

const bodySchema = z.object({
    price: z.number().int().positive().optional(),
    name: z.string().min(1).optional(),
    isActive: z.boolean().optional()
})

export default defineRoleEventHandler('admin', async (event) => {
    const id = getRouterParam(event, 'id') as string
    const body = await readValidatedBody(event, bodySchema.safeParse)

    if (!body.success) {
        throw createError({ statusCode: 422, statusMessage: 'Invalid data' })
    }

    const updated = await updatePlanPrice(id, body.data)
    if (!updated) {
        throw createError({ statusCode: 404, statusMessage: 'Plan not found' })
    }

    return updated
})
