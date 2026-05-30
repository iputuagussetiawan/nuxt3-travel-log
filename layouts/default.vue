<script setup lang="ts">
import Header from '~/components/layout/Header.vue'
import Footer from '~/components/layout/Footer.vue'

const authStore = useAuthStore()
await authStore.init()
</script>
<template>
    <div>
        <div class="fixed h-full w-full">
            <video
                class="h-full w-full object-cover"
                autoplay
                muted
                loop
                playsinline
                preload="metadata"
            >
                <source src="/videos/globe.mp4" type="video/mp4" />
            </video>
        </div>
        <Header />
        <slot />
        <Footer />
    </div>
</template>
