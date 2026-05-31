import defineAuthenticatedEventHandler from '~/lib/define-authenticated-event-handler'
import { getUserActiveSubscription } from '~/lib/db/queries/subscription-query'

export default defineAuthenticatedEventHandler(async (event) => {
    return getUserActiveSubscription(event.context.user.id)
})
