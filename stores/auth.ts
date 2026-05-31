import { createAuthClient } from 'better-auth/vue'

const authClient = createAuthClient()

export const useAuthStore = defineStore('useAuthStore', () => {
    const session = ref<Awaited<ReturnType<typeof authClient.useSession>> | null>(null)

    async function init() {
        const data = await authClient.useSession(useFetch)
        session.value = data
    }

    const user = computed(() => session.value?.data?.user)
    const loading = computed(() => session.value?.isPending)
    const role = computed(() => (session.value?.data?.user as any)?.role ?? 'user')
    const isAdmin = computed(() => role.value === 'admin')
    const isMember = computed(() => role.value === 'member' || role.value === 'admin')

    async function signIn(provider: 'google' | 'github') {
        const { csrf } = useCsrf()
        const headers = new Headers()
        headers.append('csrf-token', csrf)
        await authClient.signIn.social({
            provider,
            callbackURL: '/dashboard',
            errorCallbackURL: '/error',
            newUserCallbackURL: '/dashboard/locations',
            fetchOptions: { headers }
        })
    }

    async function signInEmail(email: string, password: string) {
        const { csrf } = useCsrf()
        const headers = new Headers()
        headers.append('csrf-token', csrf)
        return authClient.signIn.email({
            email,
            password,
            callbackURL: '/dashboard',
            fetchOptions: { headers }
        })
    }

    async function signUpEmail(name: string, email: string, password: string) {
        const { csrf } = useCsrf()
        const headers = new Headers()
        headers.append('csrf-token', csrf)
        return authClient.signUp.email({
            name,
            email,
            password,
            callbackURL: '/dashboard',
            fetchOptions: { headers }
        })
    }

    async function sendVerificationEmail(email: string) {
        return authClient.sendVerificationEmail({
            email,
            callbackURL: '/dashboard'
        })
    }

    async function forgotPassword(email: string) {
        const { csrf } = useCsrf()
        const headers = new Headers()
        headers.append('csrf-token', csrf)
        return authClient.requestPasswordReset({
            email,
            redirectTo: '/reset-password',
            fetchOptions: { headers }
        })
    }

    async function resetPassword(newPassword: string, token: string) {
        const { csrf } = useCsrf()
        const headers = new Headers()
        headers.append('csrf-token', csrf)
        return authClient.resetPassword({
            newPassword,
            token,
            fetchOptions: { headers }
        })
    }

    async function signOut() {
        const { csrf } = useCsrf()
        const headers = new Headers()
        headers.append('csrf-token', csrf)
        await authClient.signOut({ fetchOptions: { headers } })
    }

    return {
        init,
        loading,
        signIn,
        signInEmail,
        signUpEmail,
        sendVerificationEmail,
        forgotPassword,
        resetPassword,
        signOut,
        user,
        role,
        isAdmin,
        isMember
    }
})
