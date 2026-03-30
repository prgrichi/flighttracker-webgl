// composables/useNetworkStatus.js
export const useNetworkStatus = () => {
  const isOnline = useState('network:isOnline', () => true);
  const showOnlineRecovery = useState('network:recovery', () => false);

  let timeout = null;

  const updateOnlineStatus = () => {
    const wasOffline = !isOnline.value;

    isOnline.value = navigator.onLine;

    // offline → online
    if (wasOffline && isOnline.value) {
      showOnlineRecovery.value = true;

      clearTimeout(timeout);
      timeout = setTimeout(() => {
        showOnlineRecovery.value = false;
      }, 2500);
    }
  };

  onMounted(() => {
    isOnline.value = navigator.onLine;

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
  });

  onUnmounted(() => {
    window.removeEventListener('online', updateOnlineStatus);
    window.removeEventListener('offline', updateOnlineStatus);
  });

  const isOffline = computed(() => {
    return !isOnline.value;
  });

  return {
    isOnline,
    isOffline,
    showOnlineRecovery,
  };
};
