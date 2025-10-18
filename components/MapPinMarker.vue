<script lang="ts" setup>
interface MapPinMarkerProps {
    label: string
    active: boolean
    useForInput?: boolean
}
const mapPin = '/map-pin-red.svg'
const mapPinDark = '/map-pin.svg'
const mapPinActive = '/map-pin-blue.svg'
const colorMode = useColorMode()
const props = defineProps<MapPinMarkerProps>()

const pinUrl = computed(() => {
    // 🔹 If type is true → use active icon
    if (props.useForInput) return mapPinActive

    // 🔹 If active → use active icon
    if (props.active) return mapPinActive

    // 🔹 Otherwise switch between dark/light mode
    return colorMode.value === 'dark' ? mapPinDark : mapPin
})
</script>
<template>
    <div class="custom-marker" :class="props.active ? 'active' : ''">
        <div class="custom-marker__image-container">
            <span class="custom-marker__animation"></span>
            <img
                class="custom-marker__image"
                :src="pinUrl"
                :alt="props.label"
            />
        </div>

        <div v-if="props.useForInput" class="custom-marker__input-info">
            Drag Me Here
        </div>
    </div>
</template>
<style lang="scss" scoped>
.custom-marker {
    background-color: transparent;

    &:hover {
        cursor: pointer;
    }

    &:hover &__popup-container {
        opacity: 1;
    }
    &:hover &__input-info {
        opacity: 1;
    }

    &.active &__animation {
        opacity: 1;
    }

    &__input-info {
        opacity: 1;
        min-width: 100px;
        text-align: center;
        position: absolute;
        font-size: 14px;
        top: -10px;
        left: 50%;
        transform: translate(-50%, -50%);
        transition: opacity 0.4s ease-in-out;
    }

    &__popup-container {
        display: none;
        position: absolute;
        bottom: -60px;
        left: 50%;
        transform: translate(-50%, -50%);
        min-width: 100px;
        text-align: center;
        padding: 8px 10px;
        background-color: #fff;
        color: #000;
        border-radius: 4px;
        opacity: 0;
        transition: opacity 0.4s ease-in-out;
    }

    &__animation {
        opacity: 0;
        &::before,
        &::after {
            content: '';
            position: absolute;
            top: 0px;
            left: 0px;
            width: 100%;
            height: 100%;
            border: 4px solid #2d3dfc4d;
            border-radius: 50%;
            animation: pulse-border 1.5s linear infinite;
            animation-delay: 1s;
            background-color: #fff;
            opacity: 1;
        }
        &::after {
            animation-delay: 1.5s;
        }

        &:hover {
            &::before,
            &::after {
                opacity: 1;
            }
        }
    }

    &__image {
        position: relative;
        z-index: 10;
        width: 100% !important;
        height: 100%;
    }

    @keyframes pulse-border {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(1.5);
            opacity: 0;
        }
    }
}
</style>
