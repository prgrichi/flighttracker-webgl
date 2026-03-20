<template>
  <div class="relative h-screen w-full overflow-hidden bg-neutral-100">
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

    <div v-else ref="mapContainer" class="h-full w-full"></div>
  </div>
</template>

<script setup>
import { watch } from 'vue';

const { geoJson } = useFlights();

const mapContainer = ref(null);
const { map, mapError } = useMaplibreMap(mapContainer);

// Map Setup
watch(map, mapInstance => {
  if (!mapInstance) return;

  mapInstance.on('load', async () => {
    console.log('Map ready 🚀');

    // 1. Source
    mapInstance.addSource('flights', {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [],
      },
    });

    try {
      // 2. Image laden (async)
      const image = await mapInstance.loadImage('/plane.png');

      if (!mapInstance.hasImage('plane')) {
        mapInstance.addImage('plane', image.data);
      }

      // 3. Layer
      mapInstance.addLayer({
        id: 'flights-layer',
        type: 'symbol',
        source: 'flights',
        layout: {
          'icon-image': 'plane',
          'icon-size': ['interpolate', ['linear'], ['zoom'], 5, 0.15, 8, 0.25, 12, 0.4],
          'icon-rotate': ['get', 'heading'], // 👈 DAS ist dein Heading
          'icon-rotation-alignment': 'map', // 👈 wichtig!
          'icon-allow-overlap': true,
          'icon-anchor': 'center',
        },
      });
    } catch (err) {
      console.error('Image load failed:', err);
    }
  });
});

// 🔵 Daten → Map
watch([geoJson, map], ([data, mapInstance]) => {
  if (!data || !mapInstance) return;

  const source = mapInstance.getSource('flights');
  if (!source) return;

  source.setData(data);
});
</script>
