const express = require('express');
const { createDatabase } = require('../src/db');
const { seedDatabase } = require('../src/seed');
const vehicleRoutes = require('../src/routes/vehicles');

let db;

/**
 * Creates a fully configured Express app with a seeded in-memory database.
 * Call this in beforeAll() of your test suites.
 */
function setupTestApp() {
  const { vehicles, stageLogs } = seedDatabase();
  db = createDatabase(vehicles, stageLogs);

  const app = express();
  app.use(express.json());
  app.locals.db = db;
  app.use('/api/vehicles', vehicleRoutes);

  return app;
}

/**
 * Tears down the test environment.
 * Call this in afterAll() of your test suites.
 */
function teardownTestApp() {
  db = null;
}

/**
 * Returns the database instance for direct queries in tests.
 */
function getDb() {
  return db;
}

module.exports = { setupTestApp, teardownTestApp, getDb };
