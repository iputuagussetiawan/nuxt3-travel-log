<script lang="ts" setup>
const props = defineProps<{
    title: string
    description: string
    confirmLabel: string
}>()
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog'
const isOpen = defineModel<boolean>('open') // controls the modal from outside
const emit = defineEmits(['confirm']) // declare event
</script>
<template>
    <AlertDialog v-model:open="isOpen">
        <AlertDialogContent class="z-[7000]">
            <AlertDialogHeader>
                <AlertDialogTitle>{{ title }}</AlertDialogTitle>
                <AlertDialogDescription>
                    {{ description }}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction @click="emit('confirm')">{{ confirmLabel }}</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
</template>

<style lang="scss" scoped></style>
