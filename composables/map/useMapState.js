// composables/map/useMapState.ts
export const useMapState = () => {
  const isMapMounted = useState('map:isMapMounted', () => false);
  const isMapLoaded = useState('map:isMapLoaded', () => false);
  const mapError = useState('map:error', () => '');

  const isMapLoading = computed(() => {
    return isMapMounted.value && !isMapLoaded.value && !mapError.value;
  });

  return {
    isMapMounted,
    isMapLoaded,
    mapError,
    isMapLoading,
  };
};
