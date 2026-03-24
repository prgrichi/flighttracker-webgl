<template>
  <div class="absolute bottom-10 right-6 z-[1000]">
    <UPopover :ui="{ content: 'mr-6' }">
      <div class="p-2">
        <UButton
          icon="i-lucide-layers"
          class="h-11 px-3 rounded-xl shadow-md"
          label="Map"
          size="sm"
          color="neutral"
          variant="soft"
        />
      </div>

      <template #content="{ close }">
        <div class="grid grid-cols-3 gap-2 p-2">
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
