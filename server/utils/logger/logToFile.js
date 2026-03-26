import { promises as fs } from 'node:fs';
import { join } from 'node:path';

export async function logToFile(entries) {
  if (!entries?.length) return;

  try {
    const dir = join(process.cwd(), 'logs');
    const file = join(dir, 'heli-scan.ndjson');

    // 👉 Ordner sicherstellen
    await fs.mkdir(dir, { recursive: true });

    // 👉 Datei sicherstellen (wird nur erstellt, wenn sie fehlt)
    try {
      await fs.access(file);
    } catch {
      await fs.writeFile(file, '');
    }

    const lines = entries.map(e => JSON.stringify(e)).join('\n') + '\n';

    await fs.appendFile(file, lines, 'utf8');
  } catch (err) {
    console.error('log write failed:', err);
  }
}
