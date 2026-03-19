export const useFlights = (initialRegion = 'bavaria') => {
  const region = ref(initialRegion);
  const query = computed(() => ({
    region: region.value,
  }));

  const { data, pending, error, refresh } = useFetch('/api/flights', {
    query,
    default: () => [],
  });

  // const hasError = computed(() => !!error.value);

  // function setRegion(newRegion) {
  //   region.value = newRegion;
  //   refresh();
  // }

  let interval = null;

  function startPolling() {
    if (interval) return;

    interval = setInterval(() => {
      console.log('fetching flights...');
      refresh();
    }, 30000);
  }

  // function stopPolling() {
  //   if (!interval) return;

  //   clearInterval(interval);
  //   interval = null;
  // }

  onMounted(() => {
    startPolling();
  });

  return {
    flights: data,
    pending,
    error,
    // hasError,
    region,
    // setRegion,
    refresh,
  };
};
