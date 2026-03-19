import { ref } from 'vue';

const map = ref(null);

const DEFAULT_CENTER = [48.137, 11.575]; // München
const DEFAULT_ZOOM = 7;

export function useMap() {
  function setMap(instance) {
    map.value = instance;
  }

  function resetView() {
    if (!map.value) return;
    map.value.flyTo(DEFAULT_CENTER, DEFAULT_ZOOM);
  }

  function fitToFlights(flights) {
    if (!map.value || !flights.length) return;

    const bounds = flights.map(f => [f.lat, f.lon]);
    map.value.fitBounds(bounds, { padding: [20, 20] });
  }

  return {
    map,
    setMap,
    resetView,
    fitToFlights,
  };
}
