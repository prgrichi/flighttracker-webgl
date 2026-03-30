<template>
  <footer
    class="relative w-full min-h-16 border-t border-border bg-surface backdrop-blur supports-[backdrop-filter]:bg-surface/80 pb-[env(safe-area-inset-bottom)]"
  >
    <div class="flex min-h-16 items-center justify-between px-4 text-sm">
      <div class="flex items-center gap-2">
        <template v-if="!hasLoadedFlights">
          <div
            class="h-4 w-12 rounded bg-neutral-300/70 dark:bg-neutral-700/70 animate-pulse"
          ></div>
          <div class="h-4 w-2 rounded bg-neutral-300/70 dark:bg-neutral-700/70 animate-pulse"></div>
          <div
            class="h-4 w-12 rounded bg-neutral-300/70 dark:bg-neutral-700/70 animate-pulse"
          ></div>
        </template>

        <template v-else>
          <span class="text-text-primary">{{ formattedRegion }}</span>
          <span class="text-text-secondary">•</span>
          <span class="text-text-secondary">{{ flightsCount }} flights</span>
        </template>
      </div>
    </div>
  </footer>
</template>

<script setup>
const { flightsCount, hasLoadedFlights, region } = useFlightsState();

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
