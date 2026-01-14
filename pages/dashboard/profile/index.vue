<script setup lang="ts">
import ProfileInfo from '~/components/ProfileInfo.vue'
import ProfileUpdateForm from '~/components/ProfileUpdateForm.vue'
import type { InsertUserType } from '~/lib/db/schema'

import { authClient } from '~/lib/auth-client'
const session = authClient.useSession()

const { $csrfFetch } = useNuxtApp()
definePageMeta({
    layout: 'dashboard'
})

async function onSubmit(values: InsertUserType) {
    await $csrfFetch('/api/user', {
        method: 'PUT',
        body: values
    })
}
function onSubmitComplete() {
    navigateTo({
        name: 'dashboard-locations'
    })
}
</script>

<template>
    <section>
        <div class="mt-4 px-4">
            <pre>
                 {{ session }}
            </pre>
            <ProfileInfo />
            <ProfileUpdateForm
                :on-submit="onSubmit"
                :on-submit-complete="onSubmitComplete"
                submit-label="Update Profile"
                submit-icon="update-user-icon"
            />
        </div>
    </section>
</template>
