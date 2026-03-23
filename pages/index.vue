<template>
  <div class="relative w-full h-full overflow-hidden">
    <div v-if="mapError" class="flex h-full w-full items-center justify-center p-6">
      <div class="max-w-lg rounded-2xl border border-red-200 bg-white/95 p-6 shadow-sm">
        <p class="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
          Kartenansicht nicht verfuegbar
        </p>
        <h1 class="mt-2 text-2xl font-semibold text-neutral-900">
          WebGL konnte nicht gestartet werden
        </h1>
        <p class="mt-3 text-sm leading-6 text-neutral-600">
          Die Karte braucht WebGL. In diesem Browser oder System ist WebGL aktuell deaktiviert oder
          blockiert.
        </p>
        <p class="mt-3 text-sm leading-6 text-neutral-500">
          {{ mapError }}
        </p>
      </div>
    </div>

    <template v-else>
      <div class="relative w-full h-full">
        <div ref="mapContainer" class="h-full w-full"></div>

        <MapLoader v-if="isLoading" />
        <MapZoomControls v-if="isLoaded" />
        <MapReset v-if="isLoaded" />
        <MapTypeSwitcher
          :model-value="currentMapType"
          :mapTypes="MAP_TYPES"
          @update:modelValue="setMapType"
        />

        <Transition name="slide-up">
          <FlightCard v-if="selectedFlight" :flight="selectedFlight" @close="closeFLightCard" />
        </Transition>
      </div>
    </template>
  </div>
</template>

<script setup>
console.log('PAGE SCRIPT SETUP RUNS');

import { useMapType } from '../composables/useMapType';

definePageMeta({
  keepalive: true,
});

const mapContainer = ref(null);
const { isLoaded, mapError } = useMaplibreMap(mapContainer);
console.log('before useFlights');
const { geoJson } = useFlights('bavaria');
console.log('after useFlights');
const { selectedFlight } = useSelectedFlight();
const { currentMapType, MAP_TYPES, setMapType } = useMapType();

const isLoading = computed(() => !isLoaded.value && !mapError.value);

useFlightLayer(geoJson);

const closeFLightCard = () => {
  console.log('clear selected flight');
  if (!selectedFlight.value) return;

  selectedFlight.value = null;
};
</script>

<style>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.25s ease;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

.slide-up-enter-to,
.slide-up-leave-from {
  transform: translateY(0);
  opacity: 1;
}
</style>
