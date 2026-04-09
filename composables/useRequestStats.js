const DEFAULT_REQUEST_STATS = {
  flightsApiRequests: 0,
  favoritesApiRequests: 0,
  flightsOpenSkyRequests: 0,
  favoritesOpenSkyRequests: 0,
};

export const useRequestStats = () => {
  const { data, pending, error, refresh } = useFetch('/api/request-stats', {
    key: 'request-stats',
    default: () => ({
      ...DEFAULT_REQUEST_STATS,
    }),
    server: false,
  });

  const stats = computed(() => {
    return data.value || DEFAULT_REQUEST_STATS;
  });

  const totalApiRequests = computed(() => {
    return stats.value.flightsApiRequests + stats.value.favoritesApiRequests;
  });

  const totalOpenSkyRequests = computed(() => {
    return stats.value.flightsOpenSkyRequests + stats.value.favoritesOpenSkyRequests;
  });

  return {
    stats,
    pending,
    error,
    refresh,
    totalApiRequests,
    totalOpenSkyRequests,
  };
};
