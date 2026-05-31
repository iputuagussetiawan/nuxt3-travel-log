<script lang="ts" setup>
import { Icon } from '@iconify/vue'

const authStore = useAuthStore()
const { $csrfFetch } = useNuxtApp()

const uploading = ref(false)
const uploadError = ref('')
const fileInput = ref<HTMLInputElement | null>(null)

async function handleFileChange(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
        uploadError.value = 'Image must be under 5MB.'
        return
    }

    uploading.value = true
    uploadError.value = ''

    try {
        const form = new FormData()
        form.append('file', file)

        const { url } = await $csrfFetch<{ url: string }>(
            '/api/upload/avatar',
            {
                method: 'POST',
                body: form
            }
        )

        await $csrfFetch('/api/auth/user', {
            method: 'PUT',
            body: {
                name: authStore.user?.name ?? '',
                email: authStore.user?.email ?? '',
                image: url
            }
        })

        await authStore.init()
    } catch {
        uploadError.value = 'Upload failed. Please try again.'
    } finally {
        uploading.value = false
        if (fileInput.value) fileInput.value.value = ''
    }
}

const roleColor: Record<string, string> = {
    admin: 'bg-violet-500/15 text-violet-500',
    member: 'bg-emerald-500/15 text-emerald-500',
    user: 'bg-zinc-500/15 text-zinc-500'
}
</script>

<template>
    <Card class="w-full max-w-xs shrink-0 rounded-2xl shadow-sm">
        <CardContent class="flex flex-col items-center gap-5 pt-8 pb-6">
            <!-- Avatar with upload overlay -->
            <div class="group relative">
                <Avatar class="ring-background h-24 w-24 shadow-md ring-4">
                    <AvatarImage
                        v-if="authStore.user?.image"
                        :src="authStore.user.image"
                        :alt="authStore.user?.name"
                    />
                    <AvatarFallback class="text-2xl font-semibold">
                        {{ authStore.user?.name?.slice(0, 2).toUpperCase() }}
                    </AvatarFallback>
                </Avatar>

                <!-- Upload overlay button -->
                <button
                    type="button"
                    :disabled="uploading"
                    class="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 disabled:cursor-not-allowed"
                    @click="fileInput?.click()"
                >
                    <Icon
                        v-if="uploading"
                        icon="lucide:loader-2"
                        class="h-6 w-6 animate-spin text-white"
                    />
                    <Icon
                        v-else
                        icon="lucide:camera"
                        class="h-6 w-6 text-white"
                    />
                </button>

                <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    class="hidden"
                    @change="handleFileChange"
                />
            </div>

            <!-- Error -->
            <p v-if="uploadError" class="text-destructive text-center text-xs">
                {{ uploadError }}
            </p>

            <!-- Name & email -->
            <div class="text-center">
                <p class="text-lg font-semibold">{{ authStore.user?.name }}</p>
                <p class="text-muted-foreground mt-0.5 text-sm">
                    {{ authStore.user?.email }}
                </p>
            </div>

            <!-- Role badge -->
            <span
                :class="[
                    roleColor[authStore.role] ?? roleColor.user,
                    'rounded-full px-3 py-0.5 text-xs font-semibold capitalize'
                ]"
            >
                {{ authStore.role }}
            </span>

            <!-- Info rows -->
            <div class="w-full space-y-2 border-t pt-4">
                <div class="flex items-center gap-2 text-sm">
                    <Icon
                        icon="lucide:mail"
                        class="text-muted-foreground h-4 w-4 shrink-0"
                    />
                    <span class="text-muted-foreground truncate">{{
                        authStore.user?.email
                    }}</span>
                </div>
                <div class="flex items-center gap-2 text-sm">
                    <Icon
                        :icon="
                            authStore.user?.emailVerified
                                ? 'lucide:shield-check'
                                : 'lucide:shield-x'
                        "
                        :class="
                            authStore.user?.emailVerified
                                ? 'text-emerald-500'
                                : 'text-destructive'
                        "
                        class="h-4 w-4 shrink-0"
                    />
                    <span
                        :class="
                            authStore.user?.emailVerified
                                ? 'text-emerald-500'
                                : 'text-destructive'
                        "
                        class="text-sm"
                    >
                        {{
                            authStore.user?.emailVerified
                                ? 'Email verified'
                                : 'Email not verified'
                        }}
                    </span>
                </div>
            </div>

            <!-- Upload hint -->
            <p class="text-muted-foreground text-center text-xs">
                Hover avatar to change photo<br />Max 5MB · JPG, PNG, WEBP
            </p>
        </CardContent>
    </Card>
</template>
