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
</template>

<script setup>
import WifiOffIcon from '@/components/icons/IconWifiOff.vue';
import CloudOffIcon from '@/components/icons/IconCloudOff.vue';
const { isOffline, showOnlineRecovery } = useNetworkStatus();

const {
  hasLiveDataError: flightsError,
  hasLiveDataErrorMsg: flightsErrorMsg,
  showRecoveryBanner: flightsRecoveryBanner,
  pending: flightsPending,
  refresh: refreshFlights,
} = useFlightsState();

const showAnyRecoveryBanner = computed(() => {
  return flightsRecoveryBanner.value;
});

const hasAnyLiveDataError = computed(() => {
  return flightsError.value;
});

const liveDataErrorMsg = computed(() => {
  if (flightsError.value) return flightsErrorMsg.value;
  return '';
});

const isAnyLiveDataPending = computed(() => {
  return flightsPending.value;
});

const refreshAll = async () => {
  await refreshFlights();
};

watch(showOnlineRecovery, value => {
  if (value) refreshAll();
});
</script>
