// composables/useFlightLayer.js

import { watch } from 'vue';
import { useMapInstance } from '@/composables/map/useMapInstance';
import { useSelectedFlight } from './useSelectedFlight';
import { useSelectedLocation } from './useSelectedLocation';

const FLIGHTS_SOURCE_ID = 'flights';
const FLIGHTS_LAYER_ID = 'flights-layer';
const SELECTED_FLIGHT_SOURCE_ID = 'selected-flight';
const SELECTED_FLIGHT_LAYER_ID = 'selected-flight-layer';
const PLANE_IMAGE_ID = 'plane';
const PLANE_IMAGE_ACTIVE_ID = 'plane-active';

const EMPTY_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

export function useFlightLayer(geoJson) {
  const { map } = useMapInstance();
  const { selectedFlight, highlightedFlight, setSelectedFlight, clearSelectedFlight } =
    useSelectedFlight();
  const { selectedLocation } = useSelectedLocation();

  function isSameFlightSnapshot(currentFlight, nextFlight) {
    if (!currentFlight && !nextFlight) return true;
    if (!currentFlight || !nextFlight) return false;

    return (
      currentFlight.icao24 === nextFlight.icao24 &&
      currentFlight.longitude === nextFlight.longitude &&
      currentFlight.latitude === nextFlight.latitude &&
      currentFlight.lon === nextFlight.lon &&
      currentFlight.lat === nextFlight.lat &&
      currentFlight.heading === nextFlight.heading &&
      currentFlight.callsign === nextFlight.callsign &&
      currentFlight.onGround === nextFlight.onGround &&
      currentFlight.verticalRate === nextFlight.verticalRate &&
      currentFlight.altitudeM === nextFlight.altitudeM &&
      currentFlight.speedKmh === nextFlight.speedKmh
    );
  }

  function createSelectedFlightCollection(flight) {
    const lon = flight?.longitude ?? flight?.lon;
    const lat = flight?.latitude ?? flight?.lat;

    if (!flight || lon == null || lat == null) {
      return EMPTY_COLLECTION;
    }

    return {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          id: flight.icao24,
          geometry: {
            type: 'Point',
            coordinates: [lon, lat],
          },
          properties: {
            ...flight,
            heading: flight.heading ?? 0,
          },
        },
      ],
    };
  }

  function updateSelectedFlightData(mapInstance, flight, data) {
    if (!mapInstance) return;

    const source = mapInstance.getSource(SELECTED_FLIGHT_SOURCE_ID);
    if (!source) return;

    const isFlightAlreadyInMainLayer = !!data?.features?.some(feature => {
      return feature?.properties?.icao24 === flight?.icao24;
    });

    source.setData(isFlightAlreadyInMainLayer ? EMPTY_COLLECTION : createSelectedFlightCollection(flight));
  }

  function updateFlightData(mapInstance, data) {
    if (!data || !mapInstance) return;

    const source = mapInstance.getSource(FLIGHTS_SOURCE_ID);
    if (!source) return;

    source.setData(data);
  }

  async function ensureFlightLayer(mapInstance) {
    if (!mapInstance.getSource(FLIGHTS_SOURCE_ID)) {
      mapInstance.addSource(FLIGHTS_SOURCE_ID, {
        type: 'geojson',
        data: EMPTY_COLLECTION,
      });
    }

    if (!mapInstance.hasImage(PLANE_IMAGE_ID)) {
      try {
        const image = await mapInstance.loadImage('/plane.png');
        if (!mapInstance.hasImage(PLANE_IMAGE_ID)) {
          mapInstance.addImage(PLANE_IMAGE_ID, image.data);
        }
      } catch (error) {
        console.error('Image load failed:', error);
      }
    }

    if (!mapInstance.hasImage(PLANE_IMAGE_ACTIVE_ID)) {
      try {
        const image = await mapInstance.loadImage('/plane-active.png');
        if (!mapInstance.hasImage(PLANE_IMAGE_ACTIVE_ID)) {
          mapInstance.addImage(PLANE_IMAGE_ACTIVE_ID, image.data);
        }
      } catch (error) {
        console.error('Active image load failed:', error);
      }
    }

    if (!mapInstance.getLayer(FLIGHTS_LAYER_ID)) {
      mapInstance.addLayer({
        id: FLIGHTS_LAYER_ID,
        type: 'symbol',
        source: FLIGHTS_SOURCE_ID,
        layout: {
          'icon-image': [
            'case',
            ['boolean', ['get', 'isSelected'], false],
            PLANE_IMAGE_ACTIVE_ID,
            PLANE_IMAGE_ID,
          ],
          'icon-size': ['case', ['boolean', ['get', 'isSelected'], false], 0.65, 0.5],
          'icon-rotate': ['get', 'heading'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-anchor': 'center',
        },
      });
    }

    if (!mapInstance.getSource(SELECTED_FLIGHT_SOURCE_ID)) {
      mapInstance.addSource(SELECTED_FLIGHT_SOURCE_ID, {
        type: 'geojson',
        data: EMPTY_COLLECTION,
      });
    }

    if (!mapInstance.getLayer(SELECTED_FLIGHT_LAYER_ID)) {
      mapInstance.addLayer({
        id: SELECTED_FLIGHT_LAYER_ID,
        type: 'symbol',
        source: SELECTED_FLIGHT_SOURCE_ID,
        layout: {
          'icon-image': PLANE_IMAGE_ACTIVE_ID,
          'icon-size': 0.65,
          'icon-rotate': ['get', 'heading'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-anchor': 'center',
        },
      });
    }
  }

  watch(
    map,
    (mapInstance, _, onCleanup) => {
      if (!mapInstance) return;

      const handleMapClick = event => {
        const features = mapInstance.queryRenderedFeatures(event.point, {
          layers: [SELECTED_FLIGHT_LAYER_ID, FLIGHTS_LAYER_ID],
        });

        if (!features.length) {
          clearSelectedFlight();
          return;
        }

        selectedLocation.value = null;
        setSelectedFlight(features[0].properties);
      };

      const initializeLayer = async () => {
        await ensureFlightLayer(mapInstance);
        updateFlightData(mapInstance, geoJson.value);
        updateSelectedFlightData(mapInstance, highlightedFlight.value, geoJson.value);
      };

      if (mapInstance.loaded()) {
        initializeLayer();
      } else {
        mapInstance.once('load', initializeLayer);
      }

      mapInstance.on('style.load', initializeLayer);
      mapInstance.on('click', handleMapClick);

      onCleanup(() => {
        mapInstance.off('load', initializeLayer);
        mapInstance.off('style.load', initializeLayer);
        mapInstance.off('click', handleMapClick);
      });
    },
    { immediate: true }
  );

  watch(
    [geoJson, map],
    ([data, mapInstance]) => {
      updateFlightData(mapInstance, data);
      updateSelectedFlightData(mapInstance, highlightedFlight.value, data);
    },
    { immediate: true }
  );

  watch(
    [highlightedFlight, geoJson, map],
    ([flight, data, mapInstance]) => {
      updateSelectedFlightData(mapInstance, flight, data);
    },
    { immediate: true }
  );

  watch(
    geoJson,
    data => {
      const selectedIcao24 = highlightedFlight.value?.icao24;
      if (!selectedIcao24) return;

      const matchingFlight = data?.features?.find(feature => {
        return feature?.properties?.icao24 === selectedIcao24;
      })?.properties;

      if (!matchingFlight) {
        return;
      }

      if (!isSameFlightSnapshot(highlightedFlight.value, matchingFlight)) {
        highlightedFlight.value = matchingFlight;
      }

      if (
        selectedFlight.value?.icao24 === selectedIcao24 &&
        !isSameFlightSnapshot(selectedFlight.value, matchingFlight)
      ) {
        selectedFlight.value = matchingFlight;
      }
    },
    { immediate: true }
  );
}
