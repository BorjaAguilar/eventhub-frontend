import { Link } from 'react-router'

function HomePage() {
  return (
    <main className="welcome">
      <section className="welcome__content">
        <span className="eyebrow">Plataforma de gestión de eventos</span>
        <h1>EventHub</h1>
        <p>
          Descubre nuevos planes, reserva tu plaza y gestiona todos tus eventos
          desde un único lugar.
        </p>
        <Link className="primary-button" to="/eventos">
          Explorar eventos
        </Link>
      </section>
    </main>
  )
}

export default HomePage

