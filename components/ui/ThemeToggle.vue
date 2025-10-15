<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { Button } from '@/components/ui/button'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger
} from '@/components/ui/tooltip'

const colorMode = useColorMode()

// Toggle between light and dark
const toggleMode = () => {
    colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}

// Tooltip text
const tooltipText = computed(() =>
    colorMode.preference === 'dark'
        ? 'Switch to Light Mode'
        : 'Switch to Dark Mode'
)
</script>

<template>
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger as-child>
                <Button
                    variant="outline"
                    size="icon"
                    class="relative"
                    @click="toggleMode"
                >
                    <Icon
                        :icon="
                            colorMode.preference === 'dark'
                                ? 'radix-icons:sun'
                                : 'radix-icons:moon'
                        "
                        class="h-[1.2rem] w-[1.2rem] transition-all"
                    />
                    <span class="sr-only">Toggle theme</span>
                </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom">
                {{ tooltipText }}
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
</template>
