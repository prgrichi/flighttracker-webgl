import { onMounted, ref } from 'vue';
import maplibregl from 'maplibre-gl';
import { getReadableMapError, hasWebGLSupport } from '../utils/maplibreSupport';
import { useMapInstance } from './useMapInstance';

export function useMaplibreMap(containerRef) {
  const { map } = useMapInstance();
  const mapError = ref('');
  const isLoaded = ref(false);
  const config = useRuntimeConfig();

  onMounted(() => {
    if (map.value) return;

    if (!hasWebGLSupport()) {
      mapError.value = 'WebGL wird von dieser Umgebung nicht unterstuetzt.';
      return;
    }

    if (!containerRef?.value) {
      mapError.value = 'Karten-Container wurde nicht gefunden.';
      return;
    }

    if (!config.public.maptilerKey) {
      mapError.value = 'MapTiler-Key fehlt.';
      return;
    }

    try {
      map.value = new maplibregl.Map({
        container: containerRef.value,
        // style: `https://api.maptiler.com/maps/streets/style.json?key=${config.public.maptilerKey}`,
        // style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${config.public.maptilerKey}`,
        style: `https://api.maptiler.com/maps/satellite/style.json?key=${config.public.maptilerKey}`,
        // style: 'https://tiles.openfreemap.org/styles/bright',
        // style: 'https://tiles.openfreemap.org/styles/dark',
        // style: 'https://tiles.openfreemap.org/styles/bright',
        center: [10, 50],
        zoom: 0,
        minZoom: 3,
        maxZoom: 15,
      });

      map.value.on('load', () => {
        isLoaded.value = true;
      });

      map.value.on('error', event => {
        console.error('MapLibre error:', event);
        mapError.value = getReadableMapError(event.error || event);
      });
    } catch (error) {
      mapError.value = getReadableMapError(error);
    }
  });

  return {
    map,
    mapError,
    isLoaded,
  };
}
