const API_BASE = "/api";

export async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    },
    ...options
  });

  if (!response.ok) {
    const message = `Request failed: ${response.status} ${response.statusText}`;
    throw new Error(message);
  }

  return response.json();
}
