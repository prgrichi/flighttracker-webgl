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
    server: false,
    immediate: false,
    watch: false,
  });

  let interval = null;
  let hasActivatedOnce = false;

  function startPolling() {
    if (interval) return;

    interval = setInterval(() => {
      console.log('poll refresh');
      refresh();
    }, 20_000);
  }

  function stopPolling() {
    if (!interval) return;
    clearInterval(interval);
    interval = null;
  }

  onMounted(async () => {
    await refresh(); // erster Request ganz bewusst hier
    startPolling();
  });

  onActivated(() => {
    if (hasActivatedOnce) {
      refresh();
    }

    hasActivatedOnce = true;
    startPolling();
  });

  onDeactivated(() => {
    stopPolling();
  });

  onUnmounted(() => {
    stopPolling();
  });

  watch(region, () => {
    refresh();
  });

  return {
    geoJson: data,
    pending,
    error,
    region,
    refresh,
  };
};
