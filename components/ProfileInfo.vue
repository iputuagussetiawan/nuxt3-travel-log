<script lang="ts" setup>
const authStore = useAuthStore()
</script>
<template>
    <Card class="w-full max-w-md rounded-2xl shadow-sm">
        <CardHeader class="flex flex-row items-center gap-4">
            <Avatar v-if="authStore.user?.image" class="h-14 w-14">
                <AvatarImage
                    :src="authStore.user?.image"
                    :alt="authStore.user?.name"
                />
                <AvatarFallback>{{ authStore.user?.name }}</AvatarFallback>
            </Avatar>
            <div class="flex flex-col">
                <CardTitle class="text-lg font-semibold">
                    {{ authStore.user?.name }}
                </CardTitle>
                <p class="text-muted-foreground text-sm">
                    {{ authStore.user?.email }}
                </p>
                <p class="text-muted-foreground text-xs">My Role</p>
            </div>
        </CardHeader>
        <CardContent class="flex justify-end gap-2">
            <Button variant="outline" size="sm">Edit Profile</Button>
            <Button size="sm">View</Button>
        </CardContent>
    </Card>
</template>
<style lang="scss" scoped></style>
