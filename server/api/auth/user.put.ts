import { updateUserById } from '~/lib/db/queries/user-query'
import { InsertUserSchema } from '~/lib/db/schema'
import defineAuthenticatedEventHandler from '~/lib/define-authenticated-event-handler'
import sendZodError from '~/lib/send-zod-error'

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(event, InsertUserSchema.safeParse)

    if (!result.success) {
        return sendZodError(event, result.error)
    }

    return updateUserById(result.data, event.context.user.id)
})
