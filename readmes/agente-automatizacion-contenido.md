# Agente de IA para gestión de contenido multicanal

*Transcripción de conversación · 8 mensajes · 2026-08-31 – 2026-09-12*

> Nota: se transcribe la conversación visible (mensajes del usuario y respuestas de Claude). Se omiten el razonamiento interno de Claude y los resultados crudos de búsqueda; donde hubo una búsqueda o se generó un artefacto se deja una marca entre corchetes. Los artefactos (informes, planillas) son archivos aparte y no forman parte de este texto.

---

### 🧑 Usuario

Quiero crear y desarrollar un agente de IA (y/o alternativamente, subagentes o más de un agente interconectados) para creación y subida de contenido al blog de un sitio web, reels y posteos en Instagram, shorts en Youtube y TikTok, preferentemente reutilizando el mismo contenido en éstas tres plataformas. La idea es que el agente busque ideas de contenido, redacte el texto para las entradas de blog y los guiones y piezas gráficas para los post/reels/videos en las rrss. La intención con respecto a los videos cortos compartidos es que se compongan de un texto guionado con una pieza gráfica fija de fondo, es decir en principio no usar videos propiamente dichos sino composiciones gráficas fijas + audio de texto guionado. Antes de subir a las plataformas, poder revisar, curar y aprobar el contenido. ¿Por dónde podemos empezar, cuál es el esquema que podés sugerir para crear e implementar este agente, que no sería totalmente automatizado pero si gran parte? Capaz convendría separar en subagentes o en más de un agente p. ej. la parte de creación de artículos para el blog del sitio web y la parte de creación de contenido para las rrss.

---

### 🤖 Claude

`[🔍 búsqueda web]`

Buenísimo el planteo, Nicolás. Te lo ordeno primero conceptualmente y después te doy el esquema concreto y por dónde arrancar. Y te adelanto algo importante: lo que describís no conviene pensarlo como “un agente autónomo”, sino como **un pipeline de contenido con compuertas de aprobación humana**, donde la IA hace las partes creativas/generativas y código determinista hace el ensamblado y la publicación. Tu intuición de separar blog vs. redes es correcta, y la voy a llevar un paso más allá.

## La idea organizadora: una base de datos como columna vertebral

Antes que los agentes, lo que hace que todo esto funcione (y que la curaduría/aprobación sea natural) es una **base de contenidos con estado**. Cada ítem es una fila con campos como: idea, ángulo, keyword, borrador de blog, guion, gráfica, audio, video, captions por plataforma, y un campo **status** que dispara el pipeline:

`idea → idea aprobada → blog redactado → assets sociales listos → aprobado → agendado → publicado`

Podés usar Airtable o Notion (rápido) o directamente un content type en Drupal/WP (más integrado con tu stack). Las “compuertas de aprobación” son simplemente vos cambiando el status. Ese tablero **es** tu superficie de revisión y curaduría.

## El esquema: agentes especializados + orquestador

Recomiendo modular (varios agentes/módulos coordinados), no un mega-agente, por tres razones concretas: el blog SEO largo y el guion punchy de 30 segundos necesitan prompts y hasta modelos distintos; podés iterar y testear cada parte por separado; y si algo falla, falla aislado. Pero **un solo orquestador** manda, para que no sea un enjambre caótico.

**1. Orquestador** — mueve ítems entre estados, llama al agente correcto en cada etapa, y frena en las compuertas de aprobación.

**2. Agente de Ideación/Investigación** (compartido) — genera ideas a partir de tus pilares temáticos, keywords SEO, tendencias, RSS de competencia y analytics del sitio. Vuelca candidatos a la base. → **Compuerta 1: aprobás ideas.**

**3. Agente de Blog** (especialista long-form) — de las ideas aprobadas produce el artículo estructurado para SEO: título, H2/H3, meta description, sugerencias de enlaces internos y de imágenes.

**4. Agente de Repurposing/Social** (especialista short-form) — acá vive tu “reutilizar el mismo contenido”: del artículo/idea deriva el guion de 30-45s (hook / desarrollo / CTA), el texto en pantalla, el caption + hashtags por plataforma, y el *prompt* de la gráfica de fondo.

**5. Módulo de Ensamblado** (determinista, sin IA) — TTS del guion, generación/selección de la gráfica, subtítulos sincronizados, y ffmpeg que compone **un master vertical 9:16**. Ese master se reutiliza para Reels, Shorts y TikTok. → **Compuerta 2: revisás blog + video + captions, editás, aprobás.**

**6. Módulo de Publicación** — conectores a WP/Drupal, YouTube, Instagram y TikTok. Lee lo aprobado y agendado, publica y escribe de vuelta las URLs/IDs.

**7. (Más adelante) Agente de Analítica** — trae métricas y realimenta la ideación.

Fijate que sólo el 2, 3, 4 (y 7) son “agentes de IA” de verdad. El 5 y el 6 son plomería determinista, y de hecho ahí está gran parte de la confiabilidad del sistema.

## El video que querés (gráfica fija + guion locutado)

Tu enfoque de composición fija + audio es totalmente viable y barato. Stack concreto:

- **TTS:** ElevenLabs suele dar las voces más naturales en español rioplatense/neutro; OpenAI o Azure son alternativas. La calidad de voz es lo que hace o rompe estos videos, así que probá varias antes de casarte con una.
- **Gráfica:** imagen generada (SDXL/DALL·E) o plantillas de Canva vía API, o directamente un set de fondos branded reutilizables.
- **Subtítulos:** quemá subtítulos animados (tipo karaoke). Son clave porque el 80% del feed se ve en mute. Los tiempos salen de los timestamps del TTS o de un alineado con Whisper.
- **Composición:** ffmpeg → 1080×1920, H.264, ~30-45s → un master.

Un consejo honesto: una imagen 100% quieta a veces rinde peor porque los algoritmos favorecen movimiento. No cambies tu enfoque, pero agregale **micro-movimiento** (un zoom lento tipo Ken Burns, los captions animados, quizás una waveform del audio). Mantenés la simpleza y ganás retención.

## La realidad de publicar (acá está el cuello de botella)

Esto sí conviene tenerlo claro de entrada porque define hasta dónde se puede automatizar:

- **Blog (WP/Drupal):** trivial, API completa. Auto-publicable sin drama.
- **YouTube Shorts:** la Data API sube videos sin problema; es la plataforma más amigable para automatizar.
- **Instagram Reels:** se publica por la Graph API, pero necesitás cuenta Business/Creator + Página de Facebook vinculada + un app de Meta con permiso revisado, y la revisión de app tarda 2-4 semanas por envío. El video tiene que estar en una URL pública, 9:16, 5-90s, y hay un tope de publicaciones por día — del orden de 25 posts por cuenta cada 24 horas, contando Reels y Stories en el mismo bucket.
- **TikTok:** es la difícil. Tiene una Content Posting API real, pero necesitás app registrada, los scopes correctos, verificación de dominio y una auditoría antes de que tus posts puedan siquiera ser públicos. Hasta que pasás esa auditoría, cada post directo queda en SELF_ONLY (sólo lo ve el creador). La otra vía es el scope de *upload-to-inbox*, que deja el contenido en los borradores del creador para que lo termine y publique manualmente — lo cual, dado que igual querés aprobación humana, no es tan malo.

**Atajo pragmático:** en vez de construir tres conectores nativos y lidiar vos con la auditoría de TikTok, existen agregadores ya auditados (Ayrshare, bundle.social) o auto-hospedables (Postiz, open-source, encaja con tu perfil de self-hosting) que manejan IG + TikTok + YT con una sola integración. Vale la pena evaluarlo — verificá términos y precios actuales.

## Cómo construirlo, dado tu stack

Dos caminos, y te recomiendo empezar por el primero:

- **Low-code para arrancar (recomendado):** **n8n auto-hospedado** como orquestador + nodos de LLM + nodos HTTP hacia WP/Drupal + agregador social. Airtable/Notion como base y tablero de aprobación. Las compuertas se resuelven con el patrón “wait for webhook/approval” de n8n. Levantás un loop funcional rápido y visual, y lo corrés en tu propia infra de Esquemas.
- **Código, para después:** Python con un framework de agentes (LangGraph u similar) cuando quieras más control sobre las partes que ya validaste.

## Por dónde empezar — hoja de ruta por fases

La clave es **no construir los seis agentes antes de shipear uno**. Un loop limpio primero, después ancho.

1. **Fase 0 — Fundamentos.** Definí voz de marca, pilares temáticos y keywords, y armá la base de contenidos con el flujo de estados. Sin esto, lo demás no rinde.
2. **Fase 1 — Blog end-to-end, pero publicando a mano.** Ideación → aprobás → agente de blog → revisás → publicás en el CMS. Un solo loop impecable, con el humano apretando “publicar”. Probás calidad antes de automatizar nada.
3. **Fase 2 — Repurposing a texto.** Agregás el agente social que convierte cada artículo aprobado en guiones + captions + prompts de gráfica. Todavía sin armar video: revisás sólo los assets de texto.
4. **Fase 3 — Ensamblado de video.** Sumás TTS + ffmpeg → el master 9:16. Revisás videos.
5. **Fase 4 — Publicación asistida.** Cableás publicación empezando por lo fácil (YT y blog, auto) y dejando IG/TikTok como “apruebo → mando a borrador/agenda” hasta resolver los accesos de API.
6. **Fase 5 — Optimización.** Loop de analítica y más automatización de las compuertas en las que ya confiás.

---

Para poder aterrizar la Fase 1 con vos, hay dos decisiones que definen bastante:

- **¿Sobre qué sitio arranca el blog?** Como manejás varios (Drupal y WordPress), cambia el conector — aunque dominás los dos.
- **¿Vamos por n8n para el prototipo, o preferís código desde el principio?**

Si querés, con eso definido te armo el flujo concreto de la Fase 1 (ideación → aprobación → redacción → publicación en tu CMS) ya listo para montar, o te paso este esquema como documento para tenerlo de referencia.

---

### 🧑 Usuario

El sitio es numerologiagoan.com, lo hicimos con Claude Code y localmente está en 

```markdown
~/sites/numerologiagoan
```

Para mayor detalle sobre el sitio podés leer CLAUDE.md en el directorio mencionado. No es un CMS sino un sitio estático. Pero si me parece interesante contemplar la posibilidad, si te parece razonable, de crear un sitio drupal 11 de manera local con ddev como un auxiliar para la gestión y el proceso de los contenidos que luego se publicarán en numerologiagoan.com y en las redes sociales. Ese sitio drupal 11 de apoyo digamos que lo imagino como una suerte de gestor de proyectos/contenidos como basecamp, trello, jira, etc. con aprobación y calendario de publicaciones. 
Con respecto a ir por n8n para el prototipo o código desde el principio, ¿qué me sugerís? Me interesa que la opción elegida me sirva para otros proyectos.

---

### 🤖 Claude

Antes de entrar al fondo, un apunte práctico: **no puedo leer archivos de tu máquina desde acá** — corro en un contenedor Linux aislado, así que `~/sites/numerologiagoan/CLAUDE.md` no me llega. Si lo pegás o lo subís, ajusto todo a la realidad del sitio. Mientras tanto trabajo con el supuesto de que numerologiagoan.com es un sitio estático (generador tipo Astro/Hugo/11ty o HTML+build) desplegado en algún host estático — corregime si no.

Dejame verificar un par de cosas de Drupal 11 antes de recomendarte el stack de módulos, porque la compatibilidad de contrib con D11 conviene confirmarla y no citártela de memoria.

`[🔍 búsqueda web]`

Perfecto, con eso ya puedo aterrizarlo. Te respondo las dos preguntas, y las dos respuestas terminan reforzándose entre sí.

## Q1 — ¿Drupal 11 + ddev como hub auxiliar? Sí, y en tu caso es de las mejores decisiones

No sólo es razonable: para vos específicamente es probablemente la opción de mayor apalancamiento, por una razón concreta que va más allá de "sabés Drupal". La diferencia clave con Basecamp/Trello/Jira es que esos son gestores de *tareas*: guardarían tarjetas *sobre* el contenido, con el texto real colgado como adjunto o link. Drupal guarda **el contenido en sí** —el cuerpo del artículo, el guion, los captions, la gráfica, el audio, el video master— como un solo objeto con su estado editorial y su fecha de publicación encima. Para un pipeline de contenido, que la pieza y su flujo de aprobación sean la misma entidad es una ventaja real, no cosmética. Y como bonus, te queda un activo replicable: un install de "content-ops" que después clonás para otros clientes de Esquemas.

El stack de módulos (verifiqué compatibilidad con D11, que en contrib conviene no dar por sentada):

- **Content Moderation + Workflows** (core) → estados `borrador → en revisión → aprobado → publicado`. Esas son literalmente tus compuertas de aprobación.
- **Scheduler** → fechas de publicación/despublicación, el backend de tu calendario. La versión 2.1.0 fue la primera compatible con Drupal 11 y las 2.2/2.3 ya están al día. Un detalle a confirmar: el submódulo que integra Scheduler *con* Content Moderation (SCMI) venía con dudas de compatibilidad D11, así que verificá ese puente puntual o resolvelo con un campo de estado + fecha más simple.
- **FullCalendar** (la 3.0.0 declara soporte `^9.4 || ^10 || ^11`) → vista calendario.
- **Views** (core) → tableros tipo kanban por estado.
- **JSON:API** (core) → lectura/escritura programática, la puerta para que los agentes escriban borradores y lean lo aprobado.
- **Media** (core) → gráficas, audios y video masters como archivos gestionados.
- **Taxonomy** (core) → pilares temáticos, keywords, plataformas destino.
- **ECA (Event-Condition-Action)** → el pegamento. Es no-code, corre sobre eventos de Drupal y ejecuta acciones (incluido llamar webhooks salientes). Con esto armás "cuando el estado pasa a *aprobado* → disparar el proceso de publicación". Es el puente elegante entre la superficie humana (Drupal) y el motor de automatización.

Y una que te va a interesar de cara al futuro: existe el ecosistema del **módulo AI + `ai_integration_eca`**, que le da a ECA acciones de tipo Chat, Moderation y **TextToSpeech** dentro de Drupal. O sea, es técnicamente posible generar el texto por LLM e incluso el audio del guion sin salir de Drupal. Lo pondría como "hacia dónde crecer", no como fundación del día 1: el ecosistema es potente pero más nuevo y con releases estables todavía irregulares.

Un content type "Pieza de contenido" con campos: idea, ángulo, keyword, cuerpo del blog, guion corto, caption+hashtags por plataforma, gráfica (media), audio (media), video master (media), estado (moderation), fecha de publicación, plataformas destino y URLs publicadas. Eso solo ya te da el tablero de aprobación y calendario que imaginás.

**Dos cosas prácticas importantes:**

*Red.* Si Drupal vive sólo local en ddev y algo del motor corre en la nube, no se ven. La opción más limpia y segura es que **Drupal sea siempre quien inicia las llamadas hacia afuera** (ECA → webhook saliente), así no tenés que exponer el sitio local a Internet. Si necesitás que algo entre a Drupal, corrés n8n también self-hosted en la misma red, o tunelizás con cloudflared puntualmente.

*Publicar en un sitio estático es distinto a publicar en un CMS.* Como numerologiagoan.com es estático, "publicar el blog" no es un POST a una API: es **generar el archivo** (markdown/MDX/HTML, según el generador) → **commit al repo** → **push** → el host reconstruye. Así que el conector de blog es git-based. El patrón que sale de esto es lindo: Drupal es tu capa de autoría/aprobación/calendario, y al aprobar, una automatización exporta el artículo al repo del sitio estático y hace push. Drupal termina funcionando como fuente de contenido en *build-time* para un sitio que sigue siendo estático y rápido. Para afinar esto necesito saber **cómo se despliega** (Netlify, Vercel, Cloudflare Pages, GitHub Pages, manual…) — o lo saco del CLAUDE.md si me lo pegás.

## Q2 — n8n vs. código: híbrido, arrancando por n8n, con disciplina

Dado que tu criterio es "que me sirva para otros proyectos", te doy una recomendación firme en vez de un "depende": **híbrido**, y no es una respuesta tibia sino la que mejor cumple justamente ese criterio.

Por qué no código puro desde el principio: reconstruirías scheduling, reintentos, colas, manejo de secretos, recepción de webhooks y un montón de plomería de glue entre APIs que n8n te da gratis. Más lento hasta el primer loop funcional y más superficie para mantener — y en una agencia con varios clientes ese costo se multiplica.

Por qué no n8n para todo y para siempre: la lógica compleja y todo lo que necesita testeo y versionado serio se vuelve incómodo en lo visual, y el ensamblado de video (TTS + subtítulos + ffmpeg) es genuinamente código.

El híbrido, concreto, en tres capas que se reutilizan cada una a su manera:

- **n8n self-hosted** = orquestación, scheduling, gating de aprobación, glue de APIs y llamadas a LLM. Exportás cada workflow a JSON y lo versionás en git. Armás **sub-workflows reutilizables** (por ejemplo "generar + ensamblar un short" como bloque que reusás entre clientes). Para otro proyecto: clonás y cambiás credenciales/config. Esa es reutilización real y rápida a nivel agencia.
- **Servicios de código chicos** (un CLI en Python o una micro-API con FastAPI) para lo que es genuinamente código y se repite: el ensamblado de video, el formateo/commit al repo estático, cualquier lógica pesada. n8n los llama por HTTP. Estos scripts **son** tu activo de código reutilizable, testeable y versionable — una librería que reusás en cualquier proyecto futuro, tenga o no n8n.
- **Drupal** = la superficie humana + ECA como disparador.

La razón por la que esto gana en reutilización: no apostás todo a una sola herramienta. Los workflows de n8n se clonan por cliente, los servicios de código son librerías que viajan a cualquier stack, y el install de Drupal se plantilla. Y si parte de lo que buscás con "reutilizable" es que te deje aprendizaje transferible: los servicios de código (Python, ffmpeg, integración de APIs) son habilidad durable; n8n es un multiplicador de productividad pero más atado a la herramienta. El híbrido te da las dos cosas.

## El punto de partida concreto que sale de todo esto

1. Montás el hub Drupal 11 + ddev: el content type, los estados de moderación, el calendario y JSON:API. Ese es el backbone y tu superficie de aprobación.
2. Un único loop en n8n: ideación → escribe el borrador en Drupal como *en revisión* → vos aprobás en Drupal → ECA dispara el webhook → un servicio de código formatea el artículo y hace push al repo del sitio estático. Blog primero, con tu clic de aprobación todavía en el medio.
3. Recién cuando ese loop está limpio, sumás la capa social (repurposing → ensamblado de video → publicación).

Decime cómo se despliega numerologiagoan.com (o pegame el CLAUDE.md) y te armo la Fase 1 ya concreta: la definición del content type de Drupal para importar, el `.ddev/config.yaml` de arranque, y el esqueleto del workflow de n8n con el servicio de push al repo. ¿Querés que arranque por ahí?

---

### 🤖 Claude

`[herramienta: view]`

Perfecto, el CLAUDE.md aclara varias cosas que cambian la Fase 1 de forma concreta. Te marco lo relevante y después lo aterrizo.

## Qué cambia con lo que leí

- **El deploy es lo más simple posible**: sitio estático **sin build step** (HTML5 + CSS + JS vanilla, sin npm), en **GitHub Pages** desde `main`, repo `nlanghoffer/numerologiagoan`, con Cloudflare de proxy DNS. "Publicar" = `git add / commit / push`. Eso simplifica enormemente el conector de blog.
- **El blog todavía no existe.** El sitio es un one-page (`index.html` + `politica-privacidad.html`). O sea, parte de la Fase 1 no es "publicar en el blog" sino **crear la estructura del blog** en un sitio que deliberadamente no tiene build. Esa es la decisión nueva que hay que tomar (abajo).
- **Voz y encuadre ya están definidos**: español rioplatense con voseo, audiencia Argentina/Buenos Aires, marca Susana Goan. Y algo importante para las guías de los agentes: el propio sitio encuadra la numerología como *herramienta de autoconocimiento y reflexión* (la FAQ hasta responde "¿tiene base científica?"). El motor de contenido tiene que respetar ese encuadre y evitar promesas deterministas, médicas o financieras — no es sólo criterio editorial, protege a la clienta y además mejora credibilidad y presencia en LLMs.
- **Ya está el objetivo GEO/LLM anotado como pendiente.** Un blog con contenido fresco y bien estructurado (Schema, FAQ) es justamente el vehículo para eso, así que la Fase 1 avanza ese pendiente de paso.
- Los tres handles de redes ya existen (IG `@numerologiasusanagoan`, YT y TikTok `@numerologiagoan`).

## La decisión nueva: cómo vive el blog en un sitio sin build

Tres caminos, con mi recomendación:

**Opción A — Posts HTML autocontenidos, sin build (recomendada).** Cada artículo es un `.html` en `/blog/`, usando el `styles.css` existente y los mismos tokens de diseño. Se crea un template de post + una página índice `/blog/index.html`, y el pipeline los rellena. Push a `main` → GitHub Pages sirve tal cual. Es 100% fiel a la arquitectura que eligieron, te da control total del SEO/Schema por artículo (clave para el objetivo GEO), y el único "costo" —regenerar el índice y el `sitemap.xml` en cada publicación— es exactamente lo que el pipeline automatiza sin esfuerzo.

**Opción B — Jekyll (nativo de GitHub Pages).** Escribís markdown en `_posts/`, GitHub Pages compila del lado servidor (sigue sin build local ni npm). Te da listados/tags/paginado gratis, pero introducís Jekyll/Liquid sobre un sitio hecho a mano y hay que portar el diseño a un layout. Es un stack nuevo que mantener.

**Opción C — SSG (Astro/11ty) con GitHub Actions.** Más potente, pero rompe explícitamente el "no npm, no build" que eligieron. La descartaría salvo que quieran evolucionar todo el sitio.

Voy con la **A**. Y hay una vuelta elegante: como Drupal es la capa de autoría, el render del HTML del post puede vivir en Drupal (una plantilla Twig que espeje el diseño) o en el servicio de exportación (un template Jinja). En cualquier caso Drupal aporta estructura + flujo, y el "publicar" se reduce a: renderizar HTML → commit → push.

## Fase 1 concreta, reformulada

1. **Hub Drupal 11 + ddev**: instalás el content type, los estados de moderación, el calendario y JSON:API.
2. **Template del blog**: se diseña el HTML del post y del índice `/blog/`, reutilizando `styles.css` y los tokens actuales (colores de marca, Cormorant Garamond + Inter, etc.). Tarea de una sola vez.
3. **Loop mínimo**: en el hub redactás/aprobás un artículo → al pasar a *aprobado*, ECA dispara → un servicio de código renderiza el HTML con el template → hace commit vía la API de GitHub y push a `main` → GitHub Pages publica. También regenera índice + `sitemap.xml`.
4. Recién con eso limpio, se suma la capa social.

## El modelo de contenido (independiente de todo lo demás)

Content type **"Pieza de contenido"** en Drupal, con estos campos —ya afinado al sitio real:

- Título, slug, **Estado** (Content Moderation: borrador → en revisión → aprobado → publicado), **Fecha de publicación** (Scheduler)
- **Pilar temático**, **Keyword objetivo**, **Plataformas destino** (blog / IG / YT / TikTok) — taxonomías
- **Cuerpo** del artículo, **Título SEO** y **Meta description** (para `<title>`/OG), **Imagen destacada** (media)
- **FAQ estructurada** (para el bloque JSON-LD FAQPage, patrón que el sitio ya usa)
- **Guion corto**, **Caption IG / YT / TikTok** + hashtags
- **Gráfica de fondo** (media), **Audio TTS** (media), **Video master** (media)
- **URLs / IDs publicados** por plataforma

## Mecánica de publicación a GitHub Pages

El servicio de código no necesita ni git local: puede commitear con la **GitHub Contents API** usando un **fine-grained PAT** limitado sólo al repo `nlanghoffer/numerologiagoan` (permiso *Contents: read/write*), guardado en el credential store de n8n. Un detalle de Cloudflare: los posts nuevos son URLs nuevas, así que aparecen al toque; sólo si sobrescribís un archivo existente conviene purgar caché o usar el mismo patrón `?v=YYYYMMDD` que ya tienen para el cache-busting.

---

Si te cierra la **Opción A**, con tu OK arranco a generar los artefactos concretos de la Fase 1, en este orden para que los puedas probar de a uno:

1. El setup de **ddev + Drupal 11** (comandos `ddev config`, `composer require` de Scheduler/ECA/FullCalendar/JSON:API) y la definición del content type lista para importar.
2. El **template HTML del blog** (post + índice) usando tus tokens de diseño actuales, sin build.
3. El **servicio de push** (commit vía GitHub API) y el esqueleto del **workflow n8n** que lo dispara.

¿Vamos con la A y arranco por el punto 1?

---

### 🧑 Usuario

Vamos por la A, pero antes de arrancar me gustaría establecer el sistema de trabajo con Claude y las demás plataformas/entornos. Me queda la duda si es más conveniente crear un nuevo Artefacto, un Proyecto, si resulta mejor trabajar con Code desde la app o desde consola (powershell).

---

### 🤖 Claude

Buena decisión parar acá — el sistema de trabajo importa tanto como la arquitectura. Antes de recomendarte, dejame verificar el estado actual de las plataformas, porque acá los detalles (sobre todo Claude Code en Windows) cambian seguido y no quiero guiarte de memoria.

`[herramienta: view]`

`[🌐 lectura de página web]`

`[🔍 búsqueda web]`

Excelente que quieras fijar esto primero. La clave para despejar la duda es que **Artefacto, Proyecto y Claude Code no son tres opciones entre las que elegir una** — son tres capas distintas que conviven. Te las separo y después te doy el armado concreto.

## Qué es cada cosa (y cuál es el contenedor)

**Artefacto** = un *output* que se genera dentro de un chat (un documento, un archivo de código, el template del blog). No es un espacio de trabajo, es una pieza que producimos. Así que "crear un Artefacto" no es la decisión de organización — los artefactos son cosas que van saliendo del proceso.

**Proyecto** = el *espacio de trabajo persistente* en Claude.ai. Combina tres cosas: instrucciones personalizadas que se cargan al inicio de cada chat, una base de conocimiento de archivos que Claude consulta automáticamente, y el historial de todas las conversaciones agrupadas. Cuando la base de conocimiento crece, pasa a modo búsqueda (RAG) y sube la capacidad hasta ~10x. Este es tu **HQ**: acá viven la planificación, la estrategia de contenido, la redacción, la curaduría y la coordinación. Disponible en Pro/Max/Team/Enterprise.

**Claude Code** = las *manos que tocan el filesystem real* de tu máquina: editar el repo, montar ddev/Drupal, generar los HTML del blog dentro del repo, escribir el servicio de push, cablear. Acá pasa la construcción.

Entonces la respuesta no es "o Proyecto o Code", es: **un Proyecto como HQ + Claude Code para construir**, y los artefactos son entregables que viajan entre ambos.

## El Proyecto: qué le cargás

En la base de conocimiento del Proyecto: el `CLAUDE.md` del sitio, un doc de arquitectura/decisiones (lo que venimos diseñando en estos chats), la guía de voz y marca (voseo rioplatense, el encuadre de la numerología como autoconocimiento y no adivinación, los do's/don'ts) y el spec del modelo de contenido. En las instrucciones personalizadas ponés el rol ("sos mi copiloto técnico del sistema de contenido de Numerología Goan"), la audiencia y el stack. Un detalle importante: los archivos de conocimiento son *snapshots*, no se actualizan solos — cuando el doc de arquitectura o la guía de marca evolucionen, los volvés a subir, o vas a tener respuestas seguras pero desactualizadas.

Ojo con la simetría que ya venís haciendo bien: el `CLAUDE.md` que Claude Code lee del repo es el equivalente del lado Code de lo que la base de conocimiento es del lado Claude.ai. Ya tenés la mitad del sistema montada; el Proyecto agrega la capa de planificación.

## Claude Code: ¿app o PowerShell?

Primero la buena noticia para Windows: desde 2025 Claude Code corre **nativo en Windows 10/11, sin WSL**. Se instala desde PowerShell con `irm https://claude.ai/install.ps1 | iex` (o por winget), y desde la v2.1.120 **Git for Windows ya no es obligatorio** — si no está, usa PowerShell como shell; igual lo recomiendo instalar para tener Git Bash y el manejo de git más prolijo.

Sobre "app vs consola", mi recomendación concreta para este proyecto: corré Claude Code **en la terminal, pero dentro de VS Code** (terminal integrada + la extensión de Claude Code). Ganás diffs nativos y contexto de archivos abiertos, que para trabajo multi-archivo sobre un repo es muchísimo mejor que revisar cambios en el stream de texto de PowerShell pelado. Si preferís terminal suelta, PowerShell nativo ya te alcanza. La "Code" del app de escritorio es otro front-end del mismo motor — sirve, pero VS Code + extensión es el punto dulce para tocar repos con revisión visual.

Una aclaración de alcance: el "build" no es un solo directorio. Vas a invocar Claude Code en **tres lugares** según toque: el repo del sitio estático (`numerologiagoan`), el nuevo hub Drupal (carpeta ddev) y los servicios de código / workflows. Conviene una carpeta madre que los agrupe.

**Prerrequisito que conviene resolver ya:** el hub Drupal por ddev necesita **Docker Desktop** en Windows (backend WSL2). Eso es una dependencia del proyecto, aparte de Claude Code — vale tenerla lista antes del punto 1.

## El mapa, en una línea cada uno

| Superficie | Rol |
|---|---|
| **Proyecto (Claude.ai)** | HQ: estrategia, redacción, curaduría, decisiones, contexto persistente |
| **Claude Code (VS Code/terminal)** | Construcción sobre archivos reales: repo, ddev/Drupal, servicios, wiring |
| **Artefactos** | Entregables puntuales (doc, template, workflow JSON) que se generan en el HQ |
| **Drupal + n8n** | Runtime: donde el contenido se autoriza y se orquesta, ya en producción |

---

Propongo esto como arranque: creás el Proyecto y para sembrarlo te genero como primer artefacto un **doc de arquitectura y decisiones** que consolide estas tres conversaciones (diseño, stack, Opción A, modelo de contenido y guía de voz) — así cada chat futuro del Proyecto arranca con todo el contexto sin que tengas que reexplicarlo. Con eso adentro, abrís Claude Code en la carpeta del hub y vamos al punto 1 (ddev + Drupal 11).

¿Te genero ese doc consolidado para el Proyecto y seguimos?

---

### Nota — 2026-09-21

Convención no incluida en la conversación original, aplicada al implementar
el punto 1 (hub Drupal en `~/sites/numerologiagoan-hub`): los machine names
(tipos de contenido, vocabularios de taxonomía, nombres de campo) van en
**singular e inglés** — ej. `pieza_contenido` → `content_piece`,
`plataformas` → `platform`, `field_guion_corto` → `field_short_script`. Las
etiquetas visibles (`label`) se mantienen en español. Ver el `CLAUDE.md` del
hub para el detalle completo del modelo de contenido con esta convención ya
aplicada.

### Nota — 2026-09-27

El hub pasó a ser una plataforma **multi-proyecto** llamada **Prism**
(`~/sites/prism`, https://prism.ddev.site); Numerología Goan es su primer
proyecto. Cambios respecto de la nota anterior: la administración y las
etiquetas también van en inglés; el tipo de contenido es `piece`; los
pilares temáticos pasaron a `topic` (por proyecto); `platform` es una config
entity y los canales de cada proyecto una taxonomía `channel`; cada
publicación por canal es una entidad ECK `publication`. El modelo completo
está en el `CLAUDE.md` de Prism.
