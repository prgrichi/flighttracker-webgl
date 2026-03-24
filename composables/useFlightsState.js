export const useFlightsState = (initialRegion = 'bavaria') => {
  const region = useState('flights:region', () => initialRegion);
  const hadFlightError = useState('flights:hadError', () => false);
  const showRecoveryBanner = useState('flights:recovery', () => false);
  const hasLoadedFlights = useState('flights:hasLoadedFlights', () => false);

  // DELETE AFTER TEST
  const forceFlightError = useState('forceFlightError', () => false);

  const query = computed(() => ({
    region: region.value,
    // DELETE AFTER TEST
    fail: forceFlightError.value ? 'true' : undefined,
  }));

  const { data, pending, error, refresh } = useFetch('/api/flights', {
    key: 'flights',
    query,
    default: () => ({
      type: 'FeatureCollection',
      features: [],
    }),
    server: false,
    immediate: false,
    watch: false,
  });

  const flightsCount = computed(() => {
    return data.value?.features?.length || 0;
  });

  const hasLiveDataError = computed(() => !!error.value);

  return {
    geoJson: data,
    pending,
    error,
    region,
    refresh,
    hasLiveDataError,
    showRecoveryBanner,
    hadFlightError,
    flightsCount,
    hasLoadedFlights,

    // DELETE AFTER TEST
    forceFlightError,
  };
};
