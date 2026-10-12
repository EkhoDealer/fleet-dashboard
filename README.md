# Ekho Technical Assessment: Brownfield (30 minutes)

You are encouraged to use AI tools. Use whatever helps you work effectively.

## Fleet Dashboard

You've joined the fleet operations team at Ekho. The team uses this internal dashboard to manage vehicles moving through the fulfillment pipeline: **Sale Processing → Fulfillment → Fulfilled**.

After a major backend migration, the Operations team has reported a host of issues:

1. "The metrics at the top of the dashboard don't seem to align with the data. Can you please resolve?"
2. "When I click on a vehicle to view its details, then click a different one, the panel still shows the first vehicle's info. It never updates. Can you fix this?"
3. "The stage filter is completely broken — when I select 'Sale Processing' or 'Fulfillment', I get no results even though vehicles are clearly in those stages. Can you fix this?"
4. "I keep entering VINs for vehicles and it looks like they save — the UI even confirms it — but then the VIN is gone when I refresh or try to move the vehicle forward. Can you investigate why VINs aren't sticking?"
5. "The 'Kick Off Fulfillment' button does nothing. I click it, nothing happens, no error, no change. Can you please fix this?"

Your job is to investigate, find what's broken, and fix it.
(Please note that investigation difficulty scales up from first issue -> last.)

### Setup

```bash
# Install all dependencies (root + server + client)
npm run setup

# Start both server and client
npm run dev
```

- **Server** runs at `http://localhost:3001` (Express + in-memory database)
- **Client** runs at `http://localhost:3000` (React + Vite)

No external database setup is required — the server uses a built-in in-memory data store that seeds automatically on startup.

### Expected Workflow

When working correctly, the ops team's workflow should be:

1. Review vehicles in **Sale Processing**
2. **Kick off fulfillment** for vehicles ready to proceed
3. Ensure each vehicle has a **VIN** on file
4. **Mark as fulfilled** once the vehicle is ready to deliver

A vehicle must have a valid VIN before it can be marked as fulfilled.

### Useful Endpoints

- `GET http://localhost:3001/api/vehicles` — all vehicles
- `GET http://localhost:3001/api/vehicles/:id` — single vehicle
- `GET http://localhost:3001/api/debug` — raw database contents

### Tasks

#### Investigation & Fixes (30 minutes)

Explore the dashboard, try the workflow described above, and fix whatever is preventing the ops team from getting vehicles to fulfilled. There are multiple issues across the frontend and backend.


### Guidelines

- Focus on identifying **root causes**, not just patching symptoms.
- Prioritize your time — fix the most impactful issues first.
- Keep fixes minimal and clean. Don't refactor unrelated code.
- Do **not** modify `server/src/db.js` or `server/src/seed.js`. They are provided infrastructure.

### Project Structure

```
├── server/
│   ├── src/
│   │   ├── index.js          # Express server entry point
│   │   ├── db.js             # In-memory database service (DO NOT MODIFY)
│   │   ├── seed.js           # Seed data generation (DO NOT MODIFY)
│   │   ├── schemas.js        # Vehicle, Stage, and StageLog shapes
│   │   ├── routes/
│   │   │   └── vehicles.js   # All vehicle API routes
│   │   └── utils/
│   │       ├── validation.js  # VIN validation
│   │       └── transitions.js # Stage transition rules
│   └── __tests__/
│       └── helpers.js         # Test setup utilities
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api/
│   │   │   └── vehicleApi.js  # API client functions
│   │   └── components/
│   │       ├── Dashboard.jsx   # Main dashboard page
│   │       ├── VehicleTable.jsx
│   │       ├── VehicleDetail.jsx
│   │       ├── StageFilter.jsx
│   │       └── VinModal.jsx
│   └── vite.config.js
```
