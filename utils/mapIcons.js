export function createPlaneIcon(L, selected = false, heading) {
  return L.divIcon({
    className: 'plane-marker',
    html: `<div style="
      transform: rotate(${heading - 45}deg) scale(${selected ? 1.5 : 1});
      transition: transform 0.2s linear;
    ">✈️</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
}
