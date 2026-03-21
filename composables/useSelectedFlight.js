export function useSelectedFlight() {
  const selectedFlight = useState('selectedFlight', () => null);
  return { selectedFlight };
}
