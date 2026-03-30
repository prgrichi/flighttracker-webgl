<template>
  <div class="absolute z-20 flex flex-col gap-3 right-6 top-6">
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
