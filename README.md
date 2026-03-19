# Flighttracker

Flighttracker ist eine moderne Webanwendung zur Visualisierung von Flugdaten auf einer interaktiven Karte. Das Projekt basiert auf `Nuxt 4` und setzt auf eine klare Trennung zwischen Frontend, serverseitiger Datenaufbereitung und externer Datenquelle.

Der fachliche Fokus liegt auf der Darstellung von Flugbewegungen ueber eine performante Kartenansicht. Perspektivisch soll die Visualisierung nicht mehr ueber klassische DOM-, Canvas- oder SVG-Ansatze erfolgen, sondern auf `WebGL` in Kombination mit `MapLibre` aufbauen. So bleibt die Anwendung auch bei groesseren Datenmengen performant und technisch zukunftsfaehig.

## Zielsetzung

Die Anwendung soll Flugdaten der `OpenSky API` ueber eigene `Nuxt API Routes` abrufen, vereinheitlichen und im Frontend in einer uebersichtlichen Kartenansicht darstellen.

Im Mittelpunkt stehen dabei:

- performante Kartenvisualisierung mit `WebGL` und `MapLibre`
- saubere Datenaufbereitung ueber serverseitige Endpunkte
- klar strukturierter `Vue`- und `Nuxt`-Projektaufbau
- gute Erweiterbarkeit fuer weitere Filter-, Detail- und Live-Tracking-Funktionen

## Tech Stack

- `Nuxt 4`
- `Vue 3`
- `Nuxt UI`
- `Pinia`
- `Nuxt API Routes`
- `OpenSky API`

## Architektur

Das Projekt verfolgt einen einfachen und gut wartbaren Aufbau:

- Das Frontend basiert auf `Vue` innerhalb von `Nuxt`.
- UI-Bausteine und Grundlayout werden mit `Nuxt UI` umgesetzt.
- Eigene `Nuxt API Routes` kapseln den Zugriff auf externe Flugdaten.
- Die Daten der `OpenSky API` werden serverseitig normalisiert, damit das Frontend mit einem stabilen Datenmodell arbeiten kann.
- Die Kartenebene wird schrittweise auf `MapLibre` mit `WebGL` ausgerichtet.

## Aktueller Stand

- grundlegende `Nuxt`-Projektstruktur ist vorhanden
- Startseite unter [`pages/index.vue`](/Users/richardholzner/Desktop/Vue Kurs/flighttracker-webgl/pages/index.vue)
- Default-Layout unter [`layouts/default.vue`](/Users/richardholzner/Desktop/Vue Kurs/flighttracker-webgl/layouts/default.vue)
- Header-Komponente unter [`layouts/TheHeader.vue`](/Users/richardholzner/Desktop/Vue Kurs/flighttracker-webgl/layouts/TheHeader.vue)
- Datenzugriff ueber [`server/api/flights.get.js`](/Users/richardholzner/Desktop/Vue Kurs/flighttracker-webgl/server/api/flights.get.js)
- Mapping der OpenSky-Rohdaten in [`server/utils/mapOpenSky.js`](/Users/richardholzner/Desktop/Vue Kurs/flighttracker-webgl/server/utils/mapOpenSky.js)
- Mock-Daten fuer lokale Entwicklung unter [`server/data/mockFlights.json`](/Users/richardholzner/Desktop/Vue Kurs/flighttracker-webgl/server/data/mockFlights.json)

## Entwicklung

```bash
npm install
npm run dev
```

Die Anwendung laeuft lokal anschliessend in der Nuxt-Entwicklungsumgebung.

## Weitere Skripte

```bash
npm run build
npm run preview
npm run lint
npm run format
```

## Ausblick

Die naechsten technischen Schritte liegen vor allem im Ausbau der Kartenvisualisierung:

- Migration auf `MapLibre` als Kartenbasis
- Rendering der Flugobjekte ueber `WebGL`
- effiziente Darstellung groesserer Flugmengen
- spaetere Erweiterung um Interaktionen, Detailansichten und moegliche Live-Updates
