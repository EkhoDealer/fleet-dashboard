import { useState, useEffect } from 'react';
import { fetchVehicle, updateStage } from '../api/vehicleApi';
import VinModal from './VinModal';

const NEXT_STAGES = {
  sale_processing: ['fulfillment'],
  fulfillment: ['fulfilled'],
  fulfilled: [],
};

const STAGE_ACTION_LABELS = {
  fulfillment: 'Kick Off Fulfillment',
  fulfilled: 'Mark Fulfilled',
};

export default function VehicleDetail({ vehicleId, onUpdate, onClose }) {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showVinModal, setShowVinModal] = useState(false);
  const [stageLoading, setStageLoading] = useState(false);

  useEffect(() => {
    if (!vehicleId) return;

    setLoading(true);
    fetchVehicle(vehicleId)
      .then((data) => {
        setVehicle(data);
        setLoading(false);
      })
      .catch(() => {
        setVehicle(null);
        setLoading(false);
      });
  }, []);

  async function handleStageChange(newStage) {
    setStageLoading(true);
    try {
      const result = await updateStage(vehicleId, newStage);
      if (result.vehicle) {
        setVehicle(result.vehicle);
      }
      onUpdate();
    } catch (err) {
      console.error('Failed to update stage:', err);
    } finally {
      setStageLoading(false);
    }
  }

  if (loading) return <div className="detail-panel">Loading vehicle details...</div>;
  if (!vehicle) return <div className="detail-panel">Vehicle not found.</div>;

  const nextStages = NEXT_STAGES[vehicle.stage] || [];

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <h2>
          {vehicle.year} {vehicle.make} {vehicle.model}
        </h2>
        <button className="btn-close" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="detail-grid">
        <div className="detail-item">
          <span className="detail-label">VIN</span>
          <span className="detail-value">
            {vehicle.vin || <span className="muted">Not Set</span>}
            <button className="btn-small" onClick={() => setShowVinModal(true)}>
              {vehicle.vin ? 'Edit' : 'Set VIN'}
            </button>
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Stage</span>
          <span className={`detail-value stage-badge stage-${vehicle.stage}`}>
            {vehicle.stage?.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Color</span>
          <span className="detail-value">{vehicle.color}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Mileage</span>
          <span className="detail-value">{vehicle.mileage?.toLocaleString()} mi</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Price</span>
          <span className="detail-value">${vehicle.price?.toLocaleString()}</span>
        </div>
      </div>

      {nextStages.length > 0 && (
        <div className="stage-actions">
          <span className="action-label">Move to:</span>
          {nextStages.map((stage) => (
            <button
              key={stage}
              className="btn-stage"
              disabled={stageLoading}
              onClick={() => handleStageChange(stage)}
            >
              {STAGE_ACTION_LABELS[stage] || stage.replace(/_/g, ' ')}
            </button>
          ))}
        </div>
      )}

      {vehicle.stageHistory && vehicle.stageHistory.length > 0 && (
        <div className="stage-history">
          <h3>Stage History</h3>
          <ul>
            {vehicle.stageHistory.map((entry, i) => (
              <li key={i}>
                <span className="history-stage">
                  {entry.stage?.replace(/_/g, ' ')}
                </span>
                <span className="history-date">
                  {new Date(entry.timestamp).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {showVinModal && (
        <VinModal
          vehicleId={vehicleId}
          currentVin={vehicle.vin}
          onClose={() => setShowVinModal(false)}
          onSave={(newVin) => {
            setVehicle({ ...vehicle, vin: newVin });
            setShowVinModal(false);
            onUpdate();
          }}
        />
      )}
    </div>
  );
}
