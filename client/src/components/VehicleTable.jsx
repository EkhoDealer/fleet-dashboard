export default function VehicleTable({ vehicles, selectedId, onSelect }) {
  if (vehicles.length === 0) {
    return <div className="empty-state">No vehicles found.</div>;
  }

  return (
    <div className="table-container">
      <table className="vehicle-table">
        <thead>
          <tr>
            <th>Year</th>
            <th>Make</th>
            <th>Model</th>
            <th>VIN</th>
            <th>Stage</th>
            <th>Days in Stage</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr
              key={vehicle.id}
              className={selectedId === vehicle.id ? 'selected' : ''}
              onClick={() => onSelect(vehicle.id)}
            >
              <td>{vehicle.year}</td>
              <td>{vehicle.make}</td>
              <td>{vehicle.model}</td>
              <td className="vin-cell">{vehicle.vin || <span className="muted">—</span>}</td>
              <td>
                <span className={`stage-badge stage-${vehicle.stage}`}>
                  {vehicle.stage?.replace(/_/g, ' ')}
                </span>
              </td>
              <td>{vehicle.daysInCurrentStage ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
