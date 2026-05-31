import { pgTable, text, integer, boolean, timestamp } from 'drizzle-orm/pg-core'
import { user } from './auth-schema'

export const subscriptionPlan = pgTable('subscription_plan', {
    id: text('id').primaryKey(), // 'monthly' | 'yearly'
    name: text('name').notNull(),
    price: integer('price').notNull(), // IDR
    interval: text('interval').notNull(), // 'month' | 'year'
    isActive: boolean('is_active').default(true).notNull()
})

export const subscription = pgTable('subscription', {
    id: text('id').primaryKey(),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    planId: text('plan_id')
        .notNull()
        .references(() => subscriptionPlan.id),
    xenditInvoiceId: text('xendit_invoice_id').notNull().unique(),
    xenditInvoiceUrl: text('xendit_invoice_url').notNull(),
    status: text('status').notNull().default('pending'), // pending | paid | expired | failed
    paidAt: timestamp('paid_at'),
    expiresAt: timestamp('expires_at'),
    createdAt: timestamp('created_at').defaultNow().notNull()
})

export type SubscriptionPlan = typeof subscriptionPlan.$inferSelect
export type Subscription = typeof subscription.$inferSelect
