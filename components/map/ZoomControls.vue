<template>
  <div class="absolute top-4 left-4 z-[1100] flex flex-col gap-2">
    <button
      @click="zoomIn"
      aria-label="Zoom in"
      class="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition"
    >
      <UIcon name="i-lucide-plus" class="w-5 h-5 text-gray-700" />
    </button>

    <button
      @click="zoomOut"
      aria-label="Zoom out"
      class="w-12 h-12 flex items-center justify-center rounded-full bg-white/90 backdrop-blur shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition"
    >
      <UIcon name="i-lucide-minus" class="w-5 h-5 text-gray-700" />
    </button>
  </div>
</template>

<script setup>
import { useMap } from '@/composables/useMap';

const { map } = useMap();

const zoomIn = () => {
  map.value?.zoomIn();
};

const zoomOut = () => {
  map.value?.zoomOut();
};
</script>
