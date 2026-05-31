import { and, eq, gt, isNotNull } from 'drizzle-orm'
import { db } from '..'
import { subscription, subscriptionPlan } from '../schema'
import { nanoid } from 'nanoid'

export async function getActivePlans() {
    return db.select().from(subscriptionPlan).where(eq(subscriptionPlan.isActive, true))
}

export async function getPlanById(id: string) {
    const [plan] = await db.select().from(subscriptionPlan).where(eq(subscriptionPlan.id, id))
    return plan ?? null
}

export async function createSubscription(data: {
    userId: string
    planId: string
    xenditInvoiceId: string
    xenditInvoiceUrl: string
}) {
    const [created] = await db
        .insert(subscription)
        .values({ id: nanoid(), ...data, status: 'pending' })
        .returning()
    return created
}

export async function updateSubscriptionByInvoiceId(
    xenditInvoiceId: string,
    updates: { status: string; paidAt?: Date; expiresAt?: Date }
) {
    const [updated] = await db
        .update(subscription)
        .set(updates)
        .where(eq(subscription.xenditInvoiceId, xenditInvoiceId))
        .returning()
    return updated
}

export async function getSubscriptionByInvoiceId(xenditInvoiceId: string) {
    const [row] = await db
        .select()
        .from(subscription)
        .where(eq(subscription.xenditInvoiceId, xenditInvoiceId))
    return row ?? null
}

export async function getUserActiveSubscription(userId: string) {
    const now = new Date()
    const [row] = await db
        .select({
            subscription: subscription,
            plan: subscriptionPlan
        })
        .from(subscription)
        .innerJoin(subscriptionPlan, eq(subscription.planId, subscriptionPlan.id))
        .where(
            and(
                eq(subscription.userId, userId),
                eq(subscription.status, 'paid'),
                isNotNull(subscription.expiresAt),
                gt(subscription.expiresAt, now)
            )
        )
        .orderBy(subscription.createdAt)
        .limit(1)
    return row ?? null
}

export async function getUserSubscriptions(userId: string) {
    return db
        .select({
            subscription: subscription,
            plan: subscriptionPlan
        })
        .from(subscription)
        .innerJoin(subscriptionPlan, eq(subscription.planId, subscriptionPlan.id))
        .where(eq(subscription.userId, userId))
        .orderBy(subscription.createdAt)
}

export async function updatePlanPrice(
    id: string,
    updates: { price?: number; name?: string; isActive?: boolean }
) {
    const [updated] = await db
        .update(subscriptionPlan)
        .set(updates)
        .where(eq(subscriptionPlan.id, id))
        .returning()
    return updated
}
