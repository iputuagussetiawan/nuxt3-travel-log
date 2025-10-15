<script lang="ts" setup>
import Button from './button/Button.vue'
import { createAuthClient } from "better-auth/client"
const authClient =  createAuthClient()
async function signIn(){
    await authClient.signIn.social({
        provider: "github",
        callbackUrl: "/dashboard",
    })
}
</script>
<template>
    <div>
        <Button @click="signIn">
            Continue with GitHub
            <lucide-github />
        </Button>
    </div>
</template>
<style lang="scss" scoped></style>