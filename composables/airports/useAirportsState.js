// composables/useAirportsState.js
import { useLocalStorage } from '@vueuse/core';

export function useAirportsState() {
  const showLargeAirports = useLocalStorage('airports:showLarge', true);
  const showMediumAirports = useLocalStorage('airports:showMedium', false);
  const showSmallAirports = useLocalStorage('airports:showSmall', false);
  const showHeliports = useLocalStorage('airports:showHeliports', false);

  return {
    showLargeAirports,
    showMediumAirports,
    showSmallAirports,
    showHeliports,
  };
}
