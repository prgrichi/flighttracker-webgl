export const useFlights = (initialRegion = 'bavaria') => {
  const region = ref(initialRegion);

  const query = computed(() => ({
    region: region.value,
  }));

  const { data, pending, error, refresh } = useFetch('/api/flights', {
    query,
    default: () => ({
      type: 'FeatureCollection',
      features: [],
    }),
  });

  let interval = null;

  function startPolling() {
    if (interval) return;

    interval = setInterval(() => {
      console.log('fetch flights');
      refresh();
    }, 20_000);
  }

  function stopPolling() {
    if (!interval) return;

    clearInterval(interval);
    interval = null;
  }

  onMounted(startPolling);

  onActivated(() => {
    refresh();
    startPolling();
  });

  onDeactivated(stopPolling);
  onUnmounted(stopPolling);

  return {
    geoJson: data,
    pending,
    error,
    region,
    refresh,
  };
};
