import { updateLocationLog } from '~/lib/db/queries/location-log-query'
import { findLocation } from '~/lib/db/queries/location-query'
import { InsertLocationLogSchema } from '~/lib/db/schema'
import defineAuthenticatedEventHandler from '~/lib/define-authenticated-event-handler'
import sendZodError from '~/lib/send-zod-error'
export default defineAuthenticatedEventHandler(async (event) => {
    const currentUserId = event.context.user.id
    const slug = getRouterParam(event, 'slug') as string
    const location = await findLocation(slug, currentUserId)

    if (!location) {
        return sendError(
            event,
            createError({
                statusCode: 404,
                statusMessage: 'Location not found'
            })
        )
    }

    const result = await readValidatedBody(
        event,
        InsertLocationLogSchema.safeParse
    )

    if (!result.success) {
        return sendZodError(event, result.error)
    }
    const id = getRouterParam(event, 'id') as string
    const locationLog = await updateLocationLog(id, result.data, currentUserId)

    if (!locationLog) {
        return sendError(
            event,
            createError({
                statusCode: 404,
                statusMessage: 'Location log not found'
            })
        )
    }

    return locationLog
})
