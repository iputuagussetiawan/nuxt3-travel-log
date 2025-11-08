import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { location } from './location-schema'
import { user } from './auth-schema'
import { relations } from 'drizzle-orm'
import { createInsertSchema } from 'drizzle-zod'
import type z from 'zod'
export const locationLog = pgTable('locationLog', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    startedAt: text('started_at').notNull(),
    endedAt: text('ended_at').notNull(),
    lat: text('lat').notNull(),
    long: text('long').notNull(),
    locationId: text('location_id')
        .notNull()
        .references(() => location.id, { onDelete: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull()
})

export const locationLogRelations = relations(locationLog, ({ one }) => ({
    location: one(location, {
        fields: [locationLog.locationId],
        references: [location.id]
    })
}))

export const InsertLocationLogSchema = createInsertSchema(locationLog, {
    name: (field) => field.min(1).max(50),
    description: (field) => field.min(1).max(50),
    startedAt: (field) => field.min(1).max(50),
    endedAt: (field) => field.min(1).max(50)
}).omit({
    id: true,
    userId: true,
    locationId: true,
    createdAt: true,
    updatedAt: true
})

export type InsertLocationLogType = z.infer<typeof InsertLocationLogSchema>
export type SelectLocationLogType = typeof locationLog.$inferSelect
