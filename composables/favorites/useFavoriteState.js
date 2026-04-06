import { useFavorites } from '@/composables/favorites/useFavorites';

export const useFavoriteState = () => {
  const { favorites } = useFavorites();

  const hadFavoriteError = useState('favorites:hadError', () => false);
  const showRecoveryBanner = useState('favorites:recovery', () => false);

  const icao24List = computed(() => favorites.value.map(f => f.icao24));

  const fetchKey = computed(() => `favorite-states:${icao24List.value.join(',')}`);

  const query = computed(() => ({
    icao24: icao24List.value,
  }));

  const { data, pending, error, refresh } = useFetch('/api/favorites', {
    key: fetchKey,
    query,
    default: () => [],
    server: false,
    immediate: true,
    // watch: [icao24List],
  });

  let interval;
  onMounted(() => {
    interval = setInterval(() => {
      if (!pending.value) {
        console.log('refresh', data.value);
        refresh();
      }
    }, 10000);
  });

  onUnmounted(() => {
    clearInterval(interval);
  });

  const statesByIcao24 = computed(() => {
    return Object.fromEntries((data.value || []).map(item => [item.icao24, item]));
  });

  const favoriteStates = computed(() => {
    return favorites.value.map(fav => {
      const live = statesByIcao24.value[fav.icao24];

      return {
        ...fav,
        liveStatus: live?.status || 'unknown',
        found: live?.found || false,
        onGround: live?.onGround ?? null,
        lat: live?.lat ?? null,
        lon: live?.lon ?? null,
        heading: live?.heading ?? null,
        altitudeM: live?.altitudeM ?? null,
        speedKmh: live?.speedKmh ?? null,
        verticalRate: live?.verticalRate ?? null,
        lastContact: live?.lastContact ?? null,
        liveCallsign: live?.callsign || null,
      };
    });
  });

  const hasLiveDataError = computed(() => !!error.value);

  const hasLiveDataErrorMsg = computed(() => {
    const err = error.value;

    if (!err) return null;

    if (err.data?.code === 'OPENSKY_RATE_LIMIT') {
      return 'OpenSky rate limit reached. Try again later.';
    }

    if (err.statusCode === 429) {
      return 'Rate limit erreicht.';
    }

    if (err.statusCode >= 500) {
      return 'Favoriten-Livedaten aktuell nicht verfügbar.';
    }

    return err.statusMessage || 'Unknown error';
  });

  return {
    favoriteStates,
    pending,
    error,
    refresh,
    hasLiveDataError,
    hasLiveDataErrorMsg,
    hadFavoriteError,
    showRecoveryBanner,
  };
};
