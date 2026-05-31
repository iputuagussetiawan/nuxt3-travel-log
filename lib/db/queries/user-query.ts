import { and, eq } from 'drizzle-orm'
import { db } from '..'
import { user } from '../schema'
import type { InsertUserType, Role } from '../schema'

export async function updateUserById(updates: InsertUserType, userId: string) {
    const [updated] = await db
        .update(user)
        .set(updates)
        .where(and(eq(user.id, userId)))
        .returning()
    return updated
}

export async function findAllUsers() {
    return db
        .select({
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            role: user.role,
            createdAt: user.createdAt
        })
        .from(user)
}

export async function updateUserRole(userId: string, role: Role) {
    const [updated] = await db.update(user).set({ role }).where(eq(user.id, userId)).returning()
    return updated
}
