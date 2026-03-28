export function useSelectedLocation() {
  const selectedLocation = useState('selectedLocation', () => null);
  return { selectedLocation };
}
