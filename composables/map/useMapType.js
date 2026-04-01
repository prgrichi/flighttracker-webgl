import { useLocalStorage } from '@vueuse/core';

export const useMapType = () => {
  const config = useRuntimeConfig();
  const currentMapType = useLocalStorage('current-map-type', 'Default');

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
      preview: '/map-previews/terrain.png',
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
  };

  return {
    currentMapType,
    MAP_TYPES,
    setMapType,
  };
};
