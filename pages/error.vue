<script lang="ts" setup>
import Alert from '~/components/ui/alert/Alert.vue'
import AlertDescription from '~/components/ui/alert/AlertDescription.vue'
import AlertTitle from '~/components/ui/alert/AlertTitle.vue'
const route = useRoute()
const error = route.query.error || 'Something went wrong'
</script>
<template>
    <div class="container mx-auto">
        <div class="bg-background mt-4 flex flex-col items-center justify-center text-center">
            <Alert>
                <AlertTitle>Heads up!</AlertTitle>
                <AlertDescription> oh no {{ error }} </AlertDescription>
                <NuxtLink to="/"> Home </NuxtLink>
            </Alert>
        </div>
    </div>
</template>
<style lang="scss" scoped></style>
