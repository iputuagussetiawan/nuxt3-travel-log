import { removeLocationBySlug } from '~/lib/db/queries/location-query'

import { defineRoleEventHandler } from '~/lib/define-authenticated-event-handler'

export default defineRoleEventHandler('member', async (event) => {
    const slug = getRouterParam(event, 'slug') as string
    const deleted = await removeLocationBySlug(slug, event.context.user.id)
    if (!deleted) {
        return sendError(
            event,
            createError({
                statusCode: 404,
                statusMessage: 'Location not found'
            })
        )
    }

    setResponseStatus(event, 204)
})
