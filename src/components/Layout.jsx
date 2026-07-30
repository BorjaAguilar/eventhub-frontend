import { NavLink, Outlet } from 'react-router'

function Layout() {
  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink className="brand" to="/">
          EventHub
        </NavLink>
        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink to="/eventos">Eventos</NavLink>
          <NavLink to="/login">Iniciar sesión</NavLink>
          <NavLink className="nav-cta" to="/registro">
            Crear cuenta
          </NavLink>
        </nav>
      </header>
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout

