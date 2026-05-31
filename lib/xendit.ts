import Xendit from 'xendit-node'

function getClient() {
    return new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY ?? '' })
}

export async function createXenditInvoice(params: {
    externalId: string
    amount: number
    payerEmail: string
    description: string
    successRedirectUrl: string
    failureRedirectUrl: string
}) {
    const client = getClient()
    const invoice = await client.Invoice.createInvoice({
        data: {
            externalId: params.externalId,
            amount: params.amount,
            payerEmail: params.payerEmail,
            description: params.description,
            successRedirectUrl: params.successRedirectUrl,
            failureRedirectUrl: params.failureRedirectUrl,
            currency: 'IDR',
            invoiceDuration: 86400 // 24 hours
        }
    })
    return invoice
}
