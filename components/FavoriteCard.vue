<template>
  <UCard class="rounded-2xl mb-4 shadow-sm border border-default hover:shadow-md transition">
    <div class="flex items-start justify-between gap-4">
      <!-- Left -->
      <div class="min-w-0 flex-1">
        <div class="flex items-center gap-2 mb-2">
          <UBadge color="neutral" variant="soft" class="rounded-full"> ICAO24 </UBadge>

          <span class="text-sm font-mono text-muted">
            {{ fav.icao24 }}
          </span>
        </div>

        <h3 class="text-base font-semibold text-highlighted truncate">
          {{ fav.airlineName || 'Unknown airline' }}
        </h3>

        <p class="text-sm text-muted mb-4 truncate">
          {{ fav.aircraftManufacturer || 'Unknown' }}
          {{ fav.aircraftModel || '' }}
        </p>

        <div class="grid grid-cols-2 gap-3 text-sm">
          <div class="rounded-xl bg-muted/50 px-3 py-2">
            <p class="text-xs text-muted mb-1">Callsign</p>
            <p class="font-medium text-toned">
              {{ fav.liveCallsign || fav.callsign || '—' }}
            </p>
          </div>

          <!-- Status (Phase 1 erstmal statisch oder placeholder) -->
          <div class="rounded-xl bg-muted/50 px-3 py-2">
            <p class="text-xs text-muted mb-1">Status</p>
            <div class="flex items-center gap-2">
              <span
                class="inline-block w-2 h-2 rounded-full"
                :class="getStatusDotClass(fav.liveStatus)"
              ></span>
              <p class="font-medium text-toned">
                {{ getStatusLabel(fav.liveStatus) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Right -->
      <div class="flex flex-col items-end gap-2 shrink-0">
        <UButton
          icon="i-lucide-bookmark"
          color="primary"
          variant="solid"
          square
          class="transition-transform hover:scale-110 active:scale-95"
          @click="$emit('remove', fav.icao24)"
        />
      </div>
    </div>
  </UCard>
</template>
<script setup>
defineProps({
  fav: {
    type: Object,
    required: true,
  },
});

defineEmits(['remove']);

const getStatusLabel = status => {
  if (status === 'air') return 'In air';
  if (status === 'ground') return 'On ground';
  return 'Unknown';
};

const getStatusDotClass = status => {
  if (status === 'air') return 'bg-green-500';
  if (status === 'ground') return 'bg-slate-400';
  return 'bg-amber-500';
};
</script>
<style></style>
