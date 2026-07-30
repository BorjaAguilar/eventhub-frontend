# EventHub Frontend

Interfaz web de EventHub, una plataforma para descubrir, reservar y gestionar
eventos. Está construida con React y Vite y consume la API REST pública del
proyecto.

## Funcionalidades

- Registro e inicio de sesión con JWT.
- Sesión persistente y cierre de sesión.
- Catálogo público con búsqueda, categorías y paginación.
- Detalle de cada evento y consulta de plazas disponibles.
- Inscripción y cancelación de reservas.
- Página privada con las inscripciones del usuario.
- Panel de administración para crear, editar y eliminar eventos.
- Interfaz adaptable para escritorio, tableta y móvil.

## Tecnologías

- React 19
- React Router
- Vite 7
- CSS moderno y diseño adaptable
- API Fetch del navegador
- ESLint

## Desarrollo local

Requisitos:

- Node.js 20.19 o superior
- npm

Instala las dependencias:

```bash
npm install
```

Inicia el servidor de desarrollo:

```bash
npm run dev
```

Vite mostrará la dirección local, normalmente `http://localhost:5173`.

En PowerShell puede ser necesario ejecutar los comandos mediante `npm.cmd`:

```powershell
npm.cmd install
npm.cmd run dev
```

## Variables de entorno

Copia `.env.example` como `.env` si necesitas utilizar otra dirección para la
API:

```text
VITE_API_URL=https://eventhub-backend-diw3.onrender.com/api
```

Las variables expuestas por Vite al navegador deben comenzar por `VITE_`. El
archivo `.env` no se sube al repositorio.

## Comandos disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el entorno local con recarga automática |
| `npm run lint` | Revisa la calidad del código |
| `npm run build` | Genera la versión de producción en `dist` |
| `npm run preview` | Previsualiza localmente la compilación |

## Rutas

| Ruta | Acceso | Descripción |
|---|---|---|
| `/` | Público | Portada de EventHub |
| `/eventos` | Público | Catálogo, búsqueda y filtros |
| `/eventos/:eventId` | Público | Detalle e inscripción |
| `/registro` | Público | Creación de usuario |
| `/login` | Público | Inicio de sesión |
| `/mis-inscripciones` | Usuario | Gestión de reservas |
| `/admin` | Administrador | Gestión completa de eventos |

## API

El frontend consume el backend desplegado en:

```text
https://eventhub-backend-diw3.onrender.com/api
```

Repositorio del backend:

```text
https://github.com/BorjaAguilar/eventhub-backend
```

## Despliegue

Configuración prevista para un sitio estático en Render:

| Campo | Valor |
|---|---|
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Variable | `VITE_API_URL=https://eventhub-backend-diw3.onrender.com/api` |

Para que las rutas de React funcionen al recargar una página, Render debe tener
una regla de reescritura desde `/*` hacia `/index.html`.

## Seguridad

- El token JWT solo se envía en las operaciones protegidas.
- Los controles visuales por rol no sustituyen la autorización del backend.
- La contraseña nunca se almacena en el frontend.
- Los secretos reales no forman parte del repositorio.

## Autor

Borja Aguilar
