# Zonum — Plataforma Inmobiliaria Colombia

## Stack
- **SSG**: Eleventy 2.x con Nunjucks (`.njk`)
- **CSS**: Variables inline en `_includes/base.njk` — sin Tailwind, sin Bootstrap
- **JS**: Vanilla — sin React, sin Vue
- **Datos**: `_data/proyectos/*.json` (1 archivo por proyecto) + `_data/cesiones.json`
- **Hosting**: Replit dev (`npm run dev`) + Replit Deployments estático (`_site/`)

## Design System
```
--azul-base: #1A4F7A
--azul-noche: #0D2B44
--oro-acento: #B8975A
--dark / --concreto-oscuro: #3A3530
--bg / --lino: #F2EEE6
--white / --blanco-calido: #F8F6F2
--font-heading: 'clother', sans-serif  (Adobe Typekit: bnk2dxj.css)
```

## Archivos clave
| Archivo | Propósito |
|---------|-----------|
| `_includes/base.njk` | Shell HTML: `<head>` con CSS vars, nav, footer, scripts |
| `_includes/footer.njk` | Footer 4 columnas — editar aquí → aplica a todas las páginas |
| `_includes/nav.njk` | Topbar azul noche + nav sticky con hamburger |
| `_includes/whatsapp-fab.njk` | Botón flotante WhatsApp (número por proyecto) |
| `_includes/cookie-banner.njk` | Banner cookies con localStorage |
| `_data/proyectos/*.json` | Un JSON por proyecto → genera página en `/proyectos/[slug]/` |
| `_data/cesiones.json` | Array de unidades en cesión → usado por `buscar.njk` |
| `proyectos/proyecto.njk` | Template único que genera todas las páginas de proyecto |

## Convenciones de URLs
- Proyectos: `/proyectos/kashi-santa-marta/` (sin .html, URLs limpias)
- Páginas: `/buscar/`, `/calculadora/`, `/comparar/`, etc.
- Home: `/` → `index.njk`

## Filtros Eleventy disponibles
- `{{ precio | copM }}` → "$450M COP"
- `{{ precio | cop }}` → "$450.000.000"
- `{{ "Nombre Proyecto" | slug }}` → "nombre-proyecto"
- `{{ "" | year }}` → año actual

## Estructura de datos: proyecto
```json
{
  "slug": "kashi-santa-marta",
  "nombre": "Kashi Santa Marta",
  "constructora": "Kashi",
  "ciudad": "Santa Marta",
  "zona": "Taganga",
  "estado": "en_construccion",
  "precio_desde": 320000000,
  "roi_anual": 14.8,
  "entrega": "Q3 2026",
  "torres": 2,
  "unidades": 96,
  "tags": ["Playa", "Airbnb Ready", "Vista al mar"],
  "whatsapp": "573001234567",
  "og_image": "https://images.unsplash.com/photo-xxx",
  "tipologias": [...],
  "amenidades": [...],
  "pois": [...],
  "escenarios": [...]
}
```

## Proyectos actuales
| Slug | Ciudad | Estado |
|------|--------|--------|
| `kashi-santa-marta` | Santa Marta | En construcción |
| `alma-luxury-lofts` | Medellín | Preventa |
| `tuliv-la-candelaria` | Bogotá | Preventa |

## Decisiones de arquitectura
- **footer.js descartado** — FOUC + SEO. Usar `_includes/footer.njk` en su lugar.
- **buscar.njk** inyecta `window.CESIONES` desde `cesiones.json` en build-time (no fetch).
- **URLs sin .html** — Eleventy genera `index.html` dentro de carpeta por cada página.
- **CSS inline en base.njk** — evita un request extra de CSS, páginas funcionan sin servidor.
- **Imágenes**: Unsplash vía CDN directo en JSON (`images.unsplash.com/photo-ID?w=800&q=80`).

## Para agregar un proyecto nuevo
1. Crear `_data/proyectos/nuevo-proyecto.json` con la estructura de datos arriba
2. `npm run build` → genera automáticamente `/proyectos/nuevo-proyecto/`
3. Sin tocar `proyecto.njk` si el proyecto tiene datos estándar

## Para agregar cesiones (workflow AI-first)

El usuario dice algo como: "Agrega cesión: Kashi, 2 hab, piso 8, $495M, vista mar"

Claude hace:
```bash
git pull  # siempre primero
```
Luego edita `_data/cesiones.json` y agrega el objeto. Luego:
```bash
cd /Users/sebastianmorales/zonum-eleventy
git add _data/cesiones.json
git commit -m "add: cesión [ID] — [tipo] en [proyecto]"
git push
```
Cloudflare Pages redespliega automáticamente en ~60s.

### Schema completo de cesión

**Campos requeridos:**
```json
{
  "id": "KSM-2hab-001",
  "proyecto_slug": "kashi-santa-marta",
  "proyecto_nombre": "Kashi Santa Marta",
  "ciudad": "Santa Marta",
  "tipo": "2 hab",
  "precio_cesion": 495000000,
  "estado": "disponible",
  "whatsapp": "573001234567",
  "fecha_publicacion": "2026-03-29"
}
```

**Campos opcionales (agregar si el usuario los menciona):**
```json
{
  "zona": "Taganga",
  "tipologia": "C",
  "piso": 8,
  "m2": 72,
  "vista": "mar",
  "parqueadero": true,
  "bodega": false,
  "precio_original": 480000000,
  "ganancia_cedente": 15000000,
  "entrega_estimada": "Q3 2026",
  "roi_estimado": 14.8,
  "imagen": "https://images.unsplash.com/photo-ID?w=600&q=80",
  "notas": "Texto libre con detalles adicionales"
}
```

**Convención de IDs:** `[SIGLAS_PROYECTO]-[tipo]hab-[###]`
- Kashi Santa Marta → `KSM`
- Alma Luxury Lofts → `ALM`
- Tuliv La Candelaria → `TUL`

**Estados válidos:** `disponible` | `en_negociacion` | `reservado`

### Cambiar estado de una cesión
```bash
git pull
# Editar el campo "estado" en _data/cesiones.json
git add _data/cesiones.json
git commit -m "update: cesión [ID] → [nuevo_estado]"
git push
```

## Hosting: Replit
- Repo importado desde `github.com/filivco/zonum-eleventy`
- Dev: `npm run dev` → preview en el puerto de Replit
- Producción: tab "Deployments" → Static → output `_site`
- Cada deploy en Replit toma el código del repo

## Regla de oro
**Nunca editar directamente en Replit.**
Siempre: Claude edita local → `git push` → sync en Replit → Deploy.
