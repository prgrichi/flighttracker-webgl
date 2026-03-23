// composables/useFlightLayer.js

import { watch } from 'vue';
import { useMapInstance } from './useMapInstance';
import { useSelectedFlight } from './useSelectedFlight';

const FLIGHTS_SOURCE_ID = 'flights';
const FLIGHTS_LAYER_ID = 'flights-layer';
const PLANE_IMAGE_ID = 'plane';

const EMPTY_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

export function useFlightLayer(geoJson) {
  const { map } = useMapInstance();
  const { selectedFlight } = useSelectedFlight();

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
        const image = await mapInstance.loadImage('/plane-v2.png');
        mapInstance.addImage(PLANE_IMAGE_ID, image.data);
      } catch (error) {
        console.error('Image load failed:', error);
      }
    }

    if (!mapInstance.getLayer(FLIGHTS_LAYER_ID)) {
      mapInstance.addLayer({
        id: FLIGHTS_LAYER_ID,
        type: 'symbol',
        source: FLIGHTS_SOURCE_ID,
        layout: {
          'icon-image': PLANE_IMAGE_ID,
          // 'icon-size': ['interpolate', ['linear'], ['zoom'], 5, 0.15, 8, 0.25, 12, 0.4],
          'icon-size': ['interpolate', ['linear'], ['zoom'], 5, 0.5],
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
          layers: [FLIGHTS_LAYER_ID],
        });

        if (features.length) {
          selectedFlight.value = features[0].properties;
          return;
        }

        if (!features.length) {
          selectedFlight.value = null;
        }
      };

      const initializeLayer = async () => {
        await ensureFlightLayer(mapInstance);
        updateFlightData(mapInstance, geoJson.value);
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
    },
    { immediate: true }
  );
}
