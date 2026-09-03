# Sistema de Gestión Institucional — I.E. JEC Simón Bolívar

Sistema web para la evaluación de desempeño del personal, con diseño estilo Apple (curvo, translúcido, modo claro/oscuro) en la paleta guinda de la institución.

## ✅ Novedades de esta versión

- **Tablas del reporte corregidas:** el problema de columnas desalineadas (el criterio muy angosto con espacio en blanco, mientras la observación se desbordaba) se debía a que las columnas no respetaban el ancho asignado. Ahora sí lo respetan, con la columna de criterio/pregunta más compacta y la de respuesta/observación con más espacio, todo alineado arriba de forma pareja — aplica a Formulario 1 y Formulario 2, y a todas las tablas de los reportes consolidados.
- **Supervisión ahora incluye también al equipo directivo:** además de los docentes evaluados por cada coordinador, la pestaña Supervisión muestra una sección aparte con la Subdirectora y cada Coordinador —evaluados directamente por la Directora—, con su Formulario 1, Formulario 2 y nivel (Inicio/Proceso/Logrado), incluido en el resumen "¿Quién está en Inicio, Proceso o Logrado?" y en el PDF descargable.
- **Insignia desde la carpeta — corregido:** el sistema ahora revisa la carpeta `assets/images/insignia/` cada vez que se abre (no solo la primera vez), así que si reemplazas el archivo `foto1` por otra imagen, el cambio se refleja automáticamente. Si Soporte Técnico sube un logo manualmente desde el panel, ese queda con prioridad y no se sobrescribe.
- **PDF sin cortes ni letra chica:** cuando un docente escribe respuestas u observaciones muy largas, el reporte ya no las corta a la mitad entre hojas ni reduce el texto a un tamaño ilegible para forzarlo en una sola página. El sistema ahora mide el contenido real y reparte las preguntas/filas completas entre tantas hojas como haga falta, sin partir ninguna por la mitad — los reportes cortos siguen ocupando una sola hoja bien aprovechada, y los reportes largos usan 2 o más hojas, siempre con buena letra.
- **Inicio / Proceso / Logrado por persona, en Supervisión y descargable en PDF:** la pestaña Supervisión ahora muestra, además de los conteos generales, quién (con nombre) está clasificado en Inicio, Proceso o Logrado según el Formulario 2 de su coordinador, con un botón para descargar todo eso en PDF.
- **Última conexión (con fecha y hora):** el Directorio —ahora también disponible para la Subdirectora, no solo la Directora— muestra cuándo fue la última vez que cada persona con acceso inició sesión. Importante: como el sistema no tiene servidor central, este registro se guarda en el navegador/computadora donde cada quien inicia sesión — es confiable si todos usan la misma computadora; si cada persona usa su propio dispositivo, cada equipo solo "sabe" de los ingresos hechos en él mismo.

- **Insignia personalizada desde una carpeta:** ya no hace falta subirla desde el sistema — coloca tu imagen dentro de `assets/images/insignia/` con el nombre `foto1` (por ejemplo `foto1.png`, `foto1.jpg` o `foto1.svg`) y el sistema la detecta solo la próxima vez que abras `index.html`. Se usa exactamente la misma imagen en el encabezado, el inicio de sesión y también en los reportes PDF. (La opción de subirla manualmente desde Soporte Técnico → Institución sigue disponible si la prefieres.)
- **PDF con letra legible que aprovecha la hoja:** se aumentó el tamaño de letra del reporte (ya no queda diminuto) y se ajustó cómo se acomoda en la hoja A4: los reportes cortos (como el Formulario 1) se amplían levemente para que la hoja se vea completa en vez de un recorte pequeño con espacio en blanco; los que caben de forma natural se colocan tal cual; y los muy extensos (como el Formulario 2 con sus más de 30 criterios, o un consolidado con muchas personas) solo se reducen si el texto se mantiene legible — si aun reduciéndolo no entrarían bien en una sola hoja, el sistema prefiere usar 2 hojas con buena letra antes que una sola con texto ilegible.

- **PDF en una sola hoja, con buena letra:** se rediseñó por completo el formato de los reportes (encabezado en franja guinda, tarjetas de resumen compactas, tablas más densas y legibles) y la exportación ahora ajusta automáticamente el contenido para que quepa en una hoja A4. Solo si un reporte consolidado tiene demasiadas personas para verse bien en una hoja, el sistema pagina en vez de reducir el texto a un tamaño ilegible.
- **Todo el formulario es obligatorio para poder finalizar:** en Formulario 1 (las 12 preguntas) y Formulario 2 (Inicio/Proceso/Logrado + observación de cada criterio, y ambos campos de Conclusiones) ya no se puede finalizar dejando algo en blanco — el sistema indica exactamente qué falta.
- **Guardar borrador vs. Guardar y finalizar:** cada formulario tiene dos botones. "Guardar borrador" guarda el avance sin exigir que esté completo, para continuar después. "Guardar y finalizar" exige que todo esté lleno y, una vez finalizado, habilita "Ver reporte" y la descarga en PDF (los borradores muestran un botón "Continuar" en vez de "Ver", y no se pueden exportar hasta finalizarse).
- **Soporte Técnico puede reabrir evaluaciones:** desde Cuentas, si a un coordinador, la Subdirectora o la Directora se le olvidó marcar algo en una evaluación ya finalizada, Soporte puede reabrirla (vuelve a "borrador") para que la persona la corrija y la finalice de nuevo.
- **Dashboard más informativo:** saludo personalizado, barras de progreso de Formulario 1 y 2 (con el detalle de cuántos están en borrador), y la lista de quién falta por evaluar ahora se ve directamente como chips de nombres, sin tener que hacer clic para desplegarla.
- **Acceso simplificado:** ahora solo se ingresa el **DNI** (sin nombre de usuario) — es el identificador y la contraseña a la vez. Soporte Técnico conserva su acceso especial (usuario/contraseña fijos) detrás de un enlace "Acceso Soporte Técnico" en la pantalla de inicio.
- **Conclusiones abiertas:** "Observaciones y sugerencias" y "Compromisos" del Formulario 2 dejaron de evaluarse con Inicio/Proceso/Logrado — ahora son campos de texto libre, tal como corresponde a comentarios cualitativos.
- **Conteos de Inicio / Proceso / Logrado:** cada reporte (individual y consolidado) de Formulario 2 muestra cuántos criterios quedaron en cada estado, no solo el % logrado. El consolidado de Dirección y Subdirección incluye un filtro por área para ver estos conteos de un área específica.
- **Pendientes con nombre y apellido:** los reportes consolidados y el panel principal ya no solo muestran "cuántos faltan" — listan explícitamente **quién** falta por evaluar.
- **Nueva pestaña "Supervisión" (Dirección):** permite ver, filtrando por área, si cada coordinador ya evaluó a cada uno de sus docentes (Formulario 1 y 2, con fecha), abrir directamente el reporte que hizo ese coordinador, y ver los totales de Inicio/Proceso/Logrado agregados por área. Así la Directora puede verificar el trabajo de los coordinadores sin depender de que ellos le reporten manualmente.
- **PDF de reportes corregido (base técnica):** se solucionaron dos causas raíz que hacían fallar la descarga: (1) el logo/avatar por defecto se cargaban como archivos locales, lo cual "mancha" el `<canvas>` al abrir el sistema con doble clic — ahora van incrustados directamente en el código; (2) el reporte se capturaba dentro de una ventana con scroll, cortando el contenido — ahora se captura en un lienzo completo, incluyendo los gráficos.
- **Nueva insignia institucional:** se rediseñó el logo por defecto como un escudo/emblema (laureles, libro abierto, estrella, nombre de la institución) en la paleta guinda y dorado, en vez del cuadro con "SB". Sigue siendo 100% reemplazable desde Soporte Técnico → Institución.
- **Filtros agrupados:** en el Directorio (Dirección) y en Formulario 1 / Formulario 2, la Directora puede filtrar por Subdirección, Coordinadores, Docentes o Administrativos, y la Subdirectora por Coordinadores o Docentes. Al filtrar por Docentes aparece además un selector de área. El Directorio incluye un buscador por nombre, cargo o área.
- **Reportes filtrables por formulario:** la pestaña Reportes tiene chips para ver Todos, solo Formulario 1 o solo Formulario 2.
- **Corrección de asignación docente ↔ coordinador:** se recalculó el área de cada docente a partir del Excel oficial (`area_codigo`), corrigiendo casos donde la coincidencia de texto libre fallaba (p. ej. "ED. RELIGIOSA" no se reconocía como Religión) o quedaban áreas sin coordinador asignado. La Directora sigue evaluando a todo el personal en general.

## 🎨 Diseño

- Tarjetas curvas (bordes muy redondeados), superficies translúcidas con efecto de vidrio (blur).
- Tipografía **Inter** — moderna, limpia y muy legible.
- **Modo claro** (blanco/gris suave) y **modo oscuro** (negro real, no azul), con botón de cambio en el encabezado.
- Color guinda (#800020) como identidad en botones, gráficos y acentos.

## 🔐 Acceso al sistema

**Solo tienen cuenta de acceso:** Dirección, Subdirección, Coordinadores y Soporte Técnico.
Los docentes y personal administrativo **no inician sesión**; solo aparecen como personal evaluable.

**Acceso:** se ingresa únicamente el **DNI** — funciona como usuario y contraseña a la vez. No se pide ningún nombre de usuario.

| Rol | DNI de acceso |
|---|---|
| Directora (Vilma Tipián Levano) | `21814585` |
| Subdirectora (Mirian Ramón Bautista) | `42506694` |
| Coord. CC.SS / DPCC / Religión (Gabriel Napa Mesías) | `21850467` |
| Coord. Ciencia y Tecnología (Flor Pasache Medina) | `21835201` |
| Coord. Matemática / Ed. Física (Luis Ramos Quispe) | `21868710` |
| Coord. Tutoría / Convivencia (José Tasayco Tasayco) | `40793925` |
| Coord. Comunicación / Arte / Inglés (Benigna Yllescas Ríos) | `21461393` |

**Soporte Técnico** ingresa aparte, con el enlace "Acceso Soporte Técnico" en la pantalla de inicio:
Usuario `Soporte` · Contraseña `soporte123`.

> Soporte Técnico puede restablecer el DNI de acceso de cualquier usuario, y activar/desactivar cuentas, desde la pestaña **Cuentas**.

## 👥 ¿Quién evalúa a quién?

- **Directora** → evalúa a todo el personal (Subdirección, Coordinadores, Docentes, Administrativos).

- **Subdirectora** → evalúa únicamente a los Coordinadores.
- **Cada Coordinador** → evalúa únicamente a los docentes de su área asignada (no ve ni se mezcla con las demás áreas).

## 📝 Formularios de evaluación (Word / Excel)

Desde el panel de **Soporte Técnico → Formularios**, se puede subir un archivo **Word (.docx)** o **Excel (.xlsx / .csv)** y asignarlo a un área específica (por ejemplo, "Coordinador Matemática"):

- El sistema **lee el archivo automáticamente**: cada línea del Word, o cada fila del Excel, se convierte en un criterio de evaluación.
- Si el Excel tiene una segunda columna con el puntaje máximo, se respeta; si no, se reparte equitativamente hasta sumar 100 puntos.
- El formulario queda disponible **solo** para el coordinador de esa área — no se mezcla con otras coordinaciones.
- Si no se sube un formulario personalizado, se usa el formulario predeterminado de 5 criterios (100 puntos).

## 📊 Reportes

Al terminar de evaluar, Dirección, Subdirección y cada Coordinador pueden generar, desde la pestaña **Reportes**:

- **Reporte individual**: puntaje por criterio, calificación (Excelente / Bueno / Regular / Deficiente), gráfico y observaciones.
- **Reporte consolidado**: tabla y promedio de todo el personal evaluado por ese usuario.
- Botón **Descargar PDF** con diseño institucional listo para imprimir o compartir.

## 📈 Panel / Dashboard

- Tarjetas de resumen (personal a cargo, evaluados, pendientes, promedio).
- Gráficos por área (evaluados vs. pendientes) y distribución del personal — visibles para Dirección.
- Alertas cuando quedan evaluaciones pendientes.

## 🚀 Instalación y uso

1. Descomprime el archivo `.zip`.
2. Abre `index.html` en tu navegador (Chrome, Edge, Firefox o Safari).
3. Necesitas conexión a internet la primera vez que se carga (para tipografías, íconos y las librerías que leen Word/Excel y generan PDF). Una vez cargada la página, el uso diario funciona con normalidad.
4. Inicia sesión con las credenciales de la tabla de arriba.

No requiere servidor ni instalación adicional.

## 📋 Estructura del proyecto

```
sistema_institucional/
├── index.html              # Página principal (con datos embebidos)
├── css/
│   └── estilos.css         # Estilos (diseño Apple, claro/oscuro)
├── js/
│   └── app.js              # Lógica completa del sistema
├── data/
│   ├── personal.json       # Base de datos de personal (editable)
│   ├── config.json         # Configuración: colores, áreas, criterios
│   └── evaluaciones.json   # Plantilla vacía de referencia
└── assets/
    └── images/
        ├── default-logo.svg
        ├── default-avatar.svg
        └── insignia/
            └── LEEME.txt    # Cómo poner tu propia insignia (foto1.png / .jpg / .svg)
```

> ⚠️ Importante: el sistema lee los datos de personal desde el bloque `<script id="personal-data-script">` **dentro de `index.html`**, no desde `data/personal.json` directamente (los navegadores no permiten leer archivos locales por seguridad). Los archivos en `data/` son una copia de referencia para edición: si los modificas, debes volver a pegar su contenido dentro de `index.html` en los bloques `personal-data-script` / `config-data-script`.

## 💾 Almacenamiento de datos

El sistema usa `localStorage` del navegador para guardar: evaluaciones realizadas, fotos de perfil, formularios subidos, cambios de contraseña y el logo institucional. Estos datos viven en el navegador donde se usan — si se abre el sistema en otra computadora, no se comparten automáticamente. Para un uso en producción con varios dispositivos se recomienda un backend real.

## 🔧 Personalización

- **Logo y nombre institucional:** desde Soporte Técnico → Institución (sin tocar código).
- **Colores:** editar las variables `--guinda`, `--guinda-600`, etc. en `css/estilos.css`.
- **Áreas de cada coordinador:** editar `coordination_areas` en `config.json` / en el bloque embebido de `index.html`. Los valores deben ser códigos canónicos (`CCSS`, `DPCC`, `RELIGION`, `CYT`, `EPT`, `MATEMATICA`, `ED_FISICA`, `COMUNICACION`, `ARTE`, `INGLES`, `TUTORIA`, `CONVIVENCIA`, `PSICOLOGIA`), no el texto libre del Excel. Cada docente en `personal.json` trae su propio `area_codigo` ya calculado; si agregas un docente nuevo, asígnale el código correspondiente.
- **Criterios de evaluación por defecto:** editar `criterios_default` en `config.json`.

## 🔒 Seguridad — notas para producción

Este sistema es una demostración estática (sin backend): las contraseñas se guardan en texto plano dentro del propio HTML/localStorage. Para un entorno de producción real se recomienda:
- Backend con base de datos (MySQL/PostgreSQL) y autenticación segura (hash de contraseñas, JWT).
- HTTPS obligatorio.
- Backups periódicos de las evaluaciones.

---

**I.E. JEC "Simón Bolívar" — 2026**
