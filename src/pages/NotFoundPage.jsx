import { Link } from 'react-router'

function NotFoundPage() {
  return (
    <main className="not-found">
      <span className="eyebrow">Error 404</span>
      <h1>Página no encontrada</h1>
      <p>La dirección que has abierto no existe en EventHub.</p>
      <Link className="primary-button" to="/">
        Volver al inicio
      </Link>
    </main>
  )
}

export default NotFoundPage

