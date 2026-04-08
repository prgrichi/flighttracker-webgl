import { computed, ref, onBeforeUnmount } from 'vue';

export const useFavoriteUndo = removeFavorite => {
  const REMOVE_DELAY = 5000;
  const PROGRESS_TICK = 100;

  const pendingRemoval = ref(null);
  const progressPercent = ref(100);

  const hiddenIcao24Set = computed(() => {
    return new Set(pendingRemoval.value ? [pendingRemoval.value.icao24] : []);
  });

  const clearPendingTimers = () => {
    if (!pendingRemoval.value) return;

    if (pendingRemoval.value.timeoutId) {
      clearTimeout(pendingRemoval.value.timeoutId);
    }

    if (pendingRemoval.value.intervalId) {
      clearInterval(pendingRemoval.value.intervalId);
    }
  };

  const finalizePendingRemoval = () => {
    if (!pendingRemoval.value) return;
    const icao24 = pendingRemoval.value.icao24;

    clearPendingTimers();
    pendingRemoval.value = null;
    progressPercent.value = 100;

    removeFavorite(icao24);
  };

  const requestRemove = fav => {
    if (!fav?.icao24) return;

    if (pendingRemoval.value) {
      finalizePendingRemoval();
    }

    const label = fav.callsign || fav.airlineName || fav.icao24 || 'Favorit';

    const startedAt = Date.now();

    const timeoutId = setTimeout(() => {
      finalizePendingRemoval();
    }, REMOVE_DELAY);

    const intervalId = setInterval(() => {
      const elapsed = Date.now() - startedAt;
      const remaining = Math.max(0, REMOVE_DELAY - elapsed);
      progressPercent.value = (remaining / REMOVE_DELAY) * 100;
    }, PROGRESS_TICK);

    pendingRemoval.value = {
      icao24: fav.icao24,
      label,
      timeoutId,
      intervalId,
    };

    progressPercent.value = 100;
  };

  const undoRemove = () => {
    if (!pendingRemoval.value) return;

    clearPendingTimers();
    pendingRemoval.value = null;
    progressPercent.value = 100;
  };

  onBeforeUnmount(() => {
    clearPendingTimers();
  });

  return {
    pendingRemoval,
    progressPercent,
    hiddenIcao24Set,
    requestRemove,
    undoRemove,
  };
};
