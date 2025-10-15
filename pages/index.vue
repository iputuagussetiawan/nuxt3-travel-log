<script lang="ts" setup>
import { authClient } from '@/lib/auth-client'
import AuthButton from '../components/ui/auth-button.vue'
const session = authClient.useSession();
</script>
<template>
    <div>
        <h1>Welcome to the homepage</h1>
        <Button>Welcome</Button>
        <AuthButton />

        <pre>{{ session.data }}</pre>
    </div>
</template>