import { uploadImage, transforms } from '~/lib/cloudinary'
import defineAuthenticatedEventHandler from '~/lib/define-authenticated-event-handler'

export default defineAuthenticatedEventHandler(async (event) => {
    const form = await readMultipartFormData(event)
    const file = form?.find((f) => f.name === 'file')

    if (!file?.data) {
        throw createError({
            statusCode: 400,
            statusMessage: 'No file provided'
        })
    }

    if (!file.type?.startsWith('image/')) {
        throw createError({
            statusCode: 400,
            statusMessage: 'File must be an image'
        })
    }

    if (file.data.length > 5 * 1024 * 1024) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Image must be under 5MB'
        })
    }

    const result = await uploadImage(file.data, file.type, {
        folder: 'travel-log/avatars',
        publicId: `user_${event.context.user.id}`,
        transformation: transforms.avatar
    })

    return { url: result.secure_url }
})
