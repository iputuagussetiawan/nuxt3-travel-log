import { z } from 'zod'
import defineAuthenticatedEventHandler from '~/lib/define-authenticated-event-handler'
import { getPlanById, createSubscription } from '~/lib/db/queries/subscription-query'
import { createXenditInvoice } from '~/lib/xendit'

const bodySchema = z.object({ planId: z.string() })

export default defineAuthenticatedEventHandler(async (event) => {
    const body = await readValidatedBody(event, bodySchema.safeParse)
    if (!body.success) {
        throw createError({ statusCode: 422, statusMessage: 'Invalid plan' })
    }

    const plan = await getPlanById(body.data.planId)
    if (!plan || !plan.isActive) {
        throw createError({ statusCode: 404, statusMessage: 'Plan not found' })
    }

    const user = event.context.user
    const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
    const externalId = `sub_${user.id}_${plan.id}_${Date.now()}`

    const invoice = await createXenditInvoice({
        externalId,
        amount: plan.price,
        payerEmail: user.email,
        description: `Travel Log ${plan.name}`,
        successRedirectUrl: `${baseUrl}/dashboard/subscription?status=success`,
        failureRedirectUrl: `${baseUrl}/dashboard/subscription?status=failed`
    })

    await createSubscription({
        userId: user.id,
        planId: plan.id,
        xenditInvoiceId: invoice.id ?? externalId,
        xenditInvoiceUrl: invoice.invoiceUrl ?? ''
    })

    return { invoiceUrl: invoice.invoiceUrl, invoiceId: invoice.id }
})
