<template>
  <footer
    class="relative w-full h-16 border-t border-border bg-surface backdrop-blur supports-[backdrop-filter]:bg-surface/80"
  >
    <div class="flex h-full items-center justify-between px-4 text-sm">
      <!-- Left: Region + Flights -->
      <div class="flex items-center gap-1.5">
        <span class="font-semibold text-text-primary">{{ formattedRegion }}</span>
        <template v-if="hasLoadedFlights">
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

<style></style>
