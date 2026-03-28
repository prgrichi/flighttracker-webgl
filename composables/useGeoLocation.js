// composables/useGeolocation.js
export function useGeolocation() {
  const position = useState('geo:position', () => null);
  const error = useState('geo:error', () => null);
  const loading = useState('geo:loading', () => false);

  const getLocation = () => {
    loading.value = true;
    error.value = null;

    if (!navigator.geolocation) {
      error.value = 'Geolocation wird vom Browser nicht unterstützt.';
      loading.value = false;
      return;
    }

    navigator.geolocation.getCurrentPosition(
      geoPosition => {
        position.value = {
          lat: geoPosition.coords.latitude,
          lon: geoPosition.coords.longitude,
          accuracy: geoPosition.coords.accuracy,
        };
        loading.value = false;
      },
      err => {
        if (err.code === 1) {
          error.value = 'Standortfreigabe wurde abgelehnt.';
        } else if (err.code === 2) {
          error.value = 'Standort ist momentan nicht verfügbar.';
        } else if (err.code === 3) {
          error.value = 'Standortabfrage hat zu lange gedauert.';
        } else {
          error.value = 'Unbekannter Fehler bei der Standortabfrage.';
        }

        loading.value = false;
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  };

  return {
    position,
    error,
    loading,
    getLocation,
  };
}
