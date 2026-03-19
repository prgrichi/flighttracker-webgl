export function animateMarker(map, marker, from, to, duration = 1000) {
  if (marker.__animationFrameId) {
    cancelAnimationFrame(marker.__animationFrameId);
    marker.__animationFrameId = null;
  }

  if (!map?.hasLayer(marker)) return;

  if (duration <= 0) {
    if (map.hasLayer(marker)) {
      marker.setLatLng(to);
    }

    return;
  }

  const start = performance.now();

  function step(now) {
    if (!map.hasLayer(marker)) {
      marker.__animationFrameId = null;
      return;
    }

    const progress = Math.min((now - start) / duration, 1);

    const lat = from[0] + (to[0] - from[0]) * progress;
    const lon = from[1] + (to[1] - from[1]) * progress;

    marker.setLatLng([lat, lon]);

    if (progress < 1) {
      marker.__animationFrameId = requestAnimationFrame(step);
    } else {
      marker.__animationFrameId = null;
    }
  }

  marker.__animationFrameId = requestAnimationFrame(step);
}
