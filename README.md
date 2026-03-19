# Flighttracker

Kleines Nuxt-Projekt fuer eine Flighttracker-App. Die Basis steht bereits: Layout, Startseite und die Server-Struktur sind angelegt. Als naechster Schritt wird die Kartenansicht mit Flugdaten ausgebaut.

## Idee

Die App soll Flugzeuge auf einer Karte darstellen und die Daten ueber eine eigene Nuxt-API bereitstellen. Der Fokus liegt aktuell auf einem sauberen, einfachen Projektaufbau fuer die weitere Entwicklung.

## Tech-Stack

- Nuxt 4
- Vue 3
- Nuxt UI
- Pinia
- Nuxt Server API

## Aktueller Stand

- Grundgeruest fuer eine Nuxt-App ist vorhanden
- Startseite unter [`pages/index.vue`](/Users/richardholzner/Desktop/Vue Kurs/flighttracker/pages/index.vue)
- Header-Layout unter [`layouts/TheHeader.vue`](/Users/richardholzner/Desktop/Vue Kurs/flighttracker/layouts/TheHeader.vue)
- Server-Endpunkt als Platzhalter unter [`server/api/car/planes.get.js`](/Users/richardholzner/Desktop/Vue Kurs/flighttracker/server/api/car/planes.get.js)
- Beispieldaten liegen unter [`server/data/planes/planes.json`](/Users/richardholzner/Desktop/Vue Kurs/flighttracker/server/data/planes/planes.json)

## Geplante Features

- Kartenansicht fuer Flugzeuge
- Marker fuer einzelne Maschinen
- Datenbezug ueber eine eigene API
- Spaeter optional Anbindung an eine Live-Datenquelle

## Entwicklung

```bash
npm install
npm run dev
```

Die lokale Entwicklungsumgebung startet danach standardmaessig ueber Nuxt.

## Weitere Skripte

```bash
npm run build
npm run preview
npm run lint
npm run format
```
