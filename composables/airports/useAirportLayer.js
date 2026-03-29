// composables/airports/useAirportLayer.js
import { watch } from 'vue';
import { useMapInstance } from '@/composables/map/useMapInstance';

const AIRPORTS_SOURCE_ID = 'airports';
const AIRPORT_MARKER_IMAGE_ID = 'airport-marker';

const AIRPORT_LAYER_IDS = {
  large: 'airports-large',
  medium: 'airports-medium',
  small: 'airports-small',
  heliport: 'airports-heliport',
};

const EMPTY_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

export function useAirportLayer(options) {
  const { map } = useMapInstance();
  const { selectedLocation } = useSelectedLocation();
  const { selectedFlight } = useSelectedFlight();

  const { geoJson, showLargeAirports, showMediumAirports, showSmallAirports, showHeliports } =
    options;

  function getActiveAirportLayerIds() {
    return [
      showLargeAirports.value && AIRPORT_LAYER_IDS.large,
      showMediumAirports.value && AIRPORT_LAYER_IDS.medium,
      showSmallAirports.value && AIRPORT_LAYER_IDS.small,
      showHeliports.value && AIRPORT_LAYER_IDS.heliport,
    ].filter(Boolean);
  }

  function updateAirportData(mapInstance, data) {
    if (!mapInstance || !data) return;

    const source = mapInstance.getSource(AIRPORTS_SOURCE_ID);
    if (!source) return;

    source.setData(data);
  }

  function setLayerVisibility(mapInstance, layerId, isVisible) {
    if (!mapInstance?.getLayer(layerId)) return;

    mapInstance.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
  }

  function updateAirportVisibility(mapInstance) {
    if (!mapInstance) return;

    setLayerVisibility(mapInstance, AIRPORT_LAYER_IDS.large, showLargeAirports.value);
    setLayerVisibility(mapInstance, AIRPORT_LAYER_IDS.medium, showMediumAirports.value);
    setLayerVisibility(mapInstance, AIRPORT_LAYER_IDS.small, showSmallAirports.value);
    setLayerVisibility(mapInstance, AIRPORT_LAYER_IDS.heliport, showHeliports.value);
  }

  async function ensureAirportImages(mapInstance) {
    if (mapInstance.hasImage(AIRPORT_MARKER_IMAGE_ID)) return;

    try {
      const image = await mapInstance.loadImage('/airport.png');
      mapInstance.addImage(AIRPORT_MARKER_IMAGE_ID, image.data);
    } catch (error) {
      console.error('Airport image load failed:', error);
    }
  }

  function addAirportLayer(mapInstance, layerId, airportType, minzoom, iconSize) {
    if (mapInstance.getLayer(layerId)) return;

    mapInstance.addLayer({
      id: layerId,
      type: 'symbol',
      source: AIRPORTS_SOURCE_ID,
      filter: ['==', ['get', 'airportType'], airportType],
      minzoom,
      layout: {
        'icon-image': AIRPORT_MARKER_IMAGE_ID,
        'icon-size': iconSize,
        // 'icon-allow-overlap': false,
        'icon-allow-overlap': true,
        'icon-anchor': 'center',
      },
    });
  }

  async function ensureAirportLayer(mapInstance) {
    if (!mapInstance.getSource(AIRPORTS_SOURCE_ID)) {
      mapInstance.addSource(AIRPORTS_SOURCE_ID, {
        type: 'geojson',
        data: EMPTY_COLLECTION,
      });
    }

    await ensureAirportImages(mapInstance);

    addAirportLayer(mapInstance, AIRPORT_LAYER_IDS.large, 'large_airport', 5, 0.2);
    addAirportLayer(mapInstance, AIRPORT_LAYER_IDS.medium, 'medium_airport', 7, 0.2);
    addAirportLayer(mapInstance, AIRPORT_LAYER_IDS.small, 'small_airport', 9, 0.2);
    addAirportLayer(mapInstance, AIRPORT_LAYER_IDS.heliport, 'heliport', 10, 0.2);

    updateAirportVisibility(mapInstance);
  }

  watch(
    map,
    (mapInstance, _, onCleanup) => {
      if (!mapInstance) return;

      const initializeLayer = async () => {
        await ensureAirportLayer(mapInstance);
        updateAirportData(mapInstance, geoJson.value);
        updateAirportVisibility(mapInstance);
      };

      const handleMapClick = event => {
        const activeLayers = getActiveAirportLayerIds();

        const flightFeatures = mapInstance.queryRenderedFeatures(event.point, {
          layers: ['flights-layer'],
        });

        if (flightFeatures.length) {
          return;
        }

        if (!activeLayers.length) {
          selectedLocation.value = null;
          return;
        }

        const features = mapInstance.queryRenderedFeatures(event.point, {
          layers: activeLayers,
        });

        if (features.length) {
          selectedFlight.value = null;
          selectedLocation.value = features[0];
          return;
        }

        selectedLocation.value = null;
      };

      if (mapInstance.loaded()) {
        initializeLayer();
      } else {
        mapInstance.once('load', initializeLayer);
      }

      mapInstance.on('style.load', initializeLayer);
      mapInstance.on('click', handleMapClick);

      onCleanup(() => {
        mapInstance.off('style.load', initializeLayer);
        mapInstance.off('click', handleMapClick);
      });
    },
    { immediate: true }
  );

  watch(
    [geoJson, map],
    ([data, mapInstance]) => {
      updateAirportData(mapInstance, data);
    },
    { immediate: true }
  );

  watch(
    [showLargeAirports, showMediumAirports, showSmallAirports, showHeliports, map],
    ([, , , , mapInstance]) => {
      updateAirportVisibility(mapInstance);
    },
    { immediate: true }
  );
}
