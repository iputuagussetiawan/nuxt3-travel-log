<script lang="ts" setup>
interface MapPinMarkerProps {
    label: string
    active: boolean
}
const mapPin = '/map-pin-red.svg'
const mapPinDark = '/map-pin.svg'
const mapPinActive = '/map-pin-blue.svg'
const colorMode = useColorMode()
const props = defineProps<MapPinMarkerProps>()

const pinUrl = computed(() => {
    if (props.active) return mapPinActive
    return colorMode.value === 'dark' ? mapPinDark : mapPin
})
</script>
<template>
    <div class="custom-marker">
        <div class="custom-marker__image-container">
            <span class="custom-marker__animation"></span>
            <img
                class="custom-marker__image"
                :src="pinUrl"
                :alt="props.label"
            />
        </div>
        <div class="custom-marker__popup-container">
            <div class="custom-marker__popup">
                {{ props.label }}
            </div>
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
}
</style>
