export const useFlightsState = (initialRegion = 'bavaria') => {
  const region = useState('flights:region', () => initialRegion);
  const hadFlightError = useState('flights:hadError', () => false);
  const showRecoveryBanner = useState('flights:recovery', () => false);
  const hasLoadedFlights = useState('flights:hasLoadedFlights', () => false);

  const query = computed(() => ({
    region: region.value,
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

  const refreshFlights = async () => {
    if (import.meta.client && !navigator.onLine) {
      return;
    }

    await refresh();
  };

  const hasLiveDataError = computed(() => !!error.value);
  const hasLiveDataErrorMsg = computed(() => {
    const err = error.value;

    if (!err) return null;

    if (err.data?.code === 'OPENSKY_RATE_LIMIT') {
      return 'OpenSky rate limit reached. Try again later.';
    }

    // fallback auf status
    if (err.statusCode === 429) {
      return 'Rate limit erreicht.';
    }

    if (err.statusCode >= 500) {
      return 'Live-Flugdaten aktuell nicht verfügbar.';
    }

    // fallback allgemein
    return err.statusMessage || 'Unknown error';
  });

  return {
    geoJson: data,
    pending,
    error,
    region,
    refresh: refreshFlights,
    hasLiveDataError,
    hasLiveDataErrorMsg,
    showRecoveryBanner,
    hadFlightError,
    flightsCount,
    hasLoadedFlights,
  };
};
