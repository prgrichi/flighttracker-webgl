<template>
  <div class="hidden md:block">
    <MapDesktopPopoverMapSwitcher
      :model-value="modelValue"
      :map-types="mapTypes"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>

  <div class="md:hidden">
    <MapMobileBottomMapSwitcher
      :model-value="modelValue"
      :map-types="mapTypes"
      @update:modelValue="$emit('update:modelValue', $event)"
    />
  </div>
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
