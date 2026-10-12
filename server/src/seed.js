const { generateId } = require('./db');

const MAKES_MODELS = [
  { make: 'Toyota', models: ['Camry', 'Corolla', 'RAV4', 'Highlander', 'Tacoma'] },
  { make: 'Honda', models: ['Civic', 'Accord', 'CR-V', 'Pilot'] },
  { make: 'Ford', models: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Bronco'] },
  { make: 'BMW', models: ['3 Series', '5 Series', 'X3', 'X5'] },
  { make: 'Mercedes-Benz', models: ['C-Class', 'E-Class', 'GLC', 'GLE'] },
  { make: 'Chevrolet', models: ['Silverado', 'Malibu', 'Equinox', 'Tahoe'] },
  { make: 'Tesla', models: ['Model 3', 'Model Y', 'Model S', 'Model X'] },
  { make: 'Hyundai', models: ['Elantra', 'Tucson', 'Santa Fe', 'Sonata'] },
  { make: 'Audi', models: ['A4', 'A6', 'Q5', 'Q7'] },
  { make: 'Nissan', models: ['Altima', 'Rogue', 'Sentra', 'Pathfinder'] },
];

const COLORS = ['White', 'Black', 'Silver', 'Blue', 'Red', 'Gray', 'Pearl', 'Green'];
const STAGES = ['sale_processing', 'fulfillment', 'fulfilled'];

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function generateVin() {
  const chars = 'ABCDEFGHJKLMNPRSTUVWXYZ0123456789';
  let vin = '';
  for (let i = 0; i < 17; i++) {
    vin += chars[Math.floor(Math.random() * chars.length)];
  }
  return vin;
}

function generateVehicles(count) {
  const vehicles = [];
  const stageLogs = [];

  for (let i = 0; i < count; i++) {
    const makeObj = randomItem(MAKES_MODELS);
    const model = randomItem(makeObj.models);
    const stage = randomItem(STAGES);
    const stageIndex = STAGES.indexOf(stage);
    const vehicleId = generateId();

    // Build stage history leading up to current stage
    const stageHistory = [];
    const baseDate = new Date();
    baseDate.setDate(baseDate.getDate() - randomInt(7, 60));

    for (let j = 0; j <= stageIndex; j++) {
      const entryDate = new Date(baseDate);
      entryDate.setDate(entryDate.getDate() + j * randomInt(2, 10));

      const entry = {
        stage: STAGES[j],
        timestamp: entryDate,
        previousStage: j > 0 ? STAGES[j - 1] : null,
      };
      stageHistory.push(entry);

      // Also write to stage_logs (audit trail)
      stageLogs.push({
        id: generateId(),
        vehicleId,
        stage: STAGES[j],
        previousStage: j > 0 ? STAGES[j - 1] : null,
        timestamp: entryDate,
      });
    }

    vehicles.push({
      id: vehicleId,
      // VIN is recorded during fulfillment — sale_processing vehicles never have one,
      // fulfillment vehicles may or may not, fulfilled vehicles always do
      vin: stage === 'fulfilled' ? generateVin()
        : stage === 'fulfillment' ? (Math.random() > 0.5 ? generateVin() : null)
        : null,
      make: makeObj.make,
      model,
      year: randomInt(2019, 2025),
      color: randomItem(COLORS),
      stage,
      price: randomInt(12000, 65000),
      mileage: randomInt(3000, 95000),
      stageHistory,
      createdAt: stageHistory[0]?.timestamp || new Date(),
      updatedAt: stageHistory[stageHistory.length - 1]?.timestamp || new Date(),
    });
  }

  return { vehicles, stageLogs };
}

function seedDatabase() {
  console.log('Generating seed data...');
  const data = generateVehicles(100);
  console.log(`Generated ${data.vehicles.length} vehicles and ${data.stageLogs.length} stage log entries.`);
  return data;
}

module.exports = { seedDatabase };
