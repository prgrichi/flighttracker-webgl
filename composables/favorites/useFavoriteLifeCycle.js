export const useFavoriteLifeCycle = favoriteState => {
  const { refresh, error, showRecoveryBanner, hadFavoriteError } = favoriteState;

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

  watch(error, value => {
    if (!value) {
      if (hadFavoriteError.value) {
        triggerRecoveryBanner();
      }

      hadFavoriteError.value = false;
      return;
    }

    showRecoveryBanner.value = false;
    hadFavoriteError.value = true;
  });

  return {
    refresh,
  };
};
