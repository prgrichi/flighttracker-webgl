// composables/useMapControls.js

import { computed } from 'vue';
import { useMapInstance } from './useMapInstance';

export function useMapControls() {
  const { map } = useMapInstance();

  const isReady = computed(() => !!map.value);

  function zoomIn() {
    if (!map.value) return;

    const current = map.value.getZoom();
    const max = map.value.getMaxZoom();

    map.value.easeTo({
      zoom: Math.min(current + 1, max),
      duration: 300,
    });
  }

  function zoomOut() {
    if (!map.value) return;

    const current = map.value.getZoom();
    const min = map.value.getMinZoom();

    map.value.easeTo({
      zoom: Math.max(current - 1, min),
      duration: 300,
    });
  }

  function resetView() {
    if (!map.value) return;

    map.value.easeTo({
      center: [12.4053, 48.0006],
      zoom: 8,
      duration: 500,
    });
  }

  const canZoomIn = computed(() => {
    if (!map.value) return false;
    return map.value.getZoom() < map.value.getMaxZoom();
  });

  const canZoomOut = computed(() => {
    if (!map.value) return false;
    return map.value.getZoom() > map.value.getMinZoom();
  });

  return {
    zoomIn,
    zoomOut,
    resetView,
    canZoomIn,
    canZoomOut,
    isReady,
  };
}
