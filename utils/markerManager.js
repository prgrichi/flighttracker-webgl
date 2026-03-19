import { animateMarker } from '@/utils/mapUtils';
import { createPlaneIcon } from '@/utils/mapIcons';

export function createMarkerManager({ map, L, markers, selectedFlight }) {
  let lastUpdateAt = null;

  return function updateMarkers(flights) {
    const now = performance.now();
    const animationDuration = lastUpdateAt ? Math.max(now - lastUpdateAt, 250) : 0;
    lastUpdateAt = now;

    const seen = new Set();

    for (const flight of flights) {
      if (flight.lat == null || flight.lon == null) continue;
      const id = flight.icao24;
      seen.add(id);

      if (markers.has(id)) {
        const marker = markers.get(id);

        if (!marker || !map.hasLayer(marker)) continue;

        const current = marker.getLatLng();

        if (!current) continue;

        marker.flightData = flight;

        animateMarker(
          map,
          marker,
          [current.lat, current.lng],
          [flight.lat, flight.lon],
          animationDuration
        );

        marker.setIcon(createPlaneIcon(L, selectedFlight.value?.icao24 === id, flight.heading));
      } else {
        const marker = L.marker([flight.lat, flight.lon], {
          icon: createPlaneIcon(L, false, flight.heading),
        })
          .addTo(map)
          .on('click', event => {
            L.DomEvent.stopPropagation(event);
            const currentFlight = marker.flightData;

            if (selectedFlight.value && markers.has(selectedFlight.value.icao24)) {
              markers
                .get(selectedFlight.value.icao24)
                .setIcon(createPlaneIcon(L, false, selectedFlight.value.heading));
            }

            marker.setIcon(createPlaneIcon(L, true, currentFlight.heading));
            selectedFlight.value = currentFlight;
          });

        marker.flightData = flight;
        markers.set(id, marker);
      }
    }

    for (const [id, marker] of markers) {
      if (!seen.has(id)) {
        markers.delete(id);

        if (marker.__animationFrameId) {
          cancelAnimationFrame(marker.__animationFrameId);
        }

        requestAnimationFrame(() => {
          if (map.hasLayer(marker)) {
            map.removeLayer(marker);
          }
        });
      }
    }
  };
}
