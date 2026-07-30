import { API_URL } from '../config/api.js'

export async function getEvents({ category = '', page = 1, search = '' } = {}) {
  const query = new URLSearchParams({ page: String(page), limit: '9' })

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

