import { findLocationLog } from '~/lib/db/queries/location-log-query'
import { findLocation } from '~/lib/db/queries/location-query'
import defineAuthenticatedEventHandler from '~/lib/define-authenticated-event-handler'
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
    const id = getRouterParam(event, 'id') as string
    const locationLog = await findLocationLog(id, currentUserId)

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
