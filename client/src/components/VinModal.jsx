import { useState } from 'react';
import { updateVin } from '../api/vehicleApi';

export default function VinModal({ vehicleId, currentVin, onClose, onSave }) {
  const [vin, setVin] = useState(currentVin || '');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    if (vin.length !== 17) {
      setError('VIN must be exactly 17 characters.');
      return;
    }

    setSaving(true);
    try {
      const result = await updateVin(vehicleId, vin);
      if (result.error) {
        setError(result.error);
      } else {
        onSave(result.vin);
      }
    } catch (err) {
      setError('Failed to save VIN. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3>Set Vehicle VIN</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={vin}
            onChange={(e) => setVin(e.target.value.toUpperCase())}
            placeholder="Enter 17-character VIN"
            maxLength={17}
            className="vin-input"
            autoFocus
          />
          {error && <div className="form-error">{error}</div>}
          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="btn-primary">
              {saving ? 'Saving...' : 'Save VIN'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
