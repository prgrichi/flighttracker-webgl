<template>
  <div class="flex h-full min-h-0 w-full flex-col">
    <Header></Header>
    <div class="relative min-h-0 flex-1 overflow-hidden">
      <div ref="mapContainer" class="map-container h-full w-full"></div>

      <MapNavBar
        v-if="isLoaded && !mapError"
        :model-value="currentMapType"
        :map-types="MAP_TYPES"
        @update:modelValue="setMapType"
      />

      <Transition name="slide-up">
        <FlightCard
          v-if="selectedFlight && !mapError"
          :flight="selectedFlight"
          @close="closeFlightCard"
        />
      </Transition>
      <Transition name="slide-up">
        <LocationCard
          v-if="selectedLocation && !mapError"
          :location="selectedLocation"
          @close="closeLocationCard"
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
    </div>
    <Footer></Footer>
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import { useMaplibreMap } from '@/composables/map/useMaplibreMap';
import { useMapType } from '@/composables/map/useMapType';
import { useMapInstance } from '@/composables/map/useMapInstance';
import { useMapNavigation } from '@/composables/map/useMapNavigation';

import { useAirportLayer } from '@/composables/airports/useAirportLayer';
import { useAirportsData } from '@/composables/airports/useAirportsData';
import { useAirportsState } from '@/composables/airports/useAirportsState';

const mapContainer = ref(null);

const { decoratedGeoJson, region } = useFlightsState();
const { selectedFlight, closeSelectedFlightCard } = useSelectedFlight();
const { selectedLocation } = useSelectedLocation();
const { currentMapType, MAP_TYPES, setMapType } = useMapType();
const { map } = useMapInstance();
const { applyPendingNavigation, pendingNavigation } = useMapNavigation();

const currentMapStyleUrl = computed(() => {
  return MAP_TYPES[currentMapType.value]?.url ?? MAP_TYPES.Default.url;
});

const { isLoaded, mapError } = useMaplibreMap(mapContainer, currentMapStyleUrl);

const appliedMapType = ref(currentMapType.value);

watch(
  [map, currentMapType],
  ([mapInstance, type]) => {
    if (!mapInstance) return;
    if (!MAP_TYPES[type]) return;
    if (appliedMapType.value === type) return;

    appliedMapType.value = type;
    mapInstance.setStyle(MAP_TYPES[type].url);
  },
  { immediate: true }
);

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

useFlightLayer(decoratedGeoJson);

watch(
  [map, isLoaded, decoratedGeoJson, pendingNavigation],
  ([mapInstance, mapLoaded, geoJson, pendingTarget]) => {
    if (!mapInstance || !mapLoaded || !pendingTarget) return;

    applyPendingNavigation(geoJson);
  },
  { immediate: true }
);

const closeFlightCard = () => {
  if (!selectedFlight.value) return;
  closeSelectedFlightCard();
};
const closeLocationCard = () => {
  if (!selectedLocation.value) return;
  selectedLocation.value = null;
};
</script>

<style>
.map-container {
  touch-action: pan-x pan-y;
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
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
