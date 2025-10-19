import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { location } from './location-schema'
import { user } from './auth-schema'
import { relations } from 'drizzle-orm'
export const locationLog = pgTable('locationLog', {
    id: text('id').primaryKey(),
    name: text('name').notNull(),
    description: text('description'),
    startedAt: timestamp('started_at').notNull(),
    endedAt: timestamp('ended_at').notNull(),
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

export type SelectLocationLogType = typeof locationLog.$inferSelect
