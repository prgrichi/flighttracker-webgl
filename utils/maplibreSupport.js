export function hasWebGLSupport() {
  try {
    const canvas = document.createElement('canvas');

    const gl =
      canvas.getContext('webgl2') ||
      canvas.getContext('webgl') ||
      canvas.getContext('experimental-webgl');

    return !!gl && !!window.WebGLRenderingContext;
  } catch {
    return false;
  }
}

export function getReadableMapError(error) {
  if (!(error instanceof Error)) {
    return 'WebGL konnte nicht initialisiert werden.';
  }

  try {
    const parsed = JSON.parse(error.message);

    if (parsed?.statusMessage) return parsed.statusMessage;
    if (parsed?.message) return parsed.message;
  } catch {
    // ignore
  }

  return error.message || 'WebGL konnte nicht initialisiert werden.';
}
