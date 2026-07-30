import { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { login } from '../services/authService.js'

function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      const data = await login(form)
      localStorage.setItem('eventhub_token', data.token)
      localStorage.setItem('eventhub_user', JSON.stringify(data.user))
      navigate('/eventos')
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">Bienvenido de nuevo</span>
        <h1>Iniciar sesión</h1>
        <p>Accede para consultar y gestionar tus inscripciones.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="login-email">Correo electrónico</label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">Contraseña</label>
            <input
              id="login-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>
          {error && (
            <p className="form-message form-message--error" role="alert">
              {error}
            </p>
          )}
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Accediendo…' : 'Iniciar sesión'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Todavía no tienes cuenta? <Link to="/registro">Regístrate</Link>
        </p>
      </section>
    </main>
  )
}

export default LoginPage

