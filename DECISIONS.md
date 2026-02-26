# Decisiones de diseño

Este documento resume las decisiones técnicas del proyecto, los problemas encontrados y posibles mejoras futuras.

## Elección de librerías

**Express.** Se eligió por madurez, documentación y ecosistema. Permite montar rutas, middlewares y manejo de errores sin imponer una estructura rígida. Alternativas como Fastify ofrecen más rendimiento bruto pero el equipo ya conocía Express y el tiempo de desarrollo pesó más que el microbenchmark.

**TypeScript.** Se usa para tipado estático y mejor autocompletado. Reduce errores en tiempo de compilación y facilita refactors. El coste de configuración (tsconfig, tipos de Express y de Drizzle) se asume desde el inicio.

**Drizzle ORM.** Se priorizó sobre Prisma o TypeORM por menor abstracción y SQL más explícito. Las migraciones se generan a partir del schema en TypeScript y el cliente expone tipos derivados de las tablas. Para un modelo pequeño (una tabla de usuarios) la curva de aprendizaje fue baja y la integración con PostgreSQL es directa.

**bcryptjs.** Para hashear contraseñas. Es la opción habitual en Node y evita dependencias nativas (a diferencia de bcrypt). El coste de CPU en el registro y login es aceptable para el volumen esperado.

**jsonwebtoken.** Para emitir y verificar JWT. La API es sencilla (sign, verify) y se integra bien con un middleware de autenticación que lee el token del header o de una cookie.

**express-validator.** Para validar body y query sin escribir a mano comprobaciones repetitivas. Los mensajes se definen en español y el middleware centralizado devuelve 400 con el primer error, manteniendo respuestas consistentes.

**cookie-parser.** Necesario para leer la cookie httpOnly donde se guarda el token en el login. Sin él, req.cookies no está poblado y el middleware de auth no podría usar el token desde la cookie.

## Desafíos durante el desarrollo

**Resolución de módulos con ts-node-dev.** El proyecto compila con NodeNext y extensiones .js en los imports. Al ejecutar con ts-node-dev, Node intentaba cargar archivos .js que no existen en desarrollo. Se solucionó quitando la extensión en los imports relativos para que tanto ts-node como el build con tsc resolvieran bien.

**Tipado del payload JWT.** La librería jsonwebtoken expone tipos genéricos y la opción expiresIn no coincidía con lo que TypeScript infería en alguna versión. Se usó un cast a SignOptions donde hacía falta para que el build pasara sin cambiar la versión de la librería.

**Paginación y total.** Para listar usuarios con límite y offset hace falta también el total de filas. Con Drizzle se hizo una query de selección con limit/offset y otra de count. El resultado del count en pg puede llegar como string; se normaliza a número antes de calcular totalPages.

**Seed en migraciones.** Drizzle no genera migraciones “de datos” desde el schema. Se añadió una migración SQL manual que hace INSERT del usuario admin con ON CONFLICT DO NOTHING. Así el mismo flujo (db:migrate) deja la base lista para desarrollo y el admin de prueba siempre existe en un banco recién creado.

## Mejoras con más tiempo

**Rate limiting.** No está implementado. En producción convendría limitar peticiones por IP o por usuario (por ejemplo en login y registro) para mitigar fuerza bruta y abuso. Librerías como express-rate-limit se integrarían como middleware antes de las rutas.

**Refresh token.** Hoy solo hay access token con expiración (por ejemplo 7 días). Con más tiempo se añadiría un refresh token de mayor duración, almacenado en base de datos o en un store seguro, y un endpoint que lo canjea por un nuevo access token. El access token podría acortarse a minutos u horas y el refresh rotaría en cada uso para mejorar seguridad.

**Logs estructurados.** Los errores y peticiones se manejan pero no hay un sistema de logging (por ejemplo Winston o Pino) con niveles y formato JSON. Sería útil para depurar y para enviar logs a un agregador en producción.

**Tests.** No hay tests automatizados. Lo siguiente sería tests unitarios de servicios (registro, login, actualización de perfil) y de repositorio, e integración de los endpoints críticos (auth y users/me) con una base de prueba o mocks.

**Variables de entorno validadas.** El arranque no comprueba que JWT_SECRET o DATABASE_URL existan. Un módulo que valide el .env al inicio y falle rápido evitaría errores poco claros en runtime.

**Documentación de API.** Los endpoints están descritos en el README. Con más tiempo se podría añadir OpenAPI (Swagger) generado desde el código o desde un spec, para que frontend y herramientas puedan consumir la API de forma documentada.

## Escalado de la solución

**Horizontal.** La API es stateless; el estado de sesión está en el JWT (y opcionalmente en cookie). Se pueden poner varias instancias detrás de un balanceador. La única condición es que todas usen el mismo JWT_SECRET para validar tokens.

**Base de datos.** PostgreSQL aguanta bien el volumen previsto. Si creciera el número de lecturas se podría valorar réplicas de solo lectura para GET (por ejemplo listado de usuarios) y mantener writes en la primaria. Drizzle no impide usar pools o varios clientes si se configura.

**Caché.** Para listados que se lean mucho y cambien poco se podría cachear en Redis (por ejemplo por página y filtros) con TTL corto. No está implementado; sería un paso posterior cuando las consultas a la base se conviertan en cuello de botella.

**Colas.** Si en el futuro se añaden tareas pesadas (emails, reportes, procesamiento de archivos), tendría sentido sacarlas a una cola (Bull, BullMQ, etc.) y que la API solo encole jobs. Así las peticiones HTTP siguen siendo rápidas y el trabajo asíncrono se escala por workers.

**Rate limiting y refresh token.** Como se comentó antes, rate limiting en login/registro y un flujo de refresh token son mejoras de seguridad y resiliencia que encajan bien al escalar número de usuarios y de peticiones.
