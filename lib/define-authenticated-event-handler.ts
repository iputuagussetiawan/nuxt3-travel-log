import type { H3Event, H3EventContext } from 'h3'
import type { UserWithId } from './auth'
import type { Role } from './db/schema'

type AuthenticatedEvent = H3Event & {
    context: H3EventContext & {
        user: UserWithId & { role: Role }
    }
}

export default function defineAuthenticatedEventHandler<T>(
    handler: (event: AuthenticatedEvent) => T
) {
    return defineEventHandler(async (event) => {
        if (!event.context.user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }
        return handler(event as AuthenticatedEvent)
    })
}

export function defineRoleEventHandler<T>(
    role: 'member' | 'admin',
    handler: (event: AuthenticatedEvent) => T
) {
    return defineEventHandler(async (event) => {
        if (!event.context.user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized'
            })
        }
        const userRole: Role = (event.context.user as any).role ?? 'user'
        if (role === 'admin' && userRole !== 'admin') {
            throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
        }
        if (
            role === 'member' &&
            userRole !== 'member' &&
            userRole !== 'admin'
        ) {
            throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
        }
        return handler(event as AuthenticatedEvent)
    })
}
