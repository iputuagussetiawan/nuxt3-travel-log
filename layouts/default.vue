<script setup lang="ts">
const authStore = useAuthStore()
await authStore.init()
</script>
<template>
    <div>
        <AppHeader />
        <slot />
        <AppFooter />
    </div>
</template>
