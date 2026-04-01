import { nextTick, onActivated, onDeactivated, onMounted, onUnmounted, ref } from 'vue';
import maplibregl from 'maplibre-gl';
import { getReadableMapError, hasWebGLSupport } from '@/utils/maplibreSupport';
import { useMapInstance } from '@/composables/map/useMapInstance';
import { useMapState } from '@/composables/map/useMapState';

export function useMaplibreMap(containerRef, initialMapStyleUrl) {
  const { map } = useMapInstance();
  const { isMapMounted, isMapLoaded, mapError } = useMapState();

  const hasInitialMapLoad = ref(false);

  function syncLoadedState() {
    isMapLoaded.value = !!map.value?.loaded();
  }

  onMounted(() => {
    isMapMounted.value = true;

    if (map.value) {
      syncLoadedState();
      nextTick(() => map.value?.resize());
      return;
    }

    isMapLoaded.value = false;
    mapError.value = '';
    hasInitialMapLoad.value = false;

    if (!hasWebGLSupport()) {
      mapError.value = 'WebGL wird von dieser Umgebung nicht unterstuetzt.';
      return;
    }

    if (!containerRef?.value) {
      mapError.value = 'Karten-Container wurde nicht gefunden.';
      return;
    }

    try {
      map.value = new maplibregl.Map({
        container: containerRef.value,
        style: initialMapStyleUrl.value,
        center: [12.4053, 48.0006],
        zoom: 8,
        minZoom: 3,
        maxZoom: 11,
        maxBounds: [
          [-10, 35],
          [30, 60],
        ],
      });

      map.value.on('load', () => {
        isMapLoaded.value = true;
        hasInitialMapLoad.value = true;
        mapError.value = '';
      });

      map.value.on('error', event => {
        console.error('MapLibre error:', event);

        if (!hasInitialMapLoad.value) {
          mapError.value = getReadableMapError(event.error || event);
        }
      });
    } catch (error) {
      mapError.value = getReadableMapError(error);
    }
  });

  onActivated(() => {
    isMapMounted.value = true;
    syncLoadedState();
    nextTick(() => map.value?.resize());
  });

  onDeactivated(() => {
    isMapMounted.value = false;
  });

  onUnmounted(() => {
    isMapMounted.value = false;
    isMapLoaded.value = false;
    hasInitialMapLoad.value = false;

    if (!map.value) return;

    map.value.remove();
    map.value = null;
  });

  return {
    map,
    isLoaded: isMapLoaded,
    mapError,
  };
}
