<template>
  <button
    @click="flyToUserLocation"
    :disabled="loading"
    aria-label="Reset map view"
    class="z-[1100] w-12 h-12 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition"
  >
    <UIcon name="i-lucide-crosshair" class="w-5 h-5 text-gray-700" />
  </button>
</template>

<script setup>
import { useMapControls } from '@/composables/map/useMapControls';

const { flyToUserLocation } = useMapControls();
const { loading } = useGeolocation();
</script>
