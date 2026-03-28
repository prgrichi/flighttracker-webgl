// composables/map/useMapState.ts
export const useMapState = () => {
  const isMapLoaded = useState('map:isLoaded', () => false);
  const mapError = useState('map:error', () => '');

  return {
    isMapLoaded,
    mapError,
  };
};
