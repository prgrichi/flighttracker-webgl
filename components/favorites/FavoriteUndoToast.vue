<template>
  <Transition name="undo-banner">
    <div
      v-if="item"
      class="fixed inset-x-0 bottom-5 z-50 flex justify-center px-4 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      <div
        class="pointer-events-auto w-full sm:w-[min(640px,100%)] rounded-xl bg-zinc-900 text-white shadow-2xl"
      >
        <div class="flex items-center justify-between gap-4 px-4 py-3">
          <p class="text-sm">
            <span class="font-medium">{{ item.label }}</span> entfernt
          </p>

          <button
            @click="$emit('undo')"
            class="text-sm font-semibold text-primary transition hover:underline"
          >
            Rückgängig
          </button>
        </div>

        <div class="h-[2px] bg-white/10">
          <div
            class="h-full bg-primary transition-[width] duration-100 linear"
            :style="{ width: `${progressPercent}%` }"
          ></div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
defineProps({
  item: {
    type: Object,
    default: null,
  },
  progressPercent: {
    type: Number,
    default: 100,
  },
});

defineEmits(['undo']);
</script>

<style scoped>
.undo-banner-enter-active,
.undo-banner-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.undo-banner-enter-from,
.undo-banner-leave-to {
  opacity: 0;
  transform: translateY(12px);
}
</style>
