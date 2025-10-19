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

    return location
})
