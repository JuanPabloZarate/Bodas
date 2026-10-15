# Original User Request

## 2026-10-12T01:42:05Z

Construir la plataforma web modular "Atelier Nuptial" (Goal Bodas) en Next.js (App Router, TypeScript, Tailwind CSS) implementando todos los módulos y experiencias de usuario basados en los prototipos y especificaciones de diseño ubicados en `stitch_weeding`.

Working directory: c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app
Integrity mode: development

Reference Materials:
- Guía de diseño y tokens (Colores, Tipografía Playfair Display/Montserrat, Espaciado, Componentes): `stitch_weeding/stitch_weeding/atelier_nuptial/DESIGN.md`
- Prototipos de referencia HTML/CSS:
  - Portal de Administración: `stitch_weeding/stitch_weeding/admin_portal/code.html`
  - Invitación Pública y Landing: `stitch_weeding/stitch_weeding/web_option/code.html`, `stitch_weeding/stitch_weeding/wedding_invitation_guest_portal/code.html` y versión móvil `stitch_weeding/stitch_weeding/web_option_mobile/code.html`
  - Portal Privado del Invitado: `stitch_weeding/stitch_weeding/celebration_portal/code.html` y versión móvil `stitch_weeding/stitch_weeding/celebration_portal_mobile/code.html`
  - Wedding Pulse / Live Celebration Hub: `stitch_weeding/stitch_weeding/wedding_pulse/code.html`, `stitch_weeding/stitch_weeding/wedding_pulse_live_celebration_hub/code.html` y versión móvil `stitch_weeding/stitch_weeding/wedding_pulse_mobile/code.html`

## Requirements

### R1. Base de Proyecto y Sistema de Diseño UI
- Inicializar el proyecto en `c:\Users\Juan Pablo\Desktop\Goal Bodas\atelier_nuptial_app` con Next.js (App Router), TypeScript y Tailwind CSS.
- Configurar la identidad visual exacta según `DESIGN.md`:
  - Fuentes de Google Fonts: `Playfair Display` (serif) y `Montserrat` (sans-serif).
  - Paleta de colores completa (eucalyptus sage `#4d6150` / `#6B7F6D`, terracotta rose `#805341` / `#C9937E`, espresso `#211a18` / `#2C2523`, marfil `#fff8f6` / `#FAF8F5`).
  - Sombras difusas cálidas, bordes sutiles de papelería nupcial y esquinas redondeadas suaves.
- Biblioteca de componentes UI reutilizables y atómicos (Navigation Header, Footer, Hero Banner, Metric/KPI Card, Modal dialogs, Button, Input, Badge/Chip, Photo Card, Timeline Item).

### R2. Módulo 1: Invitación Digital & Landing Pública (`/`)
- Portada de bienvenida (Hero con nombres de pareja, fecha del enlace, lugar en Toscana/Chianti).
- Historia de la pareja y detalles de la ceremonia.
- Cronograma / Itinerario de actividades.
- Formulario interactivo de confirmación RSVP.
- Mesa de regalos nupcial y libro de firmas (Guestbook) interactivo donde los visitantes pueden dejar mensajes y dedicatorias.
- Diseño totalmente responsivo adaptado para dispositivos móviles y escritorio.

### R3. Módulo 2: Portal Privado del Invitado (`/portal`)
- Vista personalizada de bienvenida para el invitado (VIP guest).
- Resumen de estado de confirmación, mesa asignada y código de acceso.
- Itinerario interactivo día a día con actividades, códigos de vestimenta y mapa/ubicación.
- Sección de recuerdos, información práctica y galería fotográfica previa.
- Adaptabilidad móvil completa según las referencias mobile.

### R4. Módulo 3: Wedding Pulse — Live Celebration Hub (`/pulse`)
- Centro de interacción en vivo para el día de la boda.
- Live Photo Stream con capacidad de simular la subida y visualización de fotos en tiempo real.
- Cronograma dinámico y cuenta regresiva de momentos clave (Ceremonia, Coctel, Banquete, Primer Baile).
- Guest Lounge interactivo con comentarios, reacciones emocionales (brindis, corazones, aplausos) y lista de canciones / DJ requests.

### R5. Módulo 4: Portal de Administración (`/admin`)
- Panel de control con métricas clave (Total invitados, Confirmados, Cancelados, Pendientes, Alertas de menú/dietas, Estado de regalos).
- Directorio de invitados completo con filtros, buscador y modal para agregar o editar invitados.
- Gestor de asignación de mesas y distribución de asientos (Seating Chart).
- Analítica de confirmaciones y desglose de preferencias dietéticas para catering.
- Configuración de la boda y acceso a vista previa de los portales.

### R6. Modelo de Datos, Estado Reactivo y Persistencia Local
- Esquemas fuertemente tipados en TypeScript para: Invitados, Mesas, Entradas del cronograma, Mensajes de firmas, Fotos y Reacciones.
- Estado global / reactivo del cliente con sincronización y persistencia en `localStorage` para que cualquier cambio (crear invitado en admin, enviar RSVP en la web, subir foto o dejar dedicatoria en el Pulse) persista entre recargas y se refleje entre los módulos.
- Datos mock realistas precargados para permitir exploración inmediata de todos los módulos.

### R7. Verificación Programática y Suite de Pruebas
- Configurar Vitest con Testing Library y TypeScript.
- Tests unitarios y de componentes verificando:
  - Renderizado correcto de cada ruta/página principal.
  - Funcionamiento del flujo de envío de RSVP y persistencia en estado.
  - Filtrado y adición de invitados en el panel de administración.
  - Interacciones del módulo Wedding Pulse (reacciones y comentarios).
- `npm run build` ejecutado exitosamente sin ningún error de TypeScript, ESLint ni empaquetado.

## Acceptance Criteria

### Compilación y Calidad de Código
- [ ] `npm run build` compila el proyecto Next.js en modo producción sin errores ni advertencias de compilación.
- [ ] No existen errores de tipado en TypeScript (`npx tsc --noEmit`).
- [ ] Vitest ejecuta y aprueba el 100% de la suite de pruebas unitarias (`npm run test`).

### Fidelidad Visual y Responsive Design
- [ ] Todos los módulos implementan la tipografía Playfair Display y Montserrat con la paleta de colores Atelier Nuptial.
- [ ] Cada módulo es completamente responsivo, adaptándose fluidamente tanto a pantallas móviles (<640px) como a escritorio.

### Funcionalidad de los 4 Módulos
- [ ] La landing pública (`/`) permite leer la información del evento, enviar una confirmación RSVP y dejar un mensaje en el guestbook.
- [ ] El portal del invitado (`/portal`) muestra la tarjeta personalizada con itinerario y detalles de asistencia.
- [ ] El Wedding Pulse (`/pulse`) permite añadir fotos simuladas, publicar comentarios en el lounge y disparar reacciones en vivo.
- [ ] El Admin Portal (`/admin`) despliega los KPIs numéricos, permite buscar/filtrar en el directorio de invitados y añadir un nuevo invitado mediante modal.
- [ ] Los datos modificados por el usuario persisten en `localStorage` tras recargar la página.
