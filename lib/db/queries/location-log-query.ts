import { db } from '..'
import type { InsertLocationLogType } from '../schema'
import { locationLog } from '../schema'
import { nanoid } from 'nanoid'

export async function insertLocationLog(
    locationId: string,
    locationLogData: InsertLocationLogType,
    userId: string
) {
    const [createdLocationLog] = await db
        .insert(locationLog)
        .values({
            id: nanoid(),
            ...locationLogData,
            locationId,
            userId
        })
        .returning()
    return createdLocationLog
}
