import { onMounted, onUnmounted, ref } from 'vue';
import maplibregl from 'maplibre-gl';
import { getReadableMapError, hasWebGLSupport } from '../utils/maplibreSupport';

export function useMaplibreMap(containerRef) {
  const map = ref(null);
  const mapError = ref('');
  const isLoaded = ref(false);
  const config = useRuntimeConfig();

  onMounted(() => {
    if (!hasWebGLSupport()) {
      mapError.value = 'WebGL wird von dieser Umgebung nicht unterstuetzt.';
      return;
    }

    if (!containerRef?.value) {
      mapError.value = 'Karten-Container wurde nicht gefunden.';
      return;
    }

    if (!config.public.maptilerKey) {
      mapError.value = 'MapTiler-Key fehlt. Bitte `NUXT_PUBLIC_MAPTILER_KEY` in der `.env` setzen.';
      return;
    }

    try {
      map.value = new maplibregl.Map({
        container: containerRef.value,
        // style: `https://api.maptiler.com/maps/streets/style.json?key=${config.public.maptilerKey}`,
        // style: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${config.public.maptilerKey}`,
        // style: `https://api.maptiler.com/maps/satellite/style.json?key=${config.public.maptilerKey}`,
        style: 'https://tiles.openfreemap.org/styles/bright',
        // style: 'https://tiles.openfreemap.org/styles/dark',
        center: [10, 50],
        zoom: 4.5,
      });

      map.value.on('load', () => {
        isLoaded.value = true;
      });

      map.value.addControl(new maplibregl.NavigationControl(), 'top-left');

      map.value.on('error', event => {
        console.error('MapLibre error:', event);
        mapError.value = getReadableMapError(event.error || event);
      });
    } catch (error) {
      mapError.value = getReadableMapError(error);
    }
  });

  onUnmounted(() => {
    map.value?.remove();
  });

  return {
    map,
    mapError,
    isLoaded,
  };
}
