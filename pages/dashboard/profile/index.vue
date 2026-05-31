<script setup lang="ts">
import ProfileInfo from '~/components/ProfileInfo.vue'
import ProfileUpdateForm from '~/components/ProfileUpdateForm.vue'
import type { InsertUserType } from '~/lib/db/schema'

definePageMeta({ layout: 'dashboard' })

useSeoMeta({
    title: 'Profile',
    description: 'Manage your Travel Log profile and personal information.'
})

const authStore = useAuthStore()
const { $csrfFetch } = useNuxtApp()

const initialValues = computed<InsertUserType | null>(() => {
    if (!authStore.user) return null
    return {
        name: authStore.user.name ?? '',
        email: authStore.user.email ?? '',
        image: authStore.user.image || undefined
    }
})

async function onSubmit(values: InsertUserType) {
    await $csrfFetch('/api/auth/user', {
        method: 'PUT',
        body: values
    })
    await authStore.init()
}

function onSubmitComplete() {
    navigateTo({ name: 'dashboard-locations' })
}
</script>

<template>
    <section class="p-6">
        <div class="mb-8">
            <h1 class="text-xl font-bold">Profile</h1>
            <p class="text-muted-foreground mt-1 text-sm">
                Manage your account details and profile photo
            </p>
        </div>
        <div class="flex flex-col gap-6 lg:flex-row lg:items-start">
            <ProfileInfo />
            <ProfileUpdateForm
                :initial-values="initialValues"
                :on-submit="onSubmit"
                :on-submit-complete="onSubmitComplete"
                submit-label="Save Changes"
                submit-icon="update-user-icon"
            />
        </div>
    </section>
</template>
