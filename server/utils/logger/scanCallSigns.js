export function scanCallSigns(states = []) {
  return states
    .map(state => {
      const icao24 = state[0] || null;
      const callsign = (state[1] || '').trim().toUpperCase();

      if (!callsign) return null;

      const interesting =
        // callsign.includes('CHX') ||
        // callsign.includes('EDL') ||
        // callsign.includes('POL') ||
        // callsign.includes('SAR') ||
        // callsign.includes('ADAC') ||
        // callsign.includes('DRF');
        callsign.includes('CHX14');

      if (!interesting) return null;

      return {
        detectedAt: new Date().toISOString(),
        icao24,
        callsign,
        raw: state,
      };
    })
    .filter(Boolean);
}
