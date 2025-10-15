<script setup lang="ts">
import { Button } from '~/components/ui/button'
import UiAuthButton from '../components/ui/auth-button.vue'
definePageMeta({
    layout: 'dashboard'
})
</script>

<template>
    <div class="px-4 w-full h-[200vh]">
        <Button type="button" variant="outline">TessF</Button>

        <UiAuthButton />
    </div>
</template>
