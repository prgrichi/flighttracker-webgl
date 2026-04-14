<template>
  <div
    :class="!selectedFlight ? 'translate-y-0' : 'translate-y-[calc(100%+12px)]'"
    class="absolute bottom-3 inset-x-0 mx-auto z-20 w-[95%] transform transition-all duration-200 ease-out"
  >
    <footer class="h-10 rounded-lg border border-border bg-surface/70 backdrop-blur-md shadow-md">
      <div class="flex h-full items-center justify-between px-4 text-sm">
        <div class="flex items-center gap-2">
          <!-- Skeleton -->
          <template v-if="!hasLoadedFlights">
            <div
              class="h-4 w-12 rounded bg-neutral-300/70 dark:bg-neutral-700/70 animate-pulse"
            ></div>
            <div
              class="h-4 w-2 rounded bg-neutral-300/70 dark:bg-neutral-700/70 animate-pulse"
            ></div>
            <div
              class="h-4 w-12 rounded bg-neutral-300/70 dark:bg-neutral-700/70 animate-pulse"
            ></div>
          </template>

          <!-- Real Content -->
          <template v-else>
            <span class="font-semibold text-text-primary">{{ formattedRegion }}</span>
            <span class="text-text-secondary">•</span>
            <span class="text-text-secondary font-semibold">{{ flightsCount }} flights</span>
          </template>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const { flightsCount, hasLoadedFlights, region } = useFlightsState();
const { selectedFlight } = useSelectedFlight();

const formattedRegion = computed(() => {
  const r = region.value;
  if (!r) return '';
  return r.charAt(0).toUpperCase() + r.slice(1);
});
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
