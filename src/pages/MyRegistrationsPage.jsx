import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router'
import useAuth from '../hooks/useAuth.js'
import {
  cancelEventRegistration,
  getMyRegistrations,
} from '../services/eventService.js'

const categoryLabels = {
  music: 'Música',
  technology: 'Tecnología',
  sports: 'Deporte',
  culture: 'Cultura',
  education: 'Educación',
  other: 'Otros',
}

function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date))
}

function MyRegistrationsPage() {
  const { user } = useAuth()
  const [events, setEvents] = useState([])
  const [status, setStatus] = useState({ loading: true, error: '', message: '' })
  const [confirmingId, setConfirmingId] = useState('')
  const [cancellingId, setCancellingId] = useState('')

  useEffect(() => {
    let isActive = true

    async function loadRegistrations() {
      const token = localStorage.getItem('eventhub_token')

      try {
        const registeredEvents = await getMyRegistrations(token)

        if (isActive) {
          setEvents(registeredEvents)
          setStatus({ loading: false, error: '', message: '' })
        }
      } catch (error) {
        if (isActive) {
          setStatus({ loading: false, error: error.message, message: '' })
        }
      }
    }

    if (user) loadRegistrations()

    return () => {
      isActive = false
    }
  }, [user])

  if (!user) {
    return <Navigate to="/login" replace state={{ from: '/mis-inscripciones' }} />
  }

  async function handleCancel(eventId) {
    const token = localStorage.getItem('eventhub_token')
    setCancellingId(eventId)
    setStatus((current) => ({ ...current, error: '', message: '' }))

    try {
      const result = await cancelEventRegistration(eventId, token)
      setEvents((currentEvents) => currentEvents.filter((event) => event._id !== eventId))
      setStatus((current) => ({ ...current, message: result.message }))
      setConfirmingId('')
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }))
    } finally {
      setCancellingId('')
    }
  }

  return (
    <main className="page-section registrations-page">
      <header className="page-heading registrations-heading">
        <div>
          <span className="eyebrow">Tu agenda</span>
          <h1>Mis inscripciones</h1>
          <p>Consulta y gestiona los próximos eventos a los que asistirás.</p>
        </div>
        {!status.loading && <span className="results-count">{events.length} reservas</span>}
      </header>

      {status.message && (
        <p className="form-message form-message--success" role="status">
          {status.message}
        </p>
      )}

      {status.loading && (
        <section className="status-panel" aria-live="polite">
          <span className="loader" aria-hidden="true" />
          <p>Cargando tus inscripciones…</p>
        </section>
      )}

      {status.error && (
        <section className="status-panel status-panel--error" role="alert">
          <h2>No hemos podido completar la operación</h2>
          <p>{status.error}</p>
        </section>
      )}

      {!status.loading && events.length === 0 && (
        <section className="empty-state">
          <h2>Todavía no tienes inscripciones</h2>
          <p>Explora el catálogo y reserva una plaza en tu próximo evento.</p>
          <Link className="primary-button" to="/eventos">
            Descubrir eventos
          </Link>
        </section>
      )}

      {!status.loading && events.length > 0 && (
        <section className="registration-list" aria-label="Eventos reservados">
          {events.map((event) => (
            <article className="registration-item" key={event._id}>
              <div className="registration-item__date" aria-hidden="true">
                <span>{new Date(event.date).toLocaleDateString('es-ES', { month: 'short' })}</span>
                <strong>{new Date(event.date).getDate()}</strong>
              </div>
              <div className="registration-item__content">
                <span className="event-card__category">
                  {categoryLabels[event.category] || 'Otros'}
                </span>
                <h2>
                  <Link to={`/eventos/${event._id}`}>{event.title}</Link>
                </h2>
                <p>{formatDate(event.date)} · {event.location}</p>
              </div>
              <div className="registration-item__actions">
                {confirmingId === event._id ? (
                  <div className="cancel-confirmation">
                    <span>¿Confirmas la cancelación?</span>
                    <div>
                      <button
                        className="danger-button"
                        type="button"
                        disabled={cancellingId === event._id}
                        onClick={() => handleCancel(event._id)}
                      >
                        {cancellingId === event._id ? 'Cancelando…' : 'Sí, cancelar'}
                      </button>
                      <button
                        className="text-button"
                        type="button"
                        disabled={cancellingId === event._id}
                        onClick={() => setConfirmingId('')}
                      >
                        Volver
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => setConfirmingId(event._id)}
                  >
                    Cancelar inscripción
                  </button>
                )}
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  )
}

export default MyRegistrationsPage

