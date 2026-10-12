const STAGE_OPTIONS = [
  { label: 'All', value: '' },
  { label: 'Sale Processing', value: 'Sale Processing' },
  { label: 'Fulfillment', value: 'Fulfillment' },
  { label: 'Fulfilled', value: 'Fulfilled' },
];

export default function StageFilter({ value, onChange }) {
  return (
    <div className="stage-filter">
      <label htmlFor="stage-select">Filter by stage:</label>
      <select
        id="stage-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {STAGE_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
