# Sucursal Virtual

Aplicación web de administración de agendamientos para sucursales de puerto, construida con React 19 y Vite.

## 📌 Descripción

Esta aplicación permite a operadores y personal de sucursal:

- Iniciar sesión o registrarse como usuario.
- Consultar agendamientos por patente rápidamente.
- Buscar información completa de un agendamiento y su contenedor.
- Filtrar agendamientos por estado.
- Crear nuevos agendamientos.
- Cancelar agendamientos existentes.
- Buscar agendamientos por RUT de chofer.
- Ver camiones activos agendados para el día actual.

## 🚀 Tecnologías

- React 19
- Vite
- navium-ui-lib
- lucide-react
- ESLint

## 📁 Estructura relevante

- `src/App.jsx` - Punto de entrada de la aplicación.
- `src/main.jsx` - Renderiza el componente raíz.
- `src/pages/Sucursal/Sucursal.jsx` - Lógica principal de UI y funcionalidades.
- `src/services/agendamientoService.js` - Clientes HTTP para BFF y autenticación.

## ⚙️ Requisitos

- Node.js 18 o superior
- npm

## 📦 Instalación

```bash
cd sucursal-virtual
npm install
```

## 🧪 Uso en desarrollo

```bash
npm run dev
```

Abre la URL indicada por Vite, normalmente `http://localhost:5173`.

## 📦 Build de producción

```bash
npm run build
```

## 📡 Vista previa de producción

```bash
npm run preview
```

## 🔧 Consideraciones importantes

- La aplicación consume un backend a través de `/api/bff`.
- El servicio de autenticación utiliza `AUTH_URL` en `src/services/agendamientoService.js`.
- Actualmente `AUTH_URL` está vacío y debe configurarse con la URL del servicio de autenticación.
- Asegúrate de tener el backend/BFF funcionando y disponible para que las rutas de agendamiento y login funcionen correctamente.

## 📝 Notas de implementación

- El usuario inicia sesión y recibe un token JWT que se usa en las llamadas protegidas.
- La UI incluye pestañas para:
  - `Hoy`
  - `Consulta Rápida`
  - `Consulta Completa`
  - `Por Estado`
  - `Por RUT Chofer`
  - `Nuevo Agendamiento`
  - `Cancelar Agendamiento`

## 💡 Sugerencias de mejora

- Agregar un archivo `.env` para configurar `AUTH_URL` y `API_URL`.
- Almacenar token en `localStorage` o `sessionStorage` para mantener la sesión.
- Añadir manejo de errores más detallado en el frontend.
- Incluir pruebas unitarias y de integración.
