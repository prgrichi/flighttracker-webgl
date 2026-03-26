// composables/useAirportsData.js
import { computed, watch, ref } from 'vue';

const REGION_FILE_MAP = {
  bavaria: '/data/airports-bavaria.geojson',
  germany: '/data/airports-germany.geojson',
  europe: '/data/airports-europe.geojson',
};

const EMPTY_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

export function useAirportsData(region) {
  const airportsGeoJson = ref(EMPTY_COLLECTION);
  const airportsPending = ref(false);
  const airportsError = ref(null);

  const currentFile = computed(() => {
    return REGION_FILE_MAP[region.value] || null;
  });

  async function loadAirports() {
    if (!currentFile.value) {
      airportsGeoJson.value = EMPTY_COLLECTION;
      return;
    }

    airportsPending.value = true;
    airportsError.value = null;

    try {
      const data = await $fetch(currentFile.value);
      airportsGeoJson.value = data;
    } catch (error) {
      console.error('Failed to load airports:', error);
      airportsError.value = error;
      airportsGeoJson.value = EMPTY_COLLECTION;
    } finally {
      airportsPending.value = false;
    }
  }

  watch(currentFile, loadAirports, { immediate: true });

  return {
    airportsGeoJson,
    airportsPending,
    airportsError,
    reloadAirports: loadAirports,
  };
}
