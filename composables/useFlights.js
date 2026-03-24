export const useFlights = (initialRegion = 'bavaria') => {
  const region = ref(initialRegion);
  let hadFlightError = false;
  let recoveryBannerTimeout = null;

  // DELETE AFTER TEST
  const forceFlightError = useState('forceFlightError', () => false);

  const query = computed(() => ({
    region: region.value,
    // DELETE AFTER TEST
    fail: forceFlightError.value ? 'true' : undefined,
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

  const hasLiveDataError = computed(() => !!error.value);
  const liveDataErrorMessage = computed(() => {
    const value = error.value;

    if (!value) return '';

    return (
      (value.data && value.data.message) ||
      value.statusMessage ||
      value.message ||
      'Flight-Daten konnten nicht geladen werden.'
    );
  });

  const showRecoveryBanner = ref(false);
  const triggerRecoveryBanner = () => {
    showRecoveryBanner.value = true;

    if (recoveryBannerTimeout) {
      clearTimeout(recoveryBannerTimeout);
    }

    recoveryBannerTimeout = setTimeout(() => {
      showRecoveryBanner.value = false;
      recoveryBannerTimeout = null;
    }, 3000);
  };

  let interval = null;
  let hasActivatedOnce = false;

  const startPolling = () => {
    if (interval) return;

    interval = setInterval(() => {
      console.log('poll refresh (20s)');
      refresh();
    }, 20_000);
  };

  const stopPolling = () => {
    if (!interval) return;
    clearInterval(interval);
    interval = null;
  };

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
    if (recoveryBannerTimeout) {
      clearTimeout(recoveryBannerTimeout);
      recoveryBannerTimeout = null;
    }
  });

  watch(region, () => {
    refresh();
  });

  // DELETE AFTER TEST
  watch(forceFlightError, () => {
    refresh();
  });

  watch(error, value => {
    if (!value) {
      if (hadFlightError) {
        triggerRecoveryBanner();
      }

      hadFlightError = false;
      return;
    }

    showRecoveryBanner.value = false;
    hadFlightError = true;
  });

  return {
    geoJson: data,
    pending,
    error,
    region,
    refresh,
    hasLiveDataError,
    liveDataErrorMessage,
    showRecoveryBanner,
  };
};
