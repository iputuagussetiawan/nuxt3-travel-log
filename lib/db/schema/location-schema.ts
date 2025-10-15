import { pgTable, text, timestamp, unique } from 'drizzle-orm/pg-core'

import { createInsertSchema } from 'drizzle-zod'
import type z from 'zod'
import { user } from './auth-schema'
export const location = pgTable(
    'location',
    {
        id: text('id').primaryKey(),
        name: text('name').notNull(),
        description: text('description'),
        slug: text('slug').notNull().unique(),
        lat: text('lat').notNull(),
        long: text('long').notNull(),
        userId: text('user_id')
            .notNull()
            .references(() => user.id, { onDelete: 'cascade' }),
        createdAt: timestamp('created_at').defaultNow().notNull(),
        updatedAt: timestamp('updated_at')
            .defaultNow()
            .$onUpdate(() => /* @__PURE__ */ new Date())
            .notNull()
    },
    (t) => [unique().on(t.name, t.userId)]
)

export const InsertLocationSchema = createInsertSchema(location, {
    name: (field) => field.min(1).max(50),
    description: (field) => field.min(1).max(50)
    // lat: (field) => field.min(-90).max(90),
    // long: (field) => field.min(-180).max(180)
}).omit({
    id: true,
    slug: true,
    userId: true,
    createdAt: true,
    updatedAt: true
    // lat: true,
    // long: true
})

export type InsertLocationSchema = z.infer<typeof InsertLocationSchema>
