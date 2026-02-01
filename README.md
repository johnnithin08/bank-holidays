# bank-holidays

An Expo (React Native) app for viewing and editing UK bank holidays.

## Features

- Fetches from the official UK Government feed (`https://www.gov.uk/bank-holidays.json`)
- Merges England & Wales, Scotland, and Northern Ireland holidays and deduplicates by date + title
- Shows the next 5 unique holidays within the next 6 months
- Tap a holiday to edit title and date (with basic validation)
- Offline storage: caches the computed list and edits in AsyncStorage and only refetches when the cache is from a previous day
- Pull to refresh on the holiday list
- Built with Gluestack UI components
- Calendar integration: add a holiday to the device calendar
- Unit tests for core screens/components

## Getting started

```bash
yarn
yarn start
```

## Running tests

```bash
yarn test
```
