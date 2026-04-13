# Flighttracker WebGL

Flighttracker WebGL ist eine Nuxt-Anwendung zur Visualisierung aktueller Flugdaten auf einer interaktiven Kartenansicht. Die App bereitet Daten der OpenSky Network API serverseitig auf und rendert Flugzeuge, Flughafentypen und Detailinformationen performant mit MapLibre GL.

Das Projekt ist als moderne Frontend-Anwendung aufgebaut: UI, State, Kartenlogik und API-Anbindung sind in klar getrennten Komponenten, Composables und Server-Routes organisiert. Der Schwerpunkt liegt auf einer robusten Live-Daten-Pipeline, einer responsiven Bedienoberfläche und einer erweiterbaren Architektur für kartenbasierte Echtzeitdaten.

Live-Demo: [flighttracker24.de](https://flighttracker24.de)

## Features

- Interaktive WebGL-Karte mit MapLibre GL
- Live-Flugdaten für Bavaria, Germany und Europe
- Serverseitige OpenSky-Anbindung über Nuxt API Routes
- Normalisierung von OpenSky-Rohdaten in ein GeoJSON-basiertes Frontend-Modell
- Flugzeugmarker mit Richtung, Auswahlzustand und Detailkarte
- Airport-Layer mit schaltbaren Flughafen- und Heliport-Kategorien
- Favoritenansicht mit lokal gespeicherten Flugzeugen und aktueller Statusabfrage
- Kartenstil-Umschaltung und Navigation zu gespeicherten Flugzeugen
- Fehler- und Offline-Zustände für Live-Daten und WebGL-Unterstützung
- PWA-Konfiguration mit App-Icons und auto update

## Tech Stack

- Nuxt 4
- Vue 3
- Nuxt UI
- Tailwind CSS
- MapLibre GL
- VueUse
- Vite PWA
- OpenSky Network API

## Architektur

Die Anwendung trennt bewusst zwischen Darstellung, Kartenlogik und Datenaufbereitung:

- `pages/` enthält die zentralen Routen für Karte und Favoriten.
- `components/` kapselt UI-Elemente wie Header, Kartensteuerung, Statusbanner und Flight Cards.
- `composables/` bündelt Client-State, MapLibre-Initialisierung, Layer-Logik, Favoriten und Netzwerkstatus.
- `server/api/` stellt eigene Endpunkte für Flüge, Favoriten und Request-Statistiken bereit.
- `server/utils/` übernimmt OpenSky-Authentifizierung, Datenmapping, Caching-Helfer und Normalisierung.
- `public/data/` enthält vorbereitete GeoJSON-Daten für Airport-Layer.

Der Client arbeitet mit einem stabilen GeoJSON-Modell. Die externen OpenSky-Daten werden serverseitig geladen, gecacht und normalisiert, damit die Kartenebene unabhängig von der Rohdatenstruktur bleibt.

## Datenfluss

1. Das Frontend fragt `/api/flights` mit der aktuell gewählten Region ab.
2. Die Nuxt API Route ruft OpenSky mit OAuth-Token und Bounding Box auf.
3. Die Rohdaten werden in ein einheitliches Flugobjekt gemappt.
4. Die Antwort wird als GeoJSON `FeatureCollection` an den Client geliefert.
5. MapLibre rendert die Flugzeuge als Symbol-Layer und aktualisiert Auswahl- und Navigationszustand.

Favoriten verwenden einen separaten Endpunkt (`/api/favorites`), um gespeicherte ICAO24-Adressen gezielt frisch gegen OpenSky abzufragen.

## Lokale Entwicklung

```bash
npm install
npm run dev
```

Die Anwendung startet anschliessend in der Nuxt-Entwicklungsumgebung.

Für Live-Daten werden OpenSky-Zugangsdaten als Environment-Variablen benötigt:

```bash
NUXT_OPENSKY_CLIENT_ID=...
NUXT_OPENSKY_CLIENT_SECRET=...
```

Optional koennen Kartenanbieter-Keys gesetzt werden:

```bash
NUXT_PUBLIC_MAPTILER_KEY=...
NUXT_PUBLIC_STADIA_KEY=...
```

Für lokale Entwicklung ohne OpenSky-Request kann Mock-Modus verwendet werden:

```bash
NUXT_USE_MOCK=true
```

## Skripte

```bash
npm run dev
npm run build
npm run preview
npm run lint
npm run format
```

## Projektfokus

Dieses Repository zeigt den Aufbau einer datengetriebenen Vue/Nuxt-Anwendung mit serverseitiger API-Kapselung, interaktiver WebGL-Karte und modularer Composition-API-Struktur. Neben der reinen Darstellung von Flugdaten liegt der Fokus auf Wartbarkeit, nachvollziehbarem Datenfluss und einer Oberfläche, die auf Desktop und Mobile nutzbar bleibt.
