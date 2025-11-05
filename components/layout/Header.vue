<script lang="ts" setup>
import UiThemeToggle from '~/components/ui/ThemeToggle.vue'
import UiAuthButton from '~/components/ui/auth-button.vue'
</script>
<template>
    <header
        class="border-grid bg-background/95 supports-[backdrop-filter]:bg-background/60 fixed top-0 z-50 w-full border-b backdrop-blur"
    >
        <div class="container-wrapper">
            <div class="container mx-auto flex h-14 items-center">
                <div class="mr-4 hidden md:mr-1 md:flex">
                    <a
                        href="/"
                        class="lg:space-x1 mr-4 flex items-center md:mr-2 lg:mr-6 xl:space-x-2"
                        ><svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 256 256"
                            class="h-6 w-6 text-[#41B883]"
                        >
                            <rect width="256" height="256" fill="none"></rect>
                            <line
                                x1="208"
                                y1="128"
                                x2="128"
                                y2="208"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="32"
                            ></line>
                            <line
                                x1="192"
                                y1="40"
                                x2="40"
                                y2="192"
                                fill="none"
                                stroke="currentColor"
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="32"
                            ></line></svg
                        ><span class="font-bold"> Travel Log </span></a
                    >
                </div>
                <div class="ml-auto flex items-center gap-2">
                    <UiAuthButton />
                    <UiThemeToggle />
                </div>
            </div>
        </div>
    </header>
</template>
<style lang="scss" scoped></style>
