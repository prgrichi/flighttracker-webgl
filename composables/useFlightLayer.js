// composables/useFlightLayer.js

import { watch } from 'vue';
import { useMapInstance } from '@/composables/map/useMapInstance';
import { useSelectedFlight } from './useSelectedFlight';
import { useSelectedLocation } from './useSelectedLocation';
import {
  EMPTY_COLLECTION,
  buildAnimatedCollection,
  createSelectedFlightCollection,
  ensureMapImage,
  findFlightPropertiesByIcao24,
  getFlightFromGeoJsonByIcao24,
  iconImageExpressionByIcao24,
  iconImageExpression,
  iconSizeExpressionByIcao24,
  iconSizeExpression,
  isSameFlightSnapshot,
  resolveAnimationDuration,
} from './flights/flightLayerUtils';

const FLIGHTS_SOURCE_ID = 'flights';
const FLIGHTS_LAYER_ID = 'flights-layer';
const SELECTED_FLIGHT_SOURCE_ID = 'selected-flight';
const SELECTED_FLIGHT_LAYER_ID = 'selected-flight-layer';
const PLANE_IMAGE_ID = 'plane';
const PLANE_IMAGE_ACTIVE_ID = 'plane-active';
const HELICOPTER_IMAGE_ID = 'helicopter';

export function useFlightLayer(geoJson) {
  const { map } = useMapInstance();
  const { selectedFlight, highlightedFlight, setSelectedFlight, clearSelectedFlight } =
    useSelectedFlight();
  const { selectedLocation } = useSelectedLocation();

  let lastSnapshot = null;
  let lastSnapshotAt = 0;
  let animationFrameId = null;

  function cancelFlightAnimation() {
    if (!animationFrameId) return;

    cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  function animateFlightTransition(mapInstance, previousData, nextData) {
    const source = mapInstance?.getSource(FLIGHTS_SOURCE_ID);
    if (!source) return;

    cancelFlightAnimation();

    const start = performance.now();
    const duration = resolveAnimationDuration(lastSnapshotAt);

    const tick = timestamp => {
      const elapsed = timestamp - start;
      const progress = Math.max(0, Math.min(1, elapsed / duration));
      const animatedCollection = buildAnimatedCollection(previousData, nextData, progress);

      source.setData(animatedCollection);

      if (progress >= 1) {
        animationFrameId = null;
        return;
      }

      animationFrameId = requestAnimationFrame(tick);
    };

    animationFrameId = requestAnimationFrame(tick);
  }

  function updateMainLayerSelectionStyles(mapInstance, selectedIcao24) {
    if (!mapInstance?.getLayer(FLIGHTS_LAYER_ID)) return;

    mapInstance.setLayoutProperty(
      FLIGHTS_LAYER_ID,
      'icon-image',
      iconImageExpressionByIcao24(selectedIcao24)
    );
    mapInstance.setLayoutProperty(
      FLIGHTS_LAYER_ID,
      'icon-size',
      iconSizeExpressionByIcao24(selectedIcao24)
    );
  }

  function updateSelectedFlightData(mapInstance, flight, highlighted, data) {
    if (!mapInstance) return;

    const source = mapInstance.getSource(SELECTED_FLIGHT_SOURCE_ID);
    if (!source) return;

    const isFlightAlreadyInMainLayer = !!data?.features?.some(feature => {
      return feature?.properties?.icao24 === flight?.icao24;
    });

    source.setData(
      isFlightAlreadyInMainLayer
        ? EMPTY_COLLECTION
        : createSelectedFlightCollection(flight, highlighted?.icao24 === flight?.icao24)
    );
  }

  function updateFlightData(mapInstance, data) {
    if (!data || !mapInstance) return;

    const source = mapInstance.getSource(FLIGHTS_SOURCE_ID);
    if (!source) return;

    const hasPreviousSnapshot = !!lastSnapshot?.features?.length;
    const hasNextSnapshot = !!data?.features?.length;

    if (hasPreviousSnapshot && hasNextSnapshot) {
      animateFlightTransition(mapInstance, lastSnapshot, data);
    } else {
      cancelFlightAnimation();
      source.setData(data);
    }

    lastSnapshot = data;
    lastSnapshotAt = Date.now();
  }

  async function ensureFlightLayer(mapInstance) {
    if (!mapInstance.getSource(FLIGHTS_SOURCE_ID)) {
      mapInstance.addSource(FLIGHTS_SOURCE_ID, {
        type: 'geojson',
        data: EMPTY_COLLECTION,
      });
    }

    await ensureMapImage(mapInstance, PLANE_IMAGE_ID, '/plane.png', 'Plane');
    await ensureMapImage(mapInstance, PLANE_IMAGE_ACTIVE_ID, '/plane-active.png', 'Active');
    await ensureMapImage(mapInstance, HELICOPTER_IMAGE_ID, '/helicopter.png', 'Helicopter');

    if (!mapInstance.getLayer(FLIGHTS_LAYER_ID)) {
      mapInstance.addLayer({
        id: FLIGHTS_LAYER_ID,
        type: 'symbol',
        source: FLIGHTS_SOURCE_ID,
        layout: {
          'icon-image': iconImageExpressionByIcao24(highlightedFlight.value?.icao24 ?? null),
          'icon-size': iconSizeExpressionByIcao24(highlightedFlight.value?.icao24 ?? null),
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
          'icon-image': iconImageExpression('isHighlighted'),
          'icon-size': iconSizeExpression('isHighlighted'),
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

        const clickedProperties = features[0]?.properties ?? null;
        const clickedIcao24 = clickedProperties?.icao24 ?? features[0]?.id ?? null;
        const fullFlight = getFlightFromGeoJsonByIcao24(clickedIcao24, geoJson.value);

        // MapLibre queryRenderedFeatures serializes nested properties, so prefer source data.
        setSelectedFlight(fullFlight ?? clickedProperties);
      };

      const initializeLayer = async () => {
        await ensureFlightLayer(mapInstance);
        updateFlightData(mapInstance, geoJson.value);
        updateSelectedFlightData(
          mapInstance,
          highlightedFlight.value,
          highlightedFlight.value,
          geoJson.value
        );
        updateMainLayerSelectionStyles(mapInstance, highlightedFlight.value?.icao24 ?? null);
      };

      if (mapInstance.loaded()) {
        initializeLayer();
      } else {
        mapInstance.once('load', initializeLayer);
      }

      mapInstance.on('style.load', initializeLayer);
      mapInstance.on('click', handleMapClick);

      onCleanup(() => {
        cancelFlightAnimation();
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
      updateSelectedFlightData(mapInstance, highlightedFlight.value, highlightedFlight.value, data);
      updateMainLayerSelectionStyles(mapInstance, highlightedFlight.value?.icao24 ?? null);
    },
    { immediate: true }
  );

  watch(
    [highlightedFlight, geoJson, map],
    ([flight, data, mapInstance]) => {
      updateSelectedFlightData(mapInstance, flight, flight, data);
      updateMainLayerSelectionStyles(mapInstance, flight?.icao24 ?? null);
    },
    { immediate: true }
  );

  watch(
    geoJson,
    data => {
      const selectedIcao24 = highlightedFlight.value?.icao24;
      if (!selectedIcao24) return;

      const matchingFlight = findFlightPropertiesByIcao24(selectedIcao24, data);
      if (!matchingFlight) return;

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
