import { NavLink, Outlet, useNavigate } from 'react-router'
import useAuth from '../hooks/useAuth.js'

function Layout() {
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <NavLink className="brand" to="/">
          EventHub
        </NavLink>
        <nav className="main-nav" aria-label="Navegación principal">
          <NavLink to="/eventos">Eventos</NavLink>
          {user ? (
            <div className="user-nav">
              {user.role === 'admin' && <NavLink to="/admin">Administración</NavLink>}
              <NavLink to="/mis-inscripciones">Mis inscripciones</NavLink>
              <span className="user-nav__name">Hola, {user.name}</span>
              <button className="logout-button" type="button" onClick={handleLogout}>
                Cerrar sesión
              </button>
            </div>
          ) : (
            <>
              <NavLink to="/login">Iniciar sesión</NavLink>
              <NavLink className="nav-cta" to="/registro">
                Crear cuenta
              </NavLink>
            </>
          )}
        </nav>
      </header>
      <div className="page-content">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout
