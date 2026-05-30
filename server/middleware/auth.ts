import { auth } from '~/lib/auth'

export default defineEventHandler(async (event) => {
    const session = await auth.api.getSession({
        headers: event.headers
    })
    event.context.user = session?.user

    if (event.path.startsWith('/dashboard')) {
        if (!session?.user) {
            await sendRedirect(event, '/', 302)
        }
    }

    if (event.path.startsWith('/dashboard/admin')) {
        const role = (session?.user as any)?.role
        if (role !== 'admin') {
            await sendRedirect(event, '/dashboard', 302)
        }
    }
})
