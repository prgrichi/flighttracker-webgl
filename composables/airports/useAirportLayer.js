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

  const { geoJson, showLargeAirports, showMediumAirports, showSmallAirports, showHeliports } =
    options;

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

    addAirportLayer(mapInstance, AIRPORT_LAYER_IDS.large, 'large_airport', 0, 0.3);
    addAirportLayer(mapInstance, AIRPORT_LAYER_IDS.medium, 'medium_airport', 6, 0.32);
    addAirportLayer(mapInstance, AIRPORT_LAYER_IDS.small, 'small_airport', 8, 0.34);
    addAirportLayer(mapInstance, AIRPORT_LAYER_IDS.heliport, 'heliport', 10, 0.28);

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

      if (mapInstance.loaded()) {
        initializeLayer();
      } else {
        mapInstance.once('load', initializeLayer);
      }

      mapInstance.on('style.load', initializeLayer);

      onCleanup(() => {
        mapInstance.off('style.load', initializeLayer);
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
