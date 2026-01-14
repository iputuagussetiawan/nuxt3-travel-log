import { and, eq } from 'drizzle-orm'
import { db } from '..'
import type { InsertLocationLogType } from '../schema'
import { locationLog } from '../schema'
import { nanoid } from 'nanoid'

export async function findLocationLog(locationId: string, userId: string) {
    const foundLocationLog = await db.query.locationLog.findFirst({
        where: and(
            eq(locationLog.id, locationId),
            eq(locationLog.userId, userId)
        )
    })
    return foundLocationLog
}

export async function insertLocationLog(
    locationId: string,
    locationLogData: InsertLocationLogType,
    slug: string,
    userId: string
) {
    const [createdLocationLog] = await db
        .insert(locationLog)
        .values({
            id: nanoid(),
            ...locationLogData,
            slug,
            locationId,
            userId
        })
        .returning()
    return createdLocationLog
}

export async function updateLocationLog(
    locationLogId: string,
    locationLogData: InsertLocationLogType,
    userId: string
) {
    const [updatedLocationLog] = await db
        .update(locationLog)
        .set(locationLogData)
        .where(
            and(
                eq(locationLog.id, locationLogId),
                eq(locationLog.userId, userId)
            )
        )
        .returning()
    return updatedLocationLog
}

export async function deleteLocationLog(locationLogId: string, userId: string) {
    const [deletedLocationLog] = await db
        .delete(locationLog)
        .where(
            and(
                eq(locationLog.id, locationLogId),
                eq(locationLog.userId, userId)
            )
        )
        .returning()
    return deletedLocationLog
}
