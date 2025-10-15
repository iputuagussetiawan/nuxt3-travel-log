import slugify from 'slug'
import { nanoid } from 'nanoid'
import defineAuthenticatedEventHandler from '~/lib/define-authenticated-event-handler'
import type { DrizzleError } from 'drizzle-orm'
import { InsertLocationSchema } from '~/lib/db/schema'
import {
    findLocationByName,
    insertLocation
} from '~/lib/db/queries/location-query'

export default defineAuthenticatedEventHandler(async (event) => {
    const result = await readValidatedBody(
        event,
        InsertLocationSchema.safeParse
    )

    if (!result.success) {
        const statusMessage = result.error.issues
            .map((issue) => `${issue.path.join(' ')}: ${issue.message}`)
            .join(', ')

        const data = result.error.issues.reduce(
            (errors, issue) => {
                errors[issue.path.join(' ')] = issue.message
                return errors
            },
            {} as Record<string, string>
        )
        return sendError(
            event,
            createError({
                statusCode: 422,
                statusMessage: statusMessage,
                data
            })
        )
    }
    const slug = `${result.data.name}-${nanoid()}`
    const newSlug = slugify(slug, {
        lower: true
    })

    const existingLocation = await findLocationByName(
        result.data,
        event.context.user.id
    )
    if (existingLocation.length > 0) {
        return sendError(
            event,
            createError({
                statusCode: 409,
                statusMessage: 'Location already exists, try a different name'
            })
        )
    }

    try {
        //call query insert location from db/query
        return insertLocation(result.data, newSlug, event.context.user.id)
    } catch (e) {
        const error = e as DrizzleError
        if (error.message) {
            return sendError(
                event,
                createError({
                    statusCode: 422,
                    statusMessage: error.message
                })
            )
        }
        console.log('INSERT ERROR', error.message)
        throw error
    }
})
