import { useMapInstance } from './useMapInstance';

export const useMapType = () => {
  const config = useRuntimeConfig();
  const { map } = useMapInstance();
  const currentMapType = useState('current-map-type', () => 'default');

  const MAP_TYPES = {
    default: {
      name: 'Default',
      url: 'https://tiles.openfreemap.org/styles/bright',
      preview: '/map-previews/default.png',
    },
    light: {
      name: 'Positron',
      url: 'https://tiles.openfreemap.org/styles/positron',
      preview: '/map-previews/light.png',
    },
    dark: {
      name: 'Dark',
      url: `https://api.maptiler.com/maps/dataviz-dark/style.json?key=${config.public.maptilerKey}`,
      preview: '/map-previews/dark.png',
    },
  };

  const setMapType = mapTypeKey => {
    if (!MAP_TYPES[mapTypeKey]) return;
    if (currentMapType.value === mapTypeKey) return;

    currentMapType.value = mapTypeKey;

    if (!map.value) return;

    map.value.setStyle(MAP_TYPES[mapTypeKey].url);
  };

  return {
    currentMapType,
    MAP_TYPES,
    setMapType,
  };
};
