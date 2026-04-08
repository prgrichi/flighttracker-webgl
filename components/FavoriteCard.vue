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

        <div class="flex items-center mt-3 gap-1 text-[11px] text-muted-foreground/80">
          <UIcon name="i-lucide-clock" class="w-3 h-3" />
          <span>{{ formattedDate }}</span>
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

    <div class="mt-3" v-if="showMapButton">
      <UButton
        icon="i-lucide-map"
        color="primary"
        variant="soft"
        block
        class="justify-center transition-transform hover:scale-[1.02] active:scale-[0.98]"
        :loading="isNavigating"
        :disabled="isNavigating"
        @click="jumpToFavorite"
      >
        Auf Karte anzeigen
      </UButton>
    </div>
  </UCard>
</template>

<script setup>
const props = defineProps({
  fav: {
    type: Object,
    required: true,
  },
  isNavigating: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['remove', 'show-on-map']);

const jumpToFavorite = () => {
  emit('show-on-map', props.fav);
};

const showMapButton = computed(() => {
  return props.fav?.found && props.fav?.liveStatus === 'air';
});

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

const formatter = new Intl.DateTimeFormat('de-DE', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

const formattedDate = computed(() => {
  return props.fav.savedAt ? formatter.format(new Date(props.fav.savedAt)) : '';
});
</script>

<style></style>
