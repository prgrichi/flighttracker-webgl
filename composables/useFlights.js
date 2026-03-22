export const useFlights = (initialRegion = 'bavaria') => {
  const region = ref(initialRegion);
  const toast = useToast();
  let lastErrorKey = null;

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

  watch(error, value => {
    if (!value) {
      lastErrorKey = null;
      return;
    }

    const message =
      value.statusMessage || value.message || 'Flight-Daten konnten nicht geladen werden.';
    const errorKey = `${value.statusCode || 'unknown'}:${message}`;

    if (errorKey === lastErrorKey) return;

    lastErrorKey = errorKey;

    toast.add({
      title: 'Flight-Update fehlgeschlagen',
      description: message,
      color: 'error',
    });
  });

  return {
    geoJson: data,
    pending,
    error,
    region,
    refresh,
  };
};
