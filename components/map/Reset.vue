<template>
  <button
    @click="resetView"
    aria-label="Reset map view"
    class="absolute top-4 right-4 z-[1100] w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition"
  >
    <UIcon name="i-lucide-crosshair" class="w-5 h-5 text-gray-700" />
  </button>
</template>

<script setup>
import { useMap } from '@/composables/useMap';

const { resetView } = useMap();
</script>
