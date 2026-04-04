import { computed } from 'vue';
import { useLocalStorage } from '@vueuse/core';

export const useFavorites = () => {
  const favorites = useLocalStorage('flights:favorites', []);

  const normalizeIcao24 = icao24 => {
    return icao24?.trim().toLowerCase() || '';
  };

  const isFavorite = icao24 => {
    const normalized = normalizeIcao24(icao24);
    if (!normalized) return false;

    return favorites.value.some(f => f.icao24 === normalized);
  };

  const addFavorite = flight => {
    console.log('add');
    const icao24 = normalizeIcao24(flight?.icao24);
    if (!icao24) return;

    if (isFavorite(icao24)) return;

    favorites.value.push({
      icao24,
      callsign: flight?.callsign?.trim() || undefined,
      airlineName: flight?.airlineName?.trim() || undefined,
      aircraftManufacturer: flight?.aircraftManufacturer?.trim() || undefined,
      aircraftModel: flight?.aircraftModel?.trim() || undefined,
      savedAt: Date.now(),
    });
  };

  const removeFavorite = icao24 => {
    console.log('remove');

    const normalized = normalizeIcao24(icao24);
    if (!normalized) return;

    favorites.value = favorites.value.filter(f => f.icao24 !== normalized);
  };

  const toggleFavorite = flight => {
    console.log('toggle');

    const icao24 = normalizeIcao24(flight?.icao24);
    if (!icao24) return;

    if (isFavorite(icao24)) {
      removeFavorite(icao24);
    } else {
      addFavorite(flight);
    }
  };

  const favoriteCount = computed(() => favorites.value.length);

  return {
    favorites,
    favoriteCount,
    isFavorite,
    addFavorite,
    removeFavorite,
    toggleFavorite,
  };
};
