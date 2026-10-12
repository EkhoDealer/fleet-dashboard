const express = require('express');
const { isValidVin } = require('../utils/validation');
const { isValidTransition, STAGES } = require('../utils/transitions');

const router = express.Router();

const MS_PER_DAY = 1000 * 60 * 60 * 24;

function getDaysInCurrentStage(vehicle) {
  const history = vehicle.stageHistory || [];
  if (history.length === 0) return 0;
  const stageStart = new Date(history[history.length - 1].timestamp);
  return Math.floor((Date.now() - stageStart.getTime()) / MS_PER_DAY);
}

// GET /api/vehicles — list all vehicles, optionally filtered by stage
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { stage } = req.query;

    const filter = {};
    if (stage) {
      filter.stage = stage;
    }

    const vehicles = await db.vehicles.findAll(filter);

    res.json(vehicles.map(vehicle => ({
      ...vehicle,
      daysInCurrentStage: getDaysInCurrentStage(vehicle),
    })));
  } catch (error) {
    console.error('Error fetching vehicles:', error);
    res.status(500).json({ error: 'Failed to fetch vehicles' });
  }
});

// GET /api/vehicles/stats — stage counts for summary cards
router.get('/stats', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const counts = db.vehicles.countByStage();

    const stats = {};
    for (const stage of STAGES) {
      stats[stage] = counts[stage] || 0;
    }

    res.json(stats);
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// GET /api/vehicles/:id — get a single vehicle by ID
router.get('/:id', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const vehicle = await db.vehicles.findById(req.params.id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }
    res.json(vehicle);
  } catch (error) {
    console.error('Error fetching vehicle:', error);
    res.status(500).json({ error: 'Failed to fetch vehicle' });
  }
});

// PUT /api/vehicles/:id/vin — set or update a vehicle's VIN
router.put('/:id/vin', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { vin } = req.body;

    if (!vin) {
      return res.status(400).json({ error: 'VIN is required' });
    }

    if (!isValidVin(vin)) {
      return res.status(400).json({ error: 'Invalid VIN format. Must be 17 alphanumeric characters (no I, O, or Q).' });
    }

    const vehicle = await db.vehicles.findById(id);
    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    vehicle.vin = vin;
    vehicle.updatedAt = new Date();

    res.json({ message: 'VIN updated successfully', vin });
  } catch (error) {
    console.error('Error updating VIN:', error);
    res.status(500).json({ error: 'Failed to update VIN' });
  }
});

// PUT /api/vehicles/:id/stage — transition a vehicle to a new stage
router.put('/:id/stage', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const { id } = req.params;
    const { stage: newStage } = req.body;

    if (!newStage || !STAGES.includes(newStage)) {
      return res.status(400).json({ error: `Invalid stage. Must be one of: ${STAGES.join(', ')}` });
    }

    const vehicle = await db.vehicles.findById(id);

    if (!vehicle) {
      return res.status(404).json({ error: 'Vehicle not found' });
    }

    if (newStage === 'fulfilled' && !vehicle.vin) {
      return res.status(400).json({ error: 'Vehicle must have a VIN recorded before it can be marked as fulfilled' });
    }

    if (!isValidTransition(vehicle.stage, newStage)) {
      return res.json({ message: 'Stage update processed', vehicle });
    }

    const updatedHistory = [
      ...(vehicle.stageHistory || []),
      { stage: newStage, timestamp: new Date(), previousStage: vehicle.stage },
    ];

    await db.vehicles.updateOne(id, {
      stage: newStage,
      stageHistory: updatedHistory,
    });

    // Write to stage_logs for audit trail
    await db.stageLogs.insertOne({
      vehicleId: vehicle.id,
      stage: newStage,
      previousStage: vehicle.stage,
      timestamp: new Date(),
    });

    const updated = await db.vehicles.findById(id);
    res.json({ message: 'Stage updated successfully', vehicle: updated });
  } catch (error) {
    console.error('Error updating stage:', error);
    res.status(500).json({ error: 'Failed to update stage' });
  }
});

module.exports = router;
