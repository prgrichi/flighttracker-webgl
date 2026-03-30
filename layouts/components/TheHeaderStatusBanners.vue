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
    :show="showOnlineRecovery && !showRecoveryBanner"
    message="Internetverbindung wiederhergestellt"
    color="success"
  />

  <!-- 🔴 API Fehler -->
  <LiveStatusBanner
    :show="!isOffline && hasLiveDataError"
    :message="hasLiveDataErrorMsg"
    :loading="hasLiveDataError && pending"
    :showRetry="true"
    :icon="CloudOffIcon"
    color="error"
    @retry="refresh"
  />

  <!-- 🟢 API wieder da -->
  <LiveStatusBanner
    :show="showRecoveryBanner"
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

const { isOffline, showOnlineRecovery } = useNetworkStatus();

const { error: locationErrorMsg, showErrorBanner } = useGeolocation();

const { hasLiveDataError, hasLiveDataErrorMsg, showRecoveryBanner, pending, refresh } =
  useFlightsState();

watch(showOnlineRecovery, value => {
  if (value) refresh();
});
</script>
