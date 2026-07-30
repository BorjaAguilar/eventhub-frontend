const API_URL = import.meta.env.VITE_API_URL || 'https://eventhub-backend-diw3.onrender.com/api'

async function sendRequest(path, body) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('No se ha podido conectar con el servidor')
  }

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || 'Ha ocurrido un error inesperado')
  }

  return result.data
}

export function login(credentials) {
  return sendRequest('/auth/login', credentials)
}

export function register(userData) {
  return sendRequest('/auth/register', userData)
}

