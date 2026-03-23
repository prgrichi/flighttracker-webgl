import { useMapInstance } from './useMapInstance';

export const useMapType = () => {
  const config = useRuntimeConfig();
  const { map } = useMapInstance();
  const currentMapType = useState('current-map-type', () => 'Default');

  const MAP_TYPES = {
    Default: {
      name: 'Default',
      url: `https://tiles.stadiamaps.com/styles/osm_bright.json?api_key=${config.public.stadiaKey}`,
      preview: '/map-previews/default.png',
    },
    Light: {
      name: 'Light',
      url: `https://tiles.stadiamaps.com/styles/alidade_smooth.json?api_key=${config.public.stadiaKey}`,
      preview: '/map-previews/bright.png',
    },
    Terrain: {
      name: 'Terrain',
      url: `https://tiles.stadiamaps.com/styles/stamen_terrain.json?api_key=${config.public.stadiaKey}`,
      preview: '/map-previews/dark.png',
    },
    Dark: {
      name: 'Dark',
      url: `https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json?api_key=${config.public.stadiaKey}`,
      preview: '/map-previews/dark.png',
    },
  };

  const setMapType = mapTypeKey => {
    if (!MAP_TYPES[mapTypeKey]) return;
    if (currentMapType.value === mapTypeKey) return;

    currentMapType.value = mapTypeKey;

    if (!map.value) return;

    map.value.setStyle(MAP_TYPES[mapTypeKey].style ?? MAP_TYPES[mapTypeKey].url);
  };

  return {
    currentMapType,
    MAP_TYPES,
    setMapType,
  };
};
