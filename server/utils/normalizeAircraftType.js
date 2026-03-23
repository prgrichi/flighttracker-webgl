export function normalizeAircraftType(type) {
  if (!type) return null;

  let t = type.toUpperCase().trim();

  // Airbus A320-214 → A320
  if (t.startsWith('A320')) return 'A320';
  if (t.startsWith('A321')) return t.includes('NEO') ? 'A21N' : 'A321';
  if (t.startsWith('A319')) return 'A319';
  if (t.startsWith('A318')) return 'A318';

  // A350 Varianten
  if (t.startsWith('A350')) {
    if (t.includes('1000')) return 'A35K';
    return 'A359'; // -900
  }

  // A330
  if (t.startsWith('A330')) {
    if (t.includes('900')) return 'A339';
    if (t.includes('200')) return 'A332';
    return 'A333';
  }

  // Boeing 737
  if (t.startsWith('B737') || t.startsWith('737')) {
    if (t.includes('MAX')) return 'B38M';
    if (t.includes('900')) return 'B739';
    if (t.includes('800')) return 'B738';
    if (t.includes('700')) return 'B737';
    return 'B737';
  }

  // 787
  if (t.startsWith('B787') || t.startsWith('787')) {
    if (t.includes('10')) return 'B78X';
    if (t.includes('9')) return 'B789';
    return 'B788';
  }

  // Embraer E2
  if (t.startsWith('E195')) return 'E295';
  if (t.startsWith('E190')) return 'E290';

  // fallback → strip suffix
  return t.split('-')[0];
}
