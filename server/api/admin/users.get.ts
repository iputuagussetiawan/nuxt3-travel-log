import { defineRoleEventHandler } from '~/lib/define-authenticated-event-handler'
import { findAllUsers } from '~/lib/db/queries/user-query'

export default defineRoleEventHandler('admin', async () => {
    return findAllUsers()
})
