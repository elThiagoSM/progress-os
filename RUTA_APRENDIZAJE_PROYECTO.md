# RUTA DE APRENDIZAJE — Norkent

> Guía para reaprender programación **estudiando y modificando tu propio proyecto**.
> Nivel de partida: variables, condicionales, bucles, funciones, SQL básico, lectura de código aproximada.
> Objetivo: entender Norkent por completo, modificarlo y construir funcionalidades nuevas **sin depender de IA**.

---

## Cómo usar este documento

Esto es una ruta de **mentor**, no un tutorial de generación de código. Reglas:

1. **Práctica primero, teoría después.** Cada etapa tiene ejercicios sobre el código real. La teoría solo aparece cuando la necesitás para resolver un ejercicio.
2. **Antes de pedir una respuesta, responde las "Preguntas de razonamiento"** de cada etapa. Si no podés responderlas, aún no pasaste de etapa.
3. **Cuando te trabes:** dedicá 15–20 minutos a intentarlo (rompiendo cosas, leyendo código parecido, usando `console.log` y la pestaña Network del navegador). Recién ahí consultá a la IA — y con estas reglas:
   - Pedí **preguntas**, no código: *"¿por qué mi función devuelve undefined?"*, no *"escribime la función"*.
   - Si te da código, pedile que **lo borre y te haga razonar el camino**.
   - Prohibido copiar y pegar en ejercicios marcados como **[SIN IA]**.
4. **Validá siempre** con los comandos del proyecto (ver [Comandos de validación](#comandos-de-validación)) antes de dar un ejercicio por terminado.
5. **Trabajá en una rama de git** (`git checkout -b aprendizaje/etapa-N`) para que puedas descartar ejercicios sin miedo. Nunca modifiques `database.sql`, `MEMORY.md`, `messages/`, `.agents/` ni `docs/` en los ejercicios.

---

# PARTE A — Análisis del proyecto

## 1. Tecnologías, frameworks, librerías y herramientas

### Stack principal

| Capa | Tecnología | Qué hace en Norkent | Dónde vive |
|---|---|---|---|
| Framework web | **Next.js 15 (App Router, Turbopack)** | Routing por archivos, páginas, layouts, API routes, renderizado server/client | `src/app/` |
| Lenguaje | **TypeScript 5** | Tipado estático sobre todo el código | `src/**/*.ts(x)`, `tsconfig.json` |
| UI | **React 19** | Componentes, estado, hooks | `src/components/`, `src/lib/hooks/` |
| Estilos | **Tailwind CSS 4** + Radix/shadcn (mínimo uso) | Clases utilitarias; componentes propios en vez de librería completa | `src/components/dashboard/ui/` |
| Base de datos | **Supabase (PostgreSQL)** | Datos de la app; acceso **solo desde servidor** con service role | `database.sql`, `src/lib/supabaseServer.ts` |
| Autenticación | **NextAuth v5 (beta)** + bcrypt + otplib | Login por credenciales/Google/GitHub, JWT en cookie, 2FA (email/TOTP), PIN de empresa | `src/auth.ts`, `src/middleware.ts`, `src/lib/2fa/`, `src/lib/pin/` |
| Facturación | **Commet** (`@commet/node`) | Checkout alojado, webhooks, suscripciones y planes | `src/lib/commet/`, `src/lib/subscriptions/`, `src/app/api/(plans)/commet/` |
| Email | **Resend** + React Email | Verificación, reset, 2FA, reportes automáticos, alertas | `src/email-templates/`, `src/app/api/send/` |
| Imágenes | **Cloudinary** | Fotos de empleados, logo, foto de perfil | `src/lib/cloudinary.ts`, `src/app/api/upload/` |
| Monitoreo | **Sentry** | Errores de runtime/edge/server | `sentry.*.config.ts`, `src/instrumentation.ts` |
| i18n | **next-intl** | Sitio público en `es`/`en` (dashboard fijo en español) | `src/i18n/`, `messages/` |
| Animaciones | **framer-motion** | Secciones del sitio público y Sidebar | `src/components/secciones-publicas/` |
| Despliegue | **Vercel** | Hosting serverless, 1 cron diario (plan Hobby) | `vercel.json` |

### Herramientas de desarrollo

| Herramienta | Comando | Para qué |
|---|---|---|
| Dev server | `npm run dev` | Levantar en local (Turbopack) |
| Lint | `npm run lint` / `lint:fix` | Reglas de ESLint |
| Tipos | `npm run type-check` | `tsc --noEmit` — verifica tipos sin compilar |
| Tests | `npm run test` | Vitest (pocos tests: ej. `src/lib/pin/__tests__/pin.test.ts`) |
| Build | `npm run build` | Compila (incluye type-check + lint por `prebuild`) |
| Rate limiting | Upstash Redis (REST) | Límite de requests por IP/usuario — **opcional**: sin variables de entorno, queda desactivado |

### Conceptos que NO son los basics que ya sabés (tu deuda de aprendizaje)

```
async/await y promesas      →  usado en TODO el proyecto (fetch, Supabase)
HTTP (métodos, status,      →  cada API route
      headers, cookies)
React (props, estado,       →  cada componente
      hooks, render)
TypeScript (tipos,          →  cada archivo
      interfaces, genéricos)
Next.js App Router          →  routing, layouts, server/client
Arquitectura en capas       →  UI → hooks → API → lib → BD
Seguridad (JWT, hashes,     →  auth, 2FA, PIN, rate limit
      multi-tenant)
SQL intermedio (joins,      →  todas las queries
      índices, triggers)
Patrones (caché, polling,   →  dashboard, listados
      idempotencia, webhooks)
```

---

## 2. Estructura y arquitectura

### Árbol del proyecto (solo lo esencial)

```
Norkent/
├── database.sql              ← FUENTE ÚNICA de verdad del esquema BD (35 tablas, 26 funciones, triggers)
├── migrations-database/      ← migraciones (se aplican MANUALMENTE por el dueño)
├── messages/                 ← traducciones es.json / en.json
├── src/
│   ├── app/                  ← Next.js App Router
│   │   ├── (public)/[locale]/    ← marketing multi-idioma (SSG, server components)
│   │   ├── (auth)/[locale]/      ← /login, /register
│   │   ├── dashboard/            ← panel privado (page.tsx shell + Page*.tsx con la lógica)
│   │   │   └── layout.tsx        ← stack de guards: 2FA → onboarding → PIN
│   │   ├── ingreso/              ← pantalla de kiosko (QR + teclado)
│   │   ├── api/                  ← 78 route.ts (BACKEND)
│   │   │   ├── (asistencias)/ (empleados)/ (plans)/ (auth)/ ...  ← route groups: organizan carpetas, NO cambian la URL
│   │   │   ├── registro-qr/      ← marcaje de asistencia sin sesión (vía token QR)
│   │   │   ├── cron/             ← tareas programadas (retención, reportes)
│   │   │   └── auth/[...nextauth]/ ← handlers de NextAuth
│   │   └── layout.tsx, Providers.tsx, error.tsx, not-found.tsx
│   ├── middleware.ts          ← ENTRADA de toda request: rate limit, i18n, guards de sesión/plan
│   ├── auth.ts                ← configuración NextAuth: login, 2FA, JWT callbacks
│   ├── components/
│   │   ├── ui/                ← shadcn (casi sin usar)
│   │   ├── dashboard/ui/      ← primitivas propias: Button, Input, Select, Paginacion…
│   │   ├── dashboard/modals/  ← 41 modales: crear/ editar/ eliminar/ descargar/ detalles/ filtros/ mensajes/
│   │   ├── Require*.tsx       ← guards server-side (sin "use client")
│   │   └── secciones-publicas/, legal/, modal/, blog/
│   ├── lib/
│   │   ├── supabaseServer.ts  ← ÚNICO cliente de BD (service role, server-only, bypasea RLS)
│   │   ├── hooks/             ← 33 hooks: fetch + caché compartida + polling
│   │   ├── api/               ← rateLimit.ts, pagination.ts (convenciones de toda API)
│   │   ├── utils/             ← lógica de negocio: horarioUtils, asistenciaSello, sello, fechas…
│   │   ├── subscriptions/, commet/, 2fa/, pin/, external/resiliencia.ts
│   │   └── auditoria.ts       ← registro de auditoría en cada escritura
│   ├── i18n/                  ← config de locales y rutas localizadas
│   └── types/                 ← tipos TS (escritos a mano, parciales)
└── docs/, .agents/, MEMORY.md ← documentación y convenciones del proyecto
```

### Arquitectura en capas (el patrón central)

```
┌─────────────────────────────────────────────────────────────┐
│ 1. UI (componentes "use client")                            │
│    page.tsx (shell) → Page*.tsx (estado) → modales          │
│    src/app/dashboard/personal/PagePersonal.tsx              │
└───────────────┬─────────────────────────────────────────────┘
                │ fetch('/api/...')
┌───────────────▼─────────────────────────────────────────────┐
│ 2. Hooks (caché, polling, estado compartido)                │
│    src/lib/hooks/useEmpleados.ts → useCacheCompartida       │
└───────────────┬─────────────────────────────────────────────┘
                │ HTTP (GET/POST/PUT/DELETE)
┌───────────────▼─────────────────────────────────────────────┐
│ 3. API routes (autorización + validación + orquestación)    │
│    src/app/api/(empleados)/crear-empleado/route.ts          │
│    patrón fijo: auth() → rate limit → validar → operar →    │
│                 registrarAuditoria → responder              │
└───────────────┬─────────────────────────────────────────────┘
                │ lib helpers (lógica de negocio reusable)
┌───────────────▼─────────────────────────────────────────────┐
│ 4. lib/  (horarioUtils, asistenciaSello, planLimits, …)     │
└───────────────┬─────────────────────────────────────────────┘
                │ supabase.from() / .rpc()
┌───────────────▼─────────────────────────────────────────────┐
│ 5. Supabase (PostgreSQL)                                    │
│    service role → RLS bypaseado → filtros empresa_id        │
│    hechos A MANO en cada ruta (multi-tenant en la app)      │
│    + funciones/triggers en database.sql                     │
└─────────────────────────────────────────────────────────────┘
```

**Regla de oro del proyecto:** el cliente **nunca** habla directo con la Base de Datos. Todo dato pasa por una API route que valida sesión y filtra por `empresa_id` (aislamiento entre empresas = *multi-tenant*).

### Convenciones que tenés que conocer

- **`page.tsx` es un shell** (Sidebar + contenedor); la lógica vive en el hermano `Page*.tsx`. Igual en marketing: `plans/page.tsx` → `PagePlanes.tsx`.
- **Route groups** `(empleados)`: organizan carpetas sin afectar la URL (`/api/obtener-empleados`).
- **Nombres en español** para rutas y componentes (`ModalCrearEmpleado`, `obtener-empleados`).
- **Cada escritura deja auditoría** (`registrarAuditoria`) y **cada lectura de listado pagina** (headers `X-Total-Count`).
- **Borrado lógico** (`eliminado_en`), no `DELETE` físico, en empleados/horarios.
- **Servicios externos** siempre por `conResilienciaExterna()` (timeout + cortacircuitos).

---

## 3. Cómo se conectan frontend, backend, APIs y base de datos

### Camino de una request (ejemplo: cargar empleados)

```
1. Navegador monta PagePersonal.tsx
2. → useEmpleados() (src/lib/hooks/useEmpleados.ts)
3.   → fetch('/api/obtener-empleados')          [HTTP GET]
4.     → src/middleware.ts                      [rate limit por IP; i18n; guards si es página]
5.       → src/app/api/(empleados)/obtener-empleados/route.ts
6.         a) const session = await auth()       ← lee la cookie JWT de NextAuth → 401 si no hay sesión
7.         b) limitarPorUsuario(...)             ← 429 si pasa del límite
8.         c) supabase.from('empleados')
9.              .select('..., puestos(nombre)')  ← join
10.             .eq('empresa_id', session.empresa.id)   ← AQUÍ vive el multi-tenant
11.            .is('eliminado_en', null)         ← borrado lógico
12.        → JSON + headers X-Total-Count
13. → hook guarda en caché compartida → componente re-renderiza
```

### Camino de una página protegida

```
GET /dashboard/personal
  → middleware.ts: auth()? no → redirect /login
                  : tienePlanActivo()? no → redirect /dashboard/planes
  → app/dashboard/layout.tsx (server component):
      RequireDashboard2FA → RequireOnboarding → PinRequeridoGate
  → page.tsx shell → PagePersonal.tsx (client) → hooks → fetch /api/...
```

### ¿Dónde está cada cosa?

| Pregunta | Respuesta |
|---|---|
| ¿Quién decide si estás logueado? | `src/auth.ts` (crea JWT) + `src/middleware.ts` (redirige) + guards del layout |
| ¿Quién protege una API? | La propia API: `await auth()` al inicio del `route.ts` |
| ¿Quién filtra por empresa? | Cada query: `.eq('empresa_id', session.empresa.id)` |
| ¿Dónde vive la regla de negocio? | Mixed: TS en `lib/utils/*` (puntualidad, cooldown) + SQL en funciones (`fn_calcular_horas`) |
| ¿Dónde vive el esquema? | `database.sql` (fuente única) — `src/types/database.ts` es un reflejo manual parcial |
| ¿Quién calcula horas extra y alertas? | Funciones SQL invocadas con `.rpc()` desde `asistenciaSello.ts` |
| ¿Cómo llega el estado de una suscripción? | Webhook de Commet → `route.ts` verifica firma → `lib/subscriptions/*` → tablas `suscripciones/pagos` → guards lo leen |

---

## 4. Flujo de datos de las principales funcionalidades

### 4.1 Login + 2FA + PIN (autenticación)

```
LoginForm.tsx
 → signIn("credentials")                    [src/auth.ts → authorize()]
     → busca usuario, bcrypt.compare, chequea suspensión/email verificado
     → ¿requiere 2FA? SÍ → crea fila en logins_2fa_pendientes (token hasheado,
                            TTL 15 min, 5 intentos) + cookie httpOnly
                            → throw AuthNeeds2FA  (NO crea sesión)
       → /verificar-2fa → POST /api/auth/2fa/verificar
           → verifica código (email/TOTP/backup)
           → signIn("credentials", { pendingToken })  ← vuelve a authorize()
           → AHORA sí crea el JWT en cookie
     → NO → crea sesión directo
 → callbacks jwt/session hidratan token con datos de usuario + empresa
 → middleware + layout guards chequean sesión, plan, 2FA pendiente, PIN
```

**Detalle clave:** al pisar `/ingreso` (kiosko), el middleware setea la cookie `norkent_needs_reauth` → al volver al dashboard, `RequireDashboard2FA` te manda a `/reautenticar` donde entra el **PIN de 4 dígitos de la empresa** (bcrypt contra `empresas.pin_hash`).

### 4.2 Marcar asistencia por QR (flujo insignia)

```
[Admin] /ingreso → GET /api/registro-qr/token → fila en qr_tokens (efímera)
       → QR muestra URL /ingreso/{codigoEmpresa}/{token}
[Empleado escanea] → página pública → POST /api/registro-qr/registrar
   1. valida token QR (expira, no expirado)            → 401 si falla
   2. valida empleado (cédula + empresa + activo)
   3. hora/fecha en la ZONA HORARIA de la empresa
   4. cooldown anti-abuso de 60 s                      → 429
   5. decide entrada vs salida (¿hay fila abierta?)
   6. puntual/tarde/fuera_horario → horarioUtils.ts    [lógica en TypeScript]
   7. escritura con SELLO:
      - HMAC-SHA256 encadenado (sello.ts + asistenciaSello.ts)
      - lee cadena_sellos.hash_actual → guarda hash previo → avanza la cabeza
   8. al cerrar salida → .rpc('fn_calcular_horas')     [lógica en SQL]
                        → .rpc('fn_evaluar_alertas_empleado') → alertas_laborales
   9. auditoría "Sistema (QR)"
  10. si qr_un_uso → el token queda expirado
```

### 4.3 CRUD de empleado

```
ModalCrearEmpleado (foto opcional → POST /api/upload/empleado-photo → Cloudinary)
 → POST /api/crear-empleado
     auth → validar campos → puesto pertenece a la empresa → email duplicado? 409
     → límite de plan (obtenerLimitesPlanUsuario + contarRegistrosEmpresa) → 403
     → INSERT empleados → INSERT empleado_horarios (asignación de turnos)
     → registrarAuditoria → 201
 → hook refresca → GET /api/obtener-empleados
```

### 4.4 Plan y facturación (Commet)

```
PlanCard → POST /api/commet/create-subscription → checkout alojado de Commet
  → retorno a /dashboard/planes?subscription=success → confirmación con reintentos

[Paralelo, del lado de Commet] webhook → POST /api/commet/webhook
  → verifica firma (x-commet-signature) con WEBHOOK_SECRET_COMMET
  → switch(evento) → syncSubscriptionFromCommet / processCommetPayment
  → idempotencia: commet_eventos (dedupe por hash) + unique constraints
  → escribe suscripciones / pagos / facturas / historial_planes

Gating en 3 capas:
  - middleware (redirect a /dashboard/planes si no hay plan)
  - RequireOnboarding (mismo check, porque Next no re-ejecuta layouts en nav client)
  - por ruta (límites de empleados/QR/reportes en cada API)
```

### 4.5 Dashboard (lectura + polling)

```
PageInicio → fetch /api/dashboard/resumen
  → caché en memoria 30 s por empresa+fecha (refresh=1 la salta)
  → Promise.all con 10 queries en paralelo a Supabase
  → métricas derivadas EN la ruta (asistieron, puntualidad %, tendencia 7 días)
  → JSON → UI
  → usePolling cada 60 s, pausado si la pestaña está oculta
```

---

## 5. Conceptos a aprender o reforzar (matriz)

| # | Concepto | Nivel | Dónde se ve en el proyecto |
|---|---|---|---|
| 1 | `async/await`, promesas, `Promise.all` | imprescindible | todo `src/app/api`, `dashboard/resumen` |
| 2 | HTTP: métodos, status (200/201/400/401/403/404/409/429/500), headers, cookies | imprescindible | todas las `route.ts` |
| 3 | `fetch`, JSON, manejo de errores en red | imprescindible | `src/lib/hooks/*` |
| 4 | React: componentes, props, estado (`useState`), efectos (`useEffect`), eventos, listas | imprescindible | `src/components/**` |
| 5 | Custom hooks | alto | `useEmpleados`, `useAsistencias`, `usePolling` |
| 6 | TypeScript: interfaces, unions, genéricos básicos, `as`, tipos de retorno | alto | `src/types/*`, hooks |
| 7 | Next.js App Router: pages, layouts, route groups, server vs client components, middleware | alto | `src/app/**`, `src/middleware.ts` |
| 8 | API design: validación, códigos de estado, paginación, rate limiting | alto | `src/lib/api/*` |
| 9 | SQL intermedio: joins, `GROUP BY`, agregados, índices, `ON CONFLICT` | alto | queries en rutas, `database.sql` |
| 10 | BD relacional: PK/FK, enums, borrado lógico, desnormalización | alto | `database.sql` |
| 11 | Seguridad: hashing (bcrypt), JWT, sesiones, 2FA/TOTP, CSRF/cookies httpOnly | medio-alto | `src/auth.ts`, `src/lib/2fa/` |
| 12 | Multi-tenant: aislamiento por `empresa_id`, RLS vs aplicación | medio-alto | cada ruta + `supabaseServer.ts` |
| 13 | Triggers y funciones SQL | medio | `fn_calcular_horas`, `trg_asistencias_empresa` |
| 14 | Caché (cliente/servidor), polling, invalidación | medio | `useCacheCompartida`, caché 30 s del resumen |
| 15 | Webhooks, firmas, idempotencia, máquinas de estados | avanzado | `commet/webhook`, `lib/subscriptions/*` |
| 16 | Resiliencia: timeouts, circuit breaker | avanzado | `src/lib/external/resiliencia.ts` |
| 17 | Integridad criptográfica (HMAC encadenado) — **concepto, no matemáticas** | avanzado | `sello.ts`, `asistenciaSello.ts` |
| 18 | Testing unitario (Vitest) | medio | `src/lib/pin/__tests__/pin.test.ts` |

---

## 6. Partes del código a estudiar especialmente

### Orden de lectura sugerido (de más simple a más complejo)

| # | Archivo | Por qué |
|---|---|---|
| 1 | `src/lib/supabaseServer.ts` (24 líneas) | Todo el acceso a la BD en un archivo chico: explica por qué RLS no aplica y por qué cada ruta filtra `empresa_id` |
| 2 | `src/app/api/(empleados)/obtener-empleados/route.ts` | La API route "hello world" del proyecto: auth → rate limit → query → transformar → responder |
| 3 | `src/lib/hooks/useEmpleados.ts` + `src/lib/hooks/useCacheCompartida.ts` | Cómo el frontend pide datos y los cachea |
| 4 | `src/app/dashboard/personal/page.tsx` + `PagePersonal.tsx` | La convención de estructura de toda pantalla del panel |
| 5 | `src/middleware.ts` | El "cerebro": rate limit, i18n, guard de sesión, guard de plan, cookies |
| 6 | `src/auth.ts` | Autenticación completa: providers, authorize, bifurcación 2FA, callbacks JWT |
| 7 | `src/app/api/(asistencias)/asistencias/route.ts` (GET y POST) | El handler canónico con validación, paginación, auditoría y lógica de negocio |
| 8 | `src/lib/utils/horarioUtils.ts` | Dónde vive la regla de negocio de horarios/puntualidad (TypeScript, no SQL) |
| 9 | `src/lib/utils/asistenciaSello.ts` + `sello.ts` | Escritura con sello HMAC y llamadas a funciones SQL |
| 10 | `database.sql` (selección) | `CREATE TABLE` (líneas ~67–824), `fn_calcular_horas`, `fn_evaluar_alertas_empleado`, bloque RLS/REVOKE (~1991–2072) |
| 11 | `src/app/api/dashboard/resumen/route.ts` | Consultas en paralelo, caché en memoria y métricas derivadas |
| 12 | `src/app/api/(plans)/commet/webhook/route.ts` + `src/lib/subscriptions/` | El sistema más complejo: eventos externos, firma, idempotencia, máquina de estados |

### Hallazgos que conviene conocer (te sirven como "lectura crítica")

- **RLS está habilitado en las 35 tablas pero con 0 políticas + `REVOKE` total**: la seguridad real es la capa de aplicación (service role + filtros `empresa_id` en cada ruta). Si algún día olvidás un filtro en una ruta, no hay red de seguridad en la BD.
- **No hay RBAC**: todas las tablas `admin_*` existen en el esquema pero **ninguna ruta las lee**. El modelo es dueño único por empresa.
- **El sello HMAC tiene dos implementaciones** (SQL `fn_sellar_marca` y TS `asistenciaSello.ts`) con payloads que **no coinciden**; la app usa la de TypeScript. La SQL es legado.
- **`src/types/database.ts` está escrito a mano y tiene drift** respecto de `database.sql` (faltan columnas de sello, el enum `'ausente'` no existe en BD, etc.).
- **`migrations-database/` está vacío**; el historial de migraciones vive como comentarios dentro de `database.sql`.
- El dashboard **no está traducido** (fijo en `es`); el i18n aplica al sitio público.

---

# PARTE B — Ruta de aprendizaje progresiva

> Duración estimada total: **8–12 semanas** a un ritmo de 1–2 h/día.
> No saltes de etapa: cada una usa lo de las anteriores.

---

## Etapa 0 — Terreno y brújula (½ día)

**Objetivo:** que el proyecto deje de ser una caja negra a nivel de carpetas.

**Qué aprender:** para qué sirve cada directorio y cada comando.

**Qué estudiar:**
- Este documento (Parte A).
- `AGENTS.md` y `.agents/DEVELOPMENT.md` (las reglas que ya gobiernan el proyecto).
- `docs/INVENTARIO_FUNCIONALIDADES.md` (qué features existen).

**Ejercicios [SIN IA]:**
1. Corré `npm run dev`, abrí `/dashboard` y la home pública. Mirá la pestaña **Network**: identificá las llamadas a `/api/...` que dispara el dashboard.
2. Contestá en un papel: ¿qué hace cada carpeta de `src/`? (podés contrastarlo con el árbol de este documento).
3. Corré `npm run lint`, `npm run type-check`, `npm run test` y anotá qué pasa en cada uno.

**Preguntas de razonamiento (respondelas antes de pasar):**
- Si quiero cambiar un texto del botón "Crear empleado", ¿en cuántos archivos podría estar?
- Si quiero cambiar la tabla `empleados`, ¿qué otros archivos quedan desactualizados?

**Listo cuando:** podés navegar el árbol sin mirar y saber qué buscar primero.

---

## Etapa 1 — TypeScript: leer y escribir tipos (3–5 días)

**Objetivo:** que el tipado deje de ser ruido y pase a ser tu sistema de ayuda.

**Qué aprender:**
- Tipos primitivos, `interface` vs `type`, propiedades opcionales (`?`), unions (`'a' | 'b'`), `null`/`undefined`.
- Tipado de funciones (parámetros y retorno), `const` assertions, `as`.
- Genéricos mínimos: qué es `<T>` y por qué `useState<string>` existe.
- Módulos: `import`/`export`, `import type`.

**Qué estudiar en el proyecto:**
- `src/types/index.ts` y `src/types/database.ts` — tipos de las tablas principales.
- `src/types/next-auth.d.ts` — *module augmentation*: cómo se "extiende" el `session` de NextAuth.
- `src/lib/constants/planes.ts` — unions de strings y tipos de características.
- Buscá con grep: `EstadoAsistencia`, `ApiResponse`, `LimitesPlan`.

**Ejercicios [SIN IA]:**
1. Abrí `src/types/database.ts`, elegí `Empleado` y escribí en un papel todas las columnas que **no** tiene pero sí existen en `database.sql` (comparalas). ¿Qué consecuencias puede tener ese "drift"?
2. En cualquier archivo `.ts`, cambiá un valor a propósito a un tipo inválido (ej. `const x: number = "hola"`) y corré `npm run type-check`. Leé el error completo hasta entenderlo. Revertí.
3. Creá un archivo temporal `src/lib/utils/__aprendizaje.ts` con una función tipada que reciba un `Empleado` y devuelva su nombre y puesto. Corré `type-check`. Borralo al terminar.

**Preguntas de razonamiento:**
- ¿Qué diferencia hay entre `string | null` y `string | undefined`? Mirá cómo se usan `eliminado_en` y `foto_url`.
- Si una API devuelve `{ error: string }` en fallo y un arreglo en éxito, ¿cómo tiparías eso? (Mirá `ApiResponse` en `src/types/index.ts`.)

**Listo cuando:** leés un error de TypeScript y sabés indicar la línea exacta del problema.

---

## Etapa 2 — React: componentes, estado y hooks (1 semana)

**Objetivo:** poder modificar y crear UI del dashboard sin copiar y pegar.

**Qué aprender:**
- Componentes función, props, JSX, renderizado condicional, listas y `key`.
- `useState`: estado y actualizador (y por qué el estado no cambia "solo").
- `useEffect`: cuándo se ejecuta, array de dependencias, cleanup.
- Eventos (`onClick`, `onChange`), formularios controlados.
- Custom hooks: qué es un hook y por qué el proyecto tiene 33.
- Convención del proyecto: `page.tsx` shell + `Page*.tsx`.

**Qué estudiar en el proyecto (en este orden):**
1. `src/components/dashboard/ui/Button.tsx` — componente pequeño con props/variantes.
2. `src/components/dashboard/modals/mensajes/ModalInfo.tsx` y `ModalExito.tsx` — modales simples.
3. `src/app/dashboard/personal/page.tsx` — el shell (5 líneas de lógica).
4. `src/app/dashboard/personal/PagePersonal.tsx` — estado real: filtros, selección, modales abiertos.
5. `src/components/dashboard/modals/crear/ModalCrearEmpleado.tsx` (538 líneas) — formulario grande con subida de foto.

**Ejercicios (empezá por el 1, hacé al menos 3):**
1. **[SIN IA]** En `PagePersonal.tsx`, cambiá el límite de filas visible o el texto de un título. Validá con `npm run lint && npm run type-check`.
2. **[SIN IA]** Agregá un campo de búsqueda nuevo con `useState` que filtre por algo que hoy no filtra (ej. por cargo). Observá cómo el proyecto ya filtra y seguí el mismo patrón.
3. Extrá de un modal grande un componente hijo (p. ej. la sección de la foto) a un archivo nuevo en `src/components/dashboard/modals/`. Que el modal siga funcionando igual.
4. Creá un componente `BadgeEstado` nuevo en `src/components/dashboard/ui/` que muestre el estado de asistencia con color, y usalo en `PageEntrada.tsx`.
5. Agregá un `useEffect` que haga `console.log` cada vez que cambia el listado filtrado. Explicá por qué se dispara (o no) esa cantidad de veces.

**Validación de etapa:** `npm run lint`, `npm run type-check`, `npm run build` y que la página funcione en el navegador.

**Preguntas de razonamiento:**
- ¿Por qué los proyectos de React no actualizan el DOM directo, y qué pasa si hacés `state = 5` en vez de `setState(5)`?
- En `PagePersonal`, ¿por qué el estado vive en `Page*.tsx` y no en `page.tsx`?
- ¿Qué problema resuelve `key` en un `map`?

**Listo cuando:** agregás una funcionalidad pequeña de UI por tu cuenta sin copiar un archivo entero.

---

## Etapa 3 — Asíncrono: HTTP, fetch y promesas (3–4 días)

**Objetivo:** entender el corazón mecánico de toda la app: pedir datos y esperarlos.

**Qué aprender:**
- Promesas: `then/catch`, `async/await`, `try/catch`.
- `fetch`: URL, método, headers, body, `res.ok`, `res.json()`.
- Códigos de estado HTTP y qué significa cada uno en este proyecto.
- Cadenas de promesas y `Promise.all` (paralelismo).
- La pestaña Network como herramienta de debugging.

**Qué estudiar en el proyecto:**
1. `src/lib/hooks/useEmpleados.ts` — fetch simple + tipado de respuesta.
2. `src/lib/hooks/useAsistencias.ts` — fetch con query params, headers `X-Total-Count`, evitando re-renders inútiles.
3. `src/app/api/dashboard/resumen/route.ts` — `Promise.all` de 10 queries en paralelo.
4. `src/app/api/(empleados)/obtener-empleados/route.ts` — el lado servidor de ese fetch.

**Ejercicios:**
1. **[SIN IA]** Abrí Network → filtro "Fetch/XHR" → recargá Personal. Encontrá la llamada a `/api/obtener-empleados`: copiá la URL, abrila en otra pestaña y leé el JSON crudo.
2. **[SIN IA]** Escribí a mano (sin IA) un hook `src/lib/hooks/__aprendizaje/useHola.ts` que haga `fetch('/api/obtener-empleados')`, tenga `loading`, `error` y `datos`, y lo uses en un `Page*` temporal. Corré lint + type-check. Borralo después.
3. Rompé a propósito la URL del fetch (ej. `/api/no-existe`) y manejá el error mostrando un mensaje en pantalla.
4. Mirá cómo `useAsistencias` lee `X-Total-Count` con `res.headers.get(...)`. Explicá por qué el proyecto devuelve el total en headers y no en el body.
5. Leé el `try/catch` de cualquier `route.ts`: ¿qué responde si la query a Supabase falla? ¿Y si no hay sesión?

**Preguntas de razonamiento:**
- ¿Qué diferencia hay entre esperar un `await` y no esperarlo? (Pista: ¿qué pasa si mandás la respuesta antes de terminar de escribir en la BD?)
- ¿Por qué el proyecto usa `Promise.all` en el resumen del dashboard en vez de esperar una query y después otra?

**Listo cuando:** podés leer cualquier `route.ts` y explicar paso a paso qué le llega y qué devuelve.

---

## Etapa 4 — Next.js App Router y el viaje completo de una request (1 semana)

**Objetivo:** entender el esqueleto: rutas, layouts, server/client, middleware, API routes.

**Qué aprender:**
- Convención de archivos: `page.tsx`, `layout.tsx`, `route.ts`, `loading`, `error`.
- Route groups `(carpeta)` y dynamic segments `[param]`.
- Server components vs client components (`"use client"`): qué corre en el servidor y qué en el navegador, y por qué importa.
- API routes: exportar `GET`/`POST`/`PUT`/`DELETE`, `Request`/`Response`, `searchParams`.
- Middleware: qué corre antes que todo, y sus límites.
- `metadata` / `generateMetadata` (server) vs nada en client.

**Qué estudiar en el proyecto:**
1. `src/middleware.ts` completo — línea por línea (rate limit → i18n → sesión → plan → cookies).
2. `src/app/dashboard/layout.tsx` + `src/components/RequireOnboarding.tsx` + `RequireDashboard2FA.tsx`.
3. `src/app/api/(asistencias)/asistencias/route.ts` — GET con query params y paginación.
4. `src/app/(public)/[locale]/layout.tsx` y una `page.tsx` server con `getTranslations`.
5. Contá los `"use client"` (123 archivos) y compará con los server: ¿dónde está la frontera?

**Ejercicios:**
1. **[SIN IA]** Dibujá en un papel el recorrido de `GET /api/asistencias?fecha=2026-09-01`: desde el `fetch` del hook hasta el `supabase.from('asistencias')`, nombrando cada archivo.
2. **[SIN IA]** Agregá un parámetro opcional `estado` al GET de `/api/asistencias` que filtre `.eq('estado', estado)`. Validalo con regex como los demás parámetros. Probalo con Network.
3. Creá una ruta API nueva `GET /api/ping-apprendizaje` que siga el patrón exacto del proyecto (auth → 401 si no hay sesión → responde `{ ok: true, empresa: session.empresa.id }`). Verificá que **no** filtre datos de otra empresa.
4. Observá el guard de plan: sacalo temporalmente de `middleware.ts`, entrá a `/dashboard` sin plan y explicá qué pasa (revertí después — es una protección importante).
5. Explicá con dos líneas cada uno: ¿qué hace `src/app/dashboard/layout.tsx` y por qué los guards están ahí y no en cada página?

**Preguntas de razonamiento:**
- ¿Por qué el guard de plan vive en el middleware **y** en `RequireOnboarding` si es el mismo check? (Mirá el comentario en `MEMORY.md` sobre navegación client-side.)
- Si escribís `export const dynamic = 'force-dynamic'` en una página, ¿qué cambia? ¿El proyecto lo usa? ¿Dónde?
- Cuando el middleware redirige, ¿eso es un redirect del navegador o de React?

**Listo cuando:** ante cualquier pantalla del dashboard, sabés decir qué layout la protege, qué APIs llama y qué tablas toca.

---

## Etapa 5 — Base de datos relacional con ojos de desarrollador (1 semana)

**Objetivo:** pasar de "SQL básico" a leer el esquema y escribir las queries que la app necesita.

**Qué aprender:**
- Leer DDL: `CREATE TABLE`, tipos, `REFERENCES` (FK), `UNIQUE`, `CHECK`, `DEFAULT`, enums.
- Consultas: `JOIN` (inner/left), `GROUP BY` + agregados, `HAVING`, subqueries, `CASE`.
- Índices: qué son, cuándo se crean, cómo leer un índice compuesto.
- `ON CONFLICT ... DO UPDATE` (upsert) y `RETURNING`.
- Concepts: desnormalización (por qué `asistencias.empresa_id` existe), borrado lógico, triggers y funciones PL/pgSQL (solo lectura).

**Qué estudiar en el proyecto:**
1. `database.sql`: tablas `usuarios`, `empresas`, `empleados`, `horarios`, `empleado_horarios`, `asistencias`, `licencias` (líneas ~67–260).
2. Los índices de `asistencias` (buscá `idx_asistencias`) y justificá cada uno.
3. `fn_calcular_horas` y `fn_evaluar_alertas_empleado` — leelas como "funciones SQL con parámetros y retorno".
4. El trigger `trg_asistencias_empresa` — ¿por qué recalcula `empresa_id`?
5. Queries con join dentro de las rutas: `obtener-empleados`, `dashboard/resumen`.
6. `.agents/DATABASE.md` — las reglas del proyecto sobre BD.

**Ejercicios [SIN IA] (escribí el SQL vos, ejecutalo en el SQL editor de Supabase en modo solo lectura — SELECT):**
1. Listá nombre, puesto y cantidad de asistencias del mes de cada empleado (join de 3 tablas + `GROUP BY`).
2. Encontrá empleados **sin horario asignado** (`empleado_horarios` vacío) — el dashboard los cuenta, replicá la lógica.
3. Calculá la puntualidad % por empleado (contá `estado = 'puntual'` vs total).
4. Listá las 5 empresas con más asistencias en los últimos 7 días.
5. Leé el índice de `asistencias (empresa_id, fecha)` y explicá por qué ese orden de columnas y no al revés.
6. Mirá `.eq('empresa_id', ...)` en 3 rutas distintas: ¿alguna query **no** filtra por empresa? Reportá el hallazgo (no lo arreglíes todavía).

**Preguntas de razonamiento:**
- ¿Por qué `asistencias` guarda `empresa_id` si ya podés llegar a él por `empleados`? (Pista: rendimiento y seguridad.)
- ¿Qué pasaría si borrás un empleado con `DELETE` físico en vez de borrado lógico? Contá las FKs afectadas.
- ¿Por qué `empleado_horarios` tiene `UNIQUE(empleado_id, horario_id)`?

**Listo cuando:** ante una pregunta de negocio ("¿qué empleados excedieron las horas extra este mes?") la escribís en SQL sin ayuda.

---

## Etapa 6 — La feature insignia: asistencia de punta a punta (1–2 semanas)

**Objetivo:** trazarte un flujo real con muchas piezas y entender dónde vive cada decisión.

**Qué aprender:**
- Trazado multi-archivo (route → helpers → SQL → UI).
- Dónde poner la lógica de negocio (¿route? ¿helper? ¿función SQL?) y por qué el proyecto la reparte así.
- Zonas horarias (todo el cálculo de fecha/hora usa la zona de la empresa).
- Concepto de sello HMAC encadenado (integridad anti-manipulación) a nivel conceptual.
- Efectos secundarios en cadena: al cerrar salida → calcular horas → evaluar alertas → auditar.

**Qué estudiar (en este orden):**
1. `src/app/ingreso/page.tsx` — kiosko, generación del QR.
2. `src/app/api/registro-qr/token/route.ts` — creación del token QR.
3. `src/app/api/registro-qr/registrar/route.ts` — el flujo completo de marcaje.
4. `src/lib/utils/horarioUtils.ts` — `determinarEstadoAsistencia`, `calcularEstadoAsistencia`, cooldown, zona horaria.
5. `src/lib/utils/asistenciaSello.ts` + `sello.ts` — escritura con sello + `.rpc()`.
6. `database.sql`: `fn_calcular_horas`, `fn_evaluar_alertas_empleado`.
7. El "gemano" admin: `POST /api/asistencias` (marcaje manual) y `PageEntrada.tsx`.

**Ejercicios:**
1. **[SIN IA]** Dibujá el diagrama completo del marcaje por QR con al menos 10 pasos, nombrando archivo en cada paso. Contrastalo con la sección 4.2 de este documento.
2. **[SIN IA]** Escribí tests unitarios con Vitest para `calcularEstadoAsistencia` (puntual ≤ inicio+15 min, tarde ≤ fin, etc.). Mirá `src/lib/pin/__tests__/pin.test.ts` como ejemplo. Corré `npm run test`.
3. Cambiá el margen de puntualidad de 15 a 10 minutos. **Antes de editar, encontrá con grep todos los lugares donde está esa regla** (hay más de uno: la ruta manual de asistencias la tiene duplicada). Documentá la duplicación.
4. Agregá un tipo de licencia nuevo a `src/lib/constants/licencias.ts` y hacé que aparezca en el modal de crear licencia (ojo: los tipos también viven en la BD como enum — ¿qué tenés que tocar ahí? Escribí el SQL como comentario, **no lo ejecutes**).
5. Abrí la tabla `asistencias` después de marcar una entrada en el kiosko y verificá cómo quedaron los campos de sello. Compará con lo que `asistenciaSello.ts` escribe.

**Preguntas de razonamiento:**
- Si dos empleados marcan al mismo tiempo, ¿qué protege que no se pisen las cadenas de sello? (Pista: leé `fn_sellar_marca` y el upsert de `cadena_sellos`.)
- ¿Por qué el marcaje decide "entrada o salida" en la app y no en la BD?
- Si borrás la función SQL `fn_calcular_horas`, ¿qué deja de funcionar y qué parte de la app lo notaría primero?

**Listo cuando:** podés explicar el marcaje a otra persona de memoria y predecir qué pasa en un caso raro (doble marcaje, empleado sin horario, cruce de medianoche).

---

## Etapa 7 — Autenticación, seguridad y multi-tenant (1 semana)

**Objetivo:** entender quién puede hacer qué, y por qué tu app está (o no) segura.

**Qué aprender:**
- Cookies httpOnly vs localStorage; por qué el JWT viaja en cookie.
- Flujo de login con NextAuth: `authorize`, callbacks `jwt`/`session`.
- Hashing (bcrypt) vs cifrado; por qué las contraseñas nunca se guardan en claro.
- 2FA: TOTP (código de 6 dígitos que cambia) y códigos de backup; el estado "pendiente" antes de existir sesión.
- Guards: middleware (HTTP) vs layout (server component) — y sus limitaciones.
- Rate limiting: fijo por ventana, por IP y por usuario.
- Multi-tenant: qué es un tenant y por qué `empresa_id` en cada query es crítico.
- RLS: qué es y por qué acá está "apagado en la práctica" (service role + REVOKE).

**Qué estudiar:**
1. `src/auth.ts` — `authorize` (líneas ~290–497) y callbacks (~505–638).
2. `src/lib/2fa/pendingLogin.ts` — token hasheado, TTL, un solo uso, bloqueo por intentos.
3. `src/app/api/auth/2fa/verificar/route.ts` — la máquina de estados del 2FA.
4. `src/middleware.ts` (guards) + `src/components/RequireDashboard2FA.tsx` + `PinRequeridoGate`.
5. `src/lib/api/rateLimit.ts` y `src/lib/pin/rateLimitEmpresa.ts`.
6. `database.sql` ~1991–2072: bloque RLS + `REVOKE`.
7. `.agents/SECURITY.md`.

**Ejercicios:**
1. **[SIN IA]** Hacé login con Network + Application → Cookies abiertas. Identificá: cookie de sesión, cookie `norkent_2fa_pending` (si activás 2FA), cookie `norkent_needs_reauth` (al entrar a `/ingreso`). ¿Cuáles son httpOnly?
2. **[SIN IA]** Listá con grep **todas** las rutas que usan `await auth()` y todas las rutas `/api` que NO lo usan. Clasificá: ¿cuáles son públicas a propósito (ej. registro-qr, webhook) y cuáles parecen un descuido?
3. Pensá esta vulnerabilidad (no la exploits): *una API que hace `.from('empleados').select()` sin `.eq('empresa_id', ...)`*. Explicá con tus palabras qué datos se filtrarían. Buscá en el proyecto si existe algún caso.
4. Activá 2FA en tu perfil y hacé el login completo. Escribí el flujo en 8 pasos con los archivos que intervienen.
5. Escribí un test para `esPinValido`/rate limit del PIN (o para una función pura de `src/lib/pin/pin.ts`) y corré `npm run test`.

**Preguntas de razonamiento:**
- ¿Por qué el 2FA no crea la sesión hasta el segundo paso? ¿Qué se rompería si se creara antes?
- Si alguien roba la service role key de Supabase, ¿qué puede hacer? ¿Y si roba la anon key?
- ¿Por qué el rate limit del middleware no protege contra un ataque que ya tiene sesión? (Pista: `limitarPorUsuario`.)

**Listo cuando:** ante una pantalla nueva, sabés qué checks de autorización agregar antes de escribir una sola línea de query.

---

## Etapa 8 — Arquitectura, patrones y calidad (1 semana)

**Objetivo:** dejar de ver funciones sueltas y empezar a ver los patrones que sostienen el sistema.

**Qué aprender:**
- Separación de capas y "dónde vive la lógica" (el criterio para decidir dónde poner código nuevo).
- Caché: cliente (caché compartida de hooks) vs servidor (TTL en memoria), invalidación y staleness.
- Polling vs webhooks vs server-push; por qué `usePolling` pausa con pestaña oculta.
- Paginación y por qué hay límites de rango (366 días, 5000 filas).
- Resiliencia: timeout + circuit breaker (patrón de `resiliencia.ts`).
- Idempotencia: por qué un webhook puede llegar dos veces.
- Auditoría y trazabilidad como requisito de producto, no como adorno.

**Qué estudiar:**
1. `src/lib/hooks/useCacheCompartida.ts` — dedupe + TTL + suscriptores con `useSyncExternalStore`.
2. `src/lib/hooks/usePolling.ts`.
3. `src/lib/api/pagination.ts` + `rateLimit.ts`.
4. `src/lib/external/resiliencia.ts` — leé el estado del cortacircuitos.
5. `src/app/api/dashboard/resumen/route.ts` — caché 30 s + `Promise.all` + métricas derivadas.
6. `src/lib/auditoria.ts`.

**Ejercicios:**
1. **[SIN IA]** Encontrá todos los lugares donde hay lógica de **caché** en el proyecto (hooks + rutas) y hacé una tabla: quién cachea, cuánto TTL, quién invalida.
2. Tomá una ruta GET "caliente" que **no** tenga `limitarPorUsuario` (buscá con grep) y agregalo siguiendo el patrón de `/api/asistencias` (incluyendo `respuestaLimiteExcedido`).
3. Agregá caché de 30 s (mismo patrón del resumen) a una ruta de lectura liviana, con `?refresh=1` para saltarla. Medí con Network la diferencia.
4. Explicá con un dibujo cómo funciona el circuit breaker de `conResilienciaExterna` (qué pasa con los primeros 5 fallos, y con el sexto).
5. Revisá `POST /api/crear-empleado`: contá cuántas validaciones distintas hace y clasifícalas (formato, permisos/tenant, límite de plan, duplicados, integridad FK).

**Preguntas de razonamiento:**
- Si dos requests simultáneas crean la misma suscripción, ¿qué las protege? (Pista: `UNIQUE` + manejo de error 23505.)
- ¿Qué problema resuelve la caché del dashboard y cuál introduce? (Pista: ¿qué pasa si marcás asistencia y el dashboard muestra datos de hasta 30 s?)
- ¿Por qué el proyecto devuelve arreglos JSON en listados en vez de objetos con `{ data, total }`? (Mirá `MEMORY.md`.)

**Listo when:** te dan una feature nueva y ya pensás en: capa, caché, validación, rate limit, auditoría, límite de plan — antes de abrir el editor.

---

## Etapa 9 — Sistemas externos: webhooks y facturación (avanzado, 3–5 días)

**Objetivo:** entender el flujo más complejo del proyecto: eventos que llegan de afuera.

**Qué aprender:**
- Webhooks: qué son, por qué la firma de la request importa, por qué no hay sesión.
- Idempotencia y deduplicación (tabla `commet_eventos`, unique constraints).
- Máquina de estados de una suscripción (`draft/trialing/active/past_due/canceled`).
- El patrón "outbox" (`commet_acciones`) y la sincronización ida y vuelta.

**Qué estudiar:**
1. `src/app/api/(plans)/commet/webhook/route.ts` — verificación de firma + `switch(evento)`.
2. `src/lib/subscriptions/syncSubscription.ts` → `activateSubscription.ts` → `processTransaction.ts`.
3. `src/lib/subscriptions/planActivo.ts` + `planLimits.ts` — cómo el estado se convierte en límites.
4. `src/lib/commet/plans.ts` — mapeo de tiers.
5. Tablas `suscripciones`, `pagos`, `facturas`, `historial_planes` en `database.sql`.

**Ejercicios (teórico/práctico con cuidado — es facturación):**
1. **[SIN IA]** Dibujá el estado de una suscripción desde checkout hasta facturación, nombrando qué archivo/tabla actualiza cada transición.
2. Escribí (en papel) qué respondería el webhook si llega el mismo evento 3 veces.
3. Corré `scripts/crear-webhook-panel.mjs listar` si tenés la key (opcional) para ver los webhooks reales.
4. Modificá algo **cosmético** en la página de planes (un texto) y validá build. No toques la lógica de activación sin confirmación del dueño.
5. Leé `MEMORY.md` §Commet: las decisiones ya tomadas (dos endpoints, uno pausado) y explicá por qué.

**Preguntas de razonamiento:**
- Si el webhook llega **antes** de que el usuario vuelva del checkout, ¿qué evita el doble registro?
- ¿Por qué verificar la firma con el body **crudo** y no el JSON ya parseado?
- Si Commet marca `pending`, ¿por qué no se da acceso al plan? Buscá el comentario en el código.

**Listo cuando:** podés explicar qué pasa si el webhook falla a mitad de camino y qué recuperaría la app al reintentar.

---

## Etapa 10 — Proyecto final: construir una feature solo (1–2 semanas)

**Objetivo real de toda la ruta:** diseñar e implementar algo nuevo **por tu cuenta**.

**Proceso obligatorio (seguilo en orden, como checklist):**

1. **Especificación** — escribí en un `.md` temporal: qué hace, quién la usa, qué datos necesita, qué pasa en los casos borde (sin datos, sin permisos, límite de plan). Si no podés escribirlo, no lo entendés todavía.
2. **Diseño de datos** — ¿hay tabla nueva/columna? Escribí el SQL y pegalo en tu especificación. **No lo apliques**: las migraciones las aplica el dueño manualmente.
3. **API primero** — creá la ruta siguiando el patrón canónico (`auth` → rate limit → validación → query con `empresa_id` → auditoría → respuesta). Revisá una ruta vecina como plantilla.
4. **UI después** — hook + componente siguiendo la estructura `page.tsx`/`Page*.tsx` y `dashboard/ui/`.
5. **Validación** — `npm run lint && npm run type-check && npm run test && npm run build` y prueba manual en navegador.
6. **Revisión cruzada** — recién acá consultá a la IA **como reviewer**: *"revisá este diff y decime qué falta según las convenciones del proyecto"*.

**Ideas de features (de menor a mayor dificultad):**

| # | Feature | Toca |
|---|---|---|
| 1 | Filtro por cargo en la lista de Personal | UI + query existente |
| 2 | Exportar asistencias del período a CSV | UI + API + paginación |
| 3 | Nuevo tipo de licencia | constants + UI + enum BD (SQL escrito, no aplicado) |
| 4 | Widget "cumpleaños de la semana" en Inicio | API nueva + dashboard |
| 5 | Recordatorio por email de licencias que empiezan mañana | cron + Resend + resiliencia |
| 6 | Filtro por empleado en Analíticas | agregaciones SQL |
| 7 | Endpoint público de estado del kiosko (¿QR vigente?) | seguridad + rate limit |
| 8 | Limite real de empleados por plan en frontend y backend | planLimits + UI + test |

**Criterio de aprobación de tu feature:** pasa lint/type-check/build, filtra por `empresa_id`, deja auditoría si escribe, respeta límites de plan, y **vos podés explicar cada línea**.

---

# PARTE C — Rutina, validación y anti-trampas

## Comandos de validación

```bash
npm run dev          # desarrollo local
npm run lint         # ESLint
npm run type-check   # TypeScript sin compilar
npm run test         # Vitest
npm run build        # build completo (incluye type-check + lint)
```

Regla: **ninguna etapa se da por cerrada sin los 4 primeros en verde.** Distinguí siempre errores que introdujiste vos de los que ya existían.

## Semana tipo sugerida

| Día | Actividad |
|---|---|
| Lun | 20 min teoría puntual del tema + leer los archivos de estudio |
| Mar | Ejercicio 1 y 2 (los **[SIN IA]**) |
| Mié | Ejercicio 3 + romper cosas a propósito + Network |
| Jue | Ejercicio de "encontrar/duplicar patrón" + preguntas de razonamiento |
| Vie | Revisión: explicarle el tema a alguien (o en voz alta) sin mirar |
| Sáb | Mini-ejercicio libre sobre el proyecto + validar todo |
| Dom | Descanso / lectura libre (`MEMORY.md`, `docs/`) |

## Anti-patrones a evitar

1. **Pedir "hacelo" en vez de "explicame".** Si la IA te escribe 100 líneas, no aprendiste nada.
2. **Copiar archivos enteros como plantilla** sin leerlos. Preferí: leer 2 vecinos → escribir el tuyo → comparar.
3. **Saltar a la Etapa 9/10 con las bases flojas.** Si no dominás async + React + una API route, nada de lo avanzado se sostiene.
4. **Tocar `database.sql` o migraciones para practicar.** El esquema es de producción: practicá con `SELECT` y con cambios de aplicación.
5. **Modificiar en `main`.** Usá ramas: `git checkout -b aprendizaje/etapa-N`.
6. **Confundir "funciona" con "entendí".** El criterio real es: ¿podés explicarlo sin mirar el código?

## Cómo pedirle ayuda a la IA (script de prompts)

- **Nivel 1 (orientación):** *"Estoy en la Etapa N. Mirá `archivo X` y decime SOLO qué conceptos nuevos usa que yo debería estudiar, sin explicarme el código."*
- **Nivel 2 (preguntas):** *"Mi ejercicio falla con este error. No me des la solución: haceme 3 preguntas para que yo lo encuentre."*
- **Nivel 3 (revisión):** *"Acá está mi diff. Revisalo contra las convenciones de `.agents/DEVELOPMENT.md` y señalá qué falta. No lo corrijas."*
- **Prohibido:** pedir el código completo de un ejercicio marcado **[SIN IA]**.

---

## Progreso por etapa

| Etapa | Tema | Estado |
|---|---|---|
| 0 | Terreno y brújula | ⬜ |
| 1 | TypeScript | ⬜ |
| 2 | React | ⬜ |
| 3 | Async/HTTP/fetch | ⬜ |
| 4 | Next.js App Router | ⬜ |
| 5 | Base de datos relacional | ⬜ |
| 6 | Feature asistencia | ⬜ |
| 7 | Auth y seguridad | ⬜ |
| 8 | Arquitectura y patrones | ⬜ |
| 9 | Webhooks y facturación | ⬜ |
| 10 | Proyecto final (feature propia) | ⬜ |

*Actualizá esta tabla a medida que avances. Si una etapa se estanca más de una semana, volvé a la anterior y repetí sus ejercicios con otro archivo.*
