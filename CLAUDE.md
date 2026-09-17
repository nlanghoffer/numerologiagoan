# Numerología Goan — Documentación del proyecto

## Descripción general

Sitio web profesional de una página (one-page) para **Susana Goan**, numeróloga profesional argentina. Opera bajo el dominio `numerologiagoan.com`.

- **Stack**: HTML5 + CSS3 + JavaScript vanilla (IIFE, sin ES modules, sin npm, sin build step)
- **Hosting**: GitHub Pages (rama `main`, publicación automática)
- **Repositorio**: `github.com/nlanghoffer/numerologiagoan`
- **DNS**: Cloudflare (dominio registrado en Namecheap)
- **CNAME**: `dev.numerologiagoan.com` — valor generado por GitHub al asociar el dominio custom; no editar
- **Ubicación local**: `\\wsl$\Ubuntu\home\nicolas\sites\numerologiagoan` (filesystem de WSL Ubuntu, accesible desde Windows como ruta UNC)
- **Servidor local** (desde terminal WSL):
  ```bash
  python3 -m http.server 8765 --directory ~/sites/numerologiagoan
  ```
  Acceder en el navegador de Windows: `http://localhost:8765`

---

## Estructura de archivos

```
/
├── index.html                  # Página principal (one-page, 7 secciones)
├── politica-privacidad.html    # Política de privacidad (Ley 25.326 AR)
├── styles.css                  # Hoja de estilos única (?v=YYYYMMDD)
├── main.js                     # JavaScript único (?v=YYYYMMDD)
├── sitemap.xml                 # Sitemap para buscadores
├── robots.txt                  # Directivas para crawlers
├── CNAME                       # Dominio custom para GitHub Pages
├── favicon.ico                 # Favicon raíz
├── img/
│   ├── favicon-16x16.png
│   ├── favicon-32x32.png
│   └── apple-touch-icon.png
└── assets/
    └── img/
        ├── susana-portrait.webp    # Foto vertical 480×640px — sección "Sobre mí"
        └── susana-square.webp      # Foto cuadrada 768×768px — Schema.org y OG
```

---

## Deploy

```bash
git add -A
git commit -m "descripción"
git push

# Si el push es rechazado por cambios remotos:
git pull --rebase && git push
```

GitHub Pages publica automáticamente desde `main`. Cloudflare actúa como proxy DNS con caché.

**Cache-busting**: al modificar `styles.css` o `main.js`, actualizar la fecha en los query strings de `index.html` y `politica-privacidad.html`:
```html
<link rel="stylesheet" href="styles.css?v=20260609" />
<script defer src="main.js?v=20260609"></script>
```

---

## Secciones del sitio (index.html)

| # | ID | Label de sección | Fondo |
|---|---|---|---|
| — | `#inicio` | Hero | blanco + gradiente (especial) |
| 01 | `#que-es` | Punto de partida | gris claro (`section-alt`) |
| 02 | `#servicios` | Cómo puedo ayudarte | blanco |
| 03 | `#susana` | Sobre mí | gris claro (`section-alt`) |
| 04 | `#beneficios` | ¿Qué vas a encontrar? | blanco |
| 05 | `#testimonios` | Testimonios | gris claro (`section-alt`) |
| 06 | `#faq` | Preguntas frecuentes | blanco |
| 07 | `#formulario` | Contacto | gris claro (`section-alt`) |
| — | — | Footer | azul oscuro (`--gray-900: #111827`) |

La alternancia gris/blanco empieza desde la sección 01 (gris) y sigue de forma rigurosa. La clase `section-alt` asigna `background: var(--bg-alt)`. El footer usa `--gray-900` (no `--bg-dark`).

---

## Navegación

### Nav principal (`index.html`)
Anclas directas: `#que-es`, `#servicios`, `#susana`, `#beneficios`, `#faq`, `#formulario`

### Nav en `politica-privacidad.html`
Rutas absolutas con hash: `/#que-es`, `/#servicios`, `/#susana`, `/#beneficios`, `/#faq`, `/#formulario`
El nav tiene `is-scrolled` hardcodeado (no hay hero, la nav siempre es sólida).

### Footer nav (`index.html`)
Anclas: `#que-es`, `#servicios`, `#susana`, `#faq`, `#formulario` (sin `#beneficios`)

### Footer nav (`politica-privacidad.html`)
Rutas: `/#que-es`, `/#servicios`, `/#susana`, `/#faq`, `/#formulario`

---

## Tipografía

### Google Fonts
```
https://fonts.googleapis.com/css2?
  family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,400;1,500
  &family=Inter:wght@400;500;600
  &display=swap
```

- **Cormorant Garamond**: títulos, nombre de marca, stats, quotes
- **Inter**: cuerpo de texto, etiquetas, botones

### En `politica-privacidad.html`
Subset reducido (3 variantes menos para la página secundaria):
```
family=Cormorant+Garamond:ital,wght@0,400;0,500;1,400
&family=Inter:wght@400;500;600
```

---

## CSS — Custom Properties (`:root`)

```css
/* Colores */
--bg:           #ffffff
--bg-alt:       #f4f6f9          /* secciones grises */
--bg-dark:      #1B3A5C          /* definida pero no usada en layout actual */
--blue-deep:    #1B3A5C          /* color principal de marca */
--blue-petrol:  #2C5F6C          /* acento secundario */
--blue-mid:     #2a4f72          /* hover de botones */
--gray-900:     #111827          /* footer, textos oscuros */
--gray-700:     #374151          /* texto cuerpo */
--gray-500:     #6B7280          /* texto secundario */
--gray-400:     #9CA3AF          /* placeholders, opcionales */
--gray-300:     #D1D5DB          /* bordes claros */
--gold:         #B8966E          /* acento dorado */
--gold-light:   #d4b48a          /* acento dorado claro (footer) */
--gold-pale:    #f0e4d0          /* fondo hover btn-white */
--white:        #ffffff
--line:         rgba(17,24,39,0.1)    /* bordes sutiles */
--line-light:   rgba(255,255,255,0.15)

/* Radios */
--radius-sm:    6px
--radius:       12px
--radius-lg:    20px

/* Sombras */
--shadow-sm:    0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04)
--shadow:       0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)
--shadow-lg:    0 12px 40px rgba(0,0,0,0.1), 0 4px 16px rgba(0,0,0,0.06)
--shadow-blue:  0 8px 32px rgba(27,58,92,0.2)

/* Layout */
--nav-h:        72px    (60px en mobile ≤600px)
--container:    1160px
--section-py:   96px    (72px en ≤1024px, 56px en ≤900px, 48px en ≤600px)

/* Easing */
--ease-out:     cubic-bezier(0.16, 1, 0.3, 1)
--ease-in-out:  cubic-bezier(0.45, 0, 0.55, 1)

/* Tipografía (aliases) */
--font-serif:        "Cormorant Garamond", Georgia, serif
--font-body:         "Inter", -apple-system, BlinkMacSystemFont, system-ui, sans-serif

/* Misc */
--border:            rgba(17,24,39,0.1)   /* alias de --line, para FAQ y polpri */
--text-secondary:    #6B7280              /* alias de --gray-500, para FAQ y polpri */
```

---

## CSS — Responsive breakpoints

| Breakpoint | Cambios clave |
|---|---|
| ≤1024px | `--section-py: 72px`, beneficios 3 columnas |
| ≤900px | nav hamburguesa, hero 1 col, susana 1 col, servicios 1 col, beneficios 2 col, slider 2 slides, footer 2 col |
| ≤768px | FAQ layout 1 columna |
| ≤600px | `--section-py: 48px`, `--nav-h: 60px`, hero 1 col, beneficios 1 col, slider 1 slide, footer 1 col |

---

## Hero

Fondo blanco con tres capas decorativas (z-index 0, `pointer-events: none`):
1. **Grid**: `background-image` con líneas cruzadas, `opacity: 0.35`, mask radial
2. **Números flotantes** (`.hn`): spans con CSS custom props `--x`, `--y`, `--s`, `--o` (posición, tamaño, opacidad)
3. **Glows**: dos `div` con `radial-gradient` y `filter: blur(80px)`, animación `glowDrift` 18s/22s

Visual derecho: SVG geométrico con círculos concéntricos, polígono estrella 9 puntas, arco dorado. Animación `rotateSlow` 60s lineal infinita.

Scroll hint: línea vertical animada con `scrollDrop` (2s delay, 2s duración, loop).

Animaciones de entrada del texto: `fadeUp` con delays escalonados (0.3s → 0.5s → 0.7s → 0.9s).

---

## Sección Estadísticas (`#que-es`)

Dos contadores con `data-count-to`:
- `data-count-to="20"` → "20+ años de práctica"
- `data-count-to="500"` → "500+ estudios realizados"

El `+` se agrega vía CSS: `.stat-number::after { content: "+"; }`

---

## Testimonios — Slider

6 testimonios reales de Google (Ile Lanffer, Karina Falero, Micaela Daiana Laneri, Micaela Castillo, Berenice Macri, Josi Angulo). Todos 5 estrellas.

Slides visibles por viewport:
- Desktop (>900px): 3 slides → `flex: 0 0 calc(100% / 3)`
- Tablet (≤900px): 2 slides → `flex: 0 0 50%`
- Mobile (≤600px): 1 slide → `flex: 0 0 100%`

Autoplay: 8000ms (`AUTO_MS = 8000`). Se pausa en hover/focus sobre el wrapper.
Swipe táctil: umbral de 50px.
Dots: se reconstruyen en resize (debounce 150ms).

---

## FAQ — Acordeón animado

6 preguntas frecuentes. Implementación con `<details>/<summary>` pero con animación JS custom (`initFaq`) porque la transición CSS nativa no funciona sobre `<details>`.

**Técnica de animación** (doble `requestAnimationFrame`):
- Abrir: `setAttribute("open")` → `maxHeight: 0` → rAF → rAF → `maxHeight: scrollHeight + "px"` → al finalizar: `maxHeight: "none"`
- Cerrar: fijar `maxHeight: scrollHeight` → rAF → rAF → `maxHeight: 0` → al finalizar: `removeAttribute("open")`

Layout desktop: `grid-template-columns: 1fr 1.8fr` con `align-items: center` (título izquierda alineado verticalmente con el centro de la lista FAQ).
Layout mobile (≤768px): 1 columna.

Chevron: SVG inline via `background-image` en `::after`, rota 180° cuando `details[open]`.

---

## Formulario de contacto

**Endpoint**: `https://api.web3forms.com/submit`

Campos ocultos:
```html
<input name="access_key"  value="a44f0dc3-a635-4019-bbc1-b2475ec50f0d" />
<input name="subject"     value="Nueva consulta desde numerologiagoan.com" />
<input name="from_name"   value="Numerología Goan" />
<input type="checkbox" name="botcheck" style="display:none" />  <!-- honeypot -->
```

Campos visibles: Nombre completo (requerido), Teléfono (opcional), Email (requerido), Mensaje (requerido).

Estados del botón submit: normal → `is-loading` (spinner visible, label opacidad 0.7, disabled) → éxito/error.

En éxito: `form.reset()`, `form.hidden = true`, muestra `#form-success` (`aria-live="polite"`).
En error: muestra `#form-error` con link a WhatsApp.

---

## JavaScript (main.js) — Funciones

Patrón IIFE estricto. Función `safe(fn, name)` envuelve cada init en try/catch con `console.warn`.

### `initNav()`
- `is-scrolled` cuando `scrollY > 20` (backdrop-filter + border + shadow)
- Menú mobile: toggle `is-open` en `.nav-mobile` y `.nav-toggle`, maneja `aria-expanded` y `aria-hidden`
- Cierra el menú mobile al hacer click en cualquier enlace

### `initScrollSpy()`
- Lee secciones desde los `href` de `.nav-link[href^="#"]`
- Offset: `--nav-h + 16px`
- Agrega `is-active` al enlace correspondiente con línea dorada (`::after`)

### `initSmoothScroll()`
- Delegación de eventos en `document` para `a[href^="#"]`
- Respeta `prefers-reduced-motion` (usa `behavior: "auto"` si reduce)
- Offset: `--nav-h`

### `initReveals()`
- `IntersectionObserver` con `threshold: 0.04` y `rootMargin: "0px 0px -4% 0px"`
- `data-delay` para delays escalonados (ej: `data-delay="100"`)
- Safety net a 6000ms: revela cualquier `.reveal` dentro del viewport que no se haya activado

### `initCountUp()`
- `IntersectionObserver` con `threshold: 0.3`
- Easing cúbico: `1 - Math.pow(1 - progress, 3)`
- Duración: 1800ms
- Respeta `prefers-reduced-motion` (muestra valor final directamente)

### `initContactForm()`
- Previene submit por defecto, valida con `checkValidity()`/`reportValidity()`
- `fetch` con `FormData`, parsea JSON de respuesta
- Manejo de estados del botón, mensajes de éxito/error

### `initSlider()`
- 6 slides, visible según ancho: 3/2/1
- `goTo(index)`: `translateX(-${pct}%)` donde `pct = current * (100 / getVisible())`
- Dots dinámicos (se reconstruyen en resize)
- Autoplay 8000ms, pausa en hover/focus/mouseenter
- Swipe táctil con umbral 50px
- Resize debounce 150ms

### `initFaq()`
- Ver sección "FAQ — Acordeón animado" arriba

### `boot()`
Orden de inicialización:
```
initNav → initScrollSpy → initSmoothScroll → initReveals →
initCountUp → initContactForm → initSlider → initFaq
```
Se ejecuta en `DOMContentLoaded` o inmediatamente si el DOM ya está listo.

---

## SEO

### `<head>` — Metadatos
```html
<title>Numerología Goan | Estudios y Cursos con Susana Goan</title>
<!-- 53 caracteres — keyword principal al inicio, marca al inicio -->

<meta name="description" content="Numerología aplicada al autoconocimiento con
Susana Goan. Estudios personalizados y cursos para comprender tus ciclos de
vida, fortalezas y momentos de cambio." />

<meta name="keywords" content="numerología, numerología pitagórica, numerología
personalizada, numerología Argentina, numerología Buenos Aires, autoconocimiento,
ciclos de vida, estudios de numerología, cursos de numerología, consulta de
numerología, mapa numerológico, numerología online, Susana Goan, numeróloga
profesional, numerología Susana Goan" />

<link rel="canonical" href="https://numerologiagoan.com/" />
<link rel="sitemap" type="application/xml" href="/sitemap.xml" />
```

### Open Graph
```html
<meta property="og:type"        content="website" />
<meta property="og:url"         content="https://numerologiagoan.com/" />
<meta property="og:title"       content="Numerología Goan | Estudios y Cursos con Susana Goan" />
<meta property="og:description" content="Numerología como herramienta de autoconocimiento,
  reflexión y toma de decisiones. Estudios personalizados y cursos." />
<meta property="og:image"       content="https://numerologiagoan.com/assets/img/susana-square.webp" />
<meta property="og:image:width"  content="768" />
<meta property="og:image:height" content="768" />
<meta property="og:image:type"   content="image/webp" />
<meta property="og:locale"       content="es_AR" />
<meta property="og:site_name"    content="Numerología Goan" />
```

### Twitter Card
```html
<meta name="twitter:card"        content="summary" />  <!-- cuadrada: NO usar summary_large_image -->
<meta name="twitter:title"       content="Numerología Goan — Susana Goan" />
<meta name="twitter:description" content="Numerología aplicada al autoconocimiento. ..." />
<meta name="twitter:image"       content="https://numerologiagoan.com/assets/img/susana-square.webp" />
```

### Schema.org — 3 bloques JSON-LD

**1. ProfessionalService**
```json
{
  "@type": "ProfessionalService",
  "name": "Numerología Goan",
  "telephone": "+5491131265860",
  "image": "susana-square.webp",
  "priceRange": "$$",
  "address": { "addressCountry": "AR" },
  "founder": { "name": "Susana Goan", "jobTitle": "Numeróloga profesional" },
  "areaServed": ["Buenos Aires", "Gran Buenos Aires", "Argentina"],
  "knowsLanguage": "es",
  "sameAs": [instagram, youtube, tiktok],
  "hasOfferCatalog": { "Estudios numerológicos personalizados", "Cursos de numerología" }
}
```

**2. FAQPage** — 6 preguntas:
1. ¿Qué es la numerología y para qué sirve?
2. ¿Qué incluye un estudio numerológico personalizado?
3. ¿Las sesiones son presenciales u online?
4. ¿Cuánto dura un estudio o consulta?
5. ¿Necesito conocimientos previos para hacer el curso?
6. ¿La numerología tiene base científica?

**3. Person**
```json
{
  "@type": "Person",
  "name": "Susana Goan",
  "jobTitle": "Numeróloga profesional",
  "description": "Especialista en numerología pitagórica... +20 años, +500 estudios",
  "nationality": "Argentina",
  "worksFor": { "ProfessionalService" : "Numerología Goan" },
  "sameAs": [instagram, youtube, tiktok]
}
```

### Archivos SEO
- **`sitemap.xml`**: una URL (`https://numerologiagoan.com/`), `lastmod: 2026-06-09`, `changefreq: monthly`, `priority: 1.0`
- **`robots.txt`**: `User-agent: * / Allow: / / Sitemap: https://numerologiagoan.com/sitemap.xml`
- **Google Search Console**: verificado en septiembre 2026 vía registro DNS TXT en Cloudflare. Sitemap enviado manualmente desde GSC.

---

## Rendimiento

- **LCP preload**: `<link rel="preload" as="image" href="assets/img/susana-portrait.webp" type="image/webp" />`
- **`loading="lazy"`** en `<img>` de Susana (no es LCP — sí lo es `susana-portrait.webp`)
- **`defer`** en `main.js`
- **`prefers-reduced-motion`**: desactiva `glowDrift`, `rotateSlow`, `scrollDrop`, `.reveal` transitions
- **`scroll-behavior: smooth`** solo bajo `prefers-reduced-motion: no-preference`
- **Fonts `display=swap`**: evita FOIT
- **`overflow-x: clip`** en `html` y `body` (evita scroll horizontal sin crear stacking context)
- **`text-rendering: optimizeLegibility`** y `-webkit-font-smoothing: antialiased`

---

## Accesibilidad

- **Roles ARIA**: `role="banner"` (header), `role="contentinfo"` (footer), `role="navigation"` (nav)
- **`aria-labelledby`** en cada `<section>`
- **`aria-label`** en botones sin texto visible (nav-toggle, slider-prev, slider-next, social links)
- **`aria-live="polite"`** en feedback del formulario y en el slider (`.testimonios-slider`)
- **`aria-expanded`** y **`aria-hidden`** en menú mobile
- **`aria-selected`** en slider dots (`role="tab"`)
- **`:focus-visible`**: `outline: 2px solid var(--blue-petrol); outline-offset: 3px`
- **`user-select: none`** en elementos decorativos (números hero, quote decorativa)

---

## Politica de privacidad (`/politica-privacidad.html`)

- `<meta name="robots" content="noindex, follow">` — no indexar
- `<link rel="canonical" href="https://numerologiagoan.com/politica-privacidad.html">`
- Mismo nav y footer que `index.html` (con `/#section` en lugar de `#section`)
- Nav con `is-scrolled` hardcodeado en el `<header>`
- Estilos inline exclusivos en `<style>` dentro del `<head>`: `.page-wrap`, `.page-title`, `.legal-h2`, `.highlight-box`, etc.
- Padding responsive: `10rem` → `7rem` (≤1200px) → `5rem` (≤768px)
- Contenido bajo Ley 25.326 Argentina: 8 secciones (responsable, datos, finalidad, terceros/Web3Forms, conservación, derechos, seguridad, cambios)
- El footer incluye link a sí misma: `<a href="/politica-privacidad.html">Política de privacidad</a>`

---

## Redes sociales

| Red | Handle | URL |
|---|---|---|
| Instagram | `@numerologiasusanagoan` | `https://www.instagram.com/numerologiasusanagoan` |
| YouTube | `@numerologiagoan` | `https://www.youtube.com/@numerologiagoan` |
| TikTok | `@numerologiagoan` | `https://www.tiktok.com/@numerologiagoan` |

---

## Contacto del cliente

- **Nombre**: Susana Goan
- **WhatsApp**: +54 9 11 3126-5860
- **URL WhatsApp**: `https://wa.me/5491131265860`
- **Idioma**: español rioplatense (voseo — "querés", "tenés", "completá", etc.)

---

## Trabajo pendiente

- **GEO / optimización para LLMs**: mejorar presencia en respuestas de modelos de lenguaje e IA generativa (discutido, no implementado).
