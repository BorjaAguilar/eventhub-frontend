import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getEvents } from '../services/eventService.js'

const categories = [
  { value: '', label: 'Todas las categorías' },
  { value: 'music', label: 'Música' },
  { value: 'technology', label: 'Tecnología' },
  { value: 'sports', label: 'Deporte' },
  { value: 'culture', label: 'Cultura' },
  { value: 'education', label: 'Educación' },
  { value: 'other', label: 'Otros' },
]

const categoryLabels = Object.fromEntries(
  categories.filter((category) => category.value).map((category) => [category.value, category.label]),
)

function formatDate(date) {
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'long',
    timeStyle: 'short',
  }).format(new Date(date))
}

function EventsPage() {
  const [events, setEvents] = useState([])
  const [pagination, setPagination] = useState({ page: 1, total: 0, totalPages: 1 })
  const [filters, setFilters] = useState({ category: '', search: '' })
  const [appliedFilters, setAppliedFilters] = useState(filters)
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState({ loading: true, error: '' })

  useEffect(() => {
    const controller = new AbortController()

    async function loadEvents() {
      setStatus({ loading: true, error: '' })

      try {
        const data = await getEvents({ ...appliedFilters, page })

        if (!controller.signal.aborted) {
          setEvents(data.events)
          setPagination(data.pagination)
          setStatus({ loading: false, error: '' })
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          setStatus({ loading: false, error: error.message })
        }
      }
    }

    loadEvents()
    return () => controller.abort()
  }, [appliedFilters, page])

  function handleFilterChange(event) {
    setFilters({ ...filters, [event.target.name]: event.target.value })
  }

  function handleSubmit(event) {
    event.preventDefault()
    setPage(1)
    setAppliedFilters(filters)
  }

  return (
    <main className="page-section events-page">
      <header className="page-heading events-heading">
        <div>
          <span className="eyebrow">Encuentra tu próximo plan</span>
          <h1>Descubre eventos</h1>
          <p>Explora las próximas experiencias disponibles en EventHub.</p>
        </div>
        {!status.loading && !status.error && (
          <span className="results-count">{pagination.total} eventos</span>
        )}
      </header>

      <form className="event-filters" onSubmit={handleSubmit}>
        <div className="form-field event-search">
          <label htmlFor="event-search">Buscar</label>
          <input
            id="event-search"
            name="search"
            type="search"
            placeholder="Título, descripción o ciudad"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </div>
        <div className="form-field">
          <label htmlFor="event-category">Categoría</label>
          <select
            id="event-category"
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
          >
            {categories.map((category) => (
              <option key={category.value || 'all'} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
        <button className="primary-button filter-button" type="submit">
          Aplicar filtros
        </button>
      </form>

      {status.loading && (
        <section className="status-panel" aria-live="polite">
          <span className="loader" aria-hidden="true" />
          <p>Cargando eventos…</p>
        </section>
      )}

      {status.error && (
        <section className="status-panel status-panel--error" role="alert">
          <h2>No hemos podido cargar los eventos</h2>
          <p>{status.error}</p>
        </section>
      )}

      {!status.loading && !status.error && events.length === 0 && (
        <section className="empty-state">
          <h2>No hay eventos que coincidan</h2>
          <p>Prueba con otra búsqueda o selecciona una categoría diferente.</p>
        </section>
      )}

      {!status.loading && !status.error && events.length > 0 && (
        <>
          <section className="event-grid" aria-label="Listado de eventos">
            {events.map((event) => (
              <article className="event-card" key={event._id}>
                <div className="event-card__image">
                  {event.imageUrl ? (
                    <img src={event.imageUrl} alt="" />
                  ) : (
                    <span>{categoryLabels[event.category] || 'Evento'}</span>
                  )}
                </div>
                <div className="event-card__content">
                  <span className="event-card__category">
                    {categoryLabels[event.category] || 'Otros'}
                  </span>
                  <h2>
                    <Link to={`/eventos/${event._id}`}>{event.title}</Link>
                  </h2>
                  <p className="event-card__date">{formatDate(event.date)}</p>
                  <p className="event-card__location">{event.location}</p>
                  <div className="event-card__footer">
                    <span>
                      {event.availableSpots > 0
                        ? `${event.availableSpots} plazas disponibles`
                        : 'Aforo completo'}
                    </span>
                    <span>Por {event.creator?.name || 'EventHub'}</span>
                  </div>
                  <Link className="event-card__link" to={`/eventos/${event._id}`}>
                    Ver detalles
                  </Link>
                </div>
              </article>
            ))}
          </section>

          {pagination.totalPages > 1 && (
            <nav className="pagination" aria-label="Paginación de eventos">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
              >
                Anterior
              </button>
              <span>
                Página {pagination.page} de {pagination.totalPages}
              </span>
              <button
                type="button"
                disabled={page === pagination.totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
              >
                Siguiente
              </button>
            </nav>
          )}
        </>
      )}
    </main>
  )
}

export default EventsPage
