<script lang="ts" setup>
const authStore = useAuthStore()
onMounted(() => {
    authStore.signOut()
    navigateTo('/')
})
</script>
<template>
    <div class="container mx-auto">
        <div
            class="bg-background mt-4 flex min-h-screen flex-col items-center justify-center text-center"
        >
            <lucide-loader2 class="animate-spin" />
        </div>
    </div>
</template>
<style lang="scss" scoped></style>
