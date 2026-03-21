// composables/useFlightLayer.js

import { watch } from 'vue';
import { useMapInstance } from './useMapInstance';

export function useFlightLayer(geoJson) {
  const { map } = useMapInstance();
  const { selectedFlight } = useSelectedFlight();

  // Map load → Layer setup
  watch(map, mapInstance => {
    if (!mapInstance || mapInstance._flightsInitialized) return;
    if (!mapInstance) return;

    mapInstance.on('load', async () => {
      mapInstance.addSource('flights', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      try {
        const image = await mapInstance.loadImage('/plane.png');

        if (!mapInstance.hasImage('plane')) {
          mapInstance.addImage('plane', image.data);
        }

        mapInstance.addLayer({
          id: 'flights-layer',
          type: 'symbol',
          source: 'flights',
          layout: {
            'icon-image': 'plane',
            'icon-size': ['interpolate', ['linear'], ['zoom'], 5, 0.15, 8, 0.25, 12, 0.4],
            'icon-rotate': ['get', 'heading'],
            'icon-rotation-alignment': 'map',
            'icon-allow-overlap': true,
            'icon-anchor': 'center',
          },
        });

        mapInstance.on('click', 'flights-layer', e => {
          const feature = e.features?.[0];
          if (!feature) return;

          selectedFlight.value = feature.properties;
        });
        mapInstance.on('click', e => {
          const features = mapInstance.queryRenderedFeatures(e.point, {
            layers: ['flights-layer'],
          });

          if (!features.length) {
            selectedFlight.value = null;
          }
        });
      } catch (err) {
        console.error('Image load failed:', err);
      }
    });
  });

  // Daten updaten
  watch([geoJson, map], ([data, mapInstance]) => {
    if (!data || !mapInstance) return;

    const source = mapInstance.getSource('flights');
    if (!source) return;

    source.setData(data);
  });
}
