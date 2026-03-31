# Login con Google

Hay **dos formas** de usar el proyecto:

1. **Node.js + Express** (local o cualquier hosting con servidor): OAuth con Passport y sesión en servidor.
2. **Sitio estático en `docs/`** para **GitHub Pages**: login con [Google Identity Services](https://developers.google.com/identity/gsi/web) en el navegador (solo hace falta el **ID de cliente** público; no uses el `client_secret` en el frontend).

## Tecnologías

- [Express](https://expressjs.com/) 5
- [Passport](http://www.passportjs.org/) con estrategia [passport-google-oauth20](https://github.com/jaredhanson/passport-google-oauth2)
- [express-session](https://github.com/expressjs/session) para sesiones
- [EJS](https://ejs.co/) como motor de vistas
- [dotenv](https://github.com/motdotla/dotenv) para variables de entorno

## Requisitos

- Node.js (recomendado: LTS actual)
- Una cuenta de Google Cloud con un proyecto y credenciales OAuth 2.0

## Configuración en Google Cloud Console

1. Crea un proyecto (o usa uno existente) en [Google Cloud Console](https://console.cloud.google.com/).
2. Habilita la **Google+ API** / **People API** si tu flujo lo requiere (OAuth de usuario suele funcionar con pantalla de consentimiento configurada).
3. En **APIs y servicios** → **Credenciales**, crea un ID de cliente **OAuth 2.0** tipo **Aplicación web**.
4. **Orígenes JavaScript autorizados** (necesario para la versión estática / GitHub Pages):
   - `https://TU_USUARIO.github.io` (sitio de proyecto en GitHub Pages)
   - Para probar el sitio estático en local con un servidor HTTP: `http://localhost:PUERTO` (por ejemplo el que use `npx serve docs`).
5. En **URIs de redireccionamiento autorizados**, para la app **Express** añade por ejemplo:
   - `http://localhost:3000/auth/google/callback`
   - `https://tu-dominio.com/auth/google/callback`
6. Copia el **ID de cliente** y el **secreto de cliente** (el secreto solo sirve para la app Node; no lo subas al repo ni lo pongas en `docs/`).

## Instalación

```bash
git clone <url-de-tu-repo>
cd Login-con-Google
npm install
```

## Variables de entorno

Crea un archivo `.env` en la raíz del proyecto (no lo subas a Git; ya está en `.gitignore`):

```env
GOOGLE_CLIENT_ID=tu_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=tu_client_secret
PORT=3000
```

Puedes partir de `.env.example` renombrándolo o copiándolo.

## Ejecución

```bash
npm start
```

Equivalente a `node server.js`.

Abre [http://localhost:3000](http://localhost:3000) (o el puerto definido en `PORT`).

## GitHub Pages (versión estática en `docs/`)

GitHub Pages **no ejecuta Node**; usa la carpeta `docs/` con HTML/JS.

1. En el repositorio: **Settings → Pages → Build and deployment → Source**: rama `main` (o la que uses) y carpeta **`/docs`**.
2. Edita `docs/config.js` y pon tu `GOOGLE_CLIENT_ID` (el mismo ID de cliente OAuth; sin `client_secret`).
3. En Google Cloud, en **Orígenes JavaScript autorizados**, incluye `https://TU_USUARIO.github.io` (y la URL exacta si usas dominio personalizado).
4. Haz push. La app quedará en `https://TU_USUARIO.github.io/NOMBRE_DEL_REPO/`.

La sesión en el navegador usa `sessionStorage` (solo demostración). El JWT no se verifica en un servidor; para producción con datos sensibles conviene un backend que valide el token.

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio: enlace para iniciar sesión con Google o acceso al perfil si ya hay sesión |
| `/auth/google` | Redirige al flujo OAuth de Google |
| `/auth/google/callback` | Callback de Google; redirige al perfil si el login es correcto |
| `/profile` | Perfil del usuario (requiere sesión) |
| `/logout` | Cierra sesión y vuelve al inicio |

## Notas de seguridad (producción)

- En **Express**, define `SESSION_SECRET` en producción y no uses el valor por defecto de desarrollo.
- No subas **`GOOGLE_CLIENT_SECRET`** ni `.env` al repositorio.
- La versión **GitHub Pages** solo debe incluir el **client ID** público en `docs/config.js`, nunca el secreto.

## Licencia

ISC (según `package.json`).
