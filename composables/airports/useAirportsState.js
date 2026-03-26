// composables/useAirportsState.js
export function useAirportsState() {
  const showLargeAirports = useState('airports:showLarge', () => true);
  const showMediumAirports = useState('airports:showMedium', () => true);
  const showSmallAirports = useState('airports:showSmall', () => false);
  const showHeliports = useState('airports:showHeliports', () => false);

  return {
    showLargeAirports,
    showMediumAirports,
    showSmallAirports,
    showHeliports,
  };
}
