const API_BASE = import.meta.env.VITE_API_URL || '';

let accessToken = localStorage.getItem('accessToken') || null;
let refreshPromise = null;

export function getAccessToken() {
  return accessToken;
}

export function setAccessToken(token) {
  accessToken = token;
  if (token) {
    localStorage.setItem('accessToken', token);
  } else {
    localStorage.removeItem('accessToken');
  }
}

async function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then(async (res) => {
        if (!res.ok) {
          setAccessToken(null);
          throw new Error('Sesión expirada');
        }
        const data = await res.json();
        setAccessToken(data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

export async function apiRequest(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  let response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (response.status === 401) {
    const body = await response.clone().json().catch(() => ({}));

    if (body.expired && accessToken) {
      try {
        await refreshAccessToken();
        headers.Authorization = `Bearer ${accessToken}`;
        response = await fetch(`${API_BASE}${path}`, {
          ...options,
          headers,
          credentials: 'include',
        });
      } catch {
        setAccessToken(null);
        throw new Error('Sesión expirada');
      }
    }
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'Error en la petición');
  }

  return data;
}

export const authApi = {
  register: (payload) =>
    apiRequest('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  login: async (payload) => {
    const data = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    setAccessToken(data.accessToken);
    return data;
  },

  logout: async () => {
    try {
      await apiRequest('/api/auth/logout', { method: 'POST' });
    } finally {
      setAccessToken(null);
    }
  },

  getMe: () => apiRequest('/api/auth/me'),
};

export const transaccionApi = {
  list: (params = {}) => {
    const query = new URLSearchParams(
      Object.entries(params).filter(([, v]) => v !== '' && v != null)
    ).toString();
    return apiRequest(`/api/transaccion${query ? `?${query}` : ''}`);
  },

  stats: () => apiRequest('/api/transaccion/stats'),

  create: (payload) =>
    apiRequest('/api/transaccion', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/api/transaccion/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    apiRequest(`/api/transaccion/${id}`, {
      method: 'DELETE',
    }),
};

export const categoriasApi = {
  list: () => apiRequest("/api/categorias"),

  create: (payload) =>
    apiRequest("/api/categorias", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  update: (id, payload) =>
    apiRequest(`/api/categorias/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    }),

  remove: (id) =>
    apiRequest(`/api/categorias/${id}`, {
      method: "DELETE",
    }),
};

export const usuariosApi = {
  list: () => apiRequest('/api/usuarios'),

  update: (id, payload) =>
    apiRequest(`/api/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  getSessions: (userId) => apiRequest(`/api/usuarios/${userId}/sessions`),

  getAllSessions: () => apiRequest('/api/usuarios/sessions'),

  revokeSession: (sessionId) =>
    apiRequest(`/api/usuarios/sessions/${sessionId}`, {
      method: 'DELETE',
    }),

    
};
