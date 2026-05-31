import { z } from 'zod'
import { defineRoleEventHandler } from '~/lib/define-authenticated-event-handler'
import { updateUserRole } from '~/lib/db/queries/user-query'
import { ROLES } from '~/lib/db/schema'

const bodySchema = z.object({
    role: z.enum(ROLES)
})

export default defineRoleEventHandler('admin', async (event) => {
    const id = getRouterParam(event, 'id') as string
    const result = await readValidatedBody(event, bodySchema.safeParse)

    if (!result.success) {
        throw createError({ statusCode: 422, statusMessage: 'Invalid role' })
    }

    const updated = await updateUserRole(id, result.data.role)
    if (!updated) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    return updated
})
