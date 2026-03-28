import { nextTick, onActivated, onMounted, onUnmounted, ref } from 'vue';
import maplibregl from 'maplibre-gl';
import { getReadableMapError, hasWebGLSupport } from '../../utils/maplibreSupport';
import { useMapInstance } from '@/composables/map/useMapInstance';
import { useMapType } from '@/composables/map/useMapType';
import { useMapState } from '@/composables/map/useMapState';

export function useMaplibreMap(containerRef) {
  const { map } = useMapInstance();
  const { isMapLoaded, mapError } = useMapState();

  const hasInitialMapLoad = ref(false);
  const { MAP_TYPES, currentMapType } = useMapType();

  function syncLoadedState() {
    isMapLoaded.value = !!map.value?.loaded();
  }

  onMounted(() => {
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
        style: MAP_TYPES[currentMapType.value].style || MAP_TYPES[currentMapType.value].url,
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
    syncLoadedState();
    nextTick(() => map.value?.resize());
  });

  onUnmounted(() => {
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
