// ⚠️ This file simulates a database service. Do not modify.

'use strict';

const crypto = require('crypto');

function generateId() {
  return crypto.randomBytes(12).toString('hex');
}

// Simulates async I/O latency (network round-trip to database)
function _query(fn) {
  return new Promise(resolve => setTimeout(() => resolve(fn()), 1));
}

function createDatabase(seedVehicles = [], seedStageLogs = []) {
  const _vehicles = new Map();
  const _stageLogs = [];

  for (const v of seedVehicles) {
    _vehicles.set(v.id, structuredClone(v));
  }
  for (const log of seedStageLogs) {
    _stageLogs.push(structuredClone(log));
  }

  return Object.freeze({
    vehicles: Object.freeze({
      findAll(filter = {}) {
        return _query(() => {
          let results = Array.from(_vehicles.values());
          if (filter.stage) {
            results = results.filter(v => v.stage === filter.stage);
          }
          results.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
          return results.map(v => structuredClone(v));
        });
      },

      findById(id) {
        return _query(() => {
          const v = _vehicles.get(id);
          return v ? structuredClone(v) : null;
        });
      },

      updateOne(id, updates) {
        return _query(() => {
          const v = _vehicles.get(id);
          if (!v) return { matched: 0, modified: 0 };
          for (const [key, val] of Object.entries(updates)) {
            v[key] = structuredClone(val);
          }
          v.updatedAt = new Date();
          return { matched: 1, modified: 1 };
        });
      },

      countByStage() {
        return _query(() => {
          const counts = {};
          for (const v of _vehicles.values()) {
            counts[v.stage] = (counts[v.stage] || 0) + 1;
          }
          return counts;
        });
      },
    }),

    stageLogs: Object.freeze({
      findByVehicleId(vehicleId) {
        return _query(() => {
          return _stageLogs
            .filter(log => log.vehicleId === vehicleId)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
            .map(log => structuredClone(log));
        });
      },

      insertOne(entry) {
        return _query(() => {
          _stageLogs.push(structuredClone(entry));
        });
      },
    }),

    dump() {
      return _query(() => ({
        vehicles: Array.from(_vehicles.values()).map(v => structuredClone(v)),
        stageLogs: _stageLogs.map(l => structuredClone(l)),
      }));
    },
  });
}

module.exports = { createDatabase, generateId };
