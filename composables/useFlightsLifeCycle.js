export const useFlightsLifecycle = (initialRegion = 'bavaria') => {
  const {
    refresh,
    error,
    region,
    showRecoveryBanner,
    hadFlightError,

    // DELETE AFTER TEST
    forceFlightError,
  } = useFlightsState(initialRegion);

  const started = useState('flights:lifecycleStarted', () => false);
  const pollingStarted = useState('flights:pollingStarted', () => false);

  let interval = null;
  let recoveryBannerTimeout = null;

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

  const startPolling = () => {
    if (pollingStarted.value) return;

    pollingStarted.value = true;

    interval = setInterval(() => {
      console.log('poll refresh (20s)');
      refresh();
    }, 20_000);
  };

  onMounted(() => {
    if (started.value) return;

    started.value = true;

    refresh();
    startPolling();

    watch(region, () => {
      refresh();
    });

    // DELETE AFTER TEST
    watch(forceFlightError, () => {
      refresh();
    });

    watch(error, value => {
      if (!value) {
        if (hadFlightError.value) {
          triggerRecoveryBanner();
        }

        hadFlightError.value = false;
        return;
      }

      showRecoveryBanner.value = false;
      hadFlightError.value = true;
    });
  });

  onUnmounted(() => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }

    pollingStarted.value = false;

    if (recoveryBannerTimeout) {
      clearTimeout(recoveryBannerTimeout);
      recoveryBannerTimeout = null;
    }
  });
};
