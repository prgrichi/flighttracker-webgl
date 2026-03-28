<template>
  <LiveStatusBanner
    :show="hasLiveDataError"
    :message="hasLiveDataErrorMsg"
    :loading="hasLiveDataError && pending"
    :showRetry="true"
    icon="i-lucide-wifi-off"
    color="error"
    @retry="refresh"
  />

  <LiveStatusBanner
    :show="showLocationError"
    :message="locationErrorMsg"
    icon="i-lucide-map-pin-off"
    color="error"
  />

  <LiveStatusBanner
    :show="showRecoveryBanner"
    message="Live-Flugdaten wieder verfügbar"
    color="success"
  />
</template>

<script setup>
const { error: locationErrorMsg } = useGeolocation();
const showLocationError = computed(() => !!locationErrorMsg.value);

const { hasLiveDataError, hasLiveDataErrorMsg, showRecoveryBanner, pending, refresh } =
  useFlightsState();
</script>
