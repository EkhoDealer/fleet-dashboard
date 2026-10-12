import { useState, useEffect } from 'react';
import { fetchVehicles, fetchVehicleStats } from '../api/vehicleApi';
import VehicleTable from './VehicleTable';
import VehicleDetail from './VehicleDetail';
import StageFilter from './StageFilter';

const STAGE_ORDER = ['sale_processing', 'fulfillment', 'fulfilled'];
const STAGE_DISPLAY = {
  sale_processing: 'Sale Processing',
  fulfillment: 'Fulfillment',
  fulfilled: 'Fulfilled',
};

export default function Dashboard() {
  const [vehicles, setVehicles] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedId, setSelectedId] = useState(null);
  const [stageFilter, setStageFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadVehicles();
  }, [stageFilter]);

  useEffect(() => {
    loadStats();
  }, []);

  async function loadVehicles() {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchVehicles(stageFilter);
      setVehicles(data);
    } catch (err) {
      setError('Failed to load vehicles. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    try {
      const data = await fetchVehicleStats();
      setStats(data);
    } catch {
      // Stats are non-critical, fail silently
    }
  }

  function handleRefresh() {
    loadVehicles();
    loadStats();
  }

  const totalCount = STAGE_ORDER.reduce((sum, s) => sum + (stats[s] || 0), 0);

  return (
    <div className="dashboard">
      <div className="stage-summary">
        <div className="stage-card stage-card-all">
          <div className="stage-count">{totalCount}</div>
          <div className="stage-label">All</div>
        </div>
        {STAGE_ORDER.map((stage) => (
          <div key={stage} className={`stage-card stage-card-${stage}`}>
            <div className="stage-count">{stats[stage] || 0}</div>
            <div className="stage-label">{STAGE_DISPLAY[stage]}</div>
          </div>
        ))}
      </div>

      <div className="toolbar">
        <StageFilter value={stageFilter} onChange={setStageFilter} />
        <button className="btn-refresh" onClick={handleRefresh}>
          Refresh
        </button>
      </div>

      {error && <div className="error-banner">{error}</div>}

      <div className="dashboard-content">
        <div className="table-section">
          {loading ? (
            <div className="loading-spinner">Loading vehicles...</div>
          ) : (
            <VehicleTable
              vehicles={vehicles}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          )}
        </div>

        {selectedId && (
          <div className="detail-section">
            <VehicleDetail
              vehicleId={selectedId}
              onUpdate={handleRefresh}
              onClose={() => setSelectedId(null)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
