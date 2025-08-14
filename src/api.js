// src/api.js
const API_BASE = import.meta.env.VITE_BACKEND_URL;

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/api/users/`);
  return res.json();
}
