export const useFlights = (initialRegion = 'bavaria') => {
  const region = ref(initialRegion);
  const query = computed(() => ({
    region: region.value,
  }));

  const { data, pending, error, refresh } = useFetch('/api/flights', {
    query,
    default: () => [],
  });

  let interval = null;

  function startPolling() {
    if (interval) return;

    interval = setInterval(() => {
      console.log('fetching flights...');
      refresh();
    }, 20000);
  }

  onMounted(() => {
    startPolling();
  });

  return {
    geoJson: data,
    pending,
    error,
    region,
    refresh,
  };
};
