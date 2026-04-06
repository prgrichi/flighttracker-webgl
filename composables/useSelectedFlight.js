export function useSelectedFlight() {
  const selectedFlight = useState('selectedFlight', () => null);
  const highlightedFlight = useState('highlightedFlight', () => null);

  const setSelectedFlight = flight => {
    selectedFlight.value = flight;
    highlightedFlight.value = flight;
  };

  const closeSelectedFlightCard = () => {
    selectedFlight.value = null;
    highlightedFlight.value = null;
  };

  const clearSelectedFlight = () => {
    selectedFlight.value = null;
    highlightedFlight.value = null;
  };

  return {
    selectedFlight,
    highlightedFlight,
    setSelectedFlight,
    closeSelectedFlightCard,
    clearSelectedFlight,
  };
}
