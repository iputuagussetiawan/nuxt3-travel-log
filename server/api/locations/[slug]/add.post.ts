import defineAuthenticatedEventHandler from '~/lib/define-authenticated-event-handler'
import { InsertLocationLogSchema } from '~/lib/db/schema'
import { findLocation } from '~/lib/db/queries/location-query'
import sendZodError from '~/lib/send-zod-error'
import { insertLocationLog } from '~/lib/db/queries/location-log-query'

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

    return insertLocationLog(location.id, result.data, currentUserId)
})
