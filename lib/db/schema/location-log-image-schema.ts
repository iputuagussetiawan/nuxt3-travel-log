import { pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { locationLog } from './location-log-schema'
import { user } from './auth-schema'
export const locationLogImage = pgTable('locationLogImage', {
    id: text('id').primaryKey(),
    key: text('key').notNull(),
    locationLogId: text('location_log_id')
        .notNull()
        .references(() => locationLog.id, { onDelete: 'cascade' }),
    userId: text('user_id')
        .notNull()
        .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at').defaultNow().notNull(),
    updatedAt: timestamp('updated_at')
        .defaultNow()
        .$onUpdate(() => /* @__PURE__ */ new Date())
        .notNull()
})
