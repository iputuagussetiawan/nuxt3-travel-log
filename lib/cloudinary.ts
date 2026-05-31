import { v2 as cloudinary } from 'cloudinary'
import type { UploadApiOptions, UploadApiResponse } from 'cloudinary'

function getClient() {
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    })
    return cloudinary
}

export type UploadOptions = {
    folder?: string
    publicId?: string
    overwrite?: boolean
    transformation?: UploadApiOptions['transformation']
}

export async function uploadImage(
    file: Buffer,
    mimeType: string,
    options: UploadOptions = {}
): Promise<UploadApiResponse> {
    const client = getClient()
    const dataUrl = `data:${mimeType};base64,${file.toString('base64')}`

    return client.uploader.upload(dataUrl, {
        folder: options.folder ?? 'travel-log',
        public_id: options.publicId,
        overwrite: options.overwrite ?? true,
        transformation: options.transformation
    })
}

export async function deleteImage(publicId: string): Promise<void> {
    const client = getClient()
    await client.uploader.destroy(publicId)
}

export function getPublicIdFromUrl(url: string): string | null {
    try {
        const path = new URL(url).pathname
        // e.g. /travel-log/avatars/user_abc123 (strip leading slash + extension)
        const match = path.match(/\/([^/].+?)(?:\.[^.]+)?$/)
        return match?.[1] ?? null
    } catch {
        return null
    }
}

// Preset transforms
export const transforms = {
    avatar: [
        {
            width: 400,
            height: 400,
            crop: 'fill' as const,
            gravity: 'face' as const
        },
        { quality: 'auto' as const, fetch_format: 'auto' as const }
    ],
    locationImage: [
        {
            width: 1200,
            height: 800,
            crop: 'fill' as const,
            gravity: 'auto' as const
        },
        { quality: 'auto' as const, fetch_format: 'auto' as const }
    ],
    thumbnail: [
        {
            width: 400,
            height: 300,
            crop: 'fill' as const,
            gravity: 'auto' as const
        },
        { quality: 'auto' as const, fetch_format: 'auto' as const }
    ]
}
