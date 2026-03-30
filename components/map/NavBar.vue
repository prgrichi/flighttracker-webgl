<template>
  <div
    class="absolute z-20 flex flex-col gap-3 right-[calc(1rem+env(safe-area-inset-right))] top-[calc(1rem+env(safe-area-inset-top))]"
  >
    <MapReset />
    <MapTypeSwitcher
      :model-value="modelValue"
      :map-types="mapTypes"
      @update:modelValue="selectMapType"
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

const emit = defineEmits(['update:modelValue']);

const selectMapType = key => {
  emit('update:modelValue', key);
};
</script>
