
import { findLocations } from '~/lib/db/queries/location-query'
import defineAuthenticatedEventHandler from '~/lib/define-authenticated-event-handler'
export default defineAuthenticatedEventHandler(async (event) => {
    // await new Promise((resolve) => setTimeout(resolve, 2000))
    const currentUserId = event.context.user.id
    return await findLocations(currentUserId)
})
