// composables/flights/flightLayerUtils.js

export const EMPTY_COLLECTION = {
  type: 'FeatureCollection',
  features: [],
};

const DEFAULT_ANIMATION_DURATION_MS = 20_000;
const MIN_ANIMATION_DURATION_MS = 2_000;
const MAX_ANIMATION_DURATION_MS = 20_000;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function normalizeHeading(value) {
  if (!Number.isFinite(value)) return 0;
  const normalized = value % 360;
  return normalized < 0 ? normalized + 360 : normalized;
}

function interpolateHeading(from, to, progress) {
  const start = normalizeHeading(from);
  const end = normalizeHeading(to);
  const delta = ((end - start + 540) % 360) - 180;
  return normalizeHeading(start + delta * progress);
}

function getCoordinates(feature) {
  const geometryCoordinates = feature?.geometry?.coordinates;
  const propertyLon = feature?.properties?.lon ?? feature?.properties?.longitude;
  const propertyLat = feature?.properties?.lat ?? feature?.properties?.latitude;

  if (
    Array.isArray(geometryCoordinates) &&
    Number.isFinite(geometryCoordinates[0]) &&
    Number.isFinite(geometryCoordinates[1])
  ) {
    return {
      lon: geometryCoordinates[0],
      lat: geometryCoordinates[1],
    };
  }

  if (Number.isFinite(propertyLon) && Number.isFinite(propertyLat)) {
    return {
      lon: propertyLon,
      lat: propertyLat,
    };
  }

  return null;
}

function buildFeatureMap(data) {
  const mapByIcao24 = new Map();
  const features = data?.features ?? [];

  for (const feature of features) {
    const icao24 = feature?.properties?.icao24 ?? feature?.id;
    if (!icao24) continue;

    mapByIcao24.set(icao24, feature);
  }

  return mapByIcao24;
}

function cloneFeatureWithPosition(feature, lon, lat, heading) {
  return {
    ...feature,
    geometry: {
      type: 'Point',
      coordinates: [lon, lat],
    },
    properties: {
      ...feature.properties,
      lon,
      lat,
      heading,
    },
  };
}

export function buildAnimatedCollection(previousData, nextData, progress) {
  const previousMap = buildFeatureMap(previousData);
  const nextFeatures = nextData?.features ?? [];

  return {
    type: 'FeatureCollection',
    features: nextFeatures.map(nextFeature => {
      const icao24 = nextFeature?.properties?.icao24 ?? nextFeature?.id;
      const previousFeature = previousMap.get(icao24);
      const previousCoordinates = getCoordinates(previousFeature);
      const nextCoordinates = getCoordinates(nextFeature);

      if (!previousCoordinates || !nextCoordinates) {
        return nextFeature;
      }

      const lon = previousCoordinates.lon + (nextCoordinates.lon - previousCoordinates.lon) * progress;
      const lat = previousCoordinates.lat + (nextCoordinates.lat - previousCoordinates.lat) * progress;
      const previousHeading = previousFeature?.properties?.heading ?? 0;
      const nextHeading = nextFeature?.properties?.heading ?? previousHeading;
      const heading = interpolateHeading(previousHeading, nextHeading, progress);

      return cloneFeatureWithPosition(nextFeature, lon, lat, heading);
    }),
  };
}

export function resolveAnimationDuration(lastSnapshotAt, now = Date.now()) {
  if (!lastSnapshotAt) return DEFAULT_ANIMATION_DURATION_MS;

  return clamp(now - lastSnapshotAt, MIN_ANIMATION_DURATION_MS, MAX_ANIMATION_DURATION_MS);
}

function isHelicopterExpression() {
  return [
    'any',
    ['==', ['downcase', ['coalesce', ['get', 'aircraftCategory'], '']], 'helicopter'],
    ['!=', ['get', 'helicopter'], null],
  ];
}

export function iconImageExpression(selectionFlagProperty) {
  return [
    'case',
    isHelicopterExpression(),
    'helicopter',
    ['boolean', ['get', selectionFlagProperty], false],
    'plane-active',
    'plane',
  ];
}

export function iconSizeExpression(selectionFlagProperty) {
  return ['case', ['boolean', ['get', selectionFlagProperty], false], 0.65, 0.5];
}

export function iconImageExpressionByIcao24(selectedIcao24) {
  if (!selectedIcao24) {
    return ['case', isHelicopterExpression(), 'helicopter', 'plane'];
  }

  return [
    'case',
    isHelicopterExpression(),
    'helicopter',
    ['==', ['get', 'icao24'], selectedIcao24],
    'plane-active',
    'plane',
  ];
}

export function iconSizeExpressionByIcao24(selectedIcao24) {
  if (!selectedIcao24) return 0.5;

  return ['case', ['==', ['get', 'icao24'], selectedIcao24], 0.65, 0.5];
}

export function getFlightFromGeoJsonByIcao24(icao24, data) {
  if (!icao24 || !data?.features?.length) return null;

  const match = data.features.find(feature => {
    return feature?.properties?.icao24 === icao24;
  });

  return match?.properties ?? null;
}

export function findFlightPropertiesByIcao24(icao24, data) {
  if (!icao24 || !data?.features?.length) return null;

  return (
    data.features.find(feature => {
      return feature?.properties?.icao24 === icao24;
    })?.properties ?? null
  );
}

export function isSameFlightSnapshot(currentFlight, nextFlight) {
  if (!currentFlight && !nextFlight) return true;
  if (!currentFlight || !nextFlight) return false;

  return (
    currentFlight.icao24 === nextFlight.icao24 &&
    currentFlight.longitude === nextFlight.longitude &&
    currentFlight.latitude === nextFlight.latitude &&
    currentFlight.lon === nextFlight.lon &&
    currentFlight.lat === nextFlight.lat &&
    currentFlight.heading === nextFlight.heading &&
    currentFlight.callsign === nextFlight.callsign &&
    currentFlight.onGround === nextFlight.onGround &&
    currentFlight.verticalRate === nextFlight.verticalRate &&
    currentFlight.altitudeM === nextFlight.altitudeM &&
    currentFlight.speedKmh === nextFlight.speedKmh
  );
}

export function createSelectedFlightCollection(flight, isHighlighted = false) {
  const lon = flight?.longitude ?? flight?.lon;
  const lat = flight?.latitude ?? flight?.lat;

  if (!flight || lon == null || lat == null) {
    return EMPTY_COLLECTION;
  }

  return {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        id: flight.icao24,
        geometry: {
          type: 'Point',
          coordinates: [lon, lat],
        },
        properties: {
          ...flight,
          heading: flight.heading ?? 0,
          isHighlighted,
        },
      },
    ],
  };
}

export async function ensureMapImage(mapInstance, imageId, imagePath, errorLabel) {
  if (mapInstance.hasImage(imageId)) return;

  try {
    const image = await mapInstance.loadImage(imagePath);
    if (!mapInstance.hasImage(imageId)) {
      mapInstance.addImage(imageId, image.data);
    }
  } catch (error) {
    console.error(`${errorLabel} image load failed:`, error);
  }
}
