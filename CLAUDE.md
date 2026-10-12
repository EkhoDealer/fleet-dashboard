# CLAUDE.md

## Project Overview

Ekho Fleet Dashboard — an internal tool for the ops team to manage vehicles through the fulfillment pipeline (Sale Processing → Fulfillment → Fulfilled). Express backend with an in-memory data store, React + Vite frontend.

## Setup & Running

```bash
npm run setup    # install all deps
npm run dev      # start server (3001) + client (3000)
npm test         # run backend tests (Jest + Supertest)
```

## Do Not Modify

- `server/src/db.js` — This is the database service layer. It is provided infrastructure and must not be changed.
- `server/src/seed.js` — Seed data generation. Do not modify.

## Key Conventions

- Vehicle stages are lowercase snake_case enums: `sale_processing`, `fulfillment`, `fulfilled`
- VIN validation follows the real VIN spec: 17 characters, letters A-H, J-N, P, R-Z and digits 0-9 (letters I, O, Q are excluded per industry standard)
- Stage transitions are validated server-side via `server/src/utils/transitions.js`
- A vehicle must have a valid VIN before it can be marked as `fulfilled`
- Backend tests go in `server/__tests__/*.test.js` — use the helpers in `server/__tests__/helpers.js`

## Debugging

- `http://localhost:3001/api/debug` — dumps the raw database contents
- `http://localhost:3001/api/vehicles` — all vehicles
- `http://localhost:3001/api/vehicles/stats` — counts per stage
- Server auto-restarts on file changes (nodemon)
- Client has Vite HMR
