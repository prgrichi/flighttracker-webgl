const requestStats = {
  flightsApiRequests: 0,
  favoritesApiRequests: 0,
  flightsOpenSkyRequests: 0,
  favoritesOpenSkyRequests: 0,
};

export const REQUEST_STATS_KEYS = Object.freeze(Object.keys(requestStats));

export function incrementRequestStat(key) {
  if (!REQUEST_STATS_KEYS.includes(key)) {
    throw new Error(`Unknown request stat key: ${key}`);
  }

  requestStats[key] += 1;

  return requestStats[key];
}

export function getRequestStats() {
  return {
    ...requestStats,
  };
}

export function resetRequestStats() {
  for (const key of REQUEST_STATS_KEYS) {
    requestStats[key] = 0;
  }

  return getRequestStats();
}
