import { API_URL } from '../config/api.js'

export async function getEvents({ category = '', limit = 9, page = 1, search = '' } = {}) {
  const query = new URLSearchParams({ page: String(page), limit: String(limit) })

  if (category) query.set('category', category)
  if (search.trim()) query.set('search', search.trim())

  let response

  try {
    response = await fetch(`${API_URL}/events?${query}`)
  } catch {
    throw new Error('No se ha podido conectar con el servidor')
  }

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || 'No se han podido cargar los eventos')
  }

  return result.data
}

async function parseResponse(response, fallbackMessage) {
  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.message || fallbackMessage)
  }

  return result
}

export async function getEventById(eventId) {
  let response

  try {
    response = await fetch(`${API_URL}/events/${eventId}`)
  } catch {
    throw new Error('No se ha podido conectar con el servidor')
  }

  const result = await parseResponse(response, 'No se ha podido cargar el evento')
  return result.data.event
}

export async function registerForEvent(eventId, token) {
  let response

  try {
    response = await fetch(`${API_URL}/events/${eventId}/registrations`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new Error('No se ha podido conectar con el servidor')
  }

  return parseResponse(response, 'No se ha podido completar la inscripción')
}

export async function getMyRegistrations(token) {
  let response

  try {
    response = await fetch(`${API_URL}/events/me/registrations`, {
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new Error('No se ha podido conectar con el servidor')
  }

  const result = await parseResponse(response, 'No se han podido cargar tus inscripciones')
  return result.data.events
}

export async function cancelEventRegistration(eventId, token) {
  let response

  try {
    response = await fetch(`${API_URL}/events/${eventId}/registrations`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
  } catch {
    throw new Error('No se ha podido conectar con el servidor')
  }

  return parseResponse(response, 'No se ha podido cancelar la inscripción')
}

async function sendAdminRequest(path, { body, method }, token) {
  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(body ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    })
  } catch {
    throw new Error('No se ha podido conectar con el servidor')
  }

  return parseResponse(response, 'No se ha podido completar la operación')
}

export function createEvent(eventData, token) {
  return sendAdminRequest('/events', { method: 'POST', body: eventData }, token)
}

export function updateEvent(eventId, eventData, token) {
  return sendAdminRequest(`/events/${eventId}`, { method: 'PUT', body: eventData }, token)
}

export function deleteEvent(eventId, token) {
  return sendAdminRequest(`/events/${eventId}`, { method: 'DELETE' }, token)
}
