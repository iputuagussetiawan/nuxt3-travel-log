import {
    findLocationByName,
    updateLocationBySlug
} from '~/lib/db/queries/location-query'
import { InsertLocationSchema } from '~/lib/db/schema'
import { defineRoleEventHandler } from '~/lib/define-authenticated-event-handler'
import sendZodError from '~/lib/send-zod-error'

export default defineRoleEventHandler('member', async (event) => {
    const slug = getRouterParam(event, 'slug') as string
    const result = await readValidatedBody(
        event,
        InsertLocationSchema.safeParse
    )

    if (!result.success) {
        return sendZodError(event, result.error)
    }

    const existingLocation = await findLocationByName(
        result.data,
        event.context.user.id
    )

    if (existingLocation && existingLocation.slug !== slug) {
        throw createError({
            statusCode: 409,
            statusMessage: 'A location with that name already exists!'
        })
    }

    return updateLocationBySlug(result.data, slug, event.context.user.id)
})
