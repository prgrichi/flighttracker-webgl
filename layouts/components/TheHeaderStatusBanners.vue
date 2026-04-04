<template>
  <!-- ❌ Offline -->
  <LiveStatusBanner
    :show="isOffline"
    message="Keine Internetverbindung"
    :icon="WifiOffIcon"
    color="error"
  />

  <!-- 🟢 Internet wieder da -->
  <LiveStatusBanner
    :show="showOnlineRecovery && !showAnyRecoveryBanner"
    message="Internetverbindung wiederhergestellt"
    color="success"
  />

  <!-- 🔴 API Fehler -->
  <LiveStatusBanner
    :show="!isOffline && hasAnyLiveDataError"
    :message="liveDataErrorMsg"
    :loading="hasAnyLiveDataError && isAnyLiveDataPending"
    :showRetry="true"
    :icon="CloudOffIcon"
    color="error"
    @retry="refreshAll"
  />

  <!-- 🟢 API wieder da -->
  <LiveStatusBanner
    :show="showAnyRecoveryBanner"
    message="Live-Flugdaten wieder verfügbar"
    color="success"
  />

  <!-- 📍 Location -->
  <LiveStatusBanner
    :show="showErrorBanner"
    :message="locationErrorMsg"
    :icon="PinOffIcon"
    color="error"
  />
</template>

<script setup>
import PinOffIcon from '@/components/icons/IconPinOff.vue';
import WifiOffIcon from '@/components/icons/IconWifiOff.vue';
import CloudOffIcon from '@/components/icons/IconCloudOff.vue';
import { useFavoriteState } from '@/composables/favorites/useFavoriteState';

const { isOffline, showOnlineRecovery } = useNetworkStatus();

const { error: locationErrorMsg, showErrorBanner } = useGeolocation();

const {
  hasLiveDataError: flightsError,
  hasLiveDataErrorMsg: flightsErrorMsg,
  showRecoveryBanner: flightsRecoveryBanner,
  pending: flightsPending,
  refresh: refreshFlights,
} = useFlightsState();

const {
  pending: favoritesPending,
  hasLiveDataError: favoritesError,
  hasLiveDataErrorMsg: favoritesErrorMsg,
  showRecoveryBanner: favoritesRecoveryBanner,
  refresh: refreshFavorites,
} = useFavoriteState();

const showAnyRecoveryBanner = computed(() => {
  return flightsRecoveryBanner.value || favoritesRecoveryBanner.value;
});

const hasAnyLiveDataError = computed(() => {
  return flightsError.value || favoritesError.value;
});

const liveDataErrorMsg = computed(() => {
  if (flightsError.value) return flightsErrorMsg.value;
  if (favoritesError.value) return favoritesErrorMsg.value;
  return '';
});

const isAnyLiveDataPending = computed(() => {
  return flightsPending.value || favoritesPending.value;
});

const refreshAll = async () => {
  await Promise.allSettled([refreshFlights(), refreshFavorites()]);
};

watch(showOnlineRecovery, value => {
  if (value) refreshAll();
});
</script>
