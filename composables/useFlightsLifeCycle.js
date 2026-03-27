export const useFlightsLifecycle = (initialRegion = 'bavaria') => {
  const {
    refresh,
    error,
    region,
    showRecoveryBanner,
    hasLiveDataError,
    hadFlightError,
    hasLoadedFlights,

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

  const doRefresh = async () => {
    await refresh();

    if (!error.value) {
      hasLoadedFlights.value = true;
    }
  };

  const startPolling = () => {
    if (pollingStarted.value) return;

    pollingStarted.value = true;

    interval = setInterval(() => {
      console.log('poll refresh (20s)');
      doRefresh();
    }, 20_000);
  };

  const stopPolling = () => {
    console.log('stop polling');
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  onMounted(() => {
    if (started.value) return;

    started.value = true;

    doRefresh();
    startPolling();

    watch(region, () => {
      doRefresh();
    });

    watch(hasLiveDataError, () => {
      stopPolling();
    });

    // DELETE AFTER TEST
    watch(forceFlightError, () => {
      doRefresh();
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
