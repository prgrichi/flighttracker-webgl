<template>
  <div class="absolute top-16 inset-x-0 mx-auto w-[95%] z-20 pointer-events-none">
    <div class="flex justify-end">
      <div class="flex flex-col gap-3 pointer-events-auto">
        <MapReset />
        <MapTypeSwitcher
          :model-value="modelValue"
          :map-types="mapTypes"
          @update:modelValue="selectMapType"
        />
      </div>
    </div>
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
