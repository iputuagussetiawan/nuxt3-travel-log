import { and, eq } from 'drizzle-orm'
import { db } from '..'
import { user } from '../schema'
import type { InsertUserType } from '../schema'

export async function updateUserById(updates: InsertUserType, userId: string) {
    const [updated] = await db
        .update(user)
        .set(updates)
        .where(and(eq(user.id, userId)))
        .returning()
    return updated
}
