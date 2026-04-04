<template>
  <UPopover :ui="{ content: 'mr-6' }">
    <button
      class="z-[1100] w-12 h-12 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition"
    >
      <UIcon name="i-lucide-layers" class="w-5 h-5 text-gray-700" />
    </button>

    <template #content="{ close }">
      <div class="grid grid-cols-2 gap-2 p-2">
        <div
          v-for="(map, key) in mapTypes"
          :key="key"
          class="cursor-pointer rounded-lg overflow-hidden border"
          :class="key === modelValue ? 'border-primary' : 'border-gray-200'"
          @click="
            () => {
              $emit('update:modelValue', key);
              close();
            }
          "
        >
          <div class="relative">
            <img :src="map.preview" class="w-full h-16 object-cover" />

            <div class="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded">
              {{ map.name }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </UPopover>
</template>

<script setup>
defineProps({
  modelValue: String,
  mapTypes: {
    type: Object,
    required: true,
  },
});

defineEmits(['update:modelValue']);
</script>
