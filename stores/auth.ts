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

    // const session=authClient.useSession()
    // const user = computed(() => session.value.data?.user)
    // const loading=computed(() => session.value.isPending || session.value.isRefetching)
    async function signIn() {
        // const { csrf } = useCsrf()
        // const headers = new Headers()
        // headers.append('csrf-token', csrf)
        await authClient.signIn.social({
            provider: 'github',
            callbackURL: process.env.GITHUB_CALLBACK_URL,
            errorCallbackURL: '/error',
            newUserCallbackURL: '/profile',
            // fetchOptions: {
            //     headers
            // }
        })
    }

    async function signOut() {
        // const { csrf } = useCsrf()
        // const headers = new Headers()
        // headers.append('csrf-token', csrf)

        await authClient.signOut({
            // fetchOptions: {
            //     headers
            // }
        })
    }
    return {
        init,
        loading,
        signIn,
        signOut,
        user                                               
    }
})
