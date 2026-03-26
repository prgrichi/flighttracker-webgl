<template>
  <div class="relative w-full h-full overflow-hidden">
    <div class="relative h-full w-full">
      <div ref="mapContainer" class="map-container h-full w-full"></div>

      <MapLoader v-if="isLoading" />
      <MapZoomControls v-if="isLoaded && !mapError" />
      <MapReset v-if="isLoaded && !mapError" />
      <MapTypeSwitcher
        v-if="isLoaded && !mapError"
        :model-value="currentMapType"
        :map-types="MAP_TYPES"
        @update:modelValue="setMapType"
      />

      <Transition name="slide-up">
        <FlightCard
          v-if="selectedFlight && !mapError"
          :flight="selectedFlight"
          @close="closeFLightCard"
        />
      </Transition>

      <div
        v-if="mapError"
        class="absolute inset-0 z-[2000] flex items-center justify-center bg-white/95 p-6"
      >
        <div class="max-w-lg rounded-2xl border border-red-200 bg-white/95 p-6 shadow-sm">
          <p class="text-sm font-semibold uppercase tracking-[0.18em] text-red-600">
            Kartenansicht nicht verfuegbar
          </p>
          <h1 class="mt-2 text-2xl font-semibold text-neutral-900">
            WebGL konnte nicht gestartet werden
          </h1>
          <p class="mt-3 text-sm leading-6 text-neutral-600">
            Die Karte braucht WebGL. In diesem Browser oder System ist WebGL aktuell deaktiviert
            oder blockiert.
          </p>
          <p class="mt-3 text-sm leading-6 text-neutral-500">
            {{ mapError }}
          </p>
        </div>
      </div>

      <!-- Gesture Guard -->
      <!-- <div class="gesture-guard-bottom"></div> -->
    </div>
  </div>
</template>

<script setup>
import { useAirportLayer } from '@/composables/airports/useAirportLayer';
import { useAirportsData } from '@/composables/airports/useAirportsData';
import { useAirportsState } from '@/composables/airports/useAirportsState';

definePageMeta({
  keepalive: true,
});

const mapContainer = ref(null);
const { isLoaded, mapError } = useMaplibreMap(mapContainer);
const { geoJson, region } = useFlightsState();
const { selectedFlight } = useSelectedFlight();
const { currentMapType, MAP_TYPES, setMapType } = useMapType();

const isLoading = computed(() => !isLoaded.value && !mapError.value);

const { airportsGeoJson } = useAirportsData(region);

const { showLargeAirports, showMediumAirports, showSmallAirports, showHeliports } =
  useAirportsState();

useAirportLayer({
  geoJson: airportsGeoJson,
  showLargeAirports,
  showMediumAirports,
  showSmallAirports,
  showHeliports,
});

useFlightLayer(geoJson);

const closeFLightCard = () => {
  if (!selectedFlight.value) return;
  selectedFlight.value = null;
};
</script>

<style>
.map-container {
  touch-action: pan-x pan-y;
}

/* .gesture-guard-bottom {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 50px;
  z-index: 10;
} */

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
