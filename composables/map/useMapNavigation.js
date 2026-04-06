import { useMapInstance } from '@/composables/map/useMapInstance';
import { useSelectedFlight } from '@/composables/useSelectedFlight';

export function useMapNavigation() {
  const { map } = useMapInstance();
  const { setSelectedFlight } = useSelectedFlight();
  const pendingNavigation = useState('map:pendingNavigation', () => null);
  const route = useRoute();

  const flyToCoordinates = (lon, lat, zoom = 8, duration = 800) => {
    if (!map.value) return;

    map.value.easeTo({
      center: [lon, lat],
      zoom,
      duration,
    });
  };

  const normalizeFlightForSelection = flight => {
    if (!flight) return null;

    return {
      ...flight,
      callsign: flight.liveCallsign || flight.callsign || null,
      longitude: flight.longitude ?? flight.lon ?? null,
      latitude: flight.latitude ?? flight.lat ?? null,
      onGround:
        flight.onGround ?? (flight.liveStatus === 'ground' ? true : flight.liveStatus === 'air' ? false : null),
    };
  };

  const queueNavigation = (flight, zoom = 9, duration = 1200) => {
    const normalizedFlight = normalizeFlightForSelection(flight);
    const lon = normalizedFlight?.longitude;
    const lat = normalizedFlight?.latitude;

    if (lon == null || lat == null) return false;

    pendingNavigation.value = {
      flight: normalizedFlight,
      lon,
      lat,
      zoom,
      duration,
    };

    return true;
  };

  const navigateToFlight = async (flight, zoom = 9, duration = 1200) => {
    const hasQueuedNavigation = queueNavigation(flight, zoom, duration);
    if (!hasQueuedNavigation) return false;

    if (route.path !== '/') {
      await navigateTo({ path: '/' });
    }

    return true;
  };

  const applyPendingNavigation = geoJson => {
    if (!map.value || !pendingNavigation.value) return false;

    const pendingFlight = pendingNavigation.value.flight;
    const matchingFlight = geoJson?.features?.find(feature => {
      return feature?.properties?.icao24 === pendingFlight?.icao24;
    })?.properties;

    const flightToSelect = normalizeFlightForSelection(matchingFlight || pendingFlight);
    const targetLon = flightToSelect?.longitude ?? pendingNavigation.value.lon;
    const targetLat = flightToSelect?.latitude ?? pendingNavigation.value.lat;

    setSelectedFlight(flightToSelect);
    flyToCoordinates(
      targetLon,
      targetLat,
      pendingNavigation.value.zoom,
      pendingNavigation.value.duration
    );

    pendingNavigation.value = null;
    return true;
  };

  return {
    flyToCoordinates,
    navigateToFlight,
    applyPendingNavigation,
    pendingNavigation,
  };
}
