const API_URL = import.meta.env.VITE_API_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'Không thể kết nối đến máy chủ.');
  return data;
}

export const todoApi = {
  getAll: () => request('/todos'),
  create: (title, dueDate) =>
    request('/todos', {
      method: 'POST',
      body: JSON.stringify({
        title,
        due_date: dueDate || null,
      }),
    }),
  update: (id, values) => request(`/todos/${id}`, { method: 'PUT', body: JSON.stringify(values) }),
  remove: (id) => request(`/todos/${id}`, { method: 'DELETE' }),
};
