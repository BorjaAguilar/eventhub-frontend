import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router'
import useAuth from '../hooks/useAuth.js'
import { getEventById, registerForEvent } from '../services/eventService.js'

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
    dateStyle: 'full',
    timeStyle: 'short',
  }).format(new Date(date))
}

function EventDetailPage() {
  const { eventId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [event, setEvent] = useState(null)
  const [status, setStatus] = useState({ loading: true, error: '' })
  const [registration, setRegistration] = useState({ loading: false, message: '', error: '' })

  useEffect(() => {
    let isActive = true

    async function loadEvent() {
      try {
        const loadedEvent = await getEventById(eventId)

        if (isActive) {
          setEvent(loadedEvent)
          setStatus({ loading: false, error: '' })
        }
      } catch (error) {
        if (isActive) setStatus({ loading: false, error: error.message })
      }
    }

    loadEvent()
    return () => {
      isActive = false
    }
  }, [eventId])

  async function handleRegistration() {
    if (!user) {
      navigate('/login', { state: { from: location.pathname } })
      return
    }

    const token = localStorage.getItem('eventhub_token')
    setRegistration({ loading: true, message: '', error: '' })

    try {
      const result = await registerForEvent(eventId, token)
      setEvent(result.data.event)
      setRegistration({ loading: false, message: result.message, error: '' })
    } catch (error) {
      setRegistration({ loading: false, message: '', error: error.message })
    }
  }

  if (status.loading) {
    return (
      <main className="page-section status-panel" aria-live="polite">
        <span className="loader" aria-hidden="true" />
        <p>Cargando evento…</p>
      </main>
    )
  }

  if (status.error) {
    return (
      <main className="page-section">
        <section className="status-panel status-panel--error" role="alert">
          <h1>No hemos podido cargar el evento</h1>
          <p>{status.error}</p>
          <Link className="primary-button" to="/eventos">
            Volver a eventos
          </Link>
        </section>
      </main>
    )
  }

  return (
    <main className="page-section event-detail">
      <Link className="back-link" to="/eventos">
        ← Volver a eventos
      </Link>

      <section className="event-detail__hero">
        <div className="event-detail__image">
          {event.imageUrl ? (
            <img src={event.imageUrl} alt="" />
          ) : (
            <span>{categoryLabels[event.category] || 'Evento'}</span>
          )}
        </div>

        <div className="event-detail__summary">
          <span className="event-card__category">
            {categoryLabels[event.category] || 'Otros'}
          </span>
          <h1>{event.title}</h1>
          <dl className="event-facts">
            <div>
              <dt>Fecha</dt>
              <dd>{formatDate(event.date)}</dd>
            </div>
            <div>
              <dt>Ubicación</dt>
              <dd>{event.location}</dd>
            </div>
            <div>
              <dt>Organiza</dt>
              <dd>{event.creator?.name || 'EventHub'}</dd>
            </div>
            <div>
              <dt>Disponibilidad</dt>
              <dd>
                {event.availableSpots} de {event.capacity} plazas libres
              </dd>
            </div>
          </dl>

          {registration.message && (
            <p className="form-message form-message--success" role="status">
              {registration.message}
            </p>
          )}
          {registration.error && (
            <p className="form-message form-message--error" role="alert">
              {registration.error}
            </p>
          )}

          <button
            className="primary-button"
            type="button"
            disabled={registration.loading || event.availableSpots === 0}
            onClick={handleRegistration}
          >
            {registration.loading
              ? 'Inscribiendo…'
              : event.availableSpots === 0
                ? 'Aforo completo'
                : user
                  ? 'Inscribirme en el evento'
                  : 'Inicia sesión para inscribirte'}
          </button>
        </div>
      </section>

      <section className="event-description">
        <span className="eyebrow">Sobre el evento</span>
        <h2>Descripción</h2>
        <p>{event.description}</p>
      </section>
    </main>
  )
}

export default EventDetailPage

