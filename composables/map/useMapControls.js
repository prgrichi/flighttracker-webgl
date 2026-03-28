// composables/useMapControls.js

import { computed, watch } from 'vue';
import { useMapInstance } from '@/composables/map/useMapInstance';

export function useMapControls() {
  const { map } = useMapInstance();
  const { position, loading, getLocation } = useGeolocation();

  const isReady = computed(() => !!map.value);

  const zoomIn = () => {
    if (!map.value) return;

    const current = map.value.getZoom();
    const max = map.value.getMaxZoom();

    map.value.easeTo({
      zoom: Math.min(current + 1, max),
      duration: 300,
    });
  };

  const zoomOut = () => {
    if (!map.value) return;

    const current = map.value.getZoom();
    const min = map.value.getMinZoom();

    map.value.easeTo({
      zoom: Math.max(current - 1, min),
      duration: 300,
    });
  };

  const flyToUserLocation = () => {
    if (!map.value || loading.value) return;

    getLocation();
  };

  const canZoomIn = computed(() => {
    if (!map.value) return false;
    return map.value.getZoom() < map.value.getMaxZoom();
  });

  const canZoomOut = computed(() => {
    if (!map.value) return false;
    return map.value.getZoom() > map.value.getMinZoom();
  });

  watch(position, value => {
    if (!map.value || !value) return;

    console.log('Neue Position:', value);

    map.value.easeTo({
      center: [value.lon, value.lat],
      zoom: 9,
      duration: 500,
    });
  });

  return {
    zoomIn,
    zoomOut,
    flyToUserLocation,
    canZoomIn,
    canZoomOut,
    isReady,
  };
}
