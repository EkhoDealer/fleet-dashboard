const API_BASE = "http://localhost:3001/api";

export async function fetchVehicles(stage = "") {
  const params = stage ? `?stage=${encodeURIComponent(stage)}` : "";
  const res = await fetch(`${API_BASE}/vehicles${params}`);
  if (!res.ok) throw new Error("Failed to fetch vehicles");
  return res.json();
}

export async function fetchVehicleStats() {
  const res = await fetch(`${API_BASE}/vehicles/stats`);
  if (!res.ok) throw new Error("Failed to fetch stats");
  return res.json();
}

export async function fetchVehicle(id) {
  const res = await fetch(`${API_BASE}/vehicles/${id}`);
  if (!res.ok) throw new Error("Failed to fetch vehicle");
  return res.json();
}

export async function updateVin(id, vin) {
  const res = await fetch(`${API_BASE}/vehicles/${id}/vin`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vin }),
  });
  return res.json();
}

export async function updateStage(id, stage) {
  const res = await fetch(`${API_BASE}/vehicles/${id}/stage`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ stage }),
  });
  return res.json();
}
