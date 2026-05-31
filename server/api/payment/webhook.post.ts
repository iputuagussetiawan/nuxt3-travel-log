import {
    getSubscriptionByInvoiceId,
    updateSubscriptionByInvoiceId
} from '~/lib/db/queries/subscription-query'
import { updateUserRole } from '~/lib/db/queries/user-query'
import { getPlanById } from '~/lib/db/queries/subscription-query'

export default defineEventHandler(async (event) => {
    // Verify Xendit webhook token
    const token = getRequestHeader(event, 'x-callback-token')
    if (token !== process.env.XENDIT_WEBHOOK_TOKEN) {
        throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
    }

    const body = await readBody(event)
    const { id: xenditInvoiceId, status, paid_at } = body

    if (!xenditInvoiceId) {
        throw createError({ statusCode: 400, statusMessage: 'Missing invoice ID' })
    }

    const sub = await getSubscriptionByInvoiceId(xenditInvoiceId)
    if (!sub) return { received: true }

    if (status === 'PAID') {
        const plan = await getPlanById(sub.planId)
        const paidAt = paid_at ? new Date(paid_at) : new Date()
        const expiresAt = new Date(paidAt)

        if (plan?.interval === 'month') {
            expiresAt.setMonth(expiresAt.getMonth() + 1)
        } else {
            expiresAt.setFullYear(expiresAt.getFullYear() + 1)
        }

        await updateSubscriptionByInvoiceId(xenditInvoiceId, {
            status: 'paid',
            paidAt,
            expiresAt
        })
        await updateUserRole(sub.userId, 'member')
    } else if (status === 'EXPIRED') {
        await updateSubscriptionByInvoiceId(xenditInvoiceId, { status: 'expired' })
    } else if (status === 'FAILED') {
        await updateSubscriptionByInvoiceId(xenditInvoiceId, { status: 'failed' })
    }

    return { received: true }
})
