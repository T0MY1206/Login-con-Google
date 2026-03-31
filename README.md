# Login con Google

Aplicación web mínima en **Node.js** que permite iniciar sesión con **Google** mediante **OAuth 2.0**, mantener la sesión del usuario y mostrar una página de perfil con nombre, correo y foto.

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
4. En **URIs de redireccionamiento autorizados**, añade la URL de callback de tu app, por ejemplo:
   - Desarrollo: `http://localhost:3000/auth/google/callback`
   - Producción: `https://tu-dominio.com/auth/google/callback`
5. Copia el **ID de cliente** y el **secreto de cliente** (no los subas al repositorio).

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

## Rutas principales

| Ruta | Descripción |
|------|-------------|
| `/` | Inicio: enlace para iniciar sesión con Google o acceso al perfil si ya hay sesión |
| `/auth/google` | Redirige al flujo OAuth de Google |
| `/auth/google/callback` | Callback de Google; redirige al perfil si el login es correcto |
| `/profile` | Perfil del usuario (requiere sesión) |
| `/logout` | Cierra sesión y vuelve al inicio |

## Notas de seguridad (producción)

- El **secreto de sesión** está fijado en código (`secret: 'secretkey'`). En producción debería ser una cadena larga y aleatoria definida por variable de entorno.
- No incluyas **IDs ni secretos reales** en el repositorio ni en ejemplos públicos.
- Configura `cookie` de sesión con `secure: true` y `sameSite` adecuados cuando uses HTTPS.

## Licencia

ISC (según `package.json`).
