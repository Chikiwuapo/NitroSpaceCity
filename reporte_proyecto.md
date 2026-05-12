# 📊 Reporte Detallado — NitroSpace Frontend

> **Proyecto:** NitroSpace / AutoValor — Dashboard Administrativo de Concesionaria de Vehículos  
> **Stack:** React 19 + Vite 8 + TailwindCSS 3 + React Router 7  
> **Backend:** Railway (`https://faithful-healing-production-9e06.up.railway.app`)  
> **Deploy:** Vercel (con rewrite SPA configurado)

---

## 🗂️ Estructura General del Proyecto

```
NitroSpace-Frontend/
├── index.html                  # Punto de entrada HTML
├── vite.config.js              # Config Vite mínima
├── tailwind.config.js          # Tema Tailwind personalizado
├── postcss.config.js           # PostCSS para Tailwind
├── eslint.config.js            # ESLint para React
├── vercel.json                 # SPA rewrite para Vercel
├── package.json                # Dependencias del proyecto
├── public/
│   ├── favicon.svg             # Ícono SVG del sitio
│   └── icons.svg               # Sprite de íconos SVG
└── src/
    ├── main.jsx                # Montaje React
    ├── App.jsx                 # Router raíz
    ├── assets/                 # Imágenes estáticas
    ├── styles/                 # CSS global y App.css
    ├── app/                    # Routing + guards
    ├── layouts/                # Layout del dashboard
    ├── shared/                 # Componentes reutilizables
    └── features/               # Módulos por dominio
        ├── login/
        ├── inicio/
        ├── clientes/
        ├── ventas/
        ├── compras/
        ├── inventario/
        ├── usuarios/
        ├── notificaciones/
        └── reportes/
```

---

## 📦 Dependencias (`package.json`)

| Paquete | Versión | Uso |
|---|---|---|
| `react` | ^19.2.5 | Framework UI principal |
| `react-dom` | ^19.2.5 | Renderizado DOM |
| `react-router-dom` | ^7.5.3 | Enrutamiento SPA |
| `recharts` | ^3.8.1 | Gráficas en reportes |
| `rechart` | ^0.0.1 | ⚠️ Paquete duplicado/fantasma (no usado) |
| `lucide-react` | ^0.460.0 | Íconos SVG |
| `animejs` | ^4.4.1 | Animación SVG en LoadingAnimation |
| `cors` | ^2.8.6 | ⚠️ Paquete de backend instalado en frontend (inútil) |
| `tailwindcss` | ^3.4.15 | CSS utilitario |
| `vite` | ^8.0.10 | Build tool |

> [!WARNING]
> - `rechart` (sin 's') es un paquete npm vacío/fantasma — puede eliminarse.
> - `cors` es un paquete de Node.js/backend, no tiene utilidad en un frontend browser — puede eliminarse.

---

## ⚙️ Configuración

### `vite.config.js`
Configuración **mínima**: solo el plugin de React. Sin alias, sin proxy configurado. Las llamadas al backend van directo a Railway (sin proxy local).

### `tailwind.config.js`
Extiende el tema con:
- Color personalizado `sidebar-green: '#0a332a'` (verde oscuro corporativo)
- Border radius `3xl: 32px`
- Fuente `Inter` como fuente sans principal

### `vercel.json`
Rewrite universal `/*` → `/index.html` para que React Router funcione en producción (correcto).

### `index.html`
- `lang="es"` ✅
- Título: `"AutoValor - Dashboard Administrativo"` — **inconsistente con el nombre NitroSpace** del sidebar
- Importa fuente Inter desde Google Fonts ✅

---

## 🚀 Punto de Entrada (`main.jsx` → `App.jsx`)

### `main.jsx`
Monta la app en `<StrictMode>` e importa `globals.css`.

### `App.jsx` — Router Raíz

**Flujo de autenticación:**
```
/ → token? → /dashboard : /login
/login → <LoginPage>
/* → <PrivateRoute> → <RoleRoute> → <DashboardLayout> → <AppRoutes>
```

> [!WARNING]
> **Bug de seguridad:** El token se lee directamente de `localStorage` dentro del componente `App` (`const token = localStorage.getItem('token')`), pero esto se evalúa **una sola vez al montar**, no reactivamente. Si el token expira o se elimina sin recargar, la redirección no se dispara. La lógica de sesión está duplicada entre `App.jsx` y `PrivateRoute.jsx`.

---

## 🔐 Autenticación (`/features/login/`)

### `roles.js`
Define 3 roles y sus rutas permitidas:

| Rol | Rutas permitidas |
|---|---|
| **Administrador** | Todas (10 rutas) |
| **Empleado** | `/dashboard`, `/clientes`, `/usuarios`, `/reportes`, `/ventas` |
| **Mecánico** | `/dashboard`, `/mantenimiento` |

### `authService.js`
Servicio con 4 operaciones:
- `login(credentials)` → POST `/api/user/login`
- `forgotPassword(email)` → POST `/api/user/forgot-password`
- `verifyCode(email, code)` → POST `/api/user/verify-code`
- `resetPassword(newPassword, code)` → POST `/api/user/reset-password`

Cada método hace validación del `Content-Type` de respuesta antes de parsear JSON (protección contra respuestas HTML de Railway). ✅

### `LoginPage.jsx`
- Diseño split: lado blanco con ilustración + lado verde oscuro con formulario
- Usa `authService.login()`, guarda `token` y `user` en `localStorage`
- Mapea `id_rol` a nombre de rol usando `ROLES`
- Detecta token existente al montar y redirige a `/dashboard` si ya está autenticado ✅
- **Issue:** Labels del formulario dicen "Username" y "Password" en inglés mientras el resto de la UI está en español

### `useForgotPassword.js`
Hook con flujo de 3 pasos completo:
1. Ingresar email → enviar código
2. Verificar código de 6 dígitos
3. Nueva contraseña + confirmación

Incluye validaciones de email (regex), código (6 dígitos numéricos), contraseña (min 8 chars), y comparación de contraseñas.

> [!NOTE]
> Bug menor en `ForgotPasswordModal.jsx` línea 229: `!newPassword.length >= 8` siempre evalúa `false` (la negación tiene precedencia sobre la comparación). Debería ser `newPassword.length < 8`.

### `PrivateRoute.jsx`
Guard simple: verifica que `localStorage.getItem('token')` no sea nulo, `'undefined'` o `'null'`. Redirige a `/login` si no hay token válido.

### `RoleRoute.jsx`
Redirige al dashboard si el usuario no tiene permiso para la ruta actual según `PERMISSIONS[user.role]`.

---

## 🗺️ Routing (`/app/`)

### `routes.jsx`
- Todas las páginas se cargan con **`React.lazy()`** + `<Suspense>` → code splitting automático ✅
- Fallback de carga: texto plano "Cargando..." (sin animación)
- 2 rutas usan `<PlaceholderPage>`: `/financiamiento` y `/mantenimiento` (sin implementar)

---

## 🏗️ Layout (`/layouts/`)

### `DashboardLayout.jsx`
Layout fijo: Sidebar izquierdo (272px) + área principal con Navbar arriba y contenido abajo.

### `Sidebar.jsx`
- Muestra solo las rutas permitidas según el rol del usuario
- Usa `NavLink` de React Router con estilos activos/inactivos
- Botón de logout: limpia `localStorage` y navega a `/login`
- User card al fondo: nombre y correo del usuario logueado

> [!NOTE]
> **Problema de indentación/estructura JSX** en `Sidebar.jsx`: el cierre de `</aside>` está indentado incorrectamente (dentro de un `<div>` extra de User Card), lo que genera HTML semánticamente incorrecto. El código funciona por la tolerancia del navegador pero es un bug estructural.

### `DashboardNavbar.jsx`
- Solo contiene el **panel de notificaciones** (campana en top-right)
- Usa `useNotificationSystem()` para leer notificaciones de `localStorage`
- Dropdown glassmorphism con lista scrollable, marca como leída al hacer clic
- Acciones: marcar todas leídas, limpiar todo

---

## 📄 Páginas y Módulos por Feature

---

### 🏠 `inicio/` — Dashboard

#### `Dashboard.jsx`
Dashboard con **datos 100% hardcodeados** (mock):
- 3 StatCards: Ventas Totales ($967,570), Clientes Nuevos (35), Inventario (75.5%)
- Widget de Nivel de Inventario con SVG semicircular
- Widget de Composición de Ventas (Autos Nuevos/Usados/Servicios)
- Widget Distribución por Región (Lima, Arequipa, Cusco, Trujillo, Piura, Chiclayo)
- Widget Índice de Satisfacción del Cliente (92.5)
- Tarjeta "Únete a nuestra comunidad"

> [!WARNING]
> El Dashboard **no consume ningún endpoint real**. Todos los datos son estáticos. El botón "Agregar Widget" no tiene funcionalidad.

---

### 👥 `clientes/` — Gestión de Clientes

#### `clientesApi.js`
CRUD completo contra `/api/client/`:
- `getClientes()` → GET `/getAll` — mapea y normaliza campos
- `createCliente(cliente)` → POST `/register`
- `updateCliente(id, cliente)` → PUT `/update/:id`
- `deleteCliente(id)` → DELETE `/delete/:id`

#### `useClientes.js`
Hook simple: estado `clientes`, `loading`, `error` + `fetchClientes()` con `useEffect` al montar. Expone `refetch`.

#### Componentes
- **`ClientesList.jsx`** (11KB): Vista principal de tabla de clientes con búsqueda, paginación, botones de editar/eliminar
- **`ClienteForm.jsx`** (9.7KB): Formulario modal para crear/editar cliente con campos: nombres, apellidos, DNI, teléfono, correo, dirección, imagen
- **`ClientesFiltro.jsx`**: Barra de filtrado por texto
- **`CustomerRow.jsx`**: Fila individual de cliente en tabla
- **`ConfirmModal.jsx`**: Modal de confirmación para eliminar cliente

---

### 🛒 `compras/` — Gestión de Compras

#### `comprasApi.js`
- `getPurchases()` → GET `/api/buy/getAll` — mapeo detallado de vehiculo, proveedor, estados
- `registerPurchase(data)` → POST `/api/purchase/register`

> [!CAUTION]
> **Bug crítico de inconsistencia de URL:** `getPurchases` usa `/api/buy/getAll` pero `registerPurchase` usa `/api/purchase/register`. Si el backend no tiene ese endpoint alternativo, el registro de compras fallará con 404. Hay un comentario en el código que lo reconoce: _"ÚLTIMA ALTERNATIVA LÓGICA"_, lo que indica que se probaron múltiples URLs sin confirmación.

- `updatePurchase(id, data)` → PUT `/api/buy/update/:id`

#### `providerService.js`
CRUD de proveedores contra `/api/provider/`:
- `getProviders()`, `createProvider()`, `updateProvider()`

#### `useProviders.js` / `usePurchases.js`
Hooks estándar de fetching con estado loading/error.

#### Componentes
- **`ComprasList.jsx`**: Página principal con tabs (Órdenes, Proveedores, Recepciones)
- **`OrdersTab.jsx`**: Lista de órdenes de compra
- **`OrderModal.jsx`** (14KB): Formulario para crear orden de compra
- **`OrderDetailModal.jsx`**: Vista detalle de una orden
- **`ProvidersTab.jsx`**: Lista de proveedores
- **`ProviderModal.jsx`** (9.2KB): Formulario crear/editar proveedor
- **`ReceptionsTab.jsx`**: Lista de recepciones de mercancía
- **`ReceptionModal.jsx`**: Formulario de recepción
- **`StatsWidgets.jsx`**: KPIs pequeños del módulo

---

### 📦 `inventario/` — Inventario de Vehículos

#### `inventarioService.js`
- `getInventario()` → GET `/api/vehicles` — mapeo muy completo con fallbacks para todos los campos
- `createVehiculo(data)` → POST `/api/vehicles`
- `updateVehiculo(id, data)` → PUT `/api/vehicles/:id`

> [!NOTE]
> No hay endpoint de **delete vehiculo** implementado.

#### `useInventario.js`
- Fetching con filtrado reactivo (búsqueda, marca, tipo, estado, transmisión, rango de precio)
- **Integra sistema de notificaciones**: genera alertas automáticas de stock bajo (< 5) o sin stock (= 0) al cargar datos

> [!WARNING]
> **Bug de doble fetch:** `useInventario.js` tiene **dos** bloques `useEffect` que llaman a la API — uno usando `useCallback` (con notificaciones de stock) y otro inline (sin notificaciones). El inventario se carga **dos veces** al montar el componente.

- KPIs calculados: total vehículos, disponibles, vendidos, valor total

#### `useVehiculoForm.js`
- Formulario controlado para crear/editar vehículo
- Validaciones: URL imagen debe empezar con `http`, color obligatorio, precio > 0, transmisión y combustible en lista permitida
- Llama directamente a `fetch()` sin usar `inventarioService` (**duplicación de lógica de API**)

#### `mockInventario.js`
10 vehículos de prueba (Toyota, Ford, Chevrolet, Nissan, Hyundai). **No se usa en ningún componente actual** — archivo obsoleto.

#### Componentes
- **`InventarioPage.jsx`** (6.3KB): Página principal con KPIs, filtros, tabla y modal de formulario
- **`InventarioTable.jsx`** (7KB): Tabla de vehículos con imagen, datos y acciones
- **`InventarioForm.jsx`** (11.2KB): Formulario modal crear/editar vehículo
- **`InventarioFilters.jsx`** (6.4KB): Panel de filtros expandible
- **`KPISection.jsx`**: Tarjetas de métricas (total, disponibles, vendidos, valor)

---

### 💰 `ventas/` — Gestión de Ventas

#### `ventasApi.js`
- `getSales()` → GET `/api/sale/getAll` — mapeo muy robusto con múltiples fallbacks para nombre de cliente
- `getSaleById(id)` → GET `/api/sale/getById/:id`
- `createVenta(venta)` → POST `/api/sale/register`
- `updateVenta(id, venta)` → PUT `/api/sale/update/:id`

#### Componentes
- **`VentasList.jsx`** (17.5KB): El componente más grande del proyecto. Lista de ventas con búsqueda, filtros, modales de detalle, edición y registro de nueva venta
- **`RegistroVenta.jsx`** (19KB): El componente más grande. Formulario complejo de nueva venta (cliente, vehículos, comprobante, totales)
- **`EditarVenta.jsx`** (16.4KB): Formulario de edición de venta existente
- **`AgregarCarro.jsx`**: Selector/buscador de vehículos para agregar a una venta
- **`ClienteSelector.jsx`**: Selector de cliente con búsqueda

---

### 👤 `usuarios/` — Gestión de Usuarios

#### `usuariosApi.js`
- `getUsers()` → GET `/api/user/getAll` — mapea roles e IDs
- `registerUser(userData)` → POST `/api/user/register`
- `fetchDniData(dni)` → GET a API externa RENIEC (`api.decolecta.com`)

> [!CAUTION]
> **Token de API RENIEC hardcodeado en el código fuente** (línea 3): `sk_11607.v8AuHbEp1AxHXqNCwewVivIdmG2b82m8`. Esto es un riesgo de seguridad — cualquiera que vea el código fuente del bundle puede usar ese token.

> [!NOTE]
> No hay endpoint de **update ni delete usuario** implementado en el frontend.

#### Componentes
- **`UsuariosList.jsx`** (7.3KB): Lista de usuarios con foto, nombre, DNI, rol y estado
- **`RegistrarUsuario.jsx`** (8KB): Formulario de registro de nuevo usuario con consulta automática a RENIEC por DNI

---

### 🔔 `notificaciones/` — Sistema de Notificaciones

#### `notificacionesService.js`
Sistema de pub/sub en memoria (módulo singleton):
- `agregarNotificacion()`, `suscribirse()`, `marcarTodasLeidas()`, `obtenerNotificaciones()`

> [!WARNING]
> Este servicio **no se usa** en el código actual. El sistema activo es `useNotificationSystem.js`.

#### `useNotificationSystem.js`
Sistema de notificaciones basado en **`localStorage`**:
- Persiste notificaciones entre recargas
- Usa `CustomEvent('app:notification')` para sync en la misma ventana
- Escucha `storage` event para sync entre pestañas
- API: `pushAlert(title, message, type)`, `markAsRead(id)`, `markAllAsRead()`, `clearAll()`

Los tipos de notificación son: `'success'`, `'warning'`, `'error'`.

#### Componentes
- **`NotificacionesPage.jsx`**: Página dedicada de notificaciones con lista y filtros
- **`NotificationItem.jsx`**: Item individual de notificación
- **`NotificationFilters.jsx`**: Filtros por tipo de notificación
- **`NotificationSummary.jsx`**: Resumen/contador de notificaciones
- **`NotificationToast.jsx`**: Toast de notificación emergente

---

### 📈 `reportes/` — Dashboard de Reportes

#### `reportesService.js`
**100% datos mock** (simulación con `setTimeout` de 1 segundo):
- 6 KPIs: Ventas, Vehículos Vendidos, Nuevos Clientes, Margen, Cotizaciones, Tasa de Conversión
- Ventas mensuales (12 meses)
- Actividad de usuarios (12 meses)
- Métodos de pago (4 categorías)
- Estado de entregas (3 estados)
- Inventario por tipo de vehículo
- Top 5 vendedores

> [!WARNING]
> El módulo de reportes **no consume datos reales del backend**. Todos los valores son ficticios.

#### Componentes
- **`ReportesDashboard.jsx`**: Página orquestadora
- **`KPIGrid.jsx`**: Grid de 6 tarjetas KPI
- **`MainAnalytics.jsx`**: Gráficas principales (usa Recharts)
- **`DistributionCharts.jsx`**: Gráficas de distribución (pie charts)
- **`ReportSlider.jsx`** (6.4KB): Slider/carrusel de reportes

---

## 🧩 Componentes Compartidos (`/shared/components/`)

| Componente | Descripción |
|---|---|
| `StatCard.jsx` | Tarjeta de estadística con mini-gráfica de barras y trend |
| `Modal.jsx` | Modal reutilizable con tamaños sm/md/lg/xl, título, footer |
| `LoadingAnimation.jsx` | Animación SVG de auto en curva usando Anime.js |
| `PlaceholderPage.jsx` | Página "en construcción" para rutas no implementadas |

---

## 🎨 Estilos

### `globals.css`
- Importa Tailwind base/components/utilities
- Define `.custom-scrollbar` (scrollbar delgado semitransparente)
- Define `.input` como clase utilitaria Tailwind

### `App.css`
**Archivo obsoleto** — contiene estilos del template inicial de Vite (`.counter`, `.hero`, `#center`, `#next-steps`, etc.). **No se usa en ningún componente del proyecto.** Puede eliminarse.

### `tailwind.config.js`
- Fuente Inter como familia sans principal
- Color `sidebar-green` para el sidebar
- `border-radius 3xl` para bordes redondeados premium

---

## 🔗 Backend API — Resumen de Endpoints

**Base URL:** `https://faithful-healing-production-9e06.up.railway.app`

| Módulo | Endpoint | Método | Estado |
|---|---|---|---|
| Auth | `/api/user/login` | POST | ✅ Implementado |
| Auth | `/api/user/forgot-password` | POST | ✅ Implementado |
| Auth | `/api/user/verify-code` | POST | ✅ Implementado |
| Auth | `/api/user/reset-password` | POST | ✅ Implementado |
| Clientes | `/api/client/getAll` | GET | ✅ |
| Clientes | `/api/client/register` | POST | ✅ |
| Clientes | `/api/client/update/:id` | PUT | ✅ |
| Clientes | `/api/client/delete/:id` | DELETE | ✅ |
| Usuarios | `/api/user/getAll` | GET | ✅ |
| Usuarios | `/api/user/register` | POST | ✅ |
| Inventario | `/api/vehicles` | GET | ✅ |
| Inventario | `/api/vehicles` | POST | ✅ |
| Inventario | `/api/vehicles/:id` | PUT | ✅ |
| Ventas | `/api/sale/getAll` | GET | ✅ |
| Ventas | `/api/sale/getById/:id` | GET | ✅ |
| Ventas | `/api/sale/register` | POST | ✅ |
| Ventas | `/api/sale/update/:id` | PUT | ✅ |
| Compras | `/api/buy/getAll` | GET | ✅ |
| Compras | `/api/purchase/register` | POST | ⚠️ URL incierta |
| Compras | `/api/buy/update/:id` | PUT | ✅ |
| Proveedores | `/api/provider/getAll` | GET | ✅ |
| Proveedores | `/api/provider/register` | POST | ✅ |
| Proveedores | `/api/provider/update/:id` | PUT | ✅ |

---

## 🐛 Bugs y Problemas Identificados

### Críticos
1. **URL incorrecta en comprasApi:** `registerPurchase` usa `/api/purchase/register` en lugar del patrón consistente `/api/buy/register` → registro de compras probablemente falla con 404
2. **Token RENIEC hardcodeado** en `usuariosApi.js` → riesgo de seguridad, el token queda expuesto en el bundle de producción

### Moderados
3. **Doble fetch en `useInventario.js`:** Dos `useEffect` distintos llaman a la misma API al montar → doble carga innecesaria
4. **`useVehiculoForm.js` duplica lógica de API:** Llama a `fetch()` directamente en vez de usar `inventarioService`
5. **Bug en validación de contraseña** en `ForgotPasswordModal.jsx` (línea 229): `!newPassword.length >= 8` siempre es `false` — el botón de submit no se deshabilita correctamente por longitud
6. **Estructura JSX rota en `Sidebar.jsx`:** `</aside>` cierra dentro de un `<div>` incorrecto

### Menores
7. **Inconsistencia de nombre:** El sitio se llama "NitroSpace" en sidebar/login pero "AutoValor" en el título HTML y en el dashboard
8. **Labels en inglés** en LoginPage ("Username", "Password") mientras el resto está en español
9. **`App.css` obsoleto:** Contiene estilos del template Vite, no se usa
10. **`mockInventario.js` obsoleto:** No se usa en ningún componente
11. **`notificacionesService.js` obsoleto:** Reemplazado por `useNotificationSystem.js` pero no eliminado
12. **`rechart` y `cors`** en `package.json`: paquetes inútiles en frontend

---

## ✅ Buenas Prácticas Identificadas

- ✅ Arquitectura **Feature-based** bien organizada (pages/components/hooks/services por módulo)
- ✅ **Code splitting** con `React.lazy()` en todas las rutas
- ✅ **Token Bearer** en todas las peticiones autenticadas
- ✅ Validación de `Content-Type` antes de parsear JSON en servicios de auth
- ✅ Sistema de notificaciones persistente en localStorage con sync entre componentes
- ✅ Control de acceso por rol implementado en Sidebar y RoleRoute
- ✅ Logout limpia correctamente localStorage
- ✅ Protección de rutas privadas con PrivateRoute
- ✅ `vercel.json` correctamente configurado para SPA
- ✅ Fuente Inter + paleta de colores coherente con marca

---

## 📊 Métricas del Proyecto

| Métrica | Valor |
|---|---|
| Total de archivos fuente | ~55 archivos |
| Features implementadas | 7 de 9 (Financiamiento y Mantenimiento son placeholders) |
| Módulos con datos reales (API) | 5 (clientes, ventas, compras, inventario, usuarios) |
| Módulos con datos mock | 2 (dashboard inicio, reportes) |
| Componentes más grandes | `RegistroVenta.jsx` (19KB), `VentasList.jsx` (17.5KB), `EditarVenta.jsx` (16.4KB) |
| Archivo más pequeño | `PlaceholderPage.jsx` (508 bytes) |
