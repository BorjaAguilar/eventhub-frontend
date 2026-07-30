import { useState } from 'react'
import { Link } from 'react-router'
import { register } from '../services/authService.js'

const initialForm = { name: '', email: '', password: '', confirmPassword: '' }

function RegisterPage() {
  const [form, setForm] = useState(initialForm)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setMessage({ type: '', text: '' })

    if (form.password !== form.confirmPassword) {
      setMessage({ type: 'error', text: 'Las contraseñas no coinciden' })
      return
    }

    setIsSubmitting(true)

    try {
      await register({ name: form.name, email: form.email, password: form.password })
      setForm(initialForm)
      setMessage({
        type: 'success',
        text: 'Cuenta creada correctamente. Ya puedes iniciar sesión.',
      })
    } catch (requestError) {
      setMessage({ type: 'error', text: requestError.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-card">
        <span className="eyebrow">Únete a EventHub</span>
        <h1>Crear cuenta</h1>
        <p>Regístrate para reservar plazas en tus eventos favoritos.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="register-name">Nombre completo</label>
            <input
              id="register-name"
              name="name"
              type="text"
              autoComplete="name"
              minLength="2"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="register-email">Correo electrónico</label>
            <input
              id="register-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="register-password">Contraseña</label>
            <input
              id="register-password"
              name="password"
              type="password"
              autoComplete="new-password"
              minLength="6"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>
          <div className="form-field">
            <label htmlFor="register-confirm-password">Repetir contraseña</label>
            <input
              id="register-confirm-password"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              minLength="6"
              required
              value={form.confirmPassword}
              onChange={handleChange}
            />
          </div>
          {message.text && (
            <p
              className={`form-message form-message--${message.type}`}
              role={message.type === 'error' ? 'alert' : 'status'}
            >
              {message.text}
            </p>
          )}
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Creando cuenta…' : 'Crear cuenta'}
          </button>
        </form>

        <p className="auth-switch">
          ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
        </p>
      </section>
    </main>
  )
}

export default RegisterPage

