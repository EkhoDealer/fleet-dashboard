const express = require('express');
const cors = require('cors');
const { createDatabase } = require('./db');
const { seedDatabase } = require('./seed');
const vehicleRoutes = require('./routes/vehicles');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/vehicles', vehicleRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Debug endpoint — view raw database contents
app.get('/api/debug', async (req, res) => {
  const db = req.app.locals.db;
  res.json(await db.dump());
});

function start() {
  console.log('Starting Ekho Fleet server...');

  const { vehicles, stageLogs } = seedDatabase();
  const db = createDatabase(vehicles, stageLogs);

  app.locals.db = db;

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

start();

module.exports = app;
