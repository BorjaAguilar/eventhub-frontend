import { useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import useAuth from '../hooks/useAuth.js'
import { createEvent, deleteEvent, getEvents, updateEvent } from '../services/eventService.js'

const initialForm = {
  title: '',
  description: '',
  date: '',
  location: '',
  category: 'music',
  imageUrl: '',
  capacity: '',
}

const categories = [
  ['music', 'Música'],
  ['technology', 'Tecnología'],
  ['sports', 'Deporte'],
  ['culture', 'Cultura'],
  ['education', 'Educación'],
  ['other', 'Otros'],
]

const categoryLabels = Object.fromEntries(categories)

function toLocalDateTime(date) {
  const parsedDate = new Date(date)
  const offset = parsedDate.getTimezoneOffset() * 60_000
  return new Date(parsedDate.getTime() - offset).toISOString().slice(0, 16)
}

function AdminPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState('')
  const [confirmingDeleteId, setConfirmingDeleteId] = useState('')
  const [status, setStatus] = useState({ loading: true, saving: false, error: '', message: '' })

  useEffect(() => {
    let isActive = true

    async function loadEvents() {
      try {
        const data = await getEvents({ page: 1, limit: 50 })
        if (isActive) {
          setEvents(data.events)
          setStatus((current) => ({ ...current, loading: false }))
        }
      } catch (error) {
        if (isActive) {
          setStatus((current) => ({ ...current, loading: false, error: error.message }))
        }
      }
    }

    if (user?.role === 'admin') loadEvents()
    return () => { isActive = false }
  }, [user])

  if (!user) return <Navigate to="/login" replace state={{ from: '/admin' }} />
  if (user.role !== 'admin') return <Navigate to="/eventos" replace />

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function resetForm() {
    setEditingId('')
    setForm(initialForm)
  }

  function startEditing(event) {
    setEditingId(event._id)
    setForm({
      title: event.title,
      description: event.description,
      date: toLocalDateTime(event.date),
      location: event.location,
      category: event.category,
      imageUrl: event.imageUrl || '',
      capacity: String(event.capacity),
    })
    setStatus((current) => ({ ...current, error: '', message: '' }))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    const token = localStorage.getItem('eventhub_token')
    const eventData = {
      ...form,
      date: new Date(form.date).toISOString(),
      capacity: Number(form.capacity),
    }
    setStatus((current) => ({ ...current, saving: true, error: '', message: '' }))

    try {
      const result = editingId
        ? await updateEvent(editingId, eventData, token)
        : await createEvent(eventData, token)

      setEvents((currentEvents) => {
        const nextEvents = editingId
          ? currentEvents.map((item) => (item._id === editingId ? result.data.event : item))
          : [...currentEvents, result.data.event]
        return nextEvents.sort((first, second) => new Date(first.date) - new Date(second.date))
      })
      resetForm()
      setStatus((current) => ({ ...current, saving: false, message: result.message }))
    } catch (error) {
      setStatus((current) => ({ ...current, saving: false, error: error.message }))
    }
  }

  async function handleDelete(eventId) {
    const token = localStorage.getItem('eventhub_token')
    setStatus((current) => ({ ...current, saving: true, error: '', message: '' }))

    try {
      const result = await deleteEvent(eventId, token)
      setEvents((currentEvents) => currentEvents.filter((event) => event._id !== eventId))
      setConfirmingDeleteId('')
      setStatus((current) => ({ ...current, saving: false, message: result.message }))
    } catch (error) {
      setStatus((current) => ({ ...current, saving: false, error: error.message }))
    }
  }

  return (
    <main className="page-section admin-page">
      <header className="page-heading">
        <span className="eyebrow">Panel privado</span>
        <h1>Administración de eventos</h1>
        <p>Crea y gestiona el catálogo público de EventHub.</p>
      </header>

      <section className="admin-form-card">
        <div className="admin-section-heading">
          <div>
            <span className="eyebrow">{editingId ? 'Edición' : 'Nuevo evento'}</span>
            <h2>{editingId ? 'Editar evento' : 'Crear evento'}</h2>
          </div>
          {editingId && <button className="text-button" type="button" onClick={resetForm}>Cancelar edición</button>}
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-field admin-form__wide">
            <label htmlFor="admin-title">Título</label>
            <input id="admin-title" name="title" type="text" minLength="3" maxLength="100" required value={form.title} onChange={handleChange} />
          </div>
          <div className="form-field admin-form__wide">
            <label htmlFor="admin-description">Descripción</label>
            <textarea id="admin-description" name="description" minLength="10" maxLength="2000" rows="5" required value={form.description} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="admin-date">Fecha y hora</label>
            <input id="admin-date" name="date" type="datetime-local" min={toLocalDateTime(new Date())} required value={form.date} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="admin-location">Ubicación</label>
            <input id="admin-location" name="location" type="text" maxLength="150" required value={form.location} onChange={handleChange} />
          </div>
          <div className="form-field">
            <label htmlFor="admin-category">Categoría</label>
            <select id="admin-category" name="category" value={form.category} onChange={handleChange}>
              {categories.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
            </select>
          </div>
          <div className="form-field">
            <label htmlFor="admin-capacity">Aforo</label>
            <input id="admin-capacity" name="capacity" type="number" min="1" max="100000" required value={form.capacity} onChange={handleChange} />
          </div>
          <div className="form-field admin-form__wide">
            <label htmlFor="admin-image">URL de imagen (opcional)</label>
            <input id="admin-image" name="imageUrl" type="url" placeholder="https://ejemplo.com/imagen.jpg" value={form.imageUrl} onChange={handleChange} />
          </div>

          {status.error && <p className="form-message form-message--error admin-form__wide" role="alert">{status.error}</p>}
          {status.message && <p className="form-message form-message--success admin-form__wide" role="status">{status.message}</p>}
          <button className="primary-button admin-form__submit" disabled={status.saving} type="submit">
            {status.saving ? 'Guardando…' : editingId ? 'Guardar cambios' : 'Crear evento'}
          </button>
        </form>
      </section>

      <section className="admin-events">
        <div className="admin-section-heading">
          <div><span className="eyebrow">Catálogo</span><h2>Próximos eventos</h2></div>
          <span className="results-count">{events.length} eventos</span>
        </div>

        {status.loading ? (
          <div className="status-panel" aria-live="polite"><span className="loader" aria-hidden="true" /><p>Cargando eventos…</p></div>
        ) : (
          <div className="admin-event-list">
            {events.map((event) => (
              <article className="admin-event-item" key={event._id}>
                <div>
                  <span className="event-card__category">{categoryLabels[event.category] || 'Otros'}</span>
                  <h3>{event.title}</h3>
                  <p>{new Date(event.date).toLocaleString('es-ES')} · {event.location}</p>
                </div>
                <div className="admin-event-item__actions">
                  <button className="secondary-button" type="button" onClick={() => startEditing(event)}>Editar</button>
                  {confirmingDeleteId === event._id ? (
                    <div className="delete-confirmation">
                      <span>Esta acción no se puede deshacer</span>
                      <button className="danger-button" type="button" disabled={status.saving} onClick={() => handleDelete(event._id)}>Confirmar eliminación</button>
                      <button className="text-button" type="button" onClick={() => setConfirmingDeleteId('')}>Volver</button>
                    </div>
                  ) : (
                    <button className="danger-button" type="button" onClick={() => setConfirmingDeleteId(event._id)}>Eliminar</button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminPage
