export type StageStatus = "pendiente" | "en-curso" | "completada";

export const STATUS_LABEL: Record<StageStatus, string> = {
  pendiente: "Pendiente",
  "en-curso": "En curso",
  completada: "Completada",
};

export const STATUS_ORDER: StageStatus[] = ["pendiente", "en-curso", "completada"];

export interface StudyFile {
  path: string;
  note: string;
}

export interface Exercise {
  text: string;
  sinIa?: boolean;
}

export interface MiniProject {
  title: string;
  difficulty: number;
  brief: string;
  approval: string;
}

export interface Stage {
  id: number;
  title: string;
  duration: string;
  level?: string;
  tags: string[];
  objective: string;
  theory: string[];
  practice: string[];
  study: StudyFile[];
  searchTerms: string[];
  exercises: Exercise[];
  questions: string[];
  miniProject: MiniProject;
  doneWhen: string;
  validation?: string;
  extra?: { label: string; items: string[] };
}

export const ROUTE_META = {
  project: "Norkent",
  title: "Ruta de aprendizaje",
  span: "8–12 semanas",
  pace: "1–2 h por día",
  stageCount: 11,
  intro:
    "Guía para reaprender programación estudiando y modificando tu propio proyecto. Práctica primero, teoría después: una etapa se cierra cuando podés explicarla sin mirar el código, no cuando «funciona».",
  skipLink: "Saltar al contenido",
};

export interface RouteEntry {
  slug: string;
  href: string;
  name: string;
  title: string;
  blurb: string;
  stageCount: number;
  span: string;
  pace: string;
}

export const ROUTES: RouteEntry[] = [
  {
    slug: "norkent",
    href: "/ruta",
    name: "Norkent",
    title: "Ruta de aprendizaje",
    blurb:
      "Reaprendé programación estudiando y modificando tu propio proyecto. Cada etapa junta teoría, práctica en el código real, ejercicios y un mini proyecto de dificultad creciente.",
    stageCount: ROUTE_META.stageCount,
    span: ROUTE_META.span,
    pace: ROUTE_META.pace,
  },
];

export const VALIDATION_COMMANDS = [
  "npm run dev",
  "npm run lint",
  "npm run type-check",
  "npm run test",
  "npm run build",
];

export const HOW_TO_RULES = [
  "Práctica primero, teoría después. Cada etapa tiene ejercicios sobre el código real; la teoría aparece cuando la necesitás para resolver uno.",
  "Antes de pedir una respuesta, contestá las preguntas de razonamiento de la etapa. Si no podés, aún no pasaste de etapa.",
  "Cuando te trabes: 15–20 minutos intentándolo (rompiendo cosas, `console.log`, pestaña Network) y recién ahí consultá a la IA — pidiendo preguntas, no código.",
  "Validá siempre con los comandos del proyecto antes de dar un ejercicio por terminado.",
  "Trabajá en una rama (`git checkout -b aprendizaje/etapa-N`). Nunca modifiques `database.sql`, `MEMORY.md`, `messages/`, `.agents/` ni `docs/`.",
];

export const ANTI_PATTERNS = [
  "Pedir «hacelo» en vez de «explicame». Si la IA te escribe 100 líneas, no aprendiste nada.",
  "Copiar archivos enteros como plantilla sin leerlos. Preferí: leer 2 vecinos → escribir el tuyo → comparar.",
  "Saltar a la Etapa 9/10 con las bases flojas. Si no dominás async + React + una API route, nada de lo avanzado se sostiene.",
  "Tocar `database.sql` o migraciones para practicar. El esquema es de producción: practicá con `SELECT` y con cambios de aplicación.",
  "Modificar en `main`. Usá ramas: `git checkout -b aprendizaje/etapa-N`.",
  "Confundir «funciona» con «entendí». El criterio real es: ¿podés explicarlo sin mirar el código?",
];

export const stages: Stage[] = [
  {
    id: 0,
    title: "Estructura del proyecto y comandos",
    duration: "½ día",
    tags: ["Carpetas", "Comandos"],
    objective: "Que el proyecto deje de ser una caja negra a nivel de carpetas.",
    theory: [
      "La estructura de un proyecto Next.js y para qué existe cada carpeta: `src/app` (rutas y pantallas), `src/components` (UI), `src/lib` (lógica) y `src/types` (tipos).",
      "Arquitectura en capas: UI → hooks → API routes → lib → base de datos. Cada capa habla con la de abajo y no saltea capas.",
      "Qué verifica cada comando: `lint` (estilo del código), `type-check` (tipos), `test` (comportamiento) y `build` (compilación completa).",
      "Por qué se trabaja en una rama de git: podés descartar ejercicios sin miedo a romper el proyecto.",
    ],
    practice: [
      "Seguí un dato real del listado de Personal: `page.tsx` → hook → `/api/...` → `lib/` → Supabase. Ese es el camino de cualquier pantalla del panel.",
      "Las API routes viven en `src/app/api/`; las carpetas entre paréntesis (`(empleados)`, `(asistencias)`) organizan sin cambiar la URL.",
      "Toda pantalla del panel sigue la misma estructura: `page.tsx` como shell y un `Page*.tsx` con la lógica.",
      "El cliente nunca habla directo con la base de datos: todo dato pasa por una API route que valida la sesión y filtra por `empresa_id`.",
    ],
    study: [
      {
        path: "RUTA_APRENDIZAJE_PROYECTO.md",
        note: "Parte A: stack, árbol del proyecto, arquitectura en capas y flujos de datos.",
      },
      { path: "AGENTS.md", note: "Las reglas que ya gobiernan el proyecto." },
      { path: ".agents/DEVELOPMENT.md", note: "Convenciones de desarrollo del repo." },
      { path: "docs/INVENTARIO_FUNCIONALIDADES.md", note: "Qué features existen hoy." },
    ],
    searchTerms: [
      "Next.js App Router estructura de carpetas de un proyecto",
      "arquitectura en capas de una aplicación web",
      "qué hacen los comandos lint y type-check en npm",
      "route groups en Next.js para qué sirven",
      "git crear una rama y descartar cambios",
    ],
    exercises: [
      {
        text: "Corré `npm run dev`, abrí `/dashboard` y la home pública. Mirá la pestaña Network e identificá las llamadas a `/api/...` que dispara el dashboard.",
        sinIa: true,
      },
      {
        text: "Contestá en un papel: ¿qué hace cada carpeta de `src/`? (Podés contrastarlo con el árbol del documento.)",
        sinIa: true,
      },
      {
        text: "Corré `npm run lint`, `npm run type-check` y `npm run test`, y anotá qué pasa en cada uno.",
      },
    ],
    questions: [
      "Si quiero cambiar un texto del botón «Crear empleado», ¿en cuántos archivos podría estar?",
      "Si quiero cambiar la tabla `empleados`, ¿qué otros archivos quedan desactualizados?",
    ],
    miniProject: {
      title: "Mapa del proyecto",
      difficulty: 1,
      brief:
        "Creá un `MAPA_DEL_PROYECTO.md` propio con el árbol de carpetas de Norkent y, en una línea por carpeta, qué vive ahí y por qué importa. Agregá una tabla con los comandos de validación y qué devuelve cada uno hoy.",
      approval:
        "Sin mirar el árbol, respondés «¿dónde vive X?» en menos de 10 segundos, y los comandos están anotados con su salida real.",
    },
    doneWhen: "Podés navegar el árbol sin mirar y saber qué buscar primero.",
  },
  {
    id: 1,
    title: "TypeScript: leer y escribir tipos",
    duration: "3–5 días",
    tags: ["TypeScript", "Tipos", "Módulos"],
    objective: "Que el tipado deje de ser ruido y pase a ser tu sistema de ayuda.",
    theory: [
      "Tipos primitivos (`string`, `number`, `boolean`), `null` y `undefined`, y la diferencia entre un valor ausente y uno vacío.",
      "`interface` vs `type`, propiedades opcionales (`?`) y uniones (`'a' | 'b'`).",
      "Tipado de funciones: parámetros y tipo de retorno; cuándo TypeScript infiere solo y cuándo hay que declarar.",
      "`const` assertions y `as`: para qué sirven y por qué `as` apaga la verificación en lugar de comprobarla.",
      "Genéricos mínimos: qué es `<T>` y por qué existe `useState<string>`.",
      "Módulos: `import`/`export`, `import type` y por qué los tipos se separan de los valores.",
    ],
    practice: [
      "`src/types/` guarda tipos escritos a mano: `database.ts` es un reflejo parcial de `database.sql` y ya tiene drift (columnas que faltan).",
      "`ApiResponse` tipa la respuesta de todas las APIs: éxito y error conviven en un solo tipo.",
      "`next-auth.d.ts` usa *module augmentation* para agregar campos al `session` de NextAuth.",
      "En `planes.ts` las uniones de strings modelan los tiers y las características de los planes.",
      "Un error de `type-check` es tu ayuda: leelo completo, de abajo hacia arriba, hasta encontrar la línea exacta.",
    ],
    study: [
      {
        path: "src/types/database.ts",
        note: "Tipos de las tablas principales: el reflejo manual (y parcial) de `database.sql`.",
      },
      { path: "src/types/index.ts", note: "Tipos compartidos: `ApiResponse`, respuestas de las APIs." },
      {
        path: "src/types/next-auth.d.ts",
        note: "Module augmentation: cómo se «extiende» el `session` de NextAuth.",
      },
      { path: "src/lib/constants/planes.ts", note: "Unions de strings y tipos de características." },
      {
        path: "grep: EstadoAsistencia · ApiResponse · LimitesPlan",
        note: "Buscá dónde se definen y dónde se usan.",
      },
    ],
    searchTerms: [
      "TypeScript interface vs type cuándo usar cada uno",
      "TypeScript propiedades opcionales null vs undefined",
      "TypeScript union types ejemplos prácticos",
      "TypeScript genéricos qué es <T>",
      "TypeScript import type vs import normal",
      "TypeScript module augmentation extender tipos",
    ],
    exercises: [
      {
        text: "Abrí `src/types/database.ts`, elegí `Empleado` y escribí en un papel todas las columnas que no tiene pero sí existen en `database.sql`. ¿Qué consecuencias puede tener ese «drift»?",
        sinIa: true,
      },
      {
        text: "En cualquier archivo `.ts`, cambiá un valor a propósito a un tipo inválido (ej. `const x: number = \"hola\"`) y corré `npm run type-check`. Leé el error completo hasta entenderlo. Revertí.",
        sinIa: true,
      },
      {
        text: "Creá un archivo temporal `src/lib/utils/__aprendizaje.ts` con una función tipada que reciba un `Empleado` y devuelva su nombre y puesto. Corré `type-check`. Borralo al terminar.",
      },
    ],
    questions: [
      "¿Qué diferencia hay entre `string | null` y `string | undefined`? Mirá cómo se usan `eliminado_en` y `foto_url`.",
      "Si una API devuelve `{ error: string }` en fallo y un arreglo en éxito, ¿cómo tiparías eso? (Mirá `ApiResponse` en `src/types/index.ts`.)",
    ],
    miniProject: {
      title: "Tipos del esquema",
      difficulty: 2,
      brief:
        "Creá `src/types/__aprendizaje.ts` con una `interface Empleado` completa (todas las columnas de `database.sql`), un union `EstadoAsistencia` y dos funciones tipadas: `formatearEmpleado` y `esBorradoLogico`. Pasá `npm run type-check` sin errores.",
      approval:
        "El archivo pasa `type-check` y podés explicar por qué cada columna quedó como `string | null` o `string | undefined`.",
    },
    doneWhen: "Leés un error de TypeScript y sabés indicar la línea exacta del problema.",
  },
  {
    id: 2,
    title: "React: componentes, estado y hooks",
    duration: "1 semana",
    tags: ["React", "Estado", "Hooks"],
    objective: "Poder modificar y crear UI del dashboard sin copiar y pegar.",
    theory: [
      "Componentes función, props y JSX: qué renderiza React y cuándo lo vuelve a renderizar.",
      "`useState`: el estado no cambia «solo»; asignar no actualiza, hay que llamar al actualizador.",
      "`useEffect`: cuándo se ejecuta, el array de dependencias y el cleanup al desmontar.",
      "Eventos (`onClick`, `onChange`) y formularios controlados: el estado es la fuente de verdad del input.",
      "Listas con `map` y por qué `key` identifica cada fila entre renders.",
      "Custom hooks: qué es un hook, cómo se compone uno propio y por qué el proyecto tiene 33.",
    ],
    practice: [
      "Convención de pantallas: `page.tsx` es el shell (Sidebar y contenedor) y la lógica vive en el hermano `Page*.tsx`.",
      "`PagePersonal.tsx` concentra filtros, selección y modales abiertos: así se ve el estado real de una pantalla.",
      "Los modales de `dashboard/modals/` son el patrón de UI reutilizable (41 modales: crear, editar, eliminar, detalles).",
      "Botones, inputs y selects propios viven en `dashboard/ui/` en vez de una librería completa.",
    ],
    study: [
      { path: "src/components/dashboard/ui/Button.tsx", note: "Componente pequeño con props y variantes." },
      {
        path: "src/components/dashboard/modals/mensajes/ModalInfo.tsx",
        note: "Modal simple (junto a `ModalExito.tsx`): el caso mínimo de componente con estado.",
      },
      { path: "src/app/dashboard/personal/page.tsx", note: "El shell: 5 líneas de lógica." },
      {
        path: "src/app/dashboard/personal/PagePersonal.tsx",
        note: "Estado real: filtros, selección, modales abiertos.",
      },
      {
        path: "src/components/dashboard/modals/crear/ModalCrearEmpleado.tsx",
        note: "538 líneas: formulario grande con subida de foto.",
      },
    ],
    searchTerms: [
      "React useState cómo funciona el actualizador",
      "React useEffect dependencias y cleanup ejemplo",
      "React formularios controlados controlled components",
      "React listas map y por qué key es importante",
      "custom hooks en React qué son y cuándo usarlos",
    ],
    exercises: [
      {
        text: "En `PagePersonal.tsx`, cambiá el límite de filas visible o el texto de un título. Validá con `npm run lint && npm run type-check`.",
        sinIa: true,
      },
      {
        text: "Agregá un campo de búsqueda nuevo con `useState` que filtre por algo que hoy no filtra (ej. por cargo). Observá cómo el proyecto ya filtra y seguí el mismo patrón.",
        sinIa: true,
      },
      {
        text: "Extrá de un modal grande un componente hijo (p. ej. la sección de la foto) a un archivo nuevo en `src/components/dashboard/modals/`. Que el modal siga funcionando igual.",
      },
      {
        text: "Creá un componente `BadgeEstado` nuevo en `src/components/dashboard/ui/` que muestre el estado de asistencia con color, y usalo en `PageEntrada.tsx`.",
      },
      {
        text: "Agregá un `useEffect` que haga `console.log` cada vez que cambia el listado filtrado. Explicá por qué se dispara (o no) esa cantidad de veces.",
      },
    ],
    questions: [
      "¿Por qué los proyectos de React no actualizan el DOM directo, y qué pasa si hacés `state = 5` en vez de `setState(5)`?",
      "En `PagePersonal`, ¿por qué el estado vive en `Page*.tsx` y no en `page.tsx`?",
      "¿Qué problema resuelve `key` en un `map`?",
    ],
    miniProject: {
      title: "Pantalla de práctica en el dashboard",
      difficulty: 2,
      brief:
        "Creá `/dashboard/practica` con el patrón del proyecto (`page.tsx` shell + `PagePractica.tsx`), un listado renderizado con `map` y `key`, un campo de búsqueda con `useState` y un componente `BadgeEstado` propio en `dashboard/ui/`.",
      approval:
        "Lint, type-check y build en verde, y la pantalla filtra en vivo en el navegador sin copiar ningún archivo entero.",
    },
    doneWhen: "Agregás una funcionalidad pequeña de UI por tu cuenta sin copiar un archivo entero.",
    validation: "npm run lint · npm run type-check · npm run build + prueba manual en el navegador.",
  },
  {
    id: 3,
    title: "Asincronía: promesas, fetch y HTTP",
    duration: "3–4 días",
    tags: ["HTTP", "fetch", "Promesas"],
    objective: "Entender el corazón mecánico de toda la app: pedir datos y esperarlos.",
    theory: [
      "Promesas: `then/catch`, `async/await` y `try/catch`; qué pasa si no esperás un `await`.",
      "`fetch`: URL, método, headers, body, `res.ok`, `res.json()` y los errores de red que no tiran excepción.",
      "Códigos de estado HTTP (200/201/400/401/403/404/409/429/500) y qué significa cada uno en una API.",
      "`Promise.all`: ejecutar varias promesas en paralelo y fallar todas juntas si una falla.",
      "La pestaña Network como herramienta de debugging: qué salió, qué volvió y cuánto tardó.",
    ],
    practice: [
      "Los hooks del cliente (`useEmpleados`, `useAsistencias`) hacen el `fetch` y guardan la respuesta tipada.",
      "El total del listado viene en el header `X-Total-Count` para paginar sin traer todo de una.",
      "`dashboard/resumen` corre 10 queries en paralelo con `Promise.all` y las une en una respuesta.",
      "Cada `route.ts` responde con el código correcto: 401 sin sesión, 429 si pasa el rate limit, 404 si no existe.",
    ],
    study: [
      { path: "src/lib/hooks/useEmpleados.ts", note: "Fetch simple + tipado de la respuesta." },
      {
        path: "src/lib/hooks/useAsistencias.ts",
        note: "Fetch con query params, headers `X-Total-Count` y evitación de re-renders inútiles.",
      },
      {
        path: "src/app/api/dashboard/resumen/route.ts",
        note: "`Promise.all` de 10 queries en paralelo.",
      },
      {
        path: "src/app/api/(empleados)/obtener-empleados/route.ts",
        note: "El lado servidor de ese fetch.",
      },
    ],
    searchTerms: [
      "promesas en JavaScript async await explicado",
      "fetch API res.ok res.json manejo de errores",
      "códigos de estado HTTP 401 403 404 409 429",
      "Promise.all ejecución en paralelo ejemplos",
      "Chrome DevTools pestaña Network filtrar fetch XHR",
    ],
    exercises: [
      {
        text: "Abrí Network → filtro «Fetch/XHR» → recargá Personal. Encontrá la llamada a `/api/obtener-empleados`: copiá la URL, abrila en otra pestaña y leé el JSON crudo.",
        sinIa: true,
      },
      {
        text: "Escribí a mano un hook `src/lib/hooks/__aprendizaje/useHola.ts` que haga `fetch('/api/obtener-empleados')`, tenga `loading`, `error` y `datos`, y lo uses en un `Page*` temporal. Corré lint + type-check. Borralo después.",
        sinIa: true,
      },
      {
        text: "Rompé a propósito la URL del fetch (ej. `/api/no-existe`) y manejá el error mostrando un mensaje en pantalla.",
      },
      {
        text: "Mirá cómo `useAsistencias` lee `X-Total-Count` con `res.headers.get(...)`. Explicá por qué el proyecto devuelve el total en headers y no en el body.",
      },
      {
        text: "Leé el `try/catch` de cualquier `route.ts`: ¿qué responde si la query a Supabase falla? ¿Y si no hay sesión?",
      },
    ],
    questions: [
      "¿Qué diferencia hay entre esperar un `await` y no esperarlo? (Pista: ¿qué pasa si mandás la respuesta antes de terminar de escribir en la BD?)",
      "¿Por qué el proyecto usa `Promise.all` en el resumen del dashboard en vez de esperar una query y después otra?",
    ],
    miniProject: {
      title: "Cliente fetch tipado",
      difficulty: 3,
      brief:
        "Escribí `src/lib/hooks/useFetchJson.ts` genérico (con `datos`, `loading` y `error`) y una `Page*` temporal que lo use contra `/api/obtener-empleados`, mostrando por separado los estados: cargando, vacío, 401, 429 y 500.",
      approval:
        "Romper la URL a propósito muestra el estado de error en pantalla, y al recuperarla vuelve a cargar los datos — todo con lint y type-check en verde.",
    },
    doneWhen: "Podés leer cualquier `route.ts` y explicar paso a paso qué le llega y qué devuelve.",
  },
  {
    id: 4,
    title: "Next.js App Router y el ciclo de una request",
    duration: "1 semana",
    tags: ["Next.js", "App Router", "Middleware"],
    objective: "Entender el esqueleto: rutas, layouts, server/client, middleware, API routes.",
    theory: [
      "Convención de archivos: `page.tsx`, `layout.tsx`, `route.ts`, `loading.tsx`, `error.tsx` y qué hace cada uno.",
      "Route groups `(carpeta)` y dynamic segments `[param]`: organizan rutas sin cambiar la URL pública.",
      "Server components vs client components (`\"use client\"`): qué corre en el servidor, qué en el navegador y por qué importa.",
      "API routes: exportar `GET`/`POST`/`PUT`/`DELETE`, recibir `Request` y devolver `Response` con `searchParams`.",
      "Middleware: qué corre antes que cada request, y sus límites (no reemplaza los guards de pantalla).",
      "`metadata` / `generateMetadata` en server components; los client components no lo pueden exportar.",
    ],
    practice: [
      "`middleware.ts` actúa en este orden: rate limit → i18n → sesión → plan → cookies.",
      "El layout del dashboard apila guards server-side: `RequireDashboard2FA` → `RequireOnboarding` → PIN.",
      "El GET de `/api/asistencias` muestra el patrón de query params: validación con regex, paginación y respuesta con headers.",
      "El sitio público es server-side con `getTranslations`; el panel tiene 123 archivos con `\"use client\"` — ahí está la frontera.",
      "El guard de plan está en el middleware y en `RequireOnboarding` porque Next no re-ejecuta layouts en la navegación client-side.",
    ],
    study: [
      { path: "src/middleware.ts", note: "Línea por línea: rate limit → i18n → sesión → plan → cookies." },
      {
        path: "src/app/dashboard/layout.tsx",
        note: "Junto a `RequireOnboarding.tsx` y `RequireDashboard2FA.tsx`: la pila de guards.",
      },
      {
        path: "src/app/api/(asistencias)/asistencias/route.ts",
        note: "GET con query params y paginación.",
      },
      {
        path: "src/app/(public)/[locale]/layout.tsx",
        note: "Layout multi-idioma y una `page.tsx` server con `getTranslations`.",
      },
      {
        path: "grep: \"use client\"",
        note: "Contá los archivos (123) y comparalos con los server: ¿dónde está la frontera?",
      },
    ],
    searchTerms: [
      "Next.js App Router page layout route.ts diferencias",
      "Next.js server components vs use client",
      "Next.js middleware redirects guards",
      "Next.js API routes GET POST con Request Response",
      "Next.js metadata generateMetadata server components",
    ],
    exercises: [
      {
        text: "Dibujá en un papel el recorrido de `GET /api/asistencias?fecha=2026-09-01`: desde el `fetch` del hook hasta el `supabase.from('asistencias')`, nombrando cada archivo.",
        sinIa: true,
      },
      {
        text: "Agregá un parámetro opcional `estado` al GET de `/api/asistencias` que filtre `.eq('estado', estado)`. Validalo con regex como los demás parámetros. Probalo con Network.",
        sinIa: true,
      },
      {
        text: "Creá una ruta API nueva `GET /api/ping-apprendizaje` que siga el patrón exacto del proyecto (auth → 401 si no hay sesión → responde `{ ok: true, empresa: session.empresa.id }`). Verificá que no filtre datos de otra empresa.",
      },
      {
        text: "Observá el guard de plan: sacalo temporalmente de `middleware.ts`, entrá a `/dashboard` sin plan y explicá qué pasa (revertí después — es una protección importante).",
      },
      {
        text: "Explicá con dos líneas cada uno: ¿qué hace `src/app/dashboard/layout.tsx` y por qué los guards están ahí y no en cada página?",
      },
    ],
    questions: [
      "¿Por qué el guard de plan vive en el middleware y en `RequireOnboarding` si es el mismo check? (Mirá el comentario en `MEMORY.md` sobre navegación client-side.)",
      "Si escribís `export const dynamic = 'force-dynamic'` en una página, ¿qué cambia? ¿El proyecto lo usa? ¿Dónde?",
      "Cuando el middleware redirige, ¿eso es un redirect del navegador o de React?",
    ],
    miniProject: {
      title: "Ruta API propia",
      difficulty: 3,
      brief:
        "Creá `GET /api/apprendizaje-resumen` siguiendo el patrón fijo del proyecto: `auth()` → rate limit → validación de query params con regex → query con `empresa_id` → respuesta paginada. Consumila desde tu hook de la etapa 3 en una página temporal.",
      approval:
        "Con Network verificás que responde 401 sin sesión, 429 al pasarse del límite y que jamás devuelve datos de otra empresa.",
    },
    doneWhen:
      "Ante cualquier pantalla del dashboard, sabés decir qué layout la protege, qué APIs llama y qué tablas toca.",
  },
  {
    id: 5,
    title: "SQL y base de datos relacional",
    duration: "1 semana",
    tags: ["SQL", "PostgreSQL", "Índices"],
    objective: "Pasar de «SQL básico» a leer el esquema y escribir las queries que la app necesita.",
    theory: [
      "Leer DDL: `CREATE TABLE`, tipos, `REFERENCES` (FK), `UNIQUE`, `CHECK`, `DEFAULT` y enums.",
      "Consultas: `JOIN` (inner/left), `GROUP BY` con agregados, `HAVING`, subqueries y `CASE`.",
      "Índices: qué son, cuándo conviene crearlos y cómo se lee un índice compuesto.",
      "`ON CONFLICT ... DO UPDATE` (upsert) y `RETURNING`.",
      "Diseño relacional: desnormalización, borrado lógico, triggers y funciones PL/pgSQL (solo lectura en tu práctica).",
    ],
    practice: [
      "El esquema completo vive en `database.sql`: 35 tablas, 26 funciones y triggers. Es la fuente única de verdad.",
      "Las queries con join reales están en `obtener-empleados` y `dashboard/resumen`.",
      "`fn_calcular_horas` y `fn_evaluar_alertas_empleado` calculan horas y alertas en SQL y se llaman con `.rpc()`.",
      "Cada query filtra por `empresa_id`: el aislamiento entre empresas (multi-tenant) se resuelve consulta por consulta.",
      "Tu práctica es solo lectura: `SELECT` en el SQL editor de Supabase. El esquema es de producción.",
    ],
    study: [
      {
        path: "database.sql",
        note: "Tablas `usuarios`, `empresas`, `empleados`, `horarios`, `empleado_horarios`, `asistencias`, `licencias` (líneas ~67–260).",
      },
      { path: "database.sql", note: "Los índices de `asistencias` (buscá `idx_asistencias`) y la justificación de cada uno." },
      {
        path: "database.sql",
        note: "`fn_calcular_horas` y `fn_evaluar_alertas_empleado`: leelas como funciones con parámetros y retorno.",
      },
      {
        path: "database.sql",
        note: "El trigger `trg_asistencias_empresa`: ¿por qué recalcula `empresa_id`?",
      },
      {
        path: "src/app/api/(empleados)/obtener-empleados/route.ts",
        note: "Queries con join dentro de las rutas (junto a `dashboard/resumen`).",
      },
      { path: ".agents/DATABASE.md", note: "Las reglas del proyecto sobre base de datos." },
    ],
    searchTerms: [
      "SQL CREATE TABLE FOREIGN KEY UNIQUE CHECK ejemplos",
      "SQL JOIN GROUP BY con agregados ejercicios",
      "PostgreSQL índices compuestos cómo funcionan",
      "PostgreSQL upsert ON CONFLICT RETURNING",
      "PostgreSQL triggers y funciones PL/pgSQL ejemplo",
      "borrado lógico vs borrado físico en bases de datos",
    ],
    exercises: [
      {
        text: "Listá nombre, puesto y cantidad de asistencias del mes de cada empleado (join de 3 tablas + `GROUP BY`).",
        sinIa: true,
      },
      {
        text: "Encontrá empleados sin horario asignado (`empleado_horarios` vacío) — el dashboard los cuenta, replicá la lógica.",
        sinIa: true,
      },
      { text: "Calculá la puntualidad % por empleado (contá `estado = 'puntual'` vs total).", sinIa: true },
      { text: "Listá las 5 empresas con más asistencias en los últimos 7 días.", sinIa: true },
      {
        text: "Leé el índice de `asistencias (empresa_id, fecha)` y explicá por qué ese orden de columnas y no al revés.",
        sinIa: true,
      },
      {
        text: "Mirá `.eq('empresa_id', ...)` en 3 rutas distintas: ¿alguna query no filtra por empresa? Reportá el hallazgo (no lo arreglíes todavía).",
        sinIa: true,
      },
    ],
    questions: [
      "¿Por qué `asistencias` guarda `empresa_id` si ya podés llegar a él por `empleados`? (Pista: rendimiento y seguridad.)",
      "¿Qué pasaría si borrás un empleado con `DELETE` físico en vez de borrado lógico? Contá las FKs afectadas.",
      "¿Por qué `empleado_horarios` tiene `UNIQUE(empleado_id, horario_id)`?",
    ],
    miniProject: {
      title: "Consultas de negocio en SQL",
      difficulty: 3,
      brief:
        "Creá `consultas-apprendizaje.sql` con cinco consultas: asistencias del mes por empleado (3 tablas + `GROUP BY`), empleados sin horario, puntualidad % por empleado, top 5 de empresas en 7 días, y la explicación del índice `(empresa_id, fecha)`. Ejecutalas en modo solo lectura (SELECT) en el SQL editor de Supabase.",
      approval:
        "Las cinco corren sin error y podés justificar de memoria cada join y cada índice que mencionás.",
    },
    doneWhen:
      "Ante una pregunta de negocio («¿qué empleados excedieron las horas extra este mes?») la escribís en SQL sin ayuda.",
  },
  {
    id: 6,
    title: "Flujo de asistencia de punta a punta",
    duration: "1–2 semanas",
    tags: ["QR", "Zona horaria", "HMAC"],
    objective: "Trazarte un flujo real con muchas piezas y entender dónde vive cada decisión.",
    theory: [
      "Trazar un flujo multi-archivo: route → helpers → SQL → UI, nombrando cada paso antes de tocar código.",
      "Dónde vive la lógica de negocio: ¿en la route? ¿en un helper de `lib/`? ¿en una función SQL? — y el criterio para decidir.",
      "Zonas horarias: fecha y hora se calculan con la zona horaria de la empresa, no con la del servidor.",
      "Sello HMAC encadenado: integridad anti-manipulación a nivel conceptual (qué garantiza, sin matemáticas).",
      "Efectos en cadena: al cerrar la salida → calcular horas → evaluar alertas → registrar auditoría.",
    ],
    practice: [
      "El kiosko `/ingreso` genera un token QR efímero y el empleado marca desde una página pública sin sesión.",
      "`registrar/route.ts` valida el token, el empleado, la zona horaria, el cooldown de 60 s y decide entrada o salida.",
      "`horarioUtils.ts` decide puntual/tarde/fuera de horario; la ruta manual de asistencias tiene esa regla duplicada.",
      "La escritura guarda el sello, avanza la cadena de `cadena_sellos` y después llama a `.rpc('fn_calcular_horas')`.",
      "Cada marcaje deja un registro de auditoría como «Sistema (QR)».",
    ],
    study: [
      { path: "src/app/ingreso/page.tsx", note: "Kiosko y generación del QR." },
      { path: "src/app/api/registro-qr/token/route.ts", note: "Creación del token QR (fila efímera en `qr_tokens`)." },
      { path: "src/app/api/registro-qr/registrar/route.ts", note: "El flujo completo de marcaje, paso a paso." },
      {
        path: "src/lib/utils/horarioUtils.ts",
        note: "`determinarEstadoAsistencia`, `calcularEstadoAsistencia`, cooldown y zona horaria.",
      },
      { path: "src/lib/utils/asistenciaSello.ts", note: "Escritura con sello y llamadas a `.rpc()` (con `sello.ts`)." },
      { path: "database.sql", note: "`fn_calcular_horas` y `fn_evaluar_alertas_empleado`." },
      {
        path: "src/app/api/(asistencias)/asistencias/route.ts",
        note: "El «gemano» admin: marcaje manual (POST) y `PageEntrada.tsx`.",
      },
    ],
    searchTerms: [
      "qué es HMAC y cómo firma encadenada protege datos",
      "zona horaria en aplicaciones fecha y hora del usuario",
      "flujo de dos pasos con token efímero ejemplos",
      "cómo escribir tests unitarios con Vitest",
      "qué es la auditoría de cambios en una aplicación",
      "cooldown rate limit anti abuso en marcas de asistencia",
    ],
    exercises: [
      {
        text: "Dibujá el diagrama completo del marcaje por QR con al menos 10 pasos, nombrando archivo en cada paso. Contrastalo con la sección 4.2 del documento.",
        sinIa: true,
      },
      {
        text: "Escribí tests unitarios con Vitest para `calcularEstadoAsistencia` (puntual ≤ inicio+15 min, tarde ≤ fin, etc.). Mirá `src/lib/pin/__tests__/pin.test.ts` como ejemplo. Corré `npm run test`.",
        sinIa: true,
      },
      {
        text: "Cambiá el margen de puntualidad de 15 a 10 minutos. Antes de editar, encontrá con grep todos los lugares donde está esa regla (hay más de uno: la ruta manual de asistencias la tiene duplicada). Documentá la duplicación.",
      },
      {
        text: "Agregá un tipo de licencia nuevo a `src/lib/constants/licencias.ts` y hacé que aparezca en el modal de crear licencia (ojo: los tipos también viven en la BD como enum — ¿qué hay que tocar ahí?). Escribí el SQL como comentario, no lo ejecutes.",
      },
      {
        text: "Abrí la tabla `asistencias` después de marcar una entrada en el kiosko y verificá cómo quedaron los campos de sello. Compará con lo que `asistenciaSello.ts` escribe.",
      },
    ],
    questions: [
      "Si dos empleados marcan al mismo tiempo, ¿qué protege que no se pisen las cadenas de sello? (Pista: leé `fn_sellar_marca` y el upsert de `cadena_sellos`.)",
      "¿Por qué el marcaje decide «entrada o salida» en la app y no en la BD?",
      "Si borrás la función SQL `fn_calcular_horas`, ¿qué deja de funcionar y qué parte de la app lo notaría primero?",
    ],
    miniProject: {
      title: "Suite de tests del marcaje",
      difficulty: 4,
      brief:
        "Escribí con Vitest una suite para `calcularEstadoAsistencia` que cubra los cinco casos borde: puntual, tarde, fuera de horario, cruce de medianoche y empleado sin horario. Usá `src/lib/pin/__tests__/pin.test.ts` como ejemplo de estructura.",
      approval:
        "`npm run test` queda en verde y los tests fallan si alguien cambia el margen de 15 minutos sin actualizar todas las copias de la regla.",
    },
    doneWhen:
      "Podés explicar el marcaje a otra persona de memoria y predecir qué pasa en un caso raro (doble marcaje, empleado sin horario, cruce de medianoche).",
  },
  {
    id: 7,
    title: "Autenticación, seguridad y multi-tenant",
    duration: "1 semana",
    tags: ["Auth", "2FA", "Multi-tenant"],
    objective: "Entender quién puede hacer qué, y por qué tu app está (o no) segura.",
    theory: [
      "Cookies httpOnly vs localStorage; por qué el JWT viaja en una cookie y no en el storage.",
      "Flujo de login con NextAuth: `authorize`, callbacks `jwt`/`session` y cómo se hidrata el token.",
      "Hashing (bcrypt) vs cifrado; por qué las contraseñas nunca se guardan en claro ni se «descifran».",
      "2FA con TOTP: código de 6 dígitos que cambia, códigos de backup y el estado «pendiente» antes de crear la sesión.",
      "Guards: middleware (antes del request) vs layout (server component) y sus limitaciones.",
      "Rate limiting: por ventana fija, por IP y por usuario.",
      "Multi-tenant: qué es un tenant y por qué `empresa_id` en cada query es crítico.",
      "RLS en PostgreSQL: qué es y por qué acá está apagado en la práctica (service role + `REVOKE`).",
    ],
    practice: [
      "`auth.ts` arma el JWT; `middleware.ts` redirige si no hay sesión o no hay plan activo.",
      "El 2FA crea una fila en `logins_2fa_pendientes` con token hasheado, TTL de 15 min y 5 intentos antes de crear la sesión.",
      "`rateLimit.ts` protege por usuario además del límite por IP del middleware.",
      "Las rutas públicas (`registro-qr`, webhook) no llaman `await auth()` a propósito; el resto sí.",
      "En `database.sql` el bloque RLS + `REVOKE` deja la seguridad real en la capa de aplicación: si olvidás un filtro, no hay red de seguridad en la BD.",
    ],
    study: [
      { path: "src/auth.ts", note: "`authorize` (líneas ~290–497) y callbacks (~505–638)." },
      { path: "src/lib/2fa/pendingLogin.ts", note: "Token hasheado, TTL, un solo uso, bloqueo por intentos." },
      { path: "src/app/api/auth/2fa/verificar/route.ts", note: "La máquina de estados del 2FA." },
      {
        path: "src/middleware.ts",
        note: "Guards, junto a `RequireDashboard2FA.tsx` y `PinRequeridoGate`.",
      },
      { path: "src/lib/api/rateLimit.ts", note: "Rate limit por usuario (con `src/lib/pin/rateLimitEmpresa.ts`)." },
      { path: "database.sql", note: "Bloque RLS + `REVOKE` (~1991–2072)." },
      { path: ".agents/SECURITY.md", note: "Reglas de seguridad del proyecto." },
    ],
    searchTerms: [
      "cookies httpOnly JWT por qué se usan",
      "NextAuth authorize callbacks jwt session",
      "bcrypt hashing de contraseñas por qué no se cifran",
      "TOTP autenticación en dos pasos cómo funciona",
      "multi-tenant qué es aislamiento de datos por empresa",
      "PostgreSQL row level security RLS explicado",
      "rate limiting por IP y por usuario APIs",
    ],
    exercises: [
      {
        text: "Hacé login con Network + Application → Cookies abiertas. Identificá: cookie de sesión, cookie `norkent_2fa_pending` (si activás 2FA), cookie `norkent_needs_reauth` (al entrar a `/ingreso`). ¿Cuáles son httpOnly?",
        sinIa: true,
      },
      {
        text: "Listá con grep todas las rutas que usan `await auth()` y todas las rutas `/api` que NO lo usan. Clasificá: ¿cuáles son públicas a propósito (ej. registro-qr, webhook) y cuáles parecen un descuido?",
        sinIa: true,
      },
      {
        text: "Pensá esta vulnerabilidad (no la exploits): una API que hace `.from('empleados').select()` sin `.eq('empresa_id', ...)`. Explicá con tus palabras qué datos se filtrarían. Buscá en el proyecto si existe algún caso.",
      },
      {
        text: "Activá 2FA en tu perfil y hacé el login completo. Escribí el flujo en 8 pasos con los archivos que intervienen.",
      },
      {
        text: "Escribí un test para `esPinValido`/rate limit del PIN (o para una función pura de `src/lib/pin/pin.ts`) y corré `npm run test`.",
      },
    ],
    questions: [
      "¿Por qué el 2FA no crea la sesión hasta el segundo paso? ¿Qué se rompería si se creara antes?",
      "Si alguien roba la service role key de Supabase, ¿qué puede hacer? ¿Y si roba la anon key?",
      "¿Por qué el rate limit del middleware no protege contra un ataque que ya tiene sesión? (Pista: `limitarPorUsuario`.)",
    ],
    miniProject: {
      title: "Auditoría de rutas",
      difficulty: 4,
      brief:
        "Generá con grep el listado de todas las rutas `/api` con y sin `await auth()`, clasificadas en «públicas a propósito» y «revisar», y escribí `SEGURIDAD_AUDITORIA.md` con tres hallazgos, el riesgo de cada uno y el check que agregarías. Cerrá con un test verde para una función pura de `src/lib/pin/`.",
      approval:
        "El informe cubre el 100% de las rutas y el test corre en verde con `npm run test`.",
    },
    doneWhen:
      "Ante una pantalla nueva, sabés qué checks de autorización agregar antes de escribir una sola línea de query.",
  },
  {
    id: 8,
    title: "Arquitectura, patrones y calidad",
    duration: "1 semana",
    tags: ["Caché", "Rate limit", "Idempotencia"],
    objective:
      "Dejar de ver funciones sueltas y empezar a ver los patrones que sostienen el sistema.",
    theory: [
      "Separación de capas: el criterio para decidir dónde vive el código nuevo.",
      "Caché: cliente vs servidor, TTL, invalidación y datos viejos (staleness).",
      "Polling vs webhooks vs server-push; por qué refrescar con la pestaña oculta es tirar recursos.",
      "Paginación y límites de rango (366 días, 5000 filas) para no traer datos de más.",
      "Resiliencia: timeout y circuit breaker (cortacircuitos) alrededor de los servicios externos.",
      "Idempotencia: por qué un mismo evento puede llegar dos veces y qué hay que hacer.",
      "Auditoría como requisito de producto: quién escribió qué y cuándo.",
    ],
    practice: [
      "`useCacheCompartida` dedupea pedidos simultáneos, expira con TTL y notifica con `useSyncExternalStore`.",
      "El resumen del dashboard cachea 30 s por empresa+fecha y `?refresh=1` la salta.",
      "`usePolling` pausa el refresco cuando la pestaña está oculta.",
      "`conResilienciaExterna` envuelve los servicios externos con timeout y cortacircuitos.",
      "Toda escritura pasa por `registrarAuditoria` y todo listado pagina con header `X-Total-Count`.",
    ],
    study: [
      {
        path: "src/lib/hooks/useCacheCompartida.ts",
        note: "Dedupe + TTL + suscriptores con `useSyncExternalStore`.",
      },
      { path: "src/lib/hooks/usePolling.ts", note: "Refresco periódico pausado cuando la pestaña está oculta." },
      { path: "src/lib/api/pagination.ts", note: "Convención de listados (con `rateLimit.ts`)." },
      { path: "src/lib/external/resiliencia.ts", note: "Leé el estado del cortacircuitos." },
      {
        path: "src/app/api/dashboard/resumen/route.ts",
        note: "Caché de 30 s + `Promise.all` + métricas derivadas.",
      },
      { path: "src/lib/auditoria.ts", note: "Registro de auditoría en cada escritura." },
    ],
    searchTerms: [
      "qué es la caché TTL e invalidación frontend backend",
      "polling sostenido qué es y cuándo usarlo",
      "patrón circuit breaker con timeout explicado",
      "idempotencia en APIs y webhooks qué es",
      "paginación offset vs cursor en APIs",
      "auditoría de una aplicación qué registrar",
    ],
    exercises: [
      {
        text: "Encontrá todos los lugares donde hay lógica de caché en el proyecto (hooks + rutas) y hacé una tabla: quién cachea, cuánto TTL, quién invalida.",
        sinIa: true,
      },
      {
        text: "Tomá una ruta GET «caliente» que no tenga `limitarPorUsuario` (buscá con grep) y agregalo siguiendo el patrón de `/api/asistencias` (incluyendo `respuestaLimiteExcedido`).",
      },
      {
        text: "Agregá caché de 30 s (mismo patrón del resumen) a una ruta de lectura liviana, con `?refresh=1` para saltarla. Medí con Network la diferencia.",
      },
      {
        text: "Explicá con un dibujo cómo funciona el circuit breaker de `conResilienciaExterna` (qué pasa con los primeros 5 fallos, y con el sexto).",
      },
      {
        text: "Revisá `POST /api/crear-empleado`: contá cuántas validaciones distintas hace y clasifícalas (formato, permisos/tenant, límite de plan, duplicados, integridad FK).",
      },
    ],
    questions: [
      "Si dos requests simultáneas crean la misma suscripción, ¿qué las protege? (Pista: `UNIQUE` + manejo del error 23505.)",
      "¿Qué problema resuelve la caché del dashboard y cuál introduce? (Pista: ¿qué pasa si marcás asistencia y el dashboard muestra datos de hasta 30 s?)",
      "¿Por qué el proyecto devuelve arreglos JSON en listados en vez de objetos con `{ data, total }`? (Mirá `MEMORY.md`.)",
    ],
    miniProject: {
      title: "Rutas con rate limit y caché",
      difficulty: 4,
      brief:
        "Elegí una ruta GET sin `limitarPorUsuario`, agregalo con el patrón de `/api/asistencias`; sumá caché de 30 s con `?refresh=1` a una ruta de lectura liviana; y documentá en una tabla quién cachea, con qué TTL y quién invalida.",
      approval:
        "Mediste con la pestaña Network el antes/después, y `lint`, `type-check`, `test` y `build` quedan en verde.",
    },
    doneWhen:
      "Te dan una feature nueva y ya pensás en: capa, caché, validación, rate limit, auditoría, límite de plan — antes de abrir el editor.",
  },
  {
    id: 9,
    title: "Sistemas externos: webhooks y facturación",
    duration: "3–5 días",
    level: "avanzado",
    tags: ["Webhooks", "Facturación", "Estados"],
    objective: "Entender el flujo más complejo del proyecto: eventos que llegan de afuera.",
    theory: [
      "Webhooks: qué son, por qué el proveedor te llama a vos y por qué no hay sesión que validar.",
      "Firma de la request: verificar el HMAC sobre el body crudo, no sobre el JSON ya parseado.",
      "Idempotencia y deduplicación: tabla de eventos + unique constraints para no repetir efectos.",
      "Máquina de estados de una suscripción (`draft`/`trialing`/`active`/`past_due`/`canceled`).",
      "Patrón «outbox» (`commet_acciones`) para sincronizar ida y vuelta con el proveedor.",
    ],
    practice: [
      "El webhook de Commet verifica `x-commet-signature` con el secreto y recién ahí hace un `switch(evento)`.",
      "`commet_eventos` guarda un hash único por evento: repetir el mismo payload no duplica nada.",
      "El estado de la suscripción se convierte en límites de plan vía `planActivo` y `planLimits`.",
      "Las tablas `suscripciones`, `pagos`, `facturas` e `historial_planes` registran cada transición.",
      "Es facturación: los cambios sobre la lógica de activación se validan con el dueño antes de tocarlos.",
    ],
    study: [
      {
        path: "src/app/api/(plans)/commet/webhook/route.ts",
        note: "Verificación de firma + `switch(evento)`.",
      },
      {
        path: "src/lib/subscriptions/syncSubscription.ts",
        note: "Cadena completa: `activateSubscription.ts` → `processTransaction.ts`.",
      },
      {
        path: "src/lib/subscriptions/planActivo.ts",
        note: "Cómo el estado se convierte en límites (con `planLimits.ts`).",
      },
      { path: "src/lib/commet/plans.ts", note: "Mapeo de tiers." },
      {
        path: "database.sql",
        note: "Tablas `suscripciones`, `pagos`, `facturas`, `historial_planes`.",
      },
    ],
    searchTerms: [
      "webhooks qué son y cómo verificar la firma HMAC",
      "qué es idempotencia y deduplicación de eventos",
      "máquina de estados de suscripciones en billing",
      "por qué verificar la firma con el body crudo",
      "patrón outbox para sincronizar sistemas externos",
    ],
    exercises: [
      {
        text: "Dibujá el estado de una suscripción desde checkout hasta facturación, nombrando qué archivo/tabla actualiza cada transición.",
        sinIa: true,
      },
      { text: "Escribí (en papel) qué respondería el webhook si llega el mismo evento 3 veces." },
      { text: "Corré `scripts/crear-webhook-panel.mjs listar` si tenés la key (opcional) para ver los webhooks reales." },
      {
        text: "Modificá algo cosmético en la página de planes (un texto) y validá build. No toques la lógica de activación sin confirmación del dueño.",
      },
      { text: "Leé `MEMORY.md` §Commet: las decisiones ya tomadas (dos endpoints, uno pausado) y explicá por qué." },
    ],
    questions: [
      "Si el webhook llega antes de que el usuario vuelva del checkout, ¿qué evita el doble registro?",
      "¿Por qué verificar la firma con el body crudo y no el JSON ya parseado?",
      "Si Commet marca `pending`, ¿por qué no se da acceso al plan? Buscá el comentario en el código.",
    ],
    miniProject: {
      title: "Webhook de práctica con firma",
      difficulty: 5,
      brief:
        "Creá una ruta de práctica `POST /api/apprendizaje-webhook` que verifique una firma HMAC sobre el body crudo, descarte eventos repetidos (dedupe) y responda según corresponda; un script Node que firme y envíe tres eventos (uno duplicado) lo demuestra. No toques `commet/webhook` ni la lógica real.",
      approval:
        "El script recibe 200, 409 y 409 según el caso, y podés dibujar la máquina de estados de la suscripción de memoria.",
    },
    doneWhen:
      "Podés explicar qué pasa si el webhook falla a mitad de camino y qué recuperaría la app al reintentar.",
  },
  {
    id: 10,
    title: "Proyecto final: construir una feature solo",
    duration: "1–2 semanas",
    tags: ["Producto", "Full stack", "Validación"],
    objective:
      "El objetivo real de toda la ruta: diseñar e implementar algo nuevo por tu cuenta.",
    theory: [
      "Especificación primero: qué hace la feature, quién la usa, qué datos necesita y qué pasa en los casos borde. Si no podés escribirla, no la entendés todavía.",
      "Diseño de datos: si hace falta tabla nueva o columna, el SQL se escribe y queda en la especificación, sin aplicar.",
      "API primero: el contrato antes que la pantalla — `auth` → rate limit → validación → query con `empresa_id` → auditoría → respuesta.",
      "UI después: hook + componente siguiendo la estructura del proyecto (`page.tsx`/`Page*.tsx` y `dashboard/ui/`).",
      "Definición de terminado: `lint`, `type-check`, `test`, `build` y prueba manual en el navegador.",
      "Revisión de código: recién al final se consulta a la IA como reviewer, contra las convenciones del proyecto.",
    ],
    practice: [
      "`obtener-empleados/route.ts` es la plantilla de ruta canónica: copiá su estructura, no su contenido.",
      "`personal/` es la plantilla de pantalla completa: shell + lógica + modales.",
      "Tu diff se revisa contra `.agents/DEVELOPMENT.md` y `MEMORY.md`: no reimplementes decisiones ya tomadas.",
      "Al cerrar, tu feature filtra por `empresa_id`, deja auditoría si escribe, respeta límites de plan y podés explicar cada línea.",
    ],
    study: [
      { path: "src/app/api/(empleados)/obtener-empleados/route.ts", note: "Plantilla de ruta canónica." },
      { path: "src/app/dashboard/personal/", note: "Plantilla de pantalla: `page.tsx` + `PagePersonal.tsx`." },
      { path: ".agents/DEVELOPMENT.md", note: "Convenciones contra las que se revisa tu diff." },
      { path: "MEMORY.md", note: "Decisiones ya tomadas: no las reimplementes." },
    ],
    searchTerms: [
      "cómo escribir una especificación técnica de feature",
      "API first design por qué diseñar la API primero",
      "checklist de code review qué buscar en un diff",
      "buenas prácticas para diseñar una API REST",
      "definición de terminado en desarrollo de software",
    ],
    exercises: [
      {
        text: "Especificación: escribí en un `.md` temporal qué hace la feature, quién la usa, qué datos necesita y qué pasa en los casos borde (sin datos, sin permisos, límite de plan).",
      },
      {
        text: "Diseño de datos: si hay tabla nueva o columna, escribí el SQL y pegalo en tu especificación. No lo apliques: las migraciones las aplica el dueño manualmente.",
      },
      {
        text: "API primero: creá la ruta siguiendo el patrón canónico (`auth` → rate limit → validación → query con `empresa_id` → auditoría → respuesta). Revisá una ruta vecina como plantilla.",
      },
      {
        text: "UI después: hook + componente siguiendo la estructura `page.tsx`/`Page*.tsx` y `dashboard/ui/`.",
      },
      {
        text: "Validación: `npm run lint && npm run type-check && npm run test && npm run build` y prueba manual en el navegador.",
      },
      {
        text: "Revisión cruzada: recién acá consultá a la IA como reviewer: «revisá este diff y decime qué falta según las convenciones del proyecto».",
      },
    ],
    questions: [],
    extra: {
      label: "Ideas de features (de menor a mayor dificultad)",
      items: [
        "Filtro por cargo en la lista de Personal — UI + query existente",
        "Exportar asistencias del período a CSV — UI + API + paginación",
        "Nuevo tipo de licencia — constants + UI + enum BD (SQL escrito, no aplicado)",
        "Widget «cumpleaños de la semana» en Inicio — API nueva + dashboard",
        "Recordatorio por email de licencias que empiezan mañana — cron + Resend + resiliencia",
        "Filtro por empleado en Analíticas — agregaciones SQL",
        "Endpoint público de estado del kiosko (¿QR vigente?) — seguridad + rate limit",
        "Límite real de empleados por plan en frontend y backend — planLimits + UI + test",
      ],
    },
    miniProject: {
      title: "Feature completa de punta a punta",
      difficulty: 5,
      brief:
        "Elegí una feature de la lista y seguí los 6 pasos en orden: especificación en `.md`, SQL escrito y sin aplicar, ruta API canónica, hook + pantalla, validación completa y revisión cruzada con la IA como reviewer.",
      approval:
        "Lint, type-check, test y build en verde; toda query filtra por `empresa_id`; cada escritura deja auditoría; respeta límites de plan — y vos podés explicar cada línea.",
    },
    doneWhen: "Terminaste una feature propia sin pedirle a la IA que la escriba por vos.",
  },
];
