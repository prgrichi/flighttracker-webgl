<template>
  <UDrawer v-model:open="open" :ui="{ content: 'rounded-t-3xl' }">
    <button
      class="z-[1100] w-12 h-12 flex items-center justify-center rounded-lg bg-white/90 backdrop-blur shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition"
    >
      <UIcon name="i-lucide-layers" class="w-5 h-5 text-gray-700" />
    </button>

    <template #content>
      <div class="p-5">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-xl font-semibold text-gray-900">Kartentyp</h2>

          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            size="lg"
            class="rounded-lg"
            @click="open = false"
          />
        </div>

        <div class="grid grid-cols-2 gap-4 gap-y-8 justify-items-center">
          <button
            v-for="(map, key) in mapTypes"
            :key="key"
            type="button"
            class="flex flex-col items-center text-center w-full max-w-[120px]"
            @click="selectMapType(key)"
          >
            <div
              class="w-full aspect-square overflow-hidden rounded-2xl border bg-white"
              :class="
                key === modelValue ? 'border-primary ring-2 ring-primary/30' : 'border-gray-200'
              "
            >
              <img :src="map.preview" :alt="map.name" class="h-full w-full object-cover" />
            </div>

            <span
              class="mt-2 text-sm font-medium"
              :class="key === modelValue ? 'text-primary' : 'text-gray-800'"
            >
              {{ map.name }}
            </span>
          </button>
        </div>
      </div>
    </template>
  </UDrawer>
</template>

<script setup>
defineProps({
  modelValue: String,
  mapTypes: {
    type: Object,
    required: true,
  },
});

const open = ref(false);

const emit = defineEmits(['update:modelValue']);

const selectMapType = key => {
  emit('update:modelValue', key);
  open.value = false;
};
</script>
