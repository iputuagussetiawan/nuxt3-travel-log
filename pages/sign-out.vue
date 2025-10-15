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
            class="flex flex-col justify-center items-center bg-background mt-4 text-center min-h-screen"
        >
            <lucide-loader2 class="animate-spin" />
        </div>
    </div>
</template>
<style lang="scss" scoped></style>
